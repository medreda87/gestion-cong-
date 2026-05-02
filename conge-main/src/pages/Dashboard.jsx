import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, TrendingUp, Users, Upload, Image as ImageIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave } from '@/contexts/LeaveContext';
import { useBalance } from '@/contexts/BalanceContext';
import { LEAVE_TYPE_LABELS } from '@/types/leave';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogClose, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState, useEffect, useCallback } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const balance = useBalance();
  const { getEmployeeTotalBalance, getEmployeeYearBalance } = balance;
  const { requests, images, getRequestsByEmployee, getPendingForManager, getPendingForDirector, addImage } = useLeave();
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  
const LEAVE_STATUS_LABELS = {
  pending_manager: user.role === 'manager' ? 'En attente (Directeur)' : 'En attente (Responsable)',
  pending_director: 'En attente (Directeur)',
  approved: 'Approuvé',
  cancelled: 'Annulé',

};


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadFile(file);
    }
  };

  
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const balances = user?.balances || [];

const currentBalance = balances.find(
  (b) => b.year === currentYear
);

const previousBalance = balances.find(
  (b) => b.year === previousYear
);

const currentSolde =
  (currentBalance?.earnedDays || 0) -
  (currentBalance?.usedDays || 0);

const previousSolde =
  (previousBalance?.earnedDays || 0) -
  (previousBalance?.usedDays || 0);

