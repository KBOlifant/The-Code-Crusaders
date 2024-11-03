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
        SortMoviesHome(movieList, keyword);
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
        showActors(ID);
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

async function ApplyFilters(Section, genre_Filter, year_Filter, sort_Filter, rating_Filter){
    //initializing needed values from the html values
    let rating = parseInt(document.getElementById(rating_Filter).value);
    let genre_string = document.getElementById(genre_Filter).value;
    let rating_string = "";
    let genreID = 0;
    let sort_option = "";

    //checking which genre has been chosen then storing its code
    for (let index = 0; index < GenreList.length; index++) {
        if(genre_string == GenreList[index][0]){
            genreID = GenreList[index][1];
        }
    }

    //if no rating option has been picked, then show all rating values
    if(document.getElementById(rating_Filter).value == ""){
        rating_string = `&vote_average.gte=${1}&vote_average.lte=${10}`;
    } else{
        rating_string = `&vote_average.gte=${rating}&vote_average.lte=${rating + 1}`;
    }

    //if no genre has been specified, then show all genres
    if(document.getElementById(genre_Filter).value == ""){
        genre_string = '';
    } else{
        genre_string = `&with_genres=${genreID}`;
    }

    switch(parseInt(document.getElementById(sort_Filter).value)){
        case 0:
            sort_option = "";
            break;
        case 1:
            sort_option = "&sort_by=popularity.desc";
            break;
        case 2:
            sort_option = "&sort_by=primary_release_date.asc"
            break;
        case 3:
            sort_option = "&sort_by=primary_release_date.desc"
            break;
        case 4:
            sort_option = "&sort_by=title.asc"
            break;
        case 5:
            sort_option = "&sort_by=title.desc"
            break;
        case 6:
            sort_option = "&sort_by=vote_average.asc"
            break;
        case 7:
            sort_option = "&sort_by=vote_average.desc"
            break;
    }

    //storing these values into session storage to filter again without applying it again
    let params = [Section, genre_Filter, year_Filter, sort_Filter, rating_Filter];
    params_JSON = JSON.stringify(params);
    //console.log(JSON.parse(params_JSON));
    sessionStorage.setItem("filter", params_JSON);

    fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageNumber}&primary_release_year=${document.getElementById(year_Filter).value}${sort_option}${rating_string}${genre_string}&with_original_language=en`, options)
    .then((response) => response.json())
    .then((response) => {
    movieList = response;
    console.log(movieList);
    SortMovies(movieList, Section);
    }).catch((err) => console.error(err));
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

async function showActors(ID){
    fetch(`https://api.themoviedb.org/3/movie/${ID}/credits?language=en-US`, options)
    .then((response) => response.json())
    .then((response) => {
    cast = response.cast;
    console.log(cast);
    sortActors(cast);
    }).catch((err) => console.error(err));
}

function sortActors(cast){
    let out = "";
    let temp = "";
    for (let index = 0; index < cast.length; index++) {
        if(cast[index].known_for_department == "Acting" && cast[index].profile_path != null){
            temp = `
            <div class="col team-member" backgroundImage="../assets/actor.png">
              <img class="cast_pfp" src="https://image.tmdb.org/t/p/original/${cast[index].profile_path}" alt="Profile Picture" width='150px'>
              <p class="mt-2 mb-0">${cast[index].original_name}</p>
              <small>${cast[index].character}</small>
            </div>
            `;
        }else{
            temp = "";
        }

        out += temp;
    }

    document.getElementById("actors_section").innerHTML = out;
}
//change
//calling the functions
//GetNewMovies();

//setting up a function to call when Home page is loaded
function InitializeHomeGenres(){
    InitializeMovieGenres(GenreList);
}

async function InitializeLibraryGenres(_genreList){
    fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then((response) => response.json())
    .then((response) => {
    SortGenres(response, _genreList);
    console.log(GenreList);
    let out = "";
    let temp = "";
    for (let index = 0; index < GenreList.length; index++) {
        temp = `
            <option value="${GenreList[index][0]}">${GenreList[index][0]}</option>
        `
        out += temp;
    }

    let init = `<option value="">All</option>`;

    out = init + out;

    document.getElementById("genreFilter").innerHTML = out;
    }).catch((err) => console.error(err));
}

function SetGenres(){
    InitializeLibraryGenres(GenreList)
}

