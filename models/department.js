const {Schema,model} = require('mongoose')

const departmentSchema = new Schema({

name: {
    type: String,
    required: true
}
})

module.exports = model('Department', departmentSchema)