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
   * Extract the device ID from a decoded token. Verifies if the device ID is
   * a valid UUID.
   * @param {object} [token=null] The decoded token payload
   * @return {Promise} Resolves with the device ID
   */
  static getDeviceIdFromToken (token = null) {
    if (!token || token === null) {
      return Promise.reject(new TypeError('invalid token supplied'))
    } else if (!token.deviceId || !validator.isUUID(token.deviceId)) {
      return Promise.reject(new Error('missing or invalid device id'))
    }
    return Promise.resolve(token.deviceId)
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
    } else if (token.payload) {
      token = token.payload
    }
    return Signer.isValidSignSecret(signSecret).then(() => {
      return jwt.verify(token, signSecret, options)
    })
  }
}

exports = module.exports = Auth
