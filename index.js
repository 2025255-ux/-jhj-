import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import {
  Plus,
  LogOut,
  LogIn,
  Link2,
  Search,
  Lock,
  X,
  ShieldCheck,
  ExternalLink,
  Pencil,
  Trash2,
  Gamepad2,
  Wrench,
  Sparkles,
  Folder
} from "lucide-react";

// --- 定数・設定 ---
const ADMIN_ID = "2025255@mita-is.ed.jp";
const ADMIN_PASSWORD = "gag";
const CATEGORIES = ["すべて", "ゲーム", "サービス", "ツール", "その他"];

const categoryConfig = {
  "ゲーム": {
    icon: Gamepad2,
    color: "text-cyan-300",
    glow: "shadow-[0_0_20px_-5px_rgba(0,240,255,0.5)]",
    border: "hover:border-cyan-400/60"
  },
  "サービス": {
    icon: Wrench,
    color: "text-violet-300",
    glow: "shadow-[0_0_20px_-5px_rgba(112,0,255,0.5)]",
    border: "hover:border-violet-400/60"
  },
  "ツール": {
    icon: Sparkles,
    color: "text-fuchsia-300",
    glow: "shadow-[0_0_20px_-5px_rgba(255,0,200,0.5)]",
    border: "hover:border-fuchsia-400/60"
  },
  "その他": {
    icon: Folder,
    color: "text-sky-300",
    glow: "shadow-[0_0_20px_-5px_rgba(125,211,252,0.5)]",
    border: "hover:border-sky-400/60"
  }
};

