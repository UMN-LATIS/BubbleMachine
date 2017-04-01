import React from "react";
import ReactDOM from "react-dom";

import AudioFileForm from "./AudioFileForm";
import Bubbles from "./Bubbles";
import AnnotationTable from "./AnnotationTable";
import AnnotationForm from "./AnnotationForm";

import ee from "./EventEmitter";


class BubbleViz extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here

    this.state = {
      data: [],
      edit_bubble_data: undefined,
      alert: { type: false }
    }
  }

  componentDidMount() {
    this.loadBubblesFromLocalStorage();

		ee.on("alert", (new_alert) => {
			this.setState({ alert: new_alert });
		});

    ee.on("audio:updateDuration", (duration) => {
      this.setState({ audio_duration: duration });
    });

    ee.on("audio:currentTimeDidUpdate", (currentTime) => {
      //console.log("Updating time in BubbleViz to: " + currentTime);
      this.setState({ current_time: currentTime });
    });

    ee.on("bubble:createBubble", (bubble) => {
      console.log("Creating a new bubble: ");
      console.log(bubble);
      this.createBubble(bubble);
    });

    /*
    ee.on("bubble:updateBubble", (bubble) => {
    });
    */

    ee.on("bubble:deleteBubble", (bubble) => {
      this.deleteBubble(bubble);
    });

  }

  componentWillUnmount() {
    ee.off("alert");
    ee.off("audio:updateDuration");
    ee.off("audio:currentTimeDidUpdate");
  }

  loadBubblesFromLocalStorage = () => {
    // If "bubbleMachineData" item doesn't already exist in localStorage, create a blank array and save it to localStorage to use
    if (localStorage.getItem("bubbleMachineData") == null){
      var allBubbles = [];

      // Dummy data
      /*
      var allBubbles = [
        { id: 1 , title: "test bubble 1", color: "#B80000", shape: "circle", level: 1, start_time: 10, stop_time: 20 },
        { id: 2 , title: "test bubble 2", color: "#B80000", shape: "circle", level: 2, start_time: 20, stop_time: 30 },
        { id: 3 , title: "test bubble 3", color: "#B80000", shape: "circle", level: 3, start_time: 30, stop_time: 40 },
        { id: 4 , title: "test bubble 4", color: "#B80000", shape: "circle", level: 4, start_time: 40, stop_time: 50 },
        { id: 5 , title: "test bubble 5", color: "#B80000", shape: "circle", level: 5, start_time: 50, stop_time: 60 }
      ]
      */

      localStorage.setItem("bubbleMachineData", JSON.stringify(allBubbles));
    } else {
      // else if "bubbleMachineData" item already exists in localStorage, load that data
      var allBubbles = JSON.parse(localStorage.getItem("bubbleMachineData"));
    }

    this.setState({ data: allBubbles });
  }

  createBubble = (bubble) => {
    var allBubbles = JSON.parse(localStorage.getItem("bubbleMachineData")); // get the existing bubbles string from LocalStorage
    allBubbles.push(bubble); // push the new annotation into the annotations string
    this.setState({ data: allBubbles }); // set React state to re-render everything with updated bubbles
    localStorage.setItem("bubbleMachineData", JSON.stringify(allBubbles)); // save the updated bubbles string back to LocalStorage
  }

  deleteBubble = (bubble) => {
    console.log("Deleting bubble with id = " + bubble.id);
    var allBubbles = JSON.parse(localStorage.getItem("bubbleMachineData")); // get the existing bubbles string from LocalStorage

    // find index of annotation to be updated
    function findIndexById() {
      for (var i = 0; i < allBubbles.length; i++) {
        if (allBubbles[i].id == bubble.id) {
          return i;
        }
      }
      return null;
    }

    var bubble_index = findIndexById();
    console.log("This bubble to delete is located at index: " + bubble_index);

    allBubbles.splice(bubble_index, 1); // splice off the bubble from the full bubbles array
    this.setState({ data: allBubbles }); // set React state to re-render everything without the deleted bubble
    localStorage.setItem("bubbleMachineData", JSON.stringify(allBubbles)); // save the allBubbles array (without the deleted bubble) back to LocalStorage in the form of a JSON string
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

        <div className="row">
          <AnnotationForm audioDuration={this.state.audio_duration} />
        </div>

        <div className="row">
          <AnnotationTable data={this.state.data} />
        </div>
      </div>
    )
  }
}

export default BubbleViz;
