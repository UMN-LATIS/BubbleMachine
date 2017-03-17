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

    //this.handleClick = this.handleClick.bind(this.props.bubbleData)
  }

  handleClick = () => {
    console.log("Clicked on bubble: ");
    console.log(this.props.bubbleData);
    ee.emit("audio:currentTimeDidUpdate", this.props.bubbleData.start_time); // tell BubbleViz component to update UI
    ee.emit("audio:updateCurrentTimeAndPlay", this.props.bubbleData.start_time); // Tell AudioFileForm to update playback counter
  }

  render() {
    var bubbleClass = "bubble";
    bubbleClass += " " + this.props.bubbleData.shape;

    if (this.props.highlight) {
      bubbleClass += " highlight";
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
      <div className={bubbleClass} style={divStyle} onClick={this.handleClick} > <p>{this.props.bubbleData.title}</p> </div>
    )
  }

}

export default Bubble;
