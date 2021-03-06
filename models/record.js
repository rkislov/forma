const {Schema, model} = require('mongoose')
const { now } = require('moment')

const record = new Schema({
    name: {
        type: String,
        required: true,
    },
    inn: {
        type: String,
        required: true,
    },
    nomer_dogovora: {
        type: String,
        required: true,
    },
    data_zakl_dogovora: {
        type: Date,
        required: true,
    },
    sposob_opredelenia: {
        type: String,
        
    },
    kod_okpd2: {
        type: String,
        
    },
    kod_okved2: {
        type: String,
        
    },
    nac_proekt: {
        type: String,
        
    },
    object: {
        type: String,
        
    },
    colichestvo: {
        type: Number,
        default: 1
        
    },
    price: {
        type: Number,
        default: 0
       
    },
    full_price: {
        type: Number,
        default: 0
        
    },
    celi: {
        type: String,
        
    },
    marki: {
        type: String,
        
    },
    analiz: {
        type:String
    },
    name_kontragent: {
        type:String,
        
    },
    inn_kontragent: {
        type: String,
        required:true
    },
    mesto_kontragenta: {
        type: String,
        required:true
    },
    grbs: {
        type:String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = model('Record',record)