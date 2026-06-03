import React, { useEffect, useState } from 'react';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import { useLeave } from '@/contexts/LeaveContext';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const safeFormat = (date, pattern) => {
  const d = new Date(date);
  return isValid(d) ? format(d, pattern, { locale: fr }) : '—';
};

const DecisionDocument = React.forwardRef(
  ({ request, employee, LEAVE_TYPE_LABELS }, ref) => {
    const date_derniere = parseInt(employee.solde_annee_derniere);
    const date_precedent = parseInt(employee.solde_annee_precedente);
    const currentYear = new Date().getFullYear();
    const lastYesr = new Date().getFullYear() - 1;
    const [interimaireData,setInterimaireData] = useState();
    const {requests} = useLeave();
    const {parameters} = useData();
    const { user } = useAuth();

    const sexe = user?.detail_user?.sexe;

    const civilite =
      typeof sexe === "string" && sexe.trim().toLowerCase() === "homme"
        ? "Monsieur"
        : "Madame";
  useEffect(() => {
  const id = request?.interimaireId || request?.interimaire_id; 

  if (!id) {
    setInterimaireData(null);
    return;
  }

  const token = localStorage.getItem('token');

  axios
    .get(`http://127.0.0.1:8000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    .then(res => {
      const u = res.data;
      if (u && u.prenom && u.nom) {
        setInterimaireData({ nomComplet: `${u.prenom} ${u.nom}`.trim() });
      } else if (u) {
        setInterimaireData({ nomComplet: u.nom_prenom || u.nom || '—' });
      } else {
        setInterimaireData(null);
      }
    })
    .catch(err => {
      console.warn('interimaire fetch error:', err.message);
      setInterimaireData(null);
    });

}, [request?.interimaireId, request?.interimaire_id]);
    
    return (
      <div
        ref={ref}
        style={{
          width: '794px',
          height: '1123px',
          background: '#fff',
          padding: '40px',
          paddingBottom: '120px',
          color: '#000',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        }}
      >
        {/* HEADER */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
            <img src="/images/logo.png" alt="OFPPT"
              style={{ margin: 0, width: '90px', height: '90px', objectFit: 'contain' }}
            />
            <div style={{ width: '2px', height: '60px', backgroundColor: '#00000030' }} />
            <div>
              <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                مكتب التكوين المهني وإنعاش الشغل
              </p>
              <p style={{ margin: '4px 0', fontSize: '12px' }}>Office de la Formation Professionnelle</p>
              <p style={{ margin: 0, fontSize: '12px' }}>et de la Promotion du Travail</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '20px', marginBottom: '20px' }}>
            <p><strong>N/Réf :</strong> {parameters.cfpt_code}/{parameters.direction_code}/{requests?.length}/{currentYear.toString().slice(-2)}</p>
            <p>Tanger, le {safeFormat(new Date(), 'dd/MM/yyyy')}</p>
          </div>
        </div>

        {/* TITLE */}
        <h2 style={{ textAlign: 'center', textDecoration: 'underline', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          DECISION DE CONGE {(request.type).toUpperCase()}
        </h2>

        {/* TEXT */}
        <div style={{ fontSize: '15px', lineHeight: '1.6' }}>
          <ul>
            <li className="list-item">
              Le Directeur de l'Office de la Formation Professionnelle et de la Promotion du Travail ;
            </li>
            <li className="list-item">
              Vu le Dahir portant lot N⁰1-72-183 Rabia II 1394 (21 Mai 1974) instituant l'Office de la Formation Professionnelle et de la Promotion du Travail ;
            </li>
            <li className="list-item">
              Vu la Décision de Madame le Directeur Général {parameters.delegation_number} en date du {safeFormat(parameters.delegation_date, 'dd/MM/yyyy')} portant Délégation signature à {civilite} {user.nom} {user.prenom} Directeur de Complexe Tanger;
            </li>
            <li className="list-item">
              Vu la demande de congé administratif présenté(e) par{' '}
              <strong>{employee?.nomComplet ?? request.employeeName}</strong>
            </li>
          </ul>
        </div>

        {/* DECIDE */}
        <h3 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '15px', fontSize: '22px', textDecoration: 'underline', fontWeight: 'bold' }}>
          DECIDE
        </h3>

        <p style={{ fontStyle: 'italic', marginBottom: '15px' }}>ARTICLE UNIQUE :</p>

        <p style={{ marginBottom: '15px' }}>
          Il est accordé un congé :{' '}
          <strong>{LEAVE_TYPE_LABELS[request.type] ?? request.type}</strong>
        </p>

        {/* TABLE */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={tdStyle}><strong>Nom & Prénom</strong></td>
              <td style={tdStyle}><strong>Affectation</strong></td>
            </tr>
            <tr>
              <td style={tdStyle}>{employee?.nomComplet ?? request.employeeName}</td>
              <td style={tdStyle}>{employee?.affectation ?? '—'}</td>
            </tr>
            <tr>
              <td style={tdStyle}>
                <ul>
                  <li><strong>Catégorie :</strong> {employee?.categorie ?? '—'}</li>
                  <li><strong>Fonction :</strong> {employee?.poste ?? '—'}</li>
                  <li><strong>Matricule :</strong> {employee?.matricule ?? '—'}</li>
                </ul>
              </td>
              <td style={tdStyle}>
                <ul>
                  <li><strong>Durée accordée :</strong> {request.duration} jours</li>
                  <li><strong>Date début :</strong> {safeFormat(request.start_date, 'dd/MM/yyyy')}</li>
                  <li><strong>Date fin :</strong> {safeFormat(request.end_date, 'dd/MM/yyyy')}</li>
                  <li><strong>Reliquant :</strong> {date_derniere}/{lastYesr}, {date_precedent}/{currentYear}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        {/* SIGNATURE */}
        <div style={{ marginTop: '8px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>
          Directeur CFPT 1
        </div>

        <div style={{ marginTop: '20px' }}>
          <ul>
            <li style={{ fontStyle: 'italic' }}>&#10148; L'intérim sera assuré par : {interimaireData?.nomComplet}</li>
            <li style={{ fontStyle: 'italic' }}>&#10148; L'intéressé(e) est autorisé(e) à quitter le territoire marocain</li>
          </ul>
        </div>

        {/* FOOTER BOTTOM - Addresses */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '40px',
          right: '40px',
          borderTop: '2px solid #000',
          paddingTop: '10px',
          fontSize: '9px',
          color: '#000',
        }}
      >
        {/* Title centered */}
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', textAlign: 'center', fontSize: '10px' }}>
          Complexe de Formation Professionnelle Tanger 1
        </p>

        {/* All columns in one flex row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          
          {/* Direction Régionale */}
           
          

          {/* Divider */}
          <div/>
           <div style={{ flex: 1,textAlign:'center' }}>
            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold' }}>Direction Régionale</p>
            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold' }}>DRTTA</p>
            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold' }}>CFP Tanger 1</p>
          </div>
          <div style={{ flex: 1,textAlign:'center' }}>
           <p style={{ margin: 0 }}>ISTA NTIC</p>
            <p style={{ margin: 0 }}>Km 06, Route de Rabat</p>
            <p style={{ margin: 0 }}>Tanger</p>
            <p style={{ margin: 0 }}>Tél. : 0539 38 08 71</p>
          </div>
          {/* ISTA IBN MARHAL */}
          <div style={{ flex: 1,textAlign:'center' }}>
            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold' }}>ISTA IBN MARHAL</p>
            <p style={{ margin: 0 }}>5 Rue Ibn Marhal, Place Mozart</p>
            <p style={{ margin: 0 }}>Tanger</p>
            <p style={{ margin: 0 }}>Tél. : 0539 940097</p>
          </div>

          {/* Centre Solidaire Digital */}
          <div style={{ flex: 1,textAlign:'center' }}>
            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold' }}>Centre Solidaire Digital</p>
            <p style={{ margin: 0 }}>Quartier Bni Ouryaghel</p>
            <p style={{ margin: 0 }}>Tanger</p>
          </div>

          {/* Centre National */}
          <div style={{ flex: 1,textAlign:'center' }}>
            <p style={{ margin: '0 0 2px 0', fontWeight: 'bold' }}>Centre National Mohamed VI des handicapés</p>
            <p style={{ margin: 0 }}>Souani Tanger</p>
          </div>

        </div>
      </div>
      </div>
    );
  }
);

const tdStyle = {
  border: '1px solid black',
  padding: '12px',
};

export default DecisionDocument;