const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTBkOGMzNWQ5YzI1NDA4MjI3YmY3MjI5ZGZmZTg3YiIsIm5iZiI6MTczMDEyMDE0Mi4wMzg4MjMsInN1YiI6IjY2ZTgyNDlkZGQyMjRkMWEzOTkxZDkzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HgM1DMmo95Ic43Om000i7eqaU6o5x7yf8gZWo38JWt0'
    }
};

function KeywordConverter(keyword){
    fetch(`https://api.themoviedb.org/3/search/keyword?query=${keyword}&page=1`, options)
    .then((response) => response.json())
    .then((response) => {
    console.log(response);

    }).catch((err) => console.error(err));
}

function storeInput(){
    currentInput = sessionStorage.setItem("Input", document.getElementById("userInput").value);
    alert(currentInput);
    console.log(currentInput);
}