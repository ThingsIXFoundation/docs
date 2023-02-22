---
title: Gateway Updater Plain
---
# Gateway Updater Plain
 Update gateway by its owner
 To update a gateway the owner will need to pay a fee. This fee is set in EUR
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

### updateFeeInEUR

```solidity
function updateFeeInEUR() external view returns (uint256)
```

Gateway update fee in EUR.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | gateway update fee in EUR (18 decimals) |
### updateFeeInTHIX

```solidity
function updateFeeInTHIX() external view returns (uint256)
```

Gateway update fee in THIX.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | gateway update fee in THIX (18 decimals) |
### update

```solidity
function update(bytes32 gatewayId, uint8 antennaGain, uint8 frequencyPlan, int64 location, uint8 altitude, uint256 maxFee) external
```

Update gateway details, must be called from the gateway owners
account.

_on success the GatewayRegistry will raise the GatewayUpdated
event and the THIX token will raise the Transfer event with the to
address set to the zero address (burn onboard fee). Use the value of the
Transfer event to determine the onboard fee in THIX that was burned._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| gatewayId | bytes32 | gateway unique identifier |
| antennaGain | uint8 | antenna gain multiplied by 10 (e.g. 3.3dBi -> 33) |
| frequencyPlan | uint8 | gateway lora region |
| location | int64 | gateway location H3 index at resolution 10 |
| altitude | uint8 | gateway altitude divided by 3 (e.g. 33m -> 11) |
| maxFee | uint256 | max fee in THIX (18 decimals) owner is willing to pay as update fee. |

