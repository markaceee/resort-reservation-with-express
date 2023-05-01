const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const passport = require('passport')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { response } = require('express')
const { isAsyncFunction } = require('util/types')

let isAuthenticated = false

// Connection Pool
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: "+08:00"
});

let checkInDate;
let priceList;

connection.query(`SELECT * FROM reservation WHERE status IN ('approved') `,
(err, rows) => { err ? console.log(err) : checkInDate = rows })

connection.query(`SELECT * FROM pricelist`,
(err, rows) => { err ? console.log(err) : priceList = rows })



exports.index = (req, res) => {
    req.isAuthenticated() ? 
    res.render("users/index", {isAuthenticated: true, toDisable: checkInDate}) :
    res.render("users/index", {isAuthenticated, toDisable: checkInDate})
}

exports.blank = (req, res) => {
    const statusCode = req.query.status;
    console.log(statusCode);
    if (statusCode == 400) {
        res.render("users/blank", {isAuthenticated})
    }else{
        res.redirect("/");
    }
}

exports.faq = (req, res) => {
    req.isAuthenticated() ? 
    res.render("users/faq", {isAuthenticated: true}) :
    res.render("users/faq", {isAuthenticated})
}

exports.recover = (req, res) => {
    let error = req.query.error;
    let success = req.query.success;
    req.isAuthenticated() ? 
    res.redirect("/") :
    res.render("users/recover", {isAuthenticated, error, success})
}

exports.recoverProcess = async (req, res) => {
    const sendTO = req.body.email;
    const token = crypto.randomBytes(20).toString('hex');

    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
    });

    const now = new Date();
    const expirationToken = new Date(now.getTime() + (60 * 60 * 1000)); 
    // const expirationToken = new Date(now.getTime() + (1 * 60 * 1000));

    let error = encodeURIComponent('Email not exist!');
    let success = encodeURIComponent('Instruction sent!');

    const options = {
        from: process.env.EMAIL,
        to: sendTO,
        subject: "Your new password",
        html: `
        <h1 style="color: #242424; font-size: 2.5rem"> You have requested to reset your password. </h1>
        <p> Please click the link below to set a new password: </p>
        <a href="http://localhost:3000/recover-password/${token}">Reset Password</a>
        <p> If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake. </p>
        <p> Thanks, <br> Karyll's team </p>
        `
    }

    connection.query(`
    SELECT *
    FROM user
    WHERE email = ?`,
    [sendTO],
    (err, foundEmail) => {
        if(!err){
            if(foundEmail.length){
                transporter.sendMail(options, (err, info) => {
                    if(err){
                        console.log(err);
                    }else{
                        connection.query(`
                        UPDATE user
                        SET reset_password_token = ?, token_expiration = ?
                        WHERE email = ?`,
                        [token, expirationToken, sendTO],
                        (err, rows) => {
                            err ? console.log(err) : res.redirect("/recover-account?success="+success);
                        });
                    }
                });
            }else{
                res.redirect("/recover-account?error="+error);
            }
        }
    });
}

exports.recoverProcessWithToken = async (req, res) => {
    let error = req.query.error;
    let success = req.query.success; 
    const token = req.params.token;
    connection.query(`SELECT * FROM user WHERE reset_password_token = ?`, [token], 
    (err, rows) => {
        if(err) console.log(err)
    
        if(!rows.length) { 
            console.log("Token not found")
            res.redirect("/")
        }else{
            if(new Date(rows[0].token_expiration) < new Date()){
                console.log('Token has expired');
                res.status(400).redirect("/blank?status=400");
            }else{
                res.render("users/recover-password", {isAuthenticated, error, success, token})
            }
        }
    })
}

exports.recoverProcessWithTokenProcess = async (req, res) => {
    const {password, cPassword} = req.body
    const token = req.params.token;
    const error = encodeURIComponent('Password not matched!');
    const success = encodeURIComponent('Password updated!');

    if(password === cPassword){

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        connection.query(`
            UPDATE user
            SET password = ?, reset_password_token = NULL, token_expiration = NULL
            WHERE reset_password_token = ?`, [hashedPassword, token],
            (err, result) => {
                if(err) console.log(err)
                else{
                    console.log("password updated");
                    res.redirect("/login?success=" + success)
                }
            })
    }else{
        res.redirect("/recover-password/" + token + '?error=' + error)
    }
    
}

exports.logout = (req, res) => {
    req.logout(err => {
        err ? connsole.log(err) : res.redirect("/login")
    })
}

exports.login = (req, res) => {
    let error = req.query.error;
    let success = req.query.success;
    req.isAuthenticated() ?
        res.render("users/index", {isAuthenticated: true, error}) : 
        res.render("users/login", {isAuthenticated, error, success})
}

