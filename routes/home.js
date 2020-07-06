const {Router} = require('express')
const router = Router()

router.get('/', (req,res) =>{
    res.render('index', {
        title: 'Главная страница',
        userRole: req.session.user ? req.session.user.role : null,
        isHome: true
    })
})

module.exports = router