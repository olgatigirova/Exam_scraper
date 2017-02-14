const agent = require('superagent');
const CLOUD_URL = 'localhost:3000/upload';

module.exports = {
  searchHistory,
  deleteSearchRequest,
  getDomElements,
  generateRequest
};

function searchHistory() {
  console.log('Search requests history:');
}

function deleteSearchRequest(req) {
  console.log('delete req = ', req);
}

function getDomElements(req) {
  console.log('search req = ', req);
}

function generateRequest(url, element, level) {
  console.log('url = ', url, 'element = ', element, 'level = ', level);
  return `request`;
}