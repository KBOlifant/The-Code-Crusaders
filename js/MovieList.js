const myNodeList = document.querySelectorAll("movieWatchlist");

function GetFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

movieItems = GetFromLocalStorage("watchList");

let watchList = "";

for (let index = 0; index < movieItems.length; index++) {
    let out =`
    <div id="cardGap" class="card">
        <img src="https://image.tmdb.org/t/p/original/${movieItems[index].poster_path}" width="80%" class="cover">
        <div class="body">
            <h5 class="title">Title</h5>
            <h6 class="subtitle">Sub title</h6>
        </div>
    </div>
    `;

    watchList += out;
}
document.querySelector(".watchListDynamic").innerHTML = watchList;
