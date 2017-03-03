const validator = require('validator')

class Util {
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
}

exports = module.exports = Util
