const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const { response } = require('express')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname:'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static('public'))

app.get('/', (req,res) => {
    res.render('index', {
        title: 'Главная страница',
        isHome: true
    })
})


app.get('/add', (req,res) => {
    res.render('add', {
        title: 'Добавление данных',
        isAdd: true
    })
})

app.get('/table', (req,res) => {
    res.render('table', {
        title: 'Просмотр данных',
        isTable: true
    })
})





const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log (`app start, and listen port ${PORT}`)
})