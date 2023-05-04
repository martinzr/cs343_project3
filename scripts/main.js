
const searchForm = document.getElementById("top-search");
searchForm.onsubmit = (ev) => {
  let movie_result = document.getElementById("rhyme-results")
  while (movie_result.firstChild) {
    movie_result.removeChild(movie_result.firstChild)
  }
  let country_result = document.getElementById("movie-results")
  while (country_result.firstChild) {
    country_result.removeChild(country_result.firstChild)
  }
  console.log("submitted top-search with", ev);
  ev.preventDefault();
  // https://stackoverflow.com/a/26892365/1449799
  const formData = new FormData(ev.target);
  // console.log(formData)
  // for (const pair of formData.entries()) {
  //   console.log(`${pair[0]}, ${pair[1]}`);
  // }
  const queryText = formData.get("query");
  console.log("queryText", queryText);

  const movieResultsPromise = movies(queryText);
  console.log(movieResultsPromise);
  movieResultsPromise.then((movieResults) => {
    console.log(movieResults);
    const movieItemsArray = movieResults.title_results.map(buttons);
    console.log("movieItemsArray", movieItemsArray);
    const movieResultsUL = document.getElementById("rhyme-results");
    movieItemsArray.forEach((movieLi) => {
    movieResultsUL.appendChild(movieLi);
    });
  });
};

// given a word (string), search for rhymes
// https://rhymebrain.com/api.html#rhyme
//  https://rhymebrain.com/talk?function=getRhymes&word=hello




const movies = (word) => {
  return fetch(
    `https://api.watchmode.com/v1/search/?apiKey=N8WVmv2qZRPNHitsgVOg1SyogHmqlN5KWJ9FMtsQ&search_field=name&search_value=${word}`
  ).then((resp) => resp.json());
};

const buttons = (movieobj) => {
  //this should be an array where each element has a structure like
  //
  // "word": "no",
  // "frequency": 28,
  // "score": "300",
  // "flags": "bc",
  // "syllables": "1"
  const movieTitle = document.createElement("li");
  const movieButton = document.createElement("button");
  movieButton.setAttribute('id', movieobj.imdb_id)
  movieButton.classList.add('btn')
  movieButton.classList.add('btn-info')
  movieButton.textContent = movieobj.name;
  movieButton.onclick = searchNetflix;
  movieTitle.appendChild(movieButton);
  return movieTitle;
};
//const id = movieResults
//const url = `https://unogs-unogs-v1.p.rapidapi.com/title/countries?netflix_id=${id}`;


const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '29d7775e9dmsh6de81f9703d0b05p17d24djsn5db8f0b69e63',
		'X-RapidAPI-Host': 'unogsng.p.rapidapi.com'
  }
}

let countries = []

const searchNetflix = (ev) => {

  let country_result = document.getElementById("movie-results")
  while (country_result.firstChild) {
    country_result.removeChild(country_result.firstChild)
  }
  
  countries = []
  const imdb_id = ev.target.id;
  console.log("search for", imdb_id);

  const url1 = `https://unogsng.p.rapidapi.com/title?imdbid=${imdb_id}`

  return fetch(url1, options).then((r) =>
    r.json()
  ).then((imdbResult)=> {
    console.log(imdbResult)
    try{
      let netflix_id = imdbResult.results[0].netflixid
      const url2 = `https://unogsng.p.rapidapi.com/titlecountries?netflixid=${netflix_id}`;

      return fetch(url2, options).then((j) =>
        j.json()
      ).then((netflixResult) => {
        console.log("netflix result", netflixResult)

        if (netflixResult.total == 0) {
          countries.push("Not on Netflix anywhere")
        } else {
          for (i = 0; i < netflixResult.results.length; i++) {
            countries.push(netflixResult.results[i].country)
          }
        }
        let list = document.getElementById("movie-results")
        let name = document.createElement('h1');
        name.innerText = ev.target.innerText;
        list.appendChild(name);
        list.append(name);
        for (var i = 0; i < countries.length; i++) {
        var listItem = document.createElement("li");
        listItem.innerText = countries[i];
        list.appendChild(listItem);
        
        }
      })
    }
    catch (e)
    {
      let list = document.getElementById("movie-results")
      let name = document.createElement('h1');
      name.innerText = ev.target.innerText;
      list.appendChild(name);
      list.append(name);
      let none = document.getElementById("movie-results");
      var listItem = document.createElement("li");
      listItem.innerText = "Not on Netflix anywhere"
      none.appendChild(listItem)
    }
  })
};
