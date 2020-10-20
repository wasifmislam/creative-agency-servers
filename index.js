const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faeh0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
const port = 5000;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("creativeAgency").collection("services");
  
    app.post('/addService', (req, res) => {
        const services = req.body;
        // console.log(service)
        servicesCollection.insertMany(services)
        .then(result => {
            console.log(result);
            console.log(result.insertedCount)
            res.send(result.insertedCount)
        })

  })

  app.get('/services', (req, res) => {
      servicesCollection.find({})
      .toArray( (err, documents) => {
          res.send(documents);
      })
  })
  const submitCollection = client.db("creativeAgency").collection("clients");
   app.post('/addSubmit', (req, res) => {
     const newSubmit = req.body;
     submitCollection.insertOne(newSubmit)
     .then(result => {
       console.log(result)
     })
     console.log(newSubmit);
   })

   app.get('/enrolledService', (req, res)=> {
    console.log(req.query.email);
    submitCollection.find({email: req.query.email})
    .toArray( (err, documents) => {
      res.send(documents)
    }) 
  })
  const submitReviews = client.db("creativeAgency").collection("reviews");
  app.post('/addReview', (req, res) => {
    const newSubmit = req.body;
    submitReviews.insertOne(newSubmit)
    .then(result => {
      console.log(result)
    })
    console.log(newSubmit);
  })

  app.get('/enrolledReviews', (req, res)=> {
    console.log(req.query.email);
    submitReviews.find({email: req.query.email})
    .toArray( (err, documents) => {
      res.send(documents)
    }) 
  })

});




app.get('/', (req, res) => {
  res.send('Hello World mongodb!')
})

app.listen(process.env.PORT || port)