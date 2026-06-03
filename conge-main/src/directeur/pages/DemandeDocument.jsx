import React from "react";
import axios from "axios";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";

const safeFormat = (date, pattern = "dd/MM/yyyy") => {
  const d = new Date(date);
  return isValid(d) ? format(d, pattern, { locale: fr }) : "";
};

const valueOrDots = (value, dots = "........................") =>
  value === null || value === undefined || value === "" ? dots : value;

const DemandeDocument = React.forwardRef(
  ({ request, employee, interimaire, LEAVE_TYPE_LABELS }, ref) => {
    const [fetchedInterimaire, setFetchedInterimaire] = React.useState(null);

    const leaveType =
      request?.subType ||
      LEAVE_TYPE_LABELS?.[request?.type] ||
      request?.type ||
      "Administratif";

    React.useEffect(() => {
      const interimaireId = request?.interimaire_id || request?.interimaireId;

      if (!interimaireId || interimaire) {
        setFetchedInterimaire(null);
        return;
      }

      const token = localStorage.getItem("token");

      axios
        .get(`http://127.0.0.1:8000/api/users/${interimaireId}`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            Accept: "application/json",
          },
        })
        .then((res) => {
          const user = res.data ?? {};

          setFetchedInterimaire({
            nomComplet:
              user.nomComplet ||
              user.nom_prenom ||
              [user.prenom, user.nom].filter(Boolean).join(" ") ||
              user.nom ||
              "",
          });
        })
        .catch(() => {
          setFetchedInterimaire(null);
        });
    }, [request?.interimaire_id, request?.interimaireId, interimaire]);

    const fullName = valueOrDots(employee?.nomComplet ?? request?.employeeName, "");
    const grade = valueOrDots(employee?.grade ?? employee?.categorie, "");
    const fonction = valueOrDots(employee?.poste ?? employee?.fonction, "");
    const echelle = valueOrDots(employee?.echelle, "");
    const matricule = valueOrDots(employee?.matricule, "");
    const direction = valueOrDots(employee?.affectation ?? employee?.direction, "TTA");
    const adresse = valueOrDots(employee?.adresse ?? employee?.ville, "");
    const duration = valueOrDots(request?.duration, "0");
    const startDate = safeFormat(request?.start_date);
    const endDate = safeFormat(request?.end_date);
    const requestDate = safeFormat(request?.created_at || new Date(), "dd MMMM yyyy");
    const interimaireSource = interimaire || fetchedInterimaire;
    const interimaireName = valueOrDots(
      interimaireSource?.nomComplet ||
        interimaireSource?.nom_prenom ||
        [interimaireSource?.prenom, interimaireSource?.nom].filter(Boolean).join(" ") ||
        request?.interimaireName ||
        request?.interimaire_name,
      ""
    );

    return (
      <div ref={ref} style={pageStyle}>
        <header style={headerStyle}>
          <div style={logoBoxStyle}>
            <img src="/images/logo.png" alt="OFPPT"
              style={{ margin: 0, width: '90px', height: '90px', objectFit: 'contain' }}
            />
          </div>
          <div style={headerDividerStyle} />
          <div style={officeStyle}>
            <div style={arabicOfficeStyle}>مكتب التكوين المهني و إنعاش الشغل</div>
            <div>Office de la Formation Professionnelle</div>
            <div>et de la Promotion du Travail</div>
          </div>
        </header>

        <div style={dateLineStyle}>طنجة في {requestDate}</div>

        <section style={titleBlockStyle}>
          <div style={arabicTitleStyle}>طلب إجــــازة (1)</div>
          <div style={frenchTitleStyle}>DEMANDE DE CONGE</div>
        </section>

        <section style={identityStyle}>
          <InfoRow frLabel="Nom et Prénom" value={fullName} arLabel="الإسم الكامل :" />
          <InfoRow frLabel="Grade" value={grade} arLabel="الدرجة :" />
          <InfoRow frLabel="Fonction" value={fonction} arLabel="الوظيفة :" />
          <div style={identityRowStyle}>
            <div style={identityLabelStyle}>Echelle : <strong>{echelle}</strong></div>
            <div style={identityValueStyle}>Mle : <strong>{matricule}</strong></div>
            <div style={identityArabicDotsStyle}>الرقم المالي : ..................</div>
            <div style={identityArabicStyle}> السلم: ..........</div>
          </div>
        </section>

        <section>
          <div style={sectionTitleStyle}>
            <div style={arabicSectionStyle}>التعيــين</div>
            <div style={frenchTitleStyle}>AFFECTATION</div>
          </div>
      <table boredr="1" >
        <tr>
          <td colSpan="2"
            style={{
              width: "50%",
              border: "1px solid #000",
              padding: "8px",
              verticalAlign: "top",
            }}
          >
            <div>Direction : <strong>{direction}</strong></div>
            <div>Division : .............................................</div>
            <div>Service : ..............................................</div>
            <div>Adresse : ..............................................</div>
          </td>

          <td colSpan="2"
            style={{
              width: "50%",
              border: "1px solid #000",
              padding: "8px",
              direction: "rtl",
              textAlign: "right",
              verticalAlign: "top",
            }}
          >
            <div>المديرية : .............................................</div>
            <div>القسم : ................................................</div>
            <div>المصلحة : ...............................................</div>
            <div>العنوان : ...............................................</div>
          </td>
        </tr>
        <tr>
            <td style={{
              width: "30%",
              border: "1px solid #000",
              padding: "8px",
              verticalAlign: "top",
            }}>
              Nature de congé (2) : {leaveType}
              <br />
              Du : <strong>{startDate}</strong>
            </td>
            <td style={{
              width: "20%",
              border: "1px solid #000",
              padding: "8px",
              verticalAlign: "top",
            }}>
              Durée : {duration} Js
               <br /><br/>
              Au : <strong>{endDate}</strong> 
            </td>
            <td style={{
              width: "20%",
              border: "1px solid #000",
              padding: "8px",
              direction: "rtl",
              textAlign: "right",
              verticalAlign: "top",
            }}>
              المدة : ................. <br />
              إلى : ................. <br />
            </td>
            <td style={{
              width: "30%",
              border: "1px solid #000",
              padding: "8px",
              direction: "rtl",
              textAlign: "right",
              verticalAlign: "top",
            }}>
              نوع الإجازة (2) : ................. <br/>
             ابتداء من : ..................... <br />
            </td>
        </tr>
      </table>
        </section>

        <div style={avecStyle}>
          Avec (3) : .......................................................................................................................  :(3) مع 
        </div>

        <section style={signatureGridStyle}>
          <SignatureBlock
            arTitle="النيابة (الإسم و الوظيفة)"
            frTitle="Interim ( Nom+Fonction )"
            name={interimaireName}
          />
          <SignatureBlock arTitle="إمضاء المعني(ة) بالأمر" frTitle="Signature de l'intéressé(e)" />
          <SignatureBlock arTitle="رأي الرئيس المباشر" frTitle="Avis du Chef Immédiat" />
        </section>

        <section style={importantStyle}>
          <div style={importantTitleRowStyle}>
            <span style={importantTitleStyle}>TRES IMPORTANT :</span>
            <span style={importantArabicTitleStyle}>هــــام جدا :</span>
          </div>
          <div style={importantBoxStyle}>
            <div dir="rtl">
              - لا يسمح لأي مستخدم بمغادرة العمل إلا بعد توصله بمقرر الإجازة وإلا اعتبر في وضعية تخلي عن العمل.
            </div>
            <div>
              - Aucun agent n'est autorisé à quitter le lieu de son travail avant d'avoir obtenu sa décision
              de congé. Le cas échéant, il sera considéré en abandon de poste.
            </div>
          </div>
        </section>

        <footer style={footerStyle}>
          <div style={footerColStyle}>
            <div>(1) La demande doit être envoyée 8 jours avant la date demandée</div>
            <div><strong>(2) Nature de Congé :</strong></div>
            <div>Administratif - Mariage - Naissance - Exceptionnel</div>
            <div>
              (3) Si l'intéressé projette de quitter le territoire marocain il faut qu'il le mentionne.
            </div>
          </div>
          <div style={{ ...footerColStyle, textAlign: "right", direction: "rtl" }}>
            <div>(1) يجب إرسال الطلب 8 أيام قبل التاريخ المطلوب</div>
            <div><strong>(2) نوع الإجازة :</strong></div>
            <div>إدارية - زواج - ازدياد - استثنائية</div>
            <div>
              (3) إذا كان المعني بالأمر يرغب في مغادرة التراب الوطني فعليه أن يحدد ذلك بإضافة عبارة
              "مغادرة التراب الوطني".
            </div>
          </div>
        </footer>
      </div>
    );
  }
);

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #000",
};

