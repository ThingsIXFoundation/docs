---
title: Thix
---
# Thix
 THIX is an ERC20 token with the ERC1363 &quot;Payable Token&quot; extension
 and the ability to payout rewards and burn tokens to pay for fees.

## Functions

### transferAndCall

```solidity
function transferAndCall(address to, uint256 amount) external returns (bool)
```

Transfer tokens from `msg.sender` to another address and then call `onTransferReceived` on receiver.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | address The address which you want to transfer to |
| amount | uint256 | The amount of tokens to be transferred |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true unless throwing |
### transferAndCall

```solidity
function transferAndCall(address to, uint256 amount, bytes data) external returns (bool)
```

Transfer tokens from `msg.sender` to another address and then call `onTransferReceived` on receiver.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | address The address which you want to transfer to |
| amount | uint256 | The amount of tokens to be transferred |
| data | bytes | bytes Additional data with no specified format, sent in call to `to` |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true unless throwing |
### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 amount) external returns (bool)
```

Transfer tokens from one address to another and then call `onTransferReceived` on receiver.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address The address which you want to send tokens from |
| to | address | address The address which you want to transfer to |
| amount | uint256 | The amount of tokens to be transferred |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true unless throwing |
### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 amount, bytes data) external returns (bool)
```

Transfer tokens from one address to another and then call `onTransferReceived` on receiver.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | address The address which you want to send tokens from |
| to | address | address The address which you want to transfer to |
| amount | uint256 | The amount of tokens to be transferred |
| data | bytes | bytes Additional data with no specified format, sent in call to `to` |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true unless throwing |
### approveAndCall

```solidity
function approveAndCall(address spender, uint256 amount) external returns (bool)
```

Approve the passed address to spend the specified amount of tokens on behalf of msg.sender
and then call `onApprovalReceived` on spender.
Beware that changing an allowance with this method brings the risk that someone may use both the old
and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | address The address which will spend the funds |
| amount | uint256 | uint256 The amount of tokens to be spent |

### approveAndCall

```solidity
function approveAndCall(address spender, uint256 amount, bytes data) external returns (bool)
```

Approve the passed address to spend the specified amount of tokens on behalf of msg.sender
and then call `onApprovalReceived` on spender.
Beware that changing an allowance with this method brings the risk that someone may use both the old
and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | address The address which will spend the funds |
| amount | uint256 | uint256 The amount of tokens to be spent |
| data | bytes | bytes Additional data with no specified format, sent in call to `spender` |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

_Returns true if this contract implements the interface defined by
`interfaceId`. See the corresponding
https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
to learn more about how these ids are created.

This function call must use less than 30 000 gas._

### totalRewardsPaid

```solidity
function totalRewardsPaid(address account) external view returns (uint256)
```

total amount of THIX token rewards that are paid to `account`

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | users address |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | amount of tokens that are already minted for the user |
### payRewards

```solidity
function payRewards(address to, uint256 amount) external
```

pay `amount` of tokens rewards to `to`. On success the ERC20
Transfer event is raised with the from set to the zero account.

_only whitelisted accounts can call this function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | account to pay the minted tokens to |
| amount | uint256 | amount of tokens to mint |

### payRewardsAndCall

```solidity
function payRewardsAndCall(address to, uint256 amount) external
```

pay `amount` of tokens rewards to `to` and call the onTransferReceived
callback on received with the from address set to the zero adress. On 
success the ERC20 Transfer event is raised with the from set to the zero
account.

_only whitelisted accounts can call this function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | account to pay the minted tokens to |
| amount | uint256 | amount of tokens to mint |

### payRewardsAndCall

```solidity
function payRewardsAndCall(address to, uint256 amount, bytes data) external
```

pay `amount` of tokens rewards to `to` and call the onTransferReceived
callback on received with the from address set to the zero adress. On 
success the ERC20 Transfer event is raised with the from set to the zero
account.

_only whitelisted accounts can call this function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | account to pay the minted tokens to |
| amount | uint256 | amount of tokens to mint |
| data | bytes | data passed when the onTransferReceived is called |

### burnDelegated

```solidity
function burnDelegated(address from, uint256 amount) external
```

burn `amount` of tokens in `from` wallet. On success the ERC20
Transfer event is raised with the to set to the zero address.

_only whitelisted accounts can call this function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | account to burn the tokens from |
| amount | uint256 | tokens to burn |

### name

```solidity
function name() external view returns (string)
```

_Returns the name of the token._

### symbol

```solidity
function symbol() external view returns (string)
```

_Returns the symbol of the token._

### decimals

```solidity
function decimals() external view returns (uint8)
```

_Returns the decimals places of the token._

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

_Returns the amount of tokens in existence._

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

_Returns the amount of tokens owned by `account`._

### transfer

```solidity
function transfer(address to, uint256 amount) external returns (bool)
```

_Moves `amount` tokens from the caller's account to `to`.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

_Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called._

### approve

```solidity
function approve(address spender, uint256 amount) external returns (bool)
```

_Sets `amount` as the allowance of `spender` over the caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an {Approval} event._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) external returns (bool)
```

_Moves `amount` tokens from `from` to `to` using the
allowance mechanism. `amount` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

## Events

### Transfer

```solidity
event Transfer(address from, address to, uint256 value)
```

_Emitted when `value` tokens are moved from one account (`from`) to
another (`to`).

Note that `value` may be zero._

### Approval

```solidity
event Approval(address owner, address spender, uint256 value)
```

_Emitted when the allowance of a `spender` for an `owner` is set by
a call to {approve}. `value` is the new allowance._

