import termsJson from "./philo-sophia.js";
import Mustache from "../node_modules/mustache/mustache";
import "./app.css";

let results = [];
let terms;
let template;
let resultsElement = document.getElementById("results");
let searchElement = document.getElementById("search-input");
searchElement.oninput = inputUpdated;

LoadTerms();

//////////////////////////////////////////////

async function LoadTerms() {
  //map the terms an array of objects
  terms = Object.keys(termsJson).map((k) => ({
    word: k,
    definition: termsJson[k],
    foundWords: [],
  }));

  //for each term, break up the definition into an array
  //and collect any words that also exist in the terms
  terms.forEach((item) => {
    let termsWords = Object.keys(termsJson);
    let definitionWords = item.definition.split(" ");
    let foundWords = definitionWords.filter((word) =>
      termsWords.includes(word)
    );
    item.foundWords = foundWords;
  });

  //get and store the template for re-use
  template = await fetch("result.mustache").then((response) => response.text());

  //execute with no input results in full list results
  inputUpdated();
}

function foundWordDefinition() {
  return terms.find((item) => item.word === this).definition;
}

async function inputUpdated() {
  let searchTerm = searchElement.value;
  results = terms.filter((definition) => definition.word.includes(searchTerm));

  let renderedTemplate = Mustache.render(template, {
    results,
    foundWordDefinition,
  });
  resultsElement.innerHTML = renderedTemplate;
}
