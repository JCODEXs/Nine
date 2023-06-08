import { createRouter } from 'next-connect';
import { MongoClient } from 'mongodb';
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER_URL}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const middleware = createRouter();
 middleware.get(dataBase); 

export async function dataBase(req,res,next) {
    req.dbClient = client;
    req.db = client.db('Cluster0');
           return next();
      }
    
  
      
      export default middleware;


 



