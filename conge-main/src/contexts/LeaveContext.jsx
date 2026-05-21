import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

const LeaveContext = createContext(undefined);

const API_URL = "http://127.0.0.1:8000/api";

// Transform snake_case API response to camelCase with employeeName
const transformDemande = (demande) => {
  if (!demande) return null;
  
  return {
    id: demande.id,
    userId: demande.user_id,
    type: demande.type,
    subType: demande.sub_type,
    startDate: demande.start_date,
    endDate: demande.end_date,
    duration: demande.duration,
    reason: demande.reason,
    status: demande.status,
    createdAt: demande.created_at,
    updatedAt: demande.updated_at,
    employeeName: demande.user?.name || 'Employé',
    employeeFull: demande.user,
    managerComment: demande.manager_comment,
    interimaireId: demande.interimaire_id,
    // Keep original fields for compatibility
    user_id: demande.user_id,
    start_date: demande.start_date,
    end_date: demande.end_date,
    created_at: demande.created_at,
    user: demande.user,
  };
};

export const LeaveProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [requestsHistory, setRequestsHistory] = useState([]);
  const [myDemandes, setMyDemandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [solde, setSolde] = useState(null);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const { user } = useAuth();
  const getToken = () => localStorage.getItem("token");
  const token = getToken();

  const getDemandes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/demandes`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
   
      const data = response.data;
      
      const demandesArray = Array.isArray(data)
        ? data
        : Array.isArray(data.demandes)
        ? data.demandes
        : [];
      
      // Transform all items to have camelCase and employeeName
      const transformedDemandes = demandesArray.map(transformDemande);

      setRequests(transformedDemandes);
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
      
      const demandesArray = Array.isArray(data)
        ? data
        : Array.isArray(data.demandes)
        ? data.demandes
        : [];
      
      // Transform all items to have camelCase and employeeName
      const transformedDemandes = demandesArray.map(transformDemande);

      setRequestsHistory(transformedDemandes);
      
    } catch (error) {
      console.error("GET DEMANDES ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

const getMyDemandes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/my-demandes`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
   
      const data = response.data;
      
      const demandesArray = Array.isArray(data)
        ? data
        : Array.isArray(data.demandes)
        ? data.demandes
        : [];
      
      const transformedDemandes = demandesArray.map(transformDemande);

      setMyDemandes(transformedDemandes);
    } catch (error) {
      console.error("GET MY DEMANDES ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (getToken()) {
    getDemandesHistory();
    getMyDemandes();

    const interval = setInterval(() => {
      getDemandesHistory();
      getMyDemandes();
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
      try {
          const res = await axios.patch(
              `${API_URL}/demandes/${id}/cancel`,
              {},
              {
                  headers: {
                      Authorization: `Bearer ${getToken()}`,
                      Accept: "application/json",
                  },
              }
          );
          console.log('✅ cancel response:', res.data);
          await getDemandes();
          await getMyDemandes();
          await getDemandesHistory();
      } catch (err) {
          console.error('❌ status:', err.response?.status);
          console.error('❌ data:', err.response?.data);
      }
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
    requests.filter((r) => String(r.userId) === String(employeeId) || String(r.user_id) === String(employeeId));

  const getPendingForManager = () =>
    requests.filter((r) => r.status === "pending_manager" && (r.user?.efp_travail === user?.efp_travail || r.employeeFull?.efp_travail === user?.efp_travail));

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
        myDemandes,
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