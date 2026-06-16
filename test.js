const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://1234tanuyy_db_user:OJoHDrwWDdcOSvZt@cluster0.2jm9kh9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected Successfully!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);