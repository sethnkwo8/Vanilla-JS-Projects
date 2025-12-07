document.addEventListener('DOMContentLoaded', () => {
    const APIKey = '92cb96b17b6ea594ade0b3fe45b93e78'; // API key

    // Get movie search elements
    const movieSearchForm = document.querySelector('#movieSearchForm');
    const movieSearchInput = document.querySelector('#movieSearchInput');

    // Get sections
    const trendingSection = document.querySelector('#trendingSection');
    const topRatedSection = document.querySelector('#topRatedSection');
    const searchResultsSection = document.querySelector('#searchResultsSection');

    // Get search results elements
    const searchResults = document.querySelector('#searchResults');
    const searchResultsName = document.querySelector('#searchResultsName');

    // Get trending elements
    const trendingResults = document.querySelector('#trendingResults');
    const trendingTvShowsBtn = document.querySelector('#trendingTvShowsBtn');
    const trendingMoviesBtn = document.querySelector('#trendingMoviesBtn');

    // Get loading spinner div
    const trendingLoading = document.querySelector('#trendingLoading');
    const topRatedLoading = document.querySelector('#topRatedLoading');
    const searchResultsLoading = document.querySelector('#searchResultsLoading');

    // Get top rated elements
    const topRatedResults = document.querySelector('#topRatedResults');
    const topRatedTvShowsBtn = document.querySelector('#topRatedTvShowsBtn');
    const topRatedMoviesBtn = document.querySelector('#topRatedMoviesBtn');

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

    // Function to fetch search results
    async function fetchSearchResults(apikey, query, page = 1) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apikey}&query=${query}&page=${page}`);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    // Function to render results
    function renderSearchResults(data) {

        // Clear previous search results
        searchResults.innerHTML = '';

        // Create card for each result
        data.results.forEach(result => {

            // Fallback for poster path 
            const poster = result.poster_path
                ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                : 'assets/film.png';

            const movieCard = document.createElement('div');

            movieCard.innerHTML = `
            <a class='movie-card' href='javascript:void(0)'>
                <div>
                    <img src='${poster}' alt='${result.title || result.name}'>
                </div>
                <div>
                    <p><span class='font-bold text-xl'>${result.title || result.name}</span>  . <span class='text-sm'>${result.release_date ?? result.first_air_date ?? ''}</span></p>
                </div>
            </a>`;

            // Append card to div
            searchResults.append(movieCard);
        });
    }

    // Event listener function
    function setUpSearchListener() {
        movieSearchForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            // Hide trending and top rated sections
            trendingSection.classList.add('hidden');
            topRatedSection.classList.add('hidden');

            // Display search results section
            searchResultsSection.classList.remove('hidden');
            searchResultsSection.classList.add('flex', 'flex-col', 'space-y-4', 'mt-12');

            // Display loading spinner
            searchResultsLoading.classList.remove('hidden');
            searchResultsLoading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4', 'pb-4');

            // Get search query
            const query = encodeURIComponent(movieSearchInput.value)

            const data = await fetchSearchResults(APIKey, query);

            // Title
            if (data) {
                searchResultsName.textContent = `Results for '${movieSearchInput.value}'`;
                renderSearchResults(data);
            }

            // Clear search input
            movieSearchInput.value = '';

            // Hide loading spinner
            searchResultsLoading.classList.add('hidden');
            searchResultsLoading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');
        });
    }

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
    };

    // Function to add trending movies and tv shows
    function loadTrending() {
        trendingResults.innerHTML = '';

        // Display trending movies when movies button is clicked
        trendingMoviesBtn.addEventListener('click', async function () {
            this.focus();
            trendingResults.innerHTML = '';

            // Display loading spinner
            trendingLoading.classList.remove('hidden');
            trendingLoading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

            const data = await fetchTrending(APIKey, this.dataset.type);

            // Create card for each result
            data.results.slice(0, 10).forEach(result => {
                const movieCard = document.createElement('div');

                // Fallback for poster path 
                const poster = result.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                    : 'assets/film.png';

                movieCard.innerHTML = `
                <a class='movie-card' href='javascript:void(0)'>
                    <div>
                        <img src='${poster}' alt='${result.title}'>
                    </div>
                    <div>
                        <p><span class='font-bold text-xl'>${result.title}</span>  . <span class='text-sm'>${result.release_date ?? ''}</span></p>
                    </div>
                </a>`;

                // Append card to div
                trendingResults.append(movieCard);
            });

            // Hide loading spinner
            trendingLoading.classList.add('hidden');
            trendingLoading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');
        })

        // Function for trending buttons event listeners
        function setUpTrendingListener() {

        }

        // Display trending tv shows whentv shows button is clicked
        trendingTvShowsBtn.addEventListener('click', async function () {
            this.focus();
            trendingResults.innerHTML = '';

            // Display loading spinner
            trendingLoading.classList.remove('hidden');
            trendingLoading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

            const data = await fetchTrending(APIKey, this.dataset.type);

            // Create card for each result
            data.results.slice(0, 10).forEach(result => {
                const movieCard = document.createElement('div');

                // Fallback for poster path 
                const poster = `https://image.tmdb.org/t/p/w500/${result.poster_path ?? result.profile_path ?? ''}` || 'assets/film.png';

                movieCard.innerHTML = `
                <a class='movie-card' href='javascript:void(0)'>
                    <div>
                        <img src='${poster}' alt='${result.name}'>
                    </div>
                    <div>
                        <p><span class='font-bold text-xl'>${result.name}</span>  . <span class='text-sm'>${result.first_air_date ?? ''}</span></p>
                    </div>
                </a>`;

                // Append card to div
                trendingResults.append(movieCard);
            });

            // Hide loading spinner
            trendingLoading.classList.add('hidden');
            trendingLoading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');
        })

        // Trending movies displayed by default
        trendingMoviesBtn.click();
    };

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
    };

    // Function to add top rated movies and tv shows
    function loadTopRated() {
        topRatedResults.innerHTML = '';

        // Display top rated movies when movies button is clicked
        topRatedMoviesBtn.addEventListener('click', async function () {
            this.focus();
            topRatedResults.innerHTML = '';

            // Display loading spinner
            topRatedLoading.classList.remove('hidden');
            topRatedLoading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

            const data = await fetchTopRated(APIKey, this.dataset.type);

            // Create card for each result
            data.results.slice(0, 10).forEach(result => {
                const movieCard = document.createElement('div');

                // Fallback for poster path 
                const poster = result.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                    : 'assets/film.png';

                movieCard.innerHTML = `
                <a class='movie-card' href='#'>
                    <div>
                        <img src='${poster}' alt='${result.title}'>
                    </div>
                    <div>
                        <p><span class='font-bold text-xl'>${result.original_title}</span>  . <span class='text-sm'>${result.release_date ?? ''}</span></p>
                    </div>
                </a>`;

                // Append card to div
                topRatedResults.append(movieCard);
            });

            // Hide loading spinner
            topRatedLoading.classList.add('hidden');
            topRatedLoading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');
        })

        // Display top rated tv shows when tv shows button is clicked
        topRatedTvShowsBtn.addEventListener('click', async function () {
            this.focus();
            topRatedResults.innerHTML = '';

            // Display loading spinner
            topRatedLoading.classList.remove('hidden');
            topRatedLoading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

            const data = await fetchTopRated(APIKey, this.dataset.type);

            // Create card for each result
            data.results.slice(0, 10).forEach(result => {
                const movieCard = document.createElement('div');

                // Fallback for poster path 
                const poster = result.poster_path
                    ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
                    : 'assets/film.png';

                movieCard.innerHTML = `
                <a class='movie-card' href='javascript:void(0)'>
                    <div>
                        <img src='${poster}' alt='${result.original_name}'>
                    </div>
                    <div>
                        <p><span class='font-bold text-xl'>${result.original_name}</span>  . <span class='text-sm'>${result.first_air_date ?? ''}</span></p>
                    </div>
                </a>`;

                // Append card to div
                topRatedResults.append(movieCard);
            });

            // Hide loading spinner
            topRatedLoading.classList.add('hidden');
            topRatedLoading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');
        })

        // Top rated movies displayed by default
        topRatedMoviesBtn.click();
    };

    loadTrending(); // Run function for trending section
    loadTopRated(); // Run function for top rated section
    setUpSearchListener(); // Run function for search results
})