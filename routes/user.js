const {Router} = require('express')
const { model } = require('mongoose')
const User = require('../models/user')
const Department = require('../models/department')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator')
const {addValidators,registerValidators} = require('../utils/validators')
const router = Router()
const keys = require('../keys')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const addEmail = require('../emails/addemail')
const department = require('../models/department')


const transporter = nodemailer.createTransport({
    host: '10.0.16.29',
    port: 25,
    secure: false,
    auth: {
      user: keys.EMAIL_USER,
      pass: keys.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
  })

router.get('/', async (req,res)=> {
    const perPage = 20
    const page =  1
    const users = await User.find()
    .skip((perPage*page)- perPage)
    .limit(perPage)
    const pageCount = await User.countDocuments()
    
    res.render('users',{
        title: 'Пользователи',
        isUsers: true,
        error: req.flash('error'),
        userRole: req.session.user ? req.session.user.role : null,
        users,
        pagination: {
            page,       // The current page the user is on
            pageCount  // The total number of available pages
          }
    })
    
})

router.get('/page/:page', async (req,res)=> {
    const perPage = 20
    const page = req.params.page || 1
    const users = await User.find()
    .skip((perPage*page)- perPage)
    .limit(perPage)
    const pageCount = await User.countDocuments()
    
    res.render('users',{
        title: 'Пользователи',
        isUsers: true,
        error: req.flash('error'),
        userRole: req.session.user ? req.session.user.role : null,
        users,
        pagination: {
            page,       // The current page the user is on
            pageCount  // The total number of available pages
          }
    })
    
})

router.post('/add', addValidators , async (req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg)
      return res.status(422).redirect('/users')
    }
  
  
    try {
        crypto.randomBytes(32, async (err,buffer) =>{
            if(err){
                req.flash('error', 'что-то пошлло не так, повторите попытку позже')
                return res.redirect('/users')                
            }

            
        
        crypto.randomBytes(12, async (err,pass) =>{
            if(err){
               req.flash('error', 'что-то пошлло не так, повторите попытку позже')
               return res.redirect('/users')                
            }

            const token = buffer.toString('hex')
            // const candidate = await User.findOne({email: req.body.email})

            // if (!candidate) {
                const user = new User()
                user.email = req.body.email
                user.resetToken = token
                user.resetTokenExp = Date.now() + 60 * 60 * 24 *1000
                user.password = pass,
                user.parentDepartmentId = req.session.user.departmentId
                await user.save()
                await transporter.sendMail(addEmail(user.email, token))
                res.redirect('/users') 
            // } else {
            //     req.flash('error', 'Такой пользователя уже существует' )
            //     return res.redirect('/users')
            // }
        })
    })
    } catch (error) {
        console.log(e)
    }
    
})
router.get('/adduser/:token',async (req,res)=>{
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }
    try {
        const user = await User.findOne({
        resetToken: req.params.token,
        resetTokenExp: {$gt: Date.now()}
        })
       
        if(!user){
            return res.redirect('/auth/login')
        } else {
            res.render('auth/adduser',{
            title: 'Создание пользователя',
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token,
            error: req.flash('error')

            })
        }
    } catch (error) {
        console.log(error)
    }

    
})

router.post('/adduser', registerValidators, async (req,res)=>{
        const errors= validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg)
            return res.status(422).redirect('/users/adduser')
        }


    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })


        const depCandidate = await Department.findOne({inn: req.body.departmentInn})
        if(!depCandidate) {
            const department = new Department()
            department.name = req.body.departmentName,
            department.inn = req.body.departmentInn
            await department.save()

            if(user){
                user.password = await bcrypt.hash(req.body.password, 10)
                user.resetToken = undefined
                user.resetTokenExp = undefined
                user.departmentId = department
                await user.save()
                res.redirect('/auth/login')
            } else {
                req.flash('loginError', 'Время жизни токена истекло')
                res.redirect('/auth/login')
            }
        } else {

            if(user){
                user.password = await bcrypt.hash(req.body.password, 10)
                user.name = req.body.name
                user.resetToken = undefined
                user.resetTokenExp = undefined
                user.departmentId = depCandidate
                await user.save()
                res.redirect('/auth/login')
            } else {
                req.flash('loginError', 'Время жизни токена истекло')
                res.redirect('/auth/login')
            }
        }
    
        

    } catch (error) {
        console.log(error)
    }
})
module.exports = router