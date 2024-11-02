const myNodeList = document.querySelectorAll("movieWatchlist");

function GetFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function LoadMovieList(){

for (let index = 0; index < movieItems.length; index++) {
    let out =`
    <div class="card" id="cardGap">
        <a class="MovieRowAnchor" href='../pages/individualmovie.html' title=${movieItems[index].id} onclick="LoadToNextPage(${movieItems[index].id})">
          <img src="https://image.tmdb.org/t/p/original/${movieItems[index].poster_path}" width="80%" class="cover">
        </a>
        <div class="body">
          <h5 class="movieWatch_Title">${movieItems[index].original_title}</h5>
          <h6 class="movieWatch_subTitle">${String(movieItems[index].release_date).substring(0, 4)}</h6>
        </div>
      </div>
    `;

    watchList += out;
}

function clearWatchList(){
    localStorage.clear();
    document.querySelector(".watchListDynamic").innerHTML = "";
}
document.querySelector(".watchListDynamic").innerHTML = watchList;

function LoadToNextPage(movie_API_Id){
    localStorage.setItem("IndividualMovieCode", movie_API_Id);
}

function removeFromWatchlist(movie_API_Id){
  let movieItems = GetFromLocalStorage("watchList");
