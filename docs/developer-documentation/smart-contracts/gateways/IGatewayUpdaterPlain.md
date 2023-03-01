---
title: Gateway Updater Plain
---
# Gateway Updater Plain
 Update gateway by its owner.

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
Transfer event to determine the update fee in THIX that was burned.
The fee is paid in THIX but set in EUR. Therefore an exchange rate is
used to calculate the amount of THIX to burn to pay for the update fee.
This exchange rate is updated periodically. Therefore it is possible
that this exchange rate changed between the moment the transaction was 
sent and processed and will fail. If the rate decreased the amount of 
tokens required to update the gateway is higher than the moment the 
transaction was sent. With
`maxFee` the user can specify the max amount of tokens he is willing to
burn to onboard the gateway. E.g. if the user is willing to burn 10% more
tokens to onboard the gateway than the existing fee he can specify `maxFee`
as 1.10 * updateFeeInThix(). Only the amount of tokens to burn is burned
from the users wallet. Excesses tokens specified in `maxFee` are untouched._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| gatewayId | bytes32 | gateway unique identifier |
| antennaGain | uint8 | antenna gain multiplied by 10 (e.g. 3.3dBi -> 33) |
| frequencyPlan | uint8 | gateway lora region |
| location | int64 | gateway location H3 index at resolution 10 |
| altitude | uint8 | gateway altitude divided by 3 (e.g. 33m -> 11) |
| maxFee | uint256 | max fee in THIX (18 decimals) owner is willing to pay as update fee. |

