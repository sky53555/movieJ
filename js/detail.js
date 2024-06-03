document.addEventListener("DOMContentLoaded", function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const movieId = urlParams.get("id");

  if (movieId) {
    viewMovie(movieId);
  } else {
    console.error("영화 ID가 없습니다.");
  }
});

async function viewMovie(movieId) {
  try {
    // 영화 정보 가져오기
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
    );
    const movieData = await movieResponse.json();
    console.log("영화 정보:", movieData);

    // 크레딧 정보 가져오기
    const creditsResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`
    );
    const creditsData = await creditsResponse.json();
    console.log("크레딧 정보:", creditsData);

    // 트레일러 정보 가져오기
    const trailerResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    const trailerData = await trailerResponse.json();

    // 영화 정보와 크레딧 정보를 화면에 표시하는 등의 작업 수행
    displayMovieDetails(movieData);
    displayCredits(creditsData);
    displayMovieTrailers(trailerData);
  } catch (error) {
    console.error("에러 발생:", error);
  }
}

const movieDetails = {
  movieName: "title",
  rating: "vote_average",
  release: "release_date",
  duration: "runtime",
  introduction: "overview",
};

async function displayMovieDetails(movieData) {
  // 각 정보를 표시하는 반복문
  for (const key in movieDetails) {
    if (movieDetails.hasOwnProperty(key)) {
      const element = movieDetails[key];
      const spanElement = document.getElementById(key);
      if (movieData[element]) {
        spanElement.textContent = movieData[element];
      } else {
        spanElement.textContent = "정보 없음";
      }
    }
  }

  // 영화 포스터 표시
  const poster = document.getElementById("poster");
  poster.style.backgroundImage = `url("https://image.tmdb.org/t/p/w500/${movieData.poster_path}")`;

  // 영화 포스터 중간에 영상
}

async function displayCredits(creditsData) {
  // 크레딧 정보 표시 - 감독
  const directorElement = document.getElementById("director");
  const director = creditsData.crew.find((member) => member.job === "Director");
  directorElement.textContent = director ? director.name : "정보 없음";

  // 출연자 목록 표시 - 최대 5명
  const castWrap = document.getElementById("castWrap");
  const numToShow = 5; // 표시할 출연자 수
  const castList = creditsData.cast.slice(0, numToShow); // 처음부터 numToShow 개수만큼의 출연자만 추출
  castList.forEach((actor) => {
    const cast = document.createElement("div");
    cast.classList.add("castMem");
    cast.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500/${actor.profile_path}" alt="">
                <p class="castName">${actor.name}</p>
        `;
    castWrap.appendChild(cast);
  });
}
async function displayMovieTrailers(trailerData) {
  console.log(trailerData);
  const trailers = document.getElementById("trailers");

  const numToShow = 3;
  const trailerList = trailerData.results
    .filter(
      (trailer) => trailer.site === "YouTube" && trailer.type === "Trailer"
    )
    .slice(0, numToShow);

  trailerList.forEach((trailer, idx) => {
    if (idx === 0) {
      // 첫 번째 동영상을 poster에 추가
      const videoKey = trailer.key;
      const poster = document.getElementById("poster");
      poster.innerHTML = `<iframe width="600" height="315" src="https://www.youtube.com/embed/${videoKey}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      // 나머지 동영상은 trailerElement에 추가
      const trailerElement = document.createElement("div");
      const videoKey = trailer.key;
      trailerElement.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoKey}" frameborder="0" allowfullscreen></iframe>`;
      trailers.appendChild(trailerElement);
    }
  });
}

//crew.job = "Director"
//cast.name  , profile_path
