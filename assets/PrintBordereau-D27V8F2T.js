import{s as p,j as e}from"./index-zDZ3Lj_p.js";import{u as P,r as l}from"./react-vendor-CTUriZ5h.js";import{Q as R}from"./qr-display-BZBHW9NW.js";import{M as S}from"./MerchantLayout-B4VsQmsY.js";import{P as f}from"./printer-B3I1m1op.js";import{A as I}from"./alert-circle-_Iqic_ih.js";import{F as C}from"./file-text-B3Ewreww.js";import{C as Q}from"./check-circle-CyNeZd0p.js";import{C as U}from"./clock-Dhxn45-3.js";import{P as G}from"./package-ChDCFdB3.js";import{S as M}from"./search-CPbK6Y1N.js";import{F as T}from"./filter-Cp7rfch8.js";import{E as O}from"./eye-B0fj8J_e.js";import{X as V}from"./x-D4qrk5Qy.js";import"./supabase-Bl4YWSQ9.js";import"./menu-DP2azNEK.js";import"./createLucideIcon-CMjKDoEE.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";const W=()=>{const u=Date.now().toString(36).toUpperCase(),b=Math.random().toString(36).substring(2,6).toUpperCase();return`BDX-${u}-${b}`};function ge(){const u=P(),[b,_]=l.useState(!0),[j,v]=l.useState(!1),[c,z]=l.useState(10),[d,$]=l.useState([]),[t,D]=l.useState(null),[H,A]=l.useState(""),[h,q]=l.useState("all"),[N,B]=l.useState(""),[y,n]=l.useState(""),[r,g]=l.useState(null);l.useEffect(()=>{E()},[]);const E=async()=>{try{const{data:{session:s}}=await p.auth.getSession();if(!s){u("/merchant/login");return}const{data:a}=await p.from("merchants").select("*").eq("email",s.user.email).maybeSingle();a&&(D(a),A(a.id),await w(a.id))}catch(s){console.error("Error fetching data:",s),n("Erreur lors du chargement")}finally{_(!1)}},w=async s=>{const{data:a}=await p.from("merchant_bordereaux").select("*").eq("merchant_id",s).order("created_at",{ascending:!1});$(a||[])},F=async()=>{if(!(t!=null&&t.id)){n("Erreur: Marchand non trouve. Veuillez vous reconnecter.");return}if(c<1||c>100){n("La quantite doit etre entre 1 et 100");return}v(!0),n("");try{const s=[];for(let i=0;i<c;i++)s.push({merchant_id:t.id,bordereau_code:W(),status:"available",printed_at:new Date().toISOString()});const{data:a,error:o}=await p.from("merchant_bordereaux").insert(s).select();if(o)throw o;await w(t.id),a&&k(a)}catch(s){console.error("Error generating bordereaux:",s),n(`Erreur: ${(s==null?void 0:s.message)||(s==null?void 0:s.details)||JSON.stringify(s)}`)}finally{v(!1)}},k=s=>{const a=window.open("","","height=900,width=800");if(!a)return;const o=s.map(i=>{const L=`https://fawzyoth.github.io/Swapp-app/#/client/exchange/new?bordereau=${i.bordereau_code}`;return`
        <div class="bordereau">
          <div class="header">
            ${t!=null&&t.logo_base64?`<img src="${t.logo_base64}" alt="Logo" class="logo" />`:'<div class="logo-placeholder">LOGO</div>'}
            <div class="title-section">
              <h1>SWAPP - Bordereau d'Echange</h1>
              <p class="business-name">${(t==null?void 0:t.business_name)||(t==null?void 0:t.name)||"E-Commercant"}</p>
            </div>
          </div>

          <div class="codes-section">
            <div class="qr-box">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(L)}" alt="QR Code" />
              <p class="readable-code">${i.bordereau_code}</p>
              <p class="code-label">Scanner pour initier l'echange</p>
            </div>

            <div class="barcode-box">
              <img src="https://barcodeapi.org/api/128/${i.bordereau_code}" alt="Barcode" class="barcode-img" />
              <p class="barcode-text">${i.bordereau_code}</p>
              <p class="code-label">Code Livreur</p>
            </div>
          </div>

          <div class="contact-section">
            <p><strong>Contact:</strong> ${(t==null?void 0:t.phone)||""}</p>
            <p><strong>Adresse:</strong> ${(t==null?void 0:t.business_address)||""} ${(t==null?void 0:t.business_city)||""} ${(t==null?void 0:t.business_postal_code)||""}</p>
          </div>

          <div class="instructions-fr">
            <h3>Instructions</h3>
            <ol>
              <li>Scannez le QR code pour demarrer l'echange</li>
              <li>Suivez les etapes sur votre telephone</li>
              <li>Preparez le produit a retourner</li>
              <li>Le livreur scannera le code-barres lors de la collecte</li>
            </ol>
          </div>

          <div class="instructions-ar">
            <h3>التعليمات</h3>
            <ol>
              <li>امسح رمز QR لبدء عملية التبديل</li>
              <li>اتبع الخطوات على هاتفك</li>
              <li>جهّز المنتج للإرجاع</li>
              <li>سيقوم المندوب بمسح الباركود عند الاستلام</li>
            </ol>
          </div>

          <div class="footer">
            <p>SWAPP - Plateforme d'echange de produits | ${i.bordereau_code}</p>
          </div>
        </div>
      `}).join('<div class="page-break"></div>');a.document.write(`
      <html>
      <head>
        <title>Bordereaux - ${s.length} exemplaires</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; }

          .bordereau {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 2px solid #0369a1;
            border-radius: 10px;
          }

          .header {
            display: flex;
            align-items: center;
            gap: 20px;
            border-bottom: 2px solid #0369a1;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }

          .logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }

          .logo-placeholder {
            width: 80px;
            height: 80px;
            background: #f0f9ff;
            border: 2px dashed #0369a1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #0369a1;
            border-radius: 8px;
          }

          .title-section h1 {
            font-size: 18px;
            color: #0369a1;
          }

          .business-name {
            font-size: 14px;
            color: #64748b;
            margin-top: 5px;
          }

          .codes-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .qr-box, .barcode-box {
            text-align: center;
            padding: 15px;
            border-radius: 10px;
          }

          .qr-box {
            background: #dbeafe;
            border: 2px solid #3b82f6;
          }

          .qr-box img {
            width: 150px;
            height: 150px;
          }

          .readable-code {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
            margin-top: 8px;
            color: #1d4ed8;
            background: white;
            padding: 4px 8px;
            border-radius: 4px;
          }

          .barcode-box {
            background: #fef3c7;
            border: 2px solid #f59e0b;
          }

          .barcode-img {
            width: 180px;
            height: 70px;
            object-fit: contain;
            background: white;
            padding: 8px;
            border-radius: 6px;
          }

          .barcode-text {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 10px;
          }

          .code-label {
            font-size: 11px;
            color: #64748b;
            margin-top: 8px;
          }

          .contact-section {
            background: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-size: 12px;
          }

          .contact-section p {
            margin: 4px 0;
          }

          .instructions-fr {
            background: #ecfdf5;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px;
          }

          .instructions-fr h3 {
            font-size: 12px;
            color: #047857;
            margin-bottom: 8px;
          }

          .instructions-fr ol {
            margin-left: 18px;
            font-size: 11px;
            color: #065f46;
          }

          .instructions-fr ol li {
            margin: 4px 0;
          }

          .instructions-ar {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 15px;
            direction: rtl;
            text-align: right;
          }

          .instructions-ar h3 {
            font-size: 14px;
            color: #b45309;
            margin-bottom: 8px;
          }

          .instructions-ar ol {
            margin-right: 18px;
            font-size: 12px;
            color: #92400e;
          }

          .instructions-ar ol li {
            margin: 6px 0;
          }

          .footer {
            text-align: center;
            font-size: 10px;
            color: #64748b;
            padding-top: 10px;
            border-top: 1px dashed #cbd5e1;
          }

          .page-break {
            page-break-after: always;
          }

          @media print {
            body { padding: 0; }
            .bordereau { border: 1px solid #ccc; margin: 10px auto; }
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        ${o}
      </body>
      </html>
    `),a.document.close(),setTimeout(()=>{a.print()},500)},x=d.filter(s=>{const a=h==="all"||s.status===h,o=s.bordereau_code.toLowerCase().includes(N.toLowerCase());return a&&o}),m={total:d.length,available:d.filter(s=>s.status==="available").length,assigned:d.filter(s=>s.status==="assigned").length,used:d.filter(s=>s.status==="used").length};return b?e.jsx(S,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})}):e.jsx(S,{children:e.jsxs("div",{className:"max-w-6xl mx-auto",children:[e.jsxs("div",{className:"mb-8",children:[e.jsxs("h1",{className:"text-3xl font-bold text-slate-900 flex items-center gap-3",children:[e.jsx(f,{className:"w-8 h-8 text-sky-600"}),"Imprimer des Bordereaux"]}),e.jsx("p",{className:"text-slate-600 mt-2",children:"Generez et imprimez des bordereaux pre-configures avec QR code et code-barres uniques"})]}),y&&e.jsxs("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3",children:[e.jsx(I,{className:"w-5 h-5 text-red-600"}),e.jsx("span",{className:"text-red-800",children:y})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 mb-8",children:[e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-slate-100 rounded-lg",children:e.jsx(C,{className:"w-5 h-5 text-slate-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:m.total}),e.jsx("p",{className:"text-sm text-slate-600",children:"Total"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-lg",children:e.jsx(Q,{className:"w-5 h-5 text-emerald-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-emerald-600",children:m.available}),e.jsx("p",{className:"text-sm text-slate-600",children:"Disponibles"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-amber-100 rounded-lg",children:e.jsx(U,{className:"w-5 h-5 text-amber-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-amber-600",children:m.assigned}),e.jsx("p",{className:"text-sm text-slate-600",children:"Assignes"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-sky-100 rounded-lg",children:e.jsx(G,{className:"w-5 h-5 text-sky-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-sky-600",children:m.used}),e.jsx("p",{className:"text-sm text-slate-600",children:"Utilises"})]})]})})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8",children:[e.jsx("h2",{className:"text-lg font-semibold text-slate-900 mb-4",children:"Generer de nouveaux bordereaux"}),e.jsxs("div",{className:"flex flex-wrap items-end gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Quantite"}),e.jsx("input",{type:"number",min:"1",max:"100",value:c,onChange:s=>z(parseInt(s.target.value)||1),className:"w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"})]}),e.jsx("button",{onClick:F,disabled:j,className:"flex items-center gap-2 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",children:j?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),"Generation..."]}):e.jsxs(e.Fragment,{children:[e.jsx(f,{className:"w-5 h-5"}),"Generer et Imprimer"]})})]}),e.jsx("p",{className:"text-sm text-slate-500 mt-3",children:"Chaque bordereau aura un QR code et un code-barres uniques lies ensemble"})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4 mb-6",children:[e.jsx("h2",{className:"text-lg font-semibold text-slate-900",children:"Historique des bordereaux"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsxs("div",{className:"relative",children:[e.jsx(M,{className:"w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"}),e.jsx("input",{type:"text",placeholder:"Rechercher...",value:N,onChange:s=>B(s.target.value),className:"pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(T,{className:"w-4 h-4 text-slate-400"}),e.jsxs("select",{value:h,onChange:s=>q(s.target.value),className:"px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",children:[e.jsx("option",{value:"all",children:"Tous"}),e.jsx("option",{value:"available",children:"Disponibles"}),e.jsx("option",{value:"assigned",children:"Assignes"}),e.jsx("option",{value:"used",children:"Utilises"})]})]})]})]}),x.length===0?e.jsxs("div",{className:"text-center py-12",children:[e.jsx(C,{className:"w-16 h-16 text-slate-300 mx-auto mb-4"}),e.jsx("p",{className:"text-slate-600",children:"Aucun bordereau trouve"}),e.jsx("p",{className:"text-sm text-slate-500 mt-1",children:"Generez vos premiers bordereaux pour commencer"})]}):e.jsxs("div",{className:"overflow-x-auto",children:[e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-slate-200",children:[e.jsx("th",{className:"text-left py-3 px-4 font-semibold text-slate-700",children:"Code"}),e.jsx("th",{className:"text-left py-3 px-4 font-semibold text-slate-700",children:"Statut"}),e.jsx("th",{className:"text-left py-3 px-4 font-semibold text-slate-700",children:"Date creation"}),e.jsx("th",{className:"text-center py-3 px-4 font-semibold text-slate-700",children:"Actions"})]})}),e.jsx("tbody",{children:x.slice(0,50).map(s=>e.jsxs("tr",{className:"border-b border-slate-100 hover:bg-slate-50",children:[e.jsx("td",{className:"py-3 px-4",children:e.jsx("code",{className:"font-mono text-sm bg-slate-100 px-2 py-1 rounded",children:s.bordereau_code})}),e.jsx("td",{className:"py-3 px-4",children:e.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-medium ${s.status==="available"?"bg-emerald-100 text-emerald-700":s.status==="assigned"?"bg-amber-100 text-amber-700":"bg-sky-100 text-sky-700"}`,children:s.status==="available"?"Disponible":s.status==="assigned"?"Assigne":"Utilise"})}),e.jsx("td",{className:"py-3 px-4 text-sm text-slate-600",children:new Date(s.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}),e.jsx("td",{className:"py-3 px-4 text-center",children:e.jsx("button",{onClick:()=>g(s),className:"p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors",title:"Voir les details",children:e.jsx(O,{className:"w-5 h-5"})})})]},s.id))})]}),x.length>50&&e.jsxs("p",{className:"text-center text-sm text-slate-500 py-4",children:["Affichage des 50 premiers sur ",x.length]})]})]}),r&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto",children:[e.jsxs("div",{className:"flex items-center justify-between p-4 border-b border-slate-200",children:[e.jsx("h3",{className:"text-lg font-semibold text-slate-900",children:"Détails du Bordereau"}),e.jsx("button",{onClick:()=>g(null),className:"p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors",children:e.jsx(V,{className:"w-5 h-5"})})]}),e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("p",{className:"text-sm text-slate-600 mb-2",children:"Code du bordereau"}),e.jsx("code",{className:"text-2xl font-mono font-bold bg-slate-100 px-4 py-2 rounded-lg",children:r.bordereau_code})]}),e.jsx("div",{className:"flex justify-center mb-6",children:e.jsxs("div",{className:"bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center",children:[e.jsx(R,{value:`https://fawzyoth.github.io/Swapp-app/#/client/exchange/new?bordereau=${r.bordereau_code}`,size:180,level:"M"}),e.jsx("p",{className:"text-sm text-blue-700 mt-3 font-medium",children:"Scanner pour initier l'échange"}),e.jsx("p",{className:"text-xs text-slate-500 mt-1 break-all",children:r.bordereau_code})]})}),e.jsxs("div",{className:"flex items-center justify-center gap-2 mb-6",children:[e.jsx("span",{className:"text-sm text-slate-600",children:"Statut:"}),e.jsx("span",{className:`px-3 py-1 rounded-full text-sm font-medium ${r.status==="available"?"bg-emerald-100 text-emerald-700":r.status==="assigned"?"bg-amber-100 text-amber-700":"bg-sky-100 text-sky-700"}`,children:r.status==="available"?"Disponible":r.status==="assigned"?"Assigné":"Utilisé"})]}),e.jsxs("div",{className:"bg-slate-50 rounded-lg p-4 text-sm space-y-2",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Créé le:"}),e.jsx("span",{className:"font-medium",children:new Date(r.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})})]}),r.printed_at&&e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Imprimé le:"}),e.jsx("span",{className:"font-medium",children:new Date(r.printed_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})})]}),r.assigned_at&&e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Assigné le:"}),e.jsx("span",{className:"font-medium",children:new Date(r.assigned_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})})]})]}),e.jsxs("button",{onClick:()=>{k([r]),g(null)},className:"w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors",children:[e.jsx(f,{className:"w-5 h-5"}),"Imprimer ce bordereau"]})]})]})})]})})}export{ge as default};
