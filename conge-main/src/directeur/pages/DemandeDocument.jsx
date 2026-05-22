import React from "react";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";

const safeFormat = (date, pattern = "dd/MM/yyyy") => {
  const d = new Date(date);
  return isValid(d) ? format(d, pattern, { locale: fr }) : "—";
};

const DemandeDocument = React.forwardRef(
  ({ request, employee, LEAVE_TYPE_LABELS }, ref) => {
    const requestDate = safeFormat(request?.created_at);
    const startFmt = safeFormat(request?.start_date);
    const endFmt = safeFormat(request?.end_date);

    return (
     <div>
      {/* ================= INFOS ================= */}

<div style={rowStyle}>
  <div style={labelStyle}>Nom et Prénom</div>

  <div style={valueStyle}>
    {employee?.nomComplet ?? "EL HANSER YOUNES"}
  </div>

  <div style={arabicLabel}>الاسم الكامل</div>
</div>

<div style={rowStyle}>
  <div style={labelStyle}>Grade</div>

  <div style={valueStyle}>
    {employee?.grade ?? "MP"}
  </div>

  <div style={arabicLabel}>الدرجة</div>
</div>

<div style={rowStyle}>
  <div style={labelStyle}>Fonction</div>

  <div style={valueStyle}>
    {employee?.fonction ?? "GS"}
  </div>

  <div style={arabicLabel}>الوظيفة</div>
</div>

<div style={rowStyle}>
  <div style={labelStyle}>Echelle : 13</div>

  <div style={valueStyle}>
    Mle : {employee?.matricule ?? "16284"}
  </div>

  <div style={arabicLabel}>الرقم المالي</div>
</div>

{/* ================= AFFECTATION ================= */}

<div
  style={{
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "10px",
    fontWeight: "bold",
    textDecoration: "underline",
    fontSize: "15px",
  }}
>
  AFFECTATION
</div>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  }}
>
  <tbody>
    <tr>
      <td style={td}>Direction</td>

      <td style={td}>
        {employee?.direction ?? "TTA"}
      </td>

      <td style={tdArabic}>المديرية</td>
    </tr>

    <tr>
      <td style={td}>Division</td>

      <td style={td}>
        {employee?.division ?? "................"}
      </td>

      <td style={tdArabic}>القسم</td>
    </tr>

    <tr>
      <td style={td}>Service</td>

      <td style={td}>
        {employee?.service ?? "................"}
      </td>

      <td style={tdArabic}>المصلحة</td>
    </tr>

    <tr>
      <td style={td}>Adresse</td>

      <td style={td}>
        {employee?.adresse ?? "................"}
      </td>

      <td style={tdArabic}>العنوان</td>
    </tr>

    <tr>
      <td style={td}>
        Nature de congé (2)
      </td>

      <td style={td}>
        {LEAVE_TYPE_LABELS?.[request?.type] ??
          request?.type ??
          "Administratif"}
      </td>

      <td style={tdArabic}>نوع الإجازة (2)</td>
    </tr>

    <tr>
      <td style={td}>
        Du : {safeFormat(request?.start_date)}
      </td>

      <td style={td}>
        Durée {request?.duration ?? 7} Js
      </td>

      <td style={tdArabic}>المدة</td>
    </tr>

    <tr>
      <td style={td}>
        Au : {safeFormat(request?.end_date)}
      </td>

      <td style={td}>................</td>

      <td style={tdArabic}>إلى</td>
    </tr>
  </tbody>
</table>

{/* ================= AVEC ================= */}

<div
  style={{
    marginTop: "25px",
    fontSize: "14px",
  }}
>
  Avec (3) :
  <span
    style={{
      display: "inline-block",
      width: "80%",
      borderBottom: "1px dotted #000",
      marginLeft: "10px",
    }}
  />
</div>

{/* ================= SIGNATURES ================= */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginTop: "55px",
    textAlign: "center",
    fontSize: "13px",
  }}
>
  <div style={{ width: "30%" }}>
    <div>(الاسم و الوظيفة)</div>

    <div>Interim ( Nom+Fonction )</div>

    <div
      style={{
        marginTop: "40px",
        fontWeight: "bold",
      }}
    >
      {employee?.interimName ?? "TARFOUSS ABDELAH"}
    </div>

    <div>
      {employee?.interimFonction ??
        "Gestionnaire des stagiaires"}
    </div>
  </div>

  <div style={{ width: "30%" }}>
    <div>إمضاء المعني(ة) بالأمر</div>

    <div>Signature de l'intéressé(e)</div>

    <div style={signatureLine}></div>
  </div>

  <div style={{ width: "30%" }}>
    <div>رأي الرئيس المباشر</div>

    <div>Avis du Chef Immédiat</div>

    <div style={signatureLine}></div>
  </div>
</div>

{/* ================= IMPORTANT ================= */}

<div style={{ marginTop: "50px" }}>
  <div
    style={{
      fontWeight: "bold",
      fontSize: "18px",
      marginBottom: "10px",
    }}
  >
    TRES IMPORTANT :
  </div>

  <div
    style={{
      fontSize: "12px",
      lineHeight: 1.8,
    }}
  >
    <div dir="rtl">
      - لا يسمح لأي مستخدم بمغادرة العمل إلا بعد توصله
      بمقرر الإجازة وإلا اعتبر في وضعية تخلي عن العمل
    </div>

    <div>
      - Aucun agent n’est autorisé à quitter le lieu
      de son travail avant d’avoir obtenu sa décision
      de congé. Le cas échéant, il sera considéré en
      abandon de poste.
    </div>
  </div>
</div>

{/* ================= FOOTER ================= */}

<div
  style={{
    marginTop: "40px",
    fontSize: "11px",
    lineHeight: 1.8,
  }}
>
  <div>
    (1) La demande doit être envoyée 8 jours avant
    la date demandée
  </div>

  <div>
    (2) Nature de Congé :
    Administratif - Mariage - Naissance -
    Exceptionnel
  </div>

  <div>
    (3) Si l’intéressé projette de quitter le
    territoire marocain il faut qu’il le mentionne
  </div>

  <div dir="rtl">
    (1) يجب إرسال الطلب 8 أيام قبل التاريخ المطلوب
  </div>

  <div dir="rtl">
    (2) نوع الإجازة : إدارية - زواج - ازدياد -
    استثنائية
  </div>

  <div dir="rtl">
    (3) إذا كان المعني بالأمر يرغب في مغادرة التراب
    الوطني فعليه أن يحدد ذلك بإضافة عبارة "مغادرة
    التراب الوطني"
  </div>
  </div>
     </div>
    );
  }
);

const rowStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "12px",
};

const labelStyle = {
  width: "180px",
  fontWeight: "bold",
};

const valueStyle = {
  flex: 1,
  borderBottom: "1px dotted #000",
  paddingBottom: "2px",
};

const arabicLabel = {
  width: "150px",
  textAlign: "right",
  fontWeight: "bold",
  marginLeft: "20px",
};

const td = {
  border: "1px solid #000",
  padding: "7px",
};

const tdArabic = {
  border: "1px solid #000",
  padding: "7px",
  textAlign: "right",
  direction: "rtl",
  fontWeight: "bold",
};

const signatureLine = {
  borderTop: "1px solid #000",
  marginTop: "60px",
};

export default DemandeDocument;