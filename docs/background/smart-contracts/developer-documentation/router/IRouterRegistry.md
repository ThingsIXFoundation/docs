---
title: Router Registry
---
# Router Registry
 ThingsIX router registry

## Functions

### routers

```solidity
function routers(bytes32 id) external view returns (struct IRouterRegistry.Router)
```

returns router details for the router identified by the given id.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | bytes32 | router identifier |

### routerCount

```solidity
function routerCount() external view returns (uint256)
```

Number of registered reouters.

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | number of registered routers |
### routersPaged

```solidity
function routersPaged(uint256 start, uint256 end) external view returns (struct IRouterRegistry.Router[])
```

Batch of routers.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| start | uint256 | start index (inclusive) |
| end | uint256 | last index (exclusive) |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IRouterRegistry.Router[] | batch of routers in the given range |
### update

```solidity
function update(bytes32 id, address owner, uint24 netid, uint32 prefix, uint8 mask, uint8 frequencyPlan, string endpoint) external
```

update router identifier by the given id with the given details

_can only be called from whitelisted accounts_

### remove

```solidity
function remove(bytes32 id, address owner) external
```

remover router or revert when the router is not registered

_can only be called from whitelisted accounts_

### register

```solidity
function register(bytes32 id, address owner, uint24 netid, uint32 prefix, uint8 mask, uint8 frequencyPlan, string endpoint) external
```

register router or revert when the router is already registered

_can only be called from whitelisted accounts_

## Events

### RouterRegistered

```solidity
event RouterRegistered(bytes32 id)
```

raised when a new router is registered

### RouterUpdated

```solidity
event RouterUpdated(bytes32 id)
```

raised when router details are updated

### RouterRemoved

```solidity
event RouterRemoved(bytes32 id)
```

raised when a router is removed

## Structs

### Router

```solidity
struct Router {
  bytes32 id;
  address owner;
  uint24 netid;
  uint32 prefix;
  uint8 mask;
  uint8 frequencyPlan;
  string endpoint;
}
```

