// function handler(req,res){
//     console.log(res,req)
  
//         const ingredient=req.body.ingredient;
        
//         console.log(ingredient)
//         res.status(422).json("hi")
//         return
  
// }
// export default handler

 

  import {
    connectDatabase,
    insertDocument,
    getAllDocuments,
  } from '../../../lib/mongoDb';
  
  export async function handler(req, res) {
    //const type = req.query.type;
    console.log(res,req)
    let client;
  
    try {
      client = await connectDatabase(req,res);
    } catch (error) {
      return  new Response(JSON.stringify({ message: 'Connecting to the database failed!' }));
      
    }
 
    if (req.method === 'POST') {
      const { email, name, text } = req.body;
  
      if (
        !email.includes('@') ||
        !name ||
        name.trim() === '' ||
        !text ||
        text.trim() === ''
      ) {
        res.status(422).json({ message: 'Invalid input.' });
        client.close();
        return;
      }
  
      const newComment = {
        email,
        name,
        text,
        eventId,
      };
  
      let result;
  
      try {
        result = await insertDocument(client, 'comments', newComment);
        newComment._id = result.insertedId;
        res.status(201).json({ message: 'Added comment.', comment: newComment });
      } catch (error) {
        res.status(500).json({ message: 'Inserting comment failed!' });
      }
    }
  
    if (req.method === 'GET') {
      try {
        const documents = await getAllDocuments(client, 'comments', { _id: -1 });
        res.status(200).json({ comments: documents });
      } catch (error) {
        res.status(500).json({ message: 'Getting comments failed.' });
      }
    }
  
    client.close();
  }
  
