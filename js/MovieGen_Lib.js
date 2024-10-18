pageNumber = 1;

image_Buffer = [];

class Movies{
    constructor(name, row, genre, poster){
        this.name = name;
        this.row = document.getElementsByClassName(this.name).length;
        this.genre = genre;
        this.poster = poster;
    }
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTBkOGMzNWQ5YzI1NDA4MjI3YmY3MjI5ZGZmZTg3YiIsIm5iZiI6MTcyOTA3NzY2OC4wMjUzMTcsInN1YiI6IjY2ZTgyNDlkZGQyMjRkMWEzOTkxZDkzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LcrKnRRMJ_4Y4ahXNTcY3H3anUkGRA0W6D0kLR2-1Rs'
    }
};
    
let movieList;
      
    
    //GetMovieNames(Movie){
async function movieName() {
  // try{
  //     let result;

  fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",options)
    .then((response) => response.json())
    .then((response) => {
    console.log(response);
    movieList = response;
    SortMovies(movieList);

    }).catch((err) => console.error(err));
}

movieName();

function SortMovies(_movieList) {
    moviesToLoad = document.getElementsByClassName("movieLib_IMG").length;
    if(moviesToLoad < _movieList.results.length){
        for (let index = 0; index < moviesToLoad; index++) {
            document.getElementsByClassName("movieLib_IMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
            document.getElementsByClassName("movieLib_Title")[index].innerHTML = _movieList.results[index].original_title;
            document.getElementsByClassName("movieLib_subTitle")[index].innerHTML = String(_movieList.results[index].release_date).substring(0, 4);
        }
    } else{
        for (let index = 0; index < _movieList.results.length; index++) {
            document.getElementsByClassName("movieLib_IMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
            document.getElementsByClassName("movieLib_Title")[index].innerHTML = _movieList.results[index].original_title;
            document.getElementsByClassName("movieLib_subTitle")[index].innerHTML = String(_movieList.results[index].release_date).substring(0, 4);
        }
    }
}
