require("dotenv").config();
let keys = require("./keys.js");
let fs = require('fs')
let command = process.argv[2];
var axios = require('axios')
let inquirer = require('inquirer')
let moment = require('moment')
let Spotify = require('node-spotify-api')

function inquire() {
    if (command === 'concert-this') {
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What artists concert would you like to attend?',
                    name: 'artist'
                }
            ]).then(function(bands) {
                bandsInTown(bands)
            })
        }
    if (command === 'movie-this') {
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What movie would you like to find?',
                    name: 'movie'
                }
            ]).then(function(movies){
                findMovie(movies)
            })
        }
    if (command === "spotify-this-song") {
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What song would you like to find?',
                    name: 'song'
                }
            ]).then((songs) => {
                console.log('the songs here', songs);
                console.log(typeof songs);
                spotSong(songs)
            })
    }

    if (command === 'do-what-it-says') {
        reader()
    }
}
//runs the bandsintown api//
function bandsInTown(target) {
    // let artist = process.argv[3];
    var concertQueryUrl = "https://rest.bandsintown.com/artists/" + target.artist + "/events?app_id=codingbootcamp"
    console.log()
    axios.get(concertQueryUrl).then(
        function(concerts) {
        for (let i = 0; i < concerts.data.length; i++) {
            console.log("------------------------------");
            console.log('Venue: ' + JSON.stringify(concerts.data[i].venue.name))
            console.log('location: ' + JSON.stringify(concerts.data[i].venue.city + ', ' + concerts.data[i].venue.country))
            console.log("Date: " + JSON.stringify(moment(concerts.data[i].datetime).format("MM/DD/YYYY")))
            console.log("------------------------------");
        }
    })
        .catch(function(error) {
        if (error.response) {
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
}

function spotSong(target) {
    console.log('the song', target.song);
    let spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });

      spotify.search({type: "track", query: target.song}).then((data) => {
          console.log('data', data.tracks.items);
        let results = data;
          for (let i = 0; i < 5; i++) {
          console.log("--------------------------------------------------------------------------------");
          console.log("Artist: " + results[i].artists[0].name);
          console.log("Song: " + results[i].name);
          console.log("Preview: " + results[i].preview_url);
          console.log("Album: " + results[i].album.name);
        }
      }).catch((err) => {
           // console.log('the error', err.response);
      })
}

function findMovie(target) {
    var queryUrl = "http://www.omdbapi.com/?t=" + target.movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function(response) {
        console.log('Name: ' + JSON.stringify(target.movie))
        console.log('Release Year: ' + JSON.stringify(response.data.Year))
        console.log('IMDB Rating: ' + JSON.stringify(response.data.imdbRating))
        console.log('Rotten Tomatoes Rating: ' + JSON.stringify(response.data.Ratings[1].Value))
        console.log('Language: ' + JSON.stringify(response.data.Language))
        console.log('Plot: ' + JSON.stringify(response.data.Plot))
        console.log('Actors: ' + JSON.stringify(response.data.Actors))
    })
        .catch(function(error) {
        if (error.response) {
            console.log("---------------Data---------------");
            console.log(error.response.data);
            console.log("---------------Status---------------");
            console.log(error.response.status);
            console.log("---------------Status---------------");
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log("Error", error.message);
        }
        console.log(error.config);
    });
}

function reader() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }

        
    })
}

inquire()















