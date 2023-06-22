import { NextResponse } from "next/server";

// export async function POST(req, res) {
//   const Data = await req.json();
//   console.log(Data);
//   return NextResponse.json({ Data });
// }

// export async function GET(req, res) {
//   //const Data = await req.json();
//   // console.log(Data);
//   return NextResponse.json({ Data: "firts" });
// }
export async function POST(req, res) {
  try {
    return NextResponse.json({ Data: "data " });
  } catch (error) {
    console.error("Error fetching persisted data:", error);
    return NextResponse.json(
      { error: "Failed to fetch persisted data" },
      { status: 500 }
    );
  }
}

async function validateAndParseData(req) {
  const requestData = await req.json();
  // Perform input validation on the requestData object
  if (!isValidData(requestData)) {
    throw new Error("Invalid data");
  }
  // Parse the validated data
  const data = JSON.parse(requestData);
  return data;
}

function isValidData(data) {
  console.log(data);
  // Implement your input validation logic here
  // Return true if the data is valid, false otherwise
  // You can perform checks such as presence, type, format, or custom validations
  // For example:
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }
  // Additional validation checks...
  return true;
}
