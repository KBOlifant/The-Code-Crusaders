function RetrieveMovie(){
    let MovieID = localStorage.getItem("IndividualMovieCode");
    return MovieID;
}

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTBkOGMzNWQ5YzI1NDA4MjI3YmY3MjI5ZGZmZTg3YiIsIm5iZiI6MTcyOTUzNjI1NS4yNzIyMywic3ViIjoiNjZlODI0OWRkZDIyNGQxYTM5OTFkOTM4Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.-IWwS27WKL1YyCbPmGKa7UkuZsnRFiDXzY2FtywP8RE'
    }
};
  
async function ShowCurrentMovie(ID){
    fetch(`https://api.themoviedb.org/3/movie/${ID}?language=en-US`, options)
        .then((response) => response.json())
        .then((response) => {
        console.log(response);
        UpdateHero(response);
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

async function ShowRelated(ID){
    fetch(`https://api.themoviedb.org/3/movie/${ID}/alternative_titles`, options)
    .then((response) => response.json())
    .then((response) => {
    console.log(response);
    movieList = response;
    RelateMovie(movieList);

    }).catch((err) => console.error(err));
}

function RecommendMovies(_movieList){
    for (let index = 0; index < document.getElementsByClassName("Recommended_IMG").length; index++) {
        document.getElementsByClassName("Recommended_IMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
    }
}

function RelateMovie(_movieList){

}

ShowCurrentMovie(RetrieveMovie());
ShowRecommended(RetrieveMovie());
//ShowRelated(RetrieveMovie());

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
