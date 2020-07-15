const {Schema, model} = require('mongoose')


const userSchema = new Schema ({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        
    },
    password: {
        type: String,
        required: true
    },
    departmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        
    },
    parentDepartmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Department',
        
    },
    role: {
        type: String,
        require: true,
        default: 'user'
        
    },
    grbsId: {
        type: Schema.Types.ObjectId,
        ref: 'Grbs',    
    },
    resetToken: String,
    resetTokenExp: Date 
})

module.exports = model('User', userSchema)