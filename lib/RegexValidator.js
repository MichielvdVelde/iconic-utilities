const Boom = require('boom')

/**
 * Regular expressions used for the validator.
 * @type {Object}
 */
const REGEX = {
  /**
   * This regex will enforce these rules:
   *  - At least one upper case english letter, (?=.*?[A-Z])
   *  - At least one lower case english letter, (?=.*?[a-z])
   *  - At least one digit, (?=.*?[0-9])
   *  - At least one special character, (?=.*?[#?!@$%^&*-])
   *  - Minimum 8 in length .{8,} (with the anchors)
   * [http://stackoverflow.com/questions/19605150/regex-for-password-must-be-contain-at-least-8-characters-least-1-number-and-bot]
   * @type {RegExp}
   */
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,72}$/,
  /**
   * Regex to determine if a string is a valid bcrypt hash.
   * [http://stackoverflow.com/questions/31417387/regular-expression-to-find-bcrypt-hash]
   * @type {RegExp}
   */
  BCRYPT_HASH: /^\$2[ayb]\$.{56}$/,
  /**
   * Regex to validate a string as a valid base64 urlencoded JSON Web Token.
   * [https://github.com/brianloveswords/node-jws/blob/master/lib/verify-stream.js#L8]
   * @type {RegExp}
   */
  JWT: /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/
}

/**
 * Class which represents a validator.
 */
class RegexValidator {
  /**
   * Check to see is a string is a valid password.
   * If rejectOnInvalid is true, the promise will reject if the password is invalid.
   * Otherwise the promise will resolve with a boolean.
   * @param {string} [password=null] The password to check
   * @param {boolean} [rejectOnInvalid=true] Reject the promise if the password is invalid
   * @return {Promise} Depending on the setting, rejects or resolves with a bool
   */
  static isValidPassword (password = null, rejectOnInvalid = true) {
    if (!password || password === null || !REGEX.PASSWORD.test(password)) {
      if (rejectOnInvalid) {
        return Promise.reject(Boom.badRequest('invalid password'))
      } else {
        return Promise.resolve(false)
      }
    }
    return Promise.resolve(true)
  }

  /**
   * Check to see if a string is a valid bcrypt hash.
   * If rejectOnInvalid is true, the promise will reject if the string is invalid.
   * Otherwise the promise will resolve with a boolean.
   * @param {string} [password=null] The password to check
   * @param {boolean} [rejectOnInvalid=true] Reject the promise if the string is invalid
   * @return {Promise} Depending on the setting, rejects or resolves with a bool
   */
  static isValidBcryptHash (password = null, rejectOnInvalid = true) {
    if (!password || password === null || !REGEX.BCRYPT_HASH.test(password)) {
      if (rejectOnInvalid) {
        return Promise.reject(Boom.badRequest('invalid bcrypt hash'))
      } else {
        return Promise.resolve(false)
      }
    }
    return Promise.resolve(true)
  }

  /**
   * Check to see if a string is a valid base64 urlencoded JSON Web Token.
   * If rejectOnInvalid is true, the promise will reject if the string is invalid.
   * Otherwise the promise will resolve with a boolean.
   * @param {string} [token=null] The token to check
   * @param {boolean} [rejectOnInvalid=true] Reject the promise if the string is invalid
   * @return {Promise} Depending on the setting, rejects or resolves with a bool
   */
  static isValidJwtToken (token = null, rejectOnInvalid = true) {
    if (!token || token === null || !REGEX.JWT.test(token)) {
      if (rejectOnInvalid) {
        return Promise.reject(Boom.badRequest('invalid jwt'))
      } else {
        return Promise.resolve(false)
      }
    }
    return Promise.resolve(true)
  }
}

exports = module.exports = RegexValidator
