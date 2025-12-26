import{s as p,j as e}from"./index-BNAn6GYB.js";import{u as L,r as i}from"./react-vendor-CTUriZ5h.js";import{Q as q}from"./qr-display-BZBHW9NW.js";import{M as S}from"./MerchantLayout-8TWo7peR.js";import{P as f}from"./printer-B3I1m1op.js";import{A as I}from"./alert-circle-_Iqic_ih.js";import{F as C}from"./file-text-B3Ewreww.js";import{C as Q}from"./check-circle-CyNeZd0p.js";import{C as G}from"./clock-Dhxn45-3.js";import{P as M}from"./package-ChDCFdB3.js";import{S as U}from"./search-CPbK6Y1N.js";import{F as T}from"./filter-Cp7rfch8.js";import{E as H}from"./eye-B0fj8J_e.js";import{X as V}from"./x-D4qrk5Qy.js";import"./supabase-Bl4YWSQ9.js";import"./menu-DP2azNEK.js";import"./createLucideIcon-CMjKDoEE.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";const W=()=>{const u=Date.now().toString(36).toUpperCase(),b=Math.random().toString(36).substring(2,6).toUpperCase();return`BDX-${u}-${b}`};function fe(){const u=L(),[b,z]=i.useState(!0),[v,j]=i.useState(!1),[c,_]=i.useState(10),[d,D]=i.useState([]),[s,$]=i.useState(null),[O,A]=i.useState(""),[h,R]=i.useState("all"),[N,E]=i.useState(""),[y,n]=i.useState(""),[r,g]=i.useState(null);i.useEffect(()=>{F()},[]);const F=async()=>{try{const{data:{session:t}}=await p.auth.getSession();if(!t){u("/merchant/login");return}const{data:a}=await p.from("merchants").select("*").eq("email",t.user.email).maybeSingle();a&&($(a),A(a.id),await w(a.id))}catch(t){console.error("Error fetching data:",t),n("Erreur lors du chargement")}finally{z(!1)}},w=async t=>{const{data:a}=await p.from("merchant_bordereaux").select("*").eq("merchant_id",t).order("created_at",{ascending:!1});D(a||[])},B=async()=>{if(!(s!=null&&s.id)){n("Erreur: Marchand non trouve. Veuillez vous reconnecter.");return}if(c<1||c>100){n("La quantite doit etre entre 1 et 100");return}j(!0),n("");try{const t=[];for(let l=0;l<c;l++)t.push({merchant_id:s.id,bordereau_code:W(),status:"available",printed_at:new Date().toISOString()});const{data:a,error:o}=await p.from("merchant_bordereaux").insert(t).select();if(o)throw o;await w(s.id),a&&k(a)}catch(t){console.error("Error generating bordereaux:",t),n(`Erreur: ${(t==null?void 0:t.message)||(t==null?void 0:t.details)||JSON.stringify(t)}`)}finally{j(!1)}},k=t=>{const a=window.open("","","height=900,width=800");if(!a)return;const o=t.map(l=>{const P=`https://fawzyoth.github.io/Swapp-app/#/client/exchange/new?bordereau=${l.bordereau_code}`;return`
        <div class="bordereau">
          <div class="header">
            <div class="header-top">
              <div class="logo-section">
                ${s!=null&&s.logo_base64?`<img src="${s.logo_base64}" alt="Logo" class="logo" />`:'<div class="logo-text">SWAPP</div>'}
              </div>
              <div class="doc-type">FICHE D'ECHANGE</div>
            </div>
            <div class="header-info">
              <div class="code">${l.bordereau_code}</div>
              <div class="subtitle">Fiche d'echange / بطاقة التبديل</div>
            </div>
            <div class="merchant-info">${(s==null?void 0:s.business_name)||(s==null?void 0:s.name)||"E-Commercant"}</div>
          </div>

          <div class="codes-section">
            <div class="code-box">
              <div class="title">QR Client</div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(P)}" alt="QR Code" width="120" height="120" />
              <div class="code-label">${l.bordereau_code}</div>
              <div class="desc">Scanner pour initier l'echange</div>
            </div>
            <div class="code-box">
              <div class="title">Code-Barres Livreur</div>
              <img src="https://barcodeapi.org/api/128/${l.bordereau_code}" alt="Barcode" width="160" height="50" />
              <div class="code-label">${l.bordereau_code}</div>
              <div class="desc">Scanner lors de la collecte</div>
            </div>
          </div>

          <div class="contact-section">
            <div class="contact-title">Contact Marchand</div>
            <p><strong>Tel:</strong> ${(s==null?void 0:s.phone)||"Non renseigne"}</p>
            <p><strong>Adresse:</strong> ${(s==null?void 0:s.business_address)||""} ${(s==null?void 0:s.business_city)||""} ${(s==null?void 0:s.business_postal_code)||""}</p>
          </div>

          <div class="instructions-section">
            <div class="instructions-box">
              <div class="title">Instructions</div>
              <ol>
                <li>Scannez le QR code avec votre telephone</li>
                <li>Remplissez le formulaire d'echange</li>
                <li>Preparez le produit dans son emballage</li>
                <li>Gardez cette fiche avec le produit</li>
                <li>Remettez le tout au livreur</li>
              </ol>
            </div>
            <div class="instructions-box ar">
              <div class="title">التعليمات</div>
              <ol>
                <li>امسح رمز QR بهاتفك</li>
                <li>املأ استمارة التبديل</li>
                <li>جهّز المنتج في عبوته</li>
                <li>احتفظ بهذه البطاقة مع المنتج</li>
                <li>سلّم كل شيء للمندوب</li>
              </ol>
            </div>
          </div>

          <div class="notice">
            <div class="title">A remettre au livreur</div>
            <div class="text">Cette fiche doit accompagner le produit retourne</div>
          </div>

          <div class="footer">
            <div class="brand">SWAPP - Plateforme d'echange</div>
            <div class="date">${new Date().toLocaleDateString("fr-FR")}</div>
          </div>
        </div>
      `}).join('<div class="page-break"></div>');a.document.write(`
      <html>
      <head>
        <title>Bordereaux - ${t.length} exemplaires</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, Helvetica, sans-serif;
            padding: 15px;
            color: #000;
          }

          .bordereau {
            max-width: 600px;
            margin: 20px auto;
            padding: 15px;
          }

          .header {
            border: 3px solid #000;
            padding: 12px;
            margin-bottom: 15px;
          }

          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }

          .logo {
            width: 60px;
            height: 60px;
            object-fit: contain;
          }

          .logo-text {
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
          }

          .doc-type {
            background: #000;
            color: #fff;
            padding: 5px 15px;
            font-weight: bold;
            font-size: 12px;
          }

          .header-info {
            text-align: center;
            margin-bottom: 8px;
          }

          .header-info .code {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
          }

          .header-info .subtitle {
            font-size: 11px;
            color: #333;
            margin-top: 3px;
          }

          .merchant-info {
            text-align: center;
            font-size: 12px;
            color: #333;
            font-weight: bold;
          }

          .codes-section {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
          }

          .code-box {
            flex: 1;
            border: 2px solid #000;
            padding: 10px;
            text-align: center;
          }

          .code-box .title {
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid #000;
          }

          .code-box img {
            display: block;
            margin: 0 auto;
          }

          .code-box .code-label {
            font-family: 'Courier New', monospace;
            font-size: 10px;
            font-weight: bold;
            margin-top: 8px;
          }

          .code-box .desc {
            font-size: 9px;
            color: #666;
            margin-top: 4px;
          }

          .contact-section {
            border: 1px solid #000;
            padding: 10px;
            margin-bottom: 15px;
          }

          .contact-title {
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 5px;
            padding-bottom: 5px;
            border-bottom: 1px solid #000;
          }

          .contact-section p {
            font-size: 11px;
            margin: 3px 0;
          }

          .instructions-section {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
          }

          .instructions-box {
            flex: 1;
            border: 1px solid #000;
            padding: 10px;
          }

          .instructions-box.ar {
            direction: rtl;
            text-align: right;
          }

          .instructions-box .title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid #000;
          }

          .instructions-box ol {
            margin-left: 15px;
            font-size: 10px;
          }

          .instructions-box.ar ol {
            margin-left: 0;
            margin-right: 15px;
          }

          .instructions-box ol li {
            margin: 4px 0;
          }

          .notice {
            border: 2px dashed #000;
            padding: 10px;
            text-align: center;
            margin-bottom: 15px;
          }

          .notice .title {
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 5px;
          }

          .notice .text {
            font-size: 11px;
          }

          .footer {
            border-top: 2px solid #000;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
          }

          .footer .brand {
            font-weight: bold;
          }

          .page-break {
            page-break-after: always;
          }

          @media print {
            body { padding: 0; }
            .bordereau { margin: 10px auto; }
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        ${o}
      </body>
      </html>
    `),a.document.close(),setTimeout(()=>{a.print()},500)},x=d.filter(t=>{const a=h==="all"||t.status===h,o=t.bordereau_code.toLowerCase().includes(N.toLowerCase());return a&&o}),m={total:d.length,available:d.filter(t=>t.status==="available").length,assigned:d.filter(t=>t.status==="assigned").length,used:d.filter(t=>t.status==="used").length};return b?e.jsx(S,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})}):e.jsx(S,{children:e.jsxs("div",{className:"max-w-6xl mx-auto",children:[e.jsxs("div",{className:"mb-8",children:[e.jsxs("h1",{className:"text-3xl font-bold text-slate-900 flex items-center gap-3",children:[e.jsx(f,{className:"w-8 h-8 text-sky-600"}),"Imprimer des Bordereaux"]}),e.jsx("p",{className:"text-slate-600 mt-2",children:"Generez et imprimez des bordereaux pre-configures avec QR code et code-barres uniques"})]}),y&&e.jsxs("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3",children:[e.jsx(I,{className:"w-5 h-5 text-red-600"}),e.jsx("span",{className:"text-red-800",children:y})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4 mb-8",children:[e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-slate-100 rounded-lg",children:e.jsx(C,{className:"w-5 h-5 text-slate-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:m.total}),e.jsx("p",{className:"text-sm text-slate-600",children:"Total"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-lg",children:e.jsx(Q,{className:"w-5 h-5 text-emerald-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-emerald-600",children:m.available}),e.jsx("p",{className:"text-sm text-slate-600",children:"Disponibles"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-amber-100 rounded-lg",children:e.jsx(G,{className:"w-5 h-5 text-amber-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-amber-600",children:m.assigned}),e.jsx("p",{className:"text-sm text-slate-600",children:"Assignes"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-sky-100 rounded-lg",children:e.jsx(M,{className:"w-5 h-5 text-sky-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-sky-600",children:m.used}),e.jsx("p",{className:"text-sm text-slate-600",children:"Utilises"})]})]})})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8",children:[e.jsx("h2",{className:"text-lg font-semibold text-slate-900 mb-4",children:"Generer de nouveaux bordereaux"}),e.jsxs("div",{className:"flex flex-wrap items-end gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Quantite"}),e.jsx("input",{type:"number",min:"1",max:"100",value:c,onChange:t=>_(parseInt(t.target.value)||1),className:"w-32 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"})]}),e.jsx("button",{onClick:B,disabled:v,className:"flex items-center gap-2 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",children:v?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),"Generation..."]}):e.jsxs(e.Fragment,{children:[e.jsx(f,{className:"w-5 h-5"}),"Generer et Imprimer"]})})]}),e.jsx("p",{className:"text-sm text-slate-500 mt-3",children:"Chaque bordereau aura un QR code et un code-barres uniques lies ensemble"})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-4 mb-6",children:[e.jsx("h2",{className:"text-lg font-semibold text-slate-900",children:"Historique des bordereaux"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsxs("div",{className:"relative",children:[e.jsx(U,{className:"w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"}),e.jsx("input",{type:"text",placeholder:"Rechercher...",value:N,onChange:t=>E(t.target.value),className:"pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(T,{className:"w-4 h-4 text-slate-400"}),e.jsxs("select",{value:h,onChange:t=>R(t.target.value),className:"px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",children:[e.jsx("option",{value:"all",children:"Tous"}),e.jsx("option",{value:"available",children:"Disponibles"}),e.jsx("option",{value:"assigned",children:"Assignes"}),e.jsx("option",{value:"used",children:"Utilises"})]})]})]})]}),x.length===0?e.jsxs("div",{className:"text-center py-12",children:[e.jsx(C,{className:"w-16 h-16 text-slate-300 mx-auto mb-4"}),e.jsx("p",{className:"text-slate-600",children:"Aucun bordereau trouve"}),e.jsx("p",{className:"text-sm text-slate-500 mt-1",children:"Generez vos premiers bordereaux pour commencer"})]}):e.jsxs("div",{className:"overflow-x-auto",children:[e.jsxs("table",{className:"w-full",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"border-b border-slate-200",children:[e.jsx("th",{className:"text-left py-3 px-4 font-semibold text-slate-700",children:"Code"}),e.jsx("th",{className:"text-left py-3 px-4 font-semibold text-slate-700",children:"Statut"}),e.jsx("th",{className:"text-left py-3 px-4 font-semibold text-slate-700",children:"Date creation"}),e.jsx("th",{className:"text-center py-3 px-4 font-semibold text-slate-700",children:"Actions"})]})}),e.jsx("tbody",{children:x.slice(0,50).map(t=>e.jsxs("tr",{className:"border-b border-slate-100 hover:bg-slate-50",children:[e.jsx("td",{className:"py-3 px-4",children:e.jsx("code",{className:"font-mono text-sm bg-slate-100 px-2 py-1 rounded",children:t.bordereau_code})}),e.jsx("td",{className:"py-3 px-4",children:e.jsx("span",{className:`px-3 py-1 rounded-full text-xs font-medium ${t.status==="available"?"bg-emerald-100 text-emerald-700":t.status==="assigned"?"bg-amber-100 text-amber-700":"bg-sky-100 text-sky-700"}`,children:t.status==="available"?"Disponible":t.status==="assigned"?"Assigne":"Utilise"})}),e.jsx("td",{className:"py-3 px-4 text-sm text-slate-600",children:new Date(t.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}),e.jsx("td",{className:"py-3 px-4 text-center",children:e.jsx("button",{onClick:()=>g(t),className:"p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors",title:"Voir les details",children:e.jsx(H,{className:"w-5 h-5"})})})]},t.id))})]}),x.length>50&&e.jsxs("p",{className:"text-center text-sm text-slate-500 py-4",children:["Affichage des 50 premiers sur ",x.length]})]})]}),r&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto",children:[e.jsxs("div",{className:"flex items-center justify-between p-4 border-b border-slate-200",children:[e.jsx("h3",{className:"text-lg font-semibold text-slate-900",children:"Détails du Bordereau"}),e.jsx("button",{onClick:()=>g(null),className:"p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors",children:e.jsx(V,{className:"w-5 h-5"})})]}),e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"text-center mb-6",children:[e.jsx("p",{className:"text-sm text-slate-600 mb-2",children:"Code du bordereau"}),e.jsx("code",{className:"text-2xl font-mono font-bold bg-slate-100 px-4 py-2 rounded-lg",children:r.bordereau_code})]}),e.jsx("div",{className:"flex justify-center mb-6",children:e.jsxs("div",{className:"bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center",children:[e.jsx(q,{value:`https://fawzyoth.github.io/Swapp-app/#/client/exchange/new?bordereau=${r.bordereau_code}`,size:180,level:"M"}),e.jsx("p",{className:"text-sm text-blue-700 mt-3 font-medium",children:"Scanner pour initier l'échange"}),e.jsx("p",{className:"text-xs text-slate-500 mt-1 break-all",children:r.bordereau_code})]})}),e.jsxs("div",{className:"flex items-center justify-center gap-2 mb-6",children:[e.jsx("span",{className:"text-sm text-slate-600",children:"Statut:"}),e.jsx("span",{className:`px-3 py-1 rounded-full text-sm font-medium ${r.status==="available"?"bg-emerald-100 text-emerald-700":r.status==="assigned"?"bg-amber-100 text-amber-700":"bg-sky-100 text-sky-700"}`,children:r.status==="available"?"Disponible":r.status==="assigned"?"Assigné":"Utilisé"})]}),e.jsxs("div",{className:"bg-slate-50 rounded-lg p-4 text-sm space-y-2",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Créé le:"}),e.jsx("span",{className:"font-medium",children:new Date(r.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})})]}),r.printed_at&&e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Imprimé le:"}),e.jsx("span",{className:"font-medium",children:new Date(r.printed_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})})]}),r.assigned_at&&e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-600",children:"Assigné le:"}),e.jsx("span",{className:"font-medium",children:new Date(r.assigned_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})})]})]}),e.jsxs("button",{onClick:()=>{k([r]),g(null)},className:"w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors",children:[e.jsx(f,{className:"w-5 h-5"}),"Imprimer ce bordereau"]})]})]})})]})})}export{fe as default};
