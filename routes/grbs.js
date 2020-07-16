const {Router} = require('express')
const auth = require('../middleware/auth')
const {validationResult} = require('express-validator')
const Grbs = require('../models/grbs')
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
            }
        })

    }
    const candidate = await Grbs.findOne({name: req.body.name})
    
    if(!candidate){
        const grbs = new Grbs()
        grbs.name = req.body.name
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

router.post('/edit', auth, async (req,res)=>{
    try {
        const {id} = req.body
        const grbs = await Grbs.findById(id)
        delete req.body.id
        await Grbs.findByIdAndUpdate(id, {
            name: req.body.name,
        })
        res.redirect('/grbs')
    } catch (error) {
        console.log(error)
    }
    
    
})
module.exports = router
