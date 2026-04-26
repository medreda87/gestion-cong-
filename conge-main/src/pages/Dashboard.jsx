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

const LEAVE_STATUS_LABELS = {
  pending_manager: 'En attente (Responsable)',
  pending_director: 'En attente (Directeur)',
  approved: 'Approuvé',
  rejected: 'Refusé',
};

const Dashboard = () => {
  const { user } = useAuth();
  const balance = useBalance();
  const { getEmployeeTotalBalance, getEmployeeYearBalance } = balance;
  const { requests, images, getRequestsByEmployee, getPendingForManager, getPendingForDirector, addImage } = useLeave();
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadFile(file);
    }
  };

  
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const currentBalance = user?.balances.find(
    (b) => b.year === currentYear
  );

  const previousBalance = user?.balances.find(
    (b) => b.year === previousYear
  );

  const currentSolde =
    (currentBalance?.earnedDays || 0) -
    (currentBalance?.usedDays || 0);

  

  const previousSolde =
    (previousBalance?.earnedDays || 0) -
    (previousBalance?.usedDays || 0);
console.log("USER:", user);
console.log("BALANCES:", user?.balances);
console.log("CURRENT YEAR:", currentYear);
console.log("PREVIOUS YEAR:", previousYear);
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

  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [images]);

  if (!user) return null;

  const myRequests = getRequestsByEmployee(user.id);
  const approvedCount = myRequests.filter(
  (r) => r.status === "approved"
).length;

const pendingDirectorCount = myRequests.filter(
  (r) => r.status === "pending_director"
).length;

const pendingCount = myRequests.filter(
  (r) => r.status === "pending_manager"
).length;
  const rejectedCount = myRequests.filter((r) => r.status === 'rejected').length;

  const pendingToReview = user.role === 'manager' 
    ? getPendingForManager() 
    : user.role === 'director' 
    ? getPendingForDirector() 
    : [];

  const recentRequests = myRequests.slice(0, 5);

  const getStatusBadgeClass = (status) => {
    const variants = {
      'pending_manager': 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-warning/10 text-warning border-warning/20',
      'pending_director': 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border-primary/20',
      'approved': 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success border-success/20',
      'rejected': 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-destructive/10 text-destructive border-destructive/20',
    };
    return variants[status] || 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium';
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
                Bonjour, {user.name.split(' ')[0]} 👋
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border p-6 shadow-sm bg-card"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Solde de congés</p>
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-3xl font-bold tracking-tight">
                      {user ? getEmployeeTotalBalance(user.id) : 0}
                    </span>
                    <span className="text-sm text-muted-foreground">jours</span>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>2025: {previousSolde} j</span>
                    <span>2026: {currentSolde} j</span>
                  </div>
                </div>
                <div className="rounded-lg p-3 bg-muted text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Auto-mis à jour</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border p-6 shadow-sm bg-warning/5 border-warning/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-darck-foreground">En attente</p>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{pendingCount}</p>
                  <p className="mt-1 text-sm text-darck-foreground/70">Demandes</p>
                </div>
                <div className="rounded-lg p-3 bg-warning/10 text-darck">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border p-6 shadow-sm bg-success/5 border-success/20"
            >
              <p className="text-sm font-medium text-darck-foreground">Congés validés</p>

              <p className="mt-2 text-3xl font-bold tracking-tight">
                {approvedCount} 
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
              {pendingDirectorCount}  en attente directeur
            </p>
            </motion.div>
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border bg-card shadow-sm overflow-hidden"
              >
                <CardHeader className="pb-4 bg-gradient-to-r from-indigo-50 to-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2">
                      <ImageIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Galerie d'images</CardTitle>
                      <p className="text-sm text-muted-foreground">{images.length} image(s)</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                    {images.map((img) => (
                      <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="group relative overflow-hidden rounded-xl border shadow-sm cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        onClick={() => handleImageClick(img)}
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-48 object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs bg-black/70 text-white px-2 py-1 rounded-full truncate">
                            {img.name}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-white/90 hover:bg-white text-gray-900 text-xs px-2 py-1 rounded-full font-medium shadow-md transition-all duration-200 hover:shadow-lg">
                            {Math.round(img.size / 1024)} KB
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </motion.div>

              {/* Image Modal - Fixed */}
              <Dialog open={!!selectedImage} onOpenChange={closeModal}>
                <DialogPortal>
                  <DialogOverlay />
                  <DialogContent className="max-w-6xl max-h-[90vh] p-0 mx-auto">
                    <div className="p-6 lg:p-8 max-h-[90vh] overflow-auto">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-xl font-semibold">{selectedImage?.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {selectedImage && Math.round(selectedImage.size / 1024)} KB •{' '}
                            {selectedImage && new Date(selectedImage.uploadedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <DialogClose asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 rounded-full p-0"
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </DialogClose>
                      </div>
                      {selectedImage && (
                        <div className="relative w-full max-h-[70vh] mx-auto flex items-center justify-center">
                          <img
                            src={selectedImage.url}
                            alt={selectedImage.name}
                            className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                          />
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </DialogPortal>
              </Dialog>
            </>
          )}

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
                      {pendingToReview.length} demande(s) en attente de votre validation
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                        {request.employeeName.split(' ').map((n) => n[0]).join('')}
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
                        {format(new Date(request.startDate), 'dd MMM yyyy', { locale: fr })}
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
                        Du {format(new Date(request.startDate), 'dd MMM', { locale: fr })} au{' '}
                        {format(new Date(request.endDate), 'dd MMM yyyy', { locale: fr })}
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

      {/* Image Modal */}
      {selectedImage && (
        <Dialog open={true} onOpenChange={closeModal}>
          <DialogPortal>
            <DialogOverlay className="z-[60]" />
            <DialogContent className="z-[70] max-w-6xl max-h-[95vh] p-0 mx-auto">
              <div className="p-4 lg:p-8 max-h-[95vh] overflow-auto">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <div>
                    <h2 className="text-2xl font-semibold">{selectedImage.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(selectedImage.size / 1024)} KB • {new Date(selectedImage.uploadedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-12 w-12 rounded-full p-0"
                    >
                      <XCircle className="h-6 w-6" />
                    </Button>
                  </DialogClose>
                </div>
                <div className="flex items-center justify-center py-8 px-4">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.name}
                    className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </>
  );
};

export default Dashboard;