function resetPage(){
    pageNumber = 1;
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

//getting movie in JSON format
function GetFromLocalStorage(key) {
    try{
      return JSON.parse(localStorage.getItem(key));
    }catch{
      return null;
    }
}

//clearing the local storage for empty watchlist
function clearWatchList(){
    localStorage.clear();
    document.querySelector(".watchListDynamic").innerHTML = "";
}

//loads the next page
function NextPage(_section){
    pageNumber++;
    let filter_params = sessionStorage.getItem("filter");
    params_JSON = JSON.parse(filter_params);
    if(params_JSON != null){
        ApplyFilters(params_JSON[0], params_JSON[1], params_JSON[2], params_JSON[3], params_JSON[4])
    } else{
        DiscoverMovies(_section);
    }
}

function PreviousPage(_section){
    if(pageNumber <= 1){
        return;
    }
    pageNumber--;
    let filter_params = sessionStorage.getItem("filter");
    params_JSON = JSON.parse(filter_params);
    if(params_JSON != null){
        ApplyFilters(params_JSON[0], params_JSON[1], params_JSON[2], params_JSON[3], params_JSON[4])
    } else{
        DiscoverMovies(_section);
    } 
}


//sorting the movies based on given list (and Keyword for the HTML)
function SortMovies(_movieList, keyword) {
  moviesToLoad = _movieList.results.length;

  let out = "";
  //DOM manipulation
  let temp = "";
  for (let index = 0; index < moviesToLoad; index++) {
    if (_movieList.results[index].release_date != undefined) {
      _month = parseInt(_movieList.results[index].release_date.substring(6, 7));
    }

    if (_movieList.results[index].poster_path != null) {
      temp = `
            <div class="card">
                <a href='../pages/individualmovie.html' onclick="LoadToNextPage(${
                  _movieList.results[index].id
                })">
                    <img class="card-img-top ${keyword}_IMG" alt="Thumbnail" src='https://image.tmdb.org/t/p/original/${
        _movieList.results[index].poster_path
      }'>
                </a>
                <div class="card-body">
                    <h6 class="title">${
                      _movieList.results[index].original_title
                    }</h6>
                    <p class="${keyword}_subTitle">${String(
        _movieList.results[index].release_date
      ).substring(0, 4)} ${months[_month]}</p>
                    <p class="imdb-rating">${String(
                      _movieList.results[index].vote_average
                    ).substring(0, 3)}</p>
                </div>
            </div>
        `;
    } else {
      temp = "";
    }

    out += temp;
  }
  //setting the Row to expected results using DOM manipulation
  document.getElementById(`${keyword}_Row`).innerHTML = out;
}

function SortMoviesHome(_movieList, keyword) {
  moviesToLoad = document.getElementsByClassName(keyword + "_IMG").length;

  let out = "";
  //DOM manipulation
  let temp = "";
  for (let index = 0; index < moviesToLoad; index++) {
    _month = parseInt(_movieList.results[index].release_date.substring(6, 7));

    temp = `
            <div class="card">
                <a href='../pages/individualmovie.html' onclick="LoadToNextPage(${
                  _movieList.results[index].id
                })">
                    <img class="card-img-top ${keyword}_IMG" alt="Thumbnail" src='https://image.tmdb.org/t/p/original/${
      _movieList.results[index].poster_path
    }'>
                </a>
                <div class="card-body">
                    <h6 class="title">${
                      _movieList.results[index].original_title
                    }</h6>
                    <p class="${keyword}_subTitle">${String(
      _movieList.results[index].release_date
    ).substring(0, 4)} ${months[_month]}</p>
                    <p class="imdb-rating">${String(
                      _movieList.results[index].vote_average
                    ).substring(0, 3)}</p>
                </div>
            </div>
        `;
    out += temp;
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

function GenerateGenreCode(Genre){

}

function removeFromWatchlist(movie_API_Id){
    movieItems = GetFromLocalStorage("watchList");
  
    for (let index = 0; index < movieItems.length; index++) {
      if(movie_API_Id == movieItems[index].id){
        movieItems.splice(index, 1);
        console.log(movieItems);
        localStorage.setItem("watchList", JSON.stringify(movieItems));
        LoadMovieList();
      }
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
            <a id="imdb_movie" href="https://www.imdb.com/title/${_movie.imdb_id}/">
              <img src="https://image.tmdb.org/t/p/original/${_movie.poster_path}" class="img-fluid cover" alt="Movie Poster" id="IndividualCover" href="https://www.imdb.com/title/${_movie.imdb_id}">
            </a>
        </div>
          
        <div class="col-md-8">
            <h1 class="display-4" id="IndividualTitle">${_movie.title}</h1>
            
            <p class="lead" id="IndividualInfoLine">
                ${_genre} | ${_year} | ${_duration} mins | ${_movie.vote_average}
            </p>

            <p id="Individual_Desc">
                ${_movie.overview}
            </p>

            <div class="buttonContainerIndMovie">
              <a id="watchButton" href="${_movie.homepage}">
                <button type="button" class="btn-primary">Watch Now</button>
              </a>
              <a href="moviewatchlist.html" onclick="StoreMovieToWatchList()">
                <button type="button" class="btn-primary" id="watchListBtn">Add to Watchlist</button>
              </a>
            </div>
        </div>
    `
    //DOM manipulation to update the hero section
    document.getElementById("Hero_Info").innerHTML = out;
    document.getElementById("heroBanID").style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${_movie.backdrop_path}')`;
    
}

function LoadMovieList() {
  // Clear the container initially to avoid duplicating items
  document.querySelector(".watchListDynamic").innerHTML = "";

  // Fetch items from local storage
  const movieItems = GetFromLocalStorage("watchList");

  for (let index = 0; index < movieItems.length; index++) {
    let out = `
        <div class="card" id="cardGap">
            <div class="close-btn" onclick="removeFromWatchlist(${
              movieItems[index].id
            })">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXgiPjxwYXRoIGQ9Ik0xOCA2IDYgMTgiLz48cGF0aCBkPSJtNiA2IDEyIDEyIi8+PC9zdmc+" alt="Close Icon">
            </div>
            <a class="MovieRowAnchor" href='../pages/individualmovie.html' onclick="LoadToNextPage(${
              movieItems[index].id
            })">
                <img src="https://image.tmdb.org/t/p/original/${
                  movieItems[index].poster_path
                }" width="80%" class="card-img-top movieWatch_IMG" alt="Thumbnail">
            </a>
            <div class="body">
                <h6 class="title">${movieItems[index].original_title}</h6>
                <p class="movieWatch_subTitle">${String(
                  movieItems[index].release_date
                ).substring(0, 4)}</p>
                <div class="imdb-rating">${String(
                  movieItems[index].vote_average
                ).substring(0, 3)}</div>
            </div>
        </div>
        `;

    // Append each card individually to avoid overwriting existing content
    document
      .querySelector(".watchListDynamic")
      .insertAdjacentHTML("beforeend", out);
  }
}

// Function to scroll to the top (Button on right hand side of the)
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Show or hide the button based on scroll position
window.onscroll = function() {
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");
  
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
};

// Function to display a random movie in the Individual Movie Banner from the Romance genre
async function IndividualMovieBanner() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTBkOGMzNWQ5YzI1NDA4MjI3YmY3MjI5ZGZmZTg3YiIsIm5iZiI6MTcyOTA3NzY2OC4wMjUzMTcsInN1YiI6IjY2ZTgyNDlkZGQyMjRkMWEzOTkxZDkzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LcrKnRRMJ_4Y4ahXNTcY3H3anUkGRA0W6D0kLR2-1Rs",
    },
  };

  try {
    // Step 1: Fetch all genres to get the ID for the "Romance" genre
    const genreResponse = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?language=en",
      options
    );
    const genres = await genreResponse.json();
    const romanceGenre = genres.genres.find((genre) => genre.name === "Romance");

    if (!romanceGenre) {
      console.error("Romance genre not found");
      return;
    }

    // Step 2: Fetch a list of movies in the "Romance" genre
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${romanceGenre.id}&sort_by=popularity.desc&page=1`,
      options
    );
    const movies = await movieResponse.json();

    // Step 3: Select a random movie from the "Romance" genre
    const movie = movies.results[Math.floor(Math.random() * movies.results.length)];

    // Set the banner background image to the selected movie's backdrop
    document.getElementById("IndividualMovieBanner").style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')`;

    // Populate the title, subtitle (tagline), and Watch Now button
    document.getElementById("bannerTitle").textContent = movie.title;
    document.getElementById("bannerSubtitle").textContent = movie.tagline || "Discover this romantic movie!";
    
    // Set the Watch Now button to link to the individual movie page with the movie ID in the URL
    document
      .getElementById("watchNowBtn")
      .setAttribute("href", `../pages/individualmovie.html?id=${movie.id}`);
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
}

// Call function to load a random romance movie banner when the page loads
document.addEventListener("DOMContentLoaded", IndividualMovieBanner);

// this is for the hero banner slider on the home page that displays the new movies 

async function populateHeroBanner() {
  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options);
    const data = await response.json();
    const movies = data.results.slice(0, 5); // Limiting to the first 5 new movies

    let bannerContent = '';

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];

      // Fetching director's name (crew data)
      const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US`, options);
      const creditsData = await creditsResponse.json();
      const director = creditsData.crew.find(member => member.job === 'Director')?.name || 'Unknown Director';

      bannerContent += `
        <div class="carousel-item ${i === 0 ? 'active' : ''}">
          <div class="hero-banner-slide" style="background-image: url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}');">
            <div class="movie-banner-overlay"></div>
            <div class="movie-banner-content">
              <h1 class="movie-title">${movie.title}</h1>
              <p class="movie-subtitle">Directed by ${director} | IMDb Rating: ${movie.vote_average}</p>
              <a href="../pages/individualmovie.html?id=${movie.id}" class="btn btn-primary movie-banner-btn">Watch Now</a>
            </div>
          </div>
        </div>
      `;
    }

    document.getElementById('heroBannerContent').innerHTML = bannerContent;
  } catch (error) {
    console.error("Error fetching new movies for Hero Banner:", error);
  }
}



// Call function to populate the Hero Banner when the page loads
document.addEventListener("DOMContentLoaded", populateHeroBanner);

async function loadTrailerBanner() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer YOUR_API_KEY", // Replace with your actual API key
    },
  };

  try {
    // Fetch Adventure genre ID first, if not known, to get a random Adventure movie
    const genreResponse = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?language=en",
      options
    );
    const genres = await genreResponse.json();
    const adventureGenre = genres.genres.find(
      (genre) => genre.name === "Adventure"
    );

    // Get a random Adventure movie
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${adventureGenre.id}&sort_by=popularity.desc&page=1`,
      options
    );
    const movies = await movieResponse.json();
    const movie =
      movies.results[Math.floor(Math.random() * movies.results.length)];

    // Fetch trailer for the selected movie
    const trailerResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
      options
    );
    const trailerData = await trailerResponse.json();
    const trailer = trailerData.results.find(
      (video) => video.type === "Trailer"
    );

    // Populate banner content
    document.getElementById("trailerBannerTitle").textContent = movie.title;
    document.getElementById("trailerBannerDescription").textContent =
      movie.overview;
    document
      .getElementById("watchTrailerBtn")
      .setAttribute("href", `../pages/individualmovie.html?id=${movie.id}`);

    // Set trailer video as background with autoplay
    document.getElementById(
      "TrailerBanner"
    ).style.backgroundImage = `url('https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}')`;
  } catch (error) {
    console.error("Error loading trailer banner:", error);
  }
}

