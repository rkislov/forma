const {Router} = require('express')
const Record = require('../models/record')
const router = Router()

router.get('/', (req,res) => {
    res.render('add', {
        title: 'Добавление данных',
        isAdd: true
    })
})

router.post('/', async (req,res)=> {
    const record = new Record(req.body.name, req.body.nomer_dogovora, req.body.data_zakl_dogovora)
    await record.save()
    res.redirect('/table')
})

module.exports = router