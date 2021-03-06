const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const MongoClient = require('mongodb').MongoClient;
// https://zellwk.com/blog/environment-variables/
const dotenv = require('dotenv').config({
  path: './secrets/.env',
});

const connectionString = process.env.DB_URL;

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
    // tells express to expect ejs
    app.set('view engine', 'ejs');
    // tells express to treat the public folder files as static files
    app.use(express.static('public'));
    // lets us read json data
    app.use(bodyParser.json());
    // ========================
    // Routes
    // ========================

    // We normally abbreviate `request` to `req` and `response` to `res`.
    // "/" is the endpoint on the home page aka http://localhost:8000
    app.get('/', (req, res) => {
      // res.sendFile(__dirname + '/index.html');
      // res.sendFile(__dirname + '/index.html');

      // cursor object by itself is huge but we can use .toArray to return only an array of the collection documents
      const cursor = db
        .collection('quotes')
        .find()
        .toArray()
        .then((results) => {
          res.render('index.ejs', { quotes: results });
        })
        .catch((err) => console.error(err));
      // res.render(view, locals)
      // view is the name of the file we???re rendering. This file must be placed inside a views folder.
      //locals is the data passed into the file.
      // res.render('index.ejs', {});
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

    app.put('/quotes', (req, res) => {
      //findOneAndUpdate takes 3 args query, update,options
      // query = filter collection, only object containing {name: 'yoda'}
      // update tells mongoDB what to change using MongoDBs update operators
      // here we are changing whats in the DB with what we received from the put request that sent JSON object
      quotesCollection
        .findOneAndUpdate(
          { name: 'yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            // if no yoda quotes exist, make a darth vadar quote
            upsert: true,
          }
        )
        .then((result) => {
          res.json('Success');
          // console.log(result)
        })
        .catch((err) => console.error(err));
    });

    app.delete('/quotes', (req, res) => {
      // deleteOne takes 2 parameters, query, options
      // query is the same as findOneAndUpdate, options can be omitted if we don't need it
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json('No quote to Delete');
          }
          res.json('Successful Delete');
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
