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
    } 
})

module.exports = model('Record',record)