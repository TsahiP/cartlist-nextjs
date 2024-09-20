import axios from 'axios';
import { NextResponse } from 'next/server';



export const GET = async (req:any) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('query'); // מחלץ את הפרמטר 'query' מהכתובת
  console.log("🚀 ~ GET ~ name:", name); // מדפיס את השם

  try {
    const response = await axios.get(`https://www.shufersal.co.il/online/he/search/results?q=${encodeURIComponent(name)}%3Arelevance&limit=10`);
    
    // רק מחזיר את הנתונים עצמם, לא את כל אובייקט ה-Axios
    return NextResponse.json(response.data);
  } catch (err) {
    console.error('Error fetching data:', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
};




// export const GET = async (req: any) => {
//   const name = req;
//   console.log("🚀 ~ GET ~ name:", name)
//   try {
//     // const name = "עגבניה"; // Static query for now
//     const response = await axios.get(`https://www.shufersal.co.il/online/he/search/results?q=${encodeURIComponent(name)}%3Arelevance&limit=10`);
    
//     // Only return the actual data, not the whole Axios response object
//     return NextResponse.json(response.data);
//   } catch (err) {
//     console.error('Error fetching data:', err);
//     return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
//   }
// };
