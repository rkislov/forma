const {Router} = require('express')
const Record = require('../models/record')
const router = Router()
const auth = require('../middleware/auth')

router.get('/',auth, (req,res) => {
    res.render('add', {
        title: 'Добавление данных',
        isAdd: true
    })
})

router.post('/',auth, async (req,res)=> {
    
    const record = new Record({
        name: req.body.name,
        nomer_dogovora: req.body.nomer_dogovora,
        data_zakl_dogovora: req.body.data_zakl_dogovora,
        sposob_opredelenia: req.body.sposob_opredelenia,
        kod_okpd2: req.body.kod_okpd2,
        kod_okved2: req.body.kod_okved2,
        nac_proekt: req.body.nac_proekt,
        object: req.body.object,
        colichestvo: req.body.colichestvo,
        price: req.body.price,
        full_price: req.body.price*req.body.colichestvo,
        celi: req.body.celi,
        marki: req.body.marki,
        name_kontragent: req.body.name_kontragent,
        inn_kontragent: req.body.inn_kontragent,
        mesto_kontragenta: req.body.mesto_kontragenta,
        userId: req.session.user
    })

    try {
        await record.save()
        res.redirect('/records')
    } catch (error) {
        console.log(error)
    }
    

    
})

module.exports = router