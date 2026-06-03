import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fr } from 'date-fns/locale';
import {
  ArrowLeft, User, Mail, Phone, Building2, Briefcase,
  Hash, Calendar, Users, CheckCircle, Clock, XCircle,
  FileText, Download, Printer, Eye, Paperclip,
  CalendarRange, AlarmClock, MessageSquare, Shield,
  ClipboardList, BadgeCheck, Award, Wallet,
  TrendingDown, CalendarDays, FileDown,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLeave } from '@/contexts/LeaveContext';
import { useAuth } from '@/contexts/AuthContext';
import { LEAVE_TYPE_LABELS } from '@/types/leave';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';
import { format, isValid } from 'date-fns';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import html2pdf from "html2pdf.js";

import DecisionDocument from './DecisionDocument';
import DemandeDocument from './DemandeDocument';

  const safeFormat = (date, pattern, locale) => {
    const d = new Date(date);
    return isValid(d) ? format(d, pattern, { locale }) : '—';
  };
  // ─── PDF decision document generator ──────────────────────────────────────
  const buildDecisionHTML = (request, employee, actionStatus, interimaire) => {
  const today = safeFormat(request.created_at, 'dd MMM yyyy à HH:mm', fr)

  const isApproved =actionStatus === 'approved';
  const actionLabel = isApproved ? 'APPROUVÉE' : 'REFUSÉE';
  const badgeColor = isApproved ? '#16a34a' : '#dc2626';
  const startFmt = safeFormat(request.start_date, 'dd MMM yyyy', fr)
  const endFmt   = safeFormat(request.end_date, 'dd MMM yyyy', fr)

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Décision Congé – ${employee?.nomComplet ?? request.employeeName}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;max-width:820px;margin:0 auto;padding:48px 40px;color:#1f2937;background:#fff}
    .header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #1d4ed8;padding-bottom:20px;margin-bottom:28px}
    .org-name{font-size:22px;font-weight:800;color:#1d4ed8;letter-spacing:1px}
    .org-sub{font-size:11px;color:#6b7280;margin-top:4px}
    .doc-title{font-size:17px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:2px;color:#374151;margin-bottom:18px}
    .badge-wrap{text-align:center;margin:18px 0 24px}
    .badge{display:inline-block;padding:10px 36px;background:${badgeColor};color:#fff;font-size:17px;font-weight:800;border-radius:6px;letter-spacing:3px}
    .meta{text-align:right;font-size:12px;color:#6b7280;margin-bottom:20px}
    .section{margin-bottom:18px;padding:18px 20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px}
    .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#475569;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:8px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .field .lbl{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
    .field .val{font-size:13px;font-weight:600;color:#1f2937}
    .footer{margin-top:40px;display:flex;justify-content:space-around}
    .sig-block{text-align:center;min-width:160px}
    .sig-title{font-size:12px;font-weight:600;color:#374151}
    .sig-line{border-top:1px solid #9ca3af;margin-top:48px;padding-top:6px;font-size:10px;color:#9ca3af}
    .ref{text-align:center;margin-top:24px;font-size:10px;color:#d1d5db}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="org-name">OFPPT</div>
      <div class="org-sub">Office de la Formation Professionnelle et de la Promotion du Travail</div>
      <div class="org-sub" style="margin-top:2px">Direction Régionale — Service des Ressources Humaines</div>
    </div>
    <div style="text-align:right;font-size:11px;color:#6b7280">
      <div>N° Réf : DEC-${request.id}-${new Date().getFullYear()}</div>
      <div style="margin-top:4px">Casablanca, le ${today}</div>
    </div>
  </div>

  <div class="doc-title">Décision relative à une demande de congé</div>

  <div class="badge-wrap">
    <span class="badge">DEMANDE ${actionLabel}</span>
  </div>

  <div class="section">
  <div class="section-title">Informations de l'employé</div>

  <div class="grid">
    <div class="field">
      <div class="lbl">Nom complet</div>
      <div class="val">${employee?.nomComplet ?? request.employeeName}</div>
    </div>

    <div class="field">
      <div class="lbl">Matricule</div>
      <div class="val">${employee?.matricule ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">CIN</div>
      <div class="val">${employee?.cin ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Ville</div>
      <div class="val">${employee?.ville ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Efp Travail</div>
      <div class="val">${employee?.efp_travail ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Fonction</div>
      <div class="val">${employee?.poste ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Echelle</div>
      <div class="val">${employee?.echelle ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Intérimaire</div>
      <div class="val">${interimaire?.nomComplet ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Spécialité</div>
      <div class="val">${employee?.specialite ?? '—'}</div>
    </div>
  </div>
</div>

  <div class="section">
    <div class="section-title">Détails de la demande</div>
    <div class="grid">
      <div class="field"><div class="lbl">Type de congé</div><div class="val">${LEAVE_TYPE_LABELS[request.type] ?? request.type}</div></div>
      <div class="field"><div class="lbl">Durée</div><div class="val">${request.duration} jour(s)</div></div>
      <div class="field"><div class="lbl">Date de début</div><div class="val">${startFmt}</div></div>
      <div class="field"><div class="lbl">Date de fin</div><div class="val">${endFmt}</div></div>
    </div>
    ${request.reason ? `<div class="field" style="margin-top:12px"><div class="lbl">Motif</div><div class="val">${request.reason}</div></div>` : ''}
  </div>

  <div class="footer">
    <div class="sig-block">
      <div class="sig-title">Le Responsable RH</div>
      <div class="sig-line">Signature &amp; Cachet</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">Le Directeur</div>
      <div class="sig-line">Signature &amp; Cachet</div>
    </div>
  </div>

  <div class="ref">Réf : DEC-${request.id}-${new Date().getFullYear()} | Document généré le ${today} — Système de Gestion des Congés OFPPT</div>
</body>
</html>`;
};

// ─── Leave request document generator ────────────────────────────────────
const buildDemandeHTML = (request, employee, interimaire) => {
  const today    = safeFormat(request.created_at, 'dd MMM yyyy à HH:mm', fr)
  const startFmt = safeFormat(request.start_date, 'dd MMM yyyy', fr)
  const endFmt   = safeFormat(request.end_date, 'dd MMM yyyy', fr)


  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Demande de Congé – ${employee?.nomComplet ?? request.employeeName}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;max-width:820px;margin:0 auto;padding:48px 40px;color:#1f2937;background:#fff}
    .header{display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #1d4ed8;padding-bottom:20px;margin-bottom:28px}
    .org-name{font-size:22px;font-weight:800;color:#1d4ed8;letter-spacing:1px}
    .org-sub{font-size:11px;color:#6b7280;margin-top:4px}
    .doc-title{font-size:17px;font-weight:700;text-align:center;text-transform:uppercase;letter-spacing:2px;color:#374151;margin-bottom:24px}
    .section{margin-bottom:18px;padding:18px 20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px}
    .section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#475569;margin-bottom:14px;border-bottom:1px solid #e2e8f0;padding-bottom:8px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .field{margin-bottom:4px}
    .field .lbl{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px}
    .field .val{font-size:13px;font-weight:600;color:#1f2937;border-bottom:1px dashed #e2e8f0;padding-bottom:4px}
    .reason-box{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:12px;min-height:60px;font-size:13px;color:#374151}
    .footer{margin-top:40px;display:flex;justify-content:space-between;align-items:flex-end}
    .sig-block{text-align:center;min-width:160px}
    .sig-title{font-size:12px;font-weight:600;color:#374151}
    .sig-sub{font-size:10px;color:#6b7280;margin-top:2px}
    .sig-line{border-top:1px solid #9ca3af;margin-top:56px;padding-top:6px;font-size:10px;color:#9ca3af}
    .ref{text-align:center;margin-top:24px;font-size:10px;color:#d1d5db}
    @media print{body{padding:20px}}
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="org-name">OFPPT</div>
      <div class="org-sub">Office de la Formation Professionnelle et de la Promotion du Travail</div>
      <div class="org-sub" style="margin-top:2px">Direction Régionale — Service des Ressources Humaines</div>
    </div>
    <div style="text-align:right;font-size:11px;color:#6b7280">
      <div>N° : DEM-${request.id}-${new Date().getFullYear()}</div>
      <div style="margin-top:4px">Casablanca, le ${today}</div>
    </div>
  </div>

  <div class="doc-title">Demande de Congé</div>

  <div class="section">
  <div class="section-title">Informations de l'employé</div>

  <div class="grid">
    <div class="field">
      <div class="lbl">Nom complet</div>
      <div class="val">${employee?.nomComplet ?? request.employeeName}</div>
    </div>

    <div class="field">
      <div class="lbl">Matricule</div>
      <div class="val">${employee?.matricule ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">CIN</div>
      <div class="val">${employee?.cin ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Ville</div>
      <div class="val">${employee?.ville ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Efp Travail</div>
      <div class="val">${employee?.efp_travail ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Fonction</div>
      <div class="val">${employee?.poste ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Echelle</div>
      <div class="val">${employee?.echelle ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Intérimaire</div>
      <div class="val">${interimaire?.nomComplet ?? '—'}</div>
    </div>

    <div class="field">
      <div class="lbl">Spécialité</div>
      <div class="val">${employee?.specialite ?? '—'}</div>
    </div>
  </div>
</div>

  <div class="section">
    <div class="section-title">Détails de la demande</div>
    <div class="grid">
      <div class="field"><div class="lbl">Type de congé</div><div class="val">${LEAVE_TYPE_LABELS[request.type] ?? request.type}</div></div>
      <div class="field"><div class="lbl">Nombre de jours</div><div class="val">${request.duration} jour(s)</div></div>
      <div class="field"><div class="lbl">Date de début</div><div class="val">${startFmt}</div></div>
      <div class="field"><div class="lbl">Date de fin</div><div class="val">${endFmt}</div></div>
    </div>
    <div class="field" style="margin-top:14px">
      <div class="lbl">Motif de la demande</div>
      <div class="reason-box">${request.reason ?? 'Aucun motif précisé.'}</div>
    </div>
  </div>

  <div class="footer">
    <div class="sig-block">
      <div class="sig-title">Signature de l'Employé</div>
      <div class="sig-sub">${employee?.nomComplet ?? request.employeeName}</div>
      <div class="sig-line">Signature</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">Visa Responsable RH</div>
      <div class="sig-line">Signature &amp; Cachet</div>
    </div>
    <div class="sig-block">
      <div class="sig-title">Visa Directeur</div>
      <div class="sig-line">Signature &amp; Cachet</div>
    </div>
  </div>

  <div class="ref">N° DEM-${request.id}-${new Date().getFullYear()} | Imprimé le ${today} — Système de Gestion des Congés OFPPT</div>
</body>
</html>`;
};

// ─── Reusable info field ───────────────────────────────────────────────────
const InfoField = ({ icon, label, value, wide = false }) => (
  <div className={`flex items-start gap-3 ${wide ? 'col-span-2' : ''}`}>
    <div className="mt-0.5 rounded-lg bg-blue-50 border border-blue-100 p-1.5 flex-shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground break-words">{value}</p>
    </div>
  </div>
);

// ─── Animation variants ────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
};
const card = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' } },
};

// ══════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════
const DetailDemande = () => {
  const STATUS_CONFIG = {
      pending_manager: {
        label: 'En attente Responsable',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        dot: 'bg-orange-500',
        icon: Clock,
      },

      pending_director: {
        label: 'En attente Directeur',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        icon: Eye,
      },

      approved: {
        label: 'Approuvée',
        color: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-500',
        icon: CheckCircle,
      },

      rejected: {
        label: 'Refusée',
        color: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-500',
        icon: XCircle,
      },

      cancelled: {
        label: 'Annulée',
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        dot: 'bg-gray-500',
        icon: XCircle,
      },
    };
    const pdfRef = useRef();
    const demandeRef = useRef();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { requests, updateRequestStatus, validateLeave } = useLeave();

    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [comment, setComment] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [soldeData, setSoldeData] = useState(null);
    const [employeeData, setEmployeeData] = useState(null);
    const [interimaireData, setInterimaireData] = useState(null);
    const [soldeLoading, setSoldeLoading] = useState(false);

    const request = requests.find(r => String(r.id) === String(id));

  // ── Fetch employee profile + solde depuis l'API ──
 useEffect(() => {
  if (!request?.user_id) return;

  setSoldeLoading(true);
  const token = localStorage.getItem('token');

  axios
    .get(`http://127.0.0.1:8000/api/users/${request.user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    .then(res => {
      const u = res.data ?? {};

     setEmployeeData({
      nomComplet:
      (u.prenom && u.nom)
        ? `${u.prenom} ${u.nom}`
        : u.nom || null,

    email: u.email ?? null,

    affectation: u.affectation ?? null,
    solde_annee_derniere: u.solde_annee_derniere ?? null,

    solde_annee_precedente: u.solde_annee_precedente ?? null,

    efp_travail:
      u.efp_travail ?? null,

    telephone:
      u.detail_user?.telephone ?? null,

    poste:
      u.detail_job_user?.fonction ?? null,

    matricule:
      u.matricule ?? null,

    dateEmbauche:
      u.detail_job_user?.date_recrutement ?? null,

    statut:
      u.actif === false ? 'Inactif' : 'Actif',

    anneeDerniere:
      u.solde_annee_derniere ?? 0,

    anneePrecedente:
      u.solde_annee_precedente ?? 0,

    adresse:
      u.detail_user?.adresse ?? null,

    ville:
      u.detail_user?.ville ?? null,

    cin:
      u.detail_user?.cin ?? null,

    sexe:
      u.detail_user?.sexe ?? null,
      
    grade:
      u.detail_job_user?.grade ?? null,

    categorie:
      u.detail_job_user?.categorie ?? null,

    echelle:
      u.detail_job_user?.echelle ?? null,

    diplome:
      u.detail_job_user?.diplome ?? null,

    specialite:
      u.detail_job_user?.specialite ?? null,
  });
    })
    .catch(() => {
      setEmployeeData(null);
    })
    .finally(() => setSoldeLoading(false));
}, [request?.user_id]);

useEffect(() => {
  if (!request?.interimaire_id) {
    setInterimaireData(null);
    return;
  }

  const token = localStorage.getItem('token');

  axios
    .get(`http://127.0.0.1:8000/api/users/${request.interimaire_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    .then(res => {
      const u = res.data ?? {};

      setInterimaireData({
        nomComplet: (u.prenom && u.nom) ? `${u.prenom} ${u.nom}` : u.nom || u.nom_prenom || '—',
      });
    })
    .catch(() => {
      setInterimaireData(null);
    });
}, [request?.interimaire_id]);
  // ── Not found guard ──
  if (!request) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <FileText className="h-16 w-16 text-muted-foreground/20" />
          <p className="text-lg font-medium text-muted-foreground">Demande introuvable</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ArrowLeft size={14} /> Retour
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const employee = employeeData ?? {
    nomComplet: request.employeeName || 'Employé',

    email: '—',
    telephone: '—',

    efp_travail: '—',
    poste: '—',

    matricule: '—',
    cin: '—',

    ville: '—',

    echelle: '—',
    specialite: '—',

    dateEmbauche: null,

    statut: 'Actif',

    responsableDirect: '—',

    anneeDerniere: 0,
    anneePrecedente: 0,
  };
  const statusCfg   = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.pending_manager;
  const StatusIcon  = statusCfg.icon;

  const canApprove =
    (user?.role === 'manager'   && request.status === 'pending_manager') ||
    (user?.role === 'directeur' && request.status === 'pending_director');
  const canReject = canApprove;

  // ── Handlers ──
  const openModal = (action) => {
    setModalAction(action);
    setComment('');
    setShowModal(true);
  };
  const getNextStatus = (action, role, currentStatus) => {
    if (action !== 'approve') return 'rejected';
    if (role === 'manager' && currentStatus === 'pending_manager') return 'pending_director';
    if (role === 'directeur' && currentStatus === 'pending_director') return 'approved';
    return currentStatus;
  };
  const confirmAction = async () => {
    if (actionLoading) return;

    const newStatus = getNextStatus(
          modalAction,
          user?.role,
          request.status
        );

    setActionLoading(true);
    try {
      if (modalAction === 'approve' && user?.role === 'directeur') {
        await validateLeave(request.id);
      } else {
        await updateRequestStatus(request.id, newStatus, comment || undefined);
      }

      toast.success(
        modalAction === 'approve'
          ? user?.role === 'manager'
            ? 'Demande transmise au directeur'
            : 'Demande approuvée avec succès !'
          : 'Demande refusée.'
      );
      setShowModal(false);
      navigate(-1);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la validation de la demande"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleValidateButton = async () => {
    if (user?.role === 'directeur') {
      if (actionLoading) return;

      setActionLoading(true);
      try {
        await validateLeave(request.id);
        toast.success('Demande approuvée avec succès !');
        navigate(-1);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Erreur lors de la validation de la demande"
        );
      } finally {
        setActionLoading(false);
      }

      return;
    }

    openModal('approve');
  };

const handleDownloadDemande = async () => {
  const canvas = await html2canvas(demandeRef.current, {
    scale: 2,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`Demande_${request.id}.pdf`);

  toast.success('PDF téléchargé');
};

  const handlePrint = () => {
    const html = buildDecisionHTML(request, employee, request.status, interimaireData);
    const w = window.open('', '_blank', 'width=860,height=680');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

 const handleDownload = async () => {
  const element = pdfRef.current;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    height: element.scrollHeight,        // ← klé
    windowHeight: element.scrollHeight,  // ← klé
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  const pageHeight = pdf.internal.pageSize.getHeight();
  let position = 0;
  let heightLeft = pdfHeight;

  // ← ila kan lhajm kber mn page wahda, kaydir pages mteaddda
  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`Decision_${request.id}.pdf`);
  toast.success('PDF téléchargé');
};

  // ── Render ──
  return (
    <DashboardLayout>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-6xl mx-auto"
      >

        {/* ══ HEADER ══════════════════════════════════════════════════════ */}
        <motion.div variants={card} className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="rounded-xl bg-primary/10 p-2.5 flex-shrink-0">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold truncate">Détail de la Demande</h1>
              <p className="text-sm text-muted-foreground">
                Réf.&nbsp;#{request.id} &mdash; Consultez les informations et prenez votre décision
              </p>
            </div>
            <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold flex-shrink-0 ${statusCfg.color}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
              <StatusIcon size={11} />
              {statusCfg.label}
            </span>
          </div>

          {/* Right: download buttons */}
         {user?.role === 'directeur' &&  (<div className="flex items-center gap-2 flex-shrink-0">
           
             <motion.button
          disabled={request.status !== 'approved'}
          whileHover={request.status === 'approved' ? { scale: 1.03 } : {}}
          whileTap={request.status === 'approved' ? { scale: 0.97 } : {}}
          onClick={request.status === 'approved' ? handleDownload : undefined}
          title={request.status !== 'approved' ? 'Vous devez approuver avant de télécharger la décision' : 'Télécharger la décision'}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors ${
            request.status === 'approved'
              ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
          }`}
        >
          <Download size={16} />
          <span className="hidden sm:inline">Télécharger Décision</span>
          <span className="sm:hidden">Décision</span>
        </motion.button>
                  
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownloadDemande}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <FileDown size={16} />
              <span className="hidden sm:inline">Télécharger Demande</span>
              <span className="sm:hidden">Demande</span>
            </motion.button>
          </div>) }
        </motion.div>

        {/* ══ EMPLOYEE + REQUEST ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ─ Employee card ─ */}
          <motion.div
            variants={card}
            className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="bg-blue-100 border-b border-blue-100 px-6 py-4">
              <h2 className="flex items-center gap-2 text-primary font-semibold">
                <User size={17} /> Informations de l'Employé
              </h2>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 px-6 py-5 border-b bg-blue-50/40">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-md select-none">
                  {(employee?.nomComplet ?? request.employeeName)
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                    employee?.statut === 'Actif' ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
              </div>
              <div>
                <p className="text-lg font-bold">{employee?.nomComplet ?? request.employeeName}</p>
                <p className="text-sm text-muted-foreground">{employee?.poste ?? 'Employé'}</p>
                <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  employee?.statut === 'Actif'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <BadgeCheck size={10} />
                  {employee?.statut ?? 'Actif'}
                </span>
              </div>
            </div>

            {/* Fields */}
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoField icon={<Mail size={14} className="text-blue-500" />}      label="Email"            value={employee?.email            ?? '—'} />
              <InfoField icon={<Phone size={14} className="text-blue-500" />}     label="Téléphone"        value={employee?.telephone        ?? '—'} />
              <InfoField icon={<Building2 size={14} className="text-blue-500" />} label="Efp_Travail"      value={employee?.efp_travail      ?? '—'} />
              <InfoField icon={<Briefcase size={14} className="text-blue-500" />} label="Poste"            value={employee?.poste            ?? '—'} />
              <InfoField icon={<Hash size={14} className="text-blue-500" />}      label="Matricule"        value={employee?.matricule        ?? '—'} />
              <InfoField
                icon={<Hash size={14} className="text-blue-500" />}
                label="CIN"
                value={employee?.cin ?? '—'}
              />

              <InfoField
                icon={<Building2 size={14} className="text-blue-500" />}
                label="Ville"
                value={employee?.ville ?? '—'}
              />

              <InfoField
                icon={<Award size={14} className="text-blue-500" />}
                label="Echelle"
                value={employee?.echelle ?? '—'}
              />

              <InfoField
                icon={<Briefcase size={14} className="text-blue-500" />}
                label="Spécialité"
                value={employee?.specialite ?? '—'}
              />
              <InfoField icon={<Calendar size={14} className="text-blue-500" />}  label="Date d'embauche"  value={
                employee?.dateEmbauche &&
                !isNaN(new Date(employee.dateEmbauche).getTime())
                  ? format(new Date(employee.dateEmbauche), 'dd MMM yyyy', { locale: fr })
                  : '—'
              } />
            </div>
          </motion.div>

          {/* ─ Request details card ─ */}
          <motion.div
            variants={card}
            className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="bg-blue-100 border-b border-blue-100 px-6 py-4">
              <h2 className="flex items-center gap-2 text-primary font-semibold">
                <CalendarRange size={17} /> Détails de la Demande
              </h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Type + Duration tiles */}
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[130px] rounded-xl bg-indigo-50 border border-indigo-100 p-3.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Type de congé</p>
                  <p className="font-semibold text-indigo-700 text-sm leading-snug">
                    {LEAVE_TYPE_LABELS[request.type] ?? request.type}
                  </p>
                </div>
                <div className="flex-1 min-w-[100px] rounded-xl bg-orange-50 border border-orange-100 p-3.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Durée</p>
                  <p className="text-3xl font-extrabold text-orange-600 leading-none">{request.duration}</p>
                  <p className="text-xs text-orange-500 mt-1">jour(s)</p>
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3.5">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                    <Calendar size={11} /> Date début
                  </p>
                  <p className="font-semibold text-sm">
                    {safeFormat(request.start_date, 'dd MMM yyyy', fr)}
                  </p>
                </div>
                <div className="rounded-xl border p-3.5">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                    <Calendar size={11} /> Date fin
                  </p>
                  <p className="font-semibold text-sm">
                    {safeFormat(request.end_date, 'dd MMM yyyy', fr)}
                  </p>
                </div>
              </div>
              {request.interimaire_id && (
                <div className="rounded-xl border p-3.5">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                    <Users size={11} /> Intérimaire
                  </p>
                  <p className="font-semibold text-sm">
                    {interimaireData?.nomComplet ?? 'Chargement...'}
                  </p>
                </div>
              )}

              {/* Motif */}
              {request.reason && (
                <div className="rounded-xl bg-muted/40 border p-4">
                  <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    <MessageSquare size={11} /> Motif
                  </p>
                  <p className="text-sm text-foreground">{request.reason}</p>
                </div>
              )}

              {/* Manager comment */}
              {request.managerComment && (
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
                    <Shield size={11} /> Commentaire Responsable
                  </p>
                  <p className="text-sm text-foreground">{request.managerComment}</p>
                </div>
              )}

              {/* Director comment */}
              {request.directorComment && (
                <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                  <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-purple-600 mb-2">
                    <Award size={11} /> Commentaire Directeur
                  </p>
                  <p className="text-sm text-foreground">{request.directorComment}</p>
                </div>
              )}

              {/* Footer meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlarmClock size={11} />
                  Créée le {safeFormat(request.created_at, 'dd MMM yyyy à HH:mm', fr)}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusCfg.color}`}>
                  <StatusIcon size={10} /> {statusCfg.label}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
              <div
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  top: 0,
                }}
              >
                <DecisionDocument
                  ref={pdfRef}
                  request={request}
                  employee={employee}
                  LEAVE_TYPE_LABELS={LEAVE_TYPE_LABELS}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  top: 0,
                }}
              >
                <DemandeDocument
                  ref={demandeRef}
                  request={request}
                  employee={employee}
                  interimaire={interimaireData}
                  LEAVE_TYPE_LABELS={LEAVE_TYPE_LABELS}
                />
              </div>
        {/* ══ SOLDE DE CONGÉ ═══════════════════════════════════════════════ */}
        {(() => {
            const anneeDerniere = Number(employee?.anneeDerniere) || 0;
            const anneePrecedente = Number(employee?.anneePrecedente) || 0;

            const bal = {
              total: anneeDerniere + anneePrecedente,

              anneeDerniere,
              anneePrecedente,
            };

            const soldeApres = Math.max(0, bal.total - request.duration);
            const pct = bal.total > 0 ? Math.min(100, Math.round((request.duration / bal.total) * 100)) : 0;

            const isLow = soldeApres <= 5;

            const rows = [
              { icon: <Wallet size={14} className="text-blue-500" />, label: 'Solde total', value: bal.total, color: 'text-blue-900' },
              { icon: <CalendarDays size={14} className="text-blue-400" />, label: `Solde année dernière (${new Date().getFullYear() - 1})`, value: bal.anneeDerniere, color: 'text-blue-800' },
              { icon: <CalendarDays size={14} className="text-blue-300" />, label: `Solde année précédente (${new Date().getFullYear() - 2})`, value: bal.anneePrecedente, color: 'text-blue-700' },
            ];

          return (
            <motion.div
              variants={card}
              className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* HEADER */}
              <div className="bg-blue-100 border-b border-blue-100 px-6 py-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-blue-700 font-semibold">
                  <Wallet size={17} /> Solde de Congé
                </h2>
                {soldeLoading && (
                  <span className="text-xs text-blue-500 flex items-center gap-1.5 animate-pulse">
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Chargement…
                  </span>
                )}
              </div>

      <div className="p-5 space-y-1">

        {/* ROWS */}
        {rows.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2.5 border-b border-dashed border-blue-50 last:border-0"
          >
            <div className="flex items-center gap-2">
              {r.icon}
              <span className="text-sm text-blue-900/70">{r.label}</span>
            </div>

            <span className={`text-base font-bold ${r.color}`}>
              {r.value}
              <span className="text-xs font-normal text-blue-400 ml-1">j</span>
            </span>
          </div>
        ))}

        <div className="pt-1" />

        {/* SOLDE APRÈS APPROBATION */}
        <div
          className={`flex items-center justify-between rounded-xl px-3 py-3 border
          ${
            isLow
              ? 'bg-blue-50 border-blue-200'
              : 'bg-blue-100/40 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingDown
              size={14}
              className={isLow ? 'text-blue-600' : 'text-blue-500'}
            />
            <span className="text-sm font-medium text-blue-900">
              Solde après approbation
            </span>
          </div>

          <span
            className={`text-lg font-extrabold ${
              isLow ? 'text-blue-700' : 'text-blue-800'
            }`}
          >
            {soldeApres}
            <span className="text-xs font-normal text-blue-400 ml-1">j</span>
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="pt-3 pb-1">
          <div className="flex justify-between text-xs text-blue-500 mb-1.5">
            <span>Consommation prévue</span>
            <span className="font-medium text-blue-700">
              {request.duration} / {bal.total} jours ({pct}%)
            </span>
          </div>

          <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              className="h-full rounded-full bg-blue-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
})()}
        {/* ══ BARRE D'ACTIONS FINALE ════════════════════════════════════════ */}
        <motion.div
          variants={card}
          className="rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 flex flex-wrap items-center gap-3">

            {/* Status info */}
            {!canApprove && !canReject && (
              <p className="text-sm text-muted-foreground italic flex-1">
                {request.status === 'approved'         && '✓ Cette demande a déjà été approuvée.'}
                {request.status === 'rejected'         && '✗ Cette demande a été refusée.'}
                {request.status === 'cancelled'        && "Cette demande a été annulée par l'employé."}
                {request.status === 'pending_manager'  && user?.role === 'directeur' && 'En attente de validation du responsable.'}
                {request.status === 'pending_director' && user?.role === 'manager'   && 'Transmise au directeur pour validation finale.'}
              </p>
            )}

            {/* Right: Retour + Valider */}
            <div className="ml-auto flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-sm hover:shadow-md hover:text-foreground transition-all"
              >
                <ArrowLeft size={15} />
                Retour
              </motion.button>

              {canApprove && (
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(22,163,74,.40)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleValidateButton}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 text-white px-5 py-2.5 text-sm font-bold shadow-md hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <CheckCircle size={17} />
                  {actionLoading
                    ? 'Traitement...'
                    : user?.role === 'manager'
                    ? 'Transmettre au Directeur'
                    : 'Valider la Demande'}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* ══ CONFIRMATION MODAL ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && createPortal(
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              key="dialog"
              initial={{ scale: 0.93, y: 20, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{    scale: 0.93, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 260 }}
              className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`rounded-xl p-2.5 ${modalAction === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {modalAction === 'approve'
                    ? <CheckCircle size={20} className="text-green-600" />
                    : <XCircle    size={20} className="text-red-600"   />
                  }
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {modalAction === 'approve'
                      ? (user?.role === 'manager' ? 'Transmettre au Directeur' : 'Valider la Demande')
                      : 'Refuser la Demande'}
                  </h2>
                  <p className="text-xs text-muted-foreground">Cette action est irréversible</p>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-muted/50 border p-4 mb-4">
                <p className="font-semibold text-sm">{employee?.nomComplet ?? request.employeeName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {LEAVE_TYPE_LABELS[request.type]} &bull; {request.duration} jour(s)
                </p>
                <p className="text-xs text-muted-foreground">
                  {safeFormat(request.start_date, 'dd MMM yyyy', fr)} &rarr;{' '}
                  {safeFormat(request.end_date, 'dd MMM yyyy', fr)}
                </p>
              </div>

              {/* Comment */}
              <div className="space-y-1.5 mb-5">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <MessageSquare size={13} />
                  Commentaire{' '}
                  <span className="text-muted-foreground font-normal">
                    {modalAction === 'reject' ? '(recommandé)' : '(facultatif)'}
                  </span>
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    modalAction === 'reject'
                      ? 'Précisez le motif du refus…'
                      : 'Ajoutez un commentaire si nécessaire…'
                  }
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmAction}
                  disabled={actionLoading}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                    modalAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600   hover:bg-red-700'
                  } disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  {actionLoading ? 'Traitement...' : 'Confirmer'}
                </button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default DetailDemande;
