// SPDX-License-Identifier: MIT
// File: contracts/SingleRecipientPaymaster.sol
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

/**
 * a paymaster for a single recipient contract.
 * - reject requests if destination is not the target contract.
 * - reject any request if the target contract reverts.
 */
contract SingleRecipientPaymaster is BasePaymaster {

    address public target;

    constructor(address _target) {
        target=_target;
    }

    function versionPaymaster() external view override virtual returns (string memory){
        return "2.2.0+opengsn.recipient.ipaymaster";
    }

    function preRelayedCall(
        GsnTypes.RelayRequest calldata relayRequest,
        bytes calldata signature,
        bytes calldata approvalData,
        uint256 maxPossibleGas
    )
    external
    override
    virtual
    returns (bytes memory context, bool revertOnRecipientRevert) {
        (relayRequest, signature, approvalData, maxPossibleGas);
        require(relayRequest.request.to==target, "wrong target");
	//returning "true" means this paymaster accepts all requests that
	// are not rejected by the recipient contract.
        return ("", true);
    }

    function postRelayedCall(
        bytes calldata context,
        bool success,
        uint256 gasUseWithoutPost,
        GsnTypes.RelayData calldata relayData
    ) external override virtual {
        (context, success, gasUseWithoutPost, relayData);
    }
}
