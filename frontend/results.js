document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');
    const with_genres = params.get('with_genres');
    const type = params.get('type');

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

                    const movieReleaseDate = document.createElement('p');
                    movieReleaseDate.textContent = `Release Date: ${movie.release_date || movie.first_air_date}`;

                    const movieReviews = document.createElement('p');
                    movieReviews.textContent = `Reviews: ${movie.vote_average} (${movie.vote_count} votes)`;

                    const detailsLink = document.createElement('a');
                    detailsLink.href = '#';
                    detailsLink.textContent = 'Details';
                    detailsLink.addEventListener('click', () => {
                        openDetailsPage(movie.id, movie.media_type || type);
                    });

                    movieDetails.appendChild(movieTitle);
                    movieDetails.appendChild(movieReleaseDate);
                    movieDetails.appendChild(movieReviews);
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
        document.getElementById('backButton').addEventListener('click', () => {
            window.history.back();
        });
});

function openDetailsPage(movieId, type) {
    window.location.href = `details.html?id=${movieId}&type=${type}`;
}
