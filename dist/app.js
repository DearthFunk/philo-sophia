/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 780:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: \"Nunito\", sans-serif;\n  padding: 20px;\n  background-color: lightgoldenrodyellow;\n}\n\n#search-input {\n  font-size: 20px;\n  margin: 20px 0;\n  color: darkslategrey;\n  padding: 5px;\n  border-radius: 5px;\n  border: 1px solid;\n}\n\np {\n  font-style: italic;\n  font-size: 16px;\n}\n\n.result,\n.found-word {\n  border-radius: 5px;\n  padding: 10px;\n  border: 1px solid transparent;\n}\n\n.result:hover {\n  border: 1px solid lightgrey;\n}\n\n.found-words {\n  margin-top: 5px;\n}\n\n.found-word {\n  font-size: 14px;\n  cursor: pointer;\n  border-radius: 10px;\n  padding: 6px;\n  background: gainsboro;\n  text-align: left;\n}\n\n.found-word:hover {\n  border: 1px solid dodgerblue;\n}\n\n.found-word span {\n  font-style: italic;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 81:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 379:
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 569:
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ 216:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ 565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 795:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ 589:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./src/philo-sophia.js
/*eslint-disable quote-props, max-len*/

/* harmony default export */ const philo_sophia = ({
  'a priori': 'deductive; relating to or derived by reasoning from self-evident propositions; presupposed by experience; being without examination or analysis ',
  'a posteriori': 'inductive; relating to or derived by reasoning from observed facts ',
  'abduction': 'A syllogism or form of argument in which the major premise is evident, but the minor is only probable.',
  'abstract objects': 'every entity is either concrete or abstract; abstract is ...',
  'ad hoc':'For the specific purpose, case, or situation at hand and for no other.',
  'analytic proposition': 'true or not true solely by virtue of their meaning',
  'analytic-synthetic distinction': 'a semantic distinction, used primarily in philosophy to distinguish between propositions that are of two types: analytic propositions and synthetic propositions',
  'anarcho-syndicalism':'control production, you conrol money, then you control society; political philosophy and anarchist school of thought that views revolutionary industrial unionism or syndicalism as a method for workers in capitalist society to gain control of an economy and thus control influence in broader society',
  'anecdotal':'You used a personal experience or an isolated example instead of a sound argument or compelling evidence.',
  'antirealism':'the truth of a statement rests on its demonstrability through internal logic mechanisms, such as the context principle or intuitionistic logic, in direct opposition to the realist notion that the truth of a statement rests on its correspondence to an external, independent reality',
  'astrophysics': 'application of physics to the stufy of celestial bodies', 
  'ATP': 'adenosine triphosphate; type of molectular machine; an organic compound and hydrotrope that provides energy to drive many processes in living cells, such as muscle contraction, nerve impulse propagation, condensate dissolution, and chemical synthesis',
  'ATP synthase': ' is a protein that catalyzes the formation of the energy storage molecule adenosine triphosphate (ATP) using adenosine diphosphate (ADP) and inorganic phosphate (Pi). It is classified under ligases as it changes ADP by the formation of P-O bond (phosphodiester bond).',
  'axiom':'A self-evident or universally recognized truth; a maxim.; An establis hed rule, principle, or law.',
  'bayseian': '',
  'Bayes theorem': 'In probability theory and statistics, Bayes\' theorem, named after Thomas Bayes, describes the probability of an event, based on prior knowledge of conditions that might be related to the event',
  'black-or-white fallacy':'You presented two alternative states as the only possibilities, when in fact more possibilities exist.',
  'brute contingency': '',
  'burden of proof':'You said that the burden of proof lies not with the person making the claim, but with someone else to disprove.',
  'cartesianism':'species of rationalism, because Cartesians hold that knowledge—indeed, certain knowledge—can be derived through reason from innate ideas.',
  'cartesian certainty': '',
  'Causal Determinism':'historical determinism; the idea that every event is necessitated by antecedent events and conditions together with the laws of nature',
  'cause': 'The producer of an effect, result, or consequence.',
  'code': 'A system of signals used to represent letters or numbers in transmitting messages.',
  'coherence theory of epistemic justification':'According to the coherence theory of justification, also known as coherentism, a belief or set of beliefs is justified, or justifiably held, just in case the belief coheres with a set of beliefs, the set forms a coherent system or some variation on these themes.',
  'coherence theory of truth':'A coherence theory of truth states that the truth of any (true) proposition consists in its coherence with some specified set of propositions.',
  'coherintist':' the coherence theory of truth; and the coherence theory of justification.',
  'composition/division fallacy':'You assumed that one part of something has to be applied to all, or other, parts of it; or that the whole must apply to its parts.',
  'compatibilist': 'determinism is compatibile with free-will',
  'concequentialist': 'normative properties depend only on consequences',
  'constructivism':'individuals or learners do not acquire knowledge and understanding by passively perceiving it within a direct process of knowledge transmission, rather they construct new understandings and knowledge through experience and social discourse, integrating new information with what they already know',
  'contingency':'An event that may occur but that is not likely or intended; a possibility',
  'contradiction':'a proposition, statement, or phrase that asserts or implies both the truth and falsity of something',
  'cosmology': 'stufy of the origin and development of the universe',
  'dark matter': 'none barionic matter',
  'deductive': 'deriving conclusions by reasoning',
  'define': 'To state the precise meaning of ',
  'deism': 'god created universe and set it up, but does not intervene',
  'dependent variable': 'expermental result',
  'diachrony': 'as in historical linguistics, considers the development and evolution of a language through history.',
  'heuristic': 'Of or relating to a usually speculative formulation serving as a guide in the investigation or solution of a problem.',
  'hypothesis': 'tentative explanation of observations',
  'independent variable': 'parameter being altered',
  'dualism': 'seperation of mind/matter; mind/body can function seperately',
  'entity': 'every entity falls into either abstract or concrete',
  'entropy':'s a scientific concept as well as a measurable physical property that is most commonly associated with a state of disorder, randomness, or uncertainty.',
  'epistemology': 'nature of knowing',
  'epistimology vs ontology': 'e: ways we know things, o: the way things are',
  'eternal': 'without begining or end ',
  'ethics': 'moral philosophy; is a branch of philosophy that "involves systematizing, defending, and recommending concepts of right and wrong behavior',
  'etymology':'Study of the history of linguistic forms, that is the history of how words are written and pronounced, and how their spelling and pronunciation changed',
  'euthyphro dilemma':'asks whether a thing is good because God says it is good, or does God say it’s good because it is good',
  'evidentialism':'justified to believe if and only if you have evidence that supports your belief',
  'explain': 'to define',
  'explanation': 'explaining: to make known',
  'explication': 'The act of unfolding or opening; explaining',
  'fact': 'what the world is made of? Knowledge or information based on real occurrences.',
  'fallabalism': 'knowledge does not require certainty',
  'fatalism':'The doctrine that all events are predetermined by fate and are therefore unalterable.',
  'fundemental': 'of or relating to the foundation or base',
  'genetic fallacy':'You judged something as either good or bad on the basis of where it comes from, or from whom it came.',
  'gettier cases':'examples that knowledge is not justified true belief; shows scenario where individual is right about proposition but process by which they are right didn\'t guarantee they had knowledge',
  'gnosis':'Intuitive apprehension of spiritual truths, an esoteric form of knowledge sought by the Gnostics.',
  'god of spinoza': 'created everything, hit start, and doesn\'t interupt; points at creator / god distiction; biological father vs father',
  'heterodox': 'Not in agreement with accepted beliefs, especially in church doctrine or dogma.',
  'igtheism': 'ignosticism; The philosophical position that beliefs regarding the existence or non-existence of God (capitalized) all assume too much, especially because there is not just one universal definition of the word "God" or because the concept of "God" is both unfalsifiable and unverifiable; also called "theological noncognitivism".',
  'incompatibilist': 'determinism is incompatible with free-will',
  'indeterminism':'unpredictability; some events (human actions / decisions) have no cause',
  'inductive': 'of, relating to, or employing mathematical or logical induction',
  'induction': 'base on observation',
  'deduction': '',
  'proposition': 'is either true or false; a claim that is either true/false; can never be both; (ie. law of non-contradiction); can never be in the midle (ie. law of excluded-middle)',
  'term (algebra)': '(ie. variable part and number part): 2a, 4b 5g 2x^2, etc.. coefficient (ie number part) variable part() a b g x^2) then ',
  'inductive logic': 'a logic of evidential support',
  'Problem of Induction': '',
  'inference':'The act or process of deriving logical conclusions from premises known or assumed to be true.',
  'justification': 'justify: to prove or show to be just, right, or reasonable',
  'Laplaces Demon':'Causal Determinism by Pierre-Simon Laplace; free-will is an illusion because of causal determinism; According to determinism, if someone (the demon) knows the precise location and momentum of every atom in the universe, their past and future values for any given time are entailed; they can be calculated from the laws of classical mechanics.',
  'law': 'summary of observations',
  'libertarian free-will': 'ability to have done otherwise',
  'loaded question':'You asked a question that had a presumption built into it so that it couldn\'t be answered without appearing guilty.',
  'molecular machine': 'is a molecular component that produces quasi-mechanical movements (output) in response to specific stimuli (input).[2][3] In cellular biology, macromolecular machines frequently perform tasks essential for life, such as DNA replication and ATP synthesis.',
  'nature': 'the material world and its phenomena',
  'neoplatonism': 'platonism + aristotelianism + oriental mysticism ',
  'nominalism':'abstract concepts, general terms, or universals have no independent existence but exist only as names',
  'nothing': 'No thing; not anything. No part; no portion.One of no consequence, significance, or interest.',
  'observant': 'Having or showing keen perceptiveness; perceptive.',
  'observation': 'The act of observing.',
  'observing': 'Giving particular attention; habitually attentive to what passes; observant{1}',
  'omnipresent': 'Present everywhere simultaneously',
  'omniscient': 'Having total knowledge; knowing everything.',
  'ontology': 'The branch of metaphysics that deals with the nature of being.',
  'ontological argument': 'An ontological argument is a philosophical argument, made from an ontological basis, that is advanced in support of the existence of God. Such arguments tend to refer to the state of being or existing.',
  'orthopraxy': 'study of religion; correct conduct both ethical and liturgical',
  'ought': '',
  'panentheism': 'all things are contained within god',
  'pantheism': 'worship all gods; see god(s) in all things',
  'paraconsistent': 'Tolerant towards inconsistencies.',
  'pascals wager':'It posits that humans bet with their lives that God either exists or does not.',
  'pauli exclusion principle':'quantum mechanical principle which states that two or more identical fermions cannot occupy the same quantum state within a quantum system simultaneously',
  'platonsim': 'abstract objects exist',
  'possible':'Capable of happening, existing, or being true without contradicting proven facts, laws, or circumstances.',
  'propter hoc (beecause of this)': '',
  'postdiction':'An assertion or deduction about something in the past; the act of making such an assertion or deduction.',
  'post hoc':'relating to or being the fallacy of arguing from temporal sequence to a causal relation',
  'post hoc, ergo propter hoc':'after this, therefore because of this : because an event occurred first, it must have caused this later event —used to describe a fallacious argument',
  'pragmatist':'a person who takes a practical approach to problems and is concerned primarily with the success or failure of his or her actions',
  'predicting': 'to declare or indicate in advance',
  'problem of underdetermination':'evidence available to us at a given time may be insufficient to determine what beliefs we should hold in response to it. Underdetermination says that all evidence necessarily underdetermines any scientific theory.',
  'PSR (principle sufficient reasoning)':'everything must have a reason, cause, or ground.',
  'ravens paradox':'question of what constitutes evidence for a statement. shows contradiction between inductive logic and intuition. Observing objects that are neither black nor ravens may formally increase the likelihood that all ravens are black even though, intuitively, these observations are unrelated.',
  'reason': 'a statement offered in explanation or justification',
  'reflexive': 'directed or turned back on itself',
  'scientism':'The collection of attitudes and practices considered typical of scientists',
  'sophia': 'wisdom',
  'sophistry': 'Plausible but fallacious argumentation.',
  'strawman':'You misrepresented someone\'s argument to make it easier to attack.',
  'structuralism':'a general theory of culture and methodology that implies that elements of human culture must be understood by way of their relationship to a broader system',
  'syllogism':'A form of deductive reasoning consisting of a major premise, a minor premise, and a conclusion; for example, All humans are mortal, the major premise, I am a human, the minor premise, therefore, I am mortal, the conclusion.',
  'synchrony': 'A synchronic approach considers a language at a moment in time without taking its history into account. aims at describing a language at a specific point of time',
  'synthetic proposition':'truth, if any, derives from how their meaning relates to the world',
  'teleological argument': 'argument for the existence of God or, more generally, that complex functionality in the natural world which looks designed is evidence of an intelligent creator.',
  'teleology':'The philosophical interpretation of natural phenomena as exhibiting purpose or design',
  'tertiary structure':'the three-dimensional structure of a protein—is the next level of complexity in protein folding. Whereas individual amino acids in the primary sequence can interact with one another to form secondary structures such as helices and sheets, and individual amino acids from distant parts of the primary sequence can intermingle via charge-charge, hydrophobic, disulfide, or other interactions, the formation of these bonds and interactions serve to change the shape of the overall protein. The folding that we end up with for a given polypeptide is the tertiary structure.',
  'fallacy fallacy':'You presumed that because a claim has been poorly argued, or a fallacy has been made, that the claim itself must be wrong.',
  'theory': 'make falsifiable predictions; explain laws',
  'types of logic':'Aristotellian; Classical; Propositional; First-Order; Extended logics (extends classical): metaphysics, ethics, epistemology',
  'ubiquitius':'Being or seeming to be everywhere at the same time; omnipresent.',
  '4 dimentional lorentzien manifold': '3 spacial & 1 time',
  'n dimentional riemannian manifolds': '  ', 
  'ultimate':'last in series/process/progression (syn: last); eventual; fundemental; elemental;',
  'underdetermination': '',
  'universalism': 'christians who believe all people will be eventually saved',
  'universals':'Including, relating to, or affecting all members of the class or group',
  'virtue': 'Moral excellence and righteousness; goodness; An example or kind of moral excellence.',
  'zionism': 'nationalist movement that espouses the establishment of, and support for a homeland for the Jewish people centered in the area roughly corresponding to the Land of Israel, the region of Palestine, Canaan, or the Holy Land, on the basis of a long Jewish connection and attachment to that land.',
  'zoroastrianism':'oldest religion, it is Iranian, has dualistic cosmology of good and evil, monotheistic ontology, prophet: Zoroaster',
});

