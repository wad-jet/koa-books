const BaseService = require('./base.service');
class AuthorsBooksService extends BaseService {   
    getTableName() { 
        return 'authors_books'; 
    };
}
module.exports = AuthorsBooksService;