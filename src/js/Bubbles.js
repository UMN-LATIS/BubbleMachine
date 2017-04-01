import React from "react";
import ReactDOM from "react-dom";

import Bubble from "./Bubble";

import ee from "./EventEmitter";

class Bubbles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viz_width: 1170, // default to vizWidth = 1170 for standard mid-sized screens
      preview_bubble_data: { // create an empty "ghost" preview bubble
        id: "",
        title: "",
        color: "",
        shape: "",
        level: "",
        start_time: "",
        stop_time: ""
      }
    }
  }

  componentDidMount () {
    this.resizeViz(); // call resizeViz() function to set the viz_width to equal the current window width
    window.addEventListener('resize', this.resizeViz); // if the user resizes their browser window, reset the viz_width

    ee.on("bubble:updateBubblePreview", (bubble) => {
      console.log("Updating preview!");
      this.setState({ preview_bubble_data: bubble });
    });
  }

  resizeViz = () => {
    if (!(this.refs.bubbleVisualization.clientWidth == undefined)) {
      this.setState({ viz_width: this.refs.bubbleVisualization.clientWidth });
    }
  }

  render = () => {
    // Show all of the existing bubbles being passed down through this.props.data

    // Note: The arrow function "(bubble) =>" below makes sure we can reference
    // "this" inside of the this.props.data.map function, which allows us to invoke
    // this.props.currentTime and this.props.audioDuration
    var bubbleNodes = this.props.data.map((bubble) => {
      // If the current playback time is within the bubble's time span, highlight the bubble by marking it highlight={true}
      if (bubble.start_time < this.props.currentTime && bubble.stop_time > this.props.currentTime) {
        return (
          <Bubble key={bubble.id} bubbleData={bubble} highlight={true} preview={false} audioDuration={this.props.audioDuration} vizWidth={this.state.viz_width} />
        )
      } else {
        // Otherwise, return a bubble node for the bubble marked as active={false}
        return (
          <Bubble key={bubble.id} bubbleData={bubble} highlight={false} preview={false} audioDuration={this.props.audioDuration} vizWidth={this.state.viz_width} />
        )
      }
    });

    // On top of the existing bubbles, also show a preview of the bubble that is
    // currently being edited/added.  This preview acts like a "ghost" bubble that
    // displays as long as something is being edited/added, but disappears or turns
    // into a "real" bubble once it is saved (via BubbleViz component) or cancelled.
    var previewBubble = <Bubble key="999" bubbleData={this.state.preview_bubble_data} highlight={false} preview={true} audioDuration={this.props.audioDuration} vizWidth={this.state.viz_width} />;

    return (
      <div className="bubbleVisualization" ref="bubbleVisualization" >
        {bubbleNodes}
        {previewBubble}
      </div>
    )
  }

}

export default Bubbles;
