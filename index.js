const express = require('express')
const path = require('path')
const csrf = require('csurf')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const tableRoutes = require('./routes/table')
const addRouters = require('./routes/add')
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const { request } = require('http')
const { setUncaughtExceptionCaptureCallback } = require('process')
const User = require('./models/user')
const Role = require('./models/role')
const Department = require('./models/department')
const user = require('./models/user')
const varMiddleware = require('./middleware/variable')

const MOMGODB_URI = `mongodb://10.0.16.74/forma`

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname:'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const store = MongoStore({
    colection: 'sessions',
    uri: MOMGODB_URI
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secret value',
    resave:false,
    saveUninitialized: false,
    store
}))
app.use(csrf())
app.use(varMiddleware)

app.use('/',homeRoutes)
app.use('/records',tableRoutes)
app.use('/add',addRouters)
app.use('/users',userRoutes)
app.use('/auth',authRoutes)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        
        await mongoose.connect(MOMGODB_URI,{
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useFindAndModify: false
        })
      
        app.listen(PORT, () => {
            console.log (`app start, and listen port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }

}

start()

