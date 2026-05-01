import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Image as ImageIcon,
  Eye,
  Download,
  File,
  FolderOpen,
  Paperclip,
  X,
  Grid3x3,
} from "lucide-react";
import { DashboardLayout } from "../components/layout/DashboardLayout";

export default function EmployeeDocuments() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [previewImage, setPreviewImage] = useState(null);

  // Chargement depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("directeur_documents");
      if (stored) {
        const parsed = JSON.parse(stored);
        setDocuments(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      setDocuments([]);
    }
  }, []);

  // Filtrage
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" ||
      (filterType === "pdf" && doc.type === "pdf") ||
      (filterType === "image" && doc.type === "image");
    return matchesSearch && matchesType;
  });

  // Aperçu selon le type
  const handleView = (doc) => {
    if (doc.type === "image") {
      setPreviewImage(doc);
    } else {
      const newWindow = window.open();
      newWindow.document.write(`
        <html>
          <head><title>${doc.name}</title></head>
          <body style="margin:0; background:#f1f5f9;">
            <iframe src="${doc.dataURL}" style="width:100%;height:100vh;border:none;"></iframe>
          </body>
        </html>
      `);
    }
  };

  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = doc.dataURL;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalFiles = documents.length;

  return (
    <DashboardLayout>
      <div >
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
              <Paperclip size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Documents</h1>
          </div>
          <p className="text-slate-500 ml-1">Fichiers partagés par la direction</p>
          {totalFiles > 0 && (
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-500 bg-white/60 backdrop-blur-sm w-fit px-3 py-1.5 rounded-full">
              <FolderOpen size={14} />
              <span>{totalFiles} document{totalFiles > 1 ? "s" : ""} disponible{totalFiles > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
                filterType === "all"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Grid3x3 size={16} />
              Tous
            </button>
            <button
              onClick={() => setFilterType("pdf")}
              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
                filterType === "pdf"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <FileText size={16} />
              PDF
            </button>
            <button
              onClick={() => setFilterType("image")}
              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all flex items-center gap-1.5 ${
                filterType === "image"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <ImageIcon size={16} />
              Images
            </button>
          </div>
        </div>

        {/* État vide */}
        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
              <File size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-600">Aucun document</h3>
              <p className="text-sm text-slate-400 mt-1">
                {searchTerm || filterType !== "all"
                  ? "Aucun fichier ne correspond à votre recherche."
                  : "Aucun document n’a encore été partagé."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Carte cliquable pour aperçu */}
                <div className="p-5 flex-1 cursor-pointer" onClick={() => handleView(doc)}>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        doc.type === "pdf"
                          ? "bg-red-50 text-red-500"
                          : "bg-green-50 text-green-500"
                      }`}
                    >
                      {doc.type === "pdf" ? (
                        <FileText size={26} />
                      ) : (
                        <ImageIcon size={26} />
                      )}
                    </div>
                    {/* Badge type */}
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        doc.type === "pdf"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {doc.type === "pdf" ? "PDF" : "Image"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-800 truncate mb-1" title={doc.name}>
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-400">{doc.date}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-0.5 p-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(doc);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Aperçu"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Télécharger"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modale d'aperçu image */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setPreviewImage(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <h3 className="font-medium text-slate-800 truncate pr-4">
                  {previewImage.name}
                </h3>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 flex items-center justify-center bg-slate-50/80">
                <img
                  src={previewImage.dataURL}
                  alt={previewImage.name}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}