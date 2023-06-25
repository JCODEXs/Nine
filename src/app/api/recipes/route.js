import { connectToDatabase,insertDocument } from '../../../lib/mongoDb.js';
import { NextResponse } from 'next/server';
export async function POST(req,res) {
  const body= await req.json()
 // console.log('req:', body);
 
  const  cached  = await connectToDatabase();
  const db=cached.conn.db

 // console.log('rdb:', db)
    // case 'GET':
    //   // const asset = { id: req.body, files: await getFiles(req.body) };
    //   // res.status(404).json(asset);
    //   res
    //     .status(200)
    //     .json({ id: req.query.id, files: await getFiles(req.query.id) });
    //   break;
  
      const result = await db.collection('recipes').insertOne(body);
      console.log(result);
    return NextResponse.json({result})
      // res.status(404).json({});

  }
  export async function GET(req, res) {

    const  cached  = await connectToDatabase();
    const db=cached.conn.db
  
    
        const result = await db.collection('recipes').find().toArray();
        console.log(result);
        return NextResponse.json({result})
        // res.status(404).json({});
  
    }
  