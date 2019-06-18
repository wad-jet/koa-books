const BaseService = require('./base.service');
class BooksService extends BaseService {
    getTableName() { 
        return 'books'; 
    };
}
module.exports = BooksService;