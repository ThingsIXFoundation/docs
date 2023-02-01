---
sidebar_position: 1
title: Mapper lottery
---

# Mapper lottery
To obtain a mapper, users can participate in a lottery by buying a ticket using
an ERC20 token. After the ticket buy period closes, a random value is generated
to determine the results. The ThingsIX Foundation will then publish the outcome,
and users with winning tickets will receive a mapper. Those who did not win can
reclaim the tokens they used to buy their tickets.

When the Foundation has a batch of mappers available, it will announce a lottery.
Note that mappers only support one frequency plan, and all mappers in a given
lottery will use the same frequency plan. Thus, users seeking a mapper must
ensure they participate in lotteries offering mappers that support the frequency
plan they are interested in.

:::info
Mappers cannot be bought from the ThingsIX Foundation; they can only be
allocated through a lottery. Mappers always remain the property of the ThingsIX
Foundation.
:::

# Ticket buying process
Buying a ticket involves several steps that are explained in this section.

## Provide shipping address
The first step in buying a ticket is to provide contact details, shipping 
address and accept the [user agreement](/files/User_Agreement_for_ThingsIX_Mappers_for_Batch_2023-1.pdf). 
If you win, these details are used to ship the mapper to you. Because the ticket 
is administered on-chain and the contact details and shipping details are stored
in a database for privacy reasons they need to be linked. This is done by signing
the provided information with the same account used to buy the ticket. This
cross-correlation is used to associate the ticket with the provided information.
Therefore you will be asked to sign the data when submitting your details.

## Grant withdraw
Tickets can be bought with an ERC20 token. Unfortunately the 
[ERC20 specification](https://eips.ethereum.org/EIPS/eip-20) is limited in its
functionality and lacks support to add extra data to a transfer. As a result,
most ERC20 tokens do not offer a method to purchase a ticket and transfer tokens
in a single transaction. This was later remediated in
[1363](https://eips.ethereum.org/EIPS/eip-1363). However, this standard is
relatively new and not supported by most ERC20 tokens.

Therefore, the lottery smart contract uses the withdraw pattern. Before the user
can buy the ticket, they must grant the lottery contract an allowance to 
transfer tokens for 1 ticket from the ERC20 token contract on their behalf.
This is done with `ERC20.approve`.

## Buy ticket
The last step is to buy the ticket. Each address can buy 1 ticket. The lottery
contract will perform various checks, and if all pass, it will make the 
withdraw and create a new ticket that is assigned to the user.

## Request draw random value
After the ticket buy period has ended, there is a cooldown period during which
the lottery is frozen. After this cooldown period has passed, anyone can request
a random value through the dashboard which is used for the lottery draw. This 
random value is retrieved from the [ChainLinks VRF](https://chain.link/vrf) 
Oracle, which is an independent source of random data. The ThingsIX Foundation
has no affiliation with Chainlink beyond a subscription that pays for their
service, ensuring that the ThingsIX Foundation cannot influence the lottery
results.

:::caution
Only the first random request will be accepted. It is possible that your request
may fail due to someone else being faster. This is normal and there is no cause
for concern.
:::

After the Oracle has accepted the request, it will provide a random value to the
lottery smart contract, which will take some time. Once the lottery has received
the random value, it will store it on-chain and associate it with the lottery.
The dashboard will also display this random value once it becomes available.

## Offline draw
With the random value available, the ThingsIX Foundation will determine the
results using an open-source tool, which can be found
[here](https://github.com/ThingsIXFoundation/mapper-lottery). The algorithm to
perform the draw can be found [here](https://github.com/ThingsIXFoundation/mapper-lottery/blob/main/draw/draw.go).
In summary, for each purchased ticket, a number is calculated based on the
buyer's wallet address, the ticket number, and the lottery's random value. The
tickets are then sorted by this number, and the first `available mappers` tickets
will win. With this tool, it is possible to calculate the results yourself and
verify that the ThingsIX Foundation has published the correct results.

## View results
Once the results are published by the ThingsIX Foundation, the dashboard will
indicate whether you have won or lost in the lottery. If you lost, you can claim
back the tokens you paid for your ticket. If you won, the mapper will be shipped
to the address provided during the ticket-buying process.

# Verify lottery results
First compile the tool with the instructions in the [repository](https://github.com/ThingsIXFoundation/mapper-lottery).

You will need to provide the lottery contract address that can be found
[here](/background/smart-contracts.md). In addition, you will need to provide an
RPC endpoint to a Polygon RPC node. Polygon offers a free-to-use endpoint on
`https://polygon-rpc.com`, but we have found that it does not always work.
Chainlist also offers a [list](https://chainlist.org/?search=polygon) of
free-to-use Polygon RPC endpoints (click on the drop-down arrow in the Polygon
Mainnet box) that you can try. There are also commercial parties offering an RPC 
endpoint, some of which offer a free endpoint for low usage after you create an
account. An example is [Alchemy](https://www.alchemy.com).

Request a list of lotteries to determine for which lottery you want to verify
the results:

```bash
$ ./mapper-lottery --lottery-contract <lottery-contract-address> --rpc-endpoint <rpc-endpoint> list
+---------+----------+-------------------------------+-------------------------------+--------------------------------------------------------------------+--------------+--------+-------------------+--------------+--------------------------------------------+
| LOTTERY |  STATUS  |             START             |              END              |                            DRAW RANDOM                             | TICKET PRICE | MAPPER | MAPPERS AVAILABLE | TICKETS SOLD |                   TOKEN                    |
+---------+----------+-------------------------------+-------------------------------+--------------------------------------------------------------------+--------------+--------+-------------------+--------------+--------------------------------------------+
|       1 | open     | 2023-01-24 10:08:20 +0100 CET | 2023-01-25 01:08:20 +0100 CET |                                                                    | 1.0 USDC     | EU868  |                 2 |            0 | 0xE097d6B3100777DC31B34dC2c58fB524C2e76921 |
|       2 | finished | 2023-01-24 10:20:48 +0100 CET | 2023-01-24 10:35:48 +0100 CET | 0xeea7384c878c8cd94352e2c9041c7f61a7b0486cfd768daff7ee0f650e124e89 | 1.0 USDC     | EU868  |                 2 |            3 | 0xE097d6B3100777DC31B34dC2c58fB524C2e76921 |
+---------+----------+-------------------------------+-------------------------------+--------------------------------------------------------------------+--------------+--------+-------------------+--------------+--------------------------------------------+
```

In this example there are 2 lotteries. The first one is still running, while the
second lottery has finished and the results are available. Let's check which
tickets won and which tickets lost for lottery `2`. We will also provide the
`--verify` flag. With this flag, the tool will compare the locally calculated
results with the results stored in the lottery draw for approximately 20% of the
random tickets. If it finds a deviation, it will print a warning with the ticket
and lottery number for which the result doesn't match.

```bash
$ ./mapper-lottery --lottery-contract <lottery-contract-address> --rpc-endpoint <rpc-endpoint> tickets 2 --verify
+------------+--------------------------------------------+--------------------------------------------------------------------+--------+
| TICKET NUM |                   BUYER                    |                              DRAW NUM                              | RESULT |
+------------+--------------------------------------------+--------------------------------------------------------------------+--------+
|          3 | 0x094CaB3eCd74ee71fC583CF737dBC474F72301b0 | 0x131ecd5d9e8bb660b71c52826d18a59d03264d365b2caf24ae95dff9a49b8780 | won    |
|          1 | 0x782123189312Aa15c2C50A87F7Fe737DE38f3569 | 0x69ec7af3ebb1df1fd21b1aa49a8bfc1fc9d6a6887d8808ba5e8fbd22573b11b3 | won    |
|          2 | 0xE10A9A4263eE02062f1248Ff79090cAF48176E01 | 0xf64e5e758d3e9a0bdda35f484eaee1fcd7a5e9a92a84f8ade1f4bd9423818cae | lost   |
+------------+--------------------------------------------+--------------------------------------------------------------------+--------+
winning ticket numbers: [1,3]
```
