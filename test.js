const test = require('tape')
const Nanoeth = require('nanoeth/http')
const { utils, units } = require('eth-helpers')
const { abi, rlp } = require('eth-serde')
const eth = new Nanoeth('http://localhost:8545')
const VegaTokenProxy = require('.')

test('simple', async function (assert) {
  // Deterministic addresses from the first run of `truffle test`
  // in vegaproject/Vega_Token_V2
  const erc20Address = '0xAc6F6038bf90fb4DF40a54705F8f3Ca87fe01A11'
  const vestingAddress = '0xa956B5c58B4Ac8Dd1D44Ade3e8972A16e9C917E4'

  const tx = await mined(eth, {
    data: VegaTokenProxy.create({
      erc20Address,
      vestingAddress
    }),
    from: await eth.coinbase(),
    gasLimit: (await eth.getBlockByNumber(await eth.blockNumber())).gasLimit,
    gasPrice: await eth.gasPrice()
  })

  const contract = new VegaTokenProxy(tx.contractAddress)
  console.log(tx.contractAddress)

  const name = decodeString(await eth.call(contract.name(), 'latest'))
  assert.equal(name, 'Vega (Locked)', 'IERC20.name()')

  const symbol = decodeString(await eth.call(contract.symbol(), 'latest'))
  assert.equal(symbol, 'VEGA', 'IERC20.symbol()')

  const symbol2 = await eth.call({ to: tx.contractAddress, data: '0x06fdde03' }, 'latest')
  console.log(symbol2)

  const decimals = utils.parse.number(await eth.call(contract.decimals(), 'latest'))
  assert.equal(decimals, 18, 'IERC20.decimals()')

  const totalSupplyTx = contract.totalSupply()
  const totalSupply = utils.parse.bigint(await eth.call(totalSupplyTx, 'latest'))
  totalSupplyTx.to = erc20Address
  const totalSupplyErc20 = utils.parse.bigint(await eth.call(totalSupplyTx, 'latest'))

  assert.equal(totalSupply, totalSupplyErc20, 'IERC20.totalSupply()')

  const userAddr = '0x4ac2efe06b867213698ab317e9569872f8a5e85a'
  const proxyBalance = utils.parse.bigint(await eth.call(contract.balanceOf(userAddr)))
  const vestingBalance = utils.parse.bigint(await eth.call({
    to: vestingAddress,
    data: '0x' + abi.encodeMethod('user_total_all_tranches', ['address'], [userAddr]).toString('hex')
  }))

  assert.equal(proxyBalance, vestingBalance, 'IERC20.balanceOf(userAddr)')

  assert.end()
})

async function mined (eth, tx) {
  const id = await eth.sendTransaction(tx)
  return eth.getTransactionReceipt(id)
}

function decodeString (hex) {
  const items = hex.slice(2).split(/(.{32})/)
  console.log(items)
  const res = rlp.decode(Buffer.from(hex.slice(2), 'hex'))
  console.log(res)
  return res
}
