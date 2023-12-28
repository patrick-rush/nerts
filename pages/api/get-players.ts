import { config } from "@/constants/nerts";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const URI = config.NERTS_HTTP_URI
    const code = req.query.code as string
    if (!code) return res.status(500).json({ message: "Missing code" });

    let response
    try {
        console.log(">>> URI", URI)
        response = await fetch(URI + '?code=' + encodeURIComponent(code))

        const responseJson = await response.json()
        return res.status(200).json({
            message: "Success",
            body: responseJson
        });
    } catch (err) {
        console.log("Error reaching Nerts API:", err)
        return res.status(500).json({ message: err });
    }
}