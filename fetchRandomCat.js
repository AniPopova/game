'use strict';
// Second Api - API Key = 'MTc3MTc4Mw';
function fetchRandomCat() {
    const url = 'https://api.thecatapi.com/v1/images/search';

    fetch(url)
        .then(response => response.json()
            .then(data => {
                // Extract the cat picture URL from the response
                const catPictureUrl = data[0].url;
                const image = document.getElementById('image'); // Display the picture
                image.src = catPictureUrl;
            })
            .catch(error => {
                console.error('Error fetching cat picture:', error);
            }));
}
