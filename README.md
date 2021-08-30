# `vega-locked-erc20`

> VEGA-LOCKED ERC20 contract, conveniently showing locked VEGA tokens

## Purpose

This contract is an experiment in exposing the balance of locked VEGA tokens
in an ERC20 compatible way. It proxies calls to the VEGA vesting contract, but is
"read-only".

|                                             | Supported |
|:--------------------------------------------|:----------|
| `name()`                                    |     ✔️    |
| `symbol()`                                  |     ✔️    |
| `decimals()`                                |     ✔️    |
| `totalSupply()`                             |     ✔️    |
| `balanceOf(address)`                        |     ✔️    |
| `transfer(address, uint256)`                |     ❌    |
| `transferFrom(address, address, uint256)`   |     ❌    |
| `approve(address, uint256)`                 |     ❌    |
| `allowance(address, address)`               |     ❌    |
| `event Transfer(address, address, uint256)` |     ❌    |
| `event Approval(address, address, uint256)` |     ❌    |

## Usage

The contract is written in YUL, the Solidity IR. This allows for more
fine-grained control and is more gas efficient. In this case it was done to
showcase what a YUL contract might look like.

To initialize the contract the ERC20 V2 Token address and Vesting Contract
address must be appended to the bytecode as `uint256` (word-size of EVM).

Once the contract is deployed, it adheres to the usual Solidity ABI, except
for the methods listed above which are not supported. The JSON ABI can be found
in [`abi.json`](abi.json).

## Deployment details
- Ethereum Mainnet: [0x78344c7305d73a7a0ac3c94cd9960f4449a1814e](https://etherscan.io/token/0x78344c7305d73a7a0ac3c94cd9960f4449a1814e)

## License

[MIT](LICENSE)
