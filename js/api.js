
const g_num_movie = 8; // 한 번에 가져올 영화 개수

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const [famousMovies, comingMovies] = await Promise.all([
      fetchMovies("popular"),
      fetchMovies("upcoming"),
    ]);
    displayMovies(famousMovies, "famousMovies");
    displayMovies(comingMovies, "comingMovies");
    initSwipers();
  } catch (error) {
    console.error("Error fetching movies", error);
  }
});

async function fetchMovies(type) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${type}?api_key=${API_KEY}&language=ko-KR`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const data = await response.json();
    return data.results.slice(0, g_num_movie); // 8개의 결과만 반환
  } catch (error) {
    console.error(error);
    return [];
  }
}

function displayMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID ${containerId} not found`);
    return;
  }

  container.innerHTML = movies
    .map(
      (movie) => `
      <li class="swiper-slide" id="movie-${movie.id}">
        <div class="imgWrap">
          <img src="https://image.tmdb.org/t/p/w500/${
            movie.poster_path !== null
              ? movie.poster_path
              : "../img/notfind.jpg"
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
}

function initSwipers() {
  new Swiper(".famous-movies", {
    slidesPerView: 4,
    spaceBetween: 10,
    navigation: {
      nextEl: "#section1 .next-btn",
      prevEl: "#section1 .prev-btn",
    },
  });

  new Swiper(".coming-movies", {
    slidesPerView: 4,
    spaceBetween: 10,
    navigation: {
      nextEl: "#section2 .next-btn",
      prevEl: "#section2 .prev-btn",
    },
  });
}
