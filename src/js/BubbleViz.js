import React from "react";
import ReactDOM from "react-dom";

import AudioFileForm from "./AudioFileForm";
import Bubbles from "./Bubbles";

import ee from "./EventEmitter";


class BubbleViz extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here

    this.state = {
      data: [],
      active_bubble_data: { id: "" },
      edit_bubble_data: undefined,
      alert: { type: false }
    }
  }

  componentDidMount() {
    // Dummy data
    this.loadAnnotationsFromLocalStorage();

		ee.on("alert", (new_alert) => {
			this.setState({ alert: new_alert });
		});

    ee.on("audio:updateDuration", (duration) => {
      this.setState({ audio_duration: duration });
    });

    ee.on("audio:currentTimeDidUpdate", (currentTime) => {
      console.log("Updating time in BubbleViz to: " + currentTime);
      this.setState({ current_time: currentTime });
    });

  }

  componentWillUnmount() {
    ee.off("alert");
    ee.off("audio:updateDuration");
    ee.off("audio:currentTimeDidUpdate");
    ee.off("audio:updateCurrentTime");
  }

  loadAnnotationsFromLocalStorage = () => {
    this.setState({
      data: [
        { id: 1 , title: "test bubble 1", color: "#B80000", shape: "circle", level: 1, start_time: 10, stop_time: 20 },
        { id: 2 , title: "test bubble 2", color: "#B80000", shape: "circle", level: 2, start_time: 20, stop_time: 30 },
        { id: 3 , title: "test bubble 3", color: "#B80000", shape: "circle", level: 3, start_time: 30, stop_time: 40 },
        { id: 4 , title: "test bubble 4", color: "#B80000", shape: "circle", level: 4, start_time: 40, stop_time: 50 },
        { id: 5 , title: "test bubble 5", color: "#B80000", shape: "circle", level: 5, start_time: 50, stop_time: 60 }
      ]
    });
  }

  render() {
    var alertClass;
    var alertText;
    var alertIcon;

    if (this.state.alert.type) {
      alertClass = "alert alert-" + this.state.alert.type;
      alertText = this.state.alert.text;
      alertIcon = this.state.alert.icon;
    }

    return (
      <div>
        <div className="row">
          <div className={alertClass} role="alert">
            <i className={alertIcon}></i> {alertText}
          </div>
        </div>

        <div className="row">
          <Bubbles data={this.state.data} audioDuration={this.state.audio_duration} currentTime={this.state.current_time} />
        </div>

        <div className="row">
          <AudioFileForm audioDuration={this.state.audio_duration} />
        </div>
      </div>
    )
  }
}

export default BubbleViz;
