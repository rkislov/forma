const {Schema,model} = require('mongoose')

const grbsSchema = new Schema({

name: {
    type: String,
    required: true
},
})

module.exports = model('Grbs', grbsSchema)