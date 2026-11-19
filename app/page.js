"use client";
import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";

const CATEGORIES = ["Áo", "Quần", "Váy", "Đầm", "Áo khoác", "Giày", "Phụ kiện"];

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border-2 border-[var(--ink)] px-4 py-1.5 text-sm font-bold ${
        active ? "bg-[var(--pink)] text-white" : "bg-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [original, setOriginal] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Áo");
  const [closet, setCloset] = useState([]);
  const [filter, setFilter] = useState("Tất cả");

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
      alert("Xóa nền bị lỗi, bạn thử ảnh khác nhé");
      setOriginal(null);
    }
    setLoading(false);
    e.target.value = "";
  }

  function addToCloset() {
    setCloset([{ id: Date.now(), src: result, category }, ...closet]);
    setOriginal(null);
    setResult(null);
  }

  function reset() {
    setOriginal(null);
    setResult(null);
  }

  const shown =
    filter === "Tất cả" ? closet : closet.filter((i) => i.category === filter);

  return (
    <main className="mx-auto max-w-md px-4 pb-24 pt-8">
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold leading-none">Tủ đồ của mình</h1>
        <p className="mt-2 text-sm opacity-80">
          Chụp hoặc chọn ảnh, nền sẽ tự biến mất.
        </p>
      </header>

      {/* Khu thêm đồ */}
      {!original && (
        <label className="sticker press flex cursor-pointer flex-col items-center gap-1 bg-[var(--butter)] px-6 py-8 text-center">
          <span className="font-display text-5xl leading-none">+</span>
          <span className="font-display text-xl font-bold">Thêm món đồ</span>
          <span className="text-sm opacity-80">Chụp mới hoặc chọn từ thư viện</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      )}

      {/* Đang xử lý */}
      {original && !result && (
        <div className="sticker overflow-hidden p-3">
          <img
            src={original}
            alt="Ảnh gốc"
            className="h-72 w-full animate-pulse rounded-2xl object-contain"
          />
          <p className="mt-3 text-center text-sm font-medium">
            Đang tách nền... Lần đầu hơi lâu vì phải tải mô hình.
          </p>
        </div>
      )}

      {/* Có kết quả */}
      {result && (
        <div className="sticker p-3">
          <div className="checker rounded-2xl">
            <img src={result} alt="Đã xóa nền" className="h-72 w-full object-contain" />
          </div>

          <p className="mb-2 mt-4 text-sm font-bold">Đây là loại đồ nào?</p>
          <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-1">
            {CATEGORIES.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </Chip>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              onClick={reset}
              className="sticker press col-span-1 py-3 text-sm font-bold"
            >
              Chụp lại
            </button>
            <button
              onClick={addToCloset}
              className="sticker press col-span-2 bg-[var(--pink)] py-3 font-display text-lg font-bold text-white"
            >
              Cho vào tủ
            </button>
          </div>
        </div>
      )}

      {/* Tủ đồ */}
      <section className="mt-10">
        <h2 className="mb-3 text-2xl font-extrabold">
          Tủ đồ <span className="opacity-60">({closet.length})</span>
        </h2>

        <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {["Tất cả", ...CATEGORIES].map((c) => (
            <Chip key={c} active={filter === c} onClick={() => setFilter(c)}>
              {c}
            </Chip>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="sticker bg-[var(--lilac)] p-6 text-center">
            <p className="font-display text-lg font-bold">
              {closet.length === 0 ? "Tủ còn trống" : "Chưa có món nào ở loại này"}
            </p>
            <p className="text-sm">
              {closet.length === 0
                ? "Thêm món đầu tiên để bắt đầu nhé."
                : "Thử chọn loại khác hoặc thêm món mới."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {shown.map((item) => (
              <div key={item.id} className="sticker p-2">
                <div className="checker rounded-xl">
                  <img
                    src={item.src}
                    alt={item.category}
                    className="h-36 w-full object-contain"
                  />
                </div>
                <p className="mt-2 text-center text-sm font-bold">{item.category}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}