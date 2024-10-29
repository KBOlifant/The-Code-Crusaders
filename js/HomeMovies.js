pageNumber = 1;
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