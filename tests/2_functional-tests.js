/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  var time = 150

  async function criar(){
    const res = await chai.request(server)
    .post('/api/books')
    .send(
      {'title': 'Title'}
    )

    let id = res.body._id
    return id
  }

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send(
          {'title': 'Test'}
        )
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.property(res.body, 'title', 'Books in array should contain title')
          assert.property(res.body, '_id', 'Books in array should contain _id')
          done()
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send(
          {}
        )
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, 'missing required field title')
          done()
        })
      });
      
    })

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body, 'response should be an array')
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
          assert.property(res.body[0], 'title', 'Books in array should contain title')
          assert.property(res.body[0], '_id', 'Books in array should contain _id')
          done()
        })
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/invalidId')
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, 'no book exists')
          done()
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        let id

        chai.request(server)
        .post('/api/books')
        .send(
          {'title': 'Test'}
        )
        .end((err, res) => {
          id = res.body._id
        })

        setTimeout(() => {
          chai.request(server)
          .get('/api/books/' + id)
          .end((err, res) => {
            assert.equal(res.body.title, 'Test')
            done()
          })
        }, time)
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        let id

        chai.request(server)
        .post('/api/books')
        .send(
          {'title': 'Title'}
        )
        .end((err, res) => {
          id = res.body._id
        })

        setTimeout(() => {
          chai.request(server)
          .post('/api/books/' + id)
          .send({
            comment: 'A comment'
          })
          .end((err, res) => {
            assert.equal(res.body.commentcount, 1)
            assert.equal(res.body.comments[0], 'A comment')
            assert.equal(res.body.title, 'Title')
            done()
          })
        }, time)
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        let id

        chai.request(server)
        .post('/api/books')
        .send(
          {'title': 'Title'}
        )
        .end((err, res) => {
          id = res.body._id
        })

        setTimeout(() => {
          chai.request(server)
          .post('/api/books/' + id)
          .send({})
          .end((err, res) => {
            assert.equal(res.text, 'missing required field comment')
            done()
          })
        }, time)
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books')
        .send(
          {'title': 'Title'}
        )
        .end((err, res) => {})

        setTimeout(() => {
          chai.request(server)
          .post('/api/books/' + 'InvalidId')
          .send({
            comment: 'A comment'
          })
          .end((err, res) => {
            assert.equal(res.text, 'no book exists')
            done()
          })
        }, time)
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        let id

        chai.request(server)
        .post('/api/books')
        .send(
          {'title': 'Title'}
        )
        .end((err, res) => {
          id = res.body._id
        })

        setTimeout(() => {
          chai.request(server)
          .delete('/api/books/' + id)
          .end((err, res) => {
            assert.equal(res.text, 'delete successful')
            done()
          })
        }, time)
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai.request(server)
        .delete('/api/books/' + 'invalidId')
        .end((err, res) => {
          assert.equal(res.text, 'no book exists')
          done()
        })
      });

    });

  });

});
