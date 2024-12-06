
document.addEventListener("DOMContentLoaded", function () {



//Элементы 
const main = document.getElementsByClassName("main")[0];
const movieTittle = document.getElementsByClassName("movieTitle")[0];
const similarMovieTitle = document.getElementsByClassName("movieTitle")[1];
const movie = document.getElementsByClassName("movie")[0]



//Кнопки
const themeBtn = document.getElementById("themeChange");
const searchBtn = document.getElementById("searchBtn");
//Слушатели событий
if(themeBtn) {
themeBtn.addEventListener("click", themeChange);
}
if(searchBtn) {
searchBtn.addEventListener("click", findMovie);
}
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        findMovie()
    }
})
//Cмена темы
function themeChange() {
    const body = document.querySelector("body")
    body.classList.toggle("dark")
}


//Поиск фильма
async function findMovie() {
    let search = document.getElementsByName("search")[0].value;
    let loader = document.getElementsByClassName("loader")[0];
    loader.style.display = "block";
    let data = { apikey: "c00ec9e6", t: search };
    let result = await sendRequest("https://www.omdbapi.com/", "GET", data);
    loader.style.display = "none";

    if (result.Response == "False") {
        main.style.display = "block"
        movieTittle.style.display = "block";
        movieTittle.innerHTML = `${result.Error}`;
    } else {
        showMovie(result);
        findSimilarMovies()
        console.log(result)
    }
}

function showMovie(movie) {
    const movieTittle = document.getElementsByClassName("movieTitle")[0];
    main.style.display = "block";
    movieTittle.style.display = "block";
    document.getElementsByClassName("movie")[0].style.display = "flex";
    document.getElementById("movieImg").style.backgroundImage = `url(${movie.Poster})`;
    movieTittle.innerHTML = `${movie.Title}`
    const movieDesc = document.getElementsByClassName("movieDescription")[0];
    movieDesc.innerHTML = ""
    let params = [
        "imdbRating", "Year", "Released", "Genre", "Country", "Language", "Director", "Writer", "Actors",
    ]
    params.forEach((key) => {
        movieDesc.innerHTML +=
            `   <div class="desc">
                    <span class="tittle">${key}</span>
                    <span class="subtitle">${movie[key]}</span>
                </div>            `;

    }
    );
}


// Функция похожих фильмов 
async function findSimilarMovies() {
    const search = document.getElementsByName("search")[0].value;
    const similarMovieTittle = document.getElementsByClassName("movieTitle")[1];
    const data = { apikey: "c00ec9e6", s: search };
    const result = await sendRequest("https://www.omdbapi.com/", "GET", data);
    console.log(result.Search);
    showSimilarMovies(result.Search);

    if (result.Response == "False") {

    } else {
        similarMovieTittle.style.display = "block";
        similarMovieTittle.innerHTML = `Найдено похожих фильмов: ${result.totalResults}`;
    }

}
function showSimilarMovies(movies) {
    const similarMovies = document.getElementsByClassName("similarMovie")[0];
    similarMovies.innerHTML = "";
    similarMovies.style.display = "grid"
    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];
        if (movie.Poster !== "N/A") {
            let similarMovie = ` 
             <div class="similarMovieCards" style="background-image: url('${movie.Poster}');">
            
                              <div class="saved" onclick ="addSaved(event)"
                                data-imdbID="${movie.imdID}" data-title="${movie.Title}" data-poster="${movie.Poster}">
            
                                 </div>
                             <div class="similarMovieTittle" >
                             ${movie.Title}
                             </div>
            </div>
            ` 
            similarMovies.innerHTML+=similarMovie
        }
    }

}








async function sendRequest(url, method, data) {
    if (method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        response = await response.json()
        return response
    } else if (method == "GET") {
        url = url + "?" + new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET"
        })
        response = await response.json()
        return response
    }
}}) ;


