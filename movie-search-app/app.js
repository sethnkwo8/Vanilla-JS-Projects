document.addEventListener('DOMContentLoaded', () => {
    const APIKey = '92cb96b17b6ea594ade0b3fe45b93e78';
    const movieSearchInput = document.querySelector('#movieSearchInput');

    // Change search bar font to black when typing
    movieSearchInput.addEventListener('input', (e) => {
        movieSearchInput.classList.remove('text-gray-300', 'italic');
        movieSearchInput.classList.add('text-black');

        // Return font back to gray when search is cleared
        if (e.target.value === '') {
            movieSearchInput.classList.add('text-gray-300', 'italic');
            movieSearchInput.classList.remove('text-black');
        }
    });

    // Display Trending results
    const trending = document.querySelector('#trending');
    const trendingTvShowsBtn = document.querySelector('#trendingTvShowsBtn');
    const trendingMoviesBtn = document.querySelector('#trendingMoviesBtn');
    loadTrending();

    // Function to fetch trending movies and tv shows
    async function fetchTrending(apikey, type) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/trending/${type}/day?api_key=${apikey}`);
            if (!response.ok) {
                throw new Error('Error fetching data'); // Error if fault in response
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            return null
        }
    }

    // Function to add trending movies and tv shows
    function loadTrending() {
        trending.innerHTML = '';

        // Display trending movies when movies button is clicked
        trendingMoviesBtn.addEventListener('click', async function () {
            this.focus();
            trending.innerHTML = '';
            const data = await fetchTrending(APIKey, this.dataset.type);

            data.results.slice(0, 10).forEach(result => {
                const movieCard = document.createElement('div');
                movieCard.innerHTML = `
                <a class='movie-card' href='#'>
                    <div>
                        <img src='https://image.tmdb.org/t/p/w500/${result.poster_path}' alt='${result.title}'>
                    </div>
                    <div>
                        <p><span class='font-bold text-xl'>${result.title}</span>  . <span class='text-sm'>${result.release_date}</span></p>
                    </div>
                </a>`;
                trending.append(movieCard);
            });
        })

        // Display trending tv shows whentv shows button is clicked
        trendingTvShowsBtn.addEventListener('click', async function () {
            this.focus();
            trending.innerHTML = '';
            const data = await fetchTrending(APIKey, this.dataset.type);

            data.results.slice(0, 10).forEach(result => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                <div>
                    <img src='https://image.tmdb.org/t/p/w500/${result.poster_path}' alt='${result.name}'>
                </div>
                <div>
                    <p><span class='font-bold text-xl'>${result.name}</span>  . <span class='text-sm'>${result.first_air_date}</span></p>
                </div>`;
                trending.append(movieCard);
            });
        })

        // Trending movies displayed by default
        trendingMoviesBtn.click();
    }

    // Display Top rated results
    const topRated = document.querySelector('#topRated');
    const topRatedTvShowsBtn = document.querySelector('#topRatedTvShowsBtn');
    const topRatedMoviesBtn = document.querySelector('#topRatedMoviesBtn');
    loadTopRated();

    // Function to fetch top rated movies and tv shows
    async function fetchTopRated(apikey, type) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/${type}/popular?api_key=${apikey}`);
            if (!response.ok) {
                throw new Error('Error fetching data'); // Error if fault in response
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            return null
        }
    }

    // Function to add top rated movies and tv shows
    function loadTopRated() {
        topRated.innerHTML = '';

        // Display top rated movies when movies button is clicked
        topRatedMoviesBtn.addEventListener('click', async function () {
            this.focus();
            topRated.innerHTML = '';
            const data = await fetchTopRated(APIKey, this.dataset.type);

            data.results.slice(0, 10).forEach(result => {
                const movieCard = document.createElement('div');
                movieCard.innerHTML = `
                <a class='movie-card' href='#'>
                    <div>
                        <img src='https://image.tmdb.org/t/p/w500/${result.poster_path}' alt='${result.title}'>
                    </div>
                    <div>
                        <p><span class='font-bold text-xl'>${result.original_title}</span>  . <span class='text-sm'>${result.release_date}</span></p>
                    </div>
                </a>`;
                topRated.append(movieCard);
            });
        })

        // Display top rated tv shows when tv shows button is clicked
        topRatedTvShowsBtn.addEventListener('click', async function () {
            this.focus();
            topRated.innerHTML = '';
            const data = await fetchTopRated(APIKey, this.dataset.type);

            data.results.slice(0, 10).forEach(result => {
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.innerHTML = `
                <div>
                    <img src='https://image.tmdb.org/t/p/w500/${result.poster_path}' alt='${result.original_name}'>
                </div>
                <div>
                    <p><span class='font-bold text-xl'>${result.original_name}</span>  . <span class='text-sm'>${result.first_air_date}</span></p>
                </div>`;
                topRated.append(movieCard);
            });
        })

        // Top rated movies displayed by default
        topRatedMoviesBtn.click();
    }
})