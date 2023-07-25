// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {Chilling} from "../src/Chilling.sol";
import {ChillingStruct} from "../src/ChillingStruct.sol";

contract DeployChilling is Script {
    function run() external returns (Chilling) {
        vm.startBroadcast();
        Chilling chilling = new Chilling();
        vm.stopBroadcast();

        return chilling;
    }
}
