const BaseService = require('./base.service');
class AuthorsService extends BaseService {   
    getTableName() { 
        return 'authors'; 
    };
}
module.exports = AuthorsService;