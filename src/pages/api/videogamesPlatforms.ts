import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Platform2 } from "@/types";
type Data = {
  error?: string;
  platforms?: string[]|undefined;
};
export const config = {
  api: {
    responseLimit: "5mb",
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const response = await axios.get("https://api.rawg.io/api/platforms/lists/parents", {
      params: {
        key: process.env.API_KEY_RAWG,
      },
    });
    console.log(response.data.results)
    const platforms = response.data.results.map((platform:Platform2)=>platform.name)
  res.status(200).json({ platforms: platforms });
}

