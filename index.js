const express = require('express')
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors())
const port = process.env.PORT || 5000
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xya5g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const newsCollection = client.db("news-daily").collection("news");
  const adminCollection = client.db("news-daily").collection("admin");
  // perform actions on the collection object
  app.get('/news', (req, res) => {
    newsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/isAdmin', (req, res) => {
    adminCollection.find({ email: req.query.email})
      .toArray((err, documents) => {
        if(documents.length !== 0){
          res.json({ isAdmin : true }).status(200)
        } else {
          res.json({ isAdmin : false, message: "permission denied" }).status(403)
        }
      })
  })
  // app.post('/allNews', (req, res) => {
  //   const news = req.body;
  //   newsCollection.insertMany(news, (err, result) => {
  //     res.send({count: result});
  //   })
  // })
  app.get('/news/:id', (req, res) => {
    const id = req.params.id;
    newsCollection.find({ _id: ObjectId(id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/addnews', (req, res) => {
    const news = req.body;
    newsCollection.insertOne(news, (err, result) => {
      res.send({ count: result });
    })
  })

  app.post('/addAdmin', (req, res) => {
    const news = req.body;
    adminCollection.insertOne(news, (err, result) => {
      res.send({ count: result });
    })
  })

  app.delete('/deleteNews/:id', (req, res) => {
    const id = req.params.id;
    newsCollection.deleteOne({_id: ObjectId(id)}, (err) => {
      
    })
  })

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

});


app.listen(port)