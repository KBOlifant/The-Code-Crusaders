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
    UpdateMovies("Adventure")
}).catch((err) => console.error(err));
}

//calling the functions
GetNewMovies();
InitializeMovieGenres(GenreList);


//sorting the movies based on given list (and Keyword for the HTML)
function SortMovies(_movieList, keyword) {
    moviesToLoad = document.getElementsByClassName(keyword+"_HomeIMG").length;
    let out = '';
    if(moviesToLoad < _movieList.results.length){
        
        let temp = '';
        for (let index = 0; index < moviesToLoad; index++) {
            _month = parseInt(_movieList.results[index].release_date.substring(6, 7));

            temp =  `
                <div class="card">
                    <a class="${keyword}RowAnchor" href='../pages/individualmovie.html' title='${_movieList.results[index].id}' onclick="LoadToNextPage(${_movieList.results[index].id})">
                        <img class="card-img-top ${keyword}_HomeIMG" alt="Thumbnail" src='https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}'>
                    </a>
                    <div class="card-body">
                        <h6 class="title ${keyword}_HomeTitle">${_movieList.results[index].original_title}</h6>
                        <p class="${keyword}_Home_subTitle">${String(_movieList.results[index].release_date).substring(0, 4)} ${months[_month]}</p>
                    </div>
                </div>
            `
            out += temp;
        }
    }

    document.getElementById(`${keyword}_Row`).innerHTML = out;
    //console.log(out);
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