let resultElement = document.querySelector("#movies");
let APIData = [];

const changeTitle = titleValue => {
  document.getElementById("page-title").innerHTML = titleValue;
};

function RatingStarHtmlElement(ratingValue) {
  let ratingCounter = [0, 0, 0];
  let totalRatingCount = ratingValue;
  ratingCounter[0] = Math.floor(totalRatingCount % 5);
  ratingCounter[1] = Math.round(totalRatingCount % 1);
  ratingCounter[2] = 5 - ratingCounter[0] - ratingCounter[1];

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

// mapping response to respective HTML elements
renderHtml = responseData => {
  return `<ul class="movie-list" id="movielist">
  <li class="movie" id="${responseData._id}">
      <div class="column-left">
          <img class="movie-poster" src="${responseData.poster}"
              alt="${responseData.title || "Movie poster"}">
      </div>
      <div class="column-right">
          <h2 class="movie-title">${responseData.title || "Untitled"}</h2>
          <div><p class="movie-rating">${responseData.language ||
            "Unknown"} | ${RatingStarHtmlElement(responseData.rating)}</p>
          <p class="movie-language"></p><div>
          <p class="movie-duration"><i class="fas fa-hourglass-start"></i> ${responseData.duration ||
            "Unknown"} minutes</p>
      </div>
  </li>
  </ul>`;
};

const displayListView = apiData => {
  changeTitle("Latest Movies");
  resultElement.innerHTML = apiData.map(data => renderHtml(data)).join("\n");
  let thumbnails = document.querySelectorAll("#movielist > li");
  thumbnails.forEach(function(thumbnail) {
    thumbnail.addEventListener("click", function() {
      // Set clicked image as display image.
      NavDetailview(thumbnail.id);
    });
  });
};

const NavDetailview = id => {
  let movieDetails = APIData.find(function(element) {
    return element._id === id;
  });

  changeTitle(movieDetails.title);

  resultElement.innerHTML = `<div class="movie-details-tcontainer" id="moviedetailscontainer">
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
            <div class="movie-duration" id="movieduration"><span class="genre-detail" id="genredetail">Duration
                    :</span>${
                      movieDetails.duration
                    }<i class="fa fa-hourglass-half movie-duration-time" id="moviedurationtime"
                    aria-hidden="true"></i></div>
            <div class="movie-rating" id="movierating">
            <p>${RatingStarHtmlElement(movieDetails.rating)}</p>
                       </div>
            <div class="movie-details-session">
                    ${movieDetails.sessions
                      .map(session => {
                        return (
                          session.cinema.state +
                          " - " +
                          session.cinema.location +
                          "<br>" +
                          createSessionhtml(session.sessionDateTime)
                        );
                      })
                      .join("\n")}
                      </div>
        </div>
    </div>
  </div>
  <div class="movie-details-story-container" id="moviedetailsstorycontainer">
    <div class="movie-details-story" id="moviedetailsstory">
        <div class="movie-details-title"> ${movieDetails.title}</div>
        <div class="movie-detailed-script" id="moviedetailedscript">
            <p>${movieDetails.synopsis}</p>
        </div>
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
                ${movieDetails.crew.director},</li>
            <li class="movie-crew-name" id="moviecrewname"><span class="genre-detail" id="genredetail">Music-Director
                    :</span>
                ${movieDetails.crew.musicDirector}</li>
        </ul>
    </div>
    <div class="movie-details-booking" id="moviedetailsbooking">
        <button class="movie-book-btn"><i class="fa fa-ticket movie-ticket" id="movieticket" aria-hidden="true"></i>Book
            now</button>
        <button id='detailsBackBtn' class="movie-back-btn"><i class="fa fa-undo previous-page" id="previouspage" aria-hidden="true"></i>Back</button>
    </div>
  </div>`;
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
      dateTimeHtmlElement +=
        '<i class="fa fa-calendar movie-session-calendar" id="${movieDetails._id}" aria-hidden="true"></i> ' +
        date +
        ' : <i class="far fa-clock movie-session-clock" id="${movieDetails._id}" aria-hidden="true"></i> ';
      dateTimeHtmlElement += sessionObj[date];

      dateTimeHtmlElement += "<br>";
    });

    return dateTimeHtmlElement;
  }

  function createSessionhtml(sessionDateTimes) {
    let sessionObj = {};

    sessionDateTimes.forEach(sessionDateTime => {
      const date = convertDate(sessionDateTime);
      const time = timeAMPMConversion(sessionDateTime);

      if (!sessionObj[date]) sessionObj[date] = "";
      sessionObj[date] += time + ", " || "";
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

  let backBtn = document.querySelector("#detailsBackBtn");
  backBtn.addEventListener("click", function() {
    displayListView(APIData);
  });
};

// Calling the movie result api

const xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.onreadystatechange = () => {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    APIData = xhr.response.content;
    // function call to process api result
    displayListView(APIData);
  }
};
// url to call api
xhr.open(
  "GET",
  "https://salty-sea-40504.herokuapp.com/api/v1/movies/getSessions"
);
xhr.send();
