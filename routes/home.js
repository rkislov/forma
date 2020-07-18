const {Router} = require('express')
const { registerDecorator } = require('handlebars')
const router = Router()

router.get('/', (req,res) =>{
    // res.render('index', {
    //     title: 'Главная страница',
    //     userRole: req.session.user ? req.session.user.role : null,
    //     isHome: true
    // })
    res.redirect('/records')
})

module.exports = router