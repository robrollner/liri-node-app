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
        switch (results.program) {
            case 'my-tweets':
                tweeter();
                break;

            case 'spotify-this-song':
                inquirer.prompt([{
                    type: "input",
                    name: "song",
                    message: "Name a song!",
                }]).then((results) => {
                    let song = results.song;
                    songInfo(song);
                });
                break;

            case "movie-this":
                inquirer.prompt([{
                    type: "input",
                    name: "movie",
                    message: "Name a movie!",
                }]).then((results) => {
                    let movie = results.movie;
                    movieInfo(movie);
                });
                break;

                // case "do-what-it-says":
                // console.log("")
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
            console.log(tweets.statuses[i]);
        }
        console.log('');
    })
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
            let artistName = data.tracks.items[0].album.artists[0].name;
            let songName = data.tracks.items[0].name;
            let songURL = data.tracks.items[0].album.artists[0].external_urls.spotify;
            let albumName = data.tracks.items[0].album.name;

            console.log(`Wow! I love '${songName}' by ${artistName}. '${albumName}' is one of my favorite albums.`);
            console.log(`Click here to listen! ${songURL}\n`);

        })
}