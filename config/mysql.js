module.exports = (function() {
    return {
        local: {
            host: 'localhost',
            port: 3306,
            user: 'demo',
            password: 'demo',
            database: 'shop'
        },
        dev: {
            host: '',
            port: 3306,
            user: 'demo',
            password: 'demo',
            database: 'shop'
        },
        real: {
            host: '',
            port: 3306,
            user: 'demo',
            password: 'demo',
            database: 'shop'
        }
    }     
})();