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

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, {id: user.id, username: user.username, name: user.name})
    })
})

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user)
    })
})

const routes = require('./server/routes/user')


app.use("/", routes)

app.all('*', (req, res) => {
    res.status(404).send('<h1>404! Page not found</h1>');
});

app.listen(3000, () => {
    console.log("Listening to port 3000")
})


