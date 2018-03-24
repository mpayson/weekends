import React, { Component } from 'react';
import './SearchList.css';

class SearchList extends Component {

  constructor(){
    super()
    this.onFilterChange = this.onFilterChange.bind(this);
    this.state = {
      filterVal: ''
    }
  }

  onFilterChange(e){
    this.setState({filterVal: e.target.value});
  }

  getItems(items) {
    return items.reduce((acc, i) => {
      const iView = (
        <div key={i} className="panel panel-white panel-no-padding list-item">
          {i}
          <button name={i} onClick={this.props.onDeleteClick} className="btn btn-white icon-ui-close icon-ui-flush icon-ui-red right"/>
        </div>
      )
      if(!this.state.filterVal || i.includes(this.state.filterVal)){
        acc.push(iView);
      }
      return acc;
    }, [])

  }
  render() {
    return (
      <div className="panel">
        <input 
          type="text"
          placeholder="search"
          className="input-search input-minimal trailer-1"
          value={this.state.filterVal}
          onChange={this.onFilterChange}
          />
        <div className="list-pane">
          {this.getItems(this.props.items)}
        </div>
      </div>
    );
  }
}

export default SearchList;
