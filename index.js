const contract = require('./build/contract.json')
const { abi } = require('eth-serde')
const { format, parse } = require('eth-helpers/utils')

module.exports = class VegaTokenProxy {
  constructor (addr) {
    this._addr = addr
  }

  balanceOf (addr, tx = {}) {
    return this._tx(abi.encodeMethod('balanceOf', ['address'], [addr]), tx)
  }

  name (tx = {}) {
    return this._tx(abi.encodeMethod('name', []), tx)
  }

  totalSupply (tx = {}) {
    return this._tx(abi.encodeMethod('totalSupply', []), tx)
  }

  symbol (tx = {}) {
    return this._tx(abi.encodeMethod('symbol', []), tx)
  }

  decimals (tx = {}) {
    return this._tx(abi.encodeMethod('decimals', []), tx)
  }

  _tx (data, tx = {}) {
    return Object.assign(tx, {
      to: this._addr,
      data: '0x' + data.toString('hex')
    })
  }

  static create ({ erc20Address, vestingAddress }) {
    return format.bytes(abi.encodeConstructor(
      parse.bytes(contract.bytecode),
      ['address', 'address'],
      [erc20Address, vestingAddress]
    ))
  }
}
