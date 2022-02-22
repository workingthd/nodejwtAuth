const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const hashPassword = password =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(await bcrypt.hash(password, 12))
    } catch (error) {
      reject(error)
    }
  })

const comparewPassword = (clientPass, dbPass) =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(await bcrypt.compareSync(clientPass, dbPass))
    } catch (error) {
      reject(error)
    }
  })

const formateData = data => {
  data.dob = new Date(data.dob)
  return data
}

const generarteToken = user => {
  return jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin
    },
    'This is very Secretg',
    {
      expiresIn: '1h'
    }
  )
}

module.exports = {
  hashPassword,
  comparewPassword,
  formateData,
  generarteToken
}
