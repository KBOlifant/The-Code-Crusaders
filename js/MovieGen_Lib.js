pageNumber = 1;

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
    DiscoverMovies();
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
async function DiscoverMovies() {
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
    let out = '';
    let temp = '';

    for (let index = 0; index < document.getElementsByClassName("movieLib_IMG").length; index++) {
        temp = `
            <div class="card" id="cardGap">
                <a class="MovieRowAnchor" href='../pages/individualmovie.html' onclick="${LoadToNextPage(_movieList.results[index].id)}">
                    <img class="card-img-top movieLib_IMG" alt="Thumbnail" src="https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}">
                </a>
                <div class="body">
                    <h5 class="title movieLib_Title">${_movieList.results[index].original_title}</h5>
                    <h6 class="movieLib_subTitle">${String(_movieList.results[index].release_date).substring(0, 4)}</h6>
                </div>
            </div>
        `;

        out += temp;
    }

    document.getElementById("librarySection").innerHTML = out;
}

function LoadToNextPage(ID){
    localStorage.setItem("IndividualMovieCode", ID);
}

movieName();


// for the bookmarks - create an empty array at the start, when the user clicks the save button on ind movie page, that object then gets pushed into the favourites array. Then, the same way you fed the info in library page, you will fav array into the watchlist page. You need to dynamically create the objects. Forloop runs the leght of the fav array and it will write the HTML and the info it will get is with the ${}. x
