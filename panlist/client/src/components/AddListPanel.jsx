import React, { Component } from 'react';
import './AddListPanel.css';

class AddListPanel extends Component {

  constructor(props, context){
    super(props, context)

    this.onTextChanged = this.onTextChanged.bind(this);
    this.onDoneClicked = this.onDoneClicked.bind(this);
    this.data = null;
    this.state = {
      text: '',
    }
  }

  onTextChanged(e){
    this.setState({text: e.target.value})
  }


  onDoneClicked(){
    this.props.onAddList(this.state.text);
  }

  render(){

    let doneStyle = "btn right";
    if(!this.state.text){
      doneStyle += " btn-disabled"
    }

    return (
      <div className="add-list-panel">
        <label>
          Name
          <input
            type="text"
            placeholder="List Name"
            onChange={this.onTextChanged}
            value={this.state.text}/>
        </label>
        <button
          onClick={this.onDoneClicked}
          className={doneStyle}>
          Done
        </button>
      </div>
    )
  }
};

export default AddListPanel;