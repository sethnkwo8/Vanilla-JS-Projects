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

    // Display Trrending results
    const trending = document.querySelector('#trending');
    const tvShowsBtn = document.querySelector('#trendingTvShowsBtn');
    const moviesBtn = document.querySelector('#trendingMoviesBtn');
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

        moviesBtn.addEventListener('click', async function () {
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

        tvShowsBtn.addEventListener('click', async function () {
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

        moviesBtn.click();
    }
})