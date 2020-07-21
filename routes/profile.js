const {Router} =require('express')
const auth = require('../middleware/auth')
const Grbs = require('../models/grbs')
const User = require('../models/user')
const Department = require('../models/department')
const {validationResult} = require('express-validator')
router = Router()

router.get('/', auth, async (req,res)=>{
    const grbs = await Grbs.find()
    const user = await User.findById(req.session.user._id).populate('departmentId', 'name inn').populate('grbsId')
    res.render('auth/profile',{
        title: 'Профиль',
        isProfile: true,
        user,
        grbs
    })

})

router.post('/', auth, async(req,res)=>{
    const errors= validationResult(req)
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg)
        return res.status(422).redirect('/profile')
    }


try {
    const user = await User.findOne({    
        _id: req.body.userId     
    })
    const grbs = await Grbs.findOne({    
        _id: req.body.grbs     
    })
    const depCandidate = await Department.findOne({inn: req.body.departmentInn})
    if(!depCandidate) {
        const department = new Department()
        department.name = req.body.departmentName,
        department.inn = req.body.departmentInn
        await department.save()


        if(user){
            user.departmentId = department
            user.grbs = grbs
            await user.save()
            res.redirect('/proifile')
        } else {
            req.flash('error', 'Время жизни токена истекло')
            res.redirect('/profile')
        }
    } else {

        if(user){
            depCandidate.name = req.body.departmentName
            user.departmentId = depCandidate
            user.grbsId = grbs
            await depCandidate.save()
            await user.save()
            res.redirect('/profile')
        } else {
            req.flash('error', 'Время жизни токена истекло')
            res.redirect('/profile')
        }
    }

    

} catch (error) {
    console.log(error)
}
})

module.exports = router