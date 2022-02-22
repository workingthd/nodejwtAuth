const express = require('express')

const { userController } = require('../controllers')

const router = express.Router()

router.put('/forgetPassword', userController.forgetPassword)
router.post('/create', userController.create)
router.post('/signIn', userController.signIn)
router.get('/findAll', userController.findAll)
router.get('/findOne/:userId', userController.findOne)
router.put('/update/:userId', userController.update)
router.delete('/delete/:userId', userController.purge)
router.put(
  '/changeCurrentUserPassword',
  userController.changeCurrentUserPassword
)
router.get('/resetPassword/:token', userController.resetPassword)
router.post('/passwordGet', userController.passwordGet)
module.exports = router
