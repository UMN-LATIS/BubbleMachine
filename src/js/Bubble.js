import React from "react";
import ReactDOM from "react-dom";

import ee from "./EventEmitter";

class Bubble extends React.Component {
  constructor(props) {
    super(props);

    this.state = { // Make sure bubbles
      left: 0,
      top: 0
    }
  }

  handleClick = () => {
    //console.log("Clicked on bubble: ");
    //console.log(this.props.bubbleData);
    ee.emit("audio:updateCurrentTimeAndPlay", this.props.bubbleData.start_time); // Tell AudioFileForm to update playback counter & play audio at the clicked bubble's start_timer
  }

  render() {
    var bubbleClass = "bubble";
    bubbleClass += " " + this.props.bubbleData.shape;

    // Why isn't highlight getting applied to square bubbles?
    if (this.props.highlight) {
      bubbleClass += " highlight";
    }

    if (this.props.preview) {
      bubbleClass += " preview";
    }

    // Compute the bubble's start position to determine where it should be displayed in the visualization
    var startPosition = Math.floor(this.props.bubbleData.start_time / this.props.audioDuration * this.props.vizWidth);
    var startPositionChecked = isNaN(startPosition) ? 0 : startPosition; // set start postion to 0 if audio isn't loaded to avoid weird React error

    // Compute the bubble's width (based on stop_time - start_time as a percentage of the total viz width) to determine how wide it should be displayed in the visualization
    var bubbleWidth = Math.floor((this.props.bubbleData.stop_time - this.props.bubbleData.start_time) / this.props.audioDuration * this.props.vizWidth);

    var defaultBubbleWidth = 15;
    if (isNaN(bubbleWidth)) { // If bubbleWidth is undefined (i.e. audio isn't loaded, so audioDuration is not defined), set width to a default value to avoid weird React error
      var bubbleWidthChecked = defaultBubbleWidth;
    } else if (bubbleWidth == 0) { // ELSE if bubbleWidth is 0 (i.e. audio is loaded, but it's a new bubble without a stop_time defined), set width to default value for preview
      var bubbleWidthChecked = defaultBubbleWidth;
    } else {
      var bubbleWidthChecked = bubbleWidth;
    }

    // Convert level to a pixel height, with each level being 50 pixels taller than the level before it.
    // Ex: Level 1 will be 50 pixels, level 2 will be 100 pixels, etc.
    var bubbleHeight = this.props.bubbleData.level * 50;

    // Convert level to z-index.
    // Note: z-indexes work backwards, where the div with the highest z-index is rendered on top of other divs.
    // Since we have 5 available levels, we need to subract 5 - level to convert the level value to a z-index
    // that will push higher-level bubbles to the back so they're displayed behind lower-level bubbles and don't
    // accidentally cover them up.
    var bubbleLevel = 5 - this.props.bubbleData.level;

    var bubbleColor = this.props.bubbleData.color;

    // More info on inline styles in React: http://facebook.github.io/react/tips/inline-styles.html
    var divStyle = {
      bottom: 0,
      color: bubbleColor,
      backgroundColor: bubbleColor,
      left: startPositionChecked,
      width: bubbleWidthChecked,
      height: bubbleHeight,
      zIndex: bubbleLevel
    };

    // Each bubble is an HTML <div> element, rendered with the styles computed above and compiled into divStyle
    return(
      <div className={bubbleClass} style={divStyle} onClick={this.handleClick} > <p>{this.props.bubbleData.title}</p> </div>
    )
  }

}

export default Bubble;
