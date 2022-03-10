Run It: https://dearthfunk.github.io/philosobabel/dist

Run It: https://philosobabel.com/

# philosobabel

Bunch of short definitions used as a quick reference guide for stupid philosophy discussions online.
The idea is to type in a word (responsive input), see its definition, then (TODO) see the definitions of the words used in its definition. The UX of this should be 100% keyboard interactions, so you can tab through / the words used in a definition.
Words and their definitions are stupid.

# Running

option 1 (online): click the link above and just open it in the browser
option 2 (local):

- clone the repo
- use `npm run app` to build and serve it
- note: the /src directory contains the content to build using webpack which ends up in the /dist directory

# To Do

- api hookup to pull in (if open) external info maybe (wiktionary, https://plato.stanford.edu/, https://yourlogicalfallacyis.com/, etc.. )
- the EJS template file should not sit in dist/ it should be part of the webpack build (in app.js)
