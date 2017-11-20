const moment = require('moment')

/* 
必备字段
id, create_time(INT), update_time(INT)
*/

export default class spModel {

    /* 
        需要在子类中手动添加属性 _table，作为表名
    */
    // table: 'dt_user'

    constructor(mysql, prefix = '') {
        this.mysql = mysql
        this.prefix = prefix
    }

    get table() {
        return this.prefix + this._table
    }

    set table(value) {
        this._table = value
    }

    async getOneById(id, cols = '*') {

        let sql = `SELECT ${cols} FROM ${this.table} WHERE id = ${id}`

        let [result] = await this.mysql.query(sql)

        return this.returnOne(result)
    }


    async getLastOne(cols = '*') {

        let sql = `SELECT ${cols} FROM ${this.table} ORDER BY create_time DESC LIMIT 0, 1`

        let [result] = await this.mysql.query(sql)

        return this.returnOne(result)
    }

    async getAll(skip, limit, cols = '*') {

        skip = skip ? skip : 0
        limit = limit ? ` LIMIT ${skip},${limit} ` : ''
        let sql = `SELECT ${cols} FROM ${this.table} ORDER BY id DESC ${limit}`

        let [result] = await this.mysql.query(sql)

        if (result && result.length > 0)
            return result
        return []
    }

    /* 
        id, create_time, update_time
    */
    async create(obj) {

        obj.create_time = moment().format('X')
        obj.update_time = obj.create_time

        let sql = `INSERT INTO ${this.table} set ?`

        let [result] = await this.mysql.query(sql, obj)

        let id = result.insertId

        if (id) return id

        return false
    }

    async updateById(id, obj) {

        obj.update_time = moment().format('X')

        let sql = `UPDATE ${this.table} set ? WHERE id = '${id}'`

        let [result] = await this.mysql.query(sql, obj)

        return result.affectedRows
    }

    async deleteFakeById(id) {

        let sql = `UPDATE ${this.table} set is_delete = 1 WHERE id = '${id}'`

        let [result] = await this.mysql.query(sql)

        return result.affectedRows
    }

    async deleteById(id) {

        let sql = `DELETE FROM ${this.table} WHERE id = '${id}'`

        let [result] = await this.mysql.query(sql)

        return result.affectedRows
    }

    /**
     * 在数组中返回1个对象
     * 此方法目的是同一格式，当返回1个对象时候，或是此对象，或是null
     * @param {*} result 
     */
    returnOne(result) {
        if (result.length > 0)
            return result[0]
        return null
    }
}