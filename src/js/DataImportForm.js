import React from "react";
import ReactDOM from "react-dom";

import Baby from 'babyparse';

import ee from "./EventEmitter";

class DataImportForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data_to_import: "" // Start with an empty string to hold data we want to import
    }
  }

  handleSubmit = (e) => {
    // prevent form from submitting and refreshing the page; we are simply going to capture the file contents
    e.preventDefault();
  }

  handleFile = (e) => {
    // clear any existing alerts
    ee.emit("alert", { type: false });

    var self = this;

    var file = e.target.files[0];
    console.log(e.target.files[0]);

    if (!(file.type=="text/csv")) { // If the file is not a CSV, emit an alert to let the user know
      ee.emit("alert", { type: "danger", text: "Sorry! Your filetype is not be supported. Make sure you're loading a .CSV file containing Bubble Machine annotations.", icon: "glyphicon glyphicon-warning-sign"});
    } else { // Otherwise, read the CSV contents from the file to a string

      if (window.FileReader) { // If FileReader is supported
        var reader = new FileReader();

        reader.addEventListener("load", function(event){
          // Now, parse the string in event.target.result and convert to JSON using BabyParse (a node module forked from PapaParse library)
          var parsedData = Baby.parse(event.target.result, {header: true});
          console.log(parsedData);
          ee.emit("importData", parsedData);
        }, false);

        reader.readAsText(file); // Read file into memory as UTF-8
        //console.log(reader);

        //var loadedData = reader.result;
        //reader.onload = this.parseLoadedData(reader.result);
        //reader.onerror = errorHandler;
      } else {
        alert("Sorry! Can't read your file in this browser. Please switch to a newer version of Chrome or Firefox");
      }

    }
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="panel-title">Load Bubbles</h2>
        </div>
        <div className="panel-body">
          <p className="user-tips">Have a set of bubbles you want to view? Click here to load bubbles from a .CSV file on your computer:</p>
          <form className="form-horizontal" onSubmit={this.handleSubmit} encType="multipart/form-data">
            <input type="file" ref="dataImportFile" onChange={this.handleFile} />
          </form>

        </div>
      </div>
    )
  }

}

export default DataImportForm;
