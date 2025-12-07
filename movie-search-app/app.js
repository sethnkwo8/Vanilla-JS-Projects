document.addEventListener('DOMContentLoaded', () => {
    const APIKey = '92cb96b17b6ea594ade0b3fe45b93e78'; // API key

    const main = document.querySelector('#main');

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

    // Pagination elements
    const pagination = document.querySelector('#pagination');
    const prevPage = document.querySelector('#prevPage');
    const currentPageDisplay = document.querySelector('#currentPage');
    const nextPage = document.querySelector('#nextPage');

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

    // Get card info section
    const cardInfo = document.querySelector('#card-info');

    let currentPage = 1;
    let totalPages = 1;
    let currentQuery = '';

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

    // ----------------------
    // Fetch data from API
    // ----------------------
    async function fetchSearchResults(query, page = 1) {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/multi?api_key=${APIKey}&query=${query}&page=${page}`
            );
            if (!response.ok) throw new Error('Error fetching data');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // ----------------------
    // Render results
    // ----------------------
    function renderSearchResults(data) {
        searchResults.innerHTML = '';

        data.results.forEach(result => {
            const poster = result.poster_path || result.profile_path
                ? `https://image.tmdb.org/t/p/w500/${result.poster_path || result.profile_path}`
                : 'assets/film.png';

            const movieCard = document.createElement('div');
            movieCard.innerHTML = `
                <a class='movie-card' href='javascript:void(0)'>
                    <div>
                        <img src='${poster}' alt='${result.title || result.name}'>
                    </div>
                    <div>
                        <p>
                            <span class='font-bold text-xl'>${result.title || result.name}</span>  
                            . <span class='text-sm'>${result.release_date ?? result.first_air_date ?? ''}</span>
                        </p>
                    </div>
                </a>`;

            searchResults.append(movieCard);

            movieCard.addEventListener('click', () => {
                displayCardInfo(result, poster);
            });
        });
    }

    // ----------------------
    // Update pagination UI
    // ----------------------
    function updatePaginationUI() {
        if (!pagination) return;

        pagination.classList.remove('hidden');
        currentPageDisplay.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;
    }

    // ----------------------
    // Fetch & render wrapper
    // ----------------------
    async function fetchAndRender(query, page = 1) {
        searchResults.innerHTML = '';

        pagination.classList.add('hidden');

        searchResultsLoading.classList.remove('hidden');
        searchResultsLoading.classList.add(
            'flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4', 'pb-4'
        );

        const data = await fetchSearchResults(query, page);
        if (!data) {
            searchResultsLoading.classList.add('hidden');
            return;
        }

        currentPage = data.page;
        totalPages = data.total_pages;

        searchResultsName.textContent = `Results for '${decodeURIComponent(query)}'`;
        renderSearchResults(data);
        updatePaginationUI();

        searchResultsLoading.classList.add('hidden');
        searchResultsLoading.classList.remove(
            'flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4'
        );

        pagination.classList.remove('hidden');
    }

    // ----------------------
    // Form submit event
    // ----------------------
    movieSearchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        currentQuery = encodeURIComponent(movieSearchInput.value);
        currentPage = 1;

        trendingSection.classList.add('hidden');
        topRatedSection.classList.add('hidden');
        searchResultsSection.classList.remove('hidden');
        searchResultsSection.classList.add('flex', 'flex-col', 'space-y-4', 'mt-12');

        await fetchAndRender(currentQuery, currentPage);
        movieSearchInput.value = '';
    });

    // ----------------------
    // Pagination buttons
    // ----------------------
    prevPage.addEventListener('click', async () => {
        if (currentPage > 1) {
            currentPage--;
            await fetchAndRender(currentQuery, currentPage);
        }
    });

    nextPage.addEventListener('click', async () => {
        if (currentPage < totalPages) {
            currentPage++;
            await fetchAndRender(currentQuery, currentPage);
        }
    });

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

    // Function to render trending movies
    function renderTrendingMovies(data) {
        trendingResults.innerHTML = '';

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
    }

    // Function for trending buttons event listeners
    function setUpTrendingMoviesListener() {

        // Display trending movies when movies button is clicked
        trendingMoviesBtn.addEventListener('click', async function () {
            this.focus();
            trendingResults.innerHTML = '';

            // Display loading spinner
            trendingLoading.classList.remove('hidden');
            trendingLoading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

            const data = await fetchTrending(APIKey, this.dataset.type);

            if (data) {
                renderTrendingMovies(data);
            }

            // Hide loading spinner
            trendingLoading.classList.add('hidden');
            trendingLoading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

        });

        // Trending movies displayed by default
        trendingMoviesBtn.click();
    }

    // Function to render trending tv shows
    function renderTrendingShows(data) {
        trendingResults.innerHTML = '';

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
    }

    function setUpTrendingShowsListener() {
        // Display trending tv shows whentv shows button is clicked
        trendingTvShowsBtn.addEventListener('click', async function () {
            this.focus();
            trendingResults.innerHTML = '';

            // Display loading spinner
            trendingLoading.classList.remove('hidden');
            trendingLoading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

            const data = await fetchTrending(APIKey, this.dataset.type);

            if (data) {
                renderTrendingShows(data);
            }

            // Hide loading spinner
            trendingLoading.classList.add('hidden');
            trendingLoading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');
        });

    }

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
    function renderTopRatedMovies(data) {
        topRatedResults.innerHTML = '';

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

    };

    // Display top rated movies when movies button is clicked
    function setUpTopRatedMoviesListener() {
        topRatedMoviesBtn.addEventListener('click', async function () {
            this.focus();
            topRatedResults.innerHTML = '';

            // Display loading spinner
            topRatedLoading.classList.remove('hidden');
            topRatedLoading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

            const data = await fetchTopRated(APIKey, this.dataset.type);

            if (data) {
                renderTopRatedMovies(data);
            }

            // Hide loading spinner
            topRatedLoading.classList.add('hidden');
            topRatedLoading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');
        })

        // Top rated movies displayed by default
        topRatedMoviesBtn.click();
    };

    function renderTopRatedShows(data) {
        topRatedResults.innerHTML = '';

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
    }

    // Display top rated tv shows when tv shows button is clicked
    function setUpTopRatedShowsListener() {
        topRatedTvShowsBtn.addEventListener('click', async function () {
            this.focus();
            topRatedResults.innerHTML = '';

            // Display loading spinner
            topRatedLoading.classList.remove('hidden');
            topRatedLoading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

            const data = await fetchTopRated(APIKey, this.dataset.type);

            if (data) {
                renderTopRatedShows(data);
            }

            // Hide loading spinner
            topRatedLoading.classList.add('hidden');
            topRatedLoading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');
        })
    }

    function displayCardInfo(data, poster) {
        // Hide main search UI
        searchResults.classList.add('hidden');
        pagination.classList.add('hidden');
        searchResultsName.classList.add('hidden');

        // Show detail card with initial opacity and translate for animation
        cardInfo.classList.remove('hidden');
        cardInfo.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-500', 'ease-out');
        main.classList.add('justify-center');

        // Populate card info
        cardInfo.innerHTML = `
            <div class="mb-4">
                <a class='underline text-white text-lg' href='#' id='back'>Back</a>
            </div>
            <div class='flex flex-col md:flex-row gap-6 items-start'>
                <div class='shrink-0'>
                    <img src='${poster}' alt='${data.title || data.name}' class="rounded-lg shadow-lg">
                </div>
                <div class='flex flex-col space-y-2 p-2'>
                    <h1 class='text-white font-bold text-2xl'>${data.title || data.name}</h1>
                    <p class='text-white text-lg'>${data.overview || 'No description available.'}</p>
                    <p class='text-white text-md font-semibold'>Release: ${data.release_date ?? data.first_air_date ?? 'N/A'}</p>
                </div>
            </div>
        `;

        // Trigger the animation after next tick
        requestAnimationFrame(() => {
            cardInfo.classList.remove('opacity-0', 'translate-y-10');
        });

        // Back button listener
        const back = document.querySelector('#back');
        back.addEventListener('click', () => {
            // Animate out before hiding
            cardInfo.classList.add('opacity-0', 'translate-y-10');
            setTimeout(() => {
                cardInfo.innerHTML = '';
                cardInfo.classList.add('hidden');
                cardInfo.classList.remove('opacity-0', 'translate-y-10', 'transition-all', 'duration-500', 'ease-out');

                searchResults.classList.remove('hidden');
                pagination.classList.remove('hidden');
                searchResultsName.classList.remove('hidden');

                main.classList.remove('justify-center');
            }, 300); // match part of transition duration
        });
    }

    // Run functions for trending section
    setUpTrendingMoviesListener();
    setUpTrendingShowsListener();

    // Run functions for top rated section
    setUpTopRatedMoviesListener();
    setUpTopRatedShowsListener();

})