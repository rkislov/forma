const {Router} = require('express')
const Record = require('../models/record')
const User = require('../models/user')
const {validationResult} = require('express-validator')
const router = Router()
const auth = require('../middleware/auth')
const {recordValidator} = require('../utils/validators')
const moment = require('moment')

router.get('/',auth, async (req,res) => {
    const user = await User.findById(req.session.user._id).populate('departmentId', 'name inn').populate('grbsId')
    res.render('add', {
        title: 'Добавление данных',
        userRole: req.session.user ? req.session.user.role : null,
        isAdd: true,
        user
    })
})

router.post('/',auth,  async (req,res)=> {
    const parts = req.body.data_zakl_dogovora.split('.')
    const date = new Date(parts[2],parts[1]-1,parts[0])
    const errors = validationResult(req)
    const truprice =  req.body.price.replace(/,/g, '.')
    if(!errors.isEmpty()){
        return res.status(422).render('add', {
            title: 'Добавление данных',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                name: req.body.name,
                inn: req.body.inn,
                nomer_dogovora: req.body.nomer_dogovora,
                data_zakl_dogovora: date,
                data_zakl_dogovora: req.body.data_zakl_dogovora,
                sposob_opredelenia: req.body.sposob_opredelenia,
                kod_okpd2: req.body.kod_okpd2,
                kod_okved2: req.body.kod_okved2,
                nac_proekt: req.body.nac_proekt,
                object: req.body.object,
                colichestvo: req.body.colichestvo,
                price: truprice,
                full_price: truprice*req.body.colichestvo,
                celi: req.body.celi,
                marki: req.body.marki,
                analiz: req.body.analiz,
                name_kontragent: req.body.name_kontragent,
                inn_kontragent: req.body.inn_kontragent,
                mesto_kontragenta: req.body.mesto_kontragenta,
                grbs: req.body.grbs,
                userId: req.session.user
            }
        })
    }


    const record = new Record({
        name: req.body.name,
        inn: req.body.inn,
        nomer_dogovora: req.body.nomer_dogovora,
        data_zakl_dogovora: date,
        sposob_opredelenia: req.body.sposob_opredelenia,
        kod_okpd2: req.body.kod_okpd2,
        kod_okved2: req.body.kod_okved2,
        nac_proekt: req.body.nac_proekt,
        object: req.body.object,
        colichestvo: req.body.colichestvo,
        price: truprice,
        full_price: truprice*req.body.colichestvo,
        celi: req.body.celi,
        marki: req.body.marki,
        analiz: req.body.analiz,
        name_kontragent: req.body.name_kontragent,
        inn_kontragent: req.body.inn_kontragent,
        mesto_kontragenta: req.body.mesto_kontragenta,
        grbs: req.body.grbs,
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