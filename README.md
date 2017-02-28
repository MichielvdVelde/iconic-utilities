# Utilities

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This repository contains some utilities code for a project I am working on. These
may be of some value to other people, so here it is.

The source is documented, see the code for specifics. Also see [test.js](test.js) for a few examples.

The module is **not** published on npm (and no plan to).

## Contents

This module contains three 'utilities'.

### Token

Signature: `Token.create(token)`

The `Token` class represents a mobile push messaging token. The class uses [this code](https://github.com/appfeel/node-pushnotifications/blob/master/src/push-notifications.js)
to determine if a given token string is a valid token, and its type (platform).

```js
const Token = require('./iconic-utilities').Token

const tokenStr = 'adm:some-token'
Token.create(tokenStr).then(token => {
  console.log(`This token has a value of ${token.toString()} and the type (platform) is ${token.type}`)
}).catch(err => {
  console.log(`Unable to create token: ${err.message}`)
})
```

### Signer

The `Signer` class provides some crypto and password related functionality.

### Signer.randomBytes

Signature: `Signer.randomBytes(length = 16)`

Uses node's `crypto` module to create cryptographically strong pseudo-random data.

```js
const Signer = require('./iconic-utilities').Signer

const length = 16 // default is 16 bytes
Signer.randomBytes(length).then(buffer => {
  console.log(`${length} bytes of pseudo-random data: ${buffer.toString('hex')}`)
}).catch(err => {
  console.log(`Error generating pseudo-random data: ${err.message}`)
})
```

### Signer.generateSignSecret

Signature: `Signer.generateSignSecret(length = 32)`

Generates a hexadecimal string of the set length. Uses `Signer.randomBytes`, so
the resulting string is cryptographically pseudo-random and as strong as node's
`crypto.randomBytes` method.

```js
const Signer = require('./iconic-utilities').Signer

const length = 32 // default length is 32 characters
Signer.generateSignSecret(length).then(secret => {
  console.log(`Generated secret: ${secret}`)
}).catch(err => {
  console.log(`Unable to generate secret: ${err.message}`)
})
```

### Signer.hashPassword

Signature: `Signer.hashPassword(password = null, saltRounds = 10)`

Uses [bcrypt](https://github.com/kelektiv/node.bcrypt.js) to hash a plain-text password
into a 60 character hash. A salt is automatically generated and used.

**Note:** The plain-text password is checked by `RegexValidator.isValidPassword` before it is
accepted.

```js
const Signer = require('./iconic-utilities').Signer

const password = 'Up6$fge4H6'
const saltRounds = 10 // defaults to 10
Signer.hashPassword(password, saltRounds).then(hash => {
  console.log(`Created hash: ${hash}`)
}).catch(err => {
  console.log(`Unable to create hash: ${err.message}`)
})
```

### Signer.comparePassword

Signature: `Signer.comparePassword(passwordPlain = null, passwordHash = null, rejectOnInvalid = true)`

Uses [bcrypt](https://github.com/kelektiv/node.bcrypt.js) to compare a plain-text password with a supplied hash.

**Notes:**
* The plain-text password is checked by `RegexValidator.isValidPassword` before it is accepted
* The supplied hash is checked by `RegexValidator.isValidBcryptHash` before it is accepted

```js
const Signer = require('./iconic-utilities').Signer

const password = 'Up6$fge4H6'
const hash = '$2a$10$Xgb4E9HCat9QZ7gssIlqvOFGFiZhzbBI9.2FB7q76LTMsNAkDKS/0'
Signer.comparePassword(password, hash).then(() => {
  console.log('Password and hash match!')
}).catch(err => {
  console.log('Password do not match!')
})
```

## RegexValidator

The `RegexValidator` class provides methods for validating some stuff.

### RegexValidator.isValidPassword

Signature: `RegexValidator.isValidPassword(password = null, rejectOnInvalid = true)`

Checks to see if the provided password is valid.
Uses the regular expression provided in [this question](http://stackoverflow.com/questions/19605150/regex-for-password-must-be-contain-at-least-8-characters-least-1-number-and-bot).

The following requirements must be satisfied:
* At least one upper case english letter
* At least one lower case english letter
* At least one digit
* At least one special character (#?!@$%^&\*-)
* Minimum 8 in length
* Maximum 72 in length ([see bcrypt security](https://github.com/kelektiv/node.bcrypt.js#security-issuesconcerns))

```js
const RegexValidator = require('./iconic-utilities').RegexValidator

const password = 'Up6$fge4H6'
RegexValidator.isValidPassword(password).then(() => {
  console.log('Password is valid')
}).catch(err => {
  console.log(`Password error: ${err.message}`)
})
```

### RegexValidator.isValidBcryptHash

Signature: `RegexValidator.isValidBcryptHash(password = null, rejectOnInvalid = true)`

Checks to see if the provided hash is a valid bcrypt hash.

```js
const RegexValidator = require('./iconic-utilities').RegexValidator

RegexValidator.isValidBcryptHash(hash).then(() => {
  console.log('Valid bcrypt hash')
}).catch(err => {
  console.log(`Hash error: ${err.message}`)
})
```

### License

Copyright 2017 [Michiel van der Velde](http://www.michielvdvelde.nl).

This software is licensed under the [MIT License](LICENSE).
