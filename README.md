# liri-node-app

## Overview

This project takes command line arguments that return information to the terminal about a movie, a song, or an artist's upcoming shows. The format for command line arguments is:

*  'spotify-this-song' '<song name here>'
*  'concert-this' '<artist name here>'
*  'movie-this' '<movie name here>'
*  'do-what-it-says'


In all cases but 'concert-this', the second command line argument (specifying the song, artist, or movie name) is optional; the program will default to hard coded values if none is provided. 

The first command line argument must be entered as specified, but the movie, artist, or song name can either be entered with quotes, like this:

* spotify-this-song 'Heaven Is A Place on Earth'

Or without quotes, like this:

* spotify-this-song Heaven Is A Place on Earth


For the last command, 'do-what-it-says', the program randomly selects one of the features (either a movie, song, or concert list) & queries the appropriate API based on the values in the random.txt file.

## Data sources

The program uses three APIs to retrieve information: 

* Bands In Town
* Spotify
* OMDB (Open Movie Database)

## Other notes

In order to run this application, other users will need to configure their own Spotify ID & Secret using the Spotify API. These values are in a .env file that maps the values to variable names, which are then accessed via the keys.js file.
