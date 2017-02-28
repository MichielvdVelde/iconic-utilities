
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
  BCRYPT_HASH: /^\$2[ayb]\$.{56}$/
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
        return Promise.reject(new Error('invalid password'))
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
        return Promise.reject(new Error('invalid bcrypt hash'))
      } else {
        return Promise.resolve(false)
      }
    }
    return Promise.resolve(true)
  }
}

exports = module.exports = RegexValidator
