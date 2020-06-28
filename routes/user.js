const {Router} = require('express')
const { model } = require('mongoose')
const router = Router()
const User = require('../models/user')

router.get('/', async (req,res)=> {
    const users = await User.find()
    res.render('users',{
        title: 'Пользователи',
        users
    })
})

module.exports = router