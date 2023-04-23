const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const passport = require('passport')
const nodemailer = require('nodemailer')
const { response } = require('express')

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

exports.logout = (req, res) => {
    req.logout(err => {
        err ? connsole.log(err) : res.redirect("/login")
    })
}

exports.login = (req, res) => {
    let error = req.query.error;
    req.isAuthenticated() ? res.render("users/index", {isAuthenticated: true}) : res.render("users/login", {isAuthenticated})
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
                        res.redirect("/login?error=" + error)
                    }
                }else{
                    res.redirect("/login?error=" + error)
                }
            }
        })

}

exports.signup = (req, res) => {
    let success = req.query.success;
    let error = req.query.error;
    req.isAuthenticated() ? res.render("users/index", {isAuthenticated: true}) : res.render("users/signup", {isAuthenticated, success, error})
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
    connection.query(`
        SELECT *
        FROM pricelist`, 
        (err, rows) => {
            if (err) console.log(err)
            else{
                if (rows.length > 0){
                    req.isAuthenticated() ? 
                        res.render("users/booking", {isAuthenticated: true, data: rows, toDisable: checkInDate}) :
                        res.render("users/booking", {isAuthenticated, data: rows, toDisable: checkInDate})
                }
            }
        });
}

exports.bookingProcess = (req, res) => {
    if(req.isAuthenticated()){
        const {checkIn, checkOut, numOfHours, timeIn, timeOut, numOfPerson} = req.body;
        const error = encodeURIComponent("Month rates not available!")
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
                                    res.redirect("/mybookings")
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
    if(req.isAuthenticated()){
        connection.query(`
        SELECT *
        FROM reservation
        WHERE userID = ? AND status IN ('pending', 'approved') `, [req.user.id],
        (err, rows) => {
            err ? console.log(err) : res.render("users/mybookings", {isAuthenticated: true, rows})
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

exports.payment = (req, res) => {
    res.render("users/payment");
}

