---
sidebar_position: 2
title: Identities
---
For correct operations ThingsIX requires that gateways, mappers and routers are
identifiable and are able to proof their identify. This is
done through an ECDSA keypair on the secp256k1 curve. The public key is used to
derive a ThingsIX id that identifies the entity and is registered in the
ThingsIX smart contracts.

:::caution
Not all ECDSA keypairs are valid ThingsIX keypairs. Please read the next section
careful to generate a valid ThingsIX keypair.
:::

## Generation
To generate a valid ThingsIX id the user will need to generate a ECDSA secp256k1
keypair that satisfies a constraint that ThingsIX dictates. So explain this
constraint we will first describe what a public key is and how it can be 
represented.

A public key is a point on the secp256k1 curve and consists of an X and Y value,
both 256 bits numbers that are concatenated together. This is called the 
uncompressed public key and a `0x04` byte is prefixed to it to mark it as such. 
This make the total uncompressed public key 520 bit long. ThingsIX uses the 
Polygon blockchain that uses the 256 bits Ethereums Virtual Machine (EVM). 
Therefore working and storing 520 bits uncompressed keys is inefficient and 
expensive since many instructions will only work on 256 bits and storing 520 
bits values requires 3 storage slots.

Since the curve and its parameters are [public](https://neuromancer.sk/std/nist/P-256)
the Y value can be calculated from the X value and therefore redundant. The
public key without the Y components saves 256 bits and is therefore called the
compressed public key. There is 1 complication, due to characteristics of the EC 
curve for each X coordinate there are 2 valid Y coordinates (called even and odd).
Therefore the full public key can not be derived from just the X coordinate. This 
is solved by prefixing the X coordinate with a `0x02` (even) or `0x03` (odd) byte. 
With this information the full uncompressed public key can always be calculated 
from just the X coordinate. The downside is that the X coordinate with this byte 
prefix is 264 bits and still inefficient to use in the EVM.

ECDSA provides enough security margin to apply another trick. ThingsIX only
accepts "even" keys. These are keys from which the compressed public key starts
with the `0x02` prefix. The registry stores only the X value and when the public
key is needed the X value is prefixed with `0x02` to assemble the full compressed
public key. From this compressed for the full uncompressed public key can be 
derived. Since the X coordinate without the prefix is 256 bits the EVM can work 
on it efficiently reducing transaction costs. The downside is that only the
"even" keys are valid and there is no efficient method to generate valid
ThingsIX keys. Since half of the keys are valid a brute force approach to simply
generate keypairs until a valid ThingsIX keypair is created is practically
feasible.

Both the ThingsIX packet forwarder and router have support to automatically
generate valid ThingsIX identity keys. But it is also possible to generate these
keys with your prefer software. Here are some examples how to generate a valid
key:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="shell" label="shell">

```shell
#!/usr/bin/env sh

set -e

PRIVATE_KEY_FILE=thingsix-private-key.pem

while :
do
    # generate ECDSA secp256k1 key
    openssl ecparam -name secp256k1 -rand /dev/random -genkey -noout -out $PRIVATE_KEY_FILE 2> /dev/null
    # accept key only if its public key is even
    COMPRESSED_PUB_KEY=$(openssl ec -in $PRIVATE_KEY_FILE -pubout -conv_form compressed -outform der 2> /dev/null | tail -c 33 | xxd -p -c 33)
    case $COMPRESSED_PUB_KEY in 02*)
        echo "private key stored in: $PRIVATE_KEY_FILE"
        echo "compressed public key: $COMPRESSED_PUB_KEY"
        exit
    esac
done
```

</TabItem>

<TabItem value="js" label="javascript">

```js
const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');

function generateKey() {
   for (;;) {
      // generate random key and test if it's on the EC curve
      const privateKey = randomBytes(32);
      if (secp256k1.privateKeyVerify(privateKey)) {
         // accept key only if its public key is even
         const compressedPublicKey = secp256k1.publicKeyCreate(privateKey);
         if (compressedPublicKey[0] == 0x02) {
            return privateKey;
         }
      }
   }
}
```

</TabItem>

<TabItem value="rust" label="rust">

```rust
use p256::ecdsa::{SigningKey, VerifyingKey};
use sec1::point::Tag;
use rand_core::OsRng;

fn generate_key() -> SigningKey {
   loop {
      // generate key
      let key = SigningKey::random(&mut OsRng);
      // accept key only if its public key is even
      let pub_key_point = VerifyingKey::from(&key).to_encoded_point(true);
      if pub_key_point.tag() == Tag::CompressedEvenY {
         return key;
      };
   }
}
```
</TabItem>
</Tabs>
