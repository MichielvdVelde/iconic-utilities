const jwt = require('jsonwebtoken')
const validator = require('validator')

const Signer = require('./Signer')

/**
 * Class containing authentication methods.
 */
class Auth {
  /**
   * Decode a jwt without verifying it. If complete is false, only the payload
   * is returned.
   * @param {string} [token=null]      The encoded jwt token string
   * @param {boolean} [complete=false] Return the decoded payload and header
   * @return {Promise} Resolves with the decoded jwt
   */
  static decodeToken (token = null, complete = false) {
    if (!token || token === null) {
      return Promise.reject(new TypeError('invalid encoded jwt'))
    }
    const decoded = jwt.decode(token, { complete: complete })
    if (!decoded || decoded === null) {
      return Promise.reject(new Error('unable to decode token'))
    }
    return Promise.resolve(decoded)
  }

  /**
   * Verify a encoded token with the supplied sign secret.
   * @param {string} [token=null]      The encoded token
   * @param {string} [signSecret=null] The 32-character hex sign secret
   * @param {object} [options={}]      Options for jsonwebtoken
   * @return {Promise} Resolves with the decoded and verified token
   */
  static verifyToken (token = null, signSecret = null, options = {}) {
    if (!token || token === null) {
      return Promise.reject(new TypeError('missing or invalid token'))
    }
    return Signer.isValidSignSecret(signSecret).then(() => {
      return jwt.verify(token, signSecret, options)
    })
  }

  /**
   * Signs the payload into an encoded jwt using the provided sign secret.
   * @param {mixed} [payload=null]     The payload to encode
   * @param {string} [signSecret=null] The 32-character hexadecimal sign secret
   * @param {object} [optoins={}]      These are passed to jsonwebtoken.sign
   * @return {Promise} Resolves with the encoded and signed token
   */
  static signToken (payload = null, signSecret = null, options = {}) {
    if (!payload || payload === null) {
      return Promise.reject('invalid payload supplied')
    }
    return Signer.isValidSignSecret(signSecret).then(() => {
      return jwt.sign(payload, signSecret, options)
    })
  }
}

exports = module.exports = Auth
