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

function NextPage(){
    pageNumber++;
    movieName();
}

function PreviousPage() {
  if (pageNumber > 1) {
    pageNumber--;
    movieName();
  } else {
    console.log("You are on the first page.");
  }
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

//use _movieList for the search bar, run if statement in a for / for each loop for movie title, if it finds it, it will open 

function SortMovies(_movieList) {
    var anchors = document.querySelectorAll('.MovieRowAnchor');

    for (let index = 0; index < document.getElementsByClassName("movieLib_IMG").length; index++) {
        document.getElementsByClassName("movieLib_IMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
        document.getElementsByClassName("movieLib_Title")[index].innerHTML = _movieList.results[index].original_title;
        document.getElementsByClassName("movieLib_subTitle")[index].innerHTML = String(_movieList.results[index].release_date).substring(0, 4);
        document.getElementsByClassName("MovieRowAnchor")[index].href = '../pages/individualmovie.html';
        document.getElementsByClassName("MovieRowAnchor")[index].title = _movieList.results[index].id;
        console.log(document.getElementsByClassName("MovieRowAnchor")[index].title)
        anchors[index].addEventListener('click', handler, false);
    }
}

function handler(){
    let att = this.getAttribute("title");
    localStorage.setItem("IndividualMovieCode", att);
}

movieName();


// for the bookmarks - create an empty array at the start, when the user clicks the save button on ind movie page, that object then gets pushed into the favourites array. Then, the same way you fed the info in library page, you will fav array into the watchlist page. You need to dynamically create the objects. Forloop runs the leght of the fav array and it will write the HTML and the info it will get is with the ${}. x