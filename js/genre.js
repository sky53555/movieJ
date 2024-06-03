const g_num_movie = 10; // 한 번에 보여줄 영화 개수
const movieContent = document.querySelector("#movieContent");
const mainDiv = document.querySelector(".main");
let allGenreResults = []; // 모든 검색 결과를 저장할 배열

// URL에서 파라미터 가져오기
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// DOMContentLoaded 이벤트 리스너
window.addEventListener("DOMContentLoaded", async function () {
  const genreName = getQueryParam("category");

  console.log(genreName);

  const genres = {
    romance: 10749,
    thriller: 53,
    fantasy: 14,
    drama: 18,
    // 필요 시 추가
  };

  const genreId = genres[genreName];
  console.log(genres);
  console.log(genres[genreName]);
  if (genreId) {
    document.getElementById("genre").innerText = genreName;
    try {
      const movies = await fetchMoviesByGenre(genreId);
      allGenreResults = movies; // 모든 결과를 저장
      displayGenreMovies(allGenreResults.slice(0, g_num_movie));
    } catch (error) {
      console.error("Error fetching movies by genre:", error);
    }
  }
});

// 장르별 영화 데이터를 가져오는 함수
async function fetchMoviesByGenre(genreId, page = 1) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=${genreId}&page=${page}&include_adult=false`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movies by genre");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 영화 리스트를 생성하고 표시하는 함수
function displayGenreMovies(results) {
  mainDiv.id = `movie-${results[0].id}`;
  mainDiv.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500/${results[0].poster_path}" alt="${results[0].title}" id="mainPoster">
        <h3 class="mainText">${results[0].title}</h3>
    `;

  movieContent.innerHTML = `
  <ul class="moviesWrap">
            ${results
              .slice(1)
              .map(
                (movie) => `
                <li id="movie-${movie.id}" data-id="${movie.id}">
                    <div class="imgWrap">
                        <img src="${
                          movie.poster_path !== null
                            ? "https://image.tmdb.org/t/p/w500/" +
                              movie.poster_path
                            : "../img/notfind.jpg"
                        }" alt="${movie.title}" id="moviePoster">
                    </div>
                    <div class="textWrap">
                        <div class="textTop">
                            <h2 id="movieName">${movie.title}</h2>
                            <span class="topIcon">
                                <i class="fa-solid fa-heart" onclick="toggleLike(this)"></i>
                            </span>
                            <div class="textDown">
                                <p><i class="fa-solid fa-star"></i><span id="rating">${movie.vote_average.toFixed(
                                  1
                                )}</span></p>
                            </div>
                        </div>
                    </div>
                </li>
            `
              )
              .join("")}
</ul>
        ${
          allGenreResults.length > g_num_movie
            ? '<div class="center"><button class="more">view more</button></div>'
            : ""
        }
    `;

  const moreButton = document.querySelector(".more");
  if (moreButton) {
    moreButton.addEventListener("click", () => {
      const currentCount = document.querySelectorAll(".movies li").length + 1;
      console.log(currentCount);
      const nextResults = allGenreResults.slice(
        currentCount,
        currentCount + g_num_movie
      );
      displayAdditionalGenreResults(nextResults);
    });
  }

  // 각 영화 li에 클릭 이벤트 리스너 추가

  mainDiv.addEventListener("click", () => {
    const movieId = mainDiv.id.split("-")[1]; // 클릭된 영화의 아이디 추출
    console.log("클릭된 영화 아이디:", movieId);
    window.location.href = `detail.html?id=${movieId}`;
  });
  const movieItems = document.querySelectorAll(".movies li");
  movieItems.forEach((item) => {
    item.addEventListener("click", () => {
      const movieId = item.id.split("-")[1]; // 클릭된 영화의 아이디 추출
      console.log("클릭된 영화 아이디:", movieId);
      window.location.href = `detail.html?id=${movieId}`;
    });
  });
}

// 추가 영화 결과를 표시하는 함수
function displayAdditionalGenreResults(results) {
  const ulElement = document.querySelector(".moviesWrap");
  ulElement.innerHTML += results
    .map(
      (movie) => `
      <li id="movie-${movie.id}" data-id="${movie.id}">
          <div class="imgWrap">
              <img src="https://image.tmdb.org/t/p/w500/${
                movie.poster_path
              }" alt="${movie.title}" id="moviePoster">
          </div>
          <div class="textWrap">
              <div class="textTop">
                  <h2 id="movieName">${movie.title}</h2>
                  <span class="topIcon"><i class="fa-solid fa-heart" onclick="toggleLike(this)"></i></span>
                  <div class="textDown">
                      <p><i class="fa-solid fa-star"></i><span id="rating">${movie.vote_average.toFixed(
                        1
                      )}</span></p>
                  </div>
              </div>
          </div>
      </li>
      `
    )
    .join("");

  if (
    document.querySelectorAll(".movies li").length >= allGenreResults.length
  ) {
    document.querySelector(".more").style.display = "none";
  }

  // 각 영화 li에 클릭 이벤트 리스너 추가
  const movieItems = document.querySelectorAll(".movies li");
  movieItems.forEach((item) => {
    item.addEventListener("click", () => {
      const movieId = item.id.split("-")[1]; // 클릭된 영화의 아이디 추출
      console.log("클릭된 영화 아이디:", movieId);
      window.location.href = `detail.html?id=${movieId}`;
    });
  });
}
