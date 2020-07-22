const moment = require('helper-moment')
const paginate = require('handlebars-paginate');
module.exports = {
    ifeq(a,b, options) {
        if(a == b) {
            return options.fn(this)
        } 
        return options.inverse(this)
    },
moment,
paginate,
counter(index, forIndex) {
    return index = forIndex - (index + 1)
}

}



