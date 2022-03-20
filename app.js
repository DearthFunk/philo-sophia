import dictionaryJson from "./philo-sophia.js";

let results = [];
let resultsElement = document.getElementById("results");
let searchElement = document.getElementById("search-input");
searchElement.oninput = inputUpdated;

inputUpdated(); //execute with no input results in full list results

//////////////////////////////////////////////

function resetResults() {
  results = [];
  resultsElement.innerHTML = null;
}

function updateResults(searchTerm) {
  for (const key in dictionaryJson) {
    if (key.includes(searchTerm)) {
      results.push({
        title: key,
        description: dictionaryJson[key],
      });
    }
  }
}

function renderResults() {
  results.forEach((item) => {
    var li = document.createElement("li");
    li.appendChild(
      document.createTextNode(`${item.title}: ${item.description}`)
    );
    resultsElement.appendChild(li);
  });
}

function inputUpdated() {
  let searchTerm = searchElement.value;
  resetResults();
  updateResults(searchTerm);
  renderResults();
}
