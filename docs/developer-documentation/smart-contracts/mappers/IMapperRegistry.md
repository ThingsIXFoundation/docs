---
title: Mapper Registry
---
# Mapper Registry
 Public interface for the ThingsIX PoC mapper registry.

## Functions

### frequencyPlans

```solidity
function frequencyPlans(uint8 plan) external returns (string)
```

frequencyPlans returns the name for the given plan id.
It the given plan is unknown an empty string is returned.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| plan | uint8 | frequency plan id |

### mappers

```solidity
function mappers(bytes32 id) external view returns (struct IMapperRegistry.Mapper)
```

_Retrieve mapper details by its id._

### mappersCount

```solidity
function mappersCount() external view returns (uint256)
```

_Total number of mappers registered_

### mappersPaged

```solidity
function mappersPaged(uint256 start, uint256 end) external view returns (struct IMapperRegistry.Mapper[])
```

_Return set of mappers within the range [start, end)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| start | uint256 | start index (inclusive) |
| end | uint256 | end index (exclusive) |

### mappersRegistered

```solidity
function mappersRegistered() external view returns (uint256)
```

_Number of mappers registered by ThingsIX._

### mappersOnboarded

```solidity
function mappersOnboarded() external view returns (uint256)
```

_Number of mappers onboarded by their owners._

### mappersOwned

```solidity
function mappersOwned(address owner) external view returns (uint256)
```

_Number of mappers the given owner has._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | address to retrieve the number of onboarded gateways |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | number of gateways the given owner has onboarded |
### mappersOwnedPaged

```solidity
function mappersOwnedPaged(address owner, uint256 start, uint256 end) external view returns (struct IMapperRegistry.Mapper[])
```

_Return collection of mappers the given owner has in the range
[start, end)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | account of the owner to retrieve mappers for |
| start | uint256 | start index (inclusive) |
| end | uint256 | end index (exclusive) |

## Events

### MapperRegistered

```solidity
event MapperRegistered(bytes32 mapperId)
```

_raised when a mapper is registered_

### MapperRemoved

```solidity
event MapperRemoved(bytes32 mapperId)
```

_raised when a mapper is removed from the registry by ThingsIX_

### MapperOnboarded

```solidity
event MapperOnboarded(bytes32 mapperId, address owner)
```

_raised when a mapper is onboarded by its new owner_

### MapperClaimed

```solidity
event MapperClaimed(bytes32 mapperId)
```

_raised when a mapper is claimed by ThingsIX_

### FrequencyPlanAdded

```solidity
event FrequencyPlanAdded(uint8)
```

_FrequencyPlanAdded raised when a new frequency plan is added_

### FrequencyPlanRemoved

```solidity
event FrequencyPlanRemoved(uint8)
```

_FrequencyPlanRemoved raised when a frequency plan is removed_

### MapperTransferred

```solidity
event MapperTransferred(bytes32 mapperId, address oldOwner, address newOwner)
```

_raised when a mapper is transferred to a new owner_

### MapperInactive

```solidity
event MapperInactive(bytes32 mapperId)
```

_raised when a mapper is deactivated_

### MapperActive

```solidity
event MapperActive(bytes32 mapperId)
```

_raised when a mapper is activated_

## Structs

### Mapper

```solidity
struct Mapper {
  bytes32 id;
  uint16 revision;
  address owner;
  uint8 frequencyPlan;
  bool active;
}
```

