import React from "react";
import ReactDOM from "react-dom";

import Bubble from "./Bubble";

import ee from "./EventEmitter";

class Bubbles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viz_width: 1170 // default to vizWidth = 1170 for standard mid-sized screens
    }
  }

  componentDidMount () {
    this.resizeViz(); // call resizeViz() function to set the viz_width to equal the current window width
    window.addEventListener('resize', this.resizeViz); // if the user resizes their browser window, reset the viz_width
  }

  resizeViz = () => {
    if (!(this.refs.bubbleVisualization.clientWidth == undefined)) {
      this.setState({ viz_width: this.refs.bubbleVisualization.clientWidth });
    }
  }

  render = () => {
    // Note: The arrow function "(bubble) =>" below makes sure we can reference "this" inside of the
    // this.props.data.map function, which allows us to invoke this.props.currentTime and this.props.audioDuration
    var bubbleNodes = this.props.data.map((bubble) => {
      // If the current playback time is within the bubble's time span, highlight the bubble by marking it highlight={true}
      if (bubble.start_time < this.props.currentTime && bubble.stop_time > this.props.currentTime) {
        return (
          <Bubble key={bubble.id} bubbleData={bubble} highlight={true} audioDuration={this.props.audioDuration} vizWidth={this.state.viz_width} />
        )
      } else {
        // Otherwise, return a bubble node for the bubble marked as active={false}
        return (
          <Bubble key={bubble.id} bubbleData={bubble} highlight={false} audioDuration={this.props.audioDuration} vizWidth={this.state.viz_width} />
        )
      }
    });

    return (
      <div className="bubbleVisualization" ref="bubbleVisualization" >
        {bubbleNodes}
      </div>
    )
  }

}

export default Bubbles;
