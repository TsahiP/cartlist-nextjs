import axios from "axios";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") ?? "";

  // Call catalogue API
  const { data } = await axios.post(
    "https://www.rami-levy.co.il/api/catalog",
    { q: query }
  );

  const items: any[] = data?.data ?? [];
  const baseImgUrl = "https://www.rami-levy.co.il/_ipx/w_366,f_webp/https://img.rami-levy.co.il";

  // Keep only the fields we care about
  const filtered = items.map((item) => ({
    barcode: item.barcode,
    name: item.name,
    price: item.price?.price,
    image: item.images?.original
      ? `${baseImgUrl}${item.images.original}`
      : null,
  }));

  return NextResponse.json(filtered);
}; 