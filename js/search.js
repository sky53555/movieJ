const API_KEY = "5d3926ca1e71ba7d5ae9204ab7d2ea6a";
let num_movie = 8; // 한 번에 보여줄 영화 개수
const searchResult = document.querySelector("#searchResult");
let searchForm = document.querySelector(".search");
let searchInput = document.querySelector(".searchTex");
let allResults = []; // 모든 검색 결과를 저장할 배열

//인덱스 일때
const korea = document.querySelector("#section1");
const abroad = document.querySelector("#section2");
const swiperContainer = document.querySelector(".swiper-container");
const swiperSlides = document.querySelectorAll(".swiper-slide");

//sub일때

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // 폼의 기본 동작 방지

  const query = searchInput.value.trim(); // 검색어 가져오기
  if (query === "") {
    alert("검색어를 입력하세요.");
    return;
  }

  // 이전 검색 결과 초기화
  searchResult.innerHTML = "";
  allResults = [];

  // 영화 검색 함수 호출
  const searchResults = await searchMovies(query);

  // 모든 결과를 저장
  allResults = searchResults;

  // 검색 결과 표시
  displaySearchResults(allResults.slice(0, num_movie), query);

  searchInput.value = "";
});

// 검색어로 검색하기
async function searchMovies(query, page = 1) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(
        query
      )}&page=${page}&include_adult=false`
    );
    if (!response.ok) {
      throw new Error("Failed to search movies");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
    return [];
  }
}

function noresult(results, query) {
  // 검색 결과가 없는 경우
  if (results.length === 0) {
    searchResult.innerHTML = `<h2 id="result">검색어 : "${query}"</h2><p>검색 결과가 없습니다.</p>`;
    return;
  }
}

// 검색 결과 보여주기
function displaySearchResults(results, query) {
  if (results.length === 0) {
    noresult(results, query);
    return;
  }

  searchResult.innerHTML = `
    <h2 id="result">검색 결과 : "${query}"</h2>
   <p class="total_num">총 : ${allResults.length}개</p>
    <ul class="movies">
      ${results
        .map(
          (movie) => `
          <li id = "movie-${movie.id}" data-id="${movie.id}"> 
          <div class="imgWrap">
          <img src="${
            movie.poster_path !== null
              ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path
              : "../img/notfind.jpg"
          }" alt="${movie.title}" id="moviePoster">
          </div>
          <div class="textWrap">
            <div class="textTop">
              <div id="movieCon">
              <h2 id="movieName">${movie.title}</h2>
              <span class="topIcon">
              <i class="fa-solid fa-heart" onclick="toggleLike(this)"></i>
              </span>
              </div>
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
      allResults.length > num_movie
        ? '<div class="center"><button class="more">view more</button></div>'
        : ""
    }
  `;

  const moreButton = document.querySelector(".more");
  if (moreButton) {
    moreButton.addEventListener("click", () => {
      const currentCount = document.querySelectorAll(".movies li").length;
      const nextResults = allResults.slice(
        currentCount,
        currentCount + num_movie
      );
      displayAdditionalResults(nextResults);
    });
  }
  if (swiperContainer || korea || abroad) {
    swiperContainer.style.display = "none";
    korea.style.display = "none";
    abroad.style.display = "none";
  }
}

function displayAdditionalResults(results) {
  const ulElement = document.querySelector(".movies");
  ulElement.innerHTML += results
    .map(
      (movie) => `
    <li id="movie-${movie.id}" data-id="${movie.id}">
      <div class="imgWrap">
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${
        movie.title
      }" id="moviePoster">
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

  if (document.querySelectorAll(".movies li").length >= allResults.length) {
    document.querySelector(".more").style.display = "none";
  }
}

////////////

// 최신 영화 정보를 가져오는 함수
async function fetchLatestMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch latest movies");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 슬라이드 업데이트 함수
async function updateSwiperSlides() {
  const movies = await fetchLatestMovies();
  movies.forEach((movie, index) => {
    if (index < swiperSlides.length) {
      const slide = swiperSlides[index];
      slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
      slide.id = `movie-${movie.id}`;
      const title = slide.querySelector("h2");
      if (title) {
        title.textContent = movie.title;
      }
    }
  });
}

// 업데이트 함수 호출
updateSwiperSlides();
