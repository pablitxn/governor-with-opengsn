// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.9;

contract Counter  {
    event Increment(address indexed entity, uint256 step);
    event Decrement(address indexed entity, uint256 step);

    uint256 public value;

    constructor(uint256 _initValue) {
        value = _initValue;
    }

    function increment(uint256 step) external {
        value = value + step;
        emit Increment(msg.sender, step);
    }

    function decrement(uint256 step) external  {
        value = value - step;
        emit Decrement(msg.sender, step);
    }
}
