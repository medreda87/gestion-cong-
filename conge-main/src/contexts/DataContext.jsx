import React, { createContext, useContext, useEffect, useState } from 'react';
import { RequestStatus } from '@/types/leave';
import { ImageOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

const DataContext = createContext(undefined);


export const DataProvider = ({ children }) => {
  const [requests, setRequests] = useState();
  const [holidays, setHolidays] = useState([]);
  const [parameters, setParameters] = useState([]);
  const { user, token, logout } = useAuth();

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
  if (!token) return;

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/holidays", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setHolidays(response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      logout();
    } else {
      console.error("GET HOLIDAYS ERROR:", error.response?.data || error.message);
    }
  }
};

const getParametrage = async () => {
    if (!token) return;

    try {
        const res = await axios.get("http://127.0.0.1:8000/api/parametrage", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setParameters(res.data);
        return res.data;

    } catch (error) {
        if (error.response?.status === 401) {
          logout();
        } else {
          console.error("GET PARAMETRAGE ERROR:", error.response?.data || error.message);
        }
    }
};
  useEffect(() => {
    if (!user?.id) return;
    getHolidays();
    getParametrage();
},[user?.id, token])

    // ADD
    const addParametrage = async (data) => {
        try {

            const res = await axios.post(
                "http://127.0.0.1:8000/api/parametrage/add",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            return res.data;

        } catch (error) {
            console.log(error);
        }
    };

    // UPDATE
    const updateParametrage = async (id, data) => {
        try {

            const res = await axios.post(
                `http://127.0.0.1:8000/api/parametrage/update/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            return res.data;

        } catch (error) {
            console.log(error);
        }
    };

    // DELETE
    const deleteParametrage = async (id) => {
        try {

            const res = await axios.delete(
                `http://127.0.0.1:8000/api/parametrage/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            return res.data;

        } catch (error) {
            console.log(error);
        }
    };

  return (
    <DataContext.Provider
      value={{
        requests,
        holidays,
        parameters,
        addRequest,
        updateRequestStatus,
        addHoliday,
        removeHoliday,
        getHolidays,
        updateHoliday,
        getParametrage,
        addParametrage,
        updateParametrage,
        deleteParametrage
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
