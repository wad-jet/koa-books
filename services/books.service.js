const BaseService = require('./base.service');
class BooksService extends BaseService {
    constructor(settings) {
        super(settings, 'books');
    }
}
module.exports = BooksService;