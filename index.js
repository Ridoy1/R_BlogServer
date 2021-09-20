const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
const { object } = require('webidl-conversions');
require('dotenv').config()

const port = process.env.PORT || 5050;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qom3b.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    
  const eventCollection = client.db("Blog").collection("events");
  
    app.get('/events', (req, res) => {
        eventCollection.find()
        .toArray((err, items) => {
            res.send(items)
        })
    })  

    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        console.log('adding new event', newEvent)
        eventCollection.insertOne(newEvent)
        .then(result => {
            console.log('inserted count', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log('delete this', id);
        eventCollection.deleteOne({_id: id})
        .then(result => {
            console.log(result);
            res.send(result.deletedCount > 0)
        })
    })

//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})