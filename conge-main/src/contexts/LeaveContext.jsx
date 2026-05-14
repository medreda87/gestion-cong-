import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const LeaveContext = createContext(undefined);

const API_URL = "http://127.0.0.1:8000/api";

export const LeaveProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [requestsHistory, setRequestsHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [solde, setSolde] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const { user } = useAuth();
  const getToken = () => localStorage.getItem("token");
  const token = getToken();
  const getDemandes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/demandes`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
   
      const data = response.data;

      setRequests(
        Array.isArray(data)
          ? data
          : Array.isArray(data.demandes)
          ? data.demandes
          : []
      );
    } catch (error) {
      console.error("GET DEMANDES ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (getToken()) {
    getDemandes();

    const interval = setInterval(() => {
      getDemandes();
    }, 5000);
    return () => clearInterval(interval);
  }
}, []);

const getDemandesHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/demandeHistory`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
   
      const data = response.data;

      setRequestsHistory(
        Array.isArray(data)
          ? data
          : Array.isArray(data.demandes)
          ? data.demandes
          : []
      );
      
    } catch (error) {
      console.error("GET DEMANDES ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (getToken()) {
    getDemandesHistory();

    const interval = setInterval(() => {
      getDemandesHistory();
    }, 5000);
    return () => clearInterval(interval);
  }
}, [token,user?.id,refreshHistory]);

const triggerRefreshHistory = () => {
  setRefreshHistory(prev => !prev);
};

  const addRequest = async (request) => {
      const response = await axios.post(
        `${API_URL}/store_demande`,
        request,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        }
      );

      await getDemandes();
      return response.data;
    };

  const updateRequestStatus = async (id, status, comment = "") => {
    await axios.put(
      `${API_URL}/demandes/${id}/status`,
      { status, comment },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      }
    );

    await getDemandes();
  };

  const cancelLeave = async (id) => {
    await axios.put(
      `${API_URL}/demandes/${id}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      }
    );

    await getDemandes();
  };

  const deleteLeave = async (id) => {
    await axios.delete(`${API_URL}/demandes/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: "application/json",
      },
    });

    await getDemandes();
  };
  
  const getRequestsByEmployee = (employeeId) =>
    requests.filter((r) => String(r.user_id) === String(employeeId));

  const getPendingForManager = () =>
    requests.filter((r) => r.status === "pending_manager" && r.user?.efp_travail === user?.efp_travail);

  const getPendingForDirector = () =>
    requests.filter((r) => r.status === "pending_director");

  const getSolde = async (user_id) => {
  try {
    const res = await axios.get(`${API_URL}/users/${user_id}/solde`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: "application/json",
      },
    });

    setSolde(res.data);
  } catch (error) {
    console.error("SOLDE ERROR:", error.response?.data || error.message);
  }
};
useEffect(() => {
  if (user?.id) {
    getSolde(user.id);
  } else {
    setSolde(null);
  }
}, [user]);


const validateLeave = async (id) => {
  try {

    const response = await axios.put(
      `${API_URL}/demandes/${id}/validate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      }
    );

    await getDemandes();

    return response.data;

  } catch (error) {

    console.error(
      "VALIDATE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};


  return (
    <LeaveContext.Provider
      value={{
        requests,
        loading,
        solde,
        requestsHistory,
        getDemandes,
        addRequest,
        updateRequestStatus,
        cancelLeave,
        deleteLeave,
        getRequestsByEmployee,
        getPendingForManager,
        getPendingForDirector,
        validateLeave,
        triggerRefreshHistory
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};