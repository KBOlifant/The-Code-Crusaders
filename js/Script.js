pageNumber = 1;

//needed for when we need to display month of movie release
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//to store list of genres available by API
let GenreList = [];

//movie List from API
let movieList;

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
}).catch((err) => console.error(err));
}

//calling the functions
GetNewMovies();
InitializeMovieGenres(GenreList);


//sorting the movies based on given list (and Keyword for the HTML)
function SortMovies(_movieList, keyword) {
    moviesToLoad = document.getElementsByClassName(keyword+"_HomeIMG").length;
    var anchors = document.querySelectorAll(`.${keyword}RowAnchor`);
    if(moviesToLoad < _movieList.results.length){
        for (let index = 0; index < moviesToLoad; index++) {
            document.getElementsByClassName(keyword+"_HomeIMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
            document.getElementsByClassName(keyword+"_HomeTitle")[index].innerHTML = _movieList.results[index].original_title;
            _month = parseInt(_movieList.results[index].release_date.substring(6, 7));
            document.getElementsByClassName(keyword+"_Home_subTitle")[index].innerHTML = `${String(_movieList.results[index].release_date).substring(0, 4)} ${months[_month]}`;
            document.getElementsByClassName(`${keyword}RowAnchor`)[index].title = _movieList.results[index].id;
            document.getElementsByClassName(`${keyword}RowAnchor`)[index].href = '../pages/individualmovie.html';
            anchors[index].addEventListener('click', LoadToNextPage, false);
        }
    } else{
        for (let index = 0; index < _movieList.results.length; index++) {
            document.getElementsByClassName(keyword+"_HomeIMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
            document.getElementsByClassName(keyword+"_HomeTitle")[index].innerHTML = _movieList.results[index].original_title;
            document.getElementsByClassName(keyword+"_Home_subTitle")[index].innerHTML = String(_movieList.results[index].release_date).substring(0, 4);
        }
    }
}

//Getting the genre list from the API
function SortGenres(_genreCodeList, _GenreArray){
    for (let index = 0; index < _genreCodeList.genres.length; index++) {
        _GenreArray.push([_genreCodeList.genres[index].name, _genreCodeList.genres[index].id]);
    }
}

//saving the movie code into local storage
function LoadToNextPage(){
    let att = this.getAttribute("title");
    console.log(att);
    localStorage.setItem("IndividualMovieCode", att);
}

function RetrieveMovie(){
    let MovieID = localStorage.getItem("IndividualMovieCode");
    return MovieID;
}

//localStorage.clear();
function AddToLocalStorage(movie){
    if(typeof movie != "string"){
        movie = JSON.stringify(movie);
    }
    return movie;
}

function GetFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function AddToWatchList(movie){
    currentMovie = [];
    currentMovie = GetFromLocalStorage("watchList");
    if(currentMovie != null){
        currentMovie.push(movie);
        localStorage.setItem("watchList", AddToLocalStorage(currentMovie));
        console.log(currentMovie);
    }else{
        currentMovie = [];
        currentMovie.push(movie);
        localStorage.setItem("watchList", AddToLocalStorage(currentMovie));
        console.log(currentMovie);
    }
    
}
  
async function ShowCurrentMovie(ID){
    fetch(`https://api.themoviedb.org/3/movie/${ID}?language=en-US`, options)
        .then((response) => response.json())
        .then((response) => {
        console.log(response);
        UpdateHero(response);
        AddToWatchList(response);
    }).catch((err) => console.error(err));
}

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
    var anchors = document.querySelectorAll('.recommendedRowAnchor');

    for (let index = 0; index < document.getElementsByClassName("Recommended_IMG").length; index++) {
        document.getElementsByClassName("Recommended_IMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
        document.getElementsByClassName("Recommended_Title")[index].innerHTML = _movieList.results[index].title;
        document.getElementsByClassName("Recommended_subTitle")[index].innerHTML = _movieList.results[index].release_date.substring(0, 4);
        document.getElementsByClassName("recommendedRowAnchor")[index].href = '../pages/individualmovie.html';
        document.getElementsByClassName("recommendedRowAnchor")[index].title = _movieList.results[index].id;
        anchors[index].addEventListener('click', LoadToNextPage, false);
    }
}

ShowCurrentMovie(RetrieveMovie());
ShowRecommended(RetrieveMovie());

function UpdateHero(_movie){
    document.getElementById("IndividualCover").src = `https://image.tmdb.org/t/p/original/${_movie.poster_path}`;
    document.getElementById("IndividualTitle").innerHTML = _movie.title;
    document.getElementById("imdb_movie").href = `https://www.imdb.com/title/${_movie.imdb_id}/`;
    document.getElementById("watchButton").href = _movie.homepage;
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
    //console.log(_genre, _year, _duration, _age_rating);
    document.getElementById("IndividualInfoLine").innerHTML = `${_genre} | ${_year} | ${_duration} mins | ${_age_rating}`;
    document.getElementById("Individual_Desc").innerHTML = _movie.overview;
}

function WatchMovie(_movie){
    if(ID != null){
        window.open(`https://www.imdb.com/title/${_movie.imdb_id}/`);
    }
}

function LoadToNextPage(){
    let att = this.getAttribute("title");
    localStorage.setItem("IndividualMovieCode", att);
}

function NextPage(){
    pageNumber++;
    movieName();
}
      
    
    //GetMovieNames(Movie){
async function movieName() {
  // try{
  //     let result;

    fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNumber}`,options)
    .then((response) => response.json())
    .then((response) => {
    console.log(response);
    movieList = response;
    SortMovies(movieList);

    }).catch((err) => console.error(err));
}

function SortMovies(_movieList) {
    var anchors = document.querySelectorAll('.MovieRowAnchor');

    for (let index = 0; index < document.getElementsByClassName("movieLib_IMG").length; index++) {
        document.getElementsByClassName("movieLib_IMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
        document.getElementsByClassName("movieLib_Title")[index].innerHTML = _movieList.results[index].original_title;
        document.getElementsByClassName("movieLib_subTitle")[index].innerHTML = String(_movieList.results[index].release_date).substring(0, 4);
        document.getElementsByClassName("MovieRowAnchor")[index].href = '../pages/individualmovie.html';
        document.getElementsByClassName("MovieRowAnchor")[index].title = _movieList.results[index].id;
        console.log(document.getElementsByClassName("MovieRowAnchor")[index].title)
        anchors[index].addEventListener('click', LoadToNextPage, false);
    }
}

function LoadToNextPage(){
    let att = this.getAttribute("title");
    localStorage.setItem("IndividualMovieCode", att);
}

function KeywordConverter(keyword){
    fetch(`https://api.themoviedb.org/3/search/keyword?query=${keyword}&page=1`, options)
    .then((response) => response.json())
    .then((response) => {
    console.log(response);

    }).catch((err) => console.error(err));
}

function storeInput(){
    _userInput = document.getElementById("userInput").value;
    if(_userInput != undefined){
        currentInput = sessionStorage.setItem("Input", _userInput);
        alert(currentInput);
        console.log(currentInput);
    }
}

movieName();

const myNodeList = document.querySelectorAll("movieWatchlist");

function GetFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

movieItems = GetFromLocalStorage("watchList");

let watchList = "";

for (let index = 0; index < movieItems.length; index++) {
    let out =`
    <div id="cardGap" class="card">
        <img src="https://image.tmdb.org/t/p/original/${movieItems[index].poster_path}" width="80%" class="cover">
        <div class="body">
            <h5 class="title">Title</h5>
            <h6 class="subtitle">Sub title</h6>
        </div>
    </div>
    `;

    watchList += out;
}
document.querySelector(".watchListDynamic").innerHTML = watchList;