const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')




// ------------------------- ADMIN CONTROLLER START -----------------------------

router.get("/", adminController.adminIndex)

router.get("/users", adminController.adminUsers)
router.get("/users/:id", adminController.adminUsersView)
router.get("/users/delete/:id", adminController.adminUsersDelete)



router.get("/logout", adminController.adminLogout)
router.get("/login", adminController.adminLogin)
router.post("/login", adminController.adminLoginProcess)

router.get("/bookings", adminController.adminBooking)
router.get("/bookings/edit/:id", adminController.adminBookingEdit)
router.post("/bookings/edit/:id", adminController.adminBookingEditProcess)

router.get("/payments", adminController.adminPayments)
router.get("/payments/edit/:id", adminController.adminPaymentsEdit)
router.post("/payments/edit/:id", adminController.adminPaymentsEditProcess)

router.get("/rates", adminController.adminPricing)
router.get("/rates/:id", adminController.adminPricingDelete)
router.post("/rates", adminController.adminPricingProcess)

router.get("/messages", adminController.adminMessages)
router.get("/messages/delete/:id", adminController.adminMessagesDelete)
router.get("/messages/edit/:id", adminController.adminMessagesEdit)
router.post("/messages/edit/:id", adminController.adminMessagesEditProcess)







// ------------------------- ADMIN CONTROLLER END -----------------------------






module.exports = router;
