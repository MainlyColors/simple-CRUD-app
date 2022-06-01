const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const password = '';
const connectionString = `mongodb+srv://ryan2505:${password}@cluster0.45elsxf.mongodb.net/?retryWrites=true&w=majority`;

MongoClient.connect(connectionString)
  .then((client) => {
    console.log('Connected to Database');
    const db = client.db('star-wars-quotes'); // database name
    const quotesCollection = db.collection('quotes'); // collection name

    // ========================
    // Middlewares
    // ========================

    // Make sure you place body-parser before your CRUD handlers!
    // extended true means use the qs library for parsing string, false would mean the native query string module that comes with node.js
    // differences: qs lets you parse/create nested object in query strings
    // make anki when understand what this does
    // puts data in the request body
    app.use(bodyParser.urlencoded({ extended: true }));

    // ========================
    // Routes
    // ========================

    // We normally abbreviate `request` to `req` and `response` to `res`.
    // "/" is the endpoint on the home page aka http://localhost:8000
    app.get('/', (res, req) => {
      // res.sendFile(__dirname + '/index.html');
      // res.sendFile(__dirname + '/index.html');
      // cursor object by itself is huge but we can use .toArray to return only an array of the collection documents
      const cursor = db
        .collection('quotes')
        .find()
        .toArray()
        .then((results) => console.log(results))
        .catch((err) => console.error(err));
    });

    // because we need the db variable, we need the express handlers within the then call
    app.post('/quotes', (req, res) => {
      // insert form post into database, inserting the request body as an object
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect('/'); // redirect page back to homepage after inserting document into collection (db)
        })
        .catch((err) => console.error(err));
    });
  })
  .catch((err) => console.error(err));

// ========================
// Listen
// ========================

app.listen(8000, function () {
  console.log('listening on 8000');
});
