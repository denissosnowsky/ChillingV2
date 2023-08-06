// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {ChillingStruct} from "./ChillingStruct.sol";

/**
 * @title A contract for social media named Chilling
 * @author Den Sosnovskyi
 * @notice This contract makes possible to register user and create posts on-chain.
 * Chat is implemented off-chain. Main idea it to create uncensored posts from accounts.
 * @dev IPFS is used for storing images
 * All array getters return data witn pagination.
 */
contract Chilling is ChillingStruct {
    error Chilling__CommentIsEmpty();
    error Chilling__TransferFailed();
    error Chilling__PostTextIsEmpty();
    error Chilling__PostIsNotLiked();
    error Chilling__UserAlreadyExist();
    error Chilling__AlreadyFollowing();
    error Chilling__PostAlreadyLiked();
    error Chilling__PostIsNotDisliked();
    error Chilling__PostAlreadyDisliked();
    error Chilling__AlreadyNotFollowing();
    error Chilling__SenderIsNotSignedUp();
    error Chilling__UserNameIsNotDefined();
    error Chilling__ReceiverIsNotSignedUp();
    error Chilling__PostDoesNotExists();
    error Chilling__PostChangeFailed(string text, string image);
    error Chilling__PostCreationFailed(string text, string image);

    uint256 private s_accountsCount;

    mapping(address => UserAccount) private s_addressToAccount;
    mapping(address => Post[]) private s_addressToPosts;

    event PostLiked();
    event PostDisliked();
    event CommentCreated();
    event PostLikeCancelled();
    event PostDislikeCancelled();
    event UserSignedUp(address indexed user);
    event PostChanged(string indexed text, string indexed image);
    event PostCreated(string indexed text, string indexed image);
    event UserChangedName(address indexed user, string indexed name);
    event UserChangedImage(address indexed user, string indexed image);
    event StartedToFollow(address indexed sender, address indexed receiver);
    event StoppedToFollow(address indexed sender, address indexed receiver);
    event TransferMade(address indexed from, address indexed to, uint256 value);
    event UserChangedDescription(
        address indexed user,
        string indexed description
    );

    modifier onlySignedUpSender() {
        if (s_addressToAccount[msg.sender].accountAddress == address(0)) {
            revert Chilling__SenderIsNotSignedUp();
        }
        _;
    }

    modifier onlySignedUpReceiver(address receiver) {
        if (s_addressToAccount[receiver].accountAddress == address(0)) {
            revert Chilling__ReceiverIsNotSignedUp();
        }
        _;
    }

    constructor() {
        s_accountsCount = 0;
    }

    function signUp(
        string memory _name,
        string memory _description,
        string memory _image
    ) external {
        if (s_addressToAccount[msg.sender].accountAddress != address(0)) {
            revert Chilling__UserAlreadyExist();
        }

        if (bytes(_name).length == 0) {
            revert Chilling__UserNameIsNotDefined();
        }

        UserAccount storage newAccount = s_addressToAccount[msg.sender];
        newAccount.postsCount = 0;
        newAccount.followersCount = 0;
        newAccount.followingsCount = 0;
        newAccount.accountAddress = msg.sender;
        newAccount.name = _name;
        newAccount.description = _description;
        newAccount.image = _image;

        s_accountsCount++;

        emit UserSignedUp(msg.sender);
    }

    function changeName(string memory _name) external onlySignedUpSender {
        s_addressToAccount[msg.sender].name = _name;

        emit UserChangedName(msg.sender, _name);
    }

    function changeDescription(
        string memory _description
    ) external onlySignedUpSender {
        s_addressToAccount[msg.sender].description = _description;

        emit UserChangedDescription(msg.sender, _description);
    }

    function changeImage(string memory _image) external onlySignedUpSender {
        s_addressToAccount[msg.sender].image = _image;

        emit UserChangedImage(msg.sender, _image);
    }

    function makeTransfer(
        address _to
    ) external payable onlySignedUpSender onlySignedUpReceiver(_to) {
        (bool success, ) = payable(_to).call{value: msg.value}("");

        if (!success) {
            revert Chilling__TransferFailed();
        }

        emit TransferMade(msg.sender, _to, msg.value);
    }

    function follow(
        address _to
    ) external onlySignedUpSender onlySignedUpReceiver(_to) {
        UserAccount storage sender = s_addressToAccount[msg.sender];
        UserAccount storage to = s_addressToAccount[_to];

        if (sender.followingsMap[_to] > 0) {
            revert Chilling__AlreadyFollowing();
        }

        sender.followingsCount++;
        sender.followingsArray.push(_to);
        /// we use length, not length-1, so that 0 index was indicating not existant address is the map
        sender.followingsMap[_to] = sender.followingsArray.length;

        to.followersCount++;
        to.followersArray.push(msg.sender);
        to.followersMap[msg.sender] = to.followersArray.length;

        emit StartedToFollow(msg.sender, _to);
    }

    function unfollow(
        address _to
    ) external onlySignedUpSender onlySignedUpReceiver(_to) {
        UserAccount storage sender = s_addressToAccount[msg.sender];
        UserAccount storage to = s_addressToAccount[_to];

        if (sender.followingsMap[_to] == 0) {
            revert Chilling__AlreadyNotFollowing();
        }

        uint256 indexOfFollowingToUnfollow = sender.followingsMap[_to] - 1;
        address lastFollowing = sender.followingsArray[
            sender.followingsArray.length - 1
        ];
        sender.followingsArray[indexOfFollowingToUnfollow] = lastFollowing;
        sender.followingsMap[lastFollowing] = indexOfFollowingToUnfollow + 1;
        sender.followingsMap[_to] = 0;
        sender.followingsCount--;
        sender.followingsArray.pop();

        uint256 indexOfFollowerToUnfollow = to.followersMap[msg.sender] - 1;
        address lastFollower = to.followersArray[to.followersArray.length - 1];
        to.followersArray[indexOfFollowerToUnfollow] = lastFollower;
        to.followersMap[lastFollower] = indexOfFollowerToUnfollow + 1;
        to.followersMap[msg.sender] = 0;
        to.followersCount--;
        to.followersArray.pop();

        emit StoppedToFollow(msg.sender, _to);
    }

    function createPost(
        string memory _text,
        string memory _image
    ) external onlySignedUpSender {
        if (bytes(_text).length == 0 && bytes(_image).length == 0) {
            revert Chilling__PostCreationFailed(_text, _image);
        }

        Post[] storage posts = s_addressToPosts[msg.sender];

        uint256 postsLength = posts.length;

        posts.push();
        posts[postsLength].index = postsLength;
        posts[postsLength].timestamp = block.timestamp;
        posts[postsLength].likesCount = 0;
        posts[postsLength].dislikesCount = 0;
        posts[postsLength].commentsCount = 0;
        posts[postsLength].image = _image;
        posts[postsLength].text = _text;
        posts[postsLength].author = msg.sender;

        s_addressToAccount[msg.sender].postsCount++;

        emit PostCreated(_text, _image);
    }

    function changePost(
        string memory _text,
        string memory _image,
        uint256 _index
    ) external onlySignedUpSender {
        uint256 textLength = bytes(_text).length;
        uint256 imageLength = bytes(_image).length;

        if (textLength == 0 && imageLength == 0) {
            revert Chilling__PostChangeFailed(_text, _image);
        }

        Post[] storage posts = s_addressToPosts[msg.sender];

        if (posts.length <= _index) {
            revert Chilling__PostDoesNotExists();
        }

        Post storage post = posts[_index];

        if (textLength != 0) {
            post.text = _text;
        }

        if (imageLength != 0) {
            post.image = _image;
        }

        emit PostChanged(_text, _image);
    }

    function likePost(
        address _author,
        uint256 _index
    ) external onlySignedUpSender onlySignedUpReceiver(_author) {
        Post[] storage posts = s_addressToPosts[_author];

        if (posts.length <= _index) {
            revert Chilling__PostDoesNotExists();
        }

        Post storage post = posts[_index];

        if (post.likesAddressesMap[msg.sender] > 0) {
            revert Chilling__PostAlreadyLiked();
        }

        post.likesCount++;
        post.likesAddressesArray.push(msg.sender);
        post.likesAddressesMap[msg.sender] = post.likesAddressesArray.length;

        if (post.dislikesAddressesMap[msg.sender] > 0) {
            cancelPostDislike(_author, _index);
        }

        emit PostLiked();
    }

    function dislikePost(
        address _author,
        uint256 _index
    ) external onlySignedUpSender onlySignedUpReceiver(_author) {
        Post[] storage posts = s_addressToPosts[_author];

        if (posts.length <= _index) {
            revert Chilling__PostDoesNotExists();
        }

        Post storage post = posts[_index];

        if (post.dislikesAddressesMap[msg.sender] > 0) {
            revert Chilling__PostAlreadyDisliked();
        }

        post.dislikesCount++;
        post.dislikesAddressesArray.push(msg.sender);
        post.dislikesAddressesMap[msg.sender] = post
            .dislikesAddressesArray
            .length;

        if (post.likesAddressesMap[msg.sender] > 0) {
            cancelPostLike(_author, _index);
        }

        emit PostDisliked();
    }

    function cancelPostLike(
        address _author,
        uint256 _index
    ) public onlySignedUpSender onlySignedUpReceiver(_author) {
        Post[] storage posts = s_addressToPosts[_author];

        if (posts.length <= _index) {
            revert Chilling__PostDoesNotExists();
        }

        Post storage post = posts[_index];

        if (post.likesAddressesMap[msg.sender] == 0) {
            revert Chilling__PostIsNotLiked();
        }

        uint256 indexOfSenderAddressInLikes = post.likesAddressesMap[
            msg.sender
        ] - 1;
        address lastLiker = post.likesAddressesArray[
            post.likesAddressesArray.length - 1
        ];
        post.likesAddressesArray[indexOfSenderAddressInLikes] = lastLiker;
        post.likesAddressesMap[lastLiker] = indexOfSenderAddressInLikes + 1;
        post.likesAddressesMap[msg.sender] = 0;
        post.likesCount--;
        post.likesAddressesArray.pop();

        emit PostLikeCancelled();
    }

    function cancelPostDislike(
        address _author,
        uint256 _index
    ) public onlySignedUpSender onlySignedUpReceiver(_author) {
        Post[] storage posts = s_addressToPosts[_author];

        if (posts.length <= _index) {
            revert Chilling__PostDoesNotExists();
        }

        Post storage post = posts[_index];

        if (post.dislikesAddressesMap[msg.sender] == 0) {
            revert Chilling__PostIsNotDisliked();
        }

        uint256 indexOfSenderAddressInDislikes = post.dislikesAddressesMap[
            msg.sender
        ] - 1;
        address lastDisliker = post.dislikesAddressesArray[
            post.dislikesAddressesArray.length - 1
        ];
        post.dislikesAddressesArray[
            indexOfSenderAddressInDislikes
        ] = lastDisliker;
        post.dislikesAddressesMap[lastDisliker] =
            indexOfSenderAddressInDislikes +
            1;
        post.dislikesAddressesMap[msg.sender] = 0;
        post.dislikesCount--;
        post.dislikesAddressesArray.pop();

        emit PostDislikeCancelled();
    }

    function createComment(
        string memory _text,
        address _author,
        uint256 _index
    ) external onlySignedUpSender onlySignedUpReceiver(_author) {
        if (bytes(_text).length == 0) {
            revert Chilling__CommentIsEmpty();
        }

        Post[] storage posts = s_addressToPosts[_author];

        if (posts.length <= _index) {
            revert Chilling__PostDoesNotExists();
        }

        UserAccount storage user = s_addressToAccount[msg.sender];

        posts[_index].comments.push(
            Comment({
                text: _text,
                author: msg.sender,
                name: user.name,
                image: user.image
            })
        );
        posts[_index].commentsCount++;

        emit CommentCreated();
    }

    /// view getters

    function getAccountsCount() external view returns (uint256) {
        return s_accountsCount;
    }

    function getAccountInfo(
        address _account
    )
        external
        view
        onlySignedUpSender
        onlySignedUpReceiver(_account)
        returns (UserAccountWithoutMappings memory)
    {
        UserAccount storage user = s_addressToAccount[_account];
        UserAccount storage sender = s_addressToAccount[msg.sender];

        return
            UserAccountWithoutMappings({
                postsCount: user.postsCount,
                followersCount: user.followersCount,
                followingsCount: user.followingsCount,
                accountAddress: user.accountAddress,
                name: user.name,
                description: user.description,
                image: user.image,
                isSenderFollowing: sender.followingsMap[_account] > 0,
                isSenderFollower: sender.followersMap[_account] > 0
            });
    }

    function getAccountPosts(
        address _account,
        uint256 _cursor,
        uint256 _limit
    )
        external
        view
        onlySignedUpSender
        onlySignedUpReceiver(_account)
        returns (PostWithoutMappings[] memory posts, bool hasMore)
    {
        PostWithoutMappings[] memory postsToReturn;

        uint256 count = 0;
        uint256 postsLength = s_addressToPosts[_account].length;
        int256 startIndex = int256(postsLength) - 1 - int256(_cursor);
        int256 endIndex = startIndex - int256(_limit) + 1;
        uint256 loopLimit;

        if (startIndex < 0) {
            return (new PostWithoutMappings[](0), false);
        }

        if (endIndex < 0) {
            loopLimit = 0;
            postsToReturn = new PostWithoutMappings[](
                uint256(endIndex + int256(_limit))
            );
        } else {
            loopLimit = uint256(endIndex);
            postsToReturn = new PostWithoutMappings[](_limit);
        }

        for (int256 i = startIndex; i >= int256(loopLimit); i--) {
            Post storage post = s_addressToPosts[_account][uint256(i)];

            postsToReturn[count].index = post.index;
            postsToReturn[count].timestamp = post.timestamp;
            postsToReturn[count].likesCount = post.likesCount;
            postsToReturn[count].dislikesCount = post.dislikesCount;
            postsToReturn[count].commentsCount = post.commentsCount;
            postsToReturn[count].author = post.author;
            postsToReturn[count].image = post.image;
            postsToReturn[count].text = post.text;
            postsToReturn[count].isLikedBySender =
                post.likesAddressesMap[msg.sender] > 0;
            postsToReturn[count].isDislikedBySender =
                post.dislikesAddressesMap[msg.sender] > 0;

            count++;
        }

        return (postsToReturn, endIndex <= 0 ? false : true);
    }

    function getFollowers(
        address _account,
        uint256 _cursor,
        uint256 _limit
    )
        external
        view
        onlySignedUpSender
        onlySignedUpReceiver(_account)
        returns (UserAccountShort[] memory users, bool hasMore)
    {
        UserAccount storage account = s_addressToAccount[_account];
        uint256 followersLength = account.followersCount;
        address[] memory followersArray = account.followersArray;

        return
            getAccountsWithPagination(
                _cursor,
                _limit,
                followersLength,
                followersArray
            );
    }

    function getFollowing(
        address _account,
        uint256 _cursor,
        uint256 _limit
    )
        external
        view
        onlySignedUpSender
        onlySignedUpReceiver(_account)
        returns (UserAccountShort[] memory users, bool hasMore)
    {
        UserAccount storage account = s_addressToAccount[_account];
        uint256 followingsLength = account.followingsCount;
        address[] memory followingsArray = account.followingsArray;

        return
            getAccountsWithPagination(
                _cursor,
                _limit,
                followingsLength,
                followingsArray
            );
    }

    function getPostLikers(
        address _account,
        uint256 _index,
        uint256 _cursor,
        uint256 _limit
    )
        external
        view
        onlySignedUpSender
        onlySignedUpReceiver(_account)
        returns (UserAccountShort[] memory users, bool hasMore)
    {
        Post storage post = s_addressToPosts[_account][_index];
        uint256 likersLength = post.likesCount;
        address[] memory likesAddressesArray = post.likesAddressesArray;

        return
            getAccountsWithPagination(
                _cursor,
                _limit,
                likersLength,
                likesAddressesArray
            );
    }

    function getPostDislikers(
        address _account,
        uint256 _index,
        uint256 _cursor,
        uint256 _limit
    )
        external
        view
        onlySignedUpSender
        onlySignedUpReceiver(_account)
        returns (UserAccountShort[] memory users, bool hasMore)
    {
        Post storage post = s_addressToPosts[_account][_index];
        uint256 dislikersLength = post.dislikesCount;
        address[] memory dislikesAddressesArray = post.dislikesAddressesArray;

        return
            getAccountsWithPagination(
                _cursor,
                _limit,
                dislikersLength,
                dislikesAddressesArray
            );
    }

    function getAccountsWithPagination(
        uint256 _cursor,
        uint256 _limit,
        uint256 _accountsLength,
        address[] memory _addressesArrayToLoop
    ) internal view returns (UserAccountShort[] memory, bool hasMore) {
        UserAccountShort[] memory accountsToReturn;
        UserAccount storage sender = s_addressToAccount[msg.sender];

        uint256 count = 0;
        int256 startIndex = int256(_accountsLength) - 1 - int256(_cursor);
        int256 endIndex = startIndex - int256(_limit) + 1;
        uint256 loopLimit;

        if (startIndex < 0) {
            return (new UserAccountShort[](0), false);
        }

        if (endIndex < 0) {
            loopLimit = 0;
            accountsToReturn = new UserAccountShort[](
                uint256(endIndex + int256(_limit))
            );
        } else {
            loopLimit = uint256(endIndex);
            accountsToReturn = new UserAccountShort[](_limit);
        }

        for (int256 i = startIndex; i >= int256(loopLimit); i--) {
            address currentAccountAddress = _addressesArrayToLoop[uint256(i)];
            UserAccount storage currentAcount = s_addressToAccount[
                currentAccountAddress
            ];

            accountsToReturn[count].name = currentAcount.name;
            accountsToReturn[count].image = currentAcount.image;
            accountsToReturn[count].accountAddress = currentAcount
                .accountAddress;
            accountsToReturn[count].isSenderFollowing =
                sender.followingsMap[currentAccountAddress] > 0;
            accountsToReturn[count].isSenderFollower =
                sender.followersMap[currentAccountAddress] > 0;

            count++;
        }

        return (accountsToReturn, endIndex <= 0 ? false : true);
    }

    function getPostComments(
        address _user,
        uint256 _index
    )
        public
        view
        onlySignedUpSender
        onlySignedUpReceiver(_user)
        returns (Comment[] memory comments)
    {
        return s_addressToPosts[_user][_index].comments;
    }

    /// used for testing only

    function getAccountFollowingsArray()
        public
        view
        returns (address[] memory)
    {
        return s_addressToAccount[msg.sender].followingsArray;
    }

    function getAccountFollowingsMap(
        address _following
    ) public view returns (uint256) {
        return s_addressToAccount[msg.sender].followingsMap[_following];
    }

    function getAccountFollowersArray() public view returns (address[] memory) {
        return s_addressToAccount[msg.sender].followersArray;
    }

    function getAccountFollowersMap(
        address _follower
    ) public view returns (uint256) {
        return s_addressToAccount[msg.sender].followersMap[_follower];
    }

    function getPostLikesAddressesArray(
        uint256 _index
    ) public view returns (address[] memory) {
        return s_addressToPosts[msg.sender][_index].likesAddressesArray;
    }

    function getPostLikesAddressesMap(
        uint256 _index,
        address _liker
    ) public view returns (uint256) {
        return s_addressToPosts[msg.sender][_index].likesAddressesMap[_liker];
    }

    function getPostDislikesAddressesArray(
        uint256 _index
    ) public view returns (address[] memory) {
        return s_addressToPosts[msg.sender][_index].dislikesAddressesArray;
    }

    function getPostDislikesAddressesMap(
        uint256 _index,
        address _disliker
    ) public view returns (uint256) {
        return
            s_addressToPosts[msg.sender][_index].dislikesAddressesMap[
                _disliker
            ];
    }

    function getUserPostsLength(address _user) public view returns (uint256) {
        return s_addressToPosts[_user].length;
    }
}
