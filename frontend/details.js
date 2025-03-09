document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    const type = params.get('type');

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

        document.getElementById('backButton').addEventListener('click', () => {
            window.history.back();
        });
});