exports.loginProcess = (req, res) => {
    let error = encodeURIComponent('error credentials')
    const {email, password} = req.body

    connection.query(`
        SELECT *
        FROM user
        WHERE email = ?`, [email],
        async (err, foundEmail) => {
            if(err) console.log(err)
            else{
                if(foundEmail.length > 0){
                    const isMatch = await bcrypt.compare(password, foundEmail[0].password)
                    if(isMatch){
                        req.login({id: foundEmail[0].userID, email: email}, (err) => {
                            if (err) console.log(err)
                            else{
                                passport.authenticate("local")(req, res, () => {
                                    res.redirect("/")
                                })
                            }
                        })
                    }else{
                        isError = true
                        res.redirect("/login?error=" + error)
                    }
                }else{
                    isError = true
                    res.redirect("/login?error=" + error)
                }
            }
        })

}

exports.signup = (req, res) => {
    let success = req.query.success;
    let error = req.query.error;
    let emailExist = req.query.emailExist;
    req.isAuthenticated() ? res.render("users/index", {isAuthenticated: true}) : res.render("users/signup", {isAuthenticated, success, error, emailExist})
}

exports.signupProcess = async (req, res) => {
    let error = encodeURIComponent('error credentials')
    let success = encodeURIComponent('registered successfully')
    let emailExist = encodeURIComponent('email already exist')

    const {firstName, lastName, contactNumber, address, email, password, confirmPassword} = req.body

    if(password != confirmPassword){
        res.redirect("/signup?error="+error)
    }else{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        connection.query(`
            SELECT *
            FROM user
            WHERE email = ?`, [email],
            (err, foundEmail) => {
                if(!err){
                    console.log(foundEmail.length)
                
                    if(!foundEmail.length){
                        connection.query(`
                            INSERT INTO user
                            SET firstName = ?, lastName = ?, contactNumber = ?, address = ?, email = ?, password = ?`,
                            [firstName, lastName, contactNumber, address, email, hashedPassword],
                        (err, result) => {
                            if (err) {console.log(err)}
                            else{
                                res.redirect("/signup?success=" + success)
                            }
                        })
                    }else{
                        res.redirect("/signup?emailExist="+emailExist)
                    }
                }
            })
    }
}

exports.booking = (req, res) => {
    let error = req.query.error;

    connection.query(`
        SELECT *
        FROM pricelist`, 
        (err, rows) => {
            if (err) console.log(err)
            else{
                if (rows.length > 0){
                    req.isAuthenticated() ? 
                        res.render("users/booking", {isAuthenticated: true, data: rows, toDisable: checkInDate, error}) :
                        res.render("users/booking", {isAuthenticated, data: rows, toDisable: checkInDate, error})
                }
            }
        });
}

exports.bookingProcess = (req, res) => {
    if(req.isAuthenticated()){
        const {checkIn, checkOut, numOfHours, timeIn, timeOut, numOfPerson} = req.body;
        const error = encodeURIComponent("Month rates not available!")
        const success = encodeURIComponent("Reserved successfully!")
        // Convert the date string to a Date object
        const date = new Date(checkIn);
        const dayOfWeek = date.getDay();
        const monthName = date.toLocaleString('en-us', { month: 'long' });
        let week = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
        let weekString = '';
        week ? weekString = 'weekends' : weekString = 'weekdays';
        let total = 0;
        
        // Getting the total amount
        connection.query(` 
            SELECT * FROM pricelist`,
            (err, data) => {
                if(err) console.log(err)
                else{
                    const priceObject = data.find(price => price.month === monthName && price.whatWeek === weekString && price.numOfHours === parseInt(numOfHours) && price.numOfPerson === parseInt(numOfPerson))
                    if(data.some(item => item.month.includes(monthName))){
                        if(priceObject){
                            connection.query(`
                            INSERT INTO reservation
                            SET userID = ?, checkIn = ?, checkOut = ?, timeIn = ?, timeOut = ?, numOfHours = ?, numOfPerson = ?, total = ?`,
                            [req.user.id, ...Object.values(req.body), priceObject.price],
                            (err, foundReservation) => {
                                if (err) { console.log(err)}
                                else{
                                    res.redirect("/mybookings?success="+success)
                                }
                            })
                        }else{
                            res.redirect("/booking?error=" + error)
                        }
                    }else{
                        res.redirect("/booking?error=" + error)
                    }
                    
                }
            })

    }else{
        res.redirect("/login")
    }
}

exports.mybookings = (req, res) => {

    let success = req.query.success;
    let error = req.query.error;

    if(req.isAuthenticated()){
        connection.query(`
        SELECT *
        FROM reservation
        WHERE userID = ? AND status IN ('pending', 'approved') `, [req.user.id],
        (err, rows) => {
            err ? console.log(err) : res.render("users/mybookings", {isAuthenticated: true, rows, success, error})
        })
    }else{res.redirect("/login")}
}

