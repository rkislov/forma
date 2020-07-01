const {Router} = require('express')
const Record = require('../models/record')
const router = Router()

router.get('/', async (req,res) => {
    const records = await Record.find()
    .populate('userId','email name')

        console.log(records)

        res.render('table', {
        title: 'Просмотр данных',
        isTable: true,
        records
    })
})

router.get('/:id/edit', async (req,res) =>{
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const record = await Record.findById(req.params.id)
    res.render('record-edit',{
        title: `редактирование ${record.name}`,
        record
    })
})

router.post('/remove', async (req,res)=>{
    try {
        await Record.deleteOne({
            _id: req.body.id
        })      
        res.redirect('/records')  
    } catch (error) {
        console.log(error)
    }
    

})

router.post('/edit', async (req,res)=>{
    const {id} = req.body
    delete req.body.id
    await Record.findByIdAndUpdate(id, {
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
        mesto_kontragenta: req.body.mesto_kontragenta
    })
    res.redirect('/records')
})

router.get('/:id', async (req,res) =>{
    const record = await Record.findById(req.params.id)
    res.render('record',{
        title: `Данные о записи ${record.name}`,
        record
    })
})

module.exports = router