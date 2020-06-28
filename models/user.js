const {Schema, model} = require('mongoose')


const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        
    }
})

module.exports = model('User', userSchema)