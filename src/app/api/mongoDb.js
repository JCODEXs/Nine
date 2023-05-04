import { connectToDatabase } from '../utils/db';

export async function getStaticProps() {
  const db = await connectToDatabase();
  const data = await db.collection('coleccion').find().toArray();

  return {
    props: {
      data: JSON.parse(JSON.stringify(data))
    }
  };
}
