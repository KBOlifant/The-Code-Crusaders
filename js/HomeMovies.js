pageNumber = 1;
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
      
    
    //GetMovieNames(Movie){
async function movieName() {
  // try{
  //     let result;

    fetch('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
        .then((response) => response.json())
        .then((response) => {
        console.log(response);
        movieList = response;
        SortMovies(movieList);
    }).catch((err) => console.error(err));
}

movieName();

function SortMovies(_movieList) {
    moviesToLoad = document.getElementsByClassName("New_HomeIMG").length;
    if(moviesToLoad < _movieList.results.length){
        for (let index = 0; index < moviesToLoad; index++) {
            document.getElementsByClassName("New_HomeIMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
            document.getElementsByClassName("New_HomeTitle")[index].innerHTML = _movieList.results[index].original_title;
            _month = parseInt(_movieList.results[index].release_date.substring(6, 7));
            document.getElementsByClassName("New_Home_subTitle")[index].innerHTML = `${String(_movieList.results[index].release_date).substring(0, 4)} ${months[_month]}`;
        }
    } else{
        for (let index = 0; index < _movieList.results.length; index++) {
            document.getElementsByClassName("New_HomeIMG")[index].src = `https://image.tmdb.org/t/p/original/${_movieList.results[index].poster_path}`;
            document.getElementsByClassName("New_HomeTitle")[index].innerHTML = _movieList.results[index].original_title;
            document.getElementsByClassName("New_Home_subTitle")[index].innerHTML = String(_movieList.results[index].release_date).substring(0, 4);
        }
    }
}

            // class Horror extends Movies{
            //     constructor(name, row){
            //         super(name, row);
            //         this.genre = "Horror";
            //     }
            // }
                /*if(getJsonObject(String(pageNumber) + Movie.genre) == null)
                {
                    //calling API for result as it not stored
                    const response = await fetch(`https://moviesminidatabase.p.rapidapi.com/movie/byGen/${Movie.genre}/`, options_mmd)
                    const _result = await response.json();
                    result = _result;

                     //updating home page images
                    UpdateImages(result, Movie);

                    //saving result for future use
                    saveJsonObject(JSON.stringify(result), String(pageNumber) + Movie.genre);
                } 
                else
                {
                    //using the already stored result
                    result = getJsonObject(String(pageNumber) + Movie.genre)

                     //updating home page images
                    UpdateImages(JSON.parse(result), Movie);
                }
                //console.log(JSON.parse(result));
                //console.log(RowPointer);

            } catch(error){
                console.log(error);
            }
        }
        movieName();
    }*/
    
/*

class Horror extends Movies{
    constructor(name, row){
        super(name, row);
        this.genre = "Horror";
    }
}

class Thriller extends Movies{
    constructor(name, row){
        super(name, row);
        this.genre = "Thriller";
    }
}

class Comedy extends Movies{
    constructor(name, row){
        super(name, row);
        this.genre = "Comedy";
    }
}

class War extends Movies{
    constructor(name, row){
        super(name, row);
        this.genre = "War";
    }
}

class Adventure extends Movies{
    constructor(name, row){
        super(name, row);
        this.genre = "Adventure"
    }
}

let Thriller1 = new Thriller("ThrillerRow");
let Comedy1 = new Comedy("ComedyRow");
let Horror1 = new Horror("HorrorRow");
let War1 = new War("WarRow");
let Adventure2 = new Adventure("AdventureRow");

//calling the object functions

//localStorage.clear();

/*const movieRowList = [Comedy1, Horror1, Thriller1, War1]
const HomeMovieList = [Comedy1, Horror1, Adventure2];

HomeMovieList[0].GetMovieNames(HomeMovieList[0]);

async function loadRows(){
    for(const fn of HomeMovieList){
        await fn.GetMovieNames(fn);
    }
}

async function loadFromAPI(result, index){
    const response = await fetch(`https://moviesminidatabase.p.rapidapi.com/movie/id/${result.results[index].imdb_id}/`, options_mmd)
    const api_result_cached = await response.json();
    saveJsonObject(JSON.stringify(api_result_cached) , result.results[index].imdb_id);
    return api_result_cached;
}

async function UpdateImages(result, Instance){
    try{
        let api_result;
        //const JSON_result = JSON.parse(result);

        //looping through the total images on home screen
        for (let index = 0; index < Instance.row; index++) {
            //checking to see if i already have JSON object stored
            if(getJsonObject(result.results[index].imdb_id) == null){
                //calling API for results

                
                api_result = await loadFromAPI(result, index);

                //saving the result for future use
                
            } 
            else{
                
                //retrieving the stored JSON object and turning it into something useful
                let api_result_raw = getJsonObject(result.results[index].imdb_id);
                api_result = JSON.parse(api_result_raw);
                console.log(api_result.results.title);
            }
            
            //console.log(api_result);
            //console.log(image_Buffer);
            //finally setting the images, using a buffer to load the images in chuncks

            document.getElementsByClassName(Instance.name)[index].src = await api_result.results.banner;
            document.getElementsByClassName(Instance.name+"Anchor")[index].href = await "https://www.imdb.com/title/" + api_result.results.imdb_id + "/";
            if(document.getElementsByClassName(Instance.name+"Title")[index] != undefined){
                document.getElementsByClassName(Instance.name+"Title")[index].innerHTML = await api_result.results.title;
            }
        }
        RowPointer++;
        //console.log(RowPointer);
        if(RowPointer < HomeMovieList.length){
            console.log(RowPointer)
            HomeMovieList[RowPointer].GetMovieNames(HomeMovieList[RowPointer]);
        }else{
            console.log(RowPointer);
            RowPointer = 0;
        }
        image_Buffer = [];
    }
    catch(error){
        console.log(error);
    }
}
*/
