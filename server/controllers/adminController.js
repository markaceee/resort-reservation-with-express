const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const passport = require('passport')
const nodemailer = require('nodemailer')
const crypto = require('crypto')


let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: "+08:00"
});

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
});


exports.adminIndex = (req, res) => {
    
    if(req.isAuthenticated() && req.user.role === 0){
        connection.query(`SELECT * FROM reservation`,
            (err, reservation) =>{
                if(err) console.log(err)
                connection.query(`SELECT * FROM user`,
                (err, user) => {
                    if(err) console.log(err)
                    connection.query(`SELECT * FROM reviews`,
                    (err, reviews) => {
                        if(err) console.log(err)
                        else{
                            connection.query(`SELECT * FROM reservation WHERE status = 'approved'`,
                            (err, approvedData) => {
                                if(err) console.log(err)
                                else{
                                    approvedData.forEach(data => {
                            
                                        const checkInDate = new Date(data.checkIn);
                                        const twoDaysBeforeCheckIn = new Date(data.checkIn);
                                        twoDaysBeforeCheckIn.setDate(twoDaysBeforeCheckIn.getDate() - 2);
        
                                        console.log("Date" + checkInDate + "Date" + twoDaysBeforeCheckIn)
                                        
                                    })
                                    
                                    res.render("admin/index", {reservation, user, reviews})
                                    
                                }

                            })
                        }
                        
                    })
                })
            })
        
    }else{
        res.redirect("/admin/login")
        console.log("nag login pero false")
    }
}

exports.adminLogout = (req, res) => {
    req.logout(err => {
        err ? console.log(err) : res.redirect("/admin/login")
    })
}

exports.adminLogin = (req, res) => {
    let error = req.query.error;
    let success = req.query.success;


    if(req.isAuthenticated() && req.user.role === 0){
        res.redirect("/admin")
    }else{
        res.render("admin/login")
    }

    // (req.isAuthenticated() && req.user.role === 0) ? 
    //     res.redirect("/admin") :
    //     res.render("admin/login")

}

exports.adminLoginProcess = (req, res) => {
    let error = encodeURIComponent('error credentials')
    const {email, password} = req.body
    // palmbliss2023
    connection.query(`
        SELECT *
        FROM admin
        WHERE email = ?`, [email],
        async (err, rows) => {
            if(err) console.log(err)
            else{
                if(rows.length > 0){
                    const isMatch = await bcrypt.compare(password, rows[0].password)
                    if(isMatch){
                        req.login({id: rows[0].adminID, email: email, role: 0}, (err) => {
                            if (err) console.log(err)
                            else{
                                passport.authenticate("local")(req, res, () => {
                                    console.log(req.user.role)
                                    res.redirect("/admin")
                                })
                            }
                        })
                    }else{
                        isError = true
                        res.redirect("/admin/login?error=" + error)
                    }
                }else{
                    isError = true
                    res.redirect("/admin/login?error=" + error)
                }
            }
        })
}

exports.adminUsers = (req, res) => {
    const error = req.query.error
    if(req.isAuthenticated() && req.user.role === 0){
        connection.query(`
            SELECT * FROM user `,
            (err, result) => {
                res.render("admin/users", {data: result, error})
            })
    }else{
        res.redirect("/admin/login")
    }
}

exports.adminUsersView = (req, res) => {
    const error = encodeURIComponent("user not found")
    const userID = req.params.id
    if(req.isAuthenticated() && req.user.role === 0){
        connection.query(`
        SELECT * FROM user
        WHERE userID = ?`, [userID], 
        (err, result) => {
            if(!result.length) res.redirect("/admin/users?error=" + error)
            else{
                res.render("admin/usersView", {data: result})
            }
        })
    }else{
        res.redirect("/admin/login")
    }

}

exports.adminUsersDelete = (req, res) =>{
    let error = encodeURIComponent('users deleted');
    if (req.isAuthenticated() && req.user.role === 0){ 
        connection.query(`
        DELETE FROM user
        WHERE userID = ?`,
        [req.params.id],
        (err, foundUser) => {
            err ? console.log(err) : res.redirect("/admin/users?success=" + error);
        });
    }else{
        res.redirect("/admin");
    }   
}

exports.adminBooking = (req, res) => {
    const success = req.query.success
    const error = req.query.error
    if(req.isAuthenticated() && req.user.role === 0){
        connection.query(`
        SELECT r.reservationID, u.userID, u.firstName, u.lastName, r.checkIn, r.checkOut, r.timeIn, r.timeOut, r.numOfHours, r.numOfPerson, r.total, r.status, r.reserveDateCreated
        FROM reservation r
        JOIN user u ON r.userID = u.userID`,
        (err, result) => {
            err ? console.log(err) : res.render("admin/bookings", {data: result, success, error})
        })
    }else{
        res.redirect("/admin/login")
    }
}