// Call function on page load
document.addEventListener("DOMContentLoaded", loadTrailerBanner);

async function loadTrailerBanner() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTBkOGMzNWQ5YzI1NDA4MjI3YmY3MjI5ZGZmZTg3YiIsIm5iZiI6MTcyOTA3NzY2OC4wMjUzMTcsInN1YiI6IjY2ZTgyNDlkZGQyMjRkMWEzOTkxZDkzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LcrKnRRMJ_4Y4ahXNTcY3H3anUkGRA0W6D0kLR2-1Rs",
    },
  };

//   this is for the hero banner that plays movie trailers
  try {
    // Fetch Adventure genre ID
    const genreResponse = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list?language=en",
      options
    );
    const genres = await genreResponse.json();
    const adventureGenre = genres.genres.find(
      (genre) => genre.name === "Adventure"
    );

    // Get a random Adventure movie
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/discover/movie?with_genres=${adventureGenre.id}&sort_by=popularity.desc&page=1`,
      options
    );
    const movies = await movieResponse.json();
    const movie =
      movies.results[Math.floor(Math.random() * movies.results.length)];

    // Fetch trailer for the selected movie
    const trailerResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
      options
    );
    const trailerData = await trailerResponse.json();
    const trailer = trailerData.results.find(
      (video) => video.type === "Trailer"
    );

    // Populate banner content
    document.getElementById("trailerBannerTitle").textContent = movie.title;
    document.getElementById("trailerBannerDescription").textContent =
      movie.overview;

    // Set the Watch Trailer button URL if a trailer is available, otherwise link to the movie's individual page
    const watchButton = document.getElementById("watchTrailerBtn");
    if (trailer) {
      watchButton.setAttribute(
        "href",
        `https://www.youtube.com/watch?v=${trailer.key}`
      );
      watchButton.textContent = "Watch Trailer";
    } else {
      watchButton.setAttribute(
        "href",
        `../pages/individualmovie.html?id=${movie.id}`
      );
      watchButton.textContent = "More Info";
    }

    // Set movie poster as background with black overlay
    document.getElementById(
      "TrailerBanner"
    ).style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://image.tmdb.org/t/p/original/${movie.poster_path}')`;
  } catch (error) {
    console.error("Error loading trailer banner:", error);
  }
}

