const agent = require('superagent');
const SCRAPER_ADDR = 'http://localhost:3000/api/search/';

module.exports = {
  searchHistory,
  deleteSearchRequest,
  getDomElements,
  generateRequest
};

function searchHistory() {
  console.log("Getting data from server...");
  const req = `${SCRAPER_ADDR}list/`;
  agent
    .get(req)
    .end((err, res) => {
      console.log('Search history:\n', res.text);
      process.exit(0);
    });
}

function deleteSearchRequest(req) {
  console.log("Deleting search request from server...");
  agent
    .delete(req)
    .end((err, res) => {
      console.log(res.text);
      process.exit(0);
    });
}

function getDomElements(req) {
  console.log("Getting data from server...");
  agent
    .get(req)
    .end((err, res) => {
      const result = JSON.parse(res.text);
      console.log("Search result:\n", result.data);
      process.exit(0);
    });
}

function generateRequest(url_str, element, level) {
  return `${SCRAPER_ADDR}?url=${url_str}&element=${element}&level=${level}`;
}