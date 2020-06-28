const {Router} = require('express')
const Record = require('../models/record')
const router = Router()

router.get('/', async (req,res) => {
    const records = await Record.find()
        res.render('table', {
        title: 'Просмотр данных',
        isTable: true,
        records
    })
})

router.get('/:id/edit', async (req,res) =>{
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const record = await Record.findById(req.params.id)
    res.render('record-edit',{
        title: `редактирование ${record.name}`,
        record
    })
})

router.post('/remove', async (req,res)=>{
    try {
        await Record.deleteOne({
            _id: req.body.id
        })      
        res.redirect('/records')  
    } catch (error) {
        console.log(error)
    }
    

})

router.post('/edit', async (req,res)=>{
    const {id} = req.body
    delete req.body.id
    await Record.findByIdAndUpdate(id, req.body)
    res.redirect('/records')
})

router.get('/:id', async (req,res) =>{
    const record = await Record.findById(req.params.id)
    res.render('record',{
        title: `Данные о записи ${record.name}`,
        record
    })
})

module.exports = router