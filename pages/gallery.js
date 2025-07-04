import fs from "fs";

export async function getServerSideProps() {
  const data = fs.existsSync("data.json") ? JSON.parse(fs.readFileSync("data.json", "utf8")) : [];
  return { props: { files: data.reverse() } };
}

export default function Gallery({ files }) {
  return (
    <main className="min-h-screen p-6 bg-blue-50">
      <h1 className="text-3xl text-center font-bold text-blue-600 mb-6">📁 Galeri Publik</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((file) => (
          <div key={file.slug} className="bg-white p-2 rounded shadow">
            {file.type === "image" && <img src={`/uploads/${file.file}`} alt={file.name} className="rounded" />}
            {file.type === "video" && (
              <video src={`/uploads/${file.file}`} controls className="rounded" />
            )}
            {file.type === "audio" && (
              <audio src={`/uploads/${file.file}`} controls className="w-full" />
            )}
            <a href={`/e/${file.slug}`} target="_blank" className="text-blue-500 text-sm block mt-1 truncate">
              /e/{file.slug}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
