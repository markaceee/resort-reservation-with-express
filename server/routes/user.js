const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get("/", userController.index)

router.get("/logout", userController.logout)
router.get("/login", userController.login)
router.post("/login", userController.loginProcess)


router.get("/signup", userController.signup)
router.post("/signup", userController.signupProcess)


router.get('/booking', userController.booking)
router.post('/booking', userController.bookingProcess)



router.get('/mybookings', userController.mybookings)



router.get('/mybookings/payment', userController.payment)





module.exports = router;
