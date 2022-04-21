import dictionaryJson from "./philo-sophia.js";

let results = [];
let dictionary;
let resultsElement = document.getElementById("results");
let searchElement = document.getElementById("search-input");
searchElement.oninput = inputUpdated;

processDictionary();
inputUpdated(); //execute with no input results in full list results

//////////////////////////////////////////////

function processDictionary() {
  dictionary = Object.keys(dictionaryJson).map((k) => ({
    word: k,
    definition: dictionaryJson[k],
    foundWords: [],
  }));
  dictionary.forEach((item) => {
    let dictionaryWords = Object.keys(dictionaryJson);
    let definitionWords = item.definition.split(" ");
    let foundWords = definitionWords.filter((word) =>
      dictionaryWords.includes(word)
    );
    item.foundWords = foundWords;
  });
}

function resetResults() {
  results = [];
  resultsElement.innerHTML = null;
}

function updateResults(searchTerm) {
  results = dictionary.filter((definition) =>
    definition.word.includes(searchTerm)
  );
}

function renderResults() {
  results.forEach((item) => {
    let listItem = document.createElement("li");
    let titleElement = document.createElement("span");
    titleElement.appendChild(document.createTextNode(`${item.word}: `));
    listItem.appendChild(titleElement);
    listItem.appendChild(document.createTextNode(item.definition));

    if (item.foundWords.length) {
      let descriptionList = document.createElement("dl");

      item.foundWords.forEach((foundWord) => {
        let { definition } = dictionary.find((item) => item.word === foundWord);
        let dt = document.createElement("dt");
        let dd = document.createElement("dd");
        dt.appendChild(document.createTextNode(`${foundWord}: `));
        dd.appendChild(document.createTextNode(definition));
        descriptionList.appendChild(dt);
        descriptionList.appendChild(dd);
      });
      listItem.appendChild(descriptionList);
    }
    resultsElement.appendChild(listItem);
  });
}

function inputUpdated() {
  let searchTerm = searchElement.value;
  resetResults();
  updateResults(searchTerm);
  renderResults();
}
