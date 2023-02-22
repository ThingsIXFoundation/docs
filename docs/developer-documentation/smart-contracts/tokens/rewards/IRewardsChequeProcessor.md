---
title: Rewards Cheque Processor
---
# Rewards Cheque Processor
 ThingsIX rewards cheque processor plugin.

## Functions

### claim

```solidity
function claim(address beneficiary, uint256 totalAmount, bytes signature) external
```

Claim a rewards cheque. The rewards are paid in THIX tokens to
`beneficiary`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | rewards receiver |
| totalAmount | uint256 | amount of Thix tokens to reward to beneficiary |
| signature | bytes | cheque signature |

### claimAndCall

```solidity
function claimAndCall(address beneficiary, uint256 totalAmount, bytes signature) external
```

Claim a rewards cheque. The rewards are paid in THIX tokens to
`beneficiary`. After the rewards are paid the `IERC1363Receiver::onTransferReceived`
function is called on `beneficiary` with the sender address set to the
zero address and data empty.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | rewards receiver |
| totalAmount | uint256 | amount of Thix tokens to reward to beneficiary |
| signature | bytes | cheque signature |

### claimAndCall

```solidity
function claimAndCall(address beneficiary, uint256 totalAmount, bytes signature, bytes data) external
```

Claim a rewards cheque. The rewards are paid in THIX tokens to
`beneficiary`. After the rewards are paid the `IERC1363Receiver::onTransferReceived`
function is called on `beneficiary` with the sender address set to the
zero address and the given data as argument.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| beneficiary | address | rewards receiver |
| totalAmount | uint256 | amount of Thix tokens to reward to beneficiary |
| signature | bytes | cheque signature |
| data | bytes | passed to the IERC1363Receiver::onTransferReceived |

