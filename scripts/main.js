let moviesList = document.querySelector("#movies");
let APIData = [];

const renderMovieList = apiData => {
  changeTitle("Ozziewood Movies");
  backButton.style.display = "none";
  moviesList.innerHTML = apiData
    .map(data => movieItemTemplate(data))
    .join("\n");

  let movies = document.querySelectorAll("#movielist > .movie");
  movies.forEach(movie => {
    movie.addEventListener("click", () => renderMovieDetails(movie.id));
  });
};
// Calling the movie result api
const callApi = (API_URL, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      APIData = xhr.response.content;
      callback(APIData);
    }
  };
  xhr.open("GET", API_URL);
  xhr.send();
};

callApi(
  "https://salty-sea-40504.herokuapp.com/api/v1/movies/getSessions",
  renderMovieList
);

const changeTitle = title => {
  document.getElementById("page-title").innerHTML = title;
};

let backButton = document.querySelector("#backButton");
backButton.addEventListener("click", function() {
  renderMovieList(APIData);
});

function ratingStarTemplate(ratingCounter) {
  return `
  ${'<i class="fas fa-star movie-star-rating"  aria-hidden=" true"></i>'.repeat(
    ratingCounter[0]
  )}
  ${'<i class="fas fa-star-half-alt movie-star-rating" aria-hidden=" true"></i>'.repeat(
    ratingCounter[1]
  )}
  ${'<i class="far fa-star movie-star-rating"  aria-hidden=" true"></i>'.repeat(
    ratingCounter[2]
  )}`;
}

function ratingStarCalulation(ratingValue) {
  let ratingCounter = [0, 0, 0];
  let totalRatingCount = ratingValue;
  ratingCounter[0] = Math.floor(totalRatingCount % 5);
  ratingCounter[1] = Math.round(totalRatingCount % 1);
  ratingCounter[2] = 5 - ratingCounter[0] - ratingCounter[1];
  return ratingStarTemplate(ratingCounter);
}

const movieItemTemplate = movie => {
  return `<ul class="movie-list" id="movielist">
  <li class="movie" id="${movie._id}">
      <div class="column-left">
          <img class="movie-poster" src="${movie.poster}"
              alt="${movie.title || "Movie poster"}">
      </div>
      <div class="column-right">
          <h2 class="movie-title">${movie.title || "Untitled"}</h2>
          <div><p class="movie-rating">${movie.language ||
            "Unknown"} | ${ratingStarCalulation(movie.rating)}</p>
          <p class="movie-language"></p><div>
          <p class="movie-duration"><i class="fas fa-hourglass-start"></i> ${movie.duration ||
            "Unknown"} minutes</p>
      </div>
  </li>
  </ul>`;
};

