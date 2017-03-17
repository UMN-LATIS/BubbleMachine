import React from "react";
import ReactDOM from "react-dom";

import ee from "./EventEmitter";

class Bubble extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      left: 0,
      top: 0
    }
  }

  handleClick = (bubble) => {
    console.log("Clicked on bubble: ");
    console.log(bubble);
    ee.emit("audio:currentTimeDidUpdate", bubble.start_time); // tell BubbleViz component to update UI
    ee.emit("audio:updateCurrentTimeAndPlay", bubble.start_time); // Tell AudioFileForm to update playback counter

    ee.emit("bubble:updateActiveBubble", bubble);
  }

  render() {
    var bubbleClass = "bubble";
    bubbleClass += " " + this.props.bubbleData.shape;

    // If this bubble is the active bubble, update it on the fly if user makes changes while editing
    if (this.props.active) {
      bubbleClass += " active";
    }

    var startPosition = Math.floor(this.props.bubbleData.start_time / this.props.audioDuration * this.props.vizWidth);
    var startPositionChecked = isNaN(startPosition) ? 0 : startPosition; // set as 0 if audio isn't loaded to avoid weird React error
    var bubbleWidth = Math.floor((this.props.bubbleData.stop_time - this.props.bubbleData.start_time) / this.props.audioDuration * this.props.vizWidth);
    var bubbleWidthChecked = isNaN(bubbleWidth) ? 50 : bubbleWidth; // set as 50 if audio isn't loaded to avoid weird React error
    var bubbleHeight = this.props.bubbleData.level * 50;
    var bubbleLevel = 5 - this.props.bubbleData.level;
    var bubbleColor = this.props.bubbleData.color;

    // Inline styles: http://facebook.github.io/react/tips/inline-styles.html
    var divStyle = {
      bottom: 0,
      color: bubbleColor,
      backgroundColor: bubbleColor,
      left: startPositionChecked,
      width: bubbleWidthChecked,
      height: bubbleHeight,
      zIndex: bubbleLevel
    };

    return(
      <div className={bubbleClass} style={divStyle} onClick={ (bubble) => this.handleClick(bubble)} > <p>{this.props.bubbleData.title}</p> </div>
    )
  }

}

export default Bubble;
