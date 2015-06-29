//Searches for Spotify playlist with the same title as the movie the user searched for.
function googleSearch(movieObj) {
	var googleURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAWPxru8PBKCy5txLjh5Yx8qFHeOtPBrxQ&type=playlist&q=";
	var searchTerm = movieObj.title + ' soundtrack';
	var youtube = googleURL + searchTerm;

	$.ajax({
		url: youtube,
		type: 'GET',
		dataType: 'json',
		error: function(err){
			//console.log('NOOOO');
			//console.log(err);
		},
		success: function(data){
			//console.log(data);
			
			var movieTitle = movieObj.title;
			var movieOverview = movieObj.overview;
			//console.log(playlistName);
			//console.log(playlistLink);
			//Constructs HTML for results and sets background to the movie posted (tiled)
			var theHTML = '<h1>' + movieTitle + '</h1>' + '<p>' + movieOverview + '</p>';
			$('body').css('background-image', 'url("https://image.tmdb.org/t/p/w185'+ movieObj.poster_path + '")');

			//If playlists were found
			if (data.pageInfo.totalResults > 0) {
				var playlistName = data.items[0].snippet.title;
				var playlistLink = data.items[0].id.playlistId;
				// var embedPlaylist = data.playlists.items[0].uri;
				//Adds the playlist link and an embeded music player to the HTML
				theHTML += '<iframe id="ytplayer" type="text/html" width="" height="390" src="http://www.youtube.com/embed?listType=playlist&list=' + playlistLink +'&origin=http://nicholashagans.com@autoplay=1" frameborder="0"/>';
				// '<br><p>Spotify Playlist: <a href="' + playlistLink + '" target="_blank">' + playlistName + '</a></p><br><iframe view="list" src="https://embed.spotify.com/?uri=' + embedPlaylist + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
			} else {
				theHTML += '<br><p>No Spotify Playlist Found!</p>';
			}
			$('#results').html(theHTML);
		}
	});
}

//spotify:user:mhodgdon:playlist:0Y1PQni4o1XSLC2bqrPKLK

//Retrieves data from The MovieDB given a search term provided by the user
function movieSearch(input) {
	var movieURL = "https://api.themoviedb.org/3/search/movie?api_key=942a3945b8e02f900bf408d161de2dd1&query=";
	var searchURL = movieURL + input;

	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(err){
			//console.log('uh oh!');
			//console.log(err);
		},
		success: function(data){
			//console.log('WooHoo!');
			//console.log(data);
			if (data.results.length > 0) {
				var assumedMovie = data.results[0];
			// var movieTitle = data.results[0].title;
			// var movieOverview = data.results[0].overview;
			// var releaseDate = data.results[0].release_date;
			// $('#results').html('<h1>' + movieTitle + '</h1>' + '<p>' + movieOverview + '</p>');
				//Sends movie object to Spotify Search function
				googleSearch(assumedMovie);
			} else {
				//No results were returned
				$('#results').html('<p>No movie with that title found!</p>');
				$('body').css('background-image', 'url("http://upload.wikimedia.org/wikipedia/commons/d/d3/8_mm_Kodak_safety_film_reel_06.jpg")');
			}
		}
	});
}

//Begin on document ready
$(document).ready(function(){
	//Enter key begins search
	$('.inputbox').keypress(function(e){
		if(e.keyCode==13) {
			var theInput = $('.inputbox').val();
			movieSearch(theInput);
		}
	});
	//Clicking 'Search' begins search
	$('#searchbutton').click(function(){
		var theInput = $('.inputbox').val();
		movieSearch(theInput);
	});
});