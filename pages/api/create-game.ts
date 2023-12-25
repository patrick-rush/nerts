import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const URI = process.env.NERTS_API_URI || 'http://localhost:3001/v1/game/create';
    const { name } = req.body

    let response
    try {
        console.log(">>> URI", URI)
        response = await fetch(URI, {
            method: 'POST',
            body: JSON.stringify({
                name
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