// Call function on page load
document.addEventListener("DOMContentLoaded", loadTrailerBanner);

async function loadWatchlistBanner() {
    const options = {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTBkOGMzNWQ5YzI1NDA4MjI3YmY3MjI5ZGZmZTg3YiIsIm5iZiI6MTcyOTA3NzY2OC4wMjUzMTcsInN1YiI6IjY2ZTgyNDlkZGQyMjRkMWEzOTkxZDkzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LcrKnRRMJ_4Y4ahXNTcY3H3anUkGRA0W6D0kLR2-1Rs",
        },
    };

    try {
        // Fetch a list of popular movies
        const response = await fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", options);
        const movies = await response.json();
        
        // Select a random movie (not the first one) for variety
        const movie = movies.results[Math.floor(Math.random() * (movies.results.length - 1)) + 1];

        // Fetch additional details for the director and age restriction if needed
        const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`, options);
        const movieDetails = await detailsResponse.json();
        const director = movieDetails.credits.crew.find(person => person.job === "Director")?.name || "Unknown Director";
        
        // Set the background to the movie's poster
        document.getElementById("WatchlistBanner").style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${movie.poster_path}')`;

        // Populate banner content
        document.getElementById("watchlistBannerTitle").textContent = movie.title;
        document.getElementById("watchlistBannerDirector").textContent = `Directed by: ${director}`;
        document.getElementById("watchlistBannerYear").textContent = `Year: ${movie.release_date.substring(0, 4)}`;
        document.getElementById("watchlistBannerAge").textContent = `Age Restriction: ${movie.adult ? "18+" : "PG"}`;

        // Set the button to scroll to the Watchlist section
        document.getElementById("startWatchingBtn").addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector("#MovieWatchlistContainer").scrollIntoView({ behavior: "smooth" });
        });
    } catch (error) {
        console.error("Error loading watchlist banner:", error);
    }
}

