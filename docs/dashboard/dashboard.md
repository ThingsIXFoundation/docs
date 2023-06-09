---
sidebar_position: 1
---
# Dashboard
The ThingsIX dashboad can be used to manage your gateways, mappers and claim
earned rewards.

## Endpoint
| Environment  | URL  |
|---|---|
| Mainnet  | https://app.thingsix.com  |
| Testnet  | https://app-testnet.thingsix.com  |


## FAQ

### I'm have troubles connecting my wallet
If you are using a wallet plugin ensure that you only have 1 plugin installed
or activated. These plugins typically inject a [provider](https://eips.ethereum.org/EIPS/eip-1193)
object in the page. The dashboard uses this provider to interact with the
wallet. Most wallets make this provider available as `window.ethereum`. If there
are multiple plugins installed they can overwrite each others providers causing
unexpected problems. In case of problems try the dashboard in a new browser
profile and only install 1 wallet plugin. Some browsers such as [Brave](https://brave.com/)
come with integrated wallet support that can also cause problems.

ThingsIX uses the Polygon blockchain. Ensure that your wallet supports Polygon
and that you have selected the Polygon network.
