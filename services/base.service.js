var mysql = require('mysql');
const util = require('util');

class BaseService {
    constructor(settings) {
        this.settings = settings;
    }

    async filter($query, filtering) {
        const offset = $query.offset || 0;
        const limit = $query.limit || 1000;
        const sort = $query.sort;

        let sql = `SELECT * FROM ${this.getTableName()}`;
        if (!util.isNullOrUndefined(filtering)) {
            const keys = Object.keys(filtering).filter(k => typeof filtering[k] === 'string');
            if (keys.length > 0) 
                sql += ' WHERE';
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = filtering[key];
                sql += ` ${(i > 0 ? 'AND ' : '')}${key} LIKE '${value}'`;
            } 
        }
        if (!util.isNullOrUndefined(sort)) {
            sql += ` ORDER BY ${sort}`;
        }
        sql += ` LIMIT ${limit} OFFSET ${offset}`;
        const result = await this.connect((connection, cb) => {
            connection.query(sql, [ ], cb);
        });
        return result;
    }

    async get(id) {
        const result = await this.connect((connection, cb) => {
            connection.query(`SELECT * FROM ${this.getTableName()} WHERE id = ?`, id, cb);
        });
        return result;
    }

    async create(model) {
        const info = await this.connect((connection, cb) => {
            connection.query(`INSERT INTO ${this.getTableName()} SET ?`, model, cb);
        });
        const result = await this.get(info.insertId);
        return result;
    }

    async update(id, model) {
        const info = await this.connect((connection, cb) => {
            model.updated_at = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };
            connection.query(`UPDATE ${this.getTableName()} SET ? WHERE id = ?`, [ model, id ], cb);
        });
        const result = (info.changedRows === 1 ? await this.get(id) : null);
        return result;
    }

    async delete(id) {
        const info = await this.connect((connection, cb) => {
            connection.query(`DELETE FROM ${this.getTableName()} WHERE id = ?`, id, cb);
        });
        const result = info.affectedRows === 1;
        return result;
    }

    async connect(cb) {
        const connection = mysql.createConnection(this.settings);

        const task = new Promise(async (resolve, reject) =>  {
            connection.connect(err => {
                if (!!err) return reject(err);
                console.log('connected as id ' + connection.threadId);
            });
            try {
                cb(connection, (err, res) => {
                    if (!!err) return reject(err);
                    connection.end(reject);
                    resolve(res);
                });
            } catch (err) {
                reject(err);
            }
        });

        try {
            const result = await task;
            return result;
        } finally {
            connection.destroy();
        }
    }
}
module.exports = BaseService;