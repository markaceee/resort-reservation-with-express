const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// ------------------------- USER CONTROLLER START -----------------------------

router.get("/", userController.index)
router.get("/blank", userController.blank)

router.get("/logout", userController.logout)
router.get("/login", userController.login)
router.post("/login", userController.loginProcess)

router.get("/signup", userController.signup)
router.post("/signup", userController.signupProcess)

router.get('/booking', userController.booking)
router.post('/booking', userController.bookingProcess)

router.get('/FAQ', userController.faq)

router.get('/recover-account', userController.recover)
router.post('/recover-account', userController.recoverProcess)
router.get('/recover-password/:token', userController.recoverProcessWithToken)
router.post('/recover-password/:token', userController.recoverProcessWithTokenProcess)

router.get('/mybookings/reviews', userController.modal)
router.get('/mybookings', userController.mybookings)
router.post('/mybookings/reviews', userController.modalProcess)
router.get('/mybookings/edit/:id', userController.mybookingsEdit)
router.get('/mybookings/delete/:id', userController.mybookingsDelete)
router.post('/mybookings/edit/:id', userController.mybookingsEditProcess)

router.get('/contact', userController.contact)
router.post('/contact', userController.contactProcess)

router.get('/profile', userController.profile)
router.post('/profile', userController.profileProcess)

router.get('/mybookings/payment/:id', userController.payment)
router.post('/mybookings/payment/:id', userController.paymentProcess)




// ------------------------- USER CONTROLLER END -----------------------------






module.exports = router;
