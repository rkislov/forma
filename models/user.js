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
    resetTokenExp: Date,
    checked: Boolean,
    delete: {
        type:Boolean,
        default: false
    }
})

userSchema.virtual('depname',{
    ref: 'departments',
    localField: 'departmentId',
    foreignField: '_id',
    justOne: true
})

module.exports = model('User', userSchema)