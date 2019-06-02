
//require env file to handle environment variables

require("dotenv").config();

var keys = require("./keys.js");

//create spotify object to hold environment variables

function Spotify(id, secret) {
    this.id = id;
    this.secret = secret;
}

var spotify = new Spotify(keys.spotify.id, keys.spotify.secret); //access the keys this way

//create an array to hold the possible command line arguments
var inputArray = ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'];