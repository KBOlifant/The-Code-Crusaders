const myNodeList = document.querySelectorAll("movieWatchlist");
for (let index = 0; index < document.getElementsByClassName("card").length; index++) {
    document.getElementsByClassName("card")[index].style.display = "block";
}

document.getElementsByClassName("movieWatchlist").appendChild(myNodeList);