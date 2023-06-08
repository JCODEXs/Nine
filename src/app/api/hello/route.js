import { connectToDatabase } from "@/lib/mongoDb"

export async function GET(req ){
  const client= await connectToDatabase()
   console.log(client)
  

  return new Response (JSON.stringify({message:'Hello, Next.js!'}))
}
// export async function POST(req){
//   const body = await req.json()
//   console.log(body)

//   return new Response (JSON.stringify({back:"trre"}))
// }