const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
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


const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname:'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req,res,next)=>{
    try {
        const user = await User.findById('5ef86e6ce2fbf51cac0a0165')
        req.user = user
        next()
    } catch (error) {
        console.log(error)
    }

})

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))
app.use('/',homeRoutes)
app.use('/records',tableRoutes)
app.use('/add',addRouters)
app.use('/users',userRoutes)
app.use('/auth',authRoutes)


const PORT = process.env.PORT || 3000

async function start() {
    try {
        const url = `mongodb://10.0.16.74/forma`
        await mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false})
        
        const roleCandidate = await Role.findOne()
        if(!roleCandidate){
            const role = new Role({
                name: 'superadmin'
            })
            role.save()
        }
        const departmentCandidate = await Department.findOne()
        if(!departmentCandidate){
            const role = new Department({
                name: 'ОЭП'
            })
            role.save()
        }
        // department = await Department.findOne({ name : "ОЭП"})
        // departmentid = department.id
        // console.log(departmentid)
        // role = await Role.findOne({ "name" : "superadmin"})
        // roleid = role._id
        // console.log(roleid)
        const candidate = await User.findOne()
        if(!candidate) {
            const user = new User({
                email: 'r.kislov@egov66.ru',
                name: 'Roman Kislov',

            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log (`app start, and listen port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }

}

start()

