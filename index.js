const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server Error');
})

let topMovies= ['Saving Private Ryan', 'Lord of the Rings', 'Dark Knight', 'The Hobbit', 'Harry Potter Series', 'Shooter', 'Dancing with Wolves', 'Pirates of the Caribbean', 'Finding Nemo', 'The Avengers']

app.get('/movies', function(req, rec) {
    res/json(topMovies);
});

app.get('/movies/:title', function (req, res) {
    let returnByTitle = topMovies.find((x) => {return x.title == req.params.title });
    res.json(returnByTitle);
});
