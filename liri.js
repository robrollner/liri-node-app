var keys = require("./keys.js");
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var inquirer = require('inquirer');
var fs = require('fs');

nodeApp();

function nodeApp() {
    inquirer.prompt([{
        type: "list",
        name: 'program',
        message: "Pick something!",
        choices: [
            'my-tweets', //Tweet tweet!
            'spotify-this-song', //Don't look for the sign
            'movie-this', //I'm somebody
            'do-what-it-says' // No you are!
        ]
    }]).then((results) => {

        if (results.program === "my-tweets") {
            tweeter();
        } else if (results.program === "spotify-this-song") {
            inquirer.prompt([{
                type: "input",
                name: "song",
                message: "Name a song!",
            }]).then((results) => {
                let song = results.song;
                songInfo(song);
            });
        } else if (results.program === "movie-this") {
            inquirer.prompt([{
                type: "input",
                name: "movie",
                message: "Name a movie!",
            }]).then((results) => {
                let movie = results.movie;
                movieInfo(movie);
            });
        } else if (results.program === "do-what-it-says") {
            nodeApp();
            //do something but not sure what...
        }
    })
}

function tweeter() {
    let client = new twitter(keys.twitterKeys);
    let queryUrl = "https://api.twitter.com/1.1/search/tweets.json?q=satincoffins&result_type=recent&count=20";

    client.get(queryUrl, (error, tweets, response) => {

        if (error) {
            console.log(error);
        }

        console.log("\nHere's what I've had to say! ");
        for (var i = 0; i < tweets.statuses.length; i++) {
            console.log(tweets.statuses[i].created_at.substring(0, 19) + tweets.statuses[i].text);
        }
        console.log('');
    })
    setTimeout(reStart, 1500);

}



function songInfo(song) {
    let Spotify = new spotify(keys.spotifyKeys);

    Spotify.search({
            type: 'track',
            query: song,
            limit: 1
        },
        (err, data) => {
            if (err) {
                return console.log(err);
            }
            let artist = data.tracks.items[0].album.artists[0].name;
            let track = data.tracks.items[0].name;
            let songURL = data.tracks.items[0].album.artists[0].external_urls.spotify;
            let album = data.tracks.items[0].album.name;

            console.log(`Wow! I love '${track}' by ${artist}. '${album}' is one of my favorite albums.`);
            console.log(`Click here to listen! ${songURL}\n`);

        })
    setTimeout(reStart, 1500);

}



function movieInfo(movie) {
    // let apiKey = "40e9cece";
    let movieUrl = "http://www.omdbapi.com/?t=" + movie + "&apiKey=40e9cece";

    request(movieUrl, (error, response, body) => {
        if (JSON.parse(body).response === "false") {
            console.log("\nNo movie for you!");
        } else if (!error && response.statusCode === 200) {
            let title = JSON.parse(body).Title;
            let year = JSON.parse(body).Year;
            let origin = JSON.parse(body).Country;
            let language = JSON.parse(body).Language;
            let plot = JSON.parse(body).Plot;
            let actors = JSON.parse(body).Actors;
            let IMDB = JSON.parse(body).imdbRating;
            let rottenTomato = JSON.parse(body).Ratings[1];

            console.log(title);
            console.log(year);
            console.log(origin);
            console.log(language);
            console.log(plot);
            console.log(actors);
            console.log(IMDB);
            console.log(rottenTomato);
        }
    })
    setTimeout(reStart, 1500);

}

function reStart() {
    inquirer.prompt([{
        type: "checkbox",
        name: "confirm",
        message: "Do you want to try again?",
        choices: ["Yes", "No"]
    }]).then((results) => {
        if (results.choices === "Yes") {
            nodeApp();
        } else {
            console.log("\nYou are no fun!");
        }
    })

}