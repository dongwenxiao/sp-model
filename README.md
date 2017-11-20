# sp-model
super-project moudle for base dao operate, base on sp-mysql.

# Usage

## Init

```js
import spMysql from 'sp-mysql'
import spModel from 'sp-model'

class User extends spModel {
    _table = 'dt_user' // 如果想用下面的方法，表名必须指定
}

const mysql = new spMysql(config.mysql)
const userDao = new User(mysql)
```

## Functions

 - 下面的方法均是 ```async function```
 - 表必须带有INT类型字段：create_time、update_time
 - 如果需要用到伪删除，表必须带有INT型字段：is_delete

```js
// getOneById(id, cols = '*')
// => object|null

let one = userDao.getOneById(1) // 获取ID是1的用户全部数据
let one1 = userDao.getOneById(1, 'name,age') // 获取ID是1的用户的姓名和年龄数据

// getLastOne(cols = '*')
let one2 = getLastOne() // 获取最新的1条记录

// getAll(skip, limit, cols = '*')
// => []

let page1 = userDao.getAll(0, 10) // 获取前10条记录（id倒序）的所有字段
let page2 = userDao.getAll(10, 20, 'name,age') // 获取前第10-第20条记录（id倒序）的姓名和年龄字段

// create(obj)
// => id|false

let id = userDao.create({ name: 'victor', age: 18 })

// updateById(id, obj)
// => affectedRows

let updateAffectedRows = userDao.updateById(1, { name: 'tom' })
let success = updateAffectedRows > 0

// deleteById(id)
// deleteFakeById(id) [Fake是表示伪删除，要求字段必须包含is_delete(INT)]
// => affectedRows

let deleteAffectedRows = userDao.deleteById(1)
// let deleteAffectedRows = userDao.deleteFakeById(1)
let isSuccess = deleteAffectedRows > 0
```

说明：为了统一单对象返回，自定义查询可以使用```returnOne(result)```处理。
```js
import spMysql from 'sp-mysql'
import spModel from 'sp-model'

export default class News extends spModel {
    _table = 'dt_news'

    async getMyNews(id) {
        let sql = `SELECT * FROM dt_news WHERE id = ${id}`
        let [result] = await this.mysql.query(sql)
        return this.returnOne(result)
    }
}

const mysql = new spMysql(config.mysql)
const newsDao = new News()
newsDao.getMyNews(1) // => news object | null
```