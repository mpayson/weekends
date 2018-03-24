import Papa from 'papaparse';

class ItemService{
  static getItems(){
    return ['hello', 'world', 'this', 'is', 'max'];
  }

  static getListServes(){
    return fetch('/api/listserves')
      .then(res => res.json())
      .then(rJson => rJson.listserves);
  }

  static getListMembers(listId){
    return fetch(`/api/listserves/${listId}`)
      .then(res => res.json())
      .then(rJson => rJson.members)
  }

  static getListMemberEmails(listId){
    return ItemService.getListMembers(listId)
      .then(mObjs => mObjs.map(m => m.email))
  }

  static addItems(listId, items){
    return fetch(`/api/listserves/${listId}/add`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'add': items})
    })
    .then(res => res.json())
  }

  static addItemEmails(listId, emails){
    const items = emails.map(e => ({'email': e}));
    return ItemService.addItems(listId, items)
      .then(res => {
        res.current = res.current.map(c => c.email);
        return res;
      })
  }

  static deleteItems(listId, items){
    return fetch(`/api/listserves/${listId}/delete`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'delete': items})
    })
    .then(res => res.json())
  }

  static deleteItemEmails(listId, emails){
    const items = emails.map(e => ({'email': e}));
    return ItemService.deleteItems(listId, items)
      .then(res => {
        res.current = res.current.map(c => c.email);
        return res;
      })
  }

  static addList(listId){
    return fetch(`/api/listserves/add`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'name': listId})
    })
    .then(res => res.json())
  }

  static parseString(string, delim=';'){
    //TODO add validation
    const cleanString = string.replace(/\s/g,'');
    if(!cleanString){
      return [];
    }
    return cleanString.split(delim);
  }

  static parseCsv(file){
    return new Promise((res, rej) => {
        Papa.parse(file, {
          header: true,
          complete: (data, file) => res(data),
          error: (er, file) => rej(er)
      });
    })
  }
}

export default ItemService;