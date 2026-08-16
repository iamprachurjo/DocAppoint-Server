const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;
const app = express();
const cors = require("cors");

const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // DB creation
    const db = client.db("Prescripto");
    // Collection 
    const doctorsCollection = db.collection("doctors");
    const bookingCollection = db.collection("bookings")


    // create function added
    app.post("/doctors", async (req, res) => {
      const doctorData = req.body;
      const result = await doctorsCollection.insertOne(doctorData);
      res.json(result);
    });

    // 
    app.post("/bookings", async(req, res) => {
      const bookingData = req.body;
      const result = await bookingCollection.insertOne(bookingData)
      res.json(result)
    })

    // Get/read doctors from api
    app.get("/doctors", async (req, res) => {
      const result = await doctorsCollection.find().toArray();
      res.json(result);
    });

    // Get Single doctor data
    app.get("/appointments/:id", async (req, res) => {
      const { id } = req.params;
      const result = await doctorsCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
