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
            'do-what-it-says', // No you are!
            'end-program'
        ]
    }]).then((results) => {
        //twitter
        if (results.program === "my-tweets") {
            tweeter();
            //spotify
        } else if (results.program === "spotify-this-song") {
            inquirer.prompt([{
                type: "input",
                name: "song",
                message: "Name a song!",
            }]).then((results) => {
                let song = results.song;
                songInfo(song);
            });
            //omdb request
        } else if (results.program === "movie-this") {
            inquirer.prompt([{
                type: "input",
                name: "movie",
                message: "Name a movie!",
            }]).then((results) => {
                let movie = results.movie;
                if (movie === "") {
                    movie = "Mr Nobody";
                }
                movieInfo(movie);
            });
            //random file reader
        } else if (results.program === "do-what-it-says") {

            console.log("are you working?");
            doit();

        } else if (results.program === "end-program") {
            inquirer.prompt([{
                type: 'confirm',
                name: "confirm",
                message: "Are you sure you want to end your search?"
            }]).then((results) => {
                end();
                console.log("\nGood Bye earthling!");

            })
        }
    })
}

function end() {
    logIt("User wanted to quit, quitter.");
}

function doit() {
    logIt("User wanted to do it.\n");
    console.log("\nBackstreet's back AGAIN!!!!");
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
        var dataArray = data.split(",");

        if (dataArray[0] === "songInfo") {
            songInfo(dataArray[1]);
        }
    });

}

function tweeter() {
    logIt("User looked at tweets.\n");
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
    setTimeout(nodeApp, 2500);

}



function songInfo(song) {
    logIt("User selected song: " + song + "\n");
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
    setTimeout(nodeApp, 2500);

}



function movieInfo(movie) {
    // let apiKey = "40e9cece";
    logIt("User selected film: " + movie + "\n");
    let movieUrl = "http://www.omdbapi.com/?t=" + movie + "&apiKey=40e9cece";

    request(movieUrl, (error, response, body) => {
        if (JSON.parse(body).response === "false") {
            logIt("User did not input a movie and now has to watch Mr.Nobody.\n");

            console.log("\nNo movie for you!");

        } else if (!error && response.statusCode === 200) {
            let title = JSON.parse(body).Title;
            let year = JSON.parse(body).Year;
            let origin = JSON.parse(body).Country;
            let language = JSON.parse(body).Language;
            let plot = JSON.parse(body).Plot;
            let actors = JSON.parse(body).Actors;
            let IMDB = JSON.parse(body).imdbRating;
            let rottenTomato = JSON.parse(body).Ratings[1].Value;

            console.log("The movie is " + title);
            console.log("Which was released in " + year);
            console.log("The movie was made in " + origin);
            console.log("The language of the film is " + language);
            console.log("The movie is about " + plot);
            console.log("It stars: " + actors);
            console.log("IMDB Rated it " + IMDB + " out of 10 stars.");
            console.log("On rotten tomato it received " + rottenTomato);
        }
    })
    setTimeout(nodeApp, 2500);

}


function logIt(userResults) {
    console.log(userResults);
    var now = new Date();
    fs.appendFile('log.txt', "\n" + now + ": " + userResults, function(err, data) {
        if (err) {
            return console.log(err);
        }
    });
}