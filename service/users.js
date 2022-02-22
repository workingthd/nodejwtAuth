const { USER } = require('../models')
const userHelper = require('../helpers/users')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const ejs = require('ejs')
var fs = require('fs')
const create = async ({ body }) => {
  try {
    if (body) {
      const dbUser1 = await USER.findOne({ username: body.username })
      const dbUser = await USER.findOne({ contact: body.contact })
      const dbUser2 = await USER.findOne({ email: body.email })

      if (dbUser1) return { type: 'bad', message: 'Username taken!' }
      if (dbUser) return { type: 'bad', message: 'Contact number taken!' }
      if (dbUser2) return { type: 'bad', message: 'Email taken!' }
      body.password = await userHelper.hashPassword(body.password)
      const data = await USER.create(body)
      return { type: 'success', message: `user created`, data }
    }
    return { type: 'success', message: `No Data to process` }
  } catch (error) {
    throw error
  }
}

const signIn = async ({ body }) => {
  try {
    const user = await USER.findOne({
      $or: [{ username: body.username }]
    }).select('+password')
    if (!user)
      return {
        type: 'bad',
        message: 'User does not exist'
      }

    if (!(await userHelper.comparewPassword(body.password, user.password))) {
      return {
        type: 'bad',
        message: 'Wrong Password'
      }
    }
    return {
      type: 'success',
      message: 'Verified',
      data: { id: user.id }
    }
  } catch (err) {
    console.log(err)
    throw err
  }
}

const findAll = async ({ query }) => {
  try {
    const options = query
    const data = await USER.find(options)
    if (data.length > 0) {
      return { type: 'success', message: 'Record found!', data }
    } else {
      return { type: 'bad', message: 'Record not found!' }
    }
  } catch (error) {
    throw error
  }
}

const findOne = async filters => {
  try {
    const data = await USER.findOne(filters)
    if (data) {
      return { type: 'success', message: 'user found!', data }
    } else {
      return { type: 'bad', message: 'user not found!', data }
    }
  } catch (error) {
    throw error
  }
}

const update = async ({ params, body }) => {
  try {
    console.log(params)
    const _id = params.userId
    body.updatedAt = new Date()
    if (body.password) {
      body.password = await userHelper.hashPassword(body.password)
    } else {
      delete body.password
    }
    const data = await USER.findByIdAndUpdate(_id, body, { new: true })
    if (data)
      return {
        type: 'success',
        message: `${data.firstName.toUpperCase()} user Updated`,
        data
      }
    else return { type: 'bad', message: `user not found` }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const purge = async ({ params }) => {
  try {
    const _id = params.userId
    const data = await USER.findByIdAndDelete(_id)
    if (data) {
      return {
        type: 'success',
        message: `${data.firstName.toUpperCase()} user Deleted`
      }
    } else return { type: 'bad', message: `user not found` }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const changeCurrentUserPassword = async ({ body }) => {
  try {
    const user = await USER.findOne({ _id: body.id }).select('+password')
    if (!user) return { type: 'bad', message: `user not found` }
    if (!(await userHelper.comparewPassword(body.oldPassword, user.password)))
      return { type: 'bad', message: 'Wrong Password' }
    const hashedPass = await userHelper.hashPassword(body.newPassword)
    await USER.findByIdAndUpdate(
      user.id,
      { password: hashedPass },
      { new: true }
    )
    return { type: 'success', message: 'Password Updated Successfully' }
  } catch (err) {
    throw err
  }
}

const forgetPassword = async ({ body }) => {
  try {
    const _email = body.email
    const user = await USER.findOne({ email: _email })
    if (user) {
      const token = jwt.sign({ _id: user.id }, process.env.RESET_PASSWORD_KEY, {
        expiresIn: '20m'
      })
      let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'rakhshanmughalthd@gmail.com',
          pass: 'Qwertyphysics@123'
        }
      })

      let message = {
        from: 'rakhshanmughalthd@gmail.com', // sender address

        to: _email, // list of receivers

        subject: 'Reset Link',

        html: `<h2>Click Here for Reset Your Password</h2>

        <a href="${process.env.CLIENT_URL}/v1/users/resetPassword/${token}">Click here to reset password</a>

                `
      }

      mailTransporter.sendMail(message, async function (err, info) {
        if (err) {
          console.log('Error Occurs')
        } else {
          console.log('Email sent successfully')
          var newResetLink = await user.updateOne({
            $set: { resetLink: token }
          })
          console.log('Token Goes Here', token)
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
        }
      })

      return {
        type: 'success',
        message: 'Email send Successfully'
      }
    } else return { type: 'bad', message: `user not found` }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const resetPassword = async (req, res) => {
  try {
    const jwtToken = req.params.token
    console.log('reset link ', jwtToken)
    const user = await USER.findOne({ resetLink: jwtToken })
    if (user) {
      const verification = await jwt.verify(
        jwtToken,
        process.env.RESET_PASSWORD_KEY
      )
      if (verification) {
        res.render('password.ejs', { data: jwtToken })
      } else {
        return {
          type: 'bad',
          message: 'Invalid Token'
        }
      }
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const passwordGet = async ({ body }) => {
  try {
    const password = body.password
    const token = body.token
    console.log(password, token)
    changePassword = await userHelper.hashPassword(password)

    resetLinks = ''
    let newUser = await USER.updateOne(
      { resetLink: token },
      { $set: { password: changePassword } },
      { new: true }
    )

    let newUsers = await USER.updateOne(
      { resetLink: token },
      { $set: { resetLink: resetLinks } },
      { new: true }
    )

    return {
      type: 'success',
      message: 'resetPassword Successfully',
      data: newUser,
      newUsers
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  findAll,
  create,
  findOne,
  signIn,
  update,
  purge,
  changeCurrentUserPassword,
  forgetPassword,
  resetPassword,
  passwordGet
}
