---
title: Gateway Onboarding Plain
---
# Gateway Onboarding Plain
 Onboard a gateway by signing an onboard message.

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
function onboard(uint8 version, bytes32 gatewayId, address gateway, bytes gatewaySignature, uint256 maxFee) external
```

Onboard a gateway by verifying a gateway signature that includes
the gateway owner and trusting the chains native transaction signing 
process to verify the owners signatures.

_on success the GatewayRegistry will raise the GatewayOnboarded
event and the Thix token will raise the Transfer event with the to
address set to the zero address (burn onboard fee). Use the value of the
Transfer event to determine the onboard fee in THIX that was burned.
The fee is paid in THIX but set in EUR. Therefore an exchange rate is
used to calculate the amount of THIX to burn to pay for the onboard fee.
This exchange rate is updated periodically. Therefore it is possible
that this exchange rate changed between the moment the transaction was 
sent and processed and will fail. If the exchange rate decreased the 
amount of tokens required to update the gateway is higher than the moment
the transaction was sent. With `maxFee` the user can specify the max 
amount of tokens he is willing to burn to onboard the gateway. E.g. if 
the user is willing to burn 10% more tokens to onboard the gateway than 
the existing fee he can specify `maxFee` as 1.10 * updateFeeInThix(). 
Only the amount of tokens to burn is burned from the users wallet. 
Excesses tokens specified in `maxFee` are untouched._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| version | uint8 | gateway onboard version |
| gatewayId | bytes32 | gateway unique identifier |
| gateway | address | gateway EVM address |
| gatewaySignature | bytes | gateway signature over the onboard message |
| maxFee | uint256 | max fee in THIX (18 decimals) owner is willing to pay as onboard fee. |

