const {Schema,model} = require('mongoose')

const grbsSchema = new Schema({

name: {
    type: String,
    required: true
},
email: {
    type: String,
    
},
})

module.exports = model('Grbs', grbsSchema)