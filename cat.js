function fetchRandomCatPicture() {
  const catApiUrl = 'https://api.thecatapi.com/v1/images/search';

  fetch(catApiUrl)
      .then(response => response.json())
      .then(data => {
          const catImage = document.getElementById('catImage');
          catImage.src = data[0].url;
      })
      .catch(error => {
          console.error('Error fetching cat picture:', error);
      });
}