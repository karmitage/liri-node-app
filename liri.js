
//require env file to handle environment variables
require("dotenv").config();
var moment = require('moment');
//the keys variable allow us to access the id and secret value in the .env file
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var fs = require("fs");

//create an array to hold the possible command line arguments
var inputArray = ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'];

//use a switch statement to parse the various input cases
switch (process.argv[2]) {
    //bands in town 
    case inputArray[0]:
        //create a variable to hold the band name
        var artist = parseArg(process.argv);
        //call the bandsinTown function
        concertThis(artist);
        break;
    //other cases follow the same process:
    //spotify
    case inputArray[1]:
        var song = parseArg(process.argv);
        spotifyThisSong(song);
        break;
    //OMDB
    case inputArray[2]:
        var movie = parseArg(process.argv);
        movieThis(movie);
        break;
    //no input
    case inputArray[3]:
        doWhatItSays();
        break;
    default:
        console.log('Try again!');
}

//functions for each type of request

function concertThis(input) {
    //construct query URL
    var queryURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp";
    axios.get(queryURL).then(function (response) {
        // If the axios was successful...then show info
        console.log(response.data[0]);
        var timeFormat = "MM/DD/YYYY"
        //since resopnse.data is structured as an array, iterate over it to get at the 
        //event values for each item
        for (var i = 0; i < response.data.length; i++) {
            var venue = response.data[i].venue.name;
            var city = response.data[i].venue.city;
            var region = response.data[i].venue.region;
            var country = response.data[i].venue.country;
            var date = moment(response.data[i].datetime).format(timeFormat);

            //only display region if it is populated:
            if (region === '') {
                console.log("\n===============================\n");
                console.log(
                    "Venue: " + venue +
                    '\n' + "City: " + city +
                    '\n' + "Country: " + country +
                    '\n' + "Date: " + date
                );
                console.log("\n===============================\n");

            } else {
                console.log("\n===============================\n");
                console.log(
                    "Venue: " + venue +
                    '\n' + "City: " + city +
                    '\n' + "Region: " + region +
                    '\n' + "Country: " + country +
                    '\n' + "Date: " + date
                );
                console.log("\n===============================\n");
            }

        }

    })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {

            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });


}

function spotifyThisSong(input) {
    var song = input;
    //display results for "The Sign" if no input was given
    if (song === 'undefined' || null || song === '') {
        song = "The Sign";
    }
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        else {
            for (i = 0; i < data.tracks.items.length && i < 10; i++) {

                var musicQuery = data.tracks.items[i];
                console.log("Artist: " + musicQuery.artists[0].name +
                    "\nSong: " + musicQuery.name +
                    "\nLink to Song: " + musicQuery.preview_url +
                    "\nAlbum: " + musicQuery.album.name +
                    "\n===============================");
            }
        };
    });

}

function movieThis(input) {
    var movie = input;
    //display results for Mr Nobody if no input was given
    if (movie === 'undefined' || null || movie === '') {
        movie = 'Mr. Nobody'
    }
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL).then(
        function (response) {
            console.log("Movie Title: " + response.data.Title +
                "\nYear Released: " + response.data.Year +
                "\nIMDB Rating: " + response.data.imdbRating +
                "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                "\nProduced in: " + response.data.Country +
                "\nLanguage: " + response.data.Language +
                "\nPlot: " + response.data.Plot +
                "\nActors: " + response.data.Actors +
                "\n===============================");
        })
        .catch(function (error) {
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

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        //create a random number between 1 and 3 & choose one of the APIs based on the result
        var randNum = Math.floor(Math.random() * Math.floor(3));
        if (randNum === 0) {
            spotifyThisSong(dataArr[1]);
        } else if (randNum === 1) {
            movieThis(dataArr[3]);
        } else {
            query = dataArr[5].replace(/"/g, ''); //remove quotes from string (bands in town is finicky)
            concertThis(query);
        }

    });
}

//function to parse artist/song/movie inputs (handles inputs that aren't in quotes

function parseArg(searchParam) {
    var arg = '';
    for (var i = 3; i < searchParam.length; i++) {
        arg += ' ' + searchParam[i];
    }
    arg = arg.trim(); //trim any leading spaces (this is needed for the bands in town API)
    return arg;
}