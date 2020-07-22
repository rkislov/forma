const {Router} = require('express')
const Record = require('../models/record')
const router = Router()
const auth = require('../middleware/auth')




function isOwner(record, req) {
 return record.userId.toString() === req.session.user._id.toString()
}

router.get('/',auth, async (req,res) => {
    userId= req.session.user._id.toString()
    const perPage = 20
    const page =  1
    try {
        
        // const records = await Record.find()
        // .populate('userId','email name')
        const records = await Record.find()
        .populate('userId','email name')
        .sort({"createdAt": -1})
        .skip((perPage*page)- perPage)
        .limit(perPage)
        const pageCount = await Record.countDocuments()
        const forIndex = pageCount 
               
            res.render('table', {
            title: 'Просмотр данных',
            isTable: true,
            userRole: req.session.user ? req.session.user.role : null,
            records,
            userId,
            isAll: true,
            forIndex,
            pagination: {
                page,       // The current page the user is on
                pageCount  // The total number of available pages
              }
            
                                 
        })
            
    } catch (error) {
        console.log(error)
    }
})  
router.get('/page/:page',auth, async (req,res) => {
    userId= req.session.user._id.toString()
    const perPage = 20
    const page = req.params.page || 1

    try {
        
        // const records = await Record.find()
        // .populate('userId','email name')
        const records = await Record.find()
        .populate('userId','email name')
        .sort({"createdAt": -1})
        .skip((perPage*page)- perPage)
        .limit(perPage)
        const pageCount = await Record.countDocuments()
        const forIndex = pageCount - (perPage*page)
    
               
            res.render('table', {
            title: 'Просмотр данных',
            isTable: true,
            userRole: req.session.user ? req.session.user.role : null,
            records,
            userId,
            isAll: true,
            forIndex,
            pagination: {
                page,       // The current page the user is on
                pageCount  // The total number of available pages
              }
            
                                 
        })
            
    } catch (error) {
        console.log(error)
    }
})  

router.get('/my',auth, async (req,res) => {
    userId = req.session.user._id.toString()
    const perPage = 20
    const page =  1

    try {
        
        // const records = await Record.find()
        // .populate('userId','email name')
        const records = await Record.find({userId})
        .populate('userId','email name')
        .skip((perPage*page)- perPage)
        .limit(perPage)
        const pageCount = await Record.countDocuments()
        const pageCountForIndex = await  Record.find({userId}).count()
        const forIndex = pageCountForIndex 
    
               
            res.render('table', {
            title: 'Просмотр данных',
            isTable: true,
            userRole: req.session.user ? req.session.user.role : null,
            records,
            userId,
            isMy: true,
            forIndex,
            pagination: {
                page,       // The current page the user is on
                pageCount  // The total number of available pages
              }
            
                                 
        })
            
    } catch (error) {
        console.log(error)
    }
})  
router.get('/my/page/:page',auth, async (req,res) => {
    userId= req.session.user._id.toString()
    const perPage = 20
    const page = req.params.page || 1

    try {
        
        // const records = await Record.find()
        // .populate('userId','email name')
        const records = await Record.find({userId})
        .populate('userId','email name')
        .skip((perPage*page)- perPage)
        .limit(perPage)
        const pageCount = await Record.countDocuments()
        const pageCountForIndex = await  Record.countDocuments({userId})
        const forIndex = pageCountForIndex - (perPage*page)
        
               
            res.render('table', {
            title: 'Просмотр данных',
            isTable: true,
            userRole: req.session.user ? req.session.user.role : null,
            records,
            userId,
            isMy: true,
            forIndex,
            pagination: {
                page,       // The current page the user is on
                pageCount  // The total number of available pages
              }
            
                                 
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

router.get('/remove/:id',auth, async (req,res)=>{
    try {
        await Record.deleteOne({
            _id: req.body.id
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
        
        const parts = req.body.data_zakl_dogovora.split('.')
        const date = new Date(parts[2],parts[1]-1,parts[0])
        
        await Record.findByIdAndUpdate(id, {
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
            price: req.body.price,
            full_price: req.body.price*req.body.colichestvo,
            celi: req.body.celi,
            marki: req.body.marki,
            analiz: req.body.analiz,
            name_kontragent: req.body.name_kontragent,
            inn_kontragent: req.body.inn_kontragent,
            mesto_kontragenta: req.body.mesto_kontragenta,
            grbs: req.body.grbs,
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