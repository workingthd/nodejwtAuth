const { userService } = require('../service')
const { setResponse } = require('../helpers')

const create = async (req, res) => {
  try {
    console.log(req)
    const data = await userService.create(req)
    data.password = undefined
    setResponse(res, data)
  } catch (error) {
    console.log('Error ', error)
    setResponse(res, { type: 'serverError' })
  }
}

const signIn = async (req, res) => {
  try {
    const data = await userService.signIn(req)
    setResponse(res, data)
  } catch (error) {
    setResponse(res, { type: 'bad', error })
  }
}

const findAll = async (req, res) => {
  try {
    const data = await userService.findAll(req)
    setResponse(res, data)
  } catch (error) {
    setResponse(res, { type: 'serverError' })
  }
}

const findOne = async (req, res) => {
  try {
    const data = await userService.findOne({ _id: req.params.userId })
    setResponse(res, data)
  } catch (error) {
    setResponse(res, { type: 'serverError' })
  }
}

const update = async (req, res) => {
  try {
    // userId

    const data = await userService.update(req)
    setResponse(res, data)
  } catch (error) {
    setResponse(res, { type: 'serverError' })
  }
}

const purge = async (req, res) => {
  try {
    // userId
    const data = await userService.purge(req)

    setResponse(res, data)
  } catch (error) {
    console.log(error)
    setResponse(res, { type: 'serverError' })
  }
}

const changeCurrentUserPassword = async (req, res) => {
  try {
    const data = await userService.changeCurrentUserPassword(req)
    setResponse(res, data)
  } catch (error) {
    setResponse(res, { type: 'serverError' })
  }
}

const forgetPassword = async (req, res) => {
  try {
    const data = await userService.forgetPassword(req)
    setResponse(res, data)
  } catch (error) {
    setResponse(res, { type: 'serverError' })
  }
}

const resetPassword = async (req, res) => {
  try {
    const data = await userService.resetPassword(req, res)
    // setResponse(res, data)
  } catch (error) {
    setResponse(res, { type: 'serverError' })
  }
}

const passwordGet = async (req, res) => {
  try {
    const data = await userService.passwordGet(req)
    console.log(data)
    setResponse(res, data)
  } catch (error) {
    console.log('Error ', error)
    setResponse(res, { type: 'serverError' })
  }
}

module.exports = {
  create,
  findAll,
  findOne,
  signIn,
  update,
  purge,
  changeCurrentUserPassword,
  forgetPassword,
  resetPassword,
  passwordGet
}
