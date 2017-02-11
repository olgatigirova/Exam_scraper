const co = require('co');
const log = require('../log');
const helper = require('./search_helper');

module.exports = {
    searchDom,
    listSearchRequests,
    deleteSearchRequest
};

function searchDom() {
    return function (req, res, next) {
        co(helper.searchDomGen(req))
            .then(result => {
                req.search_res = result;
                log.info('search result: ', result);
                next();
            })
            .catch(err => {
                log.error('err = ', err.message);
                res.status(500).send(err.message);
            });
    };
}

function listSearchRequests() {
    return function (req, res, next) {
        co(helper.listSearchReqsGen(req))
            .then(result => {
                req.search_res = result;
                log.info('search history: ', result);
                next();
            })
            .catch(err => {
                log.error('err = ', err.message);
                res.status(500).send(err.message);
            });
    };
}

function deleteSearchRequest() {
    return function (req, res, next) {
        co(helper.DelSearchKeyGen(req))
            .then(result => {
                if (result) {
                    log.info('search key is deleted: ', searchKey);
                    res.status(200).send('The search request is deleted.');
                }
                else {
                    log.info('deleted search key is not found: ', searchKey);
                    res.status(404).send('The search request is not found. DELETE failed');
                }
            })
            .catch(err => {
                log.error('err = ', err.message);
                res.status(500).send(err.message);
            });
    };
}
