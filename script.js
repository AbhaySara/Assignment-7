const moviesUrl = 'http://localhost:3000/movies';
const favouritesUrl = 'http://localhost:3000/favourites';

/* Fetch Movies */
function getMovies() {

    return fetch(moviesUrl)
        .then((response) => response.json())
        .then((movies) => {

            const moviesList = document.getElementById('moviesList');

            moviesList.innerHTML = '';

            movies.forEach((movie) => {

                const li = document.createElement('li');

                li.className = 'list-group-item movie-card';

                li.innerHTML = `
                    <div class="d-flex align-items-center justify-content-between">

                        <div class="d-flex align-items-center">

                            <img
                                src="${movie.posterPath}"
                                alt="${movie.title}"
                                class="movie-image me-3"
                            />

                            <div>
                                <h5>${movie.title}</h5>

                                <a
                                    href="${movie.trailer}"
                                    target="_blank"
                                    class="btn btn-sm btn-dark mt-2"
                                >
                                    Watch Trailer
                                </a>
                            </div>

                        </div>

                        <button
                            class="btn btn-primary"
                            id="btn-${movie.id}"
                            onclick="addFavourite(${movie.id})"
                        >
                            Add to Favourites
                        </button>

                    </div>
                `;

                moviesList.appendChild(li);

            });

            return movies;

        })
        .catch((error) => console.log(error));

}

/* Fetch Favourites */
function getFavourites() {

    return fetch(favouritesUrl)
        .then((response) => response.json())
        .then((favourites) => {

            const favouritesList =
                document.getElementById('favouritesList');

            favouritesList.innerHTML = '';

            favourites.forEach((movie) => {

                const li = document.createElement('li');

                li.className = 'list-group-item movie-card';

                li.innerHTML = `
                    <div class="d-flex align-items-center justify-content-between">

                        <div class="d-flex align-items-center">

                            <img
                                src="${movie.posterPath}"
                                alt="${movie.title}"
                                class="movie-image me-3"
                            />

                            <div>
                                <h5>${movie.title}</h5>

                                <a
                                    href="${movie.trailer}"
                                    target="_blank"
                                    class="btn btn-sm btn-dark mt-2"
                                >
                                    Watch Trailer
                                </a>
                            </div>

                        </div>

                        <button
                            class="btn btn-danger"
                            onclick="removeFavourite(${movie.id})"
                        >
                            Remove
                        </button>

                    </div>
                `;

                favouritesList.appendChild(li);

                /* Disable button if already favourite */
                const button = document.getElementById(`btn-${movie.id}`);

                if (button) {
                    button.disabled = true;
                    button.innerText = 'Added';
                    button.classList.remove('btn-primary');
                    button.classList.add('btn-success');
                }

            });

            return favourites;

        })
        .catch((error) => console.log(error));

}

/* Add Favourite */
function addFavourite(id) {

    return fetch(favouritesUrl)
        .then((response) => response.json())
        .then((favourites) => {

            const alreadyAdded = favourites.find(
                (movie) => movie.id === id
            );

            if (alreadyAdded) {
                alert('Movie already added!');
                return favourites;
            }

            return fetch(`${moviesUrl}/${id}`)
                .then((response) => response.json())
                .then((movie) => {

                    return fetch(favouritesUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(movie)
                    });

                })
                .then((response) => response.json())
                .then(() => {

                    return getFavourites();

                });

        })
        .catch((error) => console.log(error));

}

/* Remove Favourite */
function removeFavourite(id) {

    const confirmDelete = confirm(
        'Are you sure you want to remove this movie from favourites?'
    );

    if (!confirmDelete) {
        return;
    }

    return fetch(`${favouritesUrl}/${id}`, {
        method: 'DELETE'
    })
        .then(() => {

            /* Enable Add Button Again */
            const button = document.getElementById(`btn-${id}`);

            if (button) {
                button.disabled = false;
                button.innerText = 'Add to Favourites';
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
            }

            return getFavourites();

        })
        .catch((error) => console.log(error));

}