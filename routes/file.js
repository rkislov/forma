const {Router} = require('express')
const router = Router()
const Record = require('../models/record')
const auth = require('../middleware/auth')
const excel = require('exceljs')
const path = require('path')
const fs = require('fs')


router.get('/full',async (req,res)=>{
    
    try {
        const records = await Record.find()
        .populate('userId','email name')
        const workbook = new excel.Workbook()
        const worksheet = workbook.addWorksheet('Zapisi')
        
        worksheet.columns = [
            {header:'Заказчик (наименование)', key: 'name', width: 30},
            {header:'Номер договора/контракта  в ЕИС', key: 'nomer_dogovora', width: 30},
            {header:'Дата заключения договора/контракта', key: 'data_zakl_dogovora', width: 30},
            {header:'Способ определения поставщика', key: 'sposob_opredelenia', width: 30},
            {header:'Код по ОКПД2', key: 'kod_okpd2', width: 30},
            {header:'Код по ОКВЭД2', key: 'kod_okved2', width: 30},
            {header:'Программа или Национальный проект, в рамках которого проведена закупка (при наличии)', key: 'nac_proekt', width: 30},
            {header:'Объект закупки (наименование товара, указать в соответсвии со спецификацией)', key: 'object', width: 30},
            {header:'Кол-во, шт', key: 'colichestvo', width: 30},
            {header:'Цена за единицу, руб.', key: 'price', width: 30},
            {header:'Сумма, руб.', key: 'full_price', width: 30},
            {header:'Цели, для достижения которых проведена закупка с указанием показателей в натуральном выражении', key: 'celi', width: 30},
            {header:'Конкретные марки и модели товаров, характеристики работ, услуг, которые рассматривал заказчик (не менее трех) при обосновании НМЦК, и которые позволяют достигнуть заказчику необходимых целей  (целевых показателей), в том числе в случае, если товары использовались при выполнении работ, оказании услуг', key: 'marki', width: 30},
            {header:'В случае, если заказчик рассматривал менее трех марок моделей товаров, характеристик работ, услуг, то обоснование в силу каких технических, технологических особенностей изделий не нашлось взаимозаменяемых для удовлетворения потребности заказчика.', key: 'analiz', width: 30},
            {header:'Наименование контрагента', key: 'name_kontragent', width: 30},
            {header:'ИНН контрагента', key: 'inn_kontragent', width: 30},
            {header:'Место регистрации контрагента (указывается субъект РФ)', key: 'mesto_kontragenta', width: 30},
        ]

        worksheet.addRows(records)
        
        await workbook.xlsx.writeFile(path.join(__dirname,'..','download','zakazi.xlsx'))

        res.download(path.join(__dirname,'..','download','zakazi.xlsx')).redirect('/records')
    } catch (error) {
        console.log(error)
    }
})


module.exports = router