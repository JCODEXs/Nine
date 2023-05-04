import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base-de-datos>?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos');
    return client.db();
  } catch (err) {
    console.log('Error al conectarse a la base de datos', err);
  }
}
