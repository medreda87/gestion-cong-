import React, { createContext, useContext, useEffect, useState } from 'react';
import { RequestStatus } from '@/types/leave';
import { ImageOff } from 'lucide-react';
import axios from 'axios';

const DataContext = createContext(undefined);


export const DataProvider = ({ children }) => {
  const [requests, setRequests] = useState();
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