;// CONCATENATED MODULE: ./src/simple-ejs.js
// Simple EJS-like template renderer for browser use
function render(template, data) {
  const { results, foundWordDefinition } = data;
  
  let html = '';
  
  results.forEach(result => {
    html += `
      <div class="result"> 
        <h2>${escapeHtml(result.word)}</h2>
        <p>${escapeHtml(result.definition)}</p>`;
    
    result.foundWords.forEach(foundWord => {
      const definition = foundWordDefinition.call(foundWord);
      html += `
        <div class="found-words">
          <button class="found-word" id="${escapeHtml(foundWord)}">
            <b>${escapeHtml(foundWord)}</b>: <span>${escapeHtml(definition)}</span>
          </button>
        </div>`;
    });
    
    html += `
      </div>`;
  });
  
  return html;
}

function escapeHtml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(569);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/app.css
var app = __webpack_require__(780);
;// CONCATENATED MODULE: ./src/app.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(app/* default */.Z, options);




       /* harmony default export */ const src_app = (app/* default */.Z && app/* default.locals */.Z.locals ? app/* default.locals */.Z.locals : undefined);

;// CONCATENATED MODULE: ./src/app.js




let results = [];
let terms;
let resultsElement = document.getElementById("results");
let searchElement = document.getElementById("search-input");
searchElement.oninput = inputUpdated;

