const config = require('../test_config');
const expect = require('chai').expect;
const request = require('./test').request;


describe('Search', () => {

  it('get should return 200 if search is successful', done => {
    request
      .get(config.TEST_REQUEST)
      .expect(200)
      .end((err, res) => {
        const result = JSON.parse(res.text);
        expect(result.data).to.equal(config.search_results.level1);
        done();
      });
  });

  it('get should return 500 if search request has incorrect url', done => {
    request
      .get(config.TEST_REQUEST_INCORRECT)
      .expect(500, done);
  });

  it('post should return 302 if ok', done => {
    request
      .post('/api/search/')
      .type('json')
      .send({ "url": config.TEST_URL, "element": config.TEST_ELEMENT, "level": config.TEST_LEVEL })
      .expect(302, done);
  });

  it('post should return 500 if ok', done => {
    request
      .post('/api/search/')
      .type('json')
      .send({ "url": "", "element": config.TEST_ELEMENT, "level": config.TEST_LEVEL })
      .expect(500)
      .end((err, res) => {
        expect(res.text).to.equal(config.search_results.error_form);
        done();
      });
  });

  /*
  // test get form
  it('get should return 200 if ok', done => {
    request
      .get(`/sessions/${token}`)
      .expect(200)
      .end((err, res) => {
        expect(res.body.token)
        done(err);
      });
  });*/

});
