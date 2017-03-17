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
    ee.on("bubble:updateActiveBubble", (activeBubble) => {
      this.setState({ active_bubble: activeBubble });
    });
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
          <td><a><i className="glyphicon glyphicon-play"/></a> </td>
          <td><a> <i className="glyphicon glyphicon-pencil"/></a> </td>
          <td><a> <i className="glyphicon glyphicon-trash"/></a> </td>
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
      </div>

    )
  }

}

export default AnnotationTable;
