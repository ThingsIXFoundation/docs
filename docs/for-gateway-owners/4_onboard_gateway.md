---
sidebar_position: 4
title: Register gateway in ThingsIX
---
# Introduction
Before a gateway is operational in ThingsIX it must be onboarded and its owner
must set details such as antanna gain and location. The ThingsIX dashboard
provides a method to perform these operations.

Currently the testnet dashboard is available at https://app-testnet.thingsix.com.

## Wallet requirements
Before you can start registering your gateways and earn rewards you will need to
setup your wallet. With this wallet you will manage your gateways and receive
earned rewards. You will require a wallet that:
- support the Polygon network (Mumbai for testnet)
- supports ERC-20 tokens and contract interactions
- contains Polygon Matics to pay for transaction fees

The dashboard currently supports [Metamask](https://metamask.io),
[Coinbase Wallet APP](https://www.coinbase.com/wallet) and any wallet that can
be connected with [WalletConnect](https://walletconnect.com) and satisfies the
above stated requirements.

## Prepare wallet

### Matics
ThingsIX is build on the Polygon blockchain. Polygon uses the Matic token to pay
for transaction fees. Polygon offers a [faucet](https://faucet.polygon.technology)
that you can use to obtain some test Matics on their Mumbai testnet.

After obtaining testnet Matics it is time to connect your wallet in the
dashboard. On the top right in the dashboard there is a button to connect your
wallet. Select your wallet type and after the wallet connected successfully the
wallet address is shown on the top right.

### THIX
Next step is to obtain THIX tokens. ThingsIX offers a faucet on testnet that can
be used to obtain some testnet THIX tokens. Navigate to the wallet page in the
top menu. On the bottom of the wallet page click on the `Generate rewards`
button. Your wallet will ask you for your confirmation. After the transaction is
processed  you will see THIX tokens in your wallet. You are now ready to start
onboarding your gateways.

## Onboard gateway
When adding your gateways to the ThingsIX forwarder you collected for each
gateway an onboard message. You will require these now. Navigate to the onboard
page through the menu with `Gateways` -> `Onboard`.

![Gateway onboard form](/img/gateway_onboard_form.png)

:::note
On the top right there is a button that opens another gateway onboard form with
support to onboard multiple gateways at once. If you have many gateways to 
onboard it can save time.
:::

Onboarding a gateway requires the user to pay a fee. This fee is set in EUR
but paid with THIX tokens. With a THIX/EUR exchange rate the amount of THIX
tokens are calculated. When the onboard is successful the THIX tokens that paid
for the fee are burned and taken out of circulation.

After you filled in the form with the values from the onboard message that you
obtained from the forwarder the form will show the current fee. Because the
THIX/EUR exchange rate updates frequently there is a change that the calculated
amount of THIX tokens to pay for the fee isn't enough at the moment that the
transaction is processed causing your onboard transaction to fail.

Therefore the form offers
you a method to set the max fee that you are willing to pay. It is guaranteed
that you never pay more than max fee. If max fee is higher than the onboard fee
at the moment the transaction is processed you will only pay for the current
onboard fee.

![Gateway onboard form](/img/gateway_onboard_form_fee.png)

After you press the `Onboard` button your wallet will ask you to sign the
onboard transaction. Once the transaction is processed navigate to the gateways
overview page through the menu `Gateways` -> `Overview`. You will now see a
pending gateway onboard event. We require 128 block confirmations before your
onboard is accepted.

![Gateway onboard form](/img/gateway_pending_onboard.png)

After 128 blocks the onboard is confirmed and you will see the gateway listed in
the `Onboarded gateways` list. You have now successfully onboarded your gateway.

## Set gateway details
The last step to do before your gateway is operational is to set its details.

![Gateway overview](/img/gateway_overview.png)

Click on the button in the last column of the gateway. This will take you to the
details page of the gateway. If the gateway is owned by the connected wallet the
dashboard shows several buttons on the right. With the `edit` button you can set
the details of the gateway and the `transfer` button allows you to send the
gateway to a different wallet.

Click on the `edit` button. A form opens that allows you to specify the gateway
specific settings. The frequency plan is automatically derived from the location
that you picked. Make sure to zoom in maximal when selecting the location. The
update fee has the same problem as the onboard fee that the THIX/EUR exchange
rate can change. Therefore you can set the max fee you are willing to pay here
as well.

:::info
Pay good care when setting these details. They are used in the coverage mapping
process. If not correct you risk that mapping your gateway fails and your
gateway won't be able to earn rewards.
:::

![Gateway update form](/img/gateway_update_form.png)

Once the transaction is confirmed you will see the pending gateway update event
on the gateway overview page. ThingsIX requires 128 blocks before the update is
accepted. Once accepted your gateway is ready to use.

![Gateway update form](/img/gateway_pending_update.png)

The next time you navigate to the gateway details page you will see the entered
values.