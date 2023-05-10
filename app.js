require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const fileUpload = require('express-fileupload');

const app = express()

app.use(fileUpload());
app.use(express.static(__dirname + "/public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

// User session configuration
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        name: 'userSession'
    },
}));

// Admin session configuration
app.use('/admin', session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        name: 'adminSession'
    },
}));
  
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, {id: user.id, email: user.email, role: user.role})
    })
})

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user)
    })
})

const userRoutes = require('./server/routes/user')
const adminRoutes = require('./server/routes/admin')

app.use("/admin", adminRoutes)
app.use("/", userRoutes)




// app.all('*', (req, res) => {
//     res.status(404).send('<h1>404! Page not found</h1>');
// });

app.listen(3000, () => {
    console.log("Listening to port 3000")
})


