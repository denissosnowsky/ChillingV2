// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Test} from "forge-std/Test.sol";

import {Chilling} from "../src/Chilling.sol";
import {DeployChilling} from "../script/DeployChilling.s.sol";
import {ChillingStruct} from "../src/ChillingStruct.sol";

contract ChillingTest is Test, ChillingStruct {
    event PostLiked();
    event PostDisliked();
    event CommentCreated();
    event PostLikeCancelled();
    event PostDislikeCancelled();
    event UserChangedDescription(
        address indexed user,
        string indexed description
    );
    event UserSignedUp(address indexed user);
    event PostCreated(string indexed text, string indexed image);
    event PostChanged(string indexed text, string indexed image);
    event UserChangedName(address indexed user, string indexed name);
    event UserChangedImage(address indexed user, string indexed image);
    event StartedToFollow(address indexed sender, address indexed receiver);
    event StoppedToFollow(address indexed sender, address indexed receiver);
    event TransferMade(address indexed from, address indexed to, uint256 value);

    Chilling chilling;
    address USER = makeAddr("user");
    address RECEIVER = makeAddr("receiver");
    uint256 SEND_VALUE = 0.1 ether;
    uint256 STARTNIG_BALANCE = 10 ether;
    string USER_NAME = "NAME";
    string USER_DESCRIPTION = "DESCRIPTION";
    string USER_IMAGE = "IMAGE";

    modifier signedUpUser() {
        vm.prank(USER);
        chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);
        _;
    }

    modifier signedUpReceiver() {
        vm.prank(RECEIVER);
        chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);
        _;
    }

    function setUp() external {
        DeployChilling deployChilling = new DeployChilling();
        chilling = deployChilling.run();
        vm.deal(USER, STARTNIG_BALANCE);
        vm.deal(RECEIVER, STARTNIG_BALANCE);
    }

    /// Sign Up

    function testUserCanSignUpSuccessfully() public {
        vm.prank(USER);
        chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);

        vm.prank(USER);
        UserAccountWithoutMappings memory newUser = chilling.getAccountInfo(
            USER
        );

        assert(newUser.postsCount == 0);
        assert(newUser.followersCount == 0);
        assert(newUser.followingsCount == 0);
        assert(newUser.accountAddress == USER);
        assert(
            keccak256(abi.encodePacked(newUser.name)) ==
                keccak256(abi.encodePacked(USER_NAME))
        );
        assert(
            keccak256(abi.encodePacked(newUser.description)) ==
                keccak256(abi.encodePacked(USER_DESCRIPTION))
        );
        assert(
            keccak256(abi.encodePacked(newUser.image)) ==
                keccak256(abi.encodePacked(USER_IMAGE))
        );
        assert(newUser.isSenderFollowing == false);
        assert(newUser.isSenderFollower == false);
    }

    function testAccountsCountIncrementsAfterSignUp() public {
        assert(chilling.getAccountsCount() == 0);

        vm.prank(USER);
        chilling.signUp("name", "description", "image");

        assert(chilling.getAccountsCount() == 1);
    }

    function testEmitsEventAfterSignUp() public {
        vm.prank(USER);
        vm.expectEmit(true, false, false, false);
        emit UserSignedUp(USER);
        chilling.signUp("name", "description", "image");
    }

    function testRevertsSignUpWhenNameIsEmpty() public {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__UserNameIsNotDefined.selector);
        chilling.signUp("", "description", "image");
    }

    function testRevertsSignUpWhenUserAlreadyExists() public {
        vm.prank(USER);
        chilling.signUp("name1", "description1", "image1");

        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__UserAlreadyExist.selector);
        chilling.signUp("name2", "description2", "image2");
    }

    /// Change name

    function testRevertsWhenNotSignedUpUserChangesName() public {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.changeName("new name");
    }

    function testUserCanChangeName() public signedUpUser {
        vm.prank(USER);
        UserAccountWithoutMappings memory userInfoBeforeChange = chilling
            .getAccountInfo(USER);

        assert(
            keccak256(abi.encodePacked(userInfoBeforeChange.name)) ==
                keccak256(abi.encodePacked(USER_NAME))
        );

        string memory NEW_NAME = "new name";

        vm.prank(USER);
        chilling.changeName(NEW_NAME);

        vm.prank(USER);
        UserAccountWithoutMappings memory userInfoAfterChange = chilling
            .getAccountInfo(USER);

        assert(
            keccak256(abi.encodePacked(userInfoAfterChange.name)) ==
                keccak256(abi.encodePacked(NEW_NAME))
        );
    }

    function testEmitsWhenUserChangeName() public signedUpUser {
        string memory NEW_NAME = "new name";

        vm.prank(USER);
        vm.expectEmit(true, true, false, false);
        emit UserChangedName(USER, NEW_NAME);
        chilling.changeName(NEW_NAME);
    }

    /// Change description

    function testRevertsWhenNotSignedUpUserChangesDescription() public {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.changeDescription("new description");
    }

    function testUserCanChangeDescription() public signedUpUser {
        vm.prank(USER);
        UserAccountWithoutMappings memory userInfoBeforeChange = chilling
            .getAccountInfo(USER);

        assert(
            keccak256(abi.encodePacked(userInfoBeforeChange.description)) ==
                keccak256(abi.encodePacked(USER_DESCRIPTION))
        );

        string memory NEW_DESCRIPTION = "new description";

        vm.prank(USER);
        chilling.changeDescription(NEW_DESCRIPTION);

        vm.prank(USER);
        UserAccountWithoutMappings memory userInfoAfterChange = chilling
            .getAccountInfo(USER);

        assert(
            keccak256(abi.encodePacked(userInfoAfterChange.description)) ==
                keccak256(abi.encodePacked(NEW_DESCRIPTION))
        );
    }

    function testEmitsWhenUserChangeDescription() public signedUpUser {
        string memory NEW_DESCRIPTION = "new description";

        vm.prank(USER);
        vm.expectEmit(true, true, false, false);
        emit UserChangedDescription(USER, NEW_DESCRIPTION);
        chilling.changeDescription(NEW_DESCRIPTION);
    }

    /// Change image

    function testRevertsWhenNotSignedUpUserChangesImage() public {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.changeImage("new image");
    }

    function testUserCanChangeImage() public signedUpUser {
        vm.prank(USER);
        UserAccountWithoutMappings memory userInfoBeforeChange = chilling
            .getAccountInfo(USER);

        assert(
            keccak256(abi.encodePacked(userInfoBeforeChange.image)) ==
                keccak256(abi.encodePacked(USER_IMAGE))
        );

        string memory NEW_IMAGE = "new image";

        vm.prank(USER);
        chilling.changeImage(NEW_IMAGE);

        vm.prank(USER);
        UserAccountWithoutMappings memory userInfoAfterChange = chilling
            .getAccountInfo(USER);

        assert(
            keccak256(abi.encodePacked(userInfoAfterChange.image)) ==
                keccak256(abi.encodePacked(NEW_IMAGE))
        );
    }

    function testEmitsWhenUserChangeImage() public signedUpUser {
        string memory NEW_IMAGE = "new image";

        vm.prank(USER);
        vm.expectEmit(true, true, false, false);
        emit UserChangedImage(USER, NEW_IMAGE);
        chilling.changeImage(NEW_IMAGE);
    }

    /// Transfer

    function testUserCanTransferETHToAnotherUser()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 ETH_TO_TRANSFER = 0.01 ether;

        assert(USER.balance == STARTNIG_BALANCE);
        assert(RECEIVER.balance == STARTNIG_BALANCE);

        vm.prank(USER);
        chilling.makeTransfer{value: ETH_TO_TRANSFER}(RECEIVER);

        assert(USER.balance == STARTNIG_BALANCE - ETH_TO_TRANSFER);
        assert(RECEIVER.balance == STARTNIG_BALANCE + ETH_TO_TRANSFER);
    }

    function testRevertsWhenNotSignedUpUserMakeTransfer()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.makeTransfer{value: 0.01 ether}(RECEIVER);
    }

    function testRevertsWhenMakingTransferToNotSignedUpReceiver()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.makeTransfer{value: 0.01 ether}(RECEIVER);
    }

    function testEmitesAfterTransferMade()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 ETH_TO_TRANSFER = 0.01 ether;

        vm.prank(USER);
        vm.expectEmit(true, true, true, false);
        emit TransferMade(USER, RECEIVER, ETH_TO_TRANSFER);
        chilling.makeTransfer{value: ETH_TO_TRANSFER}(RECEIVER);
    }

    /// Follow

    function testRevertsWhenNotSignedUpSenderFollows() public signedUpReceiver {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.follow(RECEIVER);
    }

    function testRevertsWhenFollowingNotSignedUpReceiver() public signedUpUser {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.follow(RECEIVER);
    }

    function testRevertsWhenFollowingAlreadyFollowingUser()
        public
        signedUpReceiver
        signedUpUser
    {
        vm.prank(USER);
        chilling.follow(RECEIVER);

        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__AlreadyFollowing.selector);
        chilling.follow(RECEIVER);
    }

    function testEmitsWhenFollowingUser() public signedUpReceiver signedUpUser {
        vm.prank(USER);
        vm.expectEmit(true, true, false, false);
        emit StartedToFollow(USER, RECEIVER);
        chilling.follow(RECEIVER);
    }

    function testSenderShouldHaveUpdatedInfoAboutFollowingsAfterFollow()
        public
        signedUpReceiver
        signedUpUser
    {
        vm.prank(USER);
        chilling.follow(RECEIVER);

        vm.prank(USER);
        UserAccountWithoutMappings memory sender = chilling.getAccountInfo(
            USER
        );

        assert(sender.followingsCount == 1);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsArray()[0] == RECEIVER);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsMap(RECEIVER) == 1);
    }

    function testReceiverShouldHaveUpdatedInfoAboutFollowersAfterFollow()
        public
        signedUpReceiver
        signedUpUser
    {
        vm.prank(USER);
        chilling.follow(RECEIVER);

        vm.prank(USER);
        UserAccountWithoutMappings memory receiver = chilling.getAccountInfo(
            RECEIVER
        );

        assert(receiver.followersCount == 1);
        vm.prank(RECEIVER);
        assert(chilling.getAccountFollowersArray()[0] == USER);
        vm.prank(RECEIVER);
        assert(chilling.getAccountFollowersMap(USER) == 1);
    }

    /// Unfollow

    function testRevertsWhenNotSignedUpSenderUnfollows()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.unfollow(RECEIVER);
    }

    function testRevertsWhenUnfollowingNotSignedUpReceiver()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.unfollow(RECEIVER);
    }

    function testRevertsWhenUserUnfollowsAlreadyUnfollowedUser()
        public
        signedUpReceiver
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__AlreadyNotFollowing.selector);
        chilling.unfollow(RECEIVER);
    }

    function testEmitsWhenUnfollowingUser()
        public
        signedUpReceiver
        signedUpUser
    {
        vm.prank(USER);
        chilling.follow(RECEIVER);

        vm.prank(USER);
        vm.expectEmit(true, true, false, false);
        emit StoppedToFollow(USER, RECEIVER);
        chilling.unfollow(RECEIVER);
    }

    function testSenderShouldHaveUpdatedInfoAboutFollowingsAfterUnfollow_OneFollowings()
        public
        signedUpReceiver
        signedUpUser
    {
        // after follow
        vm.prank(USER);
        chilling.follow(RECEIVER);

        vm.prank(USER);
        UserAccountWithoutMappings memory senderAfterFollow = chilling
            .getAccountInfo(USER);
        assert(senderAfterFollow.followingsCount == 1);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsArray()[0] == RECEIVER);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsMap(RECEIVER) == 1);

        // after unfollow
        vm.prank(USER);
        chilling.unfollow(RECEIVER);

        vm.prank(USER);
        UserAccountWithoutMappings memory senderAfterUnfollow = chilling
            .getAccountInfo(USER);
        assert(senderAfterUnfollow.followingsCount == 0);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsMap(RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsArray().length == 0);
    }

    function testSenderShouldHaveUpdatedInfoAboutFollowingsAfterUnfollow_TwoFollowings()
        public
        signedUpReceiver
        signedUpUser
    {
        address THIRD_USER = makeAddr("third user");
        vm.deal(THIRD_USER, STARTNIG_BALANCE);
        vm.prank(THIRD_USER);
        chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);

        // after follow
        vm.prank(USER);
        chilling.follow(RECEIVER);

        vm.prank(USER);
        chilling.follow(THIRD_USER);

        vm.prank(USER);
        UserAccountWithoutMappings memory senderAfterFollow = chilling
            .getAccountInfo(USER);
        assert(senderAfterFollow.followingsCount == 2);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsArray()[0] == RECEIVER);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsArray()[1] == THIRD_USER);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsMap(RECEIVER) == 1);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsMap(THIRD_USER) == 2);

        // after unfollowing RECEIVER
        vm.prank(USER);
        chilling.unfollow(RECEIVER);

        vm.prank(USER);
        UserAccountWithoutMappings memory senderAfterUnfollowReceiver = chilling
            .getAccountInfo(USER);
        assert(senderAfterUnfollowReceiver.followingsCount == 1);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsMap(RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsMap(THIRD_USER) == 1);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsArray().length == 1);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsArray()[0] == THIRD_USER);

        // after unfollowing THIRD_USER
        vm.prank(USER);
        chilling.unfollow(THIRD_USER);

        vm.prank(USER);
        UserAccountWithoutMappings
            memory senderAfterUnfollowThirdUser = chilling.getAccountInfo(USER);
        assert(senderAfterUnfollowThirdUser.followingsCount == 0);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsMap(RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsMap(THIRD_USER) == 0);
        vm.prank(USER);
        assert(chilling.getAccountFollowingsArray().length == 0);
    }

    function testReceiverShouldHaveUpdatedInfoAboutFollowersAfterUnfollow()
        public
        signedUpReceiver
        signedUpUser
    {
        // after follow
        vm.prank(USER);
        chilling.follow(RECEIVER);

        vm.prank(USER);
        UserAccountWithoutMappings memory receiverAfterFollow = chilling
            .getAccountInfo(RECEIVER);

        assert(receiverAfterFollow.followersCount == 1);
        vm.prank(RECEIVER);
        assert(chilling.getAccountFollowersArray()[0] == USER);
        vm.prank(RECEIVER);
        assert(chilling.getAccountFollowersMap(USER) == 1);

        // after unfollow
        vm.prank(USER);
        chilling.unfollow(RECEIVER);

        vm.prank(USER);
        UserAccountWithoutMappings memory receiverAfterUnfollow = chilling
            .getAccountInfo(RECEIVER);

        assert(receiverAfterUnfollow.followersCount == 0);
        vm.prank(RECEIVER);
        assert(chilling.getAccountFollowersMap(USER) == 0);
        vm.prank(RECEIVER);
        assert(chilling.getAccountFollowersArray().length == 0);
    }

    /// Create post

    function testRevertsWhenNotSignedUpUserCreatesPost() public {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.createPost("text", "image");
    }

    function testRevertsWhenTextAndImageAreEmptyAfterPostCreation()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(
            abi.encodeWithSelector(
                Chilling.Chilling__PostCreationFailed.selector,
                "",
                ""
            )
        );
        chilling.createPost("", "");
    }

    function testEmitsWhenPostCreated() public signedUpUser {
        string memory POST_NAME = "POST_NAME";
        string memory POST_IMAGE = "POST_IMAGE";

        vm.prank(USER);
        vm.expectEmit(true, true, false, false);
        emit PostCreated(POST_NAME, POST_IMAGE);
        chilling.createPost(POST_NAME, POST_IMAGE);
    }

    function testNewPostShouldIncrementUserPostCount() public signedUpUser {
        vm.prank(USER);
        UserAccountWithoutMappings memory userBeforePostCreation = chilling
            .getAccountInfo(USER);
        assert(userBeforePostCreation.postsCount == 0);

        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(USER);
        UserAccountWithoutMappings memory userAfterPostCreation = chilling
            .getAccountInfo(USER);
        assert(userAfterPostCreation.postsCount == 1);
    }

    function testShouldSaveNewPostDataForAuthor() public signedUpUser {
        string memory POST_NAME = "POST_NAME";
        string memory POST_IMAGE = "POST_IMAGE";

        vm.prank(USER);
        chilling.createPost(POST_NAME, POST_IMAGE);

        vm.prank(USER);
        assert(chilling.getUserPostsLength(USER) == 1);

        vm.prank(USER);
        (PostWithoutMappings[] memory posts, ) = chilling.getAccountPosts(
            USER,
            0,
            10
        );
        assert(posts.length == 1);

        PostWithoutMappings memory post = posts[0];

        assert(post.index == 0);
        assert(post.timestamp == block.timestamp);
        assert(post.likesCount == 0);
        assert(post.dislikesCount == 0);
        assert(post.author == USER);
        assert(
            keccak256(abi.encodePacked(post.image)) ==
                keccak256(abi.encodePacked(POST_IMAGE))
        );
        assert(
            keccak256(abi.encodePacked(post.text)) ==
                keccak256(abi.encodePacked(POST_NAME))
        );
    }

    /// Chnage post

    function testRevertsWhenNotSignedUpUserChangesPost() public {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.changePost("text", "image", 0);
    }

    function testRevertsWhenTextAndImageAreEmptyAfterPostChange()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(
            abi.encodeWithSelector(
                Chilling.Chilling__PostChangeFailed.selector,
                "",
                ""
            )
        );
        chilling.changePost("", "", 0);
    }

    function testRecertsWhenPostIndexIsNotValid() public signedUpUser {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__PostDoesNotExists.selector);
        chilling.changePost("text", "image", 0);
    }

    function testEmitsWhenPostChanged() public signedUpUser {
        string memory POST_NAME = "POST_NAME";
        string memory POST_IMAGE = "POST_IMAGE";

        vm.prank(USER);
        chilling.createPost(POST_NAME, POST_IMAGE);

        vm.prank(USER);
        vm.expectEmit(true, true, false, false);
        emit PostChanged(POST_NAME, POST_IMAGE);
        chilling.changePost(POST_NAME, POST_IMAGE, 0);
    }

    function testShouldShowNewPostInfoAfterChanged() public signedUpUser {
        string memory POST_NAME = "POST_NAME";
        string memory POST_IMAGE = "POST_IMAGE";
        string memory NEW_POST_NAME = "NEW_POST_NAME";
        string memory NEW_POST_IMAGE = "NEW_POST_IMAGE";

        vm.prank(USER);
        chilling.createPost(POST_NAME, POST_IMAGE);

        vm.prank(USER);
        chilling.changePost(NEW_POST_NAME, NEW_POST_IMAGE, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory posts, ) = chilling.getAccountPosts(
            USER,
            0,
            1
        );

        PostWithoutMappings memory post = posts[0];

        assert(
            keccak256(abi.encodePacked(post.image)) ==
                keccak256(abi.encodePacked(NEW_POST_IMAGE))
        );
        assert(
            keccak256(abi.encodePacked(post.text)) ==
                keccak256(abi.encodePacked(NEW_POST_NAME))
        );
    }

    // Like post

    function testRevertsWhenNotSignedUpUserLikePost() public signedUpReceiver {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.likePost(RECEIVER, 0);
    }

    function testRevertsWhenUserLikePostOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.likePost(RECEIVER, 0);
    }

    function testRevertsWhenUserLikePostThatIsAlreadyLikedByThatUser()
        public
        signedUpReceiver
        signedUpUser
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        chilling.likePost(USER, 0);

        vm.prank(RECEIVER);
        vm.expectRevert(Chilling.Chilling__PostAlreadyLiked.selector);
        chilling.likePost(USER, 0);
    }

    function testRevertsWhenPostIndexIsNotValidWhileLikingPost()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__PostDoesNotExists.selector);
        chilling.likePost(USER, 0);
    }

    function testEmitsAfterLikingPost() public signedUpUser signedUpReceiver {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        vm.expectEmit(false, false, false, false);
        emit PostLiked();
        chilling.likePost(USER, 0);
    }

    function testPostShouldHaveLikedInfoAfterBeingLiked()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        chilling.likePost(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory posts, ) = chilling.getAccountPosts(
            USER,
            0,
            1
        );

        PostWithoutMappings memory post = posts[0];

        assert(post.likesCount == 1);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, RECEIVER) == 1);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0)[0] == RECEIVER);
    }

    function testPostShouldRemoveDislikeAfterLikingTheSamePost()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        // disliking

        vm.prank(RECEIVER);
        chilling.dislikePost(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterDislike, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings memory postAfterDislike = postsAfterDislike[0];

        assert(postAfterDislike.likesCount == 0);
        assert(postAfterDislike.dislikesCount == 1);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, RECEIVER) == 1);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0).length == 0);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0)[0] == RECEIVER);

        // liking

        vm.prank(RECEIVER);
        chilling.likePost(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterLike, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings memory postAfterLike = postsAfterLike[0];

        assert(postAfterLike.likesCount == 1);
        assert(postAfterLike.dislikesCount == 0);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, RECEIVER) == 1);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0)[0] == RECEIVER);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0).length == 0);
    }

    /// Dislike post

    function testRevertsWhenNotSignedUpUserDislikePost()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.dislikePost(RECEIVER, 0);
    }

    function testRevertsWhenUserDislikePostOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.dislikePost(RECEIVER, 0);
    }

    function testRevertsWhenUserDislikePostThatIsAlreadyDislikedByThatUser()
        public
        signedUpReceiver
        signedUpUser
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        chilling.dislikePost(USER, 0);

        vm.prank(RECEIVER);
        vm.expectRevert(Chilling.Chilling__PostAlreadyDisliked.selector);
        chilling.dislikePost(USER, 0);
    }

    function testRevertsWhenPostIndexIsNotValidWhileDislikingPost()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__PostDoesNotExists.selector);
        chilling.dislikePost(USER, 0);
    }

    function testEmitsAfterDislikingPost()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        vm.expectEmit(false, false, false, false);
        emit PostDisliked();
        chilling.dislikePost(USER, 0);
    }

    function testPostShouldHaveDislikedInfoAfterBeingDisliked()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        chilling.dislikePost(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory posts, ) = chilling.getAccountPosts(
            USER,
            0,
            1
        );

        PostWithoutMappings memory post = posts[0];

        assert(post.dislikesCount == 1);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, RECEIVER) == 1);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0)[0] == RECEIVER);
    }

    function testPostShouldRemoveLikeAfterDislikingTheSamePost()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        // liking

        vm.prank(RECEIVER);
        chilling.likePost(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterLike, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings memory postAfterLike = postsAfterLike[0];

        assert(postAfterLike.dislikesCount == 0);
        assert(postAfterLike.likesCount == 1);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, RECEIVER) == 1);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0).length == 0);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0)[0] == RECEIVER);

        // disliking

        vm.prank(RECEIVER);
        chilling.dislikePost(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterDislike, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings memory postAfterDislike = postsAfterDislike[0];

        assert(postAfterDislike.dislikesCount == 1);
        assert(postAfterDislike.likesCount == 0);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, RECEIVER) == 1);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0)[0] == RECEIVER);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0).length == 0);
    }

    /// Cancel post like

    function testRevertsWhenNotSignedUpUserCancelPostLike()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.cancelPostLike(RECEIVER, 0);
    }

    function testRevertsWhenUserCancelPostLikeOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.cancelPostLike(RECEIVER, 0);
    }

    function testRevertsWhenPostIsNotLikedWhileCancellingLikeOnIt()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        vm.expectRevert(Chilling.Chilling__PostIsNotLiked.selector);
        chilling.cancelPostLike(USER, 0);
    }

    function testRevertsWhenPostIndexIsNotValidWhileCancellingPostLike()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__PostDoesNotExists.selector);
        chilling.cancelPostLike(USER, 0);
    }

    function testEmitsWhenUserCancelLikeOnPost()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        chilling.likePost(USER, 0);

        vm.prank(RECEIVER);
        vm.expectEmit(false, false, false, false);
        emit PostLikeCancelled();
        chilling.cancelPostLike(USER, 0);
    }

    function testShouldUpdatePostInfoAboutLikesAfterCancelingLike()
        public
        signedUpUser
        signedUpReceiver
    {
        address THIRD_USER = makeAddr("third user");
        vm.deal(THIRD_USER, STARTNIG_BALANCE);
        vm.prank(THIRD_USER);
        chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);

        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        chilling.likePost(USER, 0);

        vm.prank(THIRD_USER);
        chilling.likePost(USER, 0);

        // state after two likes

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterLike, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings memory postAfterLike = postsAfterLike[0];

        assert(postAfterLike.likesCount == 2);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, RECEIVER) == 1);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, THIRD_USER) == 2);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0)[0] == RECEIVER);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0)[1] == THIRD_USER);

        // state after cancelling like by RECEIVER

        vm.prank(RECEIVER);
        chilling.cancelPostLike(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterFirstCancel, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings memory postAfterFirstCancel = postsAfterFirstCancel[
            0
        ];

        assert(postAfterFirstCancel.likesCount == 1);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, THIRD_USER) == 1);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0)[0] == THIRD_USER);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0).length == 1);

        // state after cancelling like by THIRD_USER)

        vm.prank(THIRD_USER);
        chilling.cancelPostLike(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterSecondCancel, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings
            memory postAfterSecondCancel = postsAfterSecondCancel[0];

        assert(postAfterSecondCancel.likesCount == 0);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesMap(0, THIRD_USER) == 0);
        vm.prank(USER);
        assert(chilling.getPostLikesAddressesArray(0).length == 0);
    }

    /// Cancel post dislike

    function testRevertsWhenNotSignedUpUserCancelPostDislike()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.cancelPostDislike(RECEIVER, 0);
    }

    function testRevertsWhenUserCancelPostDislikeOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.cancelPostDislike(RECEIVER, 0);
    }

    function testRevertsWhenPostIsNotDislikedWhileCancellingDislikeOnIt()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        vm.expectRevert(Chilling.Chilling__PostIsNotDisliked.selector);
        chilling.cancelPostDislike(USER, 0);
    }

    function testRevertsWhenPostIndexIsNotValidWhileCancellingPostDislike()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__PostDoesNotExists.selector);
        chilling.cancelPostDislike(USER, 0);
    }

    function testEmitsWhenUserCancelDislikeOnPost()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        chilling.dislikePost(USER, 0);

        vm.prank(RECEIVER);
        vm.expectEmit(false, false, false, false);
        emit PostDislikeCancelled();
        chilling.cancelPostDislike(USER, 0);
    }

    function testShouldUpdatePostInfoAboutDislikesAfterCancelingDislike()
        public
        signedUpUser
        signedUpReceiver
    {
        address THIRD_USER = makeAddr("third user");
        vm.deal(THIRD_USER, STARTNIG_BALANCE);
        vm.prank(THIRD_USER);
        chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);

        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        chilling.dislikePost(USER, 0);

        vm.prank(THIRD_USER);
        chilling.dislikePost(USER, 0);

        // state after two dislikes

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterDislike, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings memory postAfterDislike = postsAfterDislike[0];

        assert(postAfterDislike.dislikesCount == 2);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, RECEIVER) == 1);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, THIRD_USER) == 2);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0)[0] == RECEIVER);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0)[1] == THIRD_USER);

        // state after cancelling dislike by RECEIVER

        vm.prank(RECEIVER);
        chilling.cancelPostDislike(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterFirstCancel, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings memory postAfterFirstCancel = postsAfterFirstCancel[
            0
        ];

        assert(postAfterFirstCancel.dislikesCount == 1);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, THIRD_USER) == 1);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0)[0] == THIRD_USER);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0).length == 1);

        // state after cancelling dislike by THIRD_USER)

        vm.prank(THIRD_USER);
        chilling.cancelPostDislike(USER, 0);

        vm.prank(USER);
        (PostWithoutMappings[] memory postsAfterSecondCancel, ) = chilling
            .getAccountPosts(USER, 0, 1);

        PostWithoutMappings
            memory postAfterSecondCancel = postsAfterSecondCancel[0];

        assert(postAfterSecondCancel.dislikesCount == 0);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, RECEIVER) == 0);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesMap(0, THIRD_USER) == 0);
        vm.prank(USER);
        assert(chilling.getPostDislikesAddressesArray(0).length == 0);
    }

    /// Create comment

    function testRevertsWhenNotSignedUpUserLeaveComment()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.createComment("", RECEIVER, 0);
    }

    function testRevertsWhenLeavingCommentToPostOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.createComment("", RECEIVER, 0);
    }

    function testRevertsWhenCommentTextIsEmpty()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__CommentIsEmpty.selector);
        chilling.createComment("", RECEIVER, 0);
    }

    function testRevertsWhenPostIndexIsNotValidWhileLeavingComment()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__PostDoesNotExists.selector);
        chilling.createComment("comment", RECEIVER, 0);
    }

    function testEmitsAfterLeavingComment()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        vm.expectEmit(false, false, false, false);
        emit CommentCreated();
        chilling.createComment("comment", USER, 0);
    }

    function testCommentShouldBeInPostInfoAfterBeingLeft()
        public
        signedUpUser
        signedUpReceiver
    {
        string memory COMMENT_TEXT = "COMMENT_TEXT";

        vm.prank(USER);
        chilling.createPost("name", "image");

        vm.prank(RECEIVER);
        chilling.createComment(COMMENT_TEXT, USER, 0);

        vm.prank(RECEIVER);
        Comment[] memory comments = chilling.getPostComments(USER, 0);

        assert(comments.length == 1);
        assert(
            keccak256(abi.encodePacked(comments[0].text)) ==
                keccak256(abi.encodePacked(COMMENT_TEXT))
        );
        assert(comments[0].author == RECEIVER);
    }

    /// Get account count

    function testReturnsZeroAccountsCountInitially() public view {
        uint256 accountsCount = chilling.getAccountsCount();
        assert(accountsCount == 0);
    }

    function testReturnsAppropriateAccountsCountAfterUserSignedUp()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 accountsCount = chilling.getAccountsCount();
        assert(accountsCount == 2);
    }

    /// Get account info

    function testRevertWhenNotSignedUpUserGetsAccountInfo()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.getAccountInfo(RECEIVER);
    }

    function testRevertWhenNotUserGetsAccountInfoAboutNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.getAccountInfo(RECEIVER);
    }

    function testShouldReturnCorrectUserInfoAbout()
        public
        signedUpUser
        signedUpReceiver
    {
        vm.prank(USER);
        UserAccountWithoutMappings memory accountInfo = chilling.getAccountInfo(
            RECEIVER
        );

        assert(accountInfo.postsCount == 0);
        assert(accountInfo.followersCount == 0);
        assert(accountInfo.followingsCount == 0);
        assert(accountInfo.accountAddress == RECEIVER);
        assert(
            keccak256(abi.encodePacked(accountInfo.name)) ==
                keccak256(abi.encodePacked(USER_NAME))
        );
        assert(
            keccak256(abi.encodePacked(accountInfo.description)) ==
                keccak256(abi.encodePacked(USER_DESCRIPTION))
        );
        assert(
            keccak256(abi.encodePacked(accountInfo.image)) ==
                keccak256(abi.encodePacked(USER_IMAGE))
        );
        assert(accountInfo.isSenderFollowing == false);
        assert(accountInfo.isSenderFollower == false);

        vm.prank(USER);
        chilling.follow(RECEIVER);

        vm.prank(USER);
        UserAccountWithoutMappings
            memory accountInfoAfterFollowReceiverByUser = chilling
                .getAccountInfo(RECEIVER);

        assert(accountInfoAfterFollowReceiverByUser.isSenderFollowing == true);
        assert(accountInfoAfterFollowReceiverByUser.isSenderFollower == false);

        vm.prank(RECEIVER);
        chilling.follow(USER);

        vm.prank(USER);
        UserAccountWithoutMappings
            memory accountInfoAfterFollowUserByReceiver = chilling
                .getAccountInfo(RECEIVER);

        assert(accountInfoAfterFollowUserByReceiver.isSenderFollowing == true);
        assert(accountInfoAfterFollowUserByReceiver.isSenderFollower == true);
    }

    /// Get account post

    function testRevertsWhenFetchingPostsByNotSignedUpUser()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.getAccountPosts(RECEIVER, 0, 1);
    }

    function testRevertsWhenFetchingPostsOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.getAccountPosts(RECEIVER, 0, 1);
    }

    function testGetsEmptyPostsWithHasMoreFlagFalseWhenZeroPosts()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 10;

        vm.prank(USER);
        (PostWithoutMappings[] memory posts, bool hasMore) = chilling
            .getAccountPosts(USER, CURSOR, LIMIT);

        assert(hasMore == false);
        assert(posts.length == 0);
    }

    function testGetsPagesWithCorrectDataAndHasMoreFlagsForPosts()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 3;
        uint256 PAGES_COUNT = LIMIT * 3 + 1;

        for (uint256 i = 0; i < PAGES_COUNT; i++) {
            vm.prank(USER);
            chilling.createPost(Strings.toString(i), "POST_IMAGE");
        }

        vm.prank(USER);
        UserAccountWithoutMappings memory userAccount = chilling.getAccountInfo(
            USER
        );
        assert(userAccount.postsCount == PAGES_COUNT);

        // first page - post texts: 9, 8, 7
        vm.prank(USER);
        (
            PostWithoutMappings[] memory firstPagePosts,
            bool hasMoreAfterFirstPage
        ) = chilling.getAccountPosts(USER, CURSOR, LIMIT);

        assert(hasMoreAfterFirstPage == true);

        for (uint256 i = 0; i < LIMIT; i++) {
            assert(
                Strings.equal(
                    firstPagePosts[i].text,
                    Strings.toString(uint256(PAGES_COUNT - i - 1))
                )
            );
        }

        // second page - post texts: 6, 5, 4
        vm.prank(USER);
        (
            PostWithoutMappings[] memory secondPagePosts,
            bool hasMoreAfterSecondPage
        ) = chilling.getAccountPosts(USER, CURSOR + LIMIT, LIMIT);

        assert(hasMoreAfterSecondPage == true);

        for (uint256 i = 0; i < LIMIT; i++) {
            assert(
                Strings.equal(
                    secondPagePosts[i].text,
                    Strings.toString(uint256(PAGES_COUNT - i - 1 - LIMIT))
                )
            );
        }

        // third page - post texts: 3, 2, 1
        vm.prank(USER);
        (
            PostWithoutMappings[] memory thirdPagePosts,
            bool hasMoreAfterThirdPage
        ) = chilling.getAccountPosts(USER, CURSOR + (2 * LIMIT), LIMIT);

        assert(hasMoreAfterThirdPage == true);

        for (uint256 i = 0; i < LIMIT; i++) {
            assert(
                Strings.equal(
                    thirdPagePosts[i].text,
                    Strings.toString(uint256(PAGES_COUNT - i - 1 - (2 * LIMIT)))
                )
            );
        }

        // fourth page - post texts: 0, -, -
        vm.prank(USER);
        (
            PostWithoutMappings[] memory fourthdPagePosts,
            bool hasMoreAfterFourthPage
        ) = chilling.getAccountPosts(USER, CURSOR + (3 * LIMIT), LIMIT);

        assert(hasMoreAfterFourthPage == false);

        assert(
            Strings.equal(
                fourthdPagePosts[0].text,
                Strings.toString(uint256(0))
            )
        );
        assert(fourthdPagePosts.length == 1);
    }

    /// Get followers

    function testRevertsWhenFetchingFollwersByNotSignedUpUser()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.getFollowers(RECEIVER, 0, 1);
    }

    function testRevertsWhenFetchingFollwersOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.getFollowers(RECEIVER, 0, 1);
    }

    function testGetsEmptyPagesWithHasMoreFlagFalseWhenZeroFollowers()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 10;

        vm.prank(USER);
        (UserAccountShort[] memory accounts, bool hasMore) = chilling
            .getFollowers(USER, CURSOR, LIMIT);

        assert(hasMore == false);
        assert(accounts.length == 0);
    }

    function testGetsPagesWithCorrectDataAndHasMoreFlagsForFollowers()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 3;
        uint256 PAGES_COUNT = LIMIT + 1;

        for (uint256 i = 0; i < PAGES_COUNT; i++) {
            address user = address(uint160(i + 1));
            hoax(user, STARTNIG_BALANCE);
            chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);
            vm.prank(user);
            chilling.follow(USER);
        }

        vm.prank(USER);
        UserAccountWithoutMappings memory userAccount = chilling.getAccountInfo(
            USER
        );
        assert(userAccount.followersCount == PAGES_COUNT);

        // first page - followers addresses: 4, 3, 2
        vm.prank(USER);
        (
            UserAccountShort[] memory firstPageFollowers,
            bool hasMoreAfterFirstPage
        ) = chilling.getFollowers(USER, CURSOR, LIMIT);

        assert(hasMoreAfterFirstPage == true);

        for (uint256 i = 0; i < LIMIT; i++) {
            assert(
                firstPageFollowers[i].accountAddress ==
                    address(uint160(PAGES_COUNT - i))
            );
        }

        // second page - followers addresses: 1, -, -
        vm.prank(USER);
        (
            UserAccountShort[] memory secondPageFollowers,
            bool hasMoreAfterSecondPage
        ) = chilling.getFollowers(USER, CURSOR + LIMIT, LIMIT);

        assert(hasMoreAfterSecondPage == false);

        assert(secondPageFollowers[0].accountAddress == address(uint160(1)));
        assert(secondPageFollowers.length == 1);
    }

    /// Get followings

    function testRevertsWhenFetchingFollwingsByNotSignedUpUser()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.getFollowing(RECEIVER, 0, 1);
    }

    function testRevertsWhenFetchingFollwingsOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.getFollowing(RECEIVER, 0, 1);
    }

    function testGetsEmptyPagesWithHasMoreFlagFalseWhenZeroFollowings()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 10;

        vm.prank(USER);
        (UserAccountShort[] memory accounts, bool hasMore) = chilling
            .getFollowing(USER, CURSOR, LIMIT);

        assert(hasMore == false);
        assert(accounts.length == 0);
    }

    function testGetsPagesWithCorrectDataAndHasMoreFlagsForFollowings()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 3;
        uint256 PAGES_COUNT = LIMIT + 1;

        for (uint256 i = 0; i < PAGES_COUNT; i++) {
            address user = address(uint160(i + 1));
            hoax(user, STARTNIG_BALANCE);
            chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);
            vm.prank(USER);
            chilling.follow(user);
        }

        vm.prank(USER);
        UserAccountWithoutMappings memory userAccount = chilling.getAccountInfo(
            USER
        );
        assert(userAccount.followingsCount == PAGES_COUNT);

        // first page - followings addresses: 4, 3, 2
        vm.prank(USER);
        (
            UserAccountShort[] memory firstPageFollowings,
            bool hasMoreAfterFirstPage
        ) = chilling.getFollowing(USER, CURSOR, LIMIT);

        assert(hasMoreAfterFirstPage == true);

        for (uint256 i = 0; i < LIMIT; i++) {
            assert(
                firstPageFollowings[i].accountAddress ==
                    address(uint160(PAGES_COUNT - i))
            );
        }

        // second page - followings addresses: 1, -, -
        vm.prank(USER);
        (
            UserAccountShort[] memory secondPageFollowings,
            bool hasMoreAfterSecondPage
        ) = chilling.getFollowing(USER, CURSOR + LIMIT, LIMIT);

        assert(hasMoreAfterSecondPage == false);

        assert(secondPageFollowings[0].accountAddress == address(uint160(1)));
        assert(secondPageFollowings.length == 1);
    }

    /// Get post likers

    function testRevertsWhenFetchingPostLikersByNotSignedUpUser()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.getPostLikers(RECEIVER, 0, 0, 1);
    }

    function testRevertsWhenFetchingPostLikersOfPostOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.getPostLikers(RECEIVER, 0, 0, 1);
    }

    function testGetsEmptyPageWithHasMoreFlagFalseWhenZeroPostLikers()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 10;
        uint256 POST_INDEX = 0;

        vm.prank(USER);
        chilling.createPost("text", "image");

        vm.prank(USER);
        (UserAccountShort[] memory accounts, bool hasMore) = chilling
            .getPostLikers(USER, POST_INDEX, CURSOR, LIMIT);

        assert(hasMore == false);
        assert(accounts.length == 0);
    }

    function testGetsPagesWithCorrectDataAndHasMoreFlagsForPostLikers()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 3;
        uint256 POST_INDEX = 0;
        uint256 PAGES_COUNT = LIMIT + 1;

        vm.prank(USER);
        chilling.createPost("text", "image");

        for (uint256 i = 0; i < PAGES_COUNT; i++) {
            address user = address(uint160(i + 1));
            hoax(user, STARTNIG_BALANCE);
            chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);
            vm.prank(user);
            chilling.likePost(USER, POST_INDEX);
        }

        vm.prank(USER);
        (PostWithoutMappings[] memory posts, ) = chilling.getAccountPosts(
            USER,
            POST_INDEX,
            1
        );
        PostWithoutMappings memory post = posts[0];
        assert(post.likesCount == PAGES_COUNT);

        // first page - likers addresses: 4, 3, 2
        vm.prank(USER);
        (
            UserAccountShort[] memory firstPageLikers,
            bool hasMoreAfterFirstPage
        ) = chilling.getPostLikers(USER, POST_INDEX, CURSOR, LIMIT);

        assert(hasMoreAfterFirstPage == true);

        for (uint256 i = 0; i < LIMIT; i++) {
            assert(
                firstPageLikers[i].accountAddress ==
                    address(uint160(PAGES_COUNT - i))
            );
        }

        // second page - likers addresses: 1, -, -
        vm.prank(USER);
        (
            UserAccountShort[] memory secondPageLikers,
            bool hasMoreAfterSecondPage
        ) = chilling.getPostLikers(USER, POST_INDEX, CURSOR + LIMIT, LIMIT);

        assert(hasMoreAfterSecondPage == false);

        assert(secondPageLikers[0].accountAddress == address(uint160(1)));
        assert(secondPageLikers.length == 1);
    }

    /// Get post dislikers

    function testRevertsWhenFetchingPostDislikersByNotSignedUpUser()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.getPostDislikers(RECEIVER, 0, 0, 1);
    }

    function testRevertsWhenFetchingPostDislikersOfPostOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.getPostDislikers(RECEIVER, 0, 0, 1);
    }

    function testGetsEmptyPageWithHasMoreFlagFalseWhenZeroPostDislikers()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 10;
        uint256 POST_INDEX = 0;

        vm.prank(USER);
        chilling.createPost("text", "image");

        vm.prank(USER);
        (UserAccountShort[] memory accounts, bool hasMore) = chilling
            .getPostDislikers(USER, POST_INDEX, CURSOR, LIMIT);

        assert(hasMore == false);
        assert(accounts.length == 0);
    }

    function testGetsPagesWithCorrectDataAndHasMoreFlagsForPostDislikers()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 CURSOR = 0;
        uint256 LIMIT = 3;
        uint256 POST_INDEX = 0;
        uint256 PAGES_COUNT = LIMIT + 1;

        vm.prank(USER);
        chilling.createPost("text", "image");

        for (uint256 i = 0; i < PAGES_COUNT; i++) {
            address user = address(uint160(i + 1));
            hoax(user, STARTNIG_BALANCE);
            chilling.signUp(USER_NAME, USER_DESCRIPTION, USER_IMAGE);
            vm.prank(user);
            chilling.dislikePost(USER, POST_INDEX);
        }

        vm.prank(USER);
        (PostWithoutMappings[] memory posts, ) = chilling.getAccountPosts(
            USER,
            POST_INDEX,
            1
        );
        PostWithoutMappings memory post = posts[0];
        assert(post.dislikesCount == PAGES_COUNT);

        // first page - dislikers addresses: 4, 3, 2
        vm.prank(USER);
        (
            UserAccountShort[] memory firstPageDislikers,
            bool hasMoreAfterFirstPage
        ) = chilling.getPostDislikers(USER, POST_INDEX, CURSOR, LIMIT);

        assert(hasMoreAfterFirstPage == true);

        for (uint256 i = 0; i < LIMIT; i++) {
            assert(
                firstPageDislikers[i].accountAddress ==
                    address(uint160(PAGES_COUNT - i))
            );
        }

        // second page - dislikers addresses: 1, -, -
        vm.prank(USER);
        (
            UserAccountShort[] memory secondPageDislikers,
            bool hasMoreAfterSecondPage
        ) = chilling.getPostDislikers(USER, POST_INDEX, CURSOR + LIMIT, LIMIT);

        assert(hasMoreAfterSecondPage == false);

        assert(secondPageDislikers[0].accountAddress == address(uint160(1)));
        assert(secondPageDislikers.length == 1);
    }

    /// Get post comments

    function testRevertsWhenFetchingCommentsByNotSignedUpUser()
        public
        signedUpReceiver
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__SenderIsNotSignedUp.selector);
        chilling.getPostComments(RECEIVER, 0);
    }

    function testRevertsWhenFetchingCommentsOfPostOfNotSignedUpUser()
        public
        signedUpUser
    {
        vm.prank(USER);
        vm.expectRevert(Chilling.Chilling__ReceiverIsNotSignedUp.selector);
        chilling.getPostComments(RECEIVER, 0);
    }

    function testReturnsCorrectNumberOfCommentsForPost()
        public
        signedUpUser
        signedUpReceiver
    {
        uint256 COMMENTS_COUNT = 10;
        vm.prank(USER);
        chilling.createPost("text", "image");

        for (uint256 i = 0; i < COMMENTS_COUNT; i++) {
            vm.prank(USER);
            chilling.createComment(Strings.toString(i), USER, 0);
        }

        vm.prank(USER);
        Comment[] memory comments = chilling.getPostComments(USER, 0);

        for (uint256 i = 0; i < COMMENTS_COUNT; i++) {
            assert(
                Strings.equal(
                    comments[COMMENTS_COUNT - 1 - i].text,
                    Strings.toString(COMMENTS_COUNT - 1 - i)
                )
            );
        }
    }
}
