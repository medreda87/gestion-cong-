import { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Image as ImageIcon,
  Download,
  X,
  Search,
  Eye,
  File,
  Loader2,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileSignature,
  Film,
  Music,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";

// ================= AXIOS =================
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ================= FILE URL HELPER =================
const getFileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/storage")) return `http://127.0.0.1:8000${path}`;
  return `http://127.0.0.1:8000/storage/${path}`;
};

// ================= FILE ICON HELPER =================
const getFileIcon = (mimeType) => {
  if (!mimeType) return <File size={32} />;
  if (mimeType.startsWith("image/")) return <ImageIcon size={32} />;
  if (mimeType === "application/pdf") return <FileSignature size={32} />;
  if (mimeType.includes("word") || mimeType.includes("document"))
    return <FileText size={32} />;
  if (mimeType.includes("sheet") || mimeType.includes("excel"))
    return <FileSpreadsheet size={32} />;
  if (mimeType.includes("zip") || mimeType.includes("rar"))
    return <FileArchive size={32} />;
  if (mimeType.includes("video")) return <Film size={32} />;
  if (mimeType.includes("audio")) return <Music size={32} />;
  if (mimeType.includes("javascript") || mimeType.includes("html"))
    return <FileCode size={32} />;
  return <File size={32} />;
};

// ================= FORMAT DATE =================
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function EmployeeDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get("/documents");
        setDocuments(res.data);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  // Filter documents by title
  const filtered = documents.filter((doc) =>
    doc.title?.toLowerCase().includes(search.toLowerCase())
  );

  const clearSearch = () => setSearch("");

  return (
    <DashboardLayout>
      <div >
        <div >
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              Company Documents
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Browse and download available documents
            </p>
          </div>

          {/* SEARCH & COUNTER */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
              {filtered.length} / {documents.length} documents
            </div>
          </div>

          {/* LOADING / ERROR / EMPTY STATES */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Loading documents...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <FileText className="w-16 h-16 mx-auto text-red-400 mb-3" />
              <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                {search
                  ? "No matching documents found."
                  : "No documents available at the moment."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((doc) => (
                <div
                  key={doc.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col"
                >
                  {/* Preview area */}
                  <div className="relative h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {doc.mime_type?.startsWith("image") ? (
                      <img
                        src={getFileUrl(doc.file_url)}
                        alt={doc.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        {getFileIcon(doc.mime_type)}
                        <span className="text-xs mt-2 capitalize">
                          {doc.mime_type?.split("/")[1] || "file"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1 mb-1">
                      {doc.title}
                    </h3>
                    {doc.created_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(doc.created_at)}
                      </p>

                    )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">Créer Par <strong>{doc.user.nom}</strong></p>

                  </div>


                  {/* Actions (only view/download, no delete) */}
                  <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <button
                      onClick={() => setPreview(doc)}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors "
                      title="Preview"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PREVIEW MODAL (same as director) */}
          {preview && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setPreview(null)}
            >
              <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
                    {preview.title}
                  </h2>
                  <button
                    onClick={() => setPreview(null)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-2 bg-gray-50 dark:bg-gray-900">
                  {preview.mime_type?.startsWith("image") ? (
                    <img
                      src={getFileUrl(preview.file_url)}
                      alt={preview.title}
                      className="w-full h-auto rounded-lg"
                    />
                  ) : (
                    <iframe
                      src={getFileUrl(preview.file_url)}
                      className="w-full h-[70vh] rounded-lg"
                      title={preview.title}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}