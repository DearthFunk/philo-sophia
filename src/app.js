import dictionaryJson from "./philo-sophia.js";
import Mustache from "../node_modules/mustache/mustache";
import "./app.css";

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

function foundWordDefinition() {
  return dictionary.find((item) => item.word === this).definition;
}

async function inputUpdated() {
  let searchTerm = searchElement.value;
  results = dictionary.filter((definition) =>
    definition.word.includes(searchTerm)
  );
  let template = await fetch("result.mustache").then((response) =>
    response.text()
  );
  let renderedTemplate = Mustache.render(template, {
    results,
    foundWordDefinition,
  });
  resultsElement.innerHTML = renderedTemplate;
}
