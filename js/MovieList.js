const myNodeList = document.querySelectorAll("movieWatchlist");

function GetFromLocalStorage(key) {
  try{
    return JSON.parse(localStorage.getItem(key));
  }catch{
    return null;
  }
}



function LoadMovieList(){
  let watchList = "";
  movieItems = GetFromLocalStorage("watchList");
  for (let index = 0; index < movieItems.length; index++) {
      let out =`
      <div class="card" id="cardGap">
      
          <div class="close-btn" onclick="removeFromWatchlist(${movieItems[index].id})">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXgiPjxwYXRoIGQ9Ik0xOCA2IDYgMTgiLz48cGF0aCBkPSJtNiA2IDEyIDEyIi8+PC9zdmc+"
              alt="Close Icon">
          </div>

          <a class="MovieRowAnchor" href='../pages/individualmovie.html' onclick="LoadToNextPage(${movieItems[index].id})">
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

  document.querySelector(".watchListDynamic").innerHTML = watchList;
}

LoadMovieList();

function clearWatchList(){
    localStorage.clear();
    document.querySelector(".watchListDynamic").innerHTML = "";
}

function LoadToNextPage(movie_API_Id){
    localStorage.setItem("IndividualMovieCode", movie_API_Id);
}

//removing movie from watchlist
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
