import React from "react";
import ReactDOM from "react-dom";

import ee from "./EventEmitter";

class AnnotationTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active_bubble: undefined
    }
  }

  componentDidMount () {

  }

  handleClick = (bubble) => {
    console.log("Clicked on table row for bubble: ");
    console.log(bubble);
    ee.emit("audio:currentTimeDidUpdate", bubble.start_time); // tell BubbleViz component to update UI
    ee.emit("audio:updateCurrentTimeAndPlay", bubble.start_time); // Tell AudioFileForm to update playback counter
  }

  handleEdit = (bubble) => {
    console.log("Clicked on table row to edit bubble: ");
    console.log(bubble);
    ee.emit("bubble:editBubble", bubble);
  }

  handleDelete = (bubble) => {
    var user_confirm = confirm("Are you sure you want to delete this bubble?");

    if (user_confirm) {
      ee.emit("bubble:deleteBubble", bubble);
    }
  }

  handleDeleteAll = () => {
    var user_confirm = confirm("Are you sure you want to delete all annotations?");

    if(user_confirm) {
      ee.emit("bubble:deleteAllBubbles");
    }
  }

  render() {
    // Sort the annotations data by start_time before prepping the table rows for render
    var sortedBubbles = this.props.data;

    sortedBubbles.sort(function(a,b){
      return a.start_time - b.start_time;
      }
    );

    var bubbleTableRows = sortedBubbles.map((bubble, i) => {
      var bubbleNumber = i + 1;

      var rowStyle = {
        backgroundColor: bubble.color
      };

      var rowClass = "bubble-row";

      if (this.state.active_bubble != undefined) {
        if (bubble.id == this.state.active_bubble.id) rowClass += " selected";
      }

      return (
        <tr key={bubble.id} className={rowClass} >
          <td>{bubbleNumber}</td>
          <td>{bubble.shape}</td>
          <td style={rowStyle}></td>
          <td>{bubble.level}</td>
          <td>{bubble.title}</td>
          <td>{bubble.start_time}</td>
          <td>{bubble.stop_time}</td>
          <td><a onClick={() => this.handleClick(bubble)} ><i className="glyphicon glyphicon-play"/></a> </td>
          <td><a onClick={() => this.handleEdit(bubble)}> <i className="glyphicon glyphicon-pencil"/></a> </td>
          <td><a onClick={() => this.handleDelete(bubble)}> <i className="glyphicon glyphicon-trash"/></a> </td>
        </tr>
      )
    });

    return (
      <div>
        <div className="annotationTable">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Bubble</th>
                    <th>Shape</th>
                    <th>Color</th>
                    <th>Level</th>
                    <th>Title</th>
                    <th>Start Time</th>
                    <th>Stop Time</th>
                    <th>Play</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {bubbleTableRows}
                </tbody>
              </table>
        </div>

        <div className="row">
          <hr/>
          <div className="col-md-2 col-md-offset-10 col-sm-2 col-sm-offset-10">
            <a className="btn btn-danger" onClick={this.handleDeleteAll} ><i className="glyphicon glyphicon-trash"/> Delete All</a>
          </div>
        </div>

      </div>

    )
  }

}

export default AnnotationTable;
