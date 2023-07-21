// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

/**
 * @title A contract for social media named Chilling
 * @author Den Sosnovskyi
 * @notice This contract makes possible to register user and create posts on-chain.
 * Chat is implemented off-chain. Main idea it to create uncensored posts from accounts.
 * @dev IPFS is used for storing images
 * All array getters return data witn pagination.
 */
contract Chilling {
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
    error Chilling__PostChangeFailed(string text, string image);
    error Chilling__PostCreationFailed(string text, string image);

    /// @dev mappings maps address to its index in the appropriate array
    struct Post {
        uint256 index;
        uint256 timestamp;
        uint256 likesCount;
        uint256 dislikesCount;
        address author;
        string image;
        string text;
        string[] comments;
        mapping(address => uint256) likesAddressesMap;
        mapping(address => uint256) dislikesAddressesMap;
        address[] likesAddressesArray;
        address[] dislikesAddressesArray;
    }

    /// @dev mappings maps address to its index in the appropriate array
    struct Account {
        uint256 postsCount;
        uint256 followersCount;
        uint256 followingCount;
        address accountAddress;
        string name;
        string description;
        string image;
        mapping(address => uint256) followersMap;
        mapping(address => uint256) followingMap;
        address[] followersArray;
        address[] followingArray;
    }

    /// used for getters return type
    struct PostWithoutMappings {
        uint256 index;
        uint256 timestamp;
        uint256 likesCount;
        uint256 dislikesCount;
        address author;
        string image;
        string text;
        bool isLikedBySender;
        bool isDislikedBySender;
    }

    /// used for getters return type
    struct AccountWithoutMappings {
        uint256 postsCount;
        uint256 followersCount;
        uint256 followingCount;
        address accountAddress;
        string name;
        string description;
        string image;
        bool isSenderFollowing;
        bool isSenderFollower;
    }

    /// used for getters return type
    struct AccoutnShort {
        string name;
        string image;
        address accountAddress;
        bool isSenderFollowing;
        bool isSenderFollower;
    }

    uint256 private s_accountsCount;

    mapping(address => Account) private s_addressToAccount;
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

        Account storage newAccount = s_addressToAccount[msg.sender];
        newAccount.postsCount = 0;
        newAccount.followersCount = 0;
        newAccount.followingCount = 0;
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
        Account storage sender = s_addressToAccount[msg.sender];
        Account storage to = s_addressToAccount[_to];

        if (sender.followingMap[_to] > 0) {
            revert Chilling__AlreadyFollowing();
        }

        sender.followingCount++;
        sender.followingArray.push(_to);
        sender.followingMap[_to] = sender.followingArray.length;

        to.followersCount++;
        to.followersArray.push(msg.sender);
        to.followersMap[msg.sender] = to.followersArray.length;

        emit StartedToFollow(msg.sender, _to);
    }

    function unfollow(
        address _to
    ) external onlySignedUpSender onlySignedUpReceiver(_to) {
        Account storage sender = s_addressToAccount[msg.sender];
        Account storage to = s_addressToAccount[_to];

        if (sender.followingMap[_to] == 0) {
            revert Chilling__AlreadyNotFollowing();
        }

        if (sender.followingCount > 1) {
            uint256 indexOfFollowingToUnfollow = sender.followingMap[_to];
            address lastFollowing = sender.followingArray[
                sender.followingArray.length - 1
            ];
            sender.followingMap[_to] = 0;
            sender.followingArray[indexOfFollowingToUnfollow] = lastFollowing;
            sender.followingMap[lastFollowing] = indexOfFollowingToUnfollow;
        }
        sender.followingCount--;
        sender.followingArray.pop();

        if (to.followersCount > 1) {
            uint256 indexOfFollowerToUnfollow = to.followersMap[msg.sender];
            address lastFollower = to.followersArray[
                to.followersArray.length - 1
            ];
            to.followersMap[msg.sender] = 0;
            to.followersArray[indexOfFollowerToUnfollow] = lastFollower;
            to.followersMap[lastFollower] = indexOfFollowerToUnfollow;
        }
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

        Post storage post = s_addressToPosts[msg.sender][_index];

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
        Post storage post = s_addressToPosts[_author][_index];

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
        Post storage post = s_addressToPosts[_author][_index];

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
        Post storage post = s_addressToPosts[_author][_index];

        if (post.likesAddressesMap[msg.sender] == 0) {
            revert Chilling__PostIsNotLiked();
        }

        if (post.likesCount > 1) {
            uint256 indexOfSenderAddressInLikes = post.likesAddressesMap[
                msg.sender
            ];
            address lastLiker = post.likesAddressesArray[
                post.likesAddressesArray.length - 1
            ];
            post.likesAddressesMap[msg.sender] = 0;
            post.likesAddressesArray[indexOfSenderAddressInLikes] = lastLiker;
            post.likesAddressesMap[lastLiker] = indexOfSenderAddressInLikes;
        }
        post.likesCount--;
        post.likesAddressesArray.pop();

        emit PostLikeCancelled();
    }

    function cancelPostDislike(
        address _author,
        uint256 _index
    ) public onlySignedUpSender onlySignedUpReceiver(_author) {
        Post storage post = s_addressToPosts[_author][_index];

        if (post.dislikesAddressesMap[msg.sender] == 0) {
            revert Chilling__PostIsNotDisliked();
        }

        if (post.dislikesCount > 1) {
            uint256 indexOfSenderAddressInDislikes = post.dislikesAddressesMap[
                msg.sender
            ];
            address lastDisliker = post.dislikesAddressesArray[
                post.dislikesAddressesArray.length - 1
            ];
            post.dislikesAddressesMap[msg.sender] = 0;
            post.dislikesAddressesArray[
                indexOfSenderAddressInDislikes
            ] = lastDisliker;
            post.dislikesAddressesMap[
                lastDisliker
            ] = indexOfSenderAddressInDislikes;
        }
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

        s_addressToPosts[_author][_index].comments.push(_text);

        emit CommentCreated();
    }

    /// view getters

    function getAccountsCount() external view returns (uint256) {
        return s_accountsCount;
    }

    function getAccountInfo(
        address _account
    ) external view returns (AccountWithoutMappings memory) {
        Account storage user = s_addressToAccount[_account];
        Account storage sender = s_addressToAccount[msg.sender];

        return
            AccountWithoutMappings({
                postsCount: user.postsCount,
                followersCount: user.followersCount,
                followingCount: user.followingCount,
                accountAddress: user.accountAddress,
                name: user.name,
                description: user.description,
                image: user.image,
                isSenderFollowing: sender.followingMap[_account] > 0,
                isSenderFollower: sender.followersMap[_account] > 0
            });
    }

    function getAccountPosts(
        address _account,
        uint256 _cursor,
        uint256 _limit
    ) external view returns (PostWithoutMappings[] memory posts, bool hasMore) {
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
                uint256(endIndex) + _limit
            );
        } else {
            loopLimit = uint256(endIndex);
            postsToReturn = new PostWithoutMappings[](_limit);
        }

        for (uint256 i = uint256(startIndex); i >= loopLimit; i--) {
            Post storage post = s_addressToPosts[_account][i];

            postsToReturn[count].index = post.index;
            postsToReturn[count].timestamp = post.timestamp;
            postsToReturn[count].likesCount = post.likesCount;
            postsToReturn[count].dislikesCount = post.dislikesCount;
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
    ) external view returns (AccoutnShort[] memory, bool hasMore) {
        AccoutnShort[] memory accountsToReturn;
        Account storage sender = s_addressToAccount[msg.sender];

        uint256 count = 0;
        uint256 accountsLength = s_addressToAccount[_account].followersCount;
        int256 startIndex = int256(accountsLength) - 1 - int256(_cursor);
        int256 endIndex = startIndex - int256(_limit) + 1;
        uint256 loopLimit;

        if (startIndex < 0) {
            return (new AccoutnShort[](0), false);
        }

        if (endIndex < 0) {
            loopLimit = 0;
            accountsToReturn = new AccoutnShort[](uint256(endIndex) + _limit);
        } else {
            loopLimit = uint256(endIndex);
            accountsToReturn = new AccoutnShort[](_limit);
        }

        for (uint256 i = uint256(startIndex); i >= loopLimit; i--) {
            address currentAccountAddress = s_addressToAccount[_account]
                .followersArray[i];
            Account storage currentAcount = s_addressToAccount[
                currentAccountAddress
            ];

            accountsToReturn[count].name = currentAcount.name;
            accountsToReturn[count].image = currentAcount.image;
            accountsToReturn[count].accountAddress = currentAcount
                .accountAddress;
            accountsToReturn[count].isSenderFollowing =
                sender.followingMap[currentAccountAddress] > 0;
            accountsToReturn[count].isSenderFollower =
                sender.followersMap[currentAccountAddress] > 0;

            count++;
        }

        return (accountsToReturn, endIndex <= 0 ? false : true);
    }

    function getFollowing(
        address _account,
        uint256 _cursor,
        uint256 _limit
    ) external view returns (AccoutnShort[] memory, bool hasMore) {
        AccoutnShort[] memory accountsToReturn;
        Account storage sender = s_addressToAccount[msg.sender];

        uint256 count = 0;
        uint256 accountsLength = s_addressToAccount[_account].followingCount;
        int256 startIndex = int256(accountsLength) - 1 - int256(_cursor);
        int256 endIndex = startIndex - int256(_limit) + 1;
        uint256 loopLimit;

        if (startIndex < 0) {
            return (new AccoutnShort[](0), false);
        }

        if (endIndex < 0) {
            loopLimit = 0;
            accountsToReturn = new AccoutnShort[](uint256(endIndex) + _limit);
        } else {
            loopLimit = uint256(endIndex);
            accountsToReturn = new AccoutnShort[](_limit);
        }

        for (uint256 i = uint256(startIndex); i >= loopLimit; i--) {
            address currentAccountAddress = s_addressToAccount[_account]
                .followingArray[i];
            Account storage currentAcount = s_addressToAccount[
                currentAccountAddress
            ];

            accountsToReturn[count].name = currentAcount.name;
            accountsToReturn[count].image = currentAcount.image;
            accountsToReturn[count].accountAddress = currentAcount
                .accountAddress;
            accountsToReturn[count].isSenderFollowing =
                sender.followingMap[currentAccountAddress] > 0;
            accountsToReturn[count].isSenderFollower =
                sender.followersMap[currentAccountAddress] > 0;

            count++;
        }

        return (accountsToReturn, endIndex <= 0 ? false : true);
    }

    function getPostLikers(
        address _account,
        uint256 _index,
        uint256 _cursor,
        uint256 _limit
    ) external view returns (AccoutnShort[] memory, bool hasMore) {
        AccoutnShort[] memory accountsToReturn;
        Account storage sender = s_addressToAccount[msg.sender];

        uint256 count = 0;
        uint256 accountsLength = s_addressToPosts[_account][_index].likesCount;
        int256 startIndex = int256(accountsLength) - 1 - int256(_cursor);
        int256 endIndex = startIndex - int256(_limit) + 1;
        uint256 loopLimit;

        if (startIndex < 0) {
            return (new AccoutnShort[](0), false);
        }

        if (endIndex < 0) {
            loopLimit = 0;
            accountsToReturn = new AccoutnShort[](uint256(endIndex) + _limit);
        } else {
            loopLimit = uint256(endIndex);
            accountsToReturn = new AccoutnShort[](_limit);
        }

        for (uint256 i = uint256(startIndex); i >= loopLimit; i--) {
            address currentAccountAddress = s_addressToPosts[_account][_index]
                .likesAddressesArray[i];
            Account storage currentAcount = s_addressToAccount[
                currentAccountAddress
            ];

            accountsToReturn[count].name = currentAcount.name;
            accountsToReturn[count].image = currentAcount.image;
            accountsToReturn[count].accountAddress = currentAcount
                .accountAddress;
            accountsToReturn[count].isSenderFollowing =
                sender.followingMap[currentAccountAddress] > 0;
            accountsToReturn[count].isSenderFollower =
                sender.followersMap[currentAccountAddress] > 0;

            count++;
        }

        return (accountsToReturn, endIndex <= 0 ? false : true);
    }

    function getPostDislikers(
        address _account,
        uint256 _index,
        uint256 _cursor,
        uint256 _limit
    ) external view returns (AccoutnShort[] memory, bool hasMore) {
        AccoutnShort[] memory accountsToReturn;
        Account storage sender = s_addressToAccount[msg.sender];

        uint256 count = 0;
        uint256 accountsLength = s_addressToPosts[_account][_index]
            .dislikesCount;
        int256 startIndex = int256(accountsLength) - 1 - int256(_cursor);
        int256 endIndex = startIndex - int256(_limit) + 1;
        uint256 loopLimit;

        if (startIndex < 0) {
            return (new AccoutnShort[](0), false);
        }

        if (endIndex < 0) {
            loopLimit = 0;
            accountsToReturn = new AccoutnShort[](uint256(endIndex) + _limit);
        } else {
            loopLimit = uint256(endIndex);
            accountsToReturn = new AccoutnShort[](_limit);
        }

        for (uint256 i = uint256(startIndex); i >= loopLimit; i--) {
            address currentAccountAddress = s_addressToPosts[_account][_index]
                .dislikesAddressesArray[i];
            Account storage currentAcount = s_addressToAccount[
                currentAccountAddress
            ];

            accountsToReturn[count].name = currentAcount.name;
            accountsToReturn[count].image = currentAcount.image;
            accountsToReturn[count].accountAddress = currentAcount
                .accountAddress;
            accountsToReturn[count].isSenderFollowing =
                sender.followingMap[currentAccountAddress] > 0;
            accountsToReturn[count].isSenderFollower =
                sender.followersMap[currentAccountAddress] > 0;

            count++;
        }

        return (accountsToReturn, endIndex <= 0 ? false : true);
    }
}
