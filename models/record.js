const {Schema, model} = require('mongoose')

const record = new Schema({
    name: {
        type: String,
        required: true,
    },
    nomer_dogovora: {
        type: String,
        required: true,
    },
    data_zakl_dogovora: {
        type: String,
        required: true,
    },
    sposob_opredelenia: {
        type: String,
        required: true
    },
    kod_okpd2: {
        type: String,
        required: true
    },
    kod_okved2: {
        type: String,
        required: true
    },
    nac_proekt: {
        type: String,
        required: true
    },
    object: {
        type: String,
        required: true
    },
    colichestvo: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    full_price: {
        type: Number,
        required: true
    },
    celi: {
        type: String,
        required: true
    },
    marki: {
        type: String,
        required: true
    },
    name_kontragent: {
        type:String,
        required: true
    },
    inn_kontragent: {
        type: String,
        required:true
    },
    mesto_kontragenta: {
        type: String,
        required:true
    }
})

module.exports = model('Record',record)