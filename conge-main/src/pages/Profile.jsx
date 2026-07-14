import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Building,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Edit,
  Save,
  X,
  UserCircle,
  CreditCard,
  Home,
  Globe,
  Heart,
  Star,
  Shield,
} from "lucide-react";
import axios from "axios";

const Profile = () => {
  // ------------------------------
  // State & Logic (Preserved)
  // ------------------------------
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [userData, setUserData] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    nom_prenom: "",
    nom_ar: "",
    prenom_ar: "",
    actif: true,
    affectation: "",
    efp_travail: "",
    email: "",
    observation: "",
    role: "",
    solde_annee_derniere: 0,
    solde_annee_precedente: 0,
    // detail_user
    sexe: "",
    cin: "",
    date_naissance: "",
    adresse: "",
    ville: "",
    telephone: "",
    photo: "",
    // detail_user_job
    fonction: "",
    nature_fonction: "",
    echelle: "",
    categorie: "",
    grade: "",
    diplome: "",
    specialite: "",
    date_recrutement: "",
    date_prise_service: "",
    recode_annee_ant: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              Accept: "application/json",
            },
          }
        );

        const data = response.data;

        setUserData({
          ...data,
          ...data.detail_user,
          ...data.detail_job_user,
        });

        setOriginalData({
          ...data,
          ...data.detail_user,
          ...data.detail_job_user,
        });
      } catch (error) {
        console.error("Profile Error :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setUserData(originalData);
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();

      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key] ?? "");
      });

      if (selectedPhoto) {
        formData.append("photo", selectedPhoto);
      }

      await axios.post(
        `http://127.0.0.1:8000/api/users/${user.id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const profile = await axios.get(
        `http://127.0.0.1:8000/api/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(profile.data));

      setUserData({
        ...profile.data,
        ...(profile.data.detail_user || {}),
        ...(profile.data.detail_job_user || {}),
      });

      setOriginalData({
        ...profile.data,
        ...(profile.data.detail_user || {}),
        ...(profile.data.detail_job_user || {}),
      });

      setEditing(false);
      window.location.reload();
    } catch (error) {
      console.error(error.response?.data || error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedPhoto(file);
    const reader = new FileReader();
    reader.onload = () => {
      setUserData((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const calculateYearsOfService = () => {
    if (!userData.date_recrutement) return "N/A";
    const start = new Date(userData.date_recrutement);
    const now = new Date();
    const diff = now - start;
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(years);
  };

  const yearsOfService = calculateYearsOfService();

  const isDirty = () => {
    if (!originalData) return false;
    return JSON.stringify(userData) !== JSON.stringify(originalData);
  };

  // ------------------------------
  // Animation variants & Styles
  // ------------------------------
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const staggerContainer = {
    animate: {
      transition: { staggerChildren: 0.08 },
    },
  };

  // Reusable input class
  const getInputStyle = (isEditing) => `
    w-full px-4 py-2.5 rounded-xl border text-sm transition-all duration-200
    ${isEditing 
      ? "border-slate-200 bg-white hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 shadow-sm" 
      : "border-transparent bg-slate-50/80 text-slate-600 cursor-default"
    } focus:outline-none
  `;

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Chargement du profil...</p>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-8 font-sans"
        >
          {/* ---------- HEADER PROFILE ---------- */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-8 shadow-xl mb-8 border border-slate-700/50"
          >
            {/* Décoration d'arrière-plan abstraite */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Photo + Upload */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="w-32 h-32 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-slate-800 flex items-center justify-center backdrop-blur-md transition-all group-hover:border-white/40"
                  >
                    {userData.photo ? (
                      <img
                        src={
                          userData.photo?.startsWith("data:")
                            ? userData.photo
                            : `http://127.0.0.1:8000/storage/${userData.photo}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-slate-400" />
                    )}
                  </motion.div>
                  <AnimatePresence>
                    {editing && (
                      <motion.label
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        htmlFor="photo-upload"
                        className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-full shadow-lg cursor-pointer transition-colors ring-4 ring-slate-900"
                      >
                        <Upload className="w-4 h-4" />
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </motion.label>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Info Utilisateur */}
              <div className="flex-1 text-center md:text-left text-white w-full">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">
                      {userData.nom_prenom || `${userData.nom} ${userData.prenom}`}
                    </h1>
                    <p className="text-indigo-200 font-medium flex items-center justify-center md:justify-start gap-2">
                      <Shield className="w-4 h-4" /> Matricule: {userData.matricule}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm border ${
                        userData.role === "admin"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>
                      {userData.role?.toUpperCase() || "EMPLOYÉ"}
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm border ${
                        userData.actif
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                      {userData.actif ? "ACTIF" : "INACTIF"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 rounded-md"><Mail className="w-4 h-4" /></div>
                    <span>{userData.email || "Email non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 rounded-md"><Phone className="w-4 h-4" /></div>
                    <span>{userData.telephone || "Tél non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 rounded-md"><MapPin className="w-4 h-4" /></div>
                    <span>{userData.ville || "Ville non renseignée"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action superposés au header */}
            <div className="absolute top-6 right-6 flex gap-3">
              {!editing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold backdrop-blur-md flex items-center gap-2 transition-all border border-white/10"
                >
                  <Edit className="w-4 h-4" /> Éditer le profil
                </motion.button>
              ) : (
                <div className="flex gap-3 bg-slate-900/50 p-1.5 rounded-2xl backdrop-blur-md border border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="px-4 py-2 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" /> Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={!isDirty() || saving}
                    className={`px-5 py-2 bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg flex items-center gap-2 transition-all ${
                      !isDirty() || saving
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-indigo-400 hover:shadow-indigo-500/25"
                    }`}
                  >
                    {saving ? "Enregistrement..." : <><Save className="w-4 h-4" /> Sauvegarder</>}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* ---------- MAIN CONTENT ---------- */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            {/* COLONNE GAUCHE (Formulaires) */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Informations Personnelles */}
              <motion.div variants={fadeInUp} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Informations Personnelles</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    { label: "Nom", name: "nom", type: "text" },
                    { label: "Prénom", name: "prenom", type: "text" },
                    { label: "Nom complet", name: "nom_prenom", type: "text", fullWidth: true },
                    { label: "Nom (Arabe)", name: "nom_ar", type: "text" },
                    { label: "Prénom (Arabe)", name: "prenom_ar", type: "text" },
                    { label: "Sexe", name: "sexe", type: "text" },
                    { label: "CIN", name: "cin", type: "text" },
                    { label: "Date de naissance", name: "date_naissance", type: "date" },
                    { label: "Téléphone", name: "telephone", type: "text" },
                    { label: "Adresse", name: "adresse", type: "text", fullWidth: true },
                    { label: "Ville", name: "ville", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                  ].map((field) => (
                    <div key={field.name} className={`flex flex-col gap-1.5 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={userData[field.name] || ""}
                        onChange={handleChange}
                        disabled={!editing}
                        className={getInputStyle(editing)}
                        placeholder={editing ? `Entrer ${field.label.toLowerCase()}` : "-"}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Informations Professionnelles */}
              <motion.div variants={fadeInUp} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Parcours Professionnel</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    { label: "Fonction", name: "fonction" },
                    { label: "Nature Fonction", name: "nature_fonction" },
                    { label: "Grade", name: "grade" },
                    { label: "Catégorie", name: "categorie" },
                    { label: "Échelle", name: "echelle" },
                    { label: "Diplôme", name: "diplome" },
                    { label: "Spécialité", name: "specialite" },
                    { label: "EFP Travail", name: "efp_travail" },
                    { label: "Affectation", name: "affectation", fullWidth: true },
                    { label: "Observation", name: "observation", fullWidth: true },
                  ].map((field) => (
                    <div key={field.name} className={`flex flex-col gap-1.5 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                        {field.label}
                      </label>
                      {field.name === "observation" ? (
                        <textarea
                          name={field.name}
                          value={userData[field.name] || ""}
                          onChange={handleChange}
                          disabled={!editing}
                          rows={3}
                          className={`${getInputStyle(editing)} resize-none`}
                        />
                      ) : (
                        <input
                          type="text"
                          name={field.name}
                          value={userData[field.name] || ""}
                          onChange={handleChange}
                          disabled={!editing}
                          className={getInputStyle(editing)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Historique et Recrutement */}
              <motion.div variants={fadeInUp} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Historique d'emploi</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {[
                    { label: "Date de recrutement", name: "date_recrutement", type: "date" },
                    { label: "Date de prise de service", name: "date_prise_service", type: "date" },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={userData[field.name] || ""}
                        onChange={handleChange}
                        disabled={!editing}
                        className={getInputStyle(editing)}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* COLONNE DROITE (Widgets / Résumé) */}
            <div className="space-y-6">
              
              {/* Carte Résumé Employé */}
              <motion.div variants={fadeInUp} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Vue d'ensemble</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold overflow-hidden shadow-sm">
                    {userData.photo ? (
                      <img
                        src={userData.photo?.startsWith("data:") ? userData.photo : `http://127.0.0.1:8000/storage/${userData.photo}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userData.nom?.charAt(0) || "U"
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">
                      {userData.nom_prenom || `${userData.nom} ${userData.prenom}`}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium">{userData.fonction || "Fonction non définie"}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                      <Award className="w-4 h-4 text-slate-400" /> Ancienneté
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {yearsOfService !== "N/A" ? `${yearsOfService} ans` : "N/A"}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" /> Affectation
                    </span>
                    <span className="text-sm font-bold text-slate-800 text-right max-w-[150px] truncate">
                      {userData.affectation || "-"}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Statistiques de Congés */}
              <motion.div variants={fadeInUp} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Soldes de congés
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-indigo-100/50 transition-transform hover:scale-[1.02]">
                    <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Actuel</span>
                    <span className="text-2xl font-black text-indigo-700">0</span>
                  </div>
                  <div className="bg-blue-50/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-blue-100/50 transition-transform hover:scale-[1.02]">
                    <span className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Année Préc.</span>
                    <span className="text-2xl font-black text-blue-700">{userData.solde_annee_precedente || 0}</span>
                  </div>
                  <div className="bg-purple-50/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-purple-100/50 transition-transform hover:scale-[1.02]">
                    <span className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">Dernière</span>
                    <span className="text-2xl font-black text-purple-700">{userData.solde_annee_derniere || 0}</span>
                  </div>
                  <div className="bg-emerald-50/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-emerald-100/50 transition-transform hover:scale-[1.02]">
                    <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Récupéré</span>
                    <span className="text-2xl font-black text-emerald-700">{userData.recode_annee_ant || 0}</span>
                  </div>
                </div>
              </motion.div>

              {/* Info Express */}
              <motion.div variants={fadeInUp} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Détails Rapides</h3>
                <ul className="space-y-3">
                  {[
                    { label: "Grade", value: userData.grade },
                    { label: "Catégorie", value: userData.categorie },
                    { label: "Échelle", value: userData.echelle },
                    { label: "EFP", value: userData.efp_travail },
                  ].map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <span className="text-sm font-medium text-slate-500">{item.label}</span>
                      <span className="text-sm font-bold text-slate-800">{item.value || "-"}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default Profile;