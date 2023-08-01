// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract ChillingStruct {
    struct Comment {
        string text;
        address author;
        string name;
        string image;
    }

    /// mappings maps address to its index+1 in the appropriate array
    /// post index starts from 0 and is used in context of particular user
    struct Post {
        uint256 index;
        uint256 timestamp;
        uint256 likesCount;
        uint256 dislikesCount;
        address author;
        string image;
        string text;
        Comment[] comments;
        mapping(address => uint256) likesAddressesMap;
        mapping(address => uint256) dislikesAddressesMap;
        address[] likesAddressesArray;
        address[] dislikesAddressesArray;
    }

    /// mappings maps address to its index-1 in the appropriate array
    struct UserAccount {
        uint256 postsCount;
        uint256 followersCount;
        uint256 followingsCount;
        address accountAddress;
        string name;
        string description;
        string image;
        mapping(address => uint256) followersMap;
        mapping(address => uint256) followingsMap;
        address[] followersArray;
        address[] followingsArray;
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
    struct UserAccountWithoutMappings {
        uint256 postsCount;
        uint256 followersCount;
        uint256 followingsCount;
        address accountAddress;
        string name;
        string description;
        string image;
        bool isSenderFollowing;
        bool isSenderFollower;
    }

    /// used for getters return type
    struct UserAccountShort {
        string name;
        string image;
        address accountAddress;
        bool isSenderFollowing;
        bool isSenderFollower;
    }
}
