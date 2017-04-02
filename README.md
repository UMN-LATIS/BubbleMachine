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
    |-- BubbleViz - loads bubble data from LocalStorage, manages edit and delete actions for bubbles
        |-- Bubbles - renders the entire div for the bubble visualization, and resizes the visualization to fit the browser width
            |-- Bubble - renders a single bubble within the visualization
        |-- AudioFileForm - allows the user to upload an audio file, and emits events to update the audio duration and current time in BubbleViz component, which then gets passed to other components
        |-- AnnotationForm - lets the user edit the bubble that is currently selected for editing



## Events

### Audio playback-related events

**"audio:updateCurrentTime"**

Role: Moves the playhead on the audio playback slider input and forces it to jump to a specific time.  (Ex: When a bubble is opened for editing, this event will force the playhead to jump to that bubble's start_time.)

* Source:
* Target: AudioFileForm

**"audio:updateCurrentTimeAndPlay"**

Role: Moves the playhead on the audio playback slider input and forces it to jump to a specific time. Also triggers  

* Source:
* Target: AudioFileForm

**"audio:currentTimeDidUpdate"**

Role: Unlike the other two audio events, which actively force the playback slider to jump to a specific time, this is the "passive" event.  It triggers as the audio is playing back, letting other components know that the audio's currentTime has advanced so that the changes can be displayed in the UI.

* Source: AudioFileForm
* Target: Bubbles

**"audio:play"**

Role: Allows the user to click the "play" button for a specific bubble in the AnnotationTable and trigger playback at that bubble's start_time.

* Source: AnnotationTable
* Target: AudioFileForm

**"audio:pause"**

* Source: AnnotationTable
* Target: AudioFileForm


### Bubble adding/editing events

**"bubble:createBubble"**

Role: Send new bubble data to save a new bubble to the browser's LocalStorage.

* Source: AnnotationForm
* Target: BubbleViz

**"bubble:updateBubble"**

Role: Send updated bubble data to update an existing bubble.

* Source: AnnotationForm
* Target: BubbleViz

**"bubble:deleteBubble"**

Role: Delete a bubble and remove it from the browser's LocalStorage.

* Source: AnnotationForm
* Target: BubbleViz


**"bubble:editBubble"**

Role: Allows the user to click the "Edit" button for a bubble in the AnnotationTable and load its data into the AnnotationForm for editing.

* Source: AnnotationTable
* Target: AnnotationForm


**"bubble:updateBubblePreview"**

Role: When a user adds/edits a bubble in the AnnotationForm, this event sends the attributes of the bubble that is currently being edited to the Bubbles component.  The Bubbles component then renders this as a "preview bubble" so the user can preview their changes on the fly as they are changing input on the AnnotationForm.

* Source: AnnotationForm
* Target: Bubbles
