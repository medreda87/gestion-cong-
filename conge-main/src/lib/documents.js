// utils/documents.js
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (file) => {
  if (file.type?.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'pdf';
  if (file.name?.toLowerCase().endsWith('.pdf')) return 'pdf';
  return 'other';
};

// Mock shared documents (replace with API call)
export const mockDocuments = [
  {
    id: '1',
    name: 'Règlement intérieur 2025.pdf',
    type: 'pdf',
    size: 1240000,
    date: '2025-01-15',
    fileURL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    mimeType: 'application/pdf',
    uploadedBy: 'Marc Laurent (Dir.)',
  },
  {
    id: '2',
    name: 'Organigramme.png',
    type: 'image',
    size: 350000,
    date: '2025-01-20',
    fileURL: 'https://picsum.photos/id/104/800/600',
    mimeType: 'image/png',
    uploadedBy: 'Marc Laurent (Dir.)',
  },
  {
    id: '3',
    name: 'Procédure congés.pdf',
    type: 'pdf',
    size: 890000,
    date: '2025-01-25',
    fileURL: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    mimeType: 'application/pdf',
    uploadedBy: 'Sophie Martin (Dir.)',
  },
];