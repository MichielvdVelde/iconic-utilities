# Utilities

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

This repository contains some utilities code for a project I am working on. These
may be of some value to other people, so here it is.

The source is documented, see the code for specifics. Also see [test.js](test.js) for a few examples.

The module is **not** published on npm (and no plan to). It now uses [Boom](https://github.com/hapijs/boom) for error handling.

## Contents

This module contains five 'utilities'.

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

### Signer.isValidSignSecret

Signature: `isValidSignSecret (signSecret = null, length = 32)`

Checks to see if the given string is a valid hexadecimal string with the given length.

```js
const Signer = require('./iconic-utilities').Signer

const secret = 'F687CE5765BB0E658FA63A88F417B86F'
const length = 32 //default length is 32 character
Signer.isValidSignSecret(signSecret).then(() => {
  console.log(`${secret} is a valid sign secret`)
}).catch(err => {
  console.log(`Not a valid secret: ${err.message}`)
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

### RegexValidator.isValidJwtToken

Signature: `RegexValidator.isValidJwtToken(token = null, rejectOnInvalid = true)`

Checks to see if the provided token is a valid base64 urlencoded JSON Web Token.

```js
const RegexValidator = require('./iconic-utilities').RegexValidator

const token = '...' // encoded token
RegexValidator.isValidJwtToken(token).then(() => {
  console.log('Valid JSON Web Token')
}).catch(err => {
  console.log(`Validation error: ${err.message}`)
})
```

## Auth

The `Auth` module contains project-specific code. It might be of some interest.
It uses [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) to decode and verify
JSON Web Tokens.

### Auth.decodeToken

Signature: `Auth.decodeToken(token = null, complete = false)`

Decodes - **but does not verify** - an encoded JWT string.

```js
const Auth = require('./iconic-utilities').Auth

const token = '...' // the encoded jwt string
Auth.decodeToken(token).then(decodedToken => {
  console.log('Token successfully decoded: ${decodedToken}')
}).catch(err => {
  console.log(`Error decoding token: ${err.message}`)
})
```

### Auth.verifyToken

Signature: `verifyToken (token = null, signSecret = null, options = {})`

Attempts to verify a JSON Web Token. It uses `signSecret` as the secret and
`options` is fed to jsonwebtoken. The validated token is returned on resolve.

**Note:** Uses `Signer.isValidSignSecret` to verify if the provided sign secret
is a 32-character hexadecimal string.

```js
const Auth = require('./iconic-utilities').Auth

const token = '...' // the encoded token
const signSecret = '7658FC960927CEC649947C6B1A05BF9D' // a 32-character hexadecimal string
const options = { algorithms: [ 'HS512' ] } // options are passed to jsonwebtoken
Auth.verifyToken(token, signSecret, options).then(verifiedToken => {
  console.log(`Successfully verified token: ${verifiedToken}`)
}).catch(err => {
  console.log(`Error verifying token: ${err.message}`)
})
```

### Auth.signToken

Signature: `signToken (payload = null, signSecret = null, options = {})`

Signs the payload into an encoded jwt using the provided sign secret. The provided
options are passed to jsonwebtoken.

**Note:** Uses `Signer.isValidSignSecret` to verify if the provided sign secret
is a 32-character hexadecimal string.

```js
const Auth = require('./iconic-utilities').Auth

const payload = {} // the payload
const signSecret = '7658FC960927CEC649947C6B1A05BF9D' // a 32-character hexadecimal string
const options = { algorithm: 'HS512' } // options are passed to jsonwebtoken.sign
Auth.signToken(payload, signSecret, options).then(signedToken => {
  console.log(`Successfully signed token: ${signedToken}`)
}).catch(err => {
  console.log(`Error verifying token: ${err.message}`)
})
```

## Util

Contains several utility functionality that don't really fit anywhere else.

### Util.getDeviceIdFromToken

Signature: `getDeviceIdFromToken (token = null)`

My tokens have a `deviceId` field, which is a valid UUID string. This method
checks if the `deviceId` field is present and it is a valid UUID (using [validator.js](https://github.com/chriso/validator.js))

```js
const Util = require('./iconic-utilities').Util

const token = {} // the decoded token
Util.getDeviceIdFromToken(token).then(deviceId => {
  console.log(`Got device ID: ${deviceId}`)
}).catch(err => {
  console.log(`Error getting device ID: ${err.message}`)
})
```

### License

Copyright 2017 [Michiel van der Velde](http://www.michielvdvelde.nl).

This software is licensed under the [MIT License](LICENSE).