const totalSolde = currentSolde + previousSolde;

  const handleUpload = async () => {
    if (!uploadFile) return;
    setIsUploading(true);
    addImage(uploadFile);
    setUploadFile(null);
    setIsUploading(false);
    const input = document.getElementById('image-upload');
    if (input) input.value = '';
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  

  if (!user) return null;

const allRequests = Array.isArray(requests) ? requests : [];

const myRequests = allRequests.filter(
  (r) => String(r.user_id) === String(user.id)
);

console.log("REQUESTS DASHBOARD:", requests);
console.log("ALL REQUESTS:", allRequests);
console.log("MY REQUESTS:", myRequests);

const recentRequests = myRequests.slice(0, 5);

const approvedCount = myRequests.filter(
  (r) => r.status === "approved"
).length;

const pendingDirectorCount = myRequests.filter(
  (r) => r.status === "pending_director"
).length;

const pendingCount = myRequests.filter(
  (r) => r.status === "pending_manager"
).length;

const pendingToReview =
  user.role === "manager"
    ? allRequests.filter((r) => r.status === "pending_manager")
    : user.role === "director"
    ? allRequests.filter((r) => r.status === "pending_director")
    : [];


  const getStatusBadgeClass = (status) => {
    const variants = {
      'pending_manager': 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-warning/10 text-warning border-warning/20',
      'pending_director': 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border-primary/20',
      'approved': 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success border-success/20',
      'rejected': 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-destructive/10 text-destructive border-destructive/20',
    };
    return variants[status] || 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium';
  };

  const getInitials = (nom, prenom) => {
  return `${nom?.charAt(0) || ""}${prenom?.charAt(0) || ""}`.toUpperCase();
};

  return (
    <>
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Bonjour , {user.nom.split(' ')[0]} 
              </h1>
              <p className="mt-1 text-muted-foreground">
                Bienvenue sur votre tableau de bord
              </p>
            </div>
            <Link to="/request">
              <Button>
                <Calendar className="h-4 w-4" />
                Nouvelle demande
              </Button>
            </Link>
          </div>

          {/* Director Image Upload */}
          {user.role === 'director' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Publier une image</CardTitle>
                    <p className="text-sm text-muted-foreground">Les images apparaîtront sur le tableau de bord de tous</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className={cn(
                    "group border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50",
                    dragActive && "border-blue-400 bg-blue-50 shadow-md ring-2 ring-blue-200"
                  )}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="space-y-2">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Glissez-déposez ou cliquez pour sélectionner
                    </p>
                    <p className="text-sm text-muted-foreground/70 mb-6">
                      PNG, JPG jusqu'à 5 Mo
                    </p>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="image-upload" 
                      className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-md border bg-background px-6 py-3 text-sm font-medium shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                      <Upload className="h-4 w-4" />
                      Sélectionner une image
                    </label>
                  </div>
                </div>
                {uploadFile && (
                  <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex items-center gap-3 flex-1">
                      <img 
                        src={URL.createObjectURL(uploadFile)} 
                        alt={uploadFile.name}
                        className="h-16 w-16 object-cover rounded-lg border shadow-sm"
                      />
                      <div>
                        <p className="font-medium">{uploadFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadFile.size / 1024 / 1024).toFixed(1)} Mo
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleUpload}
                        disabled={isUploading}
                        size="sm"
                      >
                        {isUploading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Upload
                          </>
                        ) : (
                          'Publier'
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setUploadFile(null);
                          const input = document.getElementById('image-upload');
                          if (input) input.value = '';
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}

         {/* Stats */}
<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
  {[
    {
      title: "Solde de congés",
      value: totalSolde,
      subtitle: `${previousYear}: ${previousSolde} j • ${currentYear}: ${currentSolde} j`,
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "En attente responsable",
      value: pendingCount,
      subtitle: "Demandes à valider",
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      title: "Attente directeur",
      value: pendingDirectorCount,
      subtitle: "Validation finale",
      icon: Users,
      color: "from-violet-500 to-purple-500",
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    {
      title: "Congés validés",
      value: approvedCount,
      subtitle: "Demandes approuvées",
      icon: CheckCircle,
      color: "from-emerald-500 to-green-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    }
  ].map((stat, index) => {
    const Icon = stat.icon;

    return (
      <motion.div
        key={stat.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08 }}
        className="group relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <div className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${stat.color}`} />

        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              {stat.title}
            </p>

            <p className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
              {stat.value}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {stat.subtitle}
            </p>
          </div>

          <div className={`rounded-2xl ${stat.bg} p-3 ${stat.text}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    );
  })}
</div>

         

          {/* Pending to review */}
          {pendingToReview.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-warning/10 p-2">
                    <Users className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Demandes à traiter</h2>
                    <p className="text-sm text-muted-foreground">
                      {pendingToReview.length || 0} demande(s) en attente de votre validation
                    </p>
                  </div>
                </div>
                <Link to="/pending">
                  <Button variant="outline" size="sm">
                    Voir tout
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {pendingToReview.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border bg-background p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium">
                        {getInitials(request.user?.nom, request.user?.prenom)}
                      </div>
                      <div>
                        <p className="font-medium">{request.employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {LEAVE_TYPE_LABELS[request.type]} • {request.duration} jours
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(request.start_date), 'dd MMM yyyy', { locale: fr })}
                      </p>
                      <span className={getStatusBadgeClass(request.status)}>
                        {LEAVE_STATUS_LABELS[request.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border bg-card p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Mes demandes récentes</h2>
                  <p className="text-sm text-muted-foreground">
                    Historique de vos dernières demandes
                  </p>
                </div>
              </div>
              <Link to="/history">
                <Button variant="outline" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>

            {recentRequests.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Calendar className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>Aucune demande de congé</p>
                <Link to="/request">
                  <Button variant="link" className="mt-4">
                    Faire une première demande
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between rounded-lg border bg-background p-4"
                  >
                    <div>
                      <p className="font-medium">{LEAVE_TYPE_LABELS[request.type]}</p>
                      <p className="text-sm text-muted-foreground">
                        Du {format(new Date(request.start_date), 'dd MMM', { locale: fr })} au{' '}
                        {format(new Date(request.end_date), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{request.duration} jours</span>
                      <span className={getStatusBadgeClass(request.status)}>
                        {LEAVE_STATUS_LABELS[request.status]}
                      </span>
                      
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </DashboardLayout>

      
    </>
  );
};

export default Dashboard;

