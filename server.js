const express = require('express');
const app = express();

app.listen(8000, function () {
  console.log('listening on 8000');
});

// We normally abbreviate `request` to `req` and `response` to `res`.
// "/" is the endpoint on the home page aka http://localhost:8000
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
