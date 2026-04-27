import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock initial data
const INITIAL_REQUESTS = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Ahmed Bennani',
    type: 'annual',
    startDate: '2026-01-20',
    endDate: '2026-01-24',
    duration: 5,
    reason: 'Vacances familiales',
    status: 'pending_manager',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-05T10:00:00Z',
  },
  {
    id: '2',
    employeeId: '1',
    employeeName: 'Ahmed Bennani',
    type: 'sick',
    startDate: '2025-12-10',
    endDate: '2025-12-12',
    duration: 3,
    status: 'approved',
    createdAt: '2025-12-09T08:00:00Z',
    updatedAt: '2025-12-09T14:00:00Z',
  },
  {
    id: '3',
    employeeId: '4',
    employeeName: 'Karim Idrissi',
    type: 'annual',
    startDate: '2026-02-01',
    endDate: '2026-02-05',
    duration: 5,
    reason: 'Voyage',
    status: 'pending_director',
    createdAt: '2026-01-08T09:00:00Z',
    updatedAt: '2026-01-09T11:00:00Z',
    managerComment: 'Approuvé par le responsable',
  },
];

const LeaveContext = createContext(undefined);

export const LeaveProvider = ({ children }) => {
  const [requests, setRequests] = useState(() => {
    const stored = localStorage.getItem('conge_requests');
    return stored ? JSON.parse(stored) : INITIAL_REQUESTS;
  });

  const [images, setImages] = useState(() => {
    const stored = localStorage.getItem('conge_images');
    return stored ? JSON.parse(stored) : [];
  });

  const saveRequests = (newRequests) => {
    setRequests(newRequests);
    localStorage.setItem('conge_requests', JSON.stringify(newRequests));
  };

  const saveImages = (newImages) => {
    setImages(newImages);
    localStorage.setItem('conge_images', JSON.stringify(newImages));
  };

  const addRequest = (request) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveRequests([newRequest, ...requests]);
  };

  const addImage = (file) => {
    const imageUrl = URL.createObjectURL(file);
    const imageData = {
      id: Date.now().toString(),
      url: imageUrl,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
    saveImages([imageData, ...images]);
  };

  const updateRequestStatus = (id, status, comment) => {
    const updated = requests.map((req) => {
      if (req.id === id) {
        return {
          ...req,
          status,
          ...(status === 'pending_director' || status === 'rejected' 
            ? { managerComment: comment } 
            : { directorComment: comment }),
          updatedAt: new Date().toISOString(),
        };
      }
      return req;
    });
    saveRequests(updated);
  };

  const deleteLeave = (leaveId) => {
    setRequests((prev) => prev.filter((req) => req.id !== leaveId));
  };

  const cancelLeave = (id) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id && req.status.startsWith("pending")) {
          return { ...req, status: "cancelled" };
        }
        return req;
      })
    );
  };

  const getRequestsByEmployee = (employeeId) => 
    requests.filter((r) => r.employeeId === employeeId);

  const getPendingForManager = () =>
  requests.filter(
    (r) => r.status === "pending_manager" || r.status === "cancelled"
  );

  const getPendingForDirector = () => 
    requests.filter((r) => r.status === 'pending_director');

  return (
    <LeaveContext.Provider 
      value={{ 
        requests, 
        images,
        addRequest, 
        addImage,
        deleteLeave,
        updateRequestStatus, 
        cancelLeave,
        getRequestsByEmployee,
        getPendingForManager,
        getPendingForDirector
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};

