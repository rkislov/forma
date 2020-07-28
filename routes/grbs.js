const {Router} = require('express')
const auth = require('../middleware/auth')
const {validationResult} = require('express-validator')
const Grbs = require('../models/grbs')
const User = require('../models/user')
const router = Router()


router.get('/',auth, async (req,res)=>{
    try {
        const allgrbs = await Grbs.find()
        res.render('grbs/index', {
        title: 'Главные распорядители бюджетных средств',
        isGrbs: true,
        error: req.flash('error'),
        userRole: req.session.user ? req.session.user.role : null,
        allgrbs
    })
    } catch (error) {
        console.log(error)
    }
    
})
router.post('/add',auth,async(req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
        return res.status(422).render('grbs/index', {
            title: 'Главные распорядители бюджетных средств',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                name: req.body.name,
                email: req.body.email,
            }
        })

    }
    const candidate = await Grbs.findOne({name: req.body.name})
    
    if(!candidate){
        const grbs = new Grbs()
        grbs.name = req.body.name
        grbs.email = req.body.email
        await grbs.save()
        res.redirect('/grbs')
    } else {
        req.flash('error', 'Главный распорядитель бюджетных средств с таким именем уже существует')
        res.redirect('/grbs')
    }
        
    } catch (error) {
        console.log(error)
    }
    
 })
 router.get('/:id/edit',auth,async (req,res) =>{
    if (!req.query.allow) {
        return res.redirect('/grbs')
    }

    try {
        const grbs = await Grbs.findById(req.params.id)

            res.render('grbs/edit',{
            title: `редактирование ${grbs.name}`,
            grbs
        })
    
    } catch (error) {
        console.log(error)
    }

})
router.get('/:id',auth,async (req,res) =>{
   

    try {
        const grbs = await Grbs.findById(req.params.id)

            res.render('grbs/view',{
            title: `редактирование ${grbs.name}`,
            grbs
        })
        const departments = await User.aggregate([
            // { $match: { grbsIg: req.params.id } },
            {
            
            $lookup:{
                from: 'departments',
                localField: 'departmentId',
                foreignField: '_id',
                as: 'dep'
            }},
            // {
            //     $lookup:{
            //         from: 'records',
            //         localField: '_id',
            //         foreignField: 'userId',
            //         as: 'deprecords'
            //     }
            // }
            {
                $unwind: {
                  path: "$dep",
                  preserveNullAndEmptyArrays: false
                }
              },
        ]).limit(10)
    console.log(departments)
    } catch (error) {
        console.log(error)
    }

})

router.post('/edit', auth, async (req,res)=>{
    try {
        const {id} = req.body
        const grbs = await Grbs.findById(id)
        delete req.body.id
        await Grbs.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email
        })
        res.redirect('/grbs')
    } catch (error) {
        console.log(error)
    }
    
    
})
router.get('/searchemail', async (req,res) =>{
    try {
        const q = req.body.query
    const query = {
        "$or" : [{"name": {"$regex": q, "$options":"q"}}, {"email": {"$regex": q, "$options":"q"}}]
    }
    const output = []
    await User.find(query).limit(4).then( usrs =>{
        if(usrs && usrs.length && usrs.length >0) {
            usrs.forEach(user => {
                const obj = {
                    id: user.name + ' ' + user.email,
                    label: user.name + ' ' + user.email,
                }
                output.push(obj)
            })
        }
        res.json(output)
    }).catch(err => {
        res.sendStatus(404)
    })
    } catch (error) {
        console.log(error)
    }
    
})
module.exports = router
