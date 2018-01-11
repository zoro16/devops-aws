'use strict'

module.exports = {
    'mysqlDB': {
        'host': process.env.PRODUCTION_RDS_HOST,
        'port': 3306,
        'database': process.env.PRODUCTION_RDS_DB,
        'password': process.env.PRODUCTION_RDS_PWD,
        'name': process.env.PRODUCTION_RDS_DB,
        'user': process.env.PRODUCTION_RDS_USER,
        'connector': 'mysql',
    },
}
