require("dotenv").config();

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify); //access the keys this way