// Call the function to load the WatchlistBanner when the page loads
document.addEventListener("DOMContentLoaded", loadWatchlistBanner);

async function loadWatchlistBanner() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer YOUR_API_KEY", // Replace with your actual API key
    },
  };

  try {
    // Fetch a list of popular movies
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      options
    );
    const movies = await response.json();

    // Select a random movie (not the first one)
    const movie =
      movies.results[
        Math.floor(Math.random() * (movies.results.length - 1)) + 1
      ];

    // Set the background to the movie's poster
    document.getElementById(
      "WatchlistBanner"
    ).style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${movie.poster_path}')`;

    // Populate the title
    document.getElementById("watchlistBannerTitle").textContent = movie.title;

    // Fetch the movie's full details to get genres, runtime, etc.
    const movieDetailsResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
      options
    );
    const movieDetails = await movieDetailsResponse.json();

    // Extract and format movie details
    const genres = movieDetails.genres.map((genre) => genre.name).join(", ");
    const releaseYear = movieDetails.release_date.substring(0, 4);
    const runtime = `${movieDetails.runtime} mins`;
    const rating = movieDetails.vote_average
      ? movieDetails.vote_average.toFixed(1)
      : "N/A";

    // Display the formatted movie details in .moviesubtitles style
    document.getElementById(
      "watchlistBannerDetails"
    ).textContent = `${genres} | ${releaseYear} | ${runtime} | ${rating}`;

    // Set the button to scroll to the Watchlist section
    document
      .getElementById("startWatchingBtn")
      .addEventListener("click", (e) => {
        e.preventDefault();
        document
          .querySelector("#MovieWatchlistContainer")
          .scrollIntoView({ behavior: "smooth" });
      });
  } catch (error) {
    console.error("Error loading watchlist banner:", error);
  }
}

// Call function on page load
document.addEventListener("DOMContentLoaded", loadWatchlistBanner);