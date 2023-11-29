'use strict'

require('dotenv').config()
const mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient
const URI = process.env.MONGO_URI

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})

const bookSchma = new mongoose.Schema({
    title: String,
    comments: Object,
    commentcount: Number
})

const bookModel = mongoose.model('library', bookSchma)

async function saveBook(title){
    let book = new bookModel({
        title: title,
        comments: [],
        commentcount: 0
    })

    book.save()
    let id = book._id
    return {title: title, _id: id}
}

async function getBooks(){
    let books

    await bookModel.find({
    })
    .then(doc => {
        books = doc
    })
    .catch(err => {
        return 'error'
    })

    return books
}

async function deleteBooks(){
    try {
        const client = await MongoClient.connect(URI);
        const dbo = client.db("test")
        await dbo.collection("libraries").drop()
        client.close();
    
        return 'complete delete successful';
      } catch (err) {
        return err;
      }
}

async function getBook(id){
    let book

    await bookModel.find({
        _id: id
    })
    .then(doc => {
        book = doc
    })
    .catch(err => {
        return 'error'
    })

    if(book == undefined){
        return 'no book exists'
    }

    return book[0]
}

async function postBook(id, comment){
    try{
        const book = await getBook(id)

        if(typeof book == 'string' || book == undefined){
            return 'no book exists'
        }

        book.comments.push(comment)
        book.commentcount += 1

        await bookModel.updateOne({_id: id}, {$set: {comments: book.comments, commentcount: book.commentcount}})

        return book
    } catch (e){
        return {error: JSON.stringify(e), '_id': id}
    }
}

async function deleteBook(id){
    try{
        let count = await bookModel.deleteOne({
            _id: id
        })
        
        if(count.deletedCount == 0){
            return 'no book exists'
        }

        return 'delete successful'
    } catch (e) {
        return 'no book exists'
    }    
}

module.exports = {saveBook, getBooks, deleteBooks, getBook, postBook, deleteBook}