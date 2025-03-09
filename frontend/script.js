const genreMap = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    science_fiction: 878,
    tv_movie: 10770,
    thriller: 53,
    war: 10752,
    western: 37
};
var swiper = new Swiper(".home", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      
    },
   
  });
  var swiper = new Swiper(".coming-container", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
  document.getElementById('search-button').addEventListener('click', function () {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const type = document.getElementById('type').value;

    // Ensure there's input
    if (!searchInput.trim()) {
        alert('Please enter a movie or TV show name or genre.');
        return;
    }

    // Map genre to genreId if exists
    const genreId = genreMap[searchInput];
    const query = genreId ? `with_genres=${genreId}` : `query=${encodeURIComponent(searchInput)}`;
    
    // Redirect to results.html with the query parameters
    window.location.href = `results.html?${query}&type=${encodeURIComponent(type)}`;
});


function openDetailsPage(movieId, type) {
    window.location.href = `details.html?id=${movieId}&type=${type}`;
}

const params = new URLSearchParams(window.location.search);
const query = params.get('query');
const with_genres = params.get('with_genres');
const type = params.get('type');

if (window.location.pathname.endsWith('results.html')) {
    fetch(`http://localhost:5001/search?${with_genres ? 'with_genres=' + with_genres : 'query=' + query}&type=${type}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results-container');
            if (data.results && data.results.length > 0) {
                data.results.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.className = 'movie-card';

                    const moviePoster = document.createElement('img');
                    moviePoster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

                    const movieDetails = document.createElement('div');
                    movieDetails.className = 'movie-details';

                    const movieTitle = document.createElement('h2');
                    movieTitle.textContent = movie.title || movie.name;

                    const detailsLink = document.createElement('a');
                    detailsLink.href = '#';
                    detailsLink.textContent = 'Details';
                    detailsLink.addEventListener('click', () => {
                        openDetailsPage(movie.id, movie.media_type || type);
                    });

                    movieDetails.appendChild(movieTitle);
                    movieDetails.appendChild(detailsLink);

                    movieCard.appendChild(moviePoster);
                    movieCard.appendChild(movieDetails);

                    resultsContainer.appendChild(movieCard);
                });
            } else {
                resultsContainer.textContent = 'No results found.';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('results-container').textContent = 'Error fetching data.';
        });
}

if (window.location.pathname.endsWith('details.html')) {
    const movieId = params.get('id');

    fetch(`https://api.themoviedb.org/3/${type}/${movieId}?api_key=db38a5d763b88ba86b2b735f9eb241cd&language=en-US`)
        .then(response => response.json())
        .then(data => {
            const detailsContainer = document.getElementById('details-container');

            const moviePoster = document.createElement('img');
            moviePoster.src = `https://image.tmdb.org/t/p/w300${data.poster_path}`;

            const movieTitle = document.createElement('h2');
            movieTitle.textContent = data.title || data.name;

            const movieDescription = document.createElement('p');
            movieDescription.textContent = data.overview;

            const movieCast = document.createElement('p');
            movieCast.textContent = 'Cast: ';

            fetch(`https://api.themoviedb.org/3/${type}/${movieId}/credits?api_key=db38a5d763b88ba86b2b735f9eb241cd&language=en-US`)
                .then(response => response.json())
                .then(credits => {
                    credits.cast.slice(0, 5).forEach(castMember => {
                        const castName = document.createElement('span');
                        castName.textContent = `${castMember.name}, `;
                        movieCast.appendChild(castName);
                    });
                });

            detailsContainer.appendChild(moviePoster);
            detailsContainer.appendChild(movieTitle);
            detailsContainer.appendChild(movieDescription);
            detailsContainer.appendChild(movieCast);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('details-container').textContent = 'Error fetching data.';
        });
}


document.addEventListener('DOMContentLoaded', function () {
    const apiKey = 'db38a5d763b88ba86b2b735f9eb241cd';

    // Fetch and display featured movies
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
        .then(response => response.json())
        .then(data => {
            const featuredMoviesContainer = document.getElementById('featured-movies');
            data.results.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.className = 'movie-card';
                movieCard.addEventListener('click', () => {
                    openDetailsPage(movie.id, 'movie');
                });

                const moviePoster = document.createElement('img');
                moviePoster.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;

                const movieTitle = document.createElement('h3');
                movieTitle.textContent = movie.title;

                movieCard.appendChild(moviePoster);
                movieCard.appendChild(movieTitle);

                featuredMoviesContainer.appendChild(movieCard);
            });
        })
        .catch(error => {
            console.error('Error fetching featured movies:', error);
        });

});

function openDetailsPage(movieId, type) {
    window.location.href = `details.html?id=${movieId}&type=${type}`;
}
