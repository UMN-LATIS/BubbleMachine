import React from "react";
import ReactDOM from "react-dom";

import FileSaver from 'file-saver';
import Baby from 'babyparse';

import ee from "./EventEmitter";

class DataExportForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filename: "" // Start with an empty filename
    }
  }

  onFilenameChange = (e) => {
    this.setState({ "filename": e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    var data_to_export = JSON.stringify(this.props.data);
    var csv = Baby.unparse(data_to_export); // use BabyParse (a node module forked from PapaParse library) to parse browser's JSON-formatted data -> CSV format
    var user_filename = this.state.filename + ".csv";

    // create a temporary <a> object (ref="tempLink") and turn it into a download link
    var tempLink = this.refs.tempLink;
    console.log(tempLink);

    // Test user's browser support for download links; if supported, use the following:
    if (typeof tempLink.download != "undefined") {
      tempLink.target = '_blank';
      tempLink.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      tempLink.download = user_filename;
      console.log(tempLink); // pretend to 'click' link to automatically initiate download in the browser
      tempLink.click();
    } else {
      // Fallback to FileSaver.js for Safari and other stupid browsers
      // Still not totally working, but watch for updates here: https://github.com/eligrey/FileSaver.js/issues/268
      console.log("Your browser doesn't support the download attribute for download links!");
      var blob = new Blob([csv], {type: "application/octet-stream"});
      FileSaver.saveAs(blob, "bubbles.csv");
    }

    /*
    // The code above is for CSV export
    // If you'd prefer to export the raw JSON instead of CSV, change the user_filename declaration
    // to end in '.json' and substitute the href to indicate plain;base64 encoding:
    var user_filename = this.state.filename + ".json";
    tempLink.href = "data:text/plain;base64," + btoa(data_to_export);
    */
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h2 className="panel-title">Save Bubbles</h2>
        </div>
        <div className="panel-body">
          <p className="user-tips">Finished annotating your audio? Enter a filename, then click 'Export' to save your bubbles as a .CSV file to your computer:</p>
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
              <div className="col-sm-12">
                <div className="input-group">
                  <input type="text" className="form-control" value={this.state.filename} placeholder="Add filename..." ref="export_filename" onChange={this.onFilenameChange} />
                  <div className="input-group-addon">.csv</div>
                </div>
              </div>
            </div>
            <input type="submit" ref="exportButton" className="btn btn-success" value="Export" />
            <a ref="tempLink"></a>
          </form>
          <hr />
          <p className="user-tips"><strong>Note to Safari users:</strong> Safari does not support custom filenames on export.  When you click "Export" above, your bubbles will automatically save to your Downloads folder as a file with the name "Unknown". You will need to manually rename your file to something that ends in ".csv" in order for it to open correctly.</p>
        </div>

      </div>
    )
  }
}

export default DataExportForm;
