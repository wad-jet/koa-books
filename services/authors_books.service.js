const BaseService = require('./base.service');
class AuthorsBooksService extends BaseService {
    constructor(settings) {
        super(settings, 'authors_books');
    }
}
module.exports = AuthorsBooksService;