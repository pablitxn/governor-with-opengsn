// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/governance/utils/Votes.sol";

// import "./gas-station-network/ERC2771Recipient.sol";


contract MyGovernor is
    Governor,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    ERC2771Context
    {
    // uint256 public s_votingDelay;
    // uint256 public s_votingPeriod;
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;

    constructor(IVotes _token, address forwarder)
        Governor("MyGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        ERC2771Context(forwarder)
    {
        // setTrustedForwarder(forwarder);
        // s_votingDelay = _votingDelay;
        // s_votingPeriod = _votingPeriod;
    }
    // The following functions are overrides required by Solidity.

    struct WhiteList {
        address user;
    }

    mapping(address => WhiteList) private whiteList;

    function votingDelay() public view override returns (uint256)
    {
        // return s_votingDelay; // 1 = 1 block
        return 1; // 1 = 1 block
    }

    function votingPeriod() public view override returns (uint256)
    {
        // return s_votingPeriod; // 45818 = 1 week
        return 45818; // 45818 = 1 week
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }


    function addAddressToWhiteList(address _address) public {
        // _itemIds.increment();
        // uint itemId = _itemIds.current();
        whiteList[_address] = WhiteList(_address);
    }

    function isWhiteListed(address _address) public view returns (bool) {
        return whiteList[_address].user != address(0);
    }

    function castVote(uint256 proposalId, uint8 support)
        public
        virtual
        override(Governor)
        returns (uint256)
    {
        require(isWhiteListed(_msgSender()), "castVote: not whitelisted");
        return super.castVote(proposalId, support);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor)
        returns (ProposalState)
    {
    return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor) returns (uint256) {
    return super.propose(targets, values, calldatas, description);
    }

    function _execute(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
    ) internal override(Governor) {
    super._execute(
        proposalId,
        targets,
        values,
        calldatas,
        descriptionHash
        );
    }

    function _cancel(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
    ) internal override(Governor) returns (uint256) {
    return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor) returns (address) {
    return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor)
        returns (bool)
    {
    return super.supportsInterface(interfaceId);
    }

    function _msgSender() internal view override(Context, ERC2771Context)
        returns (address sender) {
        sender = ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context)
        returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    string public versionRecipient = "2.2.0";
}