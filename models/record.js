const uuid = require('uuid')
const fs = require('fs')
const path = require('path')

class Record {
    constructor(name, nomer_dogovora, data_zakl_dogovora) {
        this.name = name,
        this.nomer_dogovora = nomer_dogovora,
        this.data_zakl_dogovora = data_zakl_dogovora
        this.id = uuid()
    }

    save() {
        
    }
}