import React, { Component } from 'react';
import ItemService from '../services/ItemService';
import './AddItemPanel.css';

class AddItemPanel extends Component {

  constructor(props, context){
    super(props, context)

    this.onTextChanged = this.onTextChanged.bind(this);
    this.onDoneClicked = this.onDoneClicked.bind(this);
    this.onFileUpload = this.onFileUpload.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.data = null;
    this.state = {
      text: '',
      fields: null,
      selectedField: ''
    }
  }

  onTextChanged(e){
    this.setState({text: e.target.value})
  }

  onFileUpload(e){
    ItemService.parseCsv(this.fileUpload.files[0])
      .then(res => {
        this.setState({fields: res.meta.fields})
        this.data = res.data;
      });
  }

  onDoneClicked(){
    const textItems = ItemService.parseString(this.state.text);
    let csvItems = [];
    if(this.data && this.state.selectedField){
      csvItems = this.data.reduce((acc, r) => {
        let i = r[this.state.selectedField];
        if(i){
          acc.push(i);
        }
        return acc;
      }, []);
    }
    const newItems = textItems.concat(csvItems);
    this.props.onAddItems(newItems);
  }

  onFieldChange(e){
    this.setState({selectedField: e.target.value})
  }

  render(){

    let fieldDiv = null;
    if(this.state.fields){
      const fieldOptions = this.state.fields.map(f => 
        <option value={f} key={f}>{f}</option>
      )
      fieldDiv = (
        <label>
          Select Email Field:
          <select value={this.state.selectedField} onChange={this.onFieldChange}>
            {fieldOptions}
          </select>
        </label>
      )
    }

    let doneStyle = "btn right";
    if(!this.state.text && !this.state.selectedField){
      doneStyle += " btn-disabled"
    }

    return (
      <div className="add-item-panel">
        <label>
          Addresses
          <textarea
            className="add-item-text"
            placeholder="E-mail addresses to add, separated by `;`"
            onChange={this.onTextChanged}
            value={this.state.text}/>
        </label>
        <label>
          Upload Address Csv
          <input
            type="file"
            id="fileSelect"
            onChange={this.onFileUpload}
            ref={(ref) => this.fileUpload = ref}
            accept=".csv"/>
        </label>
        {fieldDiv}
        <button
          onClick={this.onDoneClicked}
          className={doneStyle}>
          Done
        </button>
      </div>
    )
  }
};

export default AddItemPanel;