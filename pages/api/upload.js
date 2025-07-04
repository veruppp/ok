import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { generateSlug } from "../../utils/generateSlug";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  const form = new IncomingForm({ uploadDir: "./public/uploads", keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const file = files.file[0];
    const ext = path.extname(file.originalFilename);
    const slug = generateSlug();
    const slug = Date.now().toString(36) + path.extname(file.originalFilename);
    const newName = slug + ext;
    const newPath = path.join("public/uploads", newName);
    fs.renameSync(file.filepath, newPath);

    const type = file.mimetype.split("/")[0];
    const dataFile = "data.json";
    const oldData = fs.existsSync(dataFile) ? JSON.parse(fs.readFileSync(dataFile, "utf8")) : [];
    oldData.push({
      slug,
      file: newName,
      type,
      name: file.originalFilename,
      uploaded_at: new Date().toISOString(),
    });
    fs.writeFileSync(dataFile, JSON.stringify(oldData, null, 2));

    return res.status(200).json({ url: `/e/${slug}` });
  });
}
