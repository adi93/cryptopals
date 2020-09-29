# Cryptopals
Solution set for [cryptopals](https://cryptopals.com/) challenge, written in Node.js

Bear in my mind that doing these challenges is my way of learning both practical cryptography AND javascript. As such, don't use these as a reference on how to write idiomatic javascript.

No external dependencies are required, and each file can be run in isolation (except in case when it needs to read from an external file). I preferred to duplicate code here, since I was learning a new language.

## Table of contens
Set 1:
* [Challenge 1 - Convert hex to base64](set1/hex_to_base64.js)
* [Challenge 2 - Fixed xor](set1/xor.js)
* [Challenge 3 - Single Byte Xor](set1/single_byte_xor.js)
* [Challenge 4 - Detect single byte xor](set1/detect_single_byte_xor.js)
* [Challenge 5 - Repeating key xor](set1/repeating_key_xor.js)
* [Challenge 6 - Break repeating key xor](set1/break_repeating_key.js)
* [Challenge 7 - Implement AES in ECB](set1/encrypt_ecb.js)
* [Challenge 8 - Detect AES in ECB](set1/detect_ecb.js)

Set 2:
* [Challenge 9 - Implement PKCS#7 padding](set2/pkcs7_padding.js)
* [Challenge 10 - Implement CBC mode](set2/implement_cbc.js)
* [Challenge 11 - ECB/CBC detection oracle](set2/ecb_detect_oracle.js)
* [Challenge 12 - Byte at a time ECB decryption](set2/byte_at_time_ecb.js)
* [Challenge 13 - ECB cut and paste](set2/ecb_cut_and_paste.js)
* Challenge 14 - TODO
* [Challenge 15 - PKCS#7 padding validation](set2/pkcs7_padding_validation.js)
* [Challenge 16 - CBC bitflipping attack](set2/cbc_bitflip.js)

Set 5:
 * [Challenge 33 - Implement Diffie-Hellman](set5/implement_dh.js)