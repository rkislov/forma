const {Router} = require('express')
const Record = require('../models/record')
const User = require('../models/user')
const Department = require('../models/department')
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
            grbsId: req.session.user.grbsId,
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
        const forIndex = pageCount - (perPage*page) +perPage
    
               
            res.render('table', {
            title: 'Просмотр данных',
            isTable: true,
            userRole: req.session.user ? req.session.user.role : null,
            grbsId: req.session.user.grbsId,
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
        const pageCountForIndex = await  Record.countDocuments({userId})
        const forIndex = pageCountForIndex 
    
               
            res.render('table', {
            title: 'Просмотр данных',
            isTable: true,
            userRole: req.session.user ? req.session.user.role : null,
            grbsId: req.session.user.grbsId,
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
        const pageCount = await Record.countDocuments({userId})
        const pageCountForIndex = await  Record.countDocuments({userId})
        const forIndex = pageCountForIndex - (perPage*page) + perPage
        
               
            res.render('table', {
            title: 'Просмотр данных',
            isTable: true,
            userRole: req.session.user ? req.session.user.role : null,
            grbsId: req.session.user.grbsId,
            records,
            userId,
            isMyDep: true,
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


router.get('/mydep',auth, async (req,res) => {
    userId = req.session.user._id.toString()
    depId = req.session.user.departmentId
    const perPage = 20
    const page =  1
    
    try {
        const skip = ((perPage*page)- perPage)
        const records = await User.aggregate([
            { $match: { departmentId: depId } },
            {
            
            $lookup:{
                from: 'departments',
                localField: 'departmentId',
                foreignField: '_id',
                as: 'dep'
            }},
            {
                $lookup:{
                    from: 'records',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'deprecords'
                }
            },{
                $unwind: {
                  path: "$deprecords",
                  preserveNullAndEmptyArrays: false
                }
              },
        ]).skip((perPage*page)- perPage).limit(perPage)
        const pageCountAll = await User.aggregate([
            { $match: { departmentId: depId } },
            {
            
            $lookup:{
                from: 'departments',
                localField: 'departmentId',
                foreignField: '_id',
                as: 'dep'
            }},
            {
                $lookup:{
                    from: 'records',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'deprecords'
                }
            },{
                $unwind: {
                  path: "$deprecords",
                  preserveNullAndEmptyArrays: false
                }
              },
              {
                  $count: "docs_count"
              }
        ])
        const pageCount = pageCountAll[0].docs_count
        const pageCountForIndex = pageCount
        const forIndex = pageCountForIndex - (perPage*page)+perPage
        
               
            res.render('table-dep', {
            title: 'Просмотр данных',
            isTable: true,
            userRole: req.session.user ? req.session.user.role : null,
            grbsId: req.session.user.grbsId,
            records,
            userId,
            isMyDep: true,
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
router.get('/mydep/page/:page',auth, async (req,res) => {
    userId= req.session.user._id.toString()
    depId = req.session.user.departmentId
    const perPage = 20
    const page = req.params.page || 1

       try {
               const records = await User.aggregate([
                { $match: { departmentId: depId } },
                {
                
                $lookup:{
                    from: 'departments',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'dep'
                }},
                {
                    $lookup:{
                        from: 'records',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'deprecords'
                    }
                },{
                    $unwind: {
                      path: "$deprecords",
                      preserveNullAndEmptyArrays: false
                    }
                  },
            ]).skip((perPage*page)- perPage).limit(perPage)
            
            const pageCountAll = await User.aggregate([
                { $match: { departmentId: depId } },
                {
                
                $lookup:{
                    from: 'departments',
                    localField: 'departmentId',
                    foreignField: '_id',
                    as: 'dep'
                }},
                {
                    $lookup:{
                        from: 'records',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'deprecords'
                    }
                },{
                    $unwind: {
                      path: "$deprecords",
                      preserveNullAndEmptyArrays: false
                    }
                  },
                  {
                      $count: "docs_count"
                  }
            ])
            const pageCount = pageCountAll[0].docs_count
            const pageCountForIndex = pageCount
            const forIndex = pageCountForIndex - (perPage*page) + perPage
            
                   
                res.render('table-dep', {
                title: 'Просмотр данных',
                isTable: true,
                userRole: req.session.user ? req.session.user.role : null,
                grbsId: req.session.user.grbsId,
                records,
                userId,
                isMyDep: true,
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

        // if(!isOwner(record, req)) {
        //     return res.redirect('/records')
        // }
        res.render('record-edit',{
            title: `редактирование ${record.name}`,
            record
        })
    
    } catch (error) {
        console.log(error)
    }

})

router.post('/remove',auth, async (req,res)=>{
    
    const {id} = req.body
   
    try {
        await Record.deleteOne({
            _id: id
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
        const truecolichestvo = req.body.colichestvo.replace(/ /g, '').replace(/,/g, '.').trim()
        const trueprice = req.body.price.replace(/ /g, '').replace(/,/g, '.').trim()
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
            colichestvo: truecolichestvo,
            price: trueprice,
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