const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const tableRoutes = require('./routes/table')
const addRouters = require('./routes/add')


const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname:'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname,'public')))
app.use(express.urlencoded({extended: true}))
app.use('/',homeRoutes)
app.use('/records',tableRoutes)
app.use('/add',addRouters)



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log (`app start, and listen port ${PORT}`)
})