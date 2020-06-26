const {Router} = require('express')
const router = Router()

router.get('/', (req,res) => {
    res.render('table', {
        title: 'Просмотр данных',
        isTable: true
    })
})

module.exports = router