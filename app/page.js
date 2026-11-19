"use client";
import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

export default function Home() {
  const [original, setOriginal] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setOriginal(URL.createObjectURL(file));
    setResult(null);
    setLoading(true);
    try {
      const blob = await removeBackground(file);
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      alert("Xóa nền bị lỗi, thử ảnh khác nhé");
    }
    setLoading(false);
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tủ đồ của mình</h1>

      <input type="file" accept="image/*" onChange={handleFile} className="mb-4" />

      {loading && <p>Đang xóa nền... (lần đầu hơi lâu vì phải tải mô hình)</p>}

      <div className="grid grid-cols-2 gap-2">
        {original && <img src={original} alt="Ảnh gốc" className="rounded" />}
        {result && (
          <img
            src={result}
            alt="Đã xóa nền"
            className="rounded bg-[repeating-conic-gradient(#ddd_0_25%,#fff_0_50%)] bg-[length:16px_16px]"
          />
        )}
      </div>
    </main>
  );
}