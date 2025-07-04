import { useState } from "react";

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [link, setLink] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      const res = JSON.parse(xhr.responseText);
      setLink(window.location.origin + res.url);
    };

    xhr.send(formData);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("✅ Tersalin ke clipboard!");
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">☁️ V-Cloud Uploader</h1>
      <form onSubmit={handleUpload} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <input type="file" name="file" required className="mb-4" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Upload
        </button>
        <div className="mt-4 bg-gray-200 rounded h-6 overflow-hidden">
          <div
            className="bg-blue-500 text-white text-xs h-full text-center transition-all duration-300"
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      </form>

      {link && (
        <div className="mt-6 bg-white p-4 rounded shadow-md w-full max-w-md">
          <p className="text-green-600 mb-2">✅ File berhasil diupload!</p>
          <div className="mb-2">
            <label className="block text-sm text-gray-700">🔗 Public Link:</label>
            <input value={link} readOnly className="w-full px-2 py-1 border rounded text-sm" />
            <button onClick={() => copyToClipboard(link)} className="mt-1 text-blue-600 text-sm underline">Copy Link</button>
          </div>
          <div className="mt-2">
            <label className="block text-sm text-gray-700">📎 Embed Code:</label>
            <textarea
              value={`<iframe src="${link}" frameborder="0" allowfullscreen style="width:100%;height:400px;"></iframe>`}
              readOnly
              className="w-full px-2 py-1 border rounded text-sm"
              rows={3}
            />
            <button
              onClick={() => copyToClipboard(`<iframe src="${link}" frameborder="0" allowfullscreen style="width:100%;height:400px;"></iframe>`)}
              className="mt-1 text-blue-600 text-sm underline"
            >
              Copy Embed Code
            </button>
          </div>
        </div>
      )}
      <a href="/gallery" className="mt-6 text-blue-500 underline">Lihat Galeri Publik</a>
    </main>
  );
}
