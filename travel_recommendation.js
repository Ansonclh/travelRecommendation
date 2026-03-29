const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const searchResults = [];
const resultContainer = document.getElementById('globalSearchResults');
const searhBar = document.getElementById('conditionInput');

// Clear Button
function clearForm() {
    searhBar.value = "";
    resultContainer.classList.remove('show');
    resultContainer.innerHTML = '';
}
btnClear.addEventListener("click", clearForm);

//Search Button
function searchCondition() {
    const input = searhBar.value.toLowerCase();
    const resultDiv = document.getElementById('globalSearchResults');
    
    resultDiv.innerHTML = ""; // Clear previous results
    searchResults.length = 0; // Clear the search results array

    if (!input){
      alert("Please enter a search term.");
      return;
    }

    fetch('travel_recommendation_api.json')
      .then(response => response.json())
      .then(data => {
        const allKeys= Object.keys(data);
        allKeys.forEach(key => {
          let modifiedkey = key;
          if (input === "beach" || input === "temple" || input === "country"){
            //for countries, need to loop through cities
             if (input === "country"){
                const countries = data["countries"];
                countries.forEach(country => {
                    country.cities.forEach(city => {
                      const cities_name = city.name;
                      const cities_imageUrl = city.imageUrl;
                      const cities_description = city.description;
                      searchResults.push({name: cities_name, imageUrl: cities_imageUrl, description: cities_description});
                    })
                    
                })
             } else if (input === "temple" || input === "beach") {  //for temples / beaches
                  
                  if (input === "temple"){
                    modifiedkey = "temples";
                  } else if (input === "beach"){
                    modifiedkey = "beaches";
                  }
                  data[modifiedkey].forEach(item =>{
                    const name = item.name;
                    const imageUrl = item.imageUrl;
                    const description = item.description;
                    searchResults.push({name: name, imageUrl: imageUrl, description: description});
                  })    
             }  
          } else {
                allKeys.forEach(key => {
                  const items = data[key];
                  if (Array.isArray(items)){
                    items.forEach(item =>{
                      //For countries, loop through cities
                      try{
                        if (Array.isArray(item.cities)){
                          item.cities.forEach(city => {
                            if (city.name.toLowerCase().includes(input)) {
                              if (city.imageUrl && city.description) {
                                searchResults.push({name: city.name, imageUrl: city.imageUrl, description: city.description});
                              }
                            }
                          });
                        }
                      }  
                      catch (e){
                        console.log(e);
                      }
                      if (item.name.toLowerCase().includes(input)) {
                          if (item.imageUrl && item.description) {
                            searchResults.push({name: item.name, imageUrl: item.imageUrl, description: item.description});
                          }
                      }
                    })
                  }
                })
             };
        })
      })
      .then(() => {
        console.log("Search Results:", searchResults);
        const options = { timeZone: 'America/New_York', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const newYorkTime = new Date().toLocaleTimeString('en-US', options);
        resultDiv.innerHTML = `<h3 style="color: black">Current time in New York: ${newYorkTime}</h3>`;
        if (searchResults.length === 0) {
          resultDiv.innerHTML += '<p style="color: black">No results found. Please try a different search term.</p>';
          resultDiv.classList.add('show');
          return;
        } else {
          let searchResults_modified = searchResults.filter((obj1, index, arr) => arr.findIndex(obj2 => obj2.name === obj1.name) === index);
          let html = "<div> "
          searchResults_modified.forEach(result => {
            html += `
              <div class="card">
                <img src="${result.imageUrl}" alt="${result.name}" class="card-image" width="300" height="200" >
                <div class="card-content">
                  <h3 style="color: black">${result.name}</h3>
                  <p style="color: black">${result.description}</p>
                </div>
              </div>
            `;
          });
          html += "</div>";
          resultDiv.innerHTML += html;
          resultDiv.classList.add('show');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = '<p>An error occurred while fetching data.</p>';
      });
}
btnSearch.addEventListener('click', searchCondition);
searhBar.addEventListener('keydown', function(event) {
    if (event.key === "Enter"){
        searchCondition();
    };
});

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

if (window.location.href.includes("contact.html")) {
    document.getElementById('submitBtn').addEventListener('click', formResponse);
}