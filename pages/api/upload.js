import fs from 'fs';
import path from 'path';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'public/uploads');
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload error' });

    const file = files.file;
    const slug = Date.now().toString(36) + path.extname(file.originalFilename); // 👈 Di sinilah
    const newPath = path.join(form.uploadDir, slug);

    fs.rename(file.filepath, newPath, (err) => {
      if (err) return res.status(500).json({ error: 'Rename error' });

      return res.status(200).json({ url: `/e/${slug}` }); // 👈 Pastikan ini dikirim ke frontend
    });
  });
}
