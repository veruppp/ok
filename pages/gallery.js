import fs from "fs";
import path from "path";

export async function getServerSideProps() {
  const dir = path.join(process.cwd(), "public/uploads");
  const files = fs.readdirSync(dir);

  return {
    props: {
      files,
    },
  };
}

export default function Gallery({ files }) {
  return (
    <main className="min-h-screen bg-blue-50 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">📂 Galeri Publik</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((file, i) => (
          <a key={i} href={`/e/${file}`} target="_blank" rel="noopener noreferrer">
            <div className="bg-white rounded shadow p-2 text-center">
              {file.match(/\.(jpg|png|jpeg|gif|webp)$/i) ? (
                <img src={`/uploads/${file}`} alt={file} className="w-full h-32 object-cover rounded" />
              ) : file.match(/\.(mp4|webm|mov)$/i) ? (
                <video src={`/uploads/${file}`} controls className="w-full h-32 object-cover rounded" />
              ) : file.match(/\.(mp3|wav|ogg)$/i) ? (
                <audio src={`/uploads/${file}`} controls className="w-full w-full" />
              ) : (
                <p>{file}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
