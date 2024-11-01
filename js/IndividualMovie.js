

//retrieving the move code
function RetrieveMovieCode(){
    let MovieID = localStorage.getItem("IndividualMovieCode");
    return MovieID;
}

//format for local storage
function StringifyJSON(movie){
    if(typeof movie != "string"){
        movie = JSON.stringify(movie);
    }
    return movie;
}

//retrieving the movie as a JSON
function GetFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

//adding the movie to watchlist array
function AddToWatchList(movie){
    currentMovie = [];
    currentMovie = GetFromLocalStorage("watchList");

    //if there is an existing array, just add to it
    if(currentMovie != null){
        
        for (let index = 0; index < currentMovie.length; index++) {
            if(currentMovie[index].id == movie.id){
                return
            }
        }
        
        currentMovie.push(movie);
        localStorage.setItem("watchList", StringifyJSON(currentMovie));
        console.log(currentMovie);
    }else{
        //if there is no existing array, make one
        currentMovie = [];
        currentMovie.push(movie);
        localStorage.setItem("watchList", StringifyJSON(currentMovie));
        console.log(currentMovie);
    }
    
}

//function to store to watchlist in JSON
function StoreMovieToWatchList(){
    console.log("movie saved");
    AddToWatchList(currentMovie_JSON)
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTBkOGMzNWQ5YzI1NDA4MjI3YmY3MjI5ZGZmZTg3YiIsIm5iZiI6MTcyOTUzNjI1NS4yNzIyMywic3ViIjoiNjZlODI0OWRkZDIyNGQxYTM5OTFkOTM4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-IWwS27WKL1YyCbPmGKa7UkuZsnRFiDXzY2FtywP8RE'
    }
};
  
//show the current movie in hero section by code
async function ShowCurrentMovie(ID){
    fetch(`https://api.themoviedb.org/3/movie/${ID}?language=en-US`, options)
        .then((response) => response.json())
        .then((response) => {
        console.log(response);
        UpdateHero(response);
        currentMovie_JSON = response;
    }).catch((err) => console.error(err));
}

//using API to show related movies with its movie code
async function ShowRecommended(ID){
    fetch(`https://api.themoviedb.org/3/movie/${ID}/recommendations?language=en-US&page=1`, options)
    .then((response) => response.json())
    .then((response) => {
    console.log(response);
    movieList = response;
    RecommendMovies(movieList);

    }).catch((err) => console.error(err));
}

function RecommendMovies(_movieList){
    let out = '';
    let temp = '';
    for (let index = 0; index < document.getElementsByClassName("Recommended_IMG").length; index++) {
        temp = `
            <div class="card">
              <a class="recommendedRowAnchor" href='../pages/individualmovie.html' title="${_movieList.results[index].id}" onclick="LoadToNextPage(${_movieList.results[index].id})">
                <img
                  class="card-img-top Recommended_IMG"
                  src="https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}"
                  alt="Thumbnail"
                />
              </a>
              <div class="body">
                <h6 class="title Recommended_Title">${_movieList.results[index].title}</h6>
                <p class="Recommended_subTitle">${_movieList.results[index].release_date.substring(0, 4)}</p>
              </div>
            </div>
        `
        out += temp;
    }
    document.getElementsByClassName("Recommended_Row")[0].innerHTML = out;
}

//ShowCurrentMovie(RetrieveMovieCode());
//ShowRecommended(RetrieveMovieCode());

function UpdateHero(_movie){
    let out = '';

    let _genre;
    for (let index = 0; index < _movie.genres.length; index++) {
        if(_genre != undefined){
            _genre = _genre + ", " + _movie.genres[index].name;
        }else{
            _genre = _movie.genres[index].name;
        }
    }
    let _year = _movie.release_date.substring(0, 4);
    let _duration = _movie.runtime;
    let _age_rating;
    if(_movie.adult){
        _age_rating = "Adult";
    }else{
        _age_rating = "PG";
    }

    out = `
        <div class="col-md-4">
            <a id="imdb_movie">
              <img src="https://image.tmdb.org/t/p/original/${_movie.poster_path}" class="img-fluid cover" alt="Movie Poster" id="IndividualCover" href="https://www.imdb.com/title/${_movie.imdb_id}">
            </a>
        </div>
          
        <div class="col-md-8">
            <h1 class="display-4" id="IndividualTitle">${_movie.title}</h1>
            
            <p class="lead" id="IndividualInfoLine">
                ${_genre} | ${_year} | ${_duration} mins | ${_age_rating}
            </p>

            <p id="Individual_Desc">
                ${_movie.overview}
            </p>

            <a id="watchButton" href="${_movie.homepage}">
                <button type="button" class="btn btn-primary me-2">Watch Now</button>
            </a>

            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNoYXJlIj48cGF0aCBkPSJNNCAxMnY4YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMnYtOCIvPjxwb2x5bGluZSBwb2ludHM9IjE2IDYgMTIgMiA4IDYiLz48bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjIiIHkyPSIxNSIvPjwvc3ZnPg==" 
            alt="Share Icon" class="me-2">

            <a href="../pages/moviewatchlist.html" onclick="StoreMovieToWatchList()">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJvb2ttYXJrIj48cGF0aCBkPSJtMTkgMjEtNy00LTcgNFY1YTIgMiAwIDAgMSAyLTJoMTBhMiAyIDAgMCAxIDIgMnYxNnoiLz48L3N2Zz4=" 
                alt="Bookmark Icon">
            </a>
        </div>
    `
    document.getElementById("Hero_Info").innerHTML = out;
}

function WatchMovie(_movie){
    if(ID != null){
        window.open(`https://www.imdb.com/title/${_movie.imdb_id}/`);
    }
}

function LoadToNextPage(ID){
    localStorage.setItem("IndividualMovieCode", ID);
}
