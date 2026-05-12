import React from "react";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";

const safeFormat = (date, pattern) => {
  const d = new Date(date);
  return isValid(d) ? format(d, pattern, { locale: fr }) : "—";
};

const DemandeDocument = React.forwardRef(
  ({ request, employee, LEAVE_TYPE_LABELS }, ref) => {
    const today = safeFormat(new Date(), "dd/MM/yyyy");
    const requestDate = safeFormat(request.created_at, "dd/MM/yyyy");
    const startFmt = safeFormat(request.start_date, "dd/MM/yyyy");
    const endFmt = safeFormat(request.end_date, "dd/MM/yyyy");

    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          minHeight: "1123px",
          background: "#fff",
          padding: "40px",
          color: "#000",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "2px solid #000",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                border: "2px solid #333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              OFPPT
              <br />
              LOGO
            </div>

            <div>
              <h1 style={{ fontSize: "13px", marginBottom: "3px" }}>
                مكتب التكوين المهني وإنعاش الشغل
              </h1>
              <p style={{ fontSize: "10px" }}>
                Office de la Formation Professionnelle
              </p>
              <p style={{ fontSize: "10px" }}>
                et de la Promotion du Travail
              </p>
            </div>
          </div>

          <div style={{ fontSize: "11px", textAlign: "right" }}>
            طنجة في {requestDate}
          </div>
        </div>

        {/* TITLE */}
        <div style={{ textAlign: "center", margin: "25px 0 20px" }}>
          <div style={{ fontSize: "16px", fontWeight: "bold", textDecoration: "underline" }}>
            DEMANDE DE CONGE
          </div>
          <div style={{ fontSize: "13px" }}>طلــــــــب إجـــــــازة</div>
        </div>

        {/* TABLE */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
          <tbody>
            <tr>
              <td style={td}>Nom et Prénom</td>
              <td style={td}>{employee?.nomComplet ?? request.employeeName}</td>
              <td style={td}>الإسم الكامل</td>
              <td style={td}>..................</td>
            </tr>

            <tr>
              <td style={td}>Grade</td>
              <td style={td}>{employee?.poste ?? "Cadre"}</td>
              <td style={td}>الدرجة</td>
              <td style={td}>..................</td>
            </tr>

            <tr>
              <td style={td}>Fonction</td>
              <td style={td}>{employee?.poste ?? "—"}</td>
              <td style={td}>الوظيفة</td>
              <td style={td}>..................</td>
            </tr>

            <tr>
              <td style={td}>Mle</td>
              <td style={td}>{employee?.matricule ?? "—"}</td>
              <td style={td}>السلم</td>
              <td style={td}>..................</td>
            </tr>
          </tbody>
        </table>

        {/* AFFECTATION */}
        <div style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}>
          AFFECTATION / التعيين
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
          <tbody>
            <tr>
              <td style={td}>Direction</td>
              <td style={td}>{employee?.departement ?? "TTA"}</td>
              <td style={td}>المديرية</td>
              <td style={td}>..................</td>
            </tr>

            <tr>
              <td style={td}>Division</td>
              <td style={td}>—</td>
              <td style={td}>القسم</td>
              <td style={td}>..................</td>
            </tr>

            <tr>
              <td style={td}>Service</td>
              <td style={td}>—</td>
              <td style={td}>المصلحة</td>
              <td style={td}>..................</td>
            </tr>

            <tr>
              <td style={td}>Nature</td>
              <td style={td}>
                <b>{LEAVE_TYPE_LABELS?.[request.type] ?? request.type}</b>
              </td>
              <td style={td}>نوع الإجازة</td>
              <td style={td}>..................</td>
            </tr>

            <tr>
              <td style={td}>Du</td>
              <td style={td}>{startFmt}</td>
              <td style={td}>إبتداء من</td>
              <td style={td}>..................</td>
            </tr>

            <tr>
              <td style={td}>Au</td>
              <td style={td}>{endFmt}</td>
              <td style={td}>إلى</td>
              <td style={td}>..................</td>
            </tr>

            <tr>
              <td style={td}>Durée</td>
              <td style={td}>
                <b>{request.duration} أيام</b>
              </td>
              <td style={td}>المدة</td>
              <td style={td}>..................</td>
            </tr>
          </tbody>
        </table>

        {/* SIGNATURES */}
        <div style={{ marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center", width: "30%" }}>
            <div>Intérim</div>
            <div style={line} />
          </div>

          <div style={{ textAlign: "center", width: "30%" }}>
            <div>Signature</div>
            <div style={line} />
          </div>

          <div style={{ textAlign: "center", width: "30%" }}>
            <div>Chef</div>
            <div style={line} />
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div style={{ marginTop: "40px", fontSize: "8px", textAlign: "center" }}>
          Document généré le {today}
        </div>
      </div>
    );
  }
);

const td = {
  border: "1px solid #000",
  padding: "6px",
};

const line = {
  borderTop: "1px solid #000",
  marginTop: "40px",
};

export default DemandeDocument;