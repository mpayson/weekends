const fs = require('fs');

const TEMPLATE = {
  "current": [],
  "deleted": []
}

const UIDFIELD = 'email';

module.exports = class Store {
  constructor(data, filePath){
    this.data = data;
    this.filePath = filePath;
    this.rollback = JSON.stringify(data);
  }

  getListServes(){
    return Object.keys(this.data);
  }

  getListMembers(listId){
    return this.data[listId].current;
  }

  serialize(){
    let data = JSON.stringify(this.data, null, 2);

    return new Promise( (res, rej) => {
      fs.writeFile(this.filePath, data, (err) => {  
        if (err) {
          this.data = JSON.parse(this.rollback);;
          rej(err)
        };
        this.rollback = data;
        res("SUCCESS");
      });
    })

  }

  deleteListMembers(listId, deleteMembers){
    let members = this.data[listId];

    const deleteIds = new Set(deleteMembers.map(m => m[UIDFIELD]));

    const timestamp = Math.floor(Date.now() / 1000);

    let keeps = [];
    let deleted = 0;

    for(let m of members.current){
      if(deleteIds.has(m[UIDFIELD])){
        m.dateDeleted = timestamp;
        members.deleted.push(m);
        deleted += 1;
      } else {
        keeps.push(m)
      }
    }
    members.current = keeps;
    return this.serialize()
      .then(res => ({
        "deleted": deleted,
        "current": this.getListMembers(listId)
      }))
  }



  addListMembers(listId, newMembers, ignDeletes=true){
    let members = this.data[listId];

    const existIds = new Set(members.current.map(m => m[UIDFIELD]));
    const deleteIds = new Set(members.deleted.map(m => m[UIDFIELD]));

    let existIgn = 0;
    let delIgn = 0;
    let added = 0;

    const timestamp = Math.floor(Date.now() / 1000);

    for(let m of newMembers){
      if (existIds.has(m[UIDFIELD])){
        existIgn += 1;
      } else if (deleteIds.has(m[UIDFIELD]) && ignDeletes){
        delIgn += 1;
      } else{
        m.dateAdded = timestamp;
        members.current.push(m);
        added += 1;
      }
    }

    return this.serialize()
      .then(res => ({
        "added": added,
        "existedIgnored": existIgn,
        "deletedIgnored": delIgn,
        "current": this.getListMembers(listId)
      }))
  }

  addList(listId){
    this.data[listId] = TEMPLATE;
    console.log(listId, this.data[listId])
    return this.serialize()
      .then(res => ({"lists": this.getListServes()}));
  }

  deleteList(listId){
    delete this.data[listId];
    return this.serialize()
      .then(res => ({"lists": this.getListServes()}))
  }

}