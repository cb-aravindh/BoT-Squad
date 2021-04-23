import React, {Component} from 'react';
import SpeechToTextDemo from './speechToText/SpeechToTextDemo';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render(){
    return (
        <div id="page-top">
          <SpeechToTextDemo/>
        </div>
    );
  }
}

export default App;
