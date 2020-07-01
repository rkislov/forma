const {Router} = require('express')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const router = Router()
const keys = require('../keys')
const regEmail = require('../emails/registration')

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

router.post('/register',async (req,res)=>{
    try {
        const {email,password,confirm,name} = req.body
        const candidate = await User.findOne({email})

        if(candidate){
            req.flash('registerError', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login/#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                name,
                email,
                password: hashPassword
            })

            await user.save()
            res.redirect('/auth/login#login')
            
            await transporter.sendMail(regEmail(email))
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router