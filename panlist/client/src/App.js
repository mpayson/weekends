import React, { Component } from 'react';
import ReactModal from 'react-modal';
import SideNav from './components/SideNav';
import SearchList from './components/SearchList';
import AddItemPanel from './components/AddItemPanel';
import CopyItemsPanel from './components/CopyItemsPanel';
import ItemService from './services/ItemService';
import AddListPanel from './components/AddListPanel';
import './App.css';

const modalStyle = {

  overlay: {
    position : 'fixed',
    top : 70,
    left : 0,
    right : 0,
    bottom : 0,
    backgroundColor : 'rgba(255, 255, 255, 0.75)'
  },
  content : {
    top : '300px',
    left : '50%',
    right : 'auto',
    bottom : 'auto',
    transform : 'translate(-50%, -50%)',
    borderRadius: 0
  }
            
}

const ALERTIMEOUT = 3000;

class App extends Component {

  constructor(props, context){
    super(props,context)

    this.onCopyClick = this.onCopyClick.bind(this);
    this.onPlusClick = this.onPlusClick.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.onDoneAddItems = this.onDoneAddItems.bind(this);
    this.onDeleteItemClick = this.onDeleteItemClick.bind(this);
    this.populateListItems = this.populateListItems.bind(this);
    this.onListClick = this.onListClick.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.onPlusListClick = this.onPlusListClick.bind(this);
    this.onDoneAddList = this.onDoneAddList.bind(this);
    this.alertInfo = {style: null, message: null}

    this.state = {
      modalType: null,
      items: [],
      listServes: [],
      activeList: null,
      alert: null,
    }
  }

  componentWillMount(){
    ItemService.getListServes()
      .then(res => {
        this.setState({listServes: res})
        if(res.length){
          this.populateListItems(res[0])
        }
      })
  }

  populateListItems(list){
    ItemService.getListMemberEmails(list)
      .then(items => 
        this.setState({items: items, activeList: list})
      )
  }

  onModalClose(){
    this.setState({modalType: null})
  }

  onCopyClick(){
    this.setState({modalType: 'copyItems'});
  }

  onPlusClick(){
    this.setState({modalType: 'addItems'});
  }

  onListClick(e){
    this.populateListItems(e.target.name);
  }

  onPlusListClick(){
    this.setState({modalType: 'addList'})
  }

  onDeleteItemClick(e){
    const items = [e.target.name];
    ItemService.deleteItemEmails(this.state.activeList, items)
      .then( res => {
        let alertString = `${res.deleted} deleted`
        let alertStyle = 'alert-green'
        this.alertInfo = {message: alertString, style: alertStyle}
        this.setState({items: res.current, alert: 'open'})
        setTimeout(this.closeAlert, ALERTIMEOUT);
      })

  }

  onDoneAddItems(items){
    ItemService.addItemEmails(this.state.activeList, items)
      .then(res => {
        let alertString = `${res.added} added ${res.existedIgnored + res.deletedIgnored} ignored`;
        let alertStyle = res.added ? 'alert-green' : 'alert-yellow';
        this.alertInfo = {message: alertString, style: alertStyle}
        this.setState({items: res.current, alert: 'open'})
        setTimeout(this.closeAlert, ALERTIMEOUT);
      });
    this.onModalClose();
  }

  onDoneAddList(name){
    ItemService.addList(name)
      .then(res => {
        this.alertInfo = {message: "Success!", style: 'alert-green'}
        this.setState({listServes: res.lists, alert: 'open'})
        setTimeout(this.closeAlert, ALERTIMEOUT);
      })
    this.onModalClose();
  }

  closeAlert(){
    this.setState({alert: 'close'});
  }

  render() {

    let modalComponent;
    switch(this.state.modalType){
      case 'addItems':
        modalComponent = (
          <AddItemPanel onAddItems={this.onDoneAddItems}/>
        );
        break;
      case 'copyItems':
        modalComponent = <CopyItemsPanel items={this.state.items}/>
        break;
      case 'addList':
        modalComponent = <AddListPanel onAddList={this.onDoneAddList}/>
        break;
      default: 
        modalComponent = null;
        break;

    }
    let isOpen = modalComponent ? true : false;

    let alertClass = "alert alert-full alert-fixed ";
    switch(this.state.alert){
      case 'open':
        alertClass += "is-active animate-fade-in " + this.alertInfo.style;
        break;
      case 'close':
        alertClass += "is-active animate-fade-out " + this.alertInfo.style;
        break;
      default:
        break;
    }

    return (
      <div>
        <header className="top-nav trailer-2">
          <div className="grid-container">
            <div className="column-24">
              <div className="tablet-hide">
                <a href="#" className="top-nav-title">ListServes</a>
              </div>
            </div>
          </div>
        </header>
        <div className={alertClass}>
          <span style={{"fontWeight": "bold"}}>{this.alertInfo.message}</span>
        </div>
        <ReactModal isOpen={isOpen} style={modalStyle}>
          <button
            onClick={this.onModalClose}
            className="btn btn-white btn-modal-close icon-ui-close icon-ui-flush icon-ui-red"/>
          {modalComponent}
        </ReactModal>
        <div className="grid-container">
          <div className="column-4">
            <SideNav
              title={"Lists"}
              navItems={this.state.listServes}
              activeItem={this.state.activeList}
              onClick={this.onListClick}
              onAddClick={this.onPlusListClick}/>
          </div>
          <div className="column-19 pre-1">
            <h3 className="column-8 left">{`Members (${this.state.items.length})`}</h3>
            <nav className="right post-4">
              <button
                onClick={this.onPlusClick}
                className="icon-ui-plus icon-ui-flush btn btn-clear btn-grouped"/>
              <button
                onClick={this.onCopyClick}
                className="icon-ui-duplicate icon-ui-flush btn btn-green btn-grouped"
                />
            </nav>
            <div className="column-15 list-container">
              <SearchList items={this.state.items} onDeleteClick={this.onDeleteItemClick}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
