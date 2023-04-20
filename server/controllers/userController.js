const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const passport = require('passport')
const nodemailer = require('nodemailer')

let isAuthenticated = false

// Connection Pool
let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    timezone: "+08:00"
});

exports.index = (req, res) => {
    req.isAuthenticated() ? res.render("users/index", {isAuthenticated: true}) : res.render("users/index", {isAuthenticated})
}

exports.logout = (req, res) => {
    req.logout(err => {
        err ? connsole.log(err) : res.render("users/index", {isAuthenticated})
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
                    req.isAuthenticated() ? res.render("users/booking", 
                        {isAuthenticated: true, data: rows}) :
                        res.render("users/booking", {isAuthenticated, data: rows})
                }
            }
        });
}

exports.bookingProcess = (req, res) => {
    if(req.isAuthenticated()){
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
                    data.forEach(foundData => {
                        // total amount found
                        if(foundData.month === monthName && foundData.whatWeek === weekString && foundData.numOfHours === parseInt(numOfHours) && foundData.numOfPerson === parseInt(numOfPerson)){
                            connection.query(`
                                INSERT INTO reservation
                                SET userID = ?, checkIn = ?, checkOut = ?, timeIn = ?, timeOut = ?, numOfHours = ?, numOfPerson = ?, total = ?`,
                                [req.user.id, checkIn, checkOut, timeIn, timeOut, parseInt(numOfHours), parseInt(numOfPerson), foundData.price],
                                (err, foundReservation) => {
                                    if (err) { console.log(err)}
                                    else{
                                        res.redirect("/mybookings")
                                    }
                                })
                        }
                    })
                }
            })

    }else{
        res.redirect("/login")
    }
}

exports.mybookings = (req, res) => {
    connection.query(`
        SELECT *
        FROM reservation`,
        (err, rows) => {
            if(err){console.log(err)}
            else{
                req.isAuthenticated() ? res.render("users/mybookings", {isAuthenticated: true, data: rows, reservationID: null}) : res.redirect("/login")
            }
        })
}


exports.payment = (req, res) => {
    res.render("users/payment");
}


