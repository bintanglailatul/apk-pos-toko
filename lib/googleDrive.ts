import { google } from "googleapis"
import { Readable } from "stream"

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive"],
})

export async function uploadToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const drive = google.drive({ version: "v3", auth })

  const stream = Readable.from(fileBuffer)

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: "id",
  })

  const fileId = res.data.id!

  // Jadikan file bisa dilihat publik lewat link
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  })

  return `https://drive.google.com/uc?export=view&id=${fileId}`
}