// --- サブコンポーネント: AdminLogin ---
function AdminLogin({ open, onClose, onSuccess }) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim() === ADMIN_ID && password === ADMIN_PASSWORD) {
      setError("");
      onSuccess();
      setId("");
      setPassword("");
    } else {
      setError("IDまたはパスワードが正しくありません");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-cyan-400/20 bg-[#05070A]/95 p-8 shadow-[0_0_60px_-10px_rgba(0,240,255,0.3)]">
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-4 right-4 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-cyan-300" />
          </div>
          <h2 className="text-xl font-bold text-white">管理者アクセス</h2>
          <p className="text-sm text-white/50 mt-1">編集にはIDとパスワードが必要です</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300/70 mb-1.5">
              ID
            </label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoComplete="username"
              className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/60 px-4 py-2.5 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
              placeholder="IDを入力"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300/70 mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/60 px-4 py-2.5 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
              placeholder="パスワードを入力"
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400/90 hover:bg-cyan-300 text-[#05070A] font-semibold py-2.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            ロック解除
          </button>
        </form>
      </div>
    </div>
  );
}

// --- サブコンポーネント: LinkCard ---
function LinkCard({ link, isAdmin, onEdit, onDelete }) {
  const cfg = categoryConfig[link.category] || categoryConfig["その他"];
  const Icon = cfg.icon;

  return (
    <article
      className={`group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 transition-all duration-300 ${cfg.border} ${cfg.glow} hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`shrink-0 w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center ${cfg.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate text-lg">{link.title}</h3>
            <span className={`text-xs font-mono uppercase tracking-wider ${cfg.color}`}>{link.category}</span>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(link)}
              aria-label="編集"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(link)}
              aria-label="削除"
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {link.description && (
        <p className="mt-3 text-sm text-white/60 leading-relaxed line-clamp-2">{link.description}</p>
      )}
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-cyan-300 transition-colors"
      >
        アクセス <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </article>
  );
}

// --- サブコンポーネント: LinkFormDialog ---
function LinkFormDialog({ open, onClose, onSubmit, editingLink }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("その他");

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title || "");
      setUrl(editingLink.url || "");
      setDescription(editingLink.description || "");
      setCategory(editingLink.category || "その他");
    } else {
      setTitle("");
      setUrl("");
      setDescription("");
      setCategory("その他");
    }
  }, [editingLink, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl;
    onSubmit({ title: title.trim(), url: finalUrl, description: description.trim(), category });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-violet-400/20 bg-[#05070A]/95 p-8 shadow-[0_0_60px_-10px_rgba(112,0,255,0.3)]">
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-4 right-4 p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-white mb-6">{editingLink ? "リンクを編集" : "リンクを追加"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-violet-300/70 mb-1.5">
              タイトル
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-violet-400/60 px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-violet-400/20 transition-all"
              placeholder="例: Minecraft"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-violet-300/70 mb-1.5">
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-violet-400/60 px-4 py-2.5 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-violet-400/20 transition-all"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-violet-300/70 mb-1.5">
              説明
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-violet-400/60 px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-violet-400/20 transition-all resize-none"
              placeholder="簡単な説明（任意）"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-violet-300/70 mb-1.5">
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-violet-400/60 px-4 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-violet-400/20 transition-all"
            >
              <option value="ゲーム" className="bg-[#05070A]">ゲーム</option>
              <option value="サービス" className="bg-[#05070A]">サービス</option>
              <option value="ツール" className="bg-[#05070A]">ツール</option>
              <option value="その他" className="bg-[#05070A]">その他</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 font-medium py-2.5 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-violet-500/90 hover:bg-violet-400 text-white font-semibold py-2.5 transition-colors"
            >
              {editingLink ? "更新" : "追加"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- メインコンポーネント: Home ---
export default function Home() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [activeCategory, setActiveCategory] = useState("すべて");
  const [search, setSearch] = useState("");

  const loadLinks = async () => {
    setLoading(true);
    try {
      const page = await base44.entities.Link.filter({}, { sort: "sort_order,-created_date", limit: 100 });
      setLinks(page.items || []);
    } catch (e) {
      setLinks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const filtered = useMemo(() => {
    return links.filter((l) => {
      const catOk = activeCategory === "すべて" || l.category === activeCategory;
      const s = search.trim().toLowerCase();
      const searchOk = !s || (l.title || "").toLowerCase().includes(s) || (l.description || "").toLowerCase().includes(s);
      return catOk && searchOk;
    });
  }, [links, activeCategory, search]);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setLoginOpen(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleAdd = () => {
    setEditingLink(null);
    setFormOpen(true);
  };

  const handleEdit = (link) => {
    setEditingLink(link);
    setFormOpen(true);
  };

  const handleDelete = async (link) => {
    if (!window.confirm(`「${link.title}」を削除しますか？`)) return;
    try {
      await base44.entities.Link.delete(link.id);
      setLinks((prev) => prev.filter((l) => l.id !== link.id));
    } catch (e) {
      alert("削除に失敗しました");
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingLink) {
        const updated = await base44.entities.Link.update(editingLink.id, data);
        setLinks((prev) => prev.map((l) => (l.id === editingLink.id ? updated : l)));
      } else {
        const created = await base44.entities.Link.create(data);
        setLinks((prev) => [created, ...prev]);
      }
      setFormOpen(false);
      setEditingLink(null);
    } catch (e) {
      alert("保存に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="relative">
        <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-30 bg-[#05070A]/70">
          <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-[#05070A]" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none">リンクポータル</h1>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mt-0.5">curated nexus</p>
              </div>
            </div>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdd}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400/90 hover:bg-cyan-300 text-[#05070A] font-semibold text-sm px-3.5 py-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> 追加
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-sm px-3.5 py-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> ログアウト
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm px-3.5 py-2 transition-colors"
              >
                <LogIn className="w-4 h-4" /> 管理者ログイン
              </button>
            )}
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-5 pt-16 pb-10 text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            ゲームとサービスの
            <span className="block mt-2 bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent">
              ディスカバリーポータル
            </span>
          </h2>
          <p className="mt-5 text-white/50 max-w-xl mx-auto text-base leading-relaxed">
            お気に入りのゲームや便利なサービスのURLをひとつに。厳選されたリンク集から新しいデジタル体験へ。
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-5 pb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-white text-[#05070A]"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="検索..."
                className="w-full sm:w-64 rounded-full bg-white/5 border border-white/10 focus:border-cyan-400/40 pl-9 pr-4 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
              />
            </div>
          </div>
        </section>

        <main className="max-w-6xl mx-auto px-5 pb-20">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-white/40">
              {links.length === 0
                ? "まだリンクがありません。管理者ログインから追加してください。"
                : "該当するリンクが見つかりません。"}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="border-t border-white/5 py-10">
          <div className="max-w-6xl mx-auto px-5 text-center">
            <p
              className="text-[10vw] sm:text-[80px] font-extrabold leading-none text-transparent"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}
            >
              2025255
            </p>
            <p className="mt-4 text-xs font-mono uppercase tracking-widest text-white/30">
              link portal · curated nexus
            </p>
          </div>
        </footer>
      </div>

      <AdminLogin
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
      <LinkFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingLink(null);
        }}
        onSubmit={handleFormSubmit}
        editingLink={editingLink}
      />
    </div>
  );
}
