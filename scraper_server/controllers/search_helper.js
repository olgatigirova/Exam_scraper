const config = require('config');
const Promise = require('bluebird');
const redis = require('redis');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
const log = require('../log');
const SearchEngine = require('./search_engine').SearchEngine;

let redisClientInstance;
const SEARCH_HISTORY_KEY = 'searchHistory';

module.exports = {
    searchDomGen,
    listSearchReqsGen,
    DelSearchKeyGen
};

function* searchDomGen(req) {
    let searchKey, url_str, element, level;
    let keyExists = 0;
    let foundElements = '';

    const client = yield redisClient();
    [searchKey, url_str, element, level] = parseQuery(req);

    keyExists = yield client.existsAsync(searchKey);
    if (keyExists) {
        foundElements = yield client.getAsync(searchKey);
    }
    else {
        const search = new SearchEngine(level);
        foundElements = yield* search.SearchDomByUrl(url_str, element);
        yield client.setAsync(searchKey, foundElements);
        yield client.saddAsync(SEARCH_HISTORY_KEY, searchKey);
    }
    yield client.expireAsync(searchKey, getTtl());
    yield client.quitAsync();

    return foundElements;
}

function* listSearchReqsGen(req) {
    const client = yield redisClient();
    const result = yield client.smembersAsync(SEARCH_HISTORY_KEY);
    yield client.quitAsync();
    return result;
}

function* DelSearchKeyGen(req) {
    let searchKey;
    let keyExists = 0;
    let result = false;

    const client = yield redisClient();
    [searchKey] = parseQuery(req);

    keyExists = yield client.existsAsync(searchKey);
    if (keyExists) {
        yield client.delAsync(searchKey);
        result = true;
    }

    yield client.quitAsync();
    return result;
}

function parseQuery(req) {
    const url_str = req.query.url;
    const element = req.query.element;
    let   level   = req.query.level;
    if (level === 'undefined')
        level = config.levelDefault;

    const searchKey = `{ url: ${url_str}, element: ${element}, level: ${level} }`;
    log.info('search key: ', searchKey);
    return [searchKey, url_str, element, level];
}

function getTtl() {
    return 24 * 60 * 60;
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
