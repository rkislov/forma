const {Router} = require('express')
const Record = require('../models/record')
const router = Router()

router.get('/', async (req,res) => {
    const records = await Record.getAll()
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
    const record = await Record.getById(req.params.id)
    res.render('record-edit',{
        title: `редактирование ${record.name}`,
        record
    })
})

router.post('/edit', async (req,res)=>{
    await Record.update(req.body)
    res.redirect('/records')
})

router.get('/:id', async (req,res) =>{
    const record = await Record.getById(req.params.id)
    res.render('record',{
        title: `Данные о записи ${record.name}`,
        record
    })
})

module.exports = router