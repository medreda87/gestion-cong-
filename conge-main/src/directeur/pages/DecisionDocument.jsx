import React from 'react';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

const safeFormat = (date, pattern) => {
  const d = new Date(date);
  return isValid(d) ? format(d, pattern, { locale: fr }) : '—';
};

const DecisionDocument = React.forwardRef(
  ({ request, employee, LEAVE_TYPE_LABELS }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: '794px',
          minHeight: '1123px',
          background: '#fff',
          padding: '40px',
          color: '#000',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* HEADER */}
        <div
        >
          <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 0'
                }}>
                  
                  {/* Logo */}
            <img src="/images/logo.png" 
                alt="OFPPT"
                style={{ margin: 0,width: '90px', height: '90px', objectFit: 'contain' }}
              />

              {/* Vertical line */}
              <div style={{
                width: '2px',
                height: '60px',
                backgroundColor: '#00000030'
              }} />

              {/* Text */}
              <div>
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
              مكتب التكوين المهني وإنعاش الشغل
            </p>

            <p style={{ margin: '4px 0', fontSize: '12px' }}>
              Office de la Formation Professionnelle
            </p>

            <p style={{ margin: 0, fontSize: '12px' }}>
              et de la Promotion du Travail
            </p>
          </div>

          </div>

          <div style={{ display:'flex',justifyContent:'space-between', fontSize: '14px',marginTop:'40px',marginBottom:'40px' }}>
            <p>
              <strong>N/Réf :</strong> OFP/DRTTA/CFPT1/DC/N°
              {request.id}/25
            </p>

            <p>
              Tanger, le{' '}
              {safeFormat(new Date(), 'dd/MM/yyyy')}
            </p>
          </div>
        </div>

        {/* TITLE */}
        <h2
          style={{
            textAlign: 'center',
            textDecoration: 'underline',
            marginBottom: '40px',
            fontSize: '24px',
            fontWeight:'bold'
          }}
        >
          DECISION DE CONGE ADMINISTRATIF
        </h2>

        {/* TEXT */}
        <div style={{ fontSize: '15px', lineHeight: '1.9' }}>
          <ul>
          <li className="list-item">
             Le Directeur de l’Office de la Formation
            Professionnelle et de la Promotion du Travail ;
          </li>

          <li className="list-item">
             Vu le Dahir portant lot N⁰1-72-183 Rabia II 1394 (21 Mai 1974) instituant l’Office de la Formation
            Professionnelle et de la Promotion du Travail ;
          </li>

          <li className="list-item">
             Vu la Décision de Madame le Directeur Général N⁰53 en date du portant Délégation signature à Monsieur ELMECHRAFI Abdlhamid Directeur de Complexe Tanger;
          </li>

          <li className="list-item">
             Vu la demande de congé administratif présenté(e) 
            par {' '}
            <strong>
              {employee?.nomComplet ??
                request.employeeName}
            </strong>
          </li>
          </ul>
        </div>

        {/* DECIDE */}
        <h3
          style={{
            textAlign: 'center',
            marginTop: '40px',
            marginBottom: '30px',
            fontSize: '22px',
            textDecoration: 'underline',
            fontWeight:'bold'
          }}
        >
          DECIDE
        </h3>

        <p
          style={{
            fontStyle: 'italic',
            marginBottom: '20px',
          }}
        >
          ARTICLE UNIQUE :
        </p>

        <p style={{ marginBottom: '30px' }}>
          Il est accordé un congé :
          <strong>
            {' '}
            {LEAVE_TYPE_LABELS[request.type] ??
              request.type}
          </strong>
        </p>

        {/* TABLE */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '20px',
            fontSize: '14px',
          }}
        >
          <tbody>
            <tr>
              <td style={tdStyle}>
                <strong>Nom & Prénom</strong>
              </td>

              <td style={tdStyle}>
                <strong>Affectation</strong>
              </td>
            </tr>
            <tr>
              <td style={tdStyle}>
                {employee?.nomComplet ??
                  request.employeeName}
              </td>
              <td style={tdStyle}>
                  {employee?.departement ?? '—'}
              </td>
            </tr>
            <tr>
              <td style={tdStyle}>
                <ul >
                  <li>
                    <strong>Catégori :</strong>{' '}
                      {employee?.poste ?? '—'}
                    </li>
                  <li>
                    <strong>Fonction :</strong>{' '}
                    {employee?.poste ?? '—'}
                  </li>
                  <li>
                    <strong>Matricule :</strong>{' '}
                    {employee?.matricule ?? '—'}
                  </li>
                </ul>
              </td>

              <td style={tdStyle}>
                <ul>
                  <li>
                    <strong>Durée accordée :</strong>{' '}
                    {request.duration} jours
                  </li>
                  <li>
                    <strong>Date début :</strong>{' '}
                    {safeFormat(
                      request.start_date,
                      'dd/MM/yyyy'
                    )}
                  </li>
                  <li>
                    <strong>Date fin :</strong>{' '}
                    {safeFormat(
                      request.end_date,
                      'dd/MM/yyyy'
                    )}
                  </li>
                  <li>
                    <strong>Reliquant :</strong>{' '}
                    {request.solde_restant}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        {/* FOOTER */}
        <div
          style={{
            marginTop: '10px',
            textAlign: 'right',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          Directeur CFPT 1
        </div>
        <div style={{marginTop:'50px'}}>
          <ul>
            <li style={{fontStyle: 'italic',}}>
              &#10148; L'intérim sera assuré par :
            </li>
            <li style={{fontStyle: 'italic',}}>
              &#10148; L'intéressé(e) est autorisé(e) à quitter le territoire marocain
            </li>
          </ul>
        </div>
      </div>
    );
  }
);

const tdStyle = {
  border: '1px solid black',
  padding:'20px'
};

export default DecisionDocument;