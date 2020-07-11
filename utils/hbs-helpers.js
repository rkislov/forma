const moment = require('helper-moment')
module.exports = {
    ifeq(a,b, options) {
        if(a == b) {
            return options.fn(this)
        } 
        return options.inverse(this)
    },
moment
    
}