const renderMovieDetails = id => {
  let movieDetails = APIData.find(element => element._id === id);

  changeTitle(movieDetails.title);
  backButton.style.display = "contents";

  moviesList.innerHTML = `    <div class="movie-details" id="moviedetails">
  <div class="movie-details-tcontainer" id="moviedetailscontainer">
      <div class="movie-details-trailer" id="moviedetailstrailer">
          <iframe class="movie-trailer" id="${
            movieDetails._id
          }" src="https://www.youtube.com/embed/${
    movieDetails.trailer.split("=")[1]
  }"
frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
      <div class="movie-details-info" id="moviedetailsinfo">
          <div class="movie-info-list" id="movieinfolist">
              <div class="movie-genre" id="moviegenre"><span class="genre-detail" id="genredetail">Genre :</span>
                  ${movieDetails.genres}</div>
              <div class="movie-detail-duration" id="moviedetailduration"><span class="genre-detail" id="genredetail">Duration
                      :</span> ${
                        movieDetails.duration
                      } <i class="fa fa-hourglass-half movie-duration-time" id="moviedurationtime"
                      aria-hidden="true"></i></div>
              <div class="movie-detail-rating" id="moviedetailrating">
                   ${ratingStarCalulation(movieDetails.rating)}
              </div>
          </div>
      </div>
      <div class="tab" id="tab">
          <button class="movie-name" id="moviename">${movieDetails.title ||
            "Unknown"}</button>
          <button class="movie-session-off" id="moviesession">Sessions</button>
      </div>
      <div class="movie-details-story-container" id="moviedetailsstorycontainer">
          <div class="movie-details-story" id="moviedetailsstory">
              <div class="movie-details-title">${movieDetails.title ||
                "Unknown"}</div>
              <div class="movie-detailed-script" id="moviedetailedscript">${
                movieDetails.synopsis
              }</div>
              <div class="movie-details-title"><i class="fa fa-users movie-cast" id="moviecast" aria-hidden="true"></i>Starring</div>
              <ul class="movie-cast-list" id="moviecastlist">
              ${movieDetails.leadActors
                .join(",")
                .split(",")
                .map(leadActor => {
                  return '<li class="movie-cast-name" id="">' + leadActor;
                })
                .join(",</li>\n") + ".</li>"}
               </ul>
              <div class="movie-crew">Crew</div>
              <ul class="movie-crew-list" id="moviecrewlist">
                  <li class="movie-crew-name" id="moviecrewname"><span class="genre-detail" id="genredetail">Director
                          :</span>
                      ${movieDetails.crew.director}</li>
                  <li class="movie-crew-name" id="moviecrewname"><span class="genre-detail" id="genredetail">Music-Director
                          :</span>
                      ${movieDetails.crew.musicDirector}</li>
              </ul>

          </div>
          <div class="movie-details-session-off" id = "moviedetailssession">
             ${movieDetails.sessions
               .map(session => {
                 return `${session.cinema.state} - ${
                   session.cinema.location
                 } <div class="movie-details-booking" id="moviedetailsbooking">
                 <button class="movie-book-btn"><i class="fas fa-ticket-alt movie-ticket" id="movieticket"
                         aria-hidden="true"></i>Book now</button>
             </div><br>
                   ${renderSessionDetails(session.sessionDateTime)}<br>
                    `;
               })
               .join("\n")}

          </div>
      </div>
  </div>
</div>`;

  let sessionDivElement = document.querySelector("#moviedetailssession");
  let MovieDetailsDivElement = document.querySelector("#moviedetailsstory");
  let MovieSessionsBtn = document.querySelector("#moviesession");
  MovieSessionsBtn.addEventListener("click", function() {
    sessionDivElement.classList.add("movie-details-session");
    MovieSessionsBtn.classList.add("movie-session");
    MovieSessionsBtn.classList.remove("movie-session-off");
    sessionDivElement.classList.remove("movie-details-session-off");
    MovieNameBtn.classList.add("movie-name-off");
    MovieDetailsDivElement.classList.add("movie-details-story-off");
    MovieNameBtn.classList.remove("movie-name");
    MovieDetailsDivElement.classList.remove("movie-details-story");
  });
  let MovieNameBtn = document.querySelector("#moviename");
  MovieNameBtn.addEventListener("click", function() {
    sessionDivElement.classList.remove("movie-details-session");
    MovieSessionsBtn.classList.remove("movie-session");
    MovieSessionsBtn.classList.add("movie-session-off");
    sessionDivElement.classList.add("movie-details-session-off");
    MovieNameBtn.classList.remove("movie-name-off");
    MovieDetailsDivElement.classList.remove("movie-details-story-off");
    MovieNameBtn.classList.add("movie-name");
    MovieDetailsDivElement.classList.add("movie-details-story");
  });

  function convertDate(dateTime) {
    return dateTime
      .split("T")[0]
      .split("-")
      .reverse()
      .join("-");
  }

  function sessionDateTimeTemplate(sessionObj) {
    let dateTimeHtmlElement = "";
    Object.keys(sessionObj).forEach(date => {
      dateTimeHtmlElement += `<i class="fa fa-calendar movie-session-calendar" id="" aria-hidden="true"></i> ${date} : <i class="far fa-clock movie-session-clock" id="" aria-hidden="true"></i>
       ${sessionObj[date]} <br>`;
    });

    return dateTimeHtmlElement;
  }

  function renderSessionDetails(sessionDateTimes) {
    let sessionObj = {};

    sessionDateTimes.forEach(sessionDateTime => {
      const date = convertDate(sessionDateTime);
      const time = timeAMPMConversion(sessionDateTime);

      if (!sessionObj[date]) sessionObj[date] = "";
      if (!!sessionObj[date]) sessionObj[date] = sessionObj[date] + ", ";
      sessionObj[date] += time || "";
    });

    return sessionDateTimeTemplate(sessionObj);
  }

  function timeAMPMConversion(DatetimeValue) {
    let timeValue = DatetimeValue.split("T")[1].split(":")[0];
    if (timeValue > 12) {
      return `${timeValue - 12}:${
        DatetimeValue.split("T")[1].split(":")[1]
      } PM`;
    } else {
      return `${timeValue}:${DatetimeValue.split("T")[1].split(":")[1]} AM`;
    }
  }
};
