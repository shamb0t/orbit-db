'use strict'
const path = require('path')
const multihash = require('multihashes')
const CID = require('cids')

const notEmpty = e => e !== '' && e !== ' '

class OrbitDBAddress {
  constructor (root, path) {
    this.root = root
    this.path = path
  }

  toString () {
    return ['/orbitdb', this.root, this.path].join('/')
  }

  static isValid (pAddress) {
    let address = pAddress.toString().replace(/\\/g, '/')
    const containsProtocolPrefix = (e, i) => !((i === 0 || i === 1) && address.toString().indexOf('/orbit') === 0 && e === 'orbitdb')

    const parts = address.toString()
      .split('/')
      .filter(containsProtocolPrefix)
      .filter(notEmpty)

    let accessControllerHash

    try {
      accessControllerHash = (parts[0].indexOf('zd') > -1 || parts[0].indexOf('Qm') > -1)
        ? new CID(parts[0]).toBaseEncodedString()
        : null
    } catch (e) {
      return false
    }

    return accessControllerHash !== null
  }

  static parse (address) {
    if (!address)
      throw new Error(`Not a valid OrbitDB address: ${address}`)

    if (!OrbitDBAddress.isValid(address))
      throw new Error(`Not a valid OrbitDB address: ${address}`)

    const parts = address.toString()
      .replace(/\\/g, '/')
      .split('/')
      .filter((e, i) => !((i === 0 || i === 1) && address.toString().indexOf('/orbit') === 0 && e === 'orbitdb'))
      .filter(e => e !== '' && e !== ' ')
    return new OrbitDBAddress(parts[0], parts.slice(1, parts.length).join('/'))
  }
}

module.exports = OrbitDBAddress
