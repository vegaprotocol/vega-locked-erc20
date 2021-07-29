object "Proxy" {
  code {
    datacopy(0, dataoffset("runtime"), datasize("runtime"))

    datacopy(datasize("runtime"), datasize("Proxy"), 32)
    setimmutable(0, "vega_erc20_address", mload(datasize("runtime")))

    datacopy(datasize("runtime"), add(32, datasize("Proxy")), 32)
    setimmutable(0, "vega_vesting_address", mload(datasize("runtime")))

    return(0, datasize("runtime"))
  }

  object "runtime" {
    code {
      // Protection against sending Ether
      if gt(callvalue(), 0) { revert(0, 0) }

      // Dispatcher
      switch selector()
      case 0x70a08231 /* "balanceOf(address)" */ {
        let addr := loadimmutable("vega_vesting_address")
        mstore(0, shl(224, 0x15e1a382)) // "user_total_all_tranches(address)"
        mstore(4, calldataload(4)) // Load address from calldata

        // We just always expect this to work
        pop(staticcall(gas(), addr, 0, 36, 0, 32))
        return(0, 32)
      }
      case 0x18160ddd /* "totalSupply()" */ {
        let addr := loadimmutable("vega_erc20_address")
        mstore(0, shl(224, 0x18160ddd)) // "totalSupply()"

        // We just always expect this to work
        pop(staticcall(gas(), addr, 0, 4, 0, 32))
        return(0, 32)
      }
      case 0x06fdde03 /* "name()" */ {
        returnRLPString(dataoffset("name"), datasize("name"))
      }
      case 0x95d89b41 /* "symbol()" */ {
        returnRLPString(dataoffset("symbol"), datasize("symbol"))
      }
      case 0x313ce567 /* "decimals()" */ {
        returnUint(18)
      }
      default {
        revert(0, 0)
      }

      function selector() -> s {
        s := shr(224, calldataload(0))
      }

      function returnUint(v) {
        mstore(0, v)
        return(0, 0x20)
      }

      function returnRLPString (ptr, len) {
        mstore(0, 32) // RLP word size
        mstore(32, len) // RLP string length
        datacopy(64, ptr, len) // String data
        return(0, 96)
      }
    }

    data "name" "VEGA (locked)"
    data "symbol" "VEGA-LOCKED"
  }
}
