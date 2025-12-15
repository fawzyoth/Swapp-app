import{s as l,j as e,S as j}from"./index-CYPRHEJa.js";import{h as Y,u as ee,r}from"./react-vendor-CTUriZ5h.js";import{M as N,P as C}from"./MerchantLayout-CJmgIMDC.js";import{I as $,s as se,a as te,b as ae}from"./smsService-qtIlF6gc.js";import{A as re}from"./arrow-left-CxjwE-xR.js";import{c as A}from"./createLucideIcon-CMjKDoEE.js";import{U as ie}from"./user-DEx4Ce9L.js";import{P as E}from"./package-ChDCFdB3.js";import{M as ne}from"./map-pin-DUtVdt2Q.js";import{H as le}from"./home-9mW_oZwz.js";import{V as oe}from"./video-Cwp6uQ4V.js";import{C as de}from"./clock-Dhxn45-3.js";import{C as y}from"./check-circle-CyNeZd0p.js";import{X as z}from"./x-circle-D3f66Y07.js";import{S as ce}from"./send-DlqxrGT5.js";import{T as me}from"./truck-CgEV9F53.js";import{C as xe}from"./calendar-upMk3ayk.js";import{A as pe}from"./alert-circle-_Iqic_ih.js";import{T as he}from"./trending-up-9gPHMyOx.js";import{C as ge}from"./check-Cm21nyZb.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=A("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=A("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);function Ze(){const{id:i}=Y(),w=ee(),[t,T]=r.useState(null),[_,D]=r.useState([]),[L,q]=r.useState([]),[P,M]=r.useState([]),[x,U]=r.useState([]),[o,I]=r.useState([]),[u,k]=r.useState(""),[O,b]=r.useState(!1),[V,f]=r.useState(!1),[fe,ve]=r.useState(""),[je,Ne]=r.useState(""),[R,F]=r.useState("0"),[m,S]=r.useState("free"),[p,H]=r.useState(""),[G,B]=r.useState(!0);r.useEffect(()=>{g()},[i]);const g=async()=>{try{const[s,a,c,d]=await Promise.all([l.from("exchanges").select("*").eq("id",i).maybeSingle(),l.from("messages").select("*").eq("exchange_id",i).order("created_at",{ascending:!0}),l.from("transporters").select("*"),l.from("mini_depots").select("*")]);if(s.data){T(s.data);const[h,K]=await Promise.all([l.from("exchanges").select("*").eq("client_phone",s.data.client_phone).neq("id",i).order("created_at",{ascending:!1}).limit(5),l.from("delivery_attempts").select("*").eq("exchange_id",i).order("attempt_number",{ascending:!0})]);U(h.data||[]),I(K.data||[])}D(a.data||[]),q(c.data||[]),M(d.data||[])}catch(s){console.error("Error fetching data:",s)}finally{B(!1)}},Q=async s=>{if(s.preventDefault(),!!u.trim())try{await l.from("messages").insert({exchange_id:i,sender_type:"merchant",message:u}),t&&i&&await se(t.client_phone,t.client_name,t.exchange_code,i),k(""),g()}catch(a){console.error("Error sending message:",a)}},W=async()=>{const s=m==="free"?0:parseFloat(R);try{await l.from("exchanges").update({status:"validated",payment_amount:s,payment_status:m==="free"?"free":"pending",updated_at:new Date().toISOString()}).eq("id",i),await l.from("status_history").insert({exchange_id:i,status:"validated"});const a=m==="free"?"Votre échange a été validé. Aucun paiement supplémentaire requis.":`Votre échange a été validé. Montant à payer: ${s.toFixed(2)} TND.`;if(await l.from("messages").insert({exchange_id:i,sender_type:"merchant",message:a}),t){const c=new Date;c.setDate(c.getDate()+3);const d=c.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});await te(t.client_phone,t.client_name,t.exchange_code,d)}b(!1),g()}catch(a){console.error("Error validating exchange:",a)}},X=async()=>{if(!p.trim()){alert("Veuillez fournir une raison pour le refus");return}try{await l.from("exchanges").update({status:"rejected",rejection_reason:p,updated_at:new Date().toISOString()}).eq("id",i),await l.from("status_history").insert({exchange_id:i,status:"rejected"}),await l.from("messages").insert({exchange_id:i,sender_type:"merchant",message:`Votre demande d'échange a été refusée. Raison: ${p}`}),t&&await ae(t.client_phone,t.client_name,t.exchange_code,p),f(!1),g()}catch(s){console.error("Error rejecting exchange:",s)}},Z=()=>{if(!t)return;const s=P.find(h=>h.id===t.mini_depot_id),a=L.find(h=>h.id===t.transporter_id),c=`https://fawzyoth.github.io/Swapp-app/#/delivery/verify/${t.exchange_code}`,d=window.open("","","height=800,width=600");d&&(d.document.write(`
        <html>
        <head>
          <title>Bordereau ALLER - ${t.exchange_code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
            }
            .type-banner {
              background: linear-gradient(135deg, #0369a1, #0284c7);
              color: white;
              text-align: center;
              padding: 15px;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 3px;
              border-radius: 8px;
              margin-bottom: 20px;
              text-transform: uppercase;
            }
            .type-banner .icon {
              font-size: 24px;
              margin-right: 10px;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #0369a1;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 20px;
              margin-bottom: 5px;
              color: #0369a1;
            }
            .header .code {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            .header .date {
              font-size: 12px;
              color: #666;
            }
            .qr-section {
              text-align: center;
              padding: 20px;
              background: #f0f9ff;
              border: 2px solid #0369a1;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .qr-section img {
              width: 150px;
              height: 150px;
            }
            .qr-section .scan-text {
              margin-top: 10px;
              font-weight: bold;
              color: #0369a1;
              font-size: 14px;
            }
            .qr-section .scan-desc {
              margin-top: 5px;
              font-size: 11px;
              color: #666;
            }
            .section {
              margin-bottom: 15px;
              padding: 12px;
              border: 1px solid #bae6fd;
              border-radius: 6px;
              background: #f0f9ff;
            }
            .section-title {
              font-size: 12px;
              font-weight: bold;
              color: #0369a1;
              text-transform: uppercase;
              margin-bottom: 8px;
              border-bottom: 1px solid #bae6fd;
              padding-bottom: 5px;
            }
            .section-content {
              font-size: 14px;
            }
            .section-content p {
              margin: 3px 0;
            }
            .section-content .label {
              color: #666;
              font-size: 11px;
            }
            .section-content .value {
              font-weight: 500;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .payment {
              background: #fef3c7;
              border-color: #f59e0b;
            }
            .payment .value {
              font-size: 18px;
              color: #d97706;
            }
            .info-box {
              background: #dbeafe;
              border: 2px solid #3b82f6;
              border-radius: 8px;
              padding: 15px;
              margin-top: 20px;
              text-align: center;
            }
            .info-box .title {
              font-weight: bold;
              color: #1d4ed8;
              font-size: 14px;
              margin-bottom: 8px;
            }
            .info-box .desc {
              font-size: 12px;
              color: #1e40af;
            }
            .footer {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 2px dashed #0369a1;
              text-align: center;
              font-size: 10px;
              color: #0369a1;
            }
            @media print {
              body { padding: 10px; }
              .qr-section { background: #fff; }
              .section { background: #fff; }
              .info-box { background: #fff; }
            }
          </style>
        </head>
        <body>
          <div class="type-banner">
            <span class="icon">📦</span> ALLER <span class="icon">→</span>
          </div>

          <div class="header">
            <h1>BORDEREAU D'ENVOI - PRODUIT D'ÉCHANGE</h1>
            <div class="code">${t.exchange_code}</div>
            <div class="date">Créé le ${new Date(t.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
          </div>

          <div class="qr-section">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(c)}" alt="QR Code" />
            <p class="scan-text">SCANNER POUR VÉRIFIER L'ÉCHANGE</p>
            <p class="scan-desc">Le livreur scanne ce QR code pour accéder à la vidéo de référence et vérifier le produit retourné</p>
          </div>

          <div class="grid">
            <div class="section">
              <div class="section-title">Client destinataire</div>
              <div class="section-content">
                <p class="value">${t.client_name}</p>
                <p>${t.client_phone}</p>
              </div>
            </div>
            <div class="section">
              <div class="section-title">Produit envoyé</div>
              <div class="section-content">
                <p class="value">${t.product_name||"Non spécifié"}</p>
                <p class="label">Raison d'échange: ${t.reason}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Adresse de livraison</div>
            <div class="section-content">
              <p class="value">${t.client_address||"Non fournie"}</p>
              <p>${t.client_city||""} ${t.client_postal_code||""}</p>
              <p>${t.client_country||"Tunisia"}</p>
            </div>
          </div>

          ${s?`
          <div class="section">
            <div class="section-title">Mini-Dépôt</div>
            <div class="section-content">
              <p class="value">${s.name}</p>
              <p>${s.address}, ${s.city}</p>
              <p>Tél: ${s.phone}</p>
            </div>
          </div>
          `:""}

          ${a?`
          <div class="section">
            <div class="section-title">Transporteur</div>
            <div class="section-content">
              <p class="value">${a.name}</p>
              <p>Tél: ${a.phone}</p>
            </div>
          </div>
          `:""}

          <div class="section payment">
            <div class="section-title">Paiement</div>
            <div class="section-content">
              <p class="value">${t.payment_amount>0?`${t.payment_amount} TND`:"GRATUIT"}</p>
            </div>
          </div>

          <div class="info-box">
            <p class="title">📦 CE COLIS CONTIENT LE PRODUIT D'ÉCHANGE</p>
            <p class="desc">À livrer au client. Le sac de retour vide avec le bordereau RETOUR est inclus séparément.</p>
          </div>

          <div class="footer">
            <p>SWAPP - Plateforme d'échange de produits</p>
            <p>Statut: ${j[t.status]} | Type: ALLER</p>
          </div>
        </body>
        </html>
      `),d.document.close(),setTimeout(()=>{d.print()},500))},J=()=>{if(!t)return;const s=`https://fawzyoth.github.io/Swapp-app/#/client/exchange/${t.exchange_code}`,a=window.open("","","height=900,width=600");a&&(a.document.write(`
        <html>
        <head>
          <title>Bordereau RETOUR - ${t.exchange_code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              padding: 15px;
              max-width: 600px;
              margin: 0 auto;
            }
            .type-banner {
              background: linear-gradient(135deg, #059669, #10b981);
              color: white;
              text-align: center;
              padding: 12px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
              border-radius: 8px;
              margin-bottom: 15px;
              text-transform: uppercase;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #059669;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header h1 {
              font-size: 16px;
              margin-bottom: 5px;
              color: #059669;
            }
            .header .code {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              font-family: 'Courier New', monospace;
            }
            .two-codes {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 15px;
            }
            .qr-section {
              text-align: center;
              padding: 15px;
              background: #dbeafe;
              border: 2px solid #3b82f6;
              border-radius: 10px;
            }
            .qr-section img {
              width: 120px;
              height: 120px;
            }
            .qr-section .title {
              font-weight: bold;
              color: #1d4ed8;
              font-size: 11px;
              margin-bottom: 8px;
            }
            .qr-section .desc {
              font-size: 9px;
              color: #1e40af;
              margin-top: 8px;
            }
            .barcode-section {
              text-align: center;
              padding: 15px;
              background: #fef3c7;
              border: 2px solid #f59e0b;
              border-radius: 10px;
            }
            .barcode-section .title {
              font-weight: bold;
              color: #b45309;
              font-size: 11px;
              margin-bottom: 8px;
            }
            .barcode-section .barcode-img {
              width: 160px;
              height: 60px;
              object-fit: contain;
              background: white;
              padding: 8px;
              border-radius: 6px;
            }
            .barcode-section .bag-code {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 2px;
              color: #000;
              margin-top: 5px;
            }
            .barcode-section .desc {
              font-size: 9px;
              color: #92400e;
              margin-top: 8px;
            }
            .instructions-fr {
              background: #ecfdf5;
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 12px;
            }
            .instructions-fr .title {
              font-weight: bold;
              color: #047857;
              font-size: 12px;
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
              border: 2px solid #f59e0b;
              border-radius: 8px;
              padding: 12px;
              margin-bottom: 12px;
              direction: rtl;
              text-align: right;
            }
            .instructions-ar .title {
              font-weight: bold;
              color: #b45309;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .instructions-ar ol {
              margin-right: 18px;
              font-size: 12px;
              color: #92400e;
              list-style-type: arabic-indic;
            }
            .instructions-ar ol li {
              margin: 6px 0;
              line-height: 1.6;
            }
            .product-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 12px;
            }
            .info-box {
              padding: 10px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              background: #f9fafb;
            }
            .info-box .label {
              font-size: 9px;
              color: #6b7280;
              text-transform: uppercase;
              margin-bottom: 3px;
            }
            .info-box .value {
              font-size: 12px;
              font-weight: 600;
              color: #111827;
            }
            .footer {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 2px dashed #059669;
              text-align: center;
              font-size: 9px;
              color: #059669;
            }
            @media print {
              body { padding: 10px; }
              .qr-section { background: #fff; }
              .barcode-section { background: #fff; }
              .instructions-fr { background: #fff; }
              .instructions-ar { background: #fff; }
            }
          </style>
        </head>
        <body>
          <div class="type-banner">
            ↩️ بطاقة الإرجاع | BORDEREAU RETOUR
          </div>

          <div class="header">
            <h1>FICHE D'ÉCHANGE / بطاقة التبديل</h1>
            <div class="code">${t.exchange_code}</div>
          </div>

          <div class="two-codes">
            <div class="qr-section">
              <p class="title">📱 SCANNER POUR ÉCHANGER</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(s)}" alt="QR Code" />
              <p class="desc">Le client scanne ce code pour initier l'échange</p>
            </div>

            <div class="barcode-section">
              <p class="title">📦 CODE LIVREUR</p>
              <img src="https://barcodeapi.org/api/128/BAG-${t.exchange_code.slice(-8)}" alt="Barcode" class="barcode-img" />
              <p class="bag-code">BAG-${t.exchange_code.slice(-8)}</p>
              <p class="desc">Le livreur scanne lors de la collecte</p>
            </div>
          </div>

          <div class="product-info">
            <div class="info-box">
              <p class="label">Produit / المنتج</p>
              <p class="value">${t.product_name||"Non spécifié"}</p>
            </div>
            <div class="info-box">
              <p class="label">Raison / السبب</p>
              <p class="value">${t.reason}</p>
            </div>
          </div>

          <div class="instructions-fr">
            <p class="title">📋 COMMENT EFFECTUER VOTRE ÉCHANGE</p>
            <ol>
              <li><strong>Scannez le QR code</strong> avec votre téléphone pour valider l'échange</li>
              <li><strong>Préparez le produit</strong> à retourner dans son emballage d'origine</li>
              <li><strong>Gardez ce bordereau</strong> avec le produit</li>
              <li><strong>Remettez le tout au livreur</strong> lors de la collecte</li>
              <li><strong>Le livreur scannera</strong> le code-barres pour confirmer</li>
            </ol>
          </div>

          <div class="instructions-ar">
            <p class="title">📋 كيفية إجراء عملية التبديل</p>
            <ol>
              <li><strong>امسح رمز QR</strong> بهاتفك للتحقق من صحة عملية التبديل</li>
              <li><strong>جهّز المنتج</strong> المراد إرجاعه في عبوته الأصلية</li>
              <li><strong>احتفظ بهذه البطاقة</strong> مع المنتج</li>
              <li><strong>سلّم كل شيء للمندوب</strong> عند الاستلام</li>
              <li><strong>سيقوم المندوب بمسح</strong> الباركود للتأكيد</li>
            </ol>
          </div>

          <div class="footer">
            <p>SWAPP - منصة تبديل المنتجات | Plateforme d'échange de produits</p>
            <p>${t.exchange_code} | ${new Date(t.created_at).toLocaleDateString("fr-FR")}</p>
          </div>
        </body>
        </html>
      `),a.document.close(),setTimeout(()=>{a.print()},500))};if(G)return e.jsx(N,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})});if(!t)return e.jsx(N,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-2",children:"Échange non trouvé"}),e.jsx("button",{onClick:()=>w("/merchant/exchanges"),className:"px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700",children:"Retour aux échanges"})]})})});const v=t.status==="pending",n={total:x.length,validated:x.filter(s=>s.status==="validated"||s.status==="completed").length,rejected:x.filter(s=>s.status==="rejected").length};return e.jsx(N,{children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("button",{onClick:()=>w("/merchant/exchanges"),className:"flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6",children:[e.jsx(re,{className:"w-5 h-5"}),e.jsx("span",{className:"font-medium",children:"Retour aux échanges"})]}),e.jsxs("div",{className:"grid lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-1",children:t.exchange_code}),e.jsxs("p",{className:"text-slate-600",children:["Créé le"," ",new Date(t.created_at).toLocaleDateString("fr-FR")]})]}),e.jsx("span",{className:`px-4 py-2 rounded-full text-sm font-medium ${t.status==="pending"?"bg-amber-100 text-amber-800 border border-amber-200":t.status==="validated"?"bg-emerald-100 text-emerald-800 border border-emerald-200":t.status==="rejected"?"bg-red-100 text-red-800 border border-red-200":"bg-blue-100 text-blue-800 border border-blue-200"}`,children:j[t.status]})]}),v&&e.jsx("div",{className:"bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(ue,{className:"w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-amber-900 mb-1",children:"Action requise"}),e.jsx("p",{className:"text-sm text-amber-700",children:"Cette demande attend votre validation. Examinez les détails ci-dessous et décidez de l'approuver ou de la refuser."})]})]})}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(ie,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Informations client"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:t.client_name})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Téléphone:"}),e.jsx("p",{className:"font-medium text-slate-900",children:e.jsx("a",{href:`tel:${t.client_phone}`,className:"text-sky-600 hover:text-sky-700",children:t.client_phone})})]})]})]}),e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(E,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Produit"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:t.product_name||"Non spécifié"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Raison:"}),e.jsx("p",{className:"font-medium text-slate-900",children:t.reason})]})]})]})]}),e.jsxs("div",{className:"bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200 mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(ne,{className:"w-5 h-5 text-sky-700"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Adresse de livraison"})]}),e.jsx("div",{className:"space-y-2 text-sm",children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(le,{className:"w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-slate-900",children:t.client_address||"Non fournie"}),e.jsx("p",{className:"text-slate-700",children:t.client_city&&t.client_postal_code?`${t.client_city} ${t.client_postal_code}, ${t.client_country||"Tunisia"}`:"Informations incomplètes"})]})]})})]}),t.video&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(oe,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Vidéo du produit"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm text-slate-600",children:[e.jsx(de,{className:"w-4 h-4"}),e.jsxs("span",{children:["Enregistrée le"," ",new Date(t.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})," ","à"," ",new Date(t.created_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})]})]})]}),e.jsx("video",{src:t.video,controls:!0,className:"w-full max-h-96 rounded-lg border border-slate-200 bg-black"})]}),t.images&&t.images.length>0&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(E,{className:"w-5 h-5 text-emerald-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Images extraites de la vidéo"}),e.jsxs("span",{className:"text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full",children:[t.images.length," images"]})]}),e.jsx("div",{className:"grid grid-cols-4 gap-3",children:t.images.map((s,a)=>e.jsxs("div",{className:"relative group",children:[e.jsx("img",{src:s,alt:`Frame ${a+1}`,className:"w-full aspect-square object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(s,"_blank")}),e.jsxs("span",{className:"absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded",children:[a+1,"/",t.images.length]})]},a))})]}),t.photos&&t.photos.length>0&&e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold text-slate-900 mb-4",children:"Photos du produit"}),e.jsx("div",{className:"grid grid-cols-3 gap-4",children:t.photos.map((s,a)=>e.jsx("img",{src:s,alt:`Photo ${a+1}`,className:"w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(s,"_blank")},a))})]}),v&&e.jsxs("div",{className:"flex gap-3 mt-6 pt-6 border-t border-slate-200",children:[e.jsxs("button",{onClick:()=>b(!0),className:"flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(y,{className:"w-5 h-5"}),"Valider l'échange"]}),e.jsxs("button",{onClick:()=>f(!0),className:"flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(z,{className:"w-5 h-5"}),"Refuser"]})]}),!v&&t.status==="validated"&&e.jsxs("div",{className:"mt-6 space-y-3",children:[e.jsx("p",{className:"text-sm font-medium text-slate-700 text-center",children:"Imprimer les bordereaux"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("button",{onClick:Z,className:"py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(C,{className:"w-5 h-5"}),e.jsx("span",{children:"ALLER →"})]}),e.jsxs("button",{onClick:J,className:"py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(C,{className:"w-5 h-5"}),e.jsx("span",{children:"← RETOUR"})]})]}),e.jsx("p",{className:"text-xs text-slate-500 text-center",children:"ALLER: Produit d'échange | RETOUR: Sac vide pour le retour client"})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsx("h3",{className:"text-xl font-bold text-slate-900 mb-4",children:"Messages"}),e.jsx("div",{className:"space-y-4 mb-4 max-h-96 overflow-y-auto",children:_.length===0?e.jsx("p",{className:"text-slate-600 text-center py-8",children:"Aucun message"}):_.map(s=>e.jsxs("div",{className:`p-4 rounded-lg ${s.sender_type==="merchant"?"bg-sky-50 ml-auto max-w-md border border-sky-200":"bg-slate-100 mr-auto max-w-md border border-slate-200"}`,children:[e.jsx("p",{className:"text-sm font-medium text-slate-900 mb-1",children:s.sender_type==="merchant"?"Vous":t.client_name}),e.jsx("p",{className:"text-slate-700",children:s.message}),e.jsx("p",{className:"text-xs text-slate-500 mt-2",children:new Date(s.created_at).toLocaleString("fr-FR")})]},s.id))}),e.jsxs("form",{onSubmit:Q,className:"flex gap-2",children:[e.jsx("input",{type:"text",value:u,onChange:s=>k(s.target.value),placeholder:"Votre message...",className:"flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors",children:e.jsx(ce,{className:"w-5 h-5"})})]})]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(me,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique de livraison du colis"})]}),o.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx($,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600 mb-2",children:"Aucune tentative de livraison enregistrée"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Le client déclare vouloir échanger ce produit"})]}):e.jsxs("div",{className:"space-y-3",children:[t.delivery_accepted_on_attempt&&e.jsx("div",{className:"bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(y,{className:"w-4 h-4 text-emerald-600"}),e.jsxs("span",{className:"text-sm font-semibold text-emerald-900",children:["Colis accepté à la tentative"," ",t.delivery_accepted_on_attempt]})]})}),o.map((s,a)=>e.jsx("div",{className:`rounded-lg p-4 border ${s.status==="successful"?"bg-emerald-50 border-emerald-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`p-2 rounded-full ${s.status==="successful"?"bg-emerald-100":"bg-red-100"}`,children:s.status==="successful"?e.jsx(y,{className:`w-4 h-4 ${s.status==="successful"?"text-emerald-600":"text-red-600"}`}):e.jsx(z,{className:"w-4 h-4 text-red-600"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsxs("span",{className:`font-semibold text-sm ${s.status==="successful"?"text-emerald-900":"text-red-900"}`,children:["Tentative ",s.attempt_number]}),e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${s.status==="successful"?"bg-emerald-100 text-emerald-700 border border-emerald-300":"bg-red-100 text-red-700 border border-red-300"}`,children:s.status==="successful"?"Réussie":"Échouée"})]}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-slate-600 mb-2",children:[e.jsx(xe,{className:"w-3 h-3"}),e.jsx("span",{children:new Date(s.attempt_date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})})]}),s.failure_reason&&e.jsxs("div",{className:"text-sm text-red-700 mb-1",children:[e.jsx("span",{className:"font-medium",children:"Raison: "}),s.failure_reason]}),s.notes&&e.jsxs("div",{className:"text-xs text-slate-600",children:[e.jsx("span",{className:"font-medium",children:"Notes: "}),s.notes]})]})]})},s.id)),o.length>0&&e.jsx("div",{className:`rounded-lg p-3 border mt-4 ${o.some(s=>s.status==="successful")?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(pe,{className:`w-4 h-4 mt-0.5 ${o.some(s=>s.status==="successful")?"text-amber-600":"text-red-600"}`}),e.jsx("div",{className:"text-xs",children:o.some(s=>s.status==="successful")?e.jsxs("p",{className:"text-amber-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Le client a accepté le colis après"," ",o.filter(s=>s.status==="failed").length," ","tentative(s) échouée(s), mais demande maintenant un échange."]}):e.jsxs("p",{className:"text-red-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Toutes les tentatives de livraison ont échoué (",o.length," tentative(s)). Le client demande maintenant un échange."]})})]})})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(he,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique du client"})]}),x.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx($,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600",children:"Premier échange de ce client"})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-2 text-center",children:[e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200",children:[e.jsx("div",{className:"text-2xl font-bold text-slate-900",children:n.total}),e.jsx("div",{className:"text-xs text-slate-600",children:"Échanges"})]}),e.jsxs("div",{className:"bg-emerald-50 rounded-lg p-3 border border-emerald-200",children:[e.jsx("div",{className:"text-2xl font-bold text-emerald-700",children:n.validated}),e.jsx("div",{className:"text-xs text-emerald-700",children:"Validés"})]}),e.jsxs("div",{className:"bg-red-50 rounded-lg p-3 border border-red-200",children:[e.jsx("div",{className:"text-2xl font-bold text-red-700",children:n.rejected}),e.jsx("div",{className:"text-xs text-red-700",children:"Refusés"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-semibold text-slate-700 mb-2",children:"Derniers échanges"}),x.slice(0,3).map(s=>e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("span",{className:"font-mono text-xs text-slate-600",children:s.exchange_code}),e.jsx("span",{className:`text-xs px-2 py-0.5 rounded-full ${s.status==="validated"||s.status==="completed"?"bg-emerald-100 text-emerald-700":s.status==="rejected"?"bg-red-100 text-red-700":"bg-amber-100 text-amber-700"}`,children:j[s.status]})]}),e.jsx("p",{className:"text-xs text-slate-600 truncate",children:s.reason}),e.jsx("p",{className:"text-xs text-slate-500 mt-1",children:new Date(s.created_at).toLocaleDateString("fr-FR")})]},s.id))]}),n.total>0&&e.jsx("div",{className:`rounded-lg p-3 border ${n.validated/n.total>=.7?"bg-emerald-50 border-emerald-200":n.validated/n.total>=.4?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ge,{className:`w-4 h-4 ${n.validated/n.total>=.7?"text-emerald-600":n.validated/n.total>=.4?"text-amber-600":"text-red-600"}`}),e.jsxs("span",{className:"text-sm font-medium",children:["Taux de validation:"," ",Math.round(n.validated/n.total*100),"%"]})]})})]})]})]})]}),O&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-6",children:"Valider l'échange"}),e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"bg-sky-50 border border-sky-200 rounded-xl p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(be,{className:"w-5 h-5 text-sky-700"}),e.jsx("h4",{className:"font-semibold text-slate-900",children:"Options de paiement"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("label",{className:"flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors",children:[e.jsx("input",{type:"radio",name:"paymentType",value:"free",checked:m==="free",onChange:s=>S(s.target.value),className:"w-4 h-4 text-sky-600"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-slate-900",children:"Échange gratuit"}),e.jsx("div",{className:"text-sm text-slate-600",children:"Pas de frais supplémentaires"})]})]}),e.jsxs("label",{className:"flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors",children:[e.jsx("input",{type:"radio",name:"paymentType",value:"paid",checked:m==="paid",onChange:s=>S(s.target.value),className:"w-4 h-4 text-sky-600 mt-1"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:"font-medium text-slate-900 mb-2",children:"Échange payant"}),m==="paid"&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm text-slate-700",children:"Montant à payer (TND)"}),e.jsx("input",{type:"number",step:"0.01",min:"0",value:R,onChange:s=>F(s.target.value),placeholder:"0.00",className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"}),e.jsx("p",{className:"text-xs text-slate-600",children:"Pour différence de prix ou frais de livraison"})]})]})]})]})]})}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>b(!1),className:"flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors",children:"Annuler"}),e.jsx("button",{onClick:W,className:"flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors",children:"Confirmer la validation"})]})]})})}),V&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-lg w-full",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-4",children:"Refuser l'échange"}),e.jsx("p",{className:"text-slate-600 mb-6",children:"Veuillez expliquer la raison du refus au client"}),e.jsx("textarea",{value:p,onChange:s=>H(s.target.value),placeholder:"Expliquez pourquoi l'échange est refusé...",rows:4,className:"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>f(!1),className:"flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors",children:"Annuler"}),e.jsx("button",{onClick:X,className:"flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors",children:"Confirmer le refus"})]})]})})})]})})}export{Ze as default};
