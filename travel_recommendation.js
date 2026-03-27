const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const searchResults = [];
const resultContainer = document.getElementById('globalSearchResults');

// Clear Button
function clearForm() {
    document.getElementById("conditionInput").value = "";
    resultContainer.classList.remove('show');
    resultContainer.innerHTML = '';
}
btnClear.addEventListener("click", clearForm);

//Search Button
function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    
    resultDiv.innerHTML = '';

    fetch('travel_recommendation_api.json')
      .then(response => response.json())
      .then(data => {
        const allKeys= Object.keys(data);
        console.log("Input:", input);
        console.log("All Keys:", allKeys);
        allKeys.forEach(key => {
          if (key.toLowerCase() === input) {
            //for countries, need to loop through cities
             if (input === "countries"){
                const countries = data[key];
                countries.forEach(country => {
                    country.cities.forEach(city => {
                      const cities_name = city.name;
                      const cities_imageUrl = city.imageUrl;
                      const cities_description = city.description;
                      searchResults.push({name: cities_name, imageUrl: cities_imageUrl, description: cities_description});
                    })
                    
                })
             } else {  //for temples / beaches
                  data[key].forEach(item =>{
                    const name = item.name;
                    const imageUrl = item.imageUrl;
                    const description = item.description;
                    searchResults.push({name: name, imageUrl: imageUrl, description: description});
                  })
                
             }}
        });
      })
      .then(() => {
        console.log("Search Results:", searchResults);
        const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const newYorkTime = new Date().toLocaleTimeString('en-US', options);
        console.log("Current time in New York:", newYorkTime);
        resultDiv.innerHTML = `<p>Current time in New York: ${newYorkTime}</p>`;
        
        let html = "<div> "
        searchResults.forEach(result => {
          const resultItem = document.createElement('div');
          resultItem.classList.add('result-item');
          const nameElement = document.createElement('h3');
          nameElement.textContent = result.name;
          const imageElement = document.createElement('img');
          imageElement.src = result.imageUrl;
          imageElement.alt = result.name;
          imageElement.width = 300;
          imageElement.height = 200;
          const descriptionElement = document.createElement('p');
          descriptionElement.textContent = result.description;
          resultItem.appendChild(nameElement);
          resultItem.appendChild(imageElement);
          resultItem.appendChild(descriptionElement);
          resultDiv.appendChild(resultItem);
        });
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p>An error occurred while fetching data.</p>';
      });
}
btnSearch.addEventListener('click', searchCondition);



//Contact Page: Form
function formResponse(){

    const name = document.getElementById('name').value.trim();
    
    if (name) {
        alert(`Thank you, ${name}! Your message has been received. We'll get back to you soon.`);
        document.getElementById('contactForm').reset();
    } else {
        alert("Please enter your name.");
    }
};
document.getElementById('submitBtn').addEventListener('click', formResponse);