# Bubble Machine

> Audio annotation tool built on HTML5/React

## Dependencies

* Node
* React
* ES6 (requires Babel)
* Some additional node modules listed in package.json


## Getting started

1. Install Node and npm: https://nodejs.org/en/download/

2. From the terminal, install the gulp command line interface (CLI) by running the following command: `npm install gulp-cli -g`

3. Install the additional node module dependencies for the app: `npm install`

4. The raw code for all of the React modules is located in the src/js/ directory.  These modules are written in ES6, which is not currently supported widely across browsers.  This means that the modules' code needs to be transpiled before the code is able to run in a standard browser.  To do this, we'll use a tool called Gulp, along with a pre-processor called Babel, to "translate" the code into JavaScript that the browser understands.  To launch gulp, simply run the following command in the terminal: `gulp`.  This kicks off the commands defined in the gulpfile.babel.js file, which transpile the React modules and shrink them into a single file called build.js. Finally, it places all of the working code in a folder called /dist.  This code is now packaged up and ready to be viewed in the browser.

4. Install MAMP: https://www.mamp.info/en/  Open up MAMP, then choose Preferences > Web Server and set the "Document Root" to point to the "BubbleMachine" > "dist" folder on your computer.  Save those preferences, then click "Start Servers".

5. Open up a web browser, then navigate to http://localhost:8888 .  You should see the BubbleMachine running locally on your computer!


## Development workflow

**Where should I be making changes to the code?**
As you're developing, you should _only_ change the code in the src/ folder!  Then, make sure you run the `gulp` command in the terminal, and keep it running as you're changing the code.  Gulp will watch for changes in any of the files in the src/ folder, process/transpile them, and transfer them to the dist/ folder where you can preview the changes.

**I think I changed something, but I'm not seeing it show up in the browser. What can I do?**
Make sure the browser is actually refreshing and updating its cache when you change your code.  If you think you've changed some code but aren't seeing the changes in the browser, you may need to do [CTRL] + [R] to refresh.  Or, try a different browser.  

Also check to make sure that Gulp is still running in the terminal and watching for changes.  Gulp will error out if you make a code mistake in your React components, and will try to give you a helpful hint about which line it broke on.  So, pay attention to that

**What the heck is React?  Is it JavaScript?  How do I use it?**
React is a JavaScript library that also offers some special features for structuring code into "components" and moving information back and forth between components.  It was developed by Facebook, and it's designed to offer a zippy, "reactive"-feeling user interface for web apps.

As you dig into React will want to make sure you understand a few key concepts:

* "components" - React UI elements
* "state" - data that can be updated dynamically within a component and used to change the way things are displayed within a component
* "props" - data that gets vpassed from a parent component to its children

