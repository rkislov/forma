const {Router} = require('express')
const User = require('../models/user')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const router = Router()
const keys = require('../keys')
const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')
const {validationResult} = require('express-validator')
const {registerValidators} =require('../utils/validators')

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

router.get('/login',async (req,res) =>{
    res.render('auth/login',{
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')      
    })
    
})
router.get('/logout',async (req,res) =>{
    req.session.destroy(()=>{
        res.redirect('/auth/login#login')
    })
    
   
})

router.post('/login', async(req,res)=>{
    try {
        const {email,password} = req.body
        const candidate = await User.findOne({email})
        if (candidate){
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame){               
                req.session.user = candidate           
                req.session.isAuthenticated = true
                req.session.save(err=>{
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            }else{
                req.flash('loginError', 'Не верный пароль')
                res.redirect('/auth/login#/login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.redirect('/auth/login#/login')
        }
    } catch (error) {
        console.log(error)
    }
    
    
})

router.post('/register', registerValidators,async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login', {
            title: 'Авторизация',
            isLogin: true,
            error: errors.array()[0].msg,
            data: {
                email: req.body.email,
                name: req.body.name
            }
        })
    }
    try {
        const {email,password,confirm,name} = req.body
        const candidate = await User.findOne({email})

        if(candidate){
            req.flash('registerError', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login#register')
        } else {
           
            if (password === confirm) {
                const hashPassword = await bcrypt.hash(password, 10)
                const user = new User({
                    name,
                    email,
                    password: hashPassword
                })
    
                await user.save()
                res.redirect('/auth/login#login')
                await transporter.sendMail(regEmail(email))

            } else {
                req.flash('registerError', 'Пароли не совпадают')
                res.redirect('/auth/login#register')             
            }     
        }

    } catch (error) {
        console.log(error)
    }
})

router.get('/reset', (req,res)=>{
    res.render('auth/reset',{
        title: 'Забыли пароль',
        error: req.flash('error')
        
    })
})

router.post('/reset', (req,res) => {
    try {
        crypto.randomBytes(32, async (err,buffer) =>{
            if(err){
                req.flash('error', 'что-то пошлло не так, повторите попытку позже')
                return res.redirect('/auth/reset')                
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login') 
            } else {
                req.flash('error', 'Такого пользователя не существует' )
                return res.redirect('/auth/reset')
            }
        })
    } catch (error) {
        console.log(e)
    }
})

router.get('/password/:token',async (req,res)=>{
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
            res.render('auth/password',{
            title: 'Забыли пароль',
            error: req.flash('error'),
            userId: user._id.toString(),
            token: req.params.token

            })
        }
    } catch (error) {
        console.log(error)
    }

    
})

router.post('/password', async(req,res)=>{
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

    
        if(user){
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'Время эизни токена истекло')
            res.redirect('/auth/login')
        }

    } catch (error) {
        console.log(error)
    }
})
module.exports = router