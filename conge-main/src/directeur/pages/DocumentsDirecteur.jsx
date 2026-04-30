import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Trash2,
  FileText,
  Image as ImageIcon,
  Download,
  X,
  Search,
  FolderOpen,
  HardDrive,
  Eye,
  File,
  Grid3x3,
  Paperclip,
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function DocumentsDirecteur() {
  // Initialisation depuis localStorage
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem("directeur_documents");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Sauvegarde automatique
  useEffect(() => {
    try {
      localStorage.setItem("directeur_documents", JSON.stringify(documents));
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        alert(
          "Espace de stockage saturé. Supprimez des documents pour libérer de la place."
        );
      }
    }
  }, [documents]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType === "application/pdf") return "pdf";
    return "other";
  };

  const handleFileUpload = (files) => {
    if (!files) return;

    const fileArray = Array.from(files);
    Promise.all(
      fileArray.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: crypto.randomUUID(),
              name: file.name,
              type: getFileType(file.type),
              size: file.size,
              date: new Date().toISOString().split("T")[0],
              dataURL: reader.result,
              mimeType: file.type,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    )
      .then((newDocs) => {
        setDocuments((prev) => {
          const updated = [...newDocs, ...prev];
          try {
            localStorage.setItem("directeur_documents", JSON.stringify(updated));
            return updated;
          } catch (e) {
            alert(
              "Espace de stockage insuffisant. Supprimez des documents avant d'en ajouter."
            );
            return prev;
          }
        });
      })
      .catch((err) => {
        console.error("Erreur de lecture:", err);
        alert("Erreur lors de la lecture des fichiers.");
      });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDelete = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm("Supprimer tous les documents ?")) {
      setDocuments([]);
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

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "image" && doc.type === "image") ||
      (filterType === "pdf" && doc.type === "pdf");
    return matchesSearch && matchesFilter;
  });

  const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
  const totalFiles = documents.length;

  return (
    <DashboardLayout>
      <div >
        {/* En-tête avec statistiques */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                  <Paperclip size={24} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Gestion des documents
                </h1>
              </div>
              <p className="text-slate-500 ml-1">
                Gérez, prévisualisez et partagez vos fichiers
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
                <HardDrive size={18} className="text-indigo-500" />
                <span className="text-sm font-medium text-slate-700">
                  {formatFileSize(totalSize)}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200">
                <FolderOpen size={18} className="text-indigo-500" />
                <span className="text-sm font-medium text-slate-700">
                  {totalFiles} fichier{totalFiles > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone d'upload avec Drag & Drop */}
        <div
          className={`mb-8 transition-all duration-200 ${
            isDragging ? "scale-[1.01]" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div
            className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all cursor-pointer group ${
              isDragging
                ? "border-indigo-500 bg-indigo-50 shadow-lg"
                : "border-slate-300 bg-white/50 hover:border-indigo-400 hover:bg-indigo-50/30"
            } p-8 text-center`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload
              className={`mx-auto mb-4 transition-transform group-hover:scale-110 ${
                isDragging ? "text-indigo-500 scale-110" : "text-slate-400"
              }`}
              size={48}
            />
            <p className="text-lg font-medium text-slate-700">
              {isDragging
                ? "Déposez vos fichiers ici"
                : "Glissez-déposez vos fichiers"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              ou cliquez pour sélectionner (PDF, Images)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative flex-1 sm:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
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
            {documents.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-200 flex items-center gap-1.5"
                title="Supprimer tous"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Tout supprimer</span>
              </button>
            )}
          </div>
        </div>

        {/* Grille de documents */}
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md">
              <File size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-600">
                Aucun document
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {searchTerm || filterType !== "all"
                  ? "Aucun fichier ne correspond à votre recherche."
                  : "Commencez par importer des fichiers via le glisser-déposer."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Carte cliquable pour aperçu */}
                <div
                  className="p-5 flex-1 cursor-pointer"
                  onClick={() => setPreviewDoc(doc)}
                >
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
                  <h3
                    className="font-semibold text-slate-800 truncate mb-1"
                    title={doc.name}
                  >
                    {doc.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{doc.date}</span>
                    <span>{formatFileSize(doc.size)}</span>
                  </div>
                </div>

                {/* Actions (toujours visibles) */}
                <div className="flex items-center justify-end gap-0.5 p-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewDoc(doc);
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de prévisualisation */}
        {previewDoc && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-200"
            onClick={() => setPreviewDoc(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b bg-white">
                <h3 className="font-medium text-slate-800 truncate pr-4">
                  {previewDoc.name}
                </h3>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 flex items-center justify-center bg-slate-50/80 overflow-auto max-h-[calc(90vh-120px)]">
                {previewDoc.type === "image" ? (
                  <img
                    src={previewDoc.dataURL}
                    alt={previewDoc.name}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                ) : previewDoc.type === "pdf" ? (
                  <iframe
                    src={`${previewDoc.dataURL}#toolbar=0`}
                    className="w-full h-[70vh] rounded-lg"
                    title={previewDoc.name}
                  />
                ) : (
                  <div className="text-center py-12">
                    <File size={64} className="mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-500">
                      Aperçu non disponible pour ce type de fichier
                    </p>
                    <button
                      onClick={() => handleDownload(previewDoc)}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Télécharger
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}