React has a [great tutorial](https://facebook.github.io/react/tutorial/tutorial.html) that covers a lot of the basics pretty well.

React uses JSX, which is kind of a mashup of XML/HTML and JavaScript, so some of the things you see in it may look like HTML web page syntax, which some things may look more like JavaScript.  For the most part, you can comment code using standard JavaScript comments, but sometimes--especially in the render() function of your components, you may need to add curly brackets around your comments to make sure they render correctly:
```
{/*
  Commented code goes in here.
*/}
```

## React component structure overview

This app contains multiple React components that work together to offer various functionality in the app:

```
|-- App - container to hold all of the React components for the app
    |-- BubbleViz - the "workhorse" container that loads all other components in its render() function; also contains all methods to load bubble data into and out of the browser's LocalStorage, and manages edit and delete actions for bubbles
        |-- Bubbles - takes the data for all of the bubbles and renders the bubble visualization; displays a special preview bubble that lets user preview changes "on the fly" as they are being entered into the AnnotationForm; also resizes the visualization dynamically to fit the browser width
            |-- Bubble - renders a single bubble within the visualization
        |-- AudioFileForm - allows the user to upload an audio file, and emits an event to update the audio duration into the BubbleViz component, which then gets passed to other components via props
        |-- AnnotationForm - lets the user add a bubble, or edit a selected bubble
        |-- AnnotationTable - displays all bubbles in a table format, lets the user click on them to play or edit
        |-- DataImportForm - imports bubble data from CSV
        |-- DataExportForm - exports bubble data to CSV
```

## Events structure overview

This app uses an event emitter to facilitate communication between the various React components.  The event emitter can broadcast information back and forth between components, as long as each component is set up to either broadcast or listen for a specific event.

To broadcast an event from a component, use the ee.emit() function, indicating the event name and passing along any data you need to transmit, as necessary:
```JavaScript
ee.emit("eventName", dataToTransmit);
```

Then, to make another component listen for the event, you simply need to put a snippet of code into that component's componentDidMount() function.  This listener will listen for other components to broadcast the event with "eventName", and then will execute the function inside:
```JavaScript
ee.on("eventName", (dataToTransmit) => {
  // Function to run when the event is triggered
});
```

Also don't forget to add the following code to the listening component's componentWillUnmount() function. This will destroy all event listeners when the component unmounts:
```JavaScript
ee.off("eventName");
```
Here is a brief description of each of the events being used in the app, their role, and the components they originate from and act upon...


**"alert"**

Toggles on and off alerts to be displayed in the "alert" section at the top of the BubbleViz component.

Source: multiple components
Target: BubbleViz

**"importData"**

When data is being imported from CSV file, trigger the BubbleViz component to complete the import process and save the results to localStorage so the user can work with it within the visualization.

Source: DataImportForm
Target: BubbleViz

**"audio:updateCurrentTime"**

Moves the playhead on the audio playback slider input and forces it to jump to a specific time.  (Ex: When a bubble is opened for editing, this event should force the playhead to jump to that bubble's start_time.)

* Source: AnnotationTable
* Target: AudioFileForm

**"audio:updateCurrentTimeAndPlay"**

Moves the playhead on the audio playback slider input and forces it to jump to a specific time. Also triggers playback of the audio.

* Source: AnnotationTable, Bubble
* Target: AudioFileForm

**"audio:currentTimeDidUpdate"**

Unlike the other two audio events above, which actively force the playback slider to jump to a specific time, this is the "passive" event.  It triggers as the audio is playing back, letting other components know that the audio's currentTime has advanced so that highlights and other visual elements related to the current time can be displayed in the UI.

* Source: AudioFileForm
* Target: Bubbles

**"bubble:createBubble"**

Broadcast new bubble data to save a new bubble to the browser's LocalStorage.

* Source: AnnotationForm
* Target: BubbleViz

**"bubble:updateBubble"**

Broadcast updated bubble data to update an existing bubble.

* Source: AnnotationForm
* Target: BubbleViz

**"bubble:deleteBubble"**

Delete a bubble and remove it from the browser's LocalStorage.

* Source: AnnotationForm
* Target: BubbleViz

**"bubble:deleteAllBubbles"**

Delete all bubbles and replace them with an empty string in the browser's LocalStorage.

* Source: AnnotationTable
* Target: BubbleViz

**"bubble:editBubble"**

Allows the user to click the "Edit" button for a bubble in the AnnotationTable and load its data into the AnnotationForm for editing.

* Source: AnnotationTable
* Target: AnnotationForm

**"bubble:updateBubblePreview"**

When a user adds/edits a bubble in the AnnotationForm, this event sends the updated attributes of the bubble that is currently being edited to the Bubbles component.  The Bubbles component then renders this as a "preview bubble" so the user can preview their changes on the fly as they are changing input on the AnnotationForm.

* Source: AnnotationForm
* Target: Bubbles


## Deploying the app

After running "gulp" and generating the dist/ folder, this folder will contain a nice, packaged version of the app.  You can copy the contents of this folder onto any web server that can serve up static web pages and run your own version of the BubbleMachine on your web server (no backend database or other server-side dependencies necessary).
