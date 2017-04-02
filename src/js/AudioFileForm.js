import React from "react";
import ReactDOM from "react-dom";

import ee from "./EventEmitter";

class AudioFileForm extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here

    this.state = {
      data_uri: undefined,
      audio_loaded: false,
      current_time: 0.0
    }

    // Not sure if we need these if we're using arrow functions "=>" in the function definitions below,
    // but we'll put them here to be safe
    this.handleFile = this.handleFile.bind(this)
    this.startLoadingAudio = this.startLoadingAudio.bind(this)
    this.doneLoadingMetadata = this.doneLoadingMetadata.bind(this)
    this.doneLoadingAudio = this.doneLoadingAudio.bind(this)
    this.playAudio = this.playAudio.bind(this)
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this)
  }

  componentDidMount () {
    // Make sure parent is mounted before emitting alert
    setTimeout( () => {
      var alert = { type: "info", text: "Please load an audio file.", icon: "glyphicon glyphicon-save-file" };
      ee.emit("alert", alert);

      // Listen for other components telling AudioFileForm to update currentTime and/or trigger playback...
      ee.on("audio:updateCurrentTime", (currentTime) => {
        this.setState({ current_time: currentTime });
      });

      ee.on("audio:updateCurrentTimeAndPlay", (currentTime) => {
        // State doesn't always want to update right away, so we need to wait for it to update
        // and then put any subsequent actions into a callback function that triggers after
        // state.current_time is successfully updated.
        // https://stackoverflow.com/questions/30782948/why-calling-react-setstate-method-doesnt-mutate-the-state-immediately
        this.setState({ current_time: currentTime }, function(){
          this.playAudio();
        });
      });

      ee.on("audio:play", () => {
        this.playAudio();
      });

      ee.on("audio:pause", () => {
        this.pauseAudio();
      });

    }, 2000);
  }

  componentWillUnmount() {
    ee.off("audio:updateCurrentTime");
    ee.off("audio:updateCurrentTimeAndPlay");
    ee.off("audio:play");
    ee.off("audio:pause");
  }

  handleSubmit = (e) => e.preventDefault();

  handleFile = (e) => {
    // set audio_loaded state to false to indicate new file is not yet loaded and disable controls
    this.setState({ audio_loaded: false });

    // clear any existing alerts
    ee.emit("alert", { type: false } );

    // when a file is passed to the input field, retrieve the contents as a base64-encoded data URI and save it to the component's state
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.onload = function(upload) {
      self.setState({
        data_uri: upload.target.result,
      });
    }
    reader.readAsDataURL(file);

    this.setState({ current_time: 0.0 });
  }

  startLoadingAudio = (e) => {
    ee.emit("alert", { type: "info", text: "Loading your file!" , icon: "glyphicon glyphicon-hourglass" });
  }

  doneLoadingMetadata = (e) => {
    var duration = parseFloat(e.target.duration).toFixed(1);
    ee.emit("audio:updateDuration", duration);
  }

  throwLoadingError = (e) => {
    ee.emit("alert", { type: "danger", text: "Sorry! Your filetype may not be supported. Make sure you're loading an .MP3, .M4A, or .WAV audio file, and please try again.", icon: "glyphicon glyphicon-warning-sign" });
  }

  doneLoadingAudio = (e) => {
    this.setState({ audio_loaded: true });
    ee.emit("alert", { type: false });
  }

  playAudio = () => {
    var audio = ReactDOM.findDOMNode(this.refs.audioPlayer);
    console.log("Playing audio at state.current_time: " + this.state.current_time);

    // Update the audio player's currentTime to equal the state's current_time, then play the audio
    audio.currentTime = this.state.current_time;
    audio.play();
  }

  pauseAudio = () => {
    var audio = ReactDOM.findDOMNode(this.refs.audioPlayer);
    audio.pause();
    console.log("Audio paused at: " + audio.currentTime);
  }

  // Use this as the "source of truth" for updating other UI components outside of AudioFileForm:
  // whenever the scrubber is moved along the timeline, handleTimeUpdate triggers an update in
  // the BubbleViz UI by emitting an "audio:currentTimeDidUpdate" event
  handleTimeUpdate = (e) => {
    // console.log("Handle time update!");
    // Round currentTime to a single decimal point so we don't display long decimals in the UI
    var new_time = parseFloat(e.target.currentTime).toFixed(1);

    // Once the current_time state is updated in within the AudioFileForm component, emit an event
    // to trigger an update in BubbleViz UI component
    this.setState({ current_time: new_time }, function() {
      ee.emit("audio:currentTimeDidUpdate", new_time);
    });
  }

  handleSeek = (e) => {
    var audio = ReactDOM.findDOMNode(this.refs.audioPlayer);
    audio.currentTime = e.target.value;
  }

  render() {
    return (
      // Note: This uses a controlled component approach, where we control ALL time updates by
      // setting state.current_time in the various handler functions above. Then, we always use
      // state.current_time when rendering the UI below. This makes sure state.current_time is the
      // "source of truth" for the current_time that we're displaying in the UI below.
      // https://facebook.github.io/react/docs/forms.html#controlled-components
      <div className="audioDiv">
        <audio id="audioPlayer" ref="audioPlayer" src={this.state.data_uri} onTimeUpdate={this.handleTimeUpdate} onLoadStart={this.startLoadingAudio} onLoadedMetadata={this.doneLoadingMetadata} onCanPlayThrough={this.doneLoadingAudio} onError={this.throwLoadingError} />
        <input type="range" id="audioSeek" min="0" max={this.props.audioDuration} step="0.1" value={this.state.current_time} onChange={this.handleSeek} />

        <div className="btn-group">
          <button id="audioPlay" className="btn btn-default" disabled={!this.state.audio_loaded} onClick={this.playAudio} ><i className='glyphicon glyphicon-play'></i></button>
          <button id="audioPause" className="btn btn-default" disabled={!this.state.audio_loaded} onClick={this.pauseAudio} ><i className='glyphicon glyphicon-pause'></i></button>
        </div>

        <div id="playbackTimeCounter" className="pull-right">{this.state.current_time} / {this.props.audioDuration}</div>

        <form className="form-inline audioForm" onSubmit={this.handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="audio_file_upload">Audio file: </label>
            <input ref="audio_file_upload" type="file" onChange={this.handleFile} />
          </div>
        </form>
      </div>
    )
  }
}

AudioFileForm.propTypes = {
  /*
  audioDuration: React.PropTypes.number,
  currentTime: React.PropTypes.number
  */
};

AudioFileForm.defaultProps = {
  audioDuration: 0.0
};

export default AudioFileForm;
