import React, { createContext, useContext, useEffect, useState } from 'react';
import { RequestStatus } from '@/types/leave';
import { ImageOff } from 'lucide-react';
import axios from 'axios';

const DataContext = createContext(undefined);
const INITIAL_HOLIDAYS = [
  { id: 'h1', name: "Nouvel An", date: '2026-01-01' },
  { id: 'h2', name: "Manifeste de l'Indépendance", date: '2026-01-11' },
  { id: 'h3', name: "Fête du Travail", date: '2026-05-01' },
  { id: 'h4', name: "Fête du Trône", date: '2026-07-30' },
  { id: 'h5', name: "Révolution du Roi et du Peuple", date: '2026-08-20' },
  { id: 'h6', name: "Fête de la Jeunesse", date: '2026-08-21' },
  { id: 'h7', name: "Marche Verte", date: '2026-11-06' },
  { id: 'h8', name: "Fête de l'Indépendance", date: '2026-11-18' },
];


const INITIAL_REQUESTS = [
  {
    id: 'r1',
    employeeId: '1',
    employeeName: 'Ahmed Benali',
    type: 'administratif',
    interimaire: 'Youssef Tahiri',
    startDate: '2026-03-15',
    endDate: '2026-03-20',
    duration: 5,
    status: 'en_attente',
    createdAt: '2026-03-01',
  },
  {
    id: 'r2',
    employeeId: '1',
    employeeName: 'Ahmed Benali',
    type: 'exceptionnel',
    exceptionalReason: 'naissance',
    interimaire: 'Karim Mansouri',
    startDate: '2026-02-10',
    endDate: '2026-02-12',
    duration: 3,
    status: 'valide_directeur',
    createdAt: '2026-02-05',
  },
];

export const DataProvider = ({ children }) => {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [holidays, setHolidays] = useState();

  const addRequest = (req) => {
    setRequests(prev => [
      ...prev,
      {
        ...req,
        id: `r${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);
  };

  const updateRequestStatus = (id, status, comment) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id !== id) return r;

        const updates = { status };

        if (status === 'valide_responsable' && comment)
          updates.responsableComment = comment;

        if (status === 'valide_directeur' && comment)
          updates.directeurComment = comment;

        return { ...r, ...updates };
      })
    );
  };

 const addHoliday = async (holiday) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/api/holidays",
    holiday,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    }
  );
  setHolidays(prev => [...prev, response.data]);
};

const updateHoliday = async (id, data) => {
  const response = await axios.put(
    `http://127.0.0.1:8000/api/holidays/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    }
  );

  setHolidays(prev =>
    prev.map(h => (h.id === id ? response.data : h))
  );
};

const removeHoliday = async (id) => {
  await axios.delete(`http://127.0.0.1:8000/api/holidays/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  setHolidays(prev => prev.filter(h => h.id !== id));
};

const getHolidays = async () => {
  const response = await axios.get("http://127.0.0.1:8000/api/holidays", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  setHolidays(response.data);
};

useEffect(() => {
    getHolidays();
},[])

  return (
    <DataContext.Provider
      value={{
        requests,
        holidays,
        addRequest,
        updateRequestStatus,
        addHoliday,
        removeHoliday,
        getHolidays,
        updateHoliday
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};