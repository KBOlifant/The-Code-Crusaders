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

DiscoverMovies();