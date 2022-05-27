// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./gas-station-network/ERC2771Recipient.sol";

contract Counter is ERC2771Recipient  {
    event Increment(
        address indexed currentUser,
        address indexed previousUser,
        uint256 step
    );

    event Decrement(
        address indexed currentUser,
        address indexed previousUser,
        uint256 step
    );

    address public currentUser = address(0);
    uint256 public value;

    constructor(address forwarder, uint256 initValue) {
        value = initValue;
        _setTrustedForwarder(forwarder);
    }

    function increment(uint256 step) external {
        value = value + step;
        currentUser = _msgSender();
        emit Increment(_msgSender(), currentUser, step);
    }

    function decrement(uint256 step) external  {
        value = value - step;
        emit Decrement(_msgSender(), currentUser, step);
    }

    string public override versionRecipient = "2.2.0";
}
