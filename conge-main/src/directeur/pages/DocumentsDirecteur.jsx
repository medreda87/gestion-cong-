import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {Upload,Trash2,FileText,Image as ImageIcon,Download,X,Search,FolderOpen,HardDrive,Eye,File,Grid3x3,Paperclip,Link as LinkIcon,Plus,Database,
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default function DocumentsDirecteur() {
  const [localDocuments, setLocalDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem("directeur_documents");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  // ========== Documents externes (API) ==========
  const [externalDocuments, setExternalDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Formulaires
  const [newLocalTitle, setNewLocalTitle] = useState("");
  const [newLocalFile, setNewLocalFile] = useState(null);
  const [newExternalTitle, setNewExternalTitle] = useState("");
  const [newExternalUrl, setNewExternalUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const localFileInputRef = useRef(null);

  // ========== Charger les documents externes ==========
  const fetchExternalDocuments = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await api.get("/documents");
      // Garantir que c'est un tableau
      let documents = [];
      if (Array.isArray(response.data)) {
        documents = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        documents = response.data.data;
      } else {
        console.warn("Format inattendu:", response.data);
      }
      setExternalDocuments(documents);
    } catch (err) {
      console.error(err);
      setApiError("Impossible de charger les documents depuis le serveur.");
      setExternalDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExternalDocuments();
  }, []);

  // Sauvegarde automatique des documents locaux
  useEffect(() => {
    try {
      localStorage.setItem("directeur_documents", JSON.stringify(localDocuments));
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        alert("Stockage saturé. Supprimez des documents locaux.");
      }
    }
  }, [localDocuments]);

  // ========== Utilitaires ==========
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileType = (mimeType) => {
    if (mimeType?.startsWith("image/")) return "image";
    if (mimeType === "application/pdf") return "pdf";
    return "other";
  };

  const getFileTypeFromUrl = (url) => {
    const path = url.toLowerCase();
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/.test(path)) return "image";
    if (/\.pdf$/.test(path)) return "pdf";
    return "other";
  };

  // ========== Gestion documents locaux ==========
  const handleAddLocalDocument = () => {
    if (!newLocalFile) return alert("Sélectionnez un fichier.");
    if (!newLocalTitle.trim()) return alert("Saisissez un titre.");

    setIsAdding(true);
    const reader = new FileReader();
    reader.onload = () => {
      const newDoc = {
        id: crypto.randomUUID(),
        title: newLocalTitle.trim(),
        name: newLocalFile.name,
        source: "local",
        type: getFileType(newLocalFile.type),
        size: newLocalFile.size,
        dataURL: reader.result,
      };
      setLocalDocuments(prev => [newDoc, ...prev]);
      setNewLocalTitle("");
      setNewLocalFile(null);
      if (localFileInputRef.current) localFileInputRef.current.value = "";
      setIsAdding(false);
    };
    reader.onerror = () => {
      alert("Erreur de lecture.");
      setIsAdding(false);
    };
    reader.readAsDataURL(newLocalFile);
  };

  const handleFileUpload = (files) => {
    if (!files) return;
    const fileArray = Array.from(files);
    Promise.all(
      fileArray.map(file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          id: crypto.randomUUID(),
          title: file.name,
          name: file.name,
          source: "local",
          type: getFileType(file.type),
          size: file.size,
          date: new Date().toISOString().split("T")[0],
          dataURL: reader.result,
          mimeType: file.type,
        });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      }))
    ).then(newDocs => setLocalDocuments(prev => [...newDocs, ...prev]))
     .catch(err => alert("Erreur de lecture."));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDeleteLocal = (id) => {
    setLocalDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleDeleteAllLocal = () => {
    if (window.confirm("Supprimer tous les documents locaux ?")) {
      setLocalDocuments([]);
    }
  };

  // ========== Gestion documents externes (API uniquement) ==========
  const handleAddExternalDocument = async () => {
    if (!newExternalUrl.trim()) return alert("URL requise.");
    if (!newExternalTitle.trim()) return alert("Titre requis.");
    try {
      new URL(newExternalUrl); 
      // validation
    } catch {
      return alert("URL invalide.");
    }

    setIsAdding(true);
    try {
      const response = await api.post("/documents", {
        title: newExternalTitle.trim(),
        url: newExternalUrl.trim(),
      });
      const newDoc = {
        id: response.data.id,
        title: response.data.title,
        url: response.data.url,
        source: "external",
        type: getFileTypeFromUrl(response.data.url),
        date: new Date().toISOString().split("T")[0],
        externalUrl: response.data.url,
        createdAt: response.data.created_at,
      };
      setExternalDocuments(prev => [newDoc, ...prev]);
      setNewExternalTitle("");
      setNewExternalUrl("");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur d'ajout.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteExternal = async (id) => {
    if (!window.confirm("Supprimer ce document externe ?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setExternalDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert("Suppression impossible.");
    }
  };

  const handleDeleteAllExternal = async () => {
    if (!externalDocuments.length) return;
    if (!window.confirm("Supprimer tous les documents externes ?")) return;
    try {
      for (const doc of externalDocuments) {
        await api.delete(`/documents/${doc.id}`);
      }
      setExternalDocuments([]);
    } catch (err) {
      alert("Erreur lors de la suppression massive.");
    }
  };

  // ========== Fusion et filtrage ==========
  const allDocuments = [
    ...externalDocuments.map(doc => ({
      id: doc.id,
      title: doc.title,
      source: "external",
      type: getFileTypeFromUrl(doc.url),
      date: doc.createdAt ? doc.createdAt.split("T")[0] : doc.date,
      externalUrl: doc.url,
      size: 0,
    })),
    ...localDocuments,
  ];

  const filteredDocuments = allDocuments.filter(doc => {
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterType === "all" ||
      (filterType === "image" && doc.type === "image") ||
      (filterType === "pdf" && doc.type === "pdf");
    return matchSearch && matchFilter;
  });

  const totalLocalSize = localDocuments.reduce((sum, d) => sum + (d.size || 0), 0);
  const totalFiles = allDocuments.length;

  const handleDownload = (doc) => {
    if (doc.source === "local" && doc.dataURL) {
      const link = document.createElement("a");
      link.href = doc.dataURL;
      link.download = doc.name;
      link.click();
    } else if (doc.source === "external" && doc.externalUrl) {
      window.open(doc.externalUrl, "_blank");
    }
  };

  // ========== Affichage ==========
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                  <Paperclip size={24} />
                </div>
                <h1 className="text-3xl font-bold text-slate-800">Gestion des documents</h1>
              </div>
              <p className="text-slate-500">Locaux (navigateur) + Externes (base de données)</p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border">
                <HardDrive size={18} className="text-indigo-500" />
                <span className="text-sm font-medium">{formatFileSize(totalLocalSize)} (local)</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border">
                <Database size={18} className="text-green-500" />
                <span className="text-sm font-medium">{externalDocuments.length} externe(s)</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border">
                <FolderOpen size={18} className="text-indigo-500" />
                <span className="text-sm font-medium">{totalFiles} total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaires d'ajout */}
        <div className="grid grid-cols-1 lg:grid-cols gap-6 mb-8">
          {/* Ajout local */}
          <div className="bg-white rounded-2xl border p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Upload size={18} className="text-indigo-500" /> Ajouter un document local
            </h3>
            <div className="space-y-4">
              <input type="text" placeholder="Titre" value={newLocalTitle} onChange={e => setNewLocalTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border focus:ring-indigo-500 outline-none" />
              <input ref={localFileInputRef} type="file" accept="image/*,application/pdf"
                onChange={e => setNewLocalFile(e.target.files?.[0] || null)}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:bg-indigo-50 file:text-indigo-700" />
              <button onClick={handleAddLocalDocument} disabled={isAdding}
                className="w-full flex justify-center gap-2 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
                <Plus size={18} /> {isAdding ? "Ajout..." : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
 
        {/* Recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Rechercher par titre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilterType("all")} className={`px-4 py-2 rounded-xl border ${filterType === "all" ? "bg-indigo-600 text-white" : "bg-white"}`}>Tous</button>
            <button onClick={() => setFilterType("image")} className={`px-4 py-2 rounded-xl border ${filterType === "image" ? "bg-indigo-600 text-white" : "bg-white"}`}>Images</button>
            <button onClick={() => setFilterType("pdf")} className={`px-4 py-2 rounded-xl border ${filterType === "pdf" ? "bg-indigo-600 text-white" : "bg-white"}`}>PDF</button>
            {localDocuments.length > 0 && (
              <button onClick={handleDeleteAllLocal} className="px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200">Tout supprimer (local)</button>
            )}
            {externalDocuments.length > 0 && (
              <button onClick={handleDeleteAllExternal} className="px-4 py-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">Tout supprimer (serveur)</button>
            )}
          </div>
        </div>

        {/* Grille des documents */}
        {loading && externalDocuments.length === 0 && filteredDocuments.length === 0 ? (
          <div className="flex justify-center py-12"><div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full"></div></div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center py-16"><File size={48} className="text-slate-300 mb-4" /><p>Aucun document trouvé</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDocuments.map(doc => (
              <div key={`${doc.source}-${doc.id}`} className="bg-white rounded-2xl border shadow-sm hover:shadow-lg transition">
                <div className="p-5 cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 rounded-xl ${doc.type === "pdf" ? "bg-red-50 text-red-500" : doc.type === "image" ? "bg-green-50 text-green-500" : "bg-slate-100"}`}>
                      {doc.type === "pdf" ? <FileText size={26} /> : doc.type === "image" ? <ImageIcon size={26} /> : <File size={26} />}
                    </div>
                    <div className="flex gap-1">
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100">{doc.type === "pdf" ? "PDF" : doc.type === "image" ? "Image" : "Autre"}</span>
                      {doc.source === "external" && <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Externe</span>}
                    </div>
                  </div>
                  <h3 className="font-semibold truncate">{doc.title}</h3>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{doc.date}</span>
                    {doc.source === "local" && doc.size > 0 && <span>{formatFileSize(doc.size)}</span>}
                    {doc.source === "external" && <span>Lien externe</span>}
                  </div>
                </div>
                <div className="flex justify-end gap-0.5 p-2 border-t bg-slate-50/50">
                  <button onClick={() => setPreviewDoc(doc)} className="p-2 rounded-lg hover:text-indigo-600"><Eye size={18} /></button>
                  <button onClick={() => handleDownload(doc)} className="p-2 rounded-lg hover:text-indigo-600"><Download size={18} /></button>
                  <button onClick={() => doc.source === "local" ? handleDeleteLocal(doc.id) : handleDeleteExternal(doc.id)} className="p-2 rounded-lg hover:text-red-600"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal d'aperçu */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setPreviewDoc(null)}>
            <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-medium truncate">{previewDoc.title}</h3>
                <button onClick={() => setPreviewDoc(null)} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={20} /></button>
              </div>
              <div className="p-4 flex justify-center bg-slate-50/80 overflow-auto max-h-[calc(90vh-120px)]">
                {previewDoc.type === "image" && (
                  previewDoc.source === "local" ? (
                    <img src={previewDoc.dataURL} alt={previewDoc.title} className="max-w-full max-h-[70vh] object-contain" />
                  ) : previewDoc.externalUrl ? (
                    <img src={previewDoc.externalUrl} alt={previewDoc.title} className="max-w-full max-h-[70vh] object-contain" onError={e => e.target.src = "https://via.placeholder.com/400x300?text=Image+non+accessible"} />
                  ) : <p>Image non disponible</p>
                )}
                {previewDoc.type === "pdf" && (
                  <iframe src={previewDoc.source === "local" ? `${previewDoc.dataURL}#toolbar=0` : previewDoc.externalUrl} className="w-full h-[70vh]" title={previewDoc.title} />
                )}
                {previewDoc.type !== "image" && previewDoc.type !== "pdf" && (
                  <div className="text-center py-12">
                    <File size={64} className="mx-auto text-slate-400 mb-4" />
                    <p>Aperçu non disponible</p>
                    <button onClick={() => handleDownload(previewDoc)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg">Ouvrir</button>
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