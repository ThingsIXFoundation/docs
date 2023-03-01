---
title: Gateway Onboarding Plain Batch
---
# Gateway Onboarding Plain Batch
 Onboard a batch of gateway by signing onboard messages.

## Functions

### onboardFeeInEUR

```solidity
function onboardFeeInEUR() external view returns (uint256)
```

Gateway onboard fee in EUR (18 decimals)

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | gateway onboard fee in EUR (18 decimals) |
### onboardFeeInTHIX

```solidity
function onboardFeeInTHIX() external view returns (uint256)
```

Gateway onboard fee in THIX (18 decimals)

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | gateway onboard fee in THIX (18 decimals) |
### onboard

```solidity
function onboard(uint8[] versions, bytes32[] gatewayIds, address[] gateways, bytes[] gatewaySignatures, uint256 maxFee) external
```

Onboard a gateway by verifying a gateway signature that includes 
the gateway owner and trusting the chains native transaction signing
process to verify the owners signatures.

_on success, for each gateway the GatewayRegistry will raise the 
GatewayOnboarded event and the Thix token will raise the Transfer event 
with the to address set to the zero address (burn onboard fee)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| versions | uint8[] | gateway onboard versions |
| gatewayIds | bytes32[] | gateway unique identifiers |
| gateways | address[] | gateway EVM addresses |
| gatewaySignatures | bytes[] | gateway signature over the onboard messages |
| maxFee | uint256 | max fee in THIX (18 decimals) owner is willing to pay as onboard fee. |

