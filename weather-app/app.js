document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '42c3db1b4b267c1079f220ea349644eb'; // API key

    const weatherSearchForm = document.querySelector('#weatherSearchForm');
    const weatherSearchInput = document.querySelector('#weatherSearchInput');

    // Event listener to search for weather details through form submission
    weatherSearchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Run fetch function
        const data = await weatherRequest(weatherSearchInput.value, apiKey);
        if (!data) return;
        localStorage.setItem('lastSearch', weatherSearchInput.value); // Save last search
        weatherSearchInput.value = '';

        displayResults(data); // Display results
    });

    const resultsSearchForm = document.querySelector('#resultsSearchForm');
    const resultsSearchInput = document.querySelector('#resultsSearchInput');
    const results = document.querySelector('#results');

    resultsSearchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Display loading spinner
        loading.classList.remove('hidden');
        loading.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');
        home.classList.add('hidden');
        results.classList.add('hidden');

        // Run fetch function
        const data = await weatherRequest(resultsSearchInput.value, apiKey);
        if (!data) return;
        localStorage.setItem('lastSearch', resultsSearchInput.value); // Save last search
        resultsSearchInput.value = '';

        // Hide loading spinner
        loading.classList.add('hidden');
        loading.classList.remove('flex', 'flex-col', 'items-center', 'justify-center', 'space-y-4');

        displayResults(data); // Display results
    });

    // Function to fetch results from API and return results data
    async function weatherRequest(city, apiKey) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
            if (response.status === 404) {
                console.log('Location not found') // Location searched was not found
                return null;
            }
            if (!response.ok) {
                throw new Error('Error fetching data'); // Error if fault in response
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error(error); // Display error
            return null;
        }
    }

    const home = document.querySelector('#home');
    const cityName = document.querySelector('#cityName');
    const temperature = document.querySelector('#temperature');
    const weatherDescription = document.querySelector('#weatherDescription');

    // Function to display weather results
    function displayResults(data) {

        // Remove previous info cards if the exist
        const oldInfo = document.querySelector('#info-cards');
        if (oldInfo) oldInfo.remove();

        document.body.classList.remove('justify-center');
        home.classList.add('hidden');
        results.classList.remove('hidden');
        results.classList.add('flex', 'flex-col', 'space-y-4', 'items-center');

        // Clear Previous Info
        cityName.textContent = "";
        temperature.innerHTML = "";
        weatherDescription.textContent = "";

        // City name and country
        cityName.textContent = `${data.name}, ${data.sys.country}`;

        // Temperature converted to Celsius
        const celsiusTemp = Math.round(parseInt(data.main.temp) - 273.15);

        // Display Temperature
        temperature.innerHTML = `<div>
                                    <img src='https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png'>
                                </div> 
                                <div>
                                    ${celsiusTemp}&deg;C
                                </div>`;
        weatherDescription.textContent = `'${data.weather[0].description.toUpperCase()}'`;

        // Info from API
        const windSpeedMeters = data.wind.speed;
        const windSpeedKm = parseInt(windSpeedMeters) * 3.6;
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        const visibilityMeters = data.visibility;
        const visibilityKm = parseInt(visibilityMeters) / 1000;

        // Create div for info cards
        const info = document.createElement('div');
        info.id = 'info-cards';
        info.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-4', 'w-full');

        // Add info cards
        info.innerHTML = `
        <div class='info-card'>
            <p class='text-lg font-bold'>Wind</p>
            <p class='text-2xl'>${windSpeedKm} km/h ENE</p>
        </div>
        <div class='info-card'>
            <p class='text-lg font-bold'>Pressure</p>
            <p class='text-2xl'>${pressure} mb/hPa</p>
        </div>
        <div class='info-card'>
            <p class='text-lg font-bold'>Humidity</p>
            <p class='text-2xl'>${humidity}%</p>
        </div>
        <div class='info-card'>
            <p class='text-lg font-bold'>Visibility</p>
            <p class='text-2xl'>${visibilityKm}km</p>
        </div>
        `

        // Append to results
        results.appendChild(info);
    }
})