LoadTerms();

//////////////////////////////////////////////

async function LoadTerms() {
  //map the terms an array of objects
  terms = Object.keys(philo_sophia).map((k) => ({
    word: k,
    definition: philo_sophia[k],
    foundWords: [],
  }));

  //for each term, break up the definition into an array
  //and collect any words that also exist in the terms
  terms.forEach((item) => {
    let termsWords = Object.keys(philo_sophia);
    let definitionWords = item.definition.split(" ");
    let foundWords = definitionWords.filter((word) =>
      termsWords.includes(word)
    );
    item.foundWords = foundWords;
  });

  //execute with no input results in full list results
  inputUpdated();
}

function foundWordDefinition() {
  return terms.find((item) => item.word === this).definition;
}

function loadTerm({ currentTarget }) {
  let { id } = currentTarget;
  searchElement.value = id;
  inputUpdated();
}

async function inputUpdated() {
  let searchTerm = searchElement.value;
  results = terms.filter((definition) => definition.word.includes(searchTerm));
  let renderedTemplate = render(null, {
    results,
    foundWordDefinition,
  });
  resultsElement.innerHTML = renderedTemplate;

  let buttons = document.getElementsByClassName("found-word");
  for (const button of buttons) {
    button.onclick = loadTerm;
  }
}

})();

/******/ })()
;