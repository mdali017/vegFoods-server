const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.send('VegFoods Server is Running');
})

// ---------------------------------------




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.5julrfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection = client.db("vegFoodsDB").collection("products");
    const cartCollection = client.db("vegFoodsDB").collection("carts");

    // ------------------------------------------------------------ All product related apis
    app.get('/allproducts', async (req, res) => {
      const products = await productsCollection.find().toArray();
      res.send(products)
    })

    // -------------------------------------------------------------- Cart Related Apis -----------
    app.post('/carts', async (req, res) => {
      const item = req.body;
      // console.log(item)
      const result = await cartCollection.insertOne(item);
      res.send(result);
    })

    app.get('/carts', async (req, res) => {
      const email = req.query.email;

      if (!email) {
        res.send([])
      }
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`VegFoods Sever is Running on Port : ${port}`)
})