exports.adminBookingEdit = (req, res) => {

    if(req.isAuthenticated() && req.user.role === 0){
        connection.query(`
        SELECT r.reservationID, u.userID, u.firstName, u.lastName, r.checkIn, r.checkOut, r.timeIn, r.timeOut, r.numOfHours, r.numOfPerson, r.total, r.status
        FROM reservation r
        JOIN user u ON r.userID = u.userID
        WHERE r.reservationID = ?`, [req.params.id],
        (err, result) => {
            connection.query(`
                SELECT * FROM pricelist`,
                (err, priceList) => {
                    err ? console.log(err) : res.render("admin/bookingsEdit", {data: result, priceList})
                })
        })
    }else{
        res.redirect("/admin/login")
    }
}

exports.adminBookingEditProcess = (req, res) => {
    const success = encodeURIComponent("updated")
    const error = encodeURIComponent("failed")
    const {userID, checkIn, checkOut, timeIn, timeOut, numOfHours, numOfPerson, total, status} = req.body
    const reservationID = req.params.id
    connection.query(`
        UPDATE reservation
        SET userID = ?, checkIn = ?, checkOut = ?, timeIn = ?, timeOut = ?, numOfHours = ?, numOfPerson = ?, total = ?, status = ?
        WHERE reservationID = ?`,
            [userID, checkIn, checkOut, timeIn, timeOut, numOfHours, numOfPerson, total, status, reservationID],
            (err, result) => {
                if(err) console.log(err)
                else{
                    console.log(result)
                    res.redirect("/admin/bookings?success=" + success)
                }
    })
}

exports.adminPayments = (req, res) => {
    const success = req.query.success
    if (req.isAuthenticated() && req.user.role === 0) {
        connection.query(`
            SELECT p.paymentID, u.userID, u.firstName, u.lastName, r.reservationID, p.guestPaid, p.totalGuestPaid, p.needToPay, p.paymentMethod, p.receipt
            FROM payment p
            JOIN user u on p.userID = u.userID
            JOIN reservation r ON p.reservationID = r.reservationID
            WHERE r.status = 'approved'
        `, (err, result) => {
          if (err) console.log(err)
          else {
            res.render("admin/payments", { data: result, success })
          }
        })
      } else {
        res.redirect("/admin/login")
      }
}

exports.adminPaymentsEdit = (req, res) => {
    if (req.isAuthenticated() && req.user.role === 0) {
        const paymentID = req.params.id;
        connection.query(`
            SELECT p.paymentID, u.userID, u.firstName, u.lastName, r.reservationID, p.guestPaid, p.totalGuestPaid, p.needToPay, p.paymentMethod, p.receipt
            FROM payment p
            JOIN user u on p.userID = u.userID
            JOIN reservation r ON p.reservationID = r.reservationID
            WHERE r.status = 'approved' AND p.paymentID = ?
        `, [paymentID], (err, result) => {
          if (err) console.log(err)
          else {
            res.render("admin/paymentsEdit", { data: result })
          }
        })
      } else {
        res.redirect("/admin/login")
      }
    
}

exports.adminPaymentsEditProcess = (req, res) => {
    const {guestPaid} = req.body
    const paymentID = req.params.id;
    const success = encodeURIComponent("payment received")

    connection.query(`
        SELECT *
        FROM payment
        WHERE paymentID = ? 
    `, [paymentID],
    (err, result) => {
        if(err) console.log(err)
        else{
            let total = parseInt(guestPaid) + result[0].totalGuestPaid
            connection.query(`
                UPDATE payment
                SET totalGuestPaid = ?, guestPaid = ?
                WHERE paymentID = ?`, [total, 0, paymentID],
                (err, data) => {
                    if(err) console.log(err)
                    else{
                        connection.query(`
                            SELECT * FROM user WHERE userID = ?`, [result[0].userID], 
                            (err, rows) => {
                                if(err) console.log(err)
                                else{
                                    const options = {
                                        from: process.env.EMAIL,
                                        to: rows[0].email,
                                        subject: "We received your concern",
                                        html: `
                                        <h1 style="color: #242424; font-size: 2.5rem"> We received your payment. </h1>
                                        <p> We received your paymment </p>
                                        <p> If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake. </p>
                                        <p> Thanks, <br> Karyll's team </p>
                                        `
                                    }

                                    transporter.sendMail(options, (err, info) => {
                                        if(err) console.log(err)
                                        else{
                                            res.redirect("/admin/payments?success=" + success)
                                        }
                                    })
                                }
                            })
                    }
                })
        }
    })
}


exports.adminMessages = (req, res) => {
    const success = req.query.success
    if(req.isAuthenticated() && req.user.role === 0){
        connection.query(`
            SELECT * FROM contactus`,
            (err, result) => {
                err ? console.log(err) : res.render("admin/messages", {data: result, success})
            })
    }else{
        res.redirect("/admin/login")
    }
}

