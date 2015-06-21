function spotifySearch(movieObj) {
	var spotifyURL = "https://api.spotify.com/v1/search?type=playlist&q=";
	var searchTerm = movieObj.title;
	var spotify = spotifyURL + searchTerm;

	$.ajax({
		url: spotify,
		type: 'GET',
		dataType: 'json',
		error: function(err){
			console.log('NOOOO');
			console.log(err);
		},
		success: function(data){
			console.log(data);
			
			var movieTitle = movieObj.title;
			var movieOverview = movieObj.overview;
			console.log(playlistName);
			console.log(playlistLink);
			var theHTML = '<h1>' + movieTitle + '</h1>' + '<p>' + movieOverview + '</p>';
			$('body').css('background-image', 'url("https://image.tmdb.org/t/p/w185'+ movieObj.poster_path + '")');

			if (data.playlists.items.length > 0) {
				var playlistName = data.playlists.items[0].name;
				var playlistLink = data.playlists.items[0].external_urls.spotify;
				var embedPlaylist = data.playlists.items[0].uri;
				theHTML += '<br><p>Spotify Playlist: <a href="' + playlistLink + '" target="_blank">' + playlistName + '</a></p><br><iframe view="list" src="https://embed.spotify.com/?uri=' + embedPlaylist + '" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>';
			} else {
				theHTML += '<br><p>No Spotify Playlist Found!</p>';
			}
			$('#results').html(theHTML);
		}
	});
}

//spotify:user:mhodgdon:playlist:0Y1PQni4o1XSLC2bqrPKLK

function movieSearch(input) {
	var movieURL = "https://api.themoviedb.org/3/search/movie?api_key=942a3945b8e02f900bf408d161de2dd1&query=";
	var searchURL = movieURL + input;

	$.ajax({
		url: searchURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(err){
			console.log('uh oh!');
			console.log(err);
		},
		success: function(data){
			console.log('WooHoo!');
			console.log(data);
			if (data.results.length > 0) {
				var assumedMovie = data.results[0];
			// var movieTitle = data.results[0].title;
			// var movieOverview = data.results[0].overview;
			// var releaseDate = data.results[0].release_date;
			// $('#results').html('<h1>' + movieTitle + '</h1>' + '<p>' + movieOverview + '</p>');
				spotifySearch(assumedMovie);
			} else {
				$('#results').html('<p>No movie with that title found!</p>');
				$('body').css('background-image', 'url("http://upload.wikimedia.org/wikipedia/commons/d/d3/8_mm_Kodak_safety_film_reel_06.jpg")');
			}
		}
	});
}


$(document).ready(function(){
	$('.inputbox').keypress(function(e){
		if(e.keyCode==13) {
			var theInput = $('.inputbox').val();
			movieSearch(theInput);
		}
	});
	$('#searchbutton').click(function(){
		var theInput = $('.inputbox').val();
		movieSearch(theInput);
	});
});