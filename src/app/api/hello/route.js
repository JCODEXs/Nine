

export async function GET(req ){

  return new Response (JSON.stringify({message:'Hello, Next.js!'}))
}
// export async function POST(req){
//   const body = await req.json()
//   console.log(body)

//   return new Response (JSON.stringify({back:"trre"}))
// }