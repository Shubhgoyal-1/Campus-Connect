import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return Response.json({ error: 'No file received' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'avatars' }, (err, result) => {
                if (err || !result) return reject(err)
                resolve({ secure_url: result.secure_url })
            }).end(buffer)
        })

        return Response.json({
            url: uploadResult.secure_url
        }, {
            status: 200
        })
    } catch (error) {
        console.error('Cloudinary Upload Error:', error)
        return Response.json({
            error: 'Upload failed'
        }, {
            status: 500
        })
    }
}
