const {Schema, model} = require('mongoose')

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
        
    },
    price: {
        type: Number,
       
    },
    full_price: {
        type: Number,
        
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
    }

})

module.exports = model('Record',record)