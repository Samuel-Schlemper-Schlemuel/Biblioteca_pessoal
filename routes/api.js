'use strict';
var mongo = require('../mongo')

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      let books = await mongo.getBooks()
      res.json(books)
    })
    
    .post(async function (req, res){
      let title = req.body.title

      if(title == undefined || title == ''){
        return res.send('missing required field title')
      }

      let result = await mongo.saveBook(title)
      res.json(result)
    })
    
    .delete(async function(req, res){
      let result = await mongo.deleteBooks()
      res.send(result)
    });

  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id
      let result = await mongo.getBook(bookid)

      if(typeof result == 'string' || result == undefined){
        return res.send('no book exists')
      }

      res.json(result)
    })
    
    .post(async function(req, res){
      let bookid = req.params.id
      let comment = req.body.comment

      if(comment == undefined || comment == ''){
        return res.send('missing required field comment')
      }

      let result = await mongo.postBook(bookid, comment)

      if(typeof result == 'string'){
        return res.send(result)
      }

      res.json(result)
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id
      res.send(await mongo.deleteBook(bookid))
    })
  
}