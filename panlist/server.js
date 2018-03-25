const express = require('express')
const bodyParser = require('body-parser');
const Store = require('./Store.js')

let data;
try{
  data = require('./store.json');
}
catch (e){
  console.log("DATA STORE DOESN'T EXIST, CREATING EMPTY STORE");
  data = {};
}

const app = express()

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/client/build'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 3001));

const store = new Store(data, filePath='./store.json');

app.get('/', (req, res) => res.send('here I am!'));

app.get('/api/listserves', (req, res) => {
  const listServes = store.getListServes();
  res.send(JSON.stringify({'listserves': listServes}))
})

app.get('/api/listserves/:name', (req,res) => {
  const name = req.params.name;
  res.send(JSON.stringify({'members': store.getListMembers(name)}))
})

app.post('/api/listserves/:name/add', (req,res) => {
  const name = req.params.name;
  const add = req.body.add;
  store.addListMembers(name, add)
    .then(updates => res.send(JSON.stringify(updates)))
    .catch(er => res.status(500).send(er))
})

app.post('/api/listserves/:name/delete', (req,res) => {
  const name = req.params.name;
  const del = req.body.delete;
  store.deleteListMembers(name, del)
    .then(updates => res.send(JSON.stringify(updates)))
    .catch(er => res.status(500).send(er))
})

app.post('/api/listserves/add', (req,res) => {
  const name = req.body.name;
  store.addList(name)
    .then(result => res.send(JSON.stringify(result)))
    .catch(er => res.status(500).send(er))
})

// Listen on the port
app.listen(app.get('port'), () => {
  console.log(`${(process.env.NODE_ENV||'dev')} server at: http://localhost:${app.get('port')}/`);
});