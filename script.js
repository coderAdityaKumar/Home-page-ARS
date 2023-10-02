// Add an event listener to the DOMContentLoaded event.
document.addEventListener('DOMContentLoaded', function () {
    // Get the search form element.
    const searchForm = document.querySelector('#form-submit');
  
    // Get the flight results container element.
    const flightResultsContainer = document.getElementById('flight-results');
  
    // Add an event listener to each flight card.
    flightResultsContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('book-button')) {
        // Find the parent flight card element of the clicked button.
        const flightCard = event.target.closest('.flight-card');
  
        if (flightCard) {
          // Get the flight information from the flight card.
          const flightInformation = {
            flightCode: flightCard.querySelector('.flight-code').textContent,
            careerCode: flightCard.querySelector('.career-code').textContent,
            flightName: flightCard.querySelector('.flight-name').textContent,
            departureAirport: flightCard.querySelector('.departure-airport').textContent,
            arrivalAirport: flightCard.querySelector('.arrival-airport').textContent,
            duration: flightCard.querySelector('.duration').textContent,
            totalFare: Math.round(parseFloat(flightCard.querySelector('.price').textContent))
          };
  
          // Construct the URL for the new website with query parameters.
          const queryParams = `?flightCode=${flightInformation.flightCode}&careerCode=${flightInformation.careerCode}&flightName=${flightInformation.flightName}&departureAirport=${flightInformation.departureAirport}&arrivalAirport=${flightInformation.arrivalAirport}&duration=${flightInformation.duration}&totalFare=${flightInformation.totalFare}`;
  
          // Open the new website with the constructed URL.
          const newWebsiteUrl = '/pay-now.html' + queryParams; // Replace with the actual URL of the new website.
          window.open(newWebsiteUrl, '_blank');
        }
      }
    });
  
    // Add an event listener to the search form.
    searchForm.addEventListener('submit', async function (event) {
      // Prevent the default form submission behavior.
      event.preventDefault();
  
      // Get the origin and destination airport codes from the form.
      const from = document.querySelector('#from').value;
      const to = document.querySelector('#to').value;
  
      // Get the date input element.
      const dateInput = document.querySelector("#departure");
  
      // URL encode the date value.
      const date = dateInput.value;
      const encodedDate = encodeURIComponent(date);
  
      // Get the flight results container element.
      const flightResultsContainer = document.getElementById('flight-results');
  
      if (!flightResultsContainer) {
        console.error('Flight results container not found in the DOM.');
        return;
      }
  
      // Construct the API call to get flight information.
      const url = `https://flight-fare-search.p.rapidapi.com/v2/flights/?from=${from}&to=${to}&date=${encodedDate}&adult=1&type=economy&currency=INR`;
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '4e6c0a51c3msh7e2f5b34d2488d9p171f5fjsnf4801c09b085',
          'X-RapidAPI-Host': 'flight-fare-search.p.rapidapi.com'
        }
      };
  
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
  
        // Extract only the desired information and limit the results to 5 entries.
        const extractedResults = result.results.slice(0, 5);
  
        // Clear the flight results container.
        flightResultsContainer.innerHTML = '';
  
        // Loop through the extracted results and create a card for each flight.
        extractedResults.forEach(entry => {
          const flightCard = document.createElement('div');
          flightCard.classList.add('flight-card');
          flightCard.innerHTML = `
            <h2 class="flight-code">Flight Code: ${entry.flight_code}</h2>
            <p class="career-code">Career Code: ${entry.careerCode}</p>
            <p class="flight-name">Flight Name: ${entry.flight_name}</p>
            <p class="departure-airport">Departure Airport: ${entry.departureAirport.label}</p>
            <p class="departure-airport">Departure Airport: ${entry.arrivalAirport.label}</p>
            <p class="duration">Duration: ${entry.duration.text}</p>
            <p class="price">Total Fare: ${Math.round(entry.totals.total)} ${entry.totals.currency}</p>
            <button class="book-button">Book Now</button>
          `;
          flightResultsContainer.appendChild(flightCard);
          flightResultsContainer.scrollIntoView({ behavior: 'smooth' });
        });
      } catch (error) {
        console.error(error);
      }
    });
  });
  