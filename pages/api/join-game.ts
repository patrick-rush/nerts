import { config } from "@/constants/nerts";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const URI = config.NERTS_HTTP_URI
    const route = URI + 'join'
    const { name, code } = req.body

    let response
    try {
        response = await fetch(route, {
            method: 'POST',
            body: JSON.stringify({
                name,
                code
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

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