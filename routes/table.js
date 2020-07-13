const {Router} = require('express')
const Record = require('../models/record')
const router = Router()
const auth = require('../middleware/auth')



function isOwner(record, req) {
 return record.userId.toString() === req.session.user._id.toString()
}

router.get('/',auth, async (req,res) => {
    try {
        const records = await Record.find()
        .populate('userId','email name')
        
    
               
            res.render('table', {
            title: 'Просмотр данных',
            isTable: true,
            userId: req.session.user ? req.session.user._id.toString() : null,
            records
           
        })
            
    } catch (error) {
        console.log(error)
    }
})  

router.get('/:id/edit',auth,async (req,res) =>{
    if (!req.query.allow) {
        return res.redirect('/')
    }

    try {
        const record = await Record.findById(req.params.id)

        if(!isOwner(record, req)) {
            return res.redirect('/records')
        }
        res.render('record-edit',{
            title: `редактирование ${record.name}`,
            record
        })
    
    } catch (error) {
        console.log(error)
    }

})

router.post('/remove',auth, async (req,res)=>{
    try {
        await Record.deleteOne({
            _id: req.body.id,
            userId: req.session.user._id
        })      
        res.redirect('/records')  
    } catch (error) {
        console.log(error)
    }
    

})

router.post('/edit', auth, async (req,res)=>{
    try {
        const {id} = req.body
        const record = await Record.findById(id)
        delete req.body.id
        if(!isOwner(record, req)) {
            return res.redirect('/records')
        }
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
            analiz: req.body.analiz,
            name_kontragent: req.body.name_kontragent,
            inn_kontragent: req.body.inn_kontragent,
            mesto_kontragenta: req.body.mesto_kontragenta
        })
        res.redirect('/records')
    } catch (error) {
        console.log(error)
    }
    
    
})

router.get('/:id', auth, async (req,res) =>{
    try {
        const record = await Record.findById(req.params.id)
        res.render('record',{
        title: `Данные о записи ${record.name}`,
        record
    })
    } catch (error) {
        console.log(error)
    }
    

})



module.exports = router