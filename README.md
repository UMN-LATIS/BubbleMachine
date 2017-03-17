# Bubble Machine

## Dependencies

* Node
* React
* ES6 (Babel)




## Getting started

Install Node and npm: https://nodejs.org/en/download/

Install gulp command line interface (CLI): `npm install gulp-cli -g`

Install the node package dependencies for the app: `npm install`

Compile the raw code in /src into working code in /dist that can be viewed in
a web browser.


You should _only_ change the code in the /src folder!  Then, gulp

Make sure the browser is actually updating its cache when you change code, refresh,
and preview your changes in the browser. (May need to do [CTRL] + [R] to refresh the
cache when updating.)


JSX comments are weird:
```
{/*
  Commented code goes in here.
*/}
```


## Structure of the app components

|-- App
    |-- BubbleViz
        |-- Bubbles - renders the actual visualization containing the clickable bubbles
        |-- AudioFileForm - allows the user to upload an audio file
