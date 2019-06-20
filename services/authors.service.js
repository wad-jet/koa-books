const BaseService = require('./base.service');
class AuthorsService extends BaseService {
    constructor(settings) {
        super(settings, 'authors');
    }
}
module.exports = AuthorsService;