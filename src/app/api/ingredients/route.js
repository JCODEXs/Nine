import { connectToDatabase } from '../../../lib/mongoDb.js';
import { NextResponse } from 'next/server';
export async function GET(req) {
  console.log('req:', req);
 
  const { db } = await connectToDatabase();
  console.log('rdb:', db)
    // case 'GET':
    //   // const asset = { id: req.body, files: await getFiles(req.body) };
    //   // res.status(404).json(asset);
    //   res
    //     .status(200)
    //     .json({ id: req.query.id, files: await getFiles(req.query.id) });
    //   break;
  
      const result = await db.collection('recipes').findOne();
      console.log(result);
     NextResponse.json({result})
      // res.status(404).json({});

  }
  export async function POST(req, res) {
    console.log('req:', req);
    console.log('res:', res);
  
    const { db } = await connectToDatabase(req,res);
    
      // case 'GET':
      //   // const asset = { id: req.body, files: await getFiles(req.body) };
      //   // res.status(404).json(asset);
      //   res
      //     .status(200)
      //     .json({ id: req.query.id, files: await getFiles(req.query.id) });
      //   break;
    
        const result = await db.collection('recipes').findOne();
        console.log(result);
        new Response({result})
        // res.status(404).json({});
  
    }
  