const cellStyle = {
  border: "1px solid #000",
  padding: "6px",
};

const InfoRow = ({ frLabel, value, arLabel }) => (
  <div style={identityRowStyle}>
    <div style={identityLabelStyle}>{frLabel}</div>
    <div style={identityValueStyle}><strong>{value}</strong></div>
    <div style={identityArabicDotsStyle} />
    <div style={identityArabicStyle}>{arLabel}</div>
  </div>
);

const SignatureBlock = ({ arTitle, frTitle, name }) => (
  <div style={signatureBlockStyle}>
    <div dir="rtl">{arTitle}</div>
    <div>{frTitle}</div>
    <div style={signatureSpaceStyle}>{name}</div>
  </div>
);

const pageStyle = {
  width: "794px",
  height: "1123px",
  background: "#fff",
  color: "#111",
  padding: "26px 78px 28px",
  fontFamily: "'Times New Roman', Times, Tahoma, serif",
  fontSize: "16px",
  lineHeight: 1.12,
  boxSizing: "border-box",
  overflow: "hidden",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "72px",
};

const logoBoxStyle = {
  width: "96px",
  textAlign: "center",
};

const logoMarkStyle = {
  fontSize: "25px",
  lineHeight: 0.8,
  letterSpacing: "-8px",
  transform: "rotate(45deg)",
  marginBottom: "5px",
};

