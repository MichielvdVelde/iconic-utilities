const Token = require('./lib/Token')
const Signer = require('./lib/Signer')
const RegexValidator = require('./lib/RegexValidator')

const TOKEN = 'adm:dfjkwjlf'
const PASSWORD = 'Up6$fge4H6'
const HASH = '$2a$10$Xgb4E9HCat9QZ7gssIlqvOFGFiZhzbBI9.2FB7q76LTMsNAkDKS/0'

/**
 * Generates a new Token class and executes validity checks
 */
Token.create(TOKEN).then(token => {
  console.log(`Created token: ${token} (${token.type})`)
}).catch(err => {
  console.log(`Error creating token: ${err.message}`)
})

/**
 * Generates a Buffer containing 16 random bytes,
 * using node's crypto module internally
 */
Signer.randomBytes().then(buffer => {
  const hex = buffer.toString('hex')
  console.log(`Generated bytes in hex: ${hex} (${hex.length})`)
}).catch(err => {
  console.log(`Error generating bytes: ${err.message}`)
})

/**
 * Generates a sign secret, a 32 character hexadecimal string
 */
Signer.generateSignSecret().then(secret => {
  console.log(`Generated secret: ${secret} (${secret.length})`)
}).catch(err => {
  console.log(`Error generating secret: ${err.message}`)
})

/**
 * Hash a plain-text password and compare them
 */
Signer.hashPassword(PASSWORD).then(hash => {
  console.log(`Generated hash: ${hash} (${hash.length})`)
  return Signer.comparePassword(PASSWORD, hash)
}).then(() => {
  console.log('Passwords matched!')
}).catch(err => {
  console.log(`Error hashing password: ${err.message}`)
})

/**
 * Checks if the given variable was a valid bcrypt hash
 */
RegexValidator.isValidBcryptHash(HASH).then(() => {
  console.log('Valid bcrypt hash!')
}).catch(err => {
  console.log(`Invalid bcrypt hash: ${err.message}`)
})
