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

let movies = [

{id: 1,
title: 'Captain America: The First Avenger',
bio: 'It is 1941 and the world is in the throes of war. Steve Rogers (Chris Evans) wants to do his part and join America's armed forces, but the military rejects him because of his small stature. Finally, Steve gets his chance when he is accepted into an experimental program that turns him into a supersoldier called Captain America. Joining forces with Bucky Barnes (Sebastian Stan) and Peggy Carter (Hayley Atwell), Captain America leads the fight against the Nazi-backed HYDRA organization.'
genre: 'Action, War, Superhero',
director:'Joe Johnston, dob May 13, 1950'
},
{id: 2,
title: 'Iron Man'
bio: 'A billionaire industrialist and genius inventor, Tony Stark (Robert Downey Jr.), is conducting weapons tests overseas, but terrorists kidnap him to force him to build a devastating weapon. Instead, he builds an armored suit and upends his captors. Returning to America, Stark refines the suit and uses it to combat crime and terrorism.',
genre: 'Action, Thriller, Superhero',
director: 'Shane Black, Jon Favreau, dob October 16, 1961 and October 19,1966'
},
{id: 3,
title: 'Black Panther',
bio: 'After the death of his father, T'Challa returns home to the African nation of Wakanda to take his rightful place as king. When a powerful enemy suddenly reappears, T'Challa's mettle as king -- and as Black Panther -- gets tested when he's drawn into a conflict that puts the fate of Wakanda and the entire world at risk. Faced with treachery and danger, the young king must rally his allies and release the full power of Black Panther to defeat his foes and secure the safety of his people.
',
genre: 'Action, Science fiction, Superhero',
director: 'Ryan Coogler, dob May 23, 1986'
}
];

//Get all movies
app.get('/movies', function(req, rec) {
    res.json(movies);
});

//Get movie details
app.get('/movies/:title', function (req, res) {
    res.json(movie.find((title) =>
{return movie.title == req.params.title });
});

//Get genre of movies
app.get('/movies/genre/:genre', function (req, res) {
              res.json(movie.find((genre) =>
{return movie.genre === req.params.genre });
});

//Get director info
app.get('movies/dirctor/:director', function (req, res) {
      res.json(movie.find((director,dob) =>
{return movie.director === req.params.genre });
});

//New users
app.post ('/user', [
check('Username', 'Username is required').isLength({min:5}),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({Username: req.body.Username}).then((user) => {
    if(user) {
     return res.status(400).send(req.body.Username + ' already exists.');
    } else {
      Users.create({
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }).then((user) => {res.status(201).json(user)}).catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  }).catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Update existing users
app.put('/user/update/:Username', passport.authenticate('jwt', {session: false}),
[
check('Username', 'Username is required').isLength({min:5}),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username},
{ $set: {
  Username: req.body.Username,
  Password: hashedPassword,
  Email: req.body.Email,
  Birthday: req.body.Birthday
  }
},
{ new : true},
(err, updatedUser) => {
  if(err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  } else {
    res.json(updatedUser);
    };
  });
});

//Add new movie
app.post('/user/movie/favorite/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username},
   { $addToSet: { FavoriteMovies: req.params.MovieID} },
   {new: true},
   (err, updatedUser) => {
     if (err) {console.error(err);
    res.status(500).send('Error: ' + err);}
     else {
       res.json(updatedUser);
   }
 });
});
//Remove a movie
app.delete('/user/movie/favorite/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({Username: req.params.Username},
    { $pull: { FavoriteMovies: req.params.MovieID} },
     {new: true}, (err, updatedUser) => {
       if (err) {console.error(err);
        res.status(500).send('Error: ' + err);
           } else { res.json(updatedUser);
            }
        });
});
//Delete user
app.delete('/user/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
  Users.findOneAndRemove({Username: req.params.Username}).then((user) => {
    if(!user) {
      res.status(400).send(req.params.Username + ' was not found.');
    } else {
      res.status(200).send(req.params.Username + ' was deleted.');
    };
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
    });
  });

//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
