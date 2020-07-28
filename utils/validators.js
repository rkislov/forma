const {body} = require('express-validator')
const User = require('../models/user')
const { locale } = require('moment')


exports.addValidators = [
    body('email').isEmail().withMessage('Введите корректный email').custom(async (value, {req})=>{
        try {
            const user = await User.findOne({email: value})
            if (user) {
                return Promise.reject('Пользователь с таким email уже существует')
            }
        } catch (error) {
            console.log(error)
        }
    }).normalizeEmail()

]

exports.registerValidators = [
    body('password', 'Пароль должен быть минимум 6 символов').isLength({min:6,max:56}).isAlphanumeric().trim(),
    body('confirm').custom((value, {req})=>{
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать')
        }
        return true
    }).trim(),
    body('name').isLength({min:3}).withMessage('Имя должно быть минимум 3 символа').trim()
]

exports.recordValidator= [
    //body('price').isNumeric().withMessage('Введите корректную цену')
]

exports.grbsValidators = [
    body('name').isAlpha().isLength({min:3}).withMessage('Имя должно быть минимум 3 символа').trim()

]