const co = require('co');
const fs = require('fs');
const ejs = require('ejs');
const log = require('../log');
const helper = require('./search_helper');

module.exports = {
    searchDom,
    listSearchRequests,
    deleteSearchRequest,
    getForm,
    searchWithForm
};

function searchDom(req, res, next) {
    co(helper.searchDomGen(req.swagger.params))
        .then(result => {
            log.info('search result: ', result);
            res.status(200).json({ data: result });
        })
        .catch(err => {
            log.error('err = ', err.message);
            res.status(500).json({ error: err.message });
        });
}

function listSearchRequests(req, res, next) {
    co(helper.listSearchReqsGen())
        .then(result => {
            log.info('search history: ', result);
            res.status(200).send(result.toString());
        })
        .catch(err => {
            log.error('err = ', err.message);
            res.status(500).json({ error: err.message });
        });
}

function deleteSearchRequest(req, res, next) {
    co(helper.delSearchKeyGen(req.swagger.params))
        .then(result => {
            if (result) {
                res.status(200).send('The search request is deleted.');
                log.info('Search key is deleted');
            }
            else {
                res.status(404).send('The search request is not found. DELETE failed');
                log.info('Deleted search key is not found');
            }
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
            log.error('err = ', err.message);
        });
}

function getForm(req, res) {
    const html = ejs.render(fs.readFileSync('./views/search-form.ejs').toString(), {});
    res.status(200).send(html);
    log.info('GET / request: html form sent');
};

function searchWithForm(req, res) {
    const url_str = helper.processFormData(req);
    if (url_str.length > 0) {
        res.redirect(url_str);
        log.info(`POST: redirect to ${url_str}`);
    }
    else {
        res.status(500).send('Error: form has empty fields');
        log.info(`POST: form has empty fields ${url_str}`);
    }
};