exports.adminMessagesEdit = (req, res) => {

    if(req.isAuthenticated() && req.user.role === 0){
        connection.query(`
            SELECT * FROM contactus WHERE contactID = ?`, [req.params.id],
            (err, result) => {
                if(err) console.log(err)
                else if (result.length > 0){
                    res.render("admin/messagesEdit", {data: result})
                }else{
                    res.redirect("/admin/messages")
                }
            })
    }else{
        res.redirect("/admin/login")
    }
}

exports.adminMessagesEditProcess = (req, res) => {
    const success = encodeURIComponent("message sent")
    const {adminReply, email} = req.body
    const contactID = req.params.id

    const options = {
        from: process.env.EMAIL,
        to: email,
        subject: "We received your concern",
        html: `
        <h1 style="color: #242424; font-size: 2.5rem"> We received your concern. </h1>
        <p> ${adminReply} </p>
        <p> If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake. </p>
        <p> Thanks, <br> Karyll's team </p>
        `
    }

    transporter.sendMail(options, (err, info) => {
        if(err) console.log(err)
        else{
            connection.query(`
            UPDATE contactus
            SET adminReply = ?
            WHERE contactID = ?`, [adminReply, contactID],
            (err, data) => {
                if(err) console.log(err)
                else{
                    res.redirect("/admin/messages?success=" + success)
                }
            })
        }
    });


}

exports.adminMessagesDelete = (req, res) => {
    const success = encodeURIComponent("message deleted")

    connection.query(`
        SELECT * 
        FROM contactus
        WHERE contactID = ?`,
        [req.params.id], (err, result) => {
            if(err) console.log(err)
            else if(result.length > 0){
                connection.query(`
                DELETE FROM contactus
                WHERE contactID = ?`, [req.params.id],
                (err, data) => {       
                    if(err){console.log(err)}
                    else{
                        res.redirect("/admin/messages?success=" + success)
                    }
                })
            }else{
                res.redirect("/admin/messages")
            }
        })
}

exports.adminPricing = (req, res) => {
    const success = req.query.success
    if(req.isAuthenticated() && req.user.role === 0){
        connection.query(`
            SELECT * FROM pricelist`,
            (err, result) => {
                err ? console.log(err) : res.render("admin/rates", {result, success})
            })
    }else{
        res.redirect("/admin/login")
    }
}

exports.adminPricingDelete = (req, res) => {
    const rateID = req.params.id
    const success = encodeURIComponent("rate deleted")

    connection.query(`
        SELECT * 
        FROM pricelist
        WHERE priceListID = ?`,
        [rateID], (err, result) => {
            if(err) console.log(err)
            else if(result.length > 0){
                connection.query(`
                DELETE FROM pricelist
                WHERE priceListID = ?`, [rateID],
                (err, data) => {       
                    if(err){console.log(err)}
                    else{
                        res.redirect("/admin/rates?success=" + success)
                    }
                })
            }else{
                res.redirect("/admin/rates")
            }
        })
}

exports.adminPricingProcess = (req, res) => {
    const {month, whatWeek, numOfHours, numOfPerson, price} = req.body
    const success = encodeURIComponent("rate added")
    connection.query(`
        INSERT INTO pricelist
        SET month = ?, whatWeek = ?, numOfHours = ?, numOfPerson = ?, price = ?`,
        [month, whatWeek, numOfHours, numOfPerson, price], 
        (err, result) => {
            err ? console.log(err) : 
            res.redirect("/admin/rates?success=" + success)
        })
}

exports.adminReviews = (req, res) => {
    const success = req.query.success
    if(req.isAuthenticated() && req.user.role === 0){
        connection.query(`
            SELECT * FROM reviews`,
            (err, data) => {
                err ? console.log(err) : res.render("admin/reviews", {data, success})
            })
    }else{
        res.redirect("/admin/login")
    }
}

exports.adminReviewsDelete = (req, res) => {
    let error = encodeURIComponent('reviews deleted');
    if (req.isAuthenticated() && req.user.role === 0){ 
        connection.query(`
            DELETE FROM reviews
            WHERE reviewsID = ?`,
        [req.params.id],
        (err, foundUser) => {
            err ? console.log(err) : res.redirect("/admin/reviews?success=" + error);
        });
    }else{
        res.redirect("/admin");
    }   
}



























































    // const username = 'palmbliss2023'
    // const password = '123'

    // const salt = await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password, salt)

    // connection.query(`
    //     INSERT INTO admin
    //     SET username = ?, password = ?`, [username, hashedPassword],
    //     (err, result) => {
    //         err ? console.log(err) : console.log(result)
    //     }
    // )