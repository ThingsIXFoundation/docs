---
title: Contracts
sidebar_position: 2
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Overview contracts

<Tabs
    defaultValue="mainnet"
    values={[
        {label: 'Mainnet', value: 'mainnet'},
        {label: 'Testnet', value: 'testnet'},
    ]}>
<TabItem value="mainnet">

Polygon mainnet, chain id `137`.

| Contract  | Address  | ABI |
|---|---|---|
| THIXM | [0xA68f199c095a6e675f462DE92012F673842C636f](https://polygonscan.com/token/0xa68f199c095a6e675f462de92012f673842c636f) | [ABI](/files/IThixM.json) |
| RouterRegistry | [0xd6bcc904C2B312f9a3893d9D2f5f2b6b0e86f9a1](https://polygonscan.com/address/0xd6bcc904C2B312f9a3893d9D2f5f2b6b0e86f9a1) | [ABI](/files/IRouterRegistry.json) |
| MapperLottery | [0x56A3bC7a559b79dE0701077607964f647aE3cbC0](https://polygonscan.com/address/0x56A3bC7a559b79dE0701077607964f647aE3cbC0) | |

</TabItem>
<TabItem value="testnet">

Polygon mumbai, chain id `80001`.

| Contract  | Address  | ABI |
|---|---|---|
| THIX | [0x16ce047aF2EcCfCfE33F13365e279B36a18F9436](https://mumbai.polygonscan.com/address/0x16ce047aF2EcCfCfE33F13365e279B36a18F9436) | [ABI](/files/IThix.json) |
| RewardsChequeProcessor | [0x02FF3536843Dc6bbEfCC204b317a2918E30C8970](https://mumbai.polygonscan.com/address/0x02FF3536843Dc6bbEfCC204b317a2918E30C8970) | [ABI](/files/IRewardsChequeProcessor.json) |
| THIXM | [0xe8A1a341711322b43522146573ad108140897728](https://mumbai.polygonscan.com/address/0xe8A1a341711322b43522146573ad108140897728)  | [ABI](/files/IThixM.json) |
| RouterRegistry | [0x0DD3c6DD3e8290C7f9EFac200FbA3861C4522c7a](https://mumbai.polygonscan.com/address/0x0DD3c6DD3e8290C7f9EFac200FbA3861C4522c7a) | [ABI](/files/IRouterRegistry.json) |
| GatewayRegistry | [0x862bA7c5DE838AC807Bc1e937f48153d427b8388](https://mumbai.polygonscan.com/address/0x862bA7c5DE838AC807Bc1e937f48153d427b8388) | [ABI](/files/IGatewayRegistry.json) |
| GatewayOnboardingPlain | [0x593cc9A3920474792d5e8e4933488Ba61FeA78fa](https://mumbai.polygonscan.com/address/0x593cc9A3920474792d5e8e4933488Ba61FeA78fa) | [ABI](/files/IGatewayOnboardingPlain.json) |
| GatewayOnboardingPlainBatch | [0x1095A1d113d71A0397F9a11eFBb8553B5424F06F](https://mumbai.polygonscan.com/address/0x1095A1d113d71A0397F9a11eFBb8553B5424F06F) | [ABI](/files/IGatewayOnboardingPlainBatch.json) |
| GatewayPlainUpdater | [0xdE663ed2bF0080C3B513f948FC2b4483D597E280](https://mumbai.polygonscan.com/address/0xdE663ed2bF0080C3B513f948FC2b4483D597E280) | [ABI](/files/IGatewayUpdaterPlain.json) |
| GatewayTransferrer | [0x5d54Cefe3a8BA79bfda737b2DA8981008120a86A](https://mumbai.polygonscan.com/address/0x5d54Cefe3a8BA79bfda737b2DA8981008120a86A) | [ABI](/files/IPlainGatewayTransferrer.json) |
| MapperRegistry | [0x6487c5C5B8b40F5d289DDD1296576Ae1AdF63f02](https://mumbai.polygonscan.com/address/0x6487c5C5B8b40F5d289DDD1296576Ae1AdF63f02) | [ABI](/files/IMapperRegistry.json) |

</TabItem>
</Tabs>