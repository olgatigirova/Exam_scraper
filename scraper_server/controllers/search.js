const co = require('co');
const config = require('config');
const Promise = require('bluebird');
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
const log = require('../log');
const SearchEngine = require('./search_engine').SearchEngine;

let redisClientInstance;

module.exports = {
    searchDom
};

function searchDom() {
    return function (req, res, next) {
        co(searchDomGen(req, res, next))
        .then(res => {
            req.search_res = res;
            next();
        })
        .catch(err => {
            log.error('err = ', err);
            res.status(500).send(err);
        });
    };
}

function* searchDomGen(req, res, next) {
    const url_str = req.query.url;
    const element = req.query.element;
    const level = req.query.level;

    const search = new SearchEngine(level);
    const foundElements = yield* search.SearchDomByUrl(url_str, element);
    
    //save found info into redis
    const searchKey = `{ url: ${url_str}, element: ${element}, level: ${level} }`;

    return foundElements;
}

function redisClient() {
    return new Promise((resolve, reject) => {
        if (redisClientInstance && redisClientInstance.connected) {
            return resolve(redisClientInstance);
        }
        const client = redis.createClient(config.redisOptions);
        client.on('error', reject);
        client.on('connect', () => {
            redisClientInstance = client;
            return resolve(client);
        });
    });
}