const logoTextStyle = {
  fontFamily: "Arial, sans-serif",
  fontSize: "23px",
  fontWeight: 700,
  letterSpacing: "-1px",
};

const logoSubStyle = {
  fontSize: "7px",
  fontStyle: "italic",
};

const headerDividerStyle = {
  height: "64px",
  borderLeft: "2px solid #222",
  margin: "0 20px",
};

const officeStyle = {
  fontFamily: "Arial, Tahoma, sans-serif",
  fontSize: "14px",
  lineHeight: 1.18,
  fontWeight: 500,
};

const arabicOfficeStyle = {
  direction: "rtl",
  fontSize: "15px",
  marginBottom: "5px",
};

const dateLineStyle = {
  textAlign: "right",
  fontSize: "16px",
  marginBottom: "10px",
  direction: "rtl",
  fontWeight: 700,
};

const titleBlockStyle = {
  textAlign: "center",
  marginBottom: "20px",
  fontWeight: 700,
};

const arabicTitleStyle = {
  display: "inline-block",
  borderBottom: "1px solid #111",
  fontSize: "18px",
  direction: "rtl",
  lineHeight: 1,
};

const frenchTitleStyle = {
  textDecoration: "underline",
  fontSize: "18px",
  marginTop: "0",
};

const identityStyle = {
  marginTop: "8px",
  marginBottom: "8px",
};

