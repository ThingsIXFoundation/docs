---
title: Gateway Onboarding Plain Batch
---
# Gateway Onboarding Plain Batch
 Onboard a batch of gateway by signing onboard messages.
 To onboard a gateway the owner will need to pay a fee. This fee is set in EUR
 but paid with THIX. The THIX/EUR exchange rate is updated periodically. 
 Therefore there is a change the exchange rate changed between the moment the 
 user calculates the amount of THIX to pay for the onboard fee and the moment 
 the transaction is processed on chain. If the THIX/EUR exchange rate changed 
 significantly this can cause the transaction to be reverted because the user 
 doesn&#x27;t have enough THIX tokens, or if the has he can pay much more THIX than
 he was willing to do. Therefore the &#x60;maxFee&#x60; parameter is added. This gives 
 the caller the option to specify the max amount of THIX tokens he is willing
 to spend to perform the operation. If the operation costs less than &#x60;maxFee&#x60;
 the remainder remains in the wallet of the user.

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

