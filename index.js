/* 
必备字段
id, create_time, update_time 
*/

export default class spModel {

    /* 
        需要在子类中手动添加属性 table，作为表名
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

        if (result && result.length > 0)
            return result[0]
        return null
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

        obj.create_time = this.string2timestamp()
        obj.update_time = this.string2timestamp()

        let sql = `INSERT INTO ${this.table} set ?`

        let [result] = await this.mysql.query(sql, obj)

        let id = result.insertId

        if (id) return id

        return false
    }

    async updateById(id, obj) {

        obj.update_time = this.string2timestamp()

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

    string2timestamp(time) {

        let _time

        if (time) {
            _time = new Date(time)
        } else {
            _time = new Date()
        }

        return Math.round(_time / 1000)
    }

    timestamp2string(timestamp) {

        if (("" + timestamp).length === 10)
            timestamp *= 1000

        let _time = new Date(timestamp)

        let year = _time.getFullYear()
        let month = _time.getMonth() + 1
        let date = _time.getDate()
        let hour = this._char(_time.getHours())
        let minute = this._char(_time.getMinutes())
        let second = this._char(_time.getSeconds())

        return `${year}-${month}-${date} ${hour}:${minute}:${second}`
    }

    /* 字符补齐 */
    _char(num, count = 2) {

        num += ""

        if (num.length < count) {
            let _0count = count - num.length
            for (let i = 0; i < _0count; i++) {
                num = "0" + num
            }
        }

        return num
    }

    returnOne(result) {
        if (result.length > 0)
            return result[0]
        return null
    }
}