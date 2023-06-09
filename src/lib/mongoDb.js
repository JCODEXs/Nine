//const { MongoClient } = require("mongodb");
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { NextApiResponse } from "next";
const MONGODB_DB  = "Nine";
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_URL}/?retryWrites=true&w=majority`

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}
if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}


const connectToDatabase = async () => {
  console.log("here")
 let cached={};
  const conn = {};
  const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  //  console.log("conecting")
  const promise= MongoClient.connect(uri, opts)
      .then((client) => {
        conn.client = client;
      const db = client.db(MONGODB_DB)
        console.log(db,"conected")
        return db;
      })
      .then((db) => {
        conn.db = db;
    //  const   recipes=  db.collection("Recipes")
        cached.conn = conn;
            });
      await promise;
      //  console.log(promise,cached)
      return cached
    }
 

 async function insertDocument( collection, document) {
  const db= await connectToDatabase()
  //console.log(db)

  const result = await db.collection(collection).insertOne(document);

  return result;
}

 async function getAllDocuments(client, collection, sort) {
  const db = client.db();

  const documents = await db
    .collection(collection)
    .find()
    .sort(sort)
    .toArray();

  return documents;
}
module.exports = {
  connectToDatabase,insertDocument,getAllDocuments
};