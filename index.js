const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;


const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0qqdu.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("cityHospial");
    const servicesCollection = database.collection("services");
    const orderCollection = database.collection('orders');


    // GET API
    app.get("/services", async(req, res) =>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    })
    

    app.get('/services/:id', async (req, res) =>{
       const id = req.params.id
       const query ={_id: ObjectId(id)};
       const user = await servicesCollection.findOne(query)
       console.log('loaduser with id',id);
       res.send(user)
    })
  
    // DELETE API
    app.delete('/services/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await servicesCollection.deleteOne(query);
      
      console.log('deleiting user with id',result);
      res.json(result);
    })


    // POST API
    app.post("/services", async (req, res) => {
        const service = req.body;
      console.log("hit the post api", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // Add Orders API
    app.get('/orders',async (req,res)=>{
      let query = {};
      const email = req.query.email;
      if(email){
        query={email:email};
      }
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.json(orders);
    })
    app.post('/orders', async(req,res) =>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result)
    })

// CRUD OPERATION

app.get('/services/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = { _id: ObjectId(id) };
  const ticket = await servicesCollection.findOne(query);
  // console.log('load user id', id);
  res.send(ticket);
})


  } finally {

    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Hospital Server");
});

app.listen(port, () => {
  console.log("Running Hospital server on port", port);
});
