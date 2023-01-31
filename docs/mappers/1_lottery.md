---
sidebar_position: 1
title: Mapper lottery
---

# Mapper lottery
To obtain a mapper users can participate in a lottery by buying a ticket with an 
ERC20 token. After the ticket buy period closes and a cool down period passes, a
random value can be requested by anyone from [ChainLinks VRF](https://chain.link/vrf) 
Oracle through the lottery web app. Only the first request succeeds, other attempts 
will fail. So don't worry when your transaction fails, someone else was faster.
When the oracle accepts the request, it will respond with a random value after a
while. This random value is used to perform the lottery draw that determines the
winning tickets. This ensure that the ThingsIX foundation has no influence on
the lottery results. Users that have a winning ticket will receive the mapper on
the shipping address they provided when buying the ticket. Users that lost can 
claim the tokens they paid for their ticket back.

When the foundation has a batch of mappers available, it will create and 
announce a lottery. Mappers only support a single frequency plan and all mappers
in a lottery have the same frequency plan. Users that want to obtain a mapper 
will need to ensure that they participate **only** in lotteries with mappers 
that support the frequency plan the user is interested in. Otherwise, they will 
receive a mapper for a different frequency plan that cannot be used locally.

:::info
Mappers cannot be bought from the ThingsIX foundation, only won in a lottery. 
Mappers always remain a property of the ThingsIX foundation. 
:::

### Ticket buying process
Buying a ticket involves several steps that are explained in this section.

#### Provide shipping address
The first step in buying a ticket is to provide contact details, shipping 
address and accept the [user agreement](/files/User_Agreement_for_ThingsIX_Mappers_for_Batch_2023-1.pdf). 
If you win these details are used to ship the mapper to you. Because the ticket 
is administered on-chain and the contact details and shipping details are stored
in a database for privacy reasons they need to be linked. This is done by 
signing the provided information with the same account as which the ticket will 
be bought. This cross correlation is used to associate the ticket with the 
provided information. Therefore you will be asked to sign the data.

#### Grant withdraw
Tickets can be bought with an ERC20 token. Unfortunately the 
[ERC20 specification](https://eips.ethereum.org/EIPS/eip-20) is limited in its
functionality and lacks support to add extra data to a transfer. The result is
that with most ERC20 tokens there is no method to buy a ticket and transfer the
tokens in a single transaction. This was later remediated in 
[1363](https://eips.ethereum.org/EIPS/eip-1363). But this standard is fairly new
and not supported by most ERC20 tokens.

Therefore, the lottery smart contract uses the withdraw pattern. Before the user
can buy the ticket, he will need to grant the lottery contract an allowance to 
transfer tokens for 1 ticket from the ERC20 token contract on the user's behalf.
This is done with `ERC20.approve`.

#### Buy ticket
The last step is to buy the ticket. Each address can buy 1 ticket. The lottery
contract will perform various checks and if all checks pass it will make the 
withdraw and create a new ticket that is assigned to the user.

### Request draw random value
After the ticket buy period passes, there is a cooldown period in which the 
lottery is freezed. After this cooldown period passes anyone can request a 
random value through the dashboard that is used for the lottery draw. This 
random value is retrieved from the [ChainLinks VRF](https://chain.link/vrf) 
Oracle. This is an independant source of random data and the ThingsIX foundation 
has no relation with Chainlink apart from a subscription that pays for their 
service. This guarantees that the ThingsIX Foundation can't influence the 
lottery results.

:::caution
Only the first random request is accepted. It is possible that your random
request fails because someone else was faster. This is normal and no reason to
worry.
:::

After the Oracle accepted the request it will provide a random value to the 
lottery smart contract. This will take some time. Once the lottery received the
random value it will store it on-chain and associates it with the lottery. The
dashboard will also show this random value once it's available.

### Offline draw
With the random value available the ThingsIX Foundation will determine the 
results. It uses an open source tool that can be found 
[here](https://github.com/ThingsIXFoundation/mapper-lottery). The algorithm to
perform the draw can be found [here](https://github.com/ThingsIXFoundation/mapper-lottery/blob/main/draw/draw.go). With this tool it is possible to determine the results yourself and verify that the ThingsIX 
Foundation published the results correct.

### View results
Once the ThingsIX Foundation has published the results the dashboard will show
an indication if you won or lost in the lottery. If you lost, you are given the
ability to claim the tokens you paid for your ticket back. If you won, you will
receive the mapper on the shipping address provided during the ticket buying
process.

# Verify lottery results
First compile the tool with the instructions in the [repository](https://github.com/ThingsIXFoundation/mapper-lottery).

You will need to provide the lottery contract address that can be found
[here](/background/smart-contracts.md). In addition you will need to provide an
RPC endpoint to a Polygon RPC node. Polygon offers a free to use endpoint on
`https://polygon-rpc.com` but we have found this endpoint not always to work.
Chainlist also offers a [list](https://chainlist.org/?search=polygon) of free to
use Polygon RPC endpoints (click on the drop down arrow in the Polygon Mainnet 
box) that you can try. There are also commercial parties offering an RPC 
endpoint. Some of these offer a free endpoint for low usage after you create an 
account. An example is [Alchemy](https://www.alchemy.com). 

Request a list of lotteries to determine for which lottery you want to verify
the results for:

```bash
$ ./mapper-lottery --lottery-contract <lottery-contract-address> --rpc-endpoint <rpc-endpoint> list
+---------+----------+-------------------------------+-------------------------------+--------------------------------------------------------------------+--------------+--------+-------------------+--------------+--------------------------------------------+
| LOTTERY |  STATUS  |             START             |              END              |                            DRAW RANDOM                             | TICKET PRICE | MAPPER | MAPPERS AVAILABLE | TICKETS SOLD |                   TOKEN                    |
+---------+----------+-------------------------------+-------------------------------+--------------------------------------------------------------------+--------------+--------+-------------------+--------------+--------------------------------------------+
|       1 | open     | 2023-01-24 10:08:20 +0100 CET | 2023-01-25 01:08:20 +0100 CET |                                                                    | 1.0 USDC     | EU868  |                 2 |            0 | 0xE097d6B3100777DC31B34dC2c58fB524C2e76921 |
|       2 | finished | 2023-01-24 10:20:48 +0100 CET | 2023-01-24 10:35:48 +0100 CET | 0xeea7384c878c8cd94352e2c9041c7f61a7b0486cfd768daff7ee0f650e124e89 | 1.0 USDC     | EU868  |                 2 |            3 | 0xE097d6B3100777DC31B34dC2c58fB524C2e76921 |
+---------+----------+-------------------------------+-------------------------------+--------------------------------------------------------------------+--------------+--------+-------------------+--------------+--------------------------------------------+
```

In this example there are 2 lotteries. The first is still running and the second 
lottery is finished and the results are available. Lets check which tickets won 
and which tickets not for lottery `2`. We also provide the `--verify` flag. 
With this flag the tool will check for ~20% random tickets the locally 
calculated results with the results stored in the lottery draw. If it finds a 
deviation it will print a warning with the ticket and lottery number for which 
the result doesn't match.

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
