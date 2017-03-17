import React from "react";
import ReactDOM from "react-dom";

import ee from "./EventEmitter";

class Bubbles extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here

    this.state = {
      left: 0,
      top: 0,
      viz_width: 1170 // default to vizWidth = 1170 for standard mid-sized screens
    }
  }

  componentDidMount () {
    this.resizeViz();
    window.addEventListener('resize', this.resizeViz);
  }

  resizeViz = () => {
    if (!(this.refs.bubbleVisualization.clientWidth == undefined)) {
      this.setState({ viz_width: this.refs.bubbleVisualization.clientWidth });
    }
  }

  handleClick = (bubble) => {
    console.log(bubble);
    ee.emit("audio:currentTimeDidUpdate", bubble.start_time); // tell BubbleViz component to update UI
    ee.emit("audio:updateCurrentTimeAndPlay", bubble.start_time); // Tell AudioFileForm to update playback counter
  }

  render = () => {
    var bubbleNodes = this.props.data.map((bubble) => {

      var bubbleClass = "bubble";
      bubbleClass += " " + bubble.shape;

      // If this bubble is the active bubble, update it on the fly if user makes changes while editing
      if (bubble.start_time < this.props.currentTime && bubble.end_time > this.props.currentTime) {
        bubbleClass += " active";
        var startPosition = Math.floor(activeBubbleData.start_time / this.props.audioDuration * this.state.viz_width);
        var startPositionChecked = isNaN(startPosition) ? 0 : startPosition; // set as 0 if audio isn't loaded to avoid weird React error
        var bubbleWidth = Math.floor((bactiveBubbleData.stop_time - activeBubbleData.start_time) / this.props.audioDuration * this.state.viz_width);
        var bubbleWidthChecked = isNaN(bubbleWidth) ? 50 : bubbleWidth; // set as 50 if audio isn't loaded to avoid weird React error
        var bubbleHeight = activeBubbleData.level * 50;
        var bubbleLevel = 5 - activeBubbleData.level;
        var bubbleColor = activeBubbleData.color;
      } else {
        var startPosition = Math.floor(bubble.start_time / this.props.audioDuration * this.state.viz_width);
        var startPositionChecked = isNaN(startPosition) ? 0 : startPosition; // set as 0 if audio isn't loaded to avoid weird React error
        var bubbleWidth = Math.floor((bubble.stop_time - bubble.start_time) / this.props.audioDuration * this.state.viz_width);
        var bubbleWidthChecked = isNaN(bubbleWidth) ? 50 : bubbleWidth; // set as 50 if audio isn't loaded to avoid weird React error
        var bubbleHeight = bubble.level * 50;
        var bubbleLevel = 5 - bubble.level;
        var bubbleColor = bubble.color;
      }

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

      return (
        <div key={bubble.id} className={bubbleClass} style={divStyle} onClick={ () => this.handleClick(bubble)} > <p>{bubble.title}</p> </div>
      )
    });

    return (
      <div className="bubbleVisualization" ref="bubbleVisualization" >
        {bubbleNodes}
      </div>
    )
  }

}

export default Bubbles;