exports.mybookingsEdit = (req, res) => {
    if(req.isAuthenticated()){
        const reservationID = req.params.id
        connection.query(`
            SELECT *
            FROM reservation
            WHERE reservationID = ?`, [reservationID],
            (err, rows) => {
                err ? console.log(err) :
                rows.length ? res.render("users/mybookingsEdit", {isAuthenticated: true, rows, toDisable: checkInDate, priceList}) :
                res.redirect("/mybookings")
            })
    }else res.redirect("/login")
}

exports.mybookingsDelete = (req, res) => {
    let error = encodeURIComponent('booking cancelled');
    if (req.isAuthenticated()){ 
        connection.query(`
        UPDATE reservation
        SET status = ?
        WHERE reservationID = ?`,
        ["cancelled", req.params.id],
        (err, foundUser) => {
            err ? console.log(err) : res.redirect("/mybookings?error=" + error);
        });
    }else{
        res.redirect("/");
    }   
}

exports.mybookingsEditProcess = (req, res) => {
    const error = encodeURIComponent("Month rates not available!")
    const {checkIn, checkOut, numOfHours, timeIn, timeOut, numOfPerson} = req.body;

    // Convert the date string to a Date object
    const date = new Date(checkIn);
    const dayOfWeek = date.getDay();
    const monthName = date.toLocaleString('en-us', { month: 'long' });
    let week = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
    let weekString = '';
    week ? weekString = 'weekends' : weekString = 'weekdays';
    let total = 0;

    // Getting the total amount
    connection.query(` 
    SELECT * FROM pricelist`,
    (err, data) => {
        if(err) console.log(err)
        else{
            const priceObject = data.find(price => price.month === monthName && price.whatWeek === weekString && price.numOfHours === parseInt(numOfHours) && price.numOfPerson === parseInt(numOfPerson))
            if(data.some(item => item.month.includes(monthName))){
                if(priceObject){
                    connection.query(`
                    UPDATE reservation
                    SET userID = ?, checkIn = ?, checkOut = ?, timeIn = ?, timeOut = ?, numOfHours = ?, numOfPerson = ?, total = ?
                    WHERE reservationID = ?`,
                    [req.user.id, checkIn, checkOut, timeIn, timeOut, parseInt(numOfHours), parseInt(numOfPerson), priceObject.price, req.params.id],
                    (err, foundReservation) => {
                        err ? console.log(err) : res.redirect("/mybookings")
                    })
                }else{
                    res.redirect("/mybookings?error=" + error)
                }
            }else{res.redirect("/mybookings?error=" + error)}
        }
    })
}


exports.contact = (req, res) => {
    const success = req.query.success;

    if(req.isAuthenticated()){
        connection.query(`
            SELECT * FROM user WHERE userID = ?`, [req.user.id],
            (err, foundUser) => {
                res.render("users/contact", {isAuthenticated: true, data: foundUser, success})
            })
    }else{
        res.render("users/contact", {isAuthenticated, success})
    }
}

exports.contactProcess = (req, res) => {
    const {firstName, lastName, email, contactNumber, message} = req.body
    const success = encodeURIComponent('message sent!')
    connection.query(`
    INSERT INTO contactus
    SET firstName = ?, lastName = ?, email = ?, contactNumber = ?, message = ?`,
        [firstName, lastName, email, contactNumber, message],
        (err, insertedData) => {
            if(err) console.log(err)
            else{
                res.redirect("/contact?success=" + success)
            }
        })
}


exports.profile = (req, res) => {
    const success = req.query.success;
    const emailExist = req.query.emailExist;
    const error = req.query.error;
    if(req.isAuthenticated()){
        connection.query(`
            SELECT * FROM user WHERE userID = ?`, [req.user.id],
            (err, foundUser) => {
                res.render("users/profile", {isAuthenticated: true, data: foundUser, success, emailExist, error})
            })
    }else{
        res.redirect("/")
    }
}

exports.profileProcess = async (req, res) => {
    let success = encodeURIComponent('registered successfully')
    let emailExist = encodeURIComponent('email already exist')
    let error = encodeURIComponent('error credentials')
    const {firstName, lastName, contactNumber, address, email, password, confirmPassword} = req.body

    if(password != confirmPassword){
        res.redirect("/profile?error="+error)
    }else{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        connection.query(`
            SELECT *
            FROM user`,
            (err, result) => {
                if(!err){

                    const filteredID = result.filter(data => data.userID !== req.user.id);
                    const newEmail = filteredID.find(data => data.email === email);
                    if(!newEmail){
                        connection.query(`
                        UPDATE user
                        SET firstName = ?, lastName = ?, contactNumber = ?, address = ?, email = ?, password = ?
                        WHERE userID = ?`,[firstName, lastName, contactNumber, address, email, hashedPassword, req.user.id],
                        (err, result) => {
                            if (err) {console.log(err)}
                            else{
                                res.redirect("/profile?success=" + success)
                            }
                        })
                    }else{
                        res.redirect("/profile?emailExist=" + emailExist)
                    }
                }
            })
    }
    
}

exports.payment = (req, res) => {
    res.render("users/payment");
}

exports.paymentProcess = (req, res) => {
    
}

