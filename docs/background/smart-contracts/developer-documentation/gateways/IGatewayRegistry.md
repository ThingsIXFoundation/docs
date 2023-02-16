---
title: Gateway Registry
---
# Gateway Registry
 ThingsIX gateway registry

## Functions

### gateways

```solidity
function gateways(bytes32 id) external view returns (struct IGatewayRegistry.Gateway)
```

Retrieve gateway details. Throws `UnknownGatewayErr` when there
is no gateway onboaded that is identified by the given `id`.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | bytes32 | ThingsIX gateway identifier |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IGatewayRegistry.Gateway | gateway gateway details |
### gatewayCount

```solidity
function gatewayCount(address owner) external view returns (uint256)
```

Number of registered gateways for the given owner.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | gateway owner |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | number number of gateways owned by the given owner |
### gatewaysPaged

```solidity
function gatewaysPaged(address owner, uint256 start, uint256 end) external view returns (struct IGatewayRegistry.Gateway[])
```

Batch of owned gateways for the given owner.
Throws an UnknownGatewayErr when the given range is invalid.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | address of the gateway owner |
| start | uint256 | start index (inclusive) |
| end | uint256 | last index (exclusive) |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IGatewayRegistry.Gateway[] | batch of gateways for the given owner in the given range |

## Events

### GatewayUpdated

```solidity
event GatewayUpdated(bytes32 gatewayId)
```

raised when a new gateway is updated in the registry.

### GatewayTransferred

```solidity
event GatewayTransferred(bytes32 gatewayId, address oldOwner, address newOwner)
```

raised when a new gateway is transferred

### GatewayOffboarded

```solidity
event GatewayOffboarded(bytes32 gatewayId)
```

raised when a new gateway is removed from the registry.

### GatewayOnboarded

```solidity
event GatewayOnboarded(bytes32 gatewayId, address owner)
```

raised when a new gateway is added to the registry.

## Structs

### Gateway

```solidity
struct Gateway {
  bytes32 id;
  uint8 version;
  address owner;
  uint8 antennaGain;
  uint8 frequencyPlan;
  int64 location;
  uint8 altitude;
}
```

