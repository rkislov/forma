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
    
    const record = new Record({
        name: req.body.name,
        nomer_dogovora: req.body.nomer_dogovora,
        data_zakl_dogovora:req.body.data_zakl_dogovora
    })

    try {
        await record.save()
        res.redirect('/records')
    } catch (error) {
        console.log(error)
    }
    

    
})

module.exports = router