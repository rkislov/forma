const { v4: uuid } = require('uuid')
const fs = require('fs')
const path = require('path')

class Record {
    constructor(name, nomer_dogovora, data_zakl_dogovora) {
        this.name = name,
        this.nomer_dogovora = nomer_dogovora,
        this.data_zakl_dogovora = data_zakl_dogovora
        this.id = uuid()
    }

    toJSON(){
        return ({
            name: this.name,
            nomer_dogovora: this.nomer_dogovora,
            data_zakl_dogovora: this.data_zakl_dogovora,
            id: this.id
        })
    }

    async save() {
        const records = await Record.getAll()
        records.push(this.toJSON())

        return new Promise((resolve,reject)=>{
            fs.writeFile(
                path.join(__dirname,'..','data','records.json'),
                JSON.stringify(records),
                (err)=> {
                    if(err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                }
            )
        })
            
    }

    static async update(record) {
       const records = await Record.getAll()

       const idx = records.findIndex(c => c.id === record.id)

       records[idx] = record

       return new Promise((resolve,reject)=>{
        fs.writeFile(
            path.join(__dirname,'..','data','records.json'),
            JSON.stringify(records),
            (err)=> {
                if(err) {
                    reject(err)
                } else {
                    resolve()
                }
            }
        )
    })
    }
    static getAll() {
        return new Promise((resolve,reject) =>{
            fs.readFile(
                path.join(__dirname,'..', 'data', 'records.json'),
                'utf-8',
                (err, content) => {
                    if(err) {
                        reject(err)
                    } else {
                      resolve(JSON.parse(content))  
                    }
    
                }
            )
        })
 
    }

    static async getById(id) {
        const records = await Record.getAll()
        return records.find(c=> c.id === id )
    }
}

module.exports = Record