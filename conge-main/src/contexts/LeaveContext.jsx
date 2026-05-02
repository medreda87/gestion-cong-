import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

const LeaveContext = createContext(undefined);

const API_URL = "http://127.0.0.1:8000/api";

export const LeaveProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  
const getDemandes = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/demandes",{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
      },
    });
    
    console.log("DEMANDES API:", response.data);

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
  }
};

useEffect(() => {
  getDemandes();
}, []);

  const addRequest = async (request) => {
    try {
      const response = await axios.post(`${API_URL}/store_demande`, request, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });

      await getDemandes();
      return response.data;
    } catch (error) {
      console.error("Erreur addRequest:", error.response?.data || error.message);
      throw error;
    }
  };

  const updateRequestStatus = async (id, status, comment = "") => {
    try {
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
    } catch (error) {
      console.error("Erreur updateRequestStatus:", error.response?.data || error.message);
      throw error;
    }
  };

  const cancelLeave = async (id) => {
    try {
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
    } catch (error) {
      console.error("Erreur cancelLeave:", error.response?.data || error.message);
      throw error;
    }
  };

  const deleteLeave = async (id) => {
    try {
      await axios.delete(`${API_URL}/demandes/${id}`,{
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });

      await getDemandes();
    } catch (error) {
      console.error("Erreur deleteLeave:", error.response?.data || error.message);
      throw error;
    }
  };

 const getRequestsByEmployee = (employeeId) =>
  (Array.isArray(requests) ? requests : []).filter(
    (r) => String(r.user_id) === String(employeeId)
  );

 const getPendingForManager = () =>
  (Array.isArray(requests) ? requests : []).filter(
    (r) => r.status === "pending_manager"
  );

const getPendingForDirector = () =>
  (Array.isArray(requests) ? requests : []).filter(
    (r) => r.status === "pending_director"
  );

  return (
    <LeaveContext.Provider
      value={{
        requests,
        loading,
        getDemandes,
        addRequest,
        updateRequestStatus,
        cancelLeave,
        deleteLeave,
        getRequestsByEmployee,
        getPendingForManager,
        getPendingForDirector,
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

