pageNumber = 1;

//used to translate API date data into readable words
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//to store list of genres available by API
let GenreList = [];

//movie List from API
let movieList;

//to store the current movie were looking at on the Individual page
let currentMovie_JSON;

//API Key
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTBkOGMzNWQ5YzI1NDA4MjI3YmY3MjI5ZGZmZTg3YiIsIm5iZiI6MTcyOTA3NzY2OC4wMjUzMTcsInN1YiI6IjY2ZTgyNDlkZGQyMjRkMWEzOTkxZDkzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LcrKnRRMJ_4Y4ahXNTcY3H3anUkGRA0W6D0kLR2-1Rs'
    }
  };

//gets brand new movies that recently came out from API
async function GetNewMovies() {
    fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
        .then((response) => response.json())
        .then((response) => {
        console.log(response);
        movieList = response;
        SortMovies(movieList, "New");
    }).catch((err) => console.error(err));
}

//Deciding the genres for each movie row
async function UpdateMovies(keyword){
    for (let index = 0; index < GenreList.length; index++) {
        if(keyword == GenreList[index][0]){
            fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${GenreList[index][1]}`, options)
        .then((response) => response.json())
        .then((response) => {
        console.log(response);
        movieList = response;
        SortMovies(movieList, keyword);
            }).catch((err) => console.error(err));
        }
    }
}

//setting them up for DOM manipulation
async function InitializeMovieGenres(_genreList){
    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then((response) => response.json())
    .then((response) => {
    SortGenres(response, _genreList);
    console.log(GenreList);
    UpdateMovies("Animation");
    UpdateMovies("Thriller");
    UpdateMovies("Fantasy");
    UpdateMovies("Family");
    UpdateMovies("Documentary")
    UpdateMovies("Adventure")
}).catch((err) => console.error(err));
}

//shows the current movie we are looking at. should be used in individual movie
async function ShowCurrentMovie(ID){
    fetch(`https://api.themoviedb.org/3/movie/${ID}?language=en-US`, options)
        .then((response) => response.json())
        .then((response) => {
        console.log(response);
        
        //updating the hero section of individual movie
        UpdateHero(response);
        IndividualBanner(response);
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

async function DiscoverMovies(Section) {
    fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNumber}`,options)
    .then((response) => response.json())
    .then((response) => {
    console.log(response);
    movieList = response;
    SortMovies(movieList, Section);

    }).catch((err) => console.error(err));
}
//change
//calling the functions
//GetNewMovies();

//setting up a function to call when Home page is loaded
function InitializeHomeGenres(){
    InitializeMovieGenres(GenreList);
}

function WatchMovie(_movie){
    if(ID != null){
        window.open(`https://www.imdb.com/title/${_movie.imdb_id}/`);
    }
}

//function to store to watchlist in JSON
function StoreMovieToWatchList(){
    console.log("movie saved");
    AddToWatchList(currentMovie_JSON)
}

//loads the next page
function NextPage(_section){
    pageNumber++;
    DiscoverMovies(_section);
}

//sorting the movies based on given list (and Keyword for the HTML)
function SortMovies(_movieList, keyword) {
    moviesToLoad = document.getElementsByClassName(keyword+"_IMG").length;

    let out = '';
    if(moviesToLoad <= _movieList.results.length){
        //DOM manipulation
        let temp = '';
        for (let index = 0; index < moviesToLoad; index++) {
            _month = parseInt(_movieList.results[index].release_date.substring(6, 7));

            temp =  `
                <div class="card">
                    <a href='../pages/individualmovie.html' onclick="LoadToNextPage(${_movieList.results[index].id})">
                        <img class="card-img-top ${keyword}_IMG" alt="Thumbnail" src='https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}'>
                    </a>
                    <div class="card-body">
                        <h6 class="title">${_movieList.results[index].original_title}</h6>
                        <p>${String(_movieList.results[index].release_date).substring(0, 4)} ${months[_month]}</p>
                    </div>
                </div>
            `
            out += temp;
        }

        console.log(moviesToLoad);
    }

    //setting the Row to expected results using DOM manipulation
    document.getElementById(`${keyword}_Row`).innerHTML = out;
}

//Getting the genre list from the API
function SortGenres(_genreCodeList, _GenreArray){
    for (let index = 0; index < _genreCodeList.genres.length; index++) {
        _GenreArray.push([_genreCodeList.genres[index].name, _genreCodeList.genres[index].id]);
    }
}

//saving the movie code into local storage
function LoadToNextPage(movie_API_Id){
    console.log(movie_API_Id);
    localStorage.setItem("IndividualMovieCode", movie_API_Id);
}

//uses result from API to show reccommended movies accordingly
function RecommendMovies(_movieList){
    let out = '';
    let temp = '';
    for (let index = 0; index < document.getElementsByClassName("Recommended_IMG").length; index++) {
        _month = parseInt(_movieList.results[index].release_date.substring(6, 7));

        temp = `
            <div class="card">
              <a class="recommendedRowAnchor" href='../pages/individualmovie.html' onclick="LoadToNextPage(${_movieList.results[index].id})">
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
    document.getElementById("Recommended_Row").innerHTML = out;
}

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
            console.log(movie);
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

async function IndividualBanner(tag_ID, ID)
    {
        for (let index = 0; index < tag_ID.length; index++) {
            let _movie;
            let out = "";
            fetch(`https://api.themoviedb.org/3/movie/${ID[index]}?language=en-US`, options)
            .then((response) => response.json())
            .then((response) => {
                _movie = response;
    
                out = `
                    <div class="centerFindMoreText">
                        <div class="text-center middleText">
                            <h2>${_movie.title}</h2>
                            <p>${_movie.tagline}</p>
                            <button type="button" class="btn btn-primary">Find out more</button>
                        </div>
                    </div>
                `;
    
                document.getElementById(tag_ID[index]).innerHTML = out;
                document.getElementById(tag_ID[index]).style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${_movie.backdrop_path}')`;
                
    
        }).catch((err) => console.error(err));
        }
}

async function LoadByID(ID){
    for (let index = 0; index < ID.length; index++) {
        let _movie;
        let out = "";
        fetch(`https://api.themoviedb.org/3/movie/${ID[index]}?language=en-US`, options)
        .then((response) => response.json())
        .then((response) => {
            _movie = response;

            out = `
                <div class="centerFindMoreText">
                    <div class="text-center middleText">
                        <h2>${_movie.title}</h2>
                        <p>${_movie.tagline}</p>
                        <button type="button" class="btn btn-primary">Find out more</button>
                    </div>
                </div>
            `;

            document.getElementById(tag_ID[index]).innerHTML = out;
            document.getElementById(tag_ID[index]).style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${_movie.backdrop_path}')`;

    }).catch((err) => console.error(err));
    }
}

//update the hero section of individual movie html
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
    //DOM manipulation to update the hero section
    document.getElementById("Hero_Info").innerHTML = out;
    document.getElementById("heroBanID").style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${_movie.backdrop_path}')`;
    
}