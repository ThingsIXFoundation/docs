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

| Contract  | Address  | ABI | Docs |
|---|---|---|---|
| THIXM | [0xA68f199c095a6e675f462DE92012F673842C636f](https://polygonscan.com/token/0xa68f199c095a6e675f462de92012f673842c636f) | [ABI](/files/IThixM.json) | [read](./tokens/IThixM) |
| RouterRegistry | [0xd6bcc904C2B312f9a3893d9D2f5f2b6b0e86f9a1](https://polygonscan.com/address/0xd6bcc904C2B312f9a3893d9D2f5f2b6b0e86f9a1) | [ABI](/files/IRouterRegistry.json) | [read](./router/IRouterRegistry) |
| MapperLottery | [0x56A3bC7a559b79dE0701077607964f647aE3cbC0](https://polygonscan.com/address/0x56A3bC7a559b79dE0701077607964f647aE3cbC0) | |

</TabItem>
<TabItem value="testnet">

Polygon mumbai, chain id `80001`.

| Contract  | Address  | ABI | Docs |
|---|---|---|---|
| THIXM | [0x708df53f8D9d4A3765348fCD60f09d9B5c4Ca38b](https://mumbai.polygonscan.com/address/0x708df53f8D9d4A3765348fCD60f09d9B5c4Ca38b)  | [ABI](/files/IThixM.json) | [read](./tokens/IThixM) |
| THIX | [0x82766B9447ba0b854103ea8A78163E14772811ad](https://mumbai.polygonscan.com/address/0x82766B9447ba0b854103ea8A78163E14772811ad) | [ABI](/files/IThix.json) | [read](./tokens/IThix) |
| RewardsChequeProcessor | [0xfd4e18Db321652Be9C96EdBCF4648D97b2d8fD6B](https://mumbai.polygonscan.com/address/0xfd4e18Db321652Be9C96EdBCF4648D97b2d8fD6B) | [ABI](/files/IRewardsChequeProcessor.json) | [read](./tokens/rewards/IRewardsChequeProcessor) |
| RouterRegistry | [0x0764a5d5557A2E1c57D5c394f81b5B013d45F570](https://mumbai.polygonscan.com/address/0x0764a5d5557A2E1c57D5c394f81b5B013d45F570) | [ABI](/files/IRouterRegistry.json) | [read](./router/IRouterRegistry) |
| GatewayRegistry | [0x990d9F70EE5fa7389b416E674581982523eDe654](https://mumbai.polygonscan.com/address/0x990d9F70EE5fa7389b416E674581982523eDe654) | [ABI](/files/IGatewayRegistry.json) | [read](./gateways/IGatewayRegistry) |
| GatewayOnboardingPlain | [0xa9f2F4f130541E32209cE04950b6978e8Dd97043](https://mumbai.polygonscan.com/address/0xa9f2F4f130541E32209cE04950b6978e8Dd97043) | [ABI](/files/IGatewayOnboardingPlain.json) | [read](./gateways/IGatewayOnboardingPlain) |
| GatewayOnboardingPlainBatch | [0xe685A0826419Bc982c9278eA7798143Fe7CF9f11](https://mumbai.polygonscan.com/address/0xe685A0826419Bc982c9278eA7798143Fe7CF9f11) | [ABI](/files/IGatewayOnboardingPlainBatch.json) | [read](./gateways/IGatewayOnboardingPlainBatch) |
| GatewayPlainUpdater | [0x7f7c82a9CfF1b3eF8dCee663162c1F7C3765Eab2](https://mumbai.polygonscan.com/address/0x7f7c82a9CfF1b3eF8dCee663162c1F7C3765Eab2) | [ABI](/files/IGatewayUpdaterPlain.json) | [read](./gateways/IGatewayUpdaterPlain) |
| GatewayTransferrer | [0xf8444576A32C0b3cc78c7A0B8BA703cA74E68AFb](https://mumbai.polygonscan.com/address/0xf8444576A32C0b3cc78c7A0B8BA703cA74E68AFb) | [ABI](/files/IPlainGatewayTransferrer.json) | [read](./gateways/IGatewayTransferrer) |
| MapperRegistry | [0x3f4ea31374743561049CceaA593202e5D0DFC579](https://mumbai.polygonscan.com/address/0x3f4ea31374743561049CceaA593202e5D0DFC579) | [ABI](/files/IMapperRegistry.json) | [read](./mappers/IMapperRegistry) |

</TabItem>
</Tabs>