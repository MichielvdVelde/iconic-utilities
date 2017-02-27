/**
 * Platforms
**/
const PLATFORMS = {
  WNS: 'WNS',
  ADM: 'ADM',
  GCM: 'GCM',
  APN: 'APN'
}

/**
 * Class representing a push messaging token.
 */
class Token {

  /**
   * Get the type - platform - for a token. Shamelessly stolen from
   * https://github.com/appfeel/node-pushnotifications/blob/master/src/push-notifications.js.
   * @param {string} [token=null] The string to get the token type of
   * @return {string|boolean} Platform if the token is valid, false otherwise
   */
  static getType (token = null) {
    if (token instanceof Token) {
      return token.type
    } else if (token === null) {
      return false
    } else if (token.length && token.substring(0, 4) === 'http') {
      return PLATFORMS.WNS
    } else if (token.length && /(amzn|adm)/i.test(token)) {
      return PLATFORMS.ADM
    } else if (token.length && token.length > 64) {
      return PLATFORMS.GCM
    } else if (token.length && token.length === 64) {
      return PLATFORMS.APN
    }
    return false
  }

  /**
   * Check if a string is a valid token.
   * @param {string} [token=null] The string to test
   * @return {boolean} Whether the string is a valid key
   */
  static isValid (token = null) {
    return token !== null && Token.getType(token)
  }

  /**
   * Create a new Token instance with a set token.
   * @param {string} [token=null] The token string
   * @return {Promise} Resolves with a new instance of Token
   */
  static create (token = null) {
    if (!Token.isValid(token)) {
      return Promise.reject(new TypeError('invalid token format'))
    }
    return Promise.resolve(new Token(token))
  }

  /**
   * Create a new Token.
   * @param {string} [token=null] The token string
   */
  constructor (token = null) {
    if (token instanceof Token) {
      token = token.toString()
    }
    if (!Token.isValid(token)) {
      throw new TypeError('invalid token format')
    }
    this._token = token
    this._type = Token.getType(token)
  }

  /**
   * Token type - platform.
   * @return {string} The token type
   */
  get type () {
    return this._type
  }

  /**
   * Convert the token into a string.
   * @return {string} The token string
   */
  toString () {
    return this._token
  }
}

exports = module.exports = Token
exports.PLATFORMS = module.exports.PLATFORMS = PLATFORMS
