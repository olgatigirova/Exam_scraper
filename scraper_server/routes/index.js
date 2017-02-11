const router = require('express').Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');
const log = require('../log');
const searchCtrl = require('../controllers/search');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true })); 

router.get('/api/search/list/',
  searchCtrl.listSearchRequests(),
  function(req, res) {
    res.status(200).json(req.search_res);
  }
);

router.get('/api/search/',
  searchCtrl.searchDom(),
  function(req, res) {
    res.status(200).json({data: req.search_res});
  }
);

router.get('/',function (req, res) {
  const html = ejs.render(fs.readFileSync('./views/search-form.ejs').toString(), {});
  res.send(html);
  log.info('GET / request: html form sent');
});

router.post('/api/search/',
  function(req, res) {
    const data = req.body;
    const url_str = `/api/search/?url=${data.url}&element=${data.element}&level=${data.level}`;
    log.info(`POST: redirect to ${url_str}`);
    res.redirect(url_str);
  }
);

router.delete('/api/search/',
  searchCtrl.deleteSearchRequest()
);

module.exports = router;
