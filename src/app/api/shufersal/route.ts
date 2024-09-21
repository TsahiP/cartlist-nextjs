// import axios from 'axios';
// import { NextResponse } from 'next/server';
// import https from 'https';
// import { env } from 'process';

// const agent = new https.Agent({
//   rejectUnauthorized: false, // Disables SSL validation, be cautious with this in production
// });

// export const GET = async (req: any) => {
//   const { searchParams } = new URL(req.url);
//   const name = searchParams.get('query') ?? ''; // Extract the 'query' parameter from the URL

//   try {
//     // Proxy configuration with credentials from environment variables
//     const proxyConfig = {
//       host: 'brd.superproxy.io',
//       port: 22225,
//       auth: {
//         username: process.env.PROXY_USERNAME || '',
//         password: process.env.PROXY_PASSWORD || '',
//       },
//     };

//     const response = await axios.get(`https://www.shufersal.co.il/online/he/search/results?q=${encodeURIComponent(name)}%3Arelevance&limit=10`, {
//       proxy: proxyConfig,
//       httpsAgent: agent, // Use the agent if needed
//     });
//     console.log("🚀 ~ response ~ response:", response)

//     // Return only the data from the Axios response
//     return NextResponse.json(response.data);
//   } catch (err) {
//     console.error('Error fetching data:', err);
//     return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
//   }
// };


import axios from 'axios';
import { NextResponse } from 'next/server';



export const GET = async (req:any) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('query') ??""; // מחלץ את הפרמטר 'query' מהכתובת
  // const name ="";
  try {
    // const response = await axios.get(`https://www.shufersal.co.il/online/he/search/sitepopular?categoryCode=categories&n=10000&limit=10000&page=2`);
    const response = await axios.get(`https://www.shufersal.co.il/online/he/search/results?q=${encodeURIComponent(name)}%3Arelevance&limit=100000`);
    console.log("🚀 ~ GET ~ response:", response)
    
    // רק מחזיר את הנתונים עצמם, לא את כל אובייקט ה-Axios
    return NextResponse.json(response.data);
  } catch (err) {
    console.error('Error fetching data:', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
};