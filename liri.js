
//require env file to handle environment variables
require("dotenv").config();
var moment = require('moment');
//the keys variable allow us to access the id and secret value in the .env file
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require('axios');

//create an array to hold the possible command line arguments
var inputArray = ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'];

//use a switch statement to parse the various input cases

switch (process.argv[2]) {
    //bands in town 
    case inputArray[0]:
        //create a variable to hold the band name
        var artist = parseArg(process.argv);
        //call the bandsinTown function
        bandsInTown(artist);
        break;
    //other cases follow the same process:
    //spotify
    case inputArray[1]:
        var song = parseArg(process.argv);
        console.log("the song " + song);
        spotifyThisSong(song);
        break;
    //OMDB
    case inputArray[2]:
        console.log("omdb");
        break;
    //no input
    case inputArray[3]:
        //use random.txt
        console.log("random.txt");
        break;
    default:
        console.log('hi');

}

//functions for each type of request

//bands in town

function bandsInTown(input) {
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
                console.log("\n--------------\n");
                console.log(
                    "Venue: " + venue +
                    '\n' + "City: " + city +
                    '\n' + "Country: " + country +
                    '\n' + "Date: " + date
                );
                console.log("\n--------------\n");

            } else {
                console.log("\n--------------\n");
                console.log(
                    "Venue: " + venue +
                    '\n' + "City: " + city +
                    '\n' + "Region: " + region +
                    '\n' + "Country: " + country +
                    '\n' + "Date: " + date
                );
                console.log("\n--------------\n");
            }

        }

    })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
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
    console.log("first the song is: " + song);
    if (song === 'undefined' || null || song === '') {
        song = "The Sign";
    }
    console.log("now the song is: " + song);
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        else {
            for (i = 0; i < data.tracks.items.length && i < 10; i++) {

                var musicQuery = data.tracks.items[i];
                // console.log("===============================");
                // * Artist(s)
                console.log("Artist: " + musicQuery.artists[0].name +
                    "\nSong: " + musicQuery.name +
                    "\nLink to Song: " + musicQuery.preview_url +
                    "\nAlbum: " + musicQuery.album.name +
                    "\n===============================");
            }
        };
    });

}

//function to parse artist/song/movie inputs (handles inputs that aren't in quotation 
//marks)

function parseArg(searchParam) {
    var arg = '';
    for (var i = 3; i < searchParam.length; i++) {
        arg += ' ' + searchParam[i];
    }
    return arg;
}