const identityRowStyle = {
  display: "grid",
  gridTemplateColumns: "146px 1fr 150px 82px",
  alignItems: "end",
  minHeight: "35px",
  columnGap: "10px",
};

const identityLabelStyle = {
  fontSize: "18px",
};

const identityValueStyle = {
  minHeight: "22px",
  padding: "0 8px 3px",
  fontSize: "18px",
};

const identityArabicStyle = {
  textAlign: "right",
  direction: "rtl",
  paddingBottom: "3px",
  fontSize: "16px",
  whiteSpace: "nowrap",
};

const identityArabicDotsStyle = {
  textAlign: "right",
  direction: "rtl",
  borderBottom: "1px dotted #111",
  paddingBottom: "3px",
  fontSize: "16px",
  whiteSpace: "nowrap",
};

const sectionTitleStyle = {
  textAlign: "center",
  fontWeight: 700,
  textDecoration: "underline",
  margin: "0 0 16px",
  fontSize: "18px",
  lineHeight: 1,
};

const arabicSectionStyle = {
  direction: "rtl",
};

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
//   tableLayout: "fixed",
//   fontSize: "16px",
//   lineHeight: 1.08,
// };

const leftCellStyle = {
  border: "1px solid #111",
  padding: "2px 8px",
  minHeight: "22px",
  verticalAlign: "middle",
  overflowWrap: "break-word",
};

const rightCellStyle = {
  ...leftCellStyle,
  textAlign: "right",
  direction: "rtl",
};

const arabicDotsCellStyle = {
  // ...leftCellStyle,
  // textAlign: "right",
  // direction: "rtl",
  // whiteSpace: "nowrap",
};

const arabicLabelCellStyle = {
  ...leftCellStyle,
  textAlign: "right",
  direction: "rtl",
  whiteSpace: "nowrap",
};

const splitCellStyle = {
  ...leftCellStyle,
  padding: 0,
  fontSize: 0,
};

const splitMainStyle = {
  display: "inline-block",
  width: "70%",
  minHeight: "24px",
  padding: "3px 8px",
  boxSizing: "border-box",
  verticalAlign: "middle",
  overflowWrap: "break-word",
  fontSize: "16px",
};

const splitSideStyle = {
  ...splitMainStyle,
  width: "30%",
  borderLeft: "1px solid #111",
  textAlign: "center",
};

const tableLineStyle = {
  margin: "0 0 2px",
};

const tableArabicLineStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  gap: "6px",
  margin: "0 0 2px",
};

const tableArabicDotsStyle = {
  overflow: "hidden",
  whiteSpace: "nowrap",
};

const avecStyle = {
  margin: "20px 0 18px",
  fontSize: "16px",
};

const dottedLineStyle = {
  display: "inline-block",
  width: "460px",
  borderBottom: "1px dotted #111",
  marginLeft: "8px",
  transform: "translateY(-3px)",
};

const signatureGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "22px",
  textAlign: "center",
  fontSize: "16px",
  minHeight: "96px",
};

const signatureBlockStyle = {
  minHeight: "96px",
};

const signatureSpaceStyle = {
  marginTop: "12px",
  fontWeight: 700,
};

const importantStyle = {
  marginTop: "6px",
};

const importantTitleRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const importantTitleStyle = {
  fontWeight: 800,
  fontSize: "25px",
  textDecoration: "underline",
};

const importantArabicTitleStyle = {
  direction: "rtl",
  fontWeight: 800,
  fontSize: "21px",
  textDecoration: "underline",
};

const importantBoxStyle = {
  background: "#ece8dc",
  padding: "5px 12px",
  fontSize: "16px",
  lineHeight: 1.1,
};

const footerStyle = {
  marginTop: "50px",
  borderTop: "1px solid #444",
  paddingTop: "8px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
  fontSize: "15px",
  lineHeight: 1.12,
};

const footerColStyle = {
  minWidth: 0,
};

export default DemandeDocument;
