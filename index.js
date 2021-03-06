const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const port = 5000;
require("dotenv").config();

const dbname = "emajohnStore";
const password = "emajohnPotter12";
const username = "emajohnUser";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors())

const uri = `mongodb+srv://emajohnUser:emajohnPotter12@cluster0.4zce5.mongodb.net/emajohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productCollection = client.db("emajohnStore").collection("products")
  const orderCollection = client.db("emajohnStore").collection("orders")

  app.post("/addProduct",(req,res) => {
      const product = req.body;
      productCollection.insertOne(product)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount)
      })
  })

  //Add order
  app.post('/addOrder',(req,res) => {
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

  //get data from database
  app.get('/products',(req,res) => {
      productCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

    //Dynamic product key: product details
    app.get('/product/:key',(req,res) => {
        productCollection.find({key:req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    //products by key
    app.post('/productsByKeys',(req,res) => {
      const productKey = req.body
      productCollection.find({key:{$in:productKey}})
      .toArray((err,documents) => {
        res.send(documents);
      })
    })

});




app.get("/", (req, res) => {
  res.send("Ema john server is running");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
