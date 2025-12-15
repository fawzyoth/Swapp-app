import{s as o,j as e,S as N}from"./index-BwihO_lJ.js";import{h as J,u as K,r}from"./react-vendor-CTUriZ5h.js";import{M as y}from"./MerchantLayout-CFqDMDlB.js";import{I as $,s as Y,a as ee,b as se}from"./smsService-qtIlF6gc.js";import{A as te}from"./arrow-left-CxjwE-xR.js";import{c as z}from"./createLucideIcon-CMjKDoEE.js";import{U as ae}from"./user-DEx4Ce9L.js";import{P as A}from"./package-ChDCFdB3.js";import{M as re}from"./map-pin-DUtVdt2Q.js";import{H as ie}from"./home-9mW_oZwz.js";import{V as le}from"./video-Cwp6uQ4V.js";import{C as oe}from"./clock-Dhxn45-3.js";import{C as w}from"./check-circle-CyNeZd0p.js";import{X as D}from"./x-circle-D3f66Y07.js";import{P as ne}from"./printer-B3I1m1op.js";import{S as de}from"./send-DlqxrGT5.js";import{T as ce}from"./truck-CgEV9F53.js";import{C as me}from"./calendar-upMk3ayk.js";import{A as xe}from"./alert-circle-_Iqic_ih.js";import{T as pe}from"./trending-up-9gPHMyOx.js";import{C as ge}from"./check-Cm21nyZb.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=z("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=z("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);function es(){const{id:i}=J(),_=K(),[t,T]=r.useState(null),[be,fe]=r.useState(null),[ve,je]=r.useState(!1),[k,P]=r.useState([]),[L,q]=r.useState([]),[M,U]=r.useState([]),[x,I]=r.useState([]),[n,O]=r.useState([]),[b,R]=r.useState(""),[V,f]=r.useState(!1),[F,v]=r.useState(!1),[Ne,ye]=r.useState(""),[we,_e]=r.useState(""),[S,H]=r.useState("0"),[c,C]=r.useState("free"),[p,G]=r.useState(""),[B,E]=r.useState(!0);r.useEffect(()=>{u()},[i]);const u=async()=>{try{const{data:s}=await o.from("exchanges").select("*").eq("id",i).maybeSingle();if(!s){E(!1);return}T(s);const[a,d,g,m,h]=await Promise.all([o.from("messages").select("id, sender_type, message, created_at").eq("exchange_id",i).order("created_at",{ascending:!0}),o.from("transporters").select("id, name"),o.from("mini_depots").select("id, name, address"),o.from("exchanges").select("id, exchange_code, reason, status, created_at").eq("client_phone",s.client_phone).neq("id",i).order("created_at",{ascending:!1}).limit(5),o.from("delivery_attempts").select("id, attempt_number, status, scheduled_date, notes, created_at").eq("exchange_id",i).order("attempt_number",{ascending:!0})]);P(a.data||[]),q(d.data||[]),U(g.data||[]),I(m.data||[]),O(h.data||[])}catch(s){console.error("Error fetching data:",s)}finally{E(!1)}},Q=async s=>{if(s.preventDefault(),!!b.trim())try{await o.from("messages").insert({exchange_id:i,sender_type:"merchant",message:b}),t&&i&&await Y(t.client_phone,t.client_name,t.exchange_code,i),R(""),u()}catch(a){console.error("Error sending message:",a)}},W=async()=>{const s=c==="free"?0:parseFloat(S);try{await o.from("exchanges").update({status:"validated",payment_amount:s,payment_status:c==="free"?"free":"pending",updated_at:new Date().toISOString()}).eq("id",i),await o.from("status_history").insert({exchange_id:i,status:"validated"});const a=c==="free"?"Votre échange a été validé. Aucun paiement supplémentaire requis.":`Votre échange a été validé. Montant à payer: ${s.toFixed(2)} TND.`;if(await o.from("messages").insert({exchange_id:i,sender_type:"merchant",message:a}),t){const d=new Date;d.setDate(d.getDate()+3);const g=d.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});await ee(t.client_phone,t.client_name,t.exchange_code,g)}f(!1),u()}catch(a){console.error("Error validating exchange:",a)}},X=async()=>{if(!p.trim()){alert("Veuillez fournir une raison pour le refus");return}try{await o.from("exchanges").update({status:"rejected",rejection_reason:p,updated_at:new Date().toISOString()}).eq("id",i),await o.from("status_history").insert({exchange_id:i,status:"rejected"}),await o.from("messages").insert({exchange_id:i,sender_type:"merchant",message:`Votre demande d'échange a été refusée. Raison: ${p}`}),t&&await se(t.client_phone,t.client_name,t.exchange_code,p),v(!1),u()}catch(s){console.error("Error rejecting exchange:",s)}},Z=()=>{if(!t)return;const s=M.find(h=>h.id===t.mini_depot_id),a=L.find(h=>h.id===t.transporter_id),d=`https://fawzyoth.github.io/Swapp-app/#/delivery/verify/${t.exchange_code}`,g=`https://fawzyoth.github.io/Swapp-app/#/client/exchange/${t.exchange_code}`,m=window.open("","","height=900,width=600");m&&(m.document.write(`
        <html>
        <head>
          <title>Bordereau - ${t.exchange_code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
            }
            .page {
              padding: 15px;
              page-break-after: always;
              min-height: 100vh;
            }
            .page:last-child {
              page-break-after: avoid;
            }

            /* ALLER Page Styles */
            .type-banner-aller {
              background: linear-gradient(135deg, #0369a1, #0284c7);
              color: white;
              text-align: center;
              padding: 12px;
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 3px;
              border-radius: 8px;
              margin-bottom: 15px;
              text-transform: uppercase;
            }
            .header-aller {
              text-align: center;
              border-bottom: 3px solid #0369a1;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header-aller h1 {
              font-size: 16px;
              margin-bottom: 5px;
              color: #0369a1;
            }
            .header-aller .code {
              font-size: 18px;
              font-weight: bold;
              color: #333;
            }
            .header-aller .date {
              font-size: 11px;
              color: #666;
            }
            .qr-section-aller {
              text-align: center;
              padding: 15px;
              background: #f0f9ff;
              border: 2px solid #0369a1;
              border-radius: 8px;
              margin-bottom: 15px;
            }
            .qr-section-aller img {
              width: 120px;
              height: 120px;
            }
            .qr-section-aller .scan-text {
              margin-top: 8px;
              font-weight: bold;
              color: #0369a1;
              font-size: 12px;
            }
            .qr-section-aller .scan-desc {
              margin-top: 5px;
              font-size: 10px;
              color: #666;
            }
            .section-aller {
              margin-bottom: 10px;
              padding: 10px;
              border: 1px solid #bae6fd;
              border-radius: 6px;
              background: #f0f9ff;
            }
            .section-title {
              font-size: 11px;
              font-weight: bold;
              color: #0369a1;
              text-transform: uppercase;
              margin-bottom: 6px;
              border-bottom: 1px solid #bae6fd;
              padding-bottom: 4px;
            }
            .section-content {
              font-size: 12px;
            }
            .section-content p {
              margin: 2px 0;
            }
            .section-content .label {
              color: #666;
              font-size: 10px;
            }
            .section-content .value {
              font-weight: 500;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .payment {
              background: #fef3c7;
              border-color: #f59e0b;
            }
            .payment .section-title {
              color: #b45309;
              border-color: #fcd34d;
            }
            .payment .value {
              font-size: 16px;
              color: #d97706;
            }
            .info-box-aller {
              background: #dbeafe;
              border: 2px solid #3b82f6;
              border-radius: 8px;
              padding: 12px;
              margin-top: 15px;
              text-align: center;
            }
            .info-box-aller .title {
              font-weight: bold;
              color: #1d4ed8;
              font-size: 12px;
              margin-bottom: 5px;
            }
            .info-box-aller .desc {
              font-size: 10px;
              color: #1e40af;
            }
            .footer-aller {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 2px dashed #0369a1;
              text-align: center;
              font-size: 9px;
              color: #0369a1;
            }

            /* RETOUR Page Styles */
            .type-banner-retour {
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
            .header-retour {
              text-align: center;
              border-bottom: 3px solid #059669;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            .header-retour h1 {
              font-size: 14px;
              margin-bottom: 5px;
              color: #059669;
            }
            .header-retour .code {
              font-size: 18px;
              font-weight: bold;
              color: #333;
              font-family: 'Courier New', monospace;
            }
            .two-codes {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-bottom: 12px;
            }
            .qr-section-retour {
              text-align: center;
              padding: 12px;
              background: #dbeafe;
              border: 2px solid #3b82f6;
              border-radius: 10px;
            }
            .qr-section-retour img {
              width: 100px;
              height: 100px;
            }
            .qr-section-retour .title {
              font-weight: bold;
              color: #1d4ed8;
              font-size: 10px;
              margin-bottom: 6px;
            }
            .qr-section-retour .desc {
              font-size: 8px;
              color: #1e40af;
              margin-top: 6px;
            }
            .barcode-section {
              text-align: center;
              padding: 12px;
              background: #fef3c7;
              border: 2px solid #f59e0b;
              border-radius: 10px;
            }
            .barcode-section .title {
              font-weight: bold;
              color: #b45309;
              font-size: 10px;
              margin-bottom: 6px;
            }
            .barcode-section .barcode-img {
              width: 140px;
              height: 50px;
              object-fit: contain;
              background: white;
              padding: 6px;
              border-radius: 6px;
            }
            .barcode-section .bag-code {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              font-weight: bold;
              letter-spacing: 2px;
              color: #000;
              margin-top: 4px;
            }
            .barcode-section .desc {
              font-size: 8px;
              color: #92400e;
              margin-top: 6px;
            }
            .product-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-bottom: 10px;
            }
            .info-box {
              padding: 8px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              background: #f9fafb;
            }
            .info-box .label {
              font-size: 8px;
              color: #6b7280;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .info-box .value {
              font-size: 11px;
              font-weight: 600;
              color: #111827;
            }
            .instructions-fr {
              background: #ecfdf5;
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 10px;
            }
            .instructions-fr .title {
              font-weight: bold;
              color: #047857;
              font-size: 11px;
              margin-bottom: 6px;
            }
            .instructions-fr ol {
              margin-left: 16px;
              font-size: 10px;
              color: #065f46;
            }
            .instructions-fr ol li {
              margin: 3px 0;
            }
            .instructions-ar {
              background: #fef3c7;
              border: 2px solid #f59e0b;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 10px;
              direction: rtl;
              text-align: right;
            }
            .instructions-ar .title {
              font-weight: bold;
              color: #b45309;
              font-size: 12px;
              margin-bottom: 8px;
            }
            .instructions-ar ol {
              margin-right: 16px;
              font-size: 11px;
              color: #92400e;
              list-style-type: arabic-indic;
            }
            .instructions-ar ol li {
              margin: 4px 0;
              line-height: 1.5;
            }
            .footer-retour {
              margin-top: 12px;
              padding-top: 8px;
              border-top: 2px dashed #059669;
              text-align: center;
              font-size: 8px;
              color: #059669;
            }
            .cut-line {
              border-top: 2px dashed #9ca3af;
              margin: 20px 0;
              position: relative;
              text-align: center;
            }
            .cut-line::before {
              content: "✂ COUPER ICI / CUT HERE";
              background: white;
              padding: 0 10px;
              position: relative;
              top: -10px;
              font-size: 10px;
              color: #6b7280;
            }
            @media print {
              body { padding: 0; }
              .page { padding: 10px; }
              .qr-section-aller { background: #fff; }
              .section-aller { background: #fff; }
              .info-box-aller { background: #fff; }
              .qr-section-retour { background: #fff; }
              .barcode-section { background: #fff; }
              .instructions-fr { background: #fff; }
              .instructions-ar { background: #fff; }
            }
          </style>
        </head>
        <body>
          <!-- PAGE 1: ALLER (Outbound) -->
          <div class="page">
            <div class="type-banner-aller">
              📦 ALLER →
            </div>

            <div class="header-aller">
              <h1>BORDEREAU D'ENVOI - PRODUIT D'ÉCHANGE</h1>
              <div class="code">${t.exchange_code}</div>
              <div class="date">Créé le ${new Date(t.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
            </div>

            <div class="qr-section-aller">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(d)}" alt="QR Code" />
              <p class="scan-text">SCANNER POUR VÉRIFIER L'ÉCHANGE</p>
              <p class="scan-desc">Le livreur scanne ce QR code pour accéder à la vidéo de référence</p>
            </div>

            <div class="grid">
              <div class="section-aller">
                <div class="section-title">Client destinataire</div>
                <div class="section-content">
                  <p class="value">${t.client_name}</p>
                  <p>${t.client_phone}</p>
                </div>
              </div>
              <div class="section-aller">
                <div class="section-title">Produit envoyé</div>
                <div class="section-content">
                  <p class="value">${t.product_name||"Non spécifié"}</p>
                  <p class="label">Raison: ${t.reason}</p>
                </div>
              </div>
            </div>

            <div class="section-aller">
              <div class="section-title">Adresse de livraison</div>
              <div class="section-content">
                <p class="value">${t.client_address||"Non fournie"}</p>
                <p>${t.client_city||""} ${t.client_postal_code||""}</p>
                <p>${t.client_country||"Tunisia"}</p>
              </div>
            </div>

            ${s?`
            <div class="section-aller">
              <div class="section-title">Mini-Dépôt</div>
              <div class="section-content">
                <p class="value">${s.name}</p>
                <p>${s.address||""}</p>
              </div>
            </div>
            `:""}

            ${a?`
            <div class="section-aller">
              <div class="section-title">Transporteur</div>
              <div class="section-content">
                <p class="value">${a.name}</p>
              </div>
            </div>
            `:""}

            <div class="section-aller payment">
              <div class="section-title">Paiement</div>
              <div class="section-content">
                <p class="value">${t.payment_amount>0?`${t.payment_amount} TND`:"GRATUIT"}</p>
              </div>
            </div>

            <div class="info-box-aller">
              <p class="title">📦 CE COLIS CONTIENT LE PRODUIT D'ÉCHANGE</p>
              <p class="desc">À livrer au client. Le bordereau RETOUR (page 2) doit être inclus pour le retour.</p>
            </div>

            <div class="footer-aller">
              <p>SWAPP - Plateforme d'échange de produits</p>
              <p>Statut: ${N[t.status]} | Page 1/2 - ALLER</p>
            </div>
          </div>

          <!-- PAGE 2: RETOUR (Return) -->
          <div class="page">
            <div class="type-banner-retour">
              ↩️ بطاقة الإرجاع | RETOUR
            </div>

            <div class="header-retour">
              <h1>FICHE D'ÉCHANGE / بطاقة التبديل</h1>
              <div class="code">${t.exchange_code}</div>
            </div>

            <div class="two-codes">
              <div class="qr-section-retour">
                <p class="title">📱 SCANNER POUR ÉCHANGER</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(g)}" alt="QR Code" />
                <p class="desc">Le client scanne pour initier l'échange</p>
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

            <div class="footer-retour">
              <p>SWAPP - منصة تبديل المنتجات | Plateforme d'échange de produits</p>
              <p>${t.exchange_code} | ${new Date(t.created_at).toLocaleDateString("fr-FR")} | Page 2/2 - RETOUR</p>
            </div>
          </div>
        </body>
        </html>
      `),m.document.close(),setTimeout(()=>{m.print()},500))};if(B)return e.jsx(y,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})});if(!t)return e.jsx(y,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-2",children:"Échange non trouvé"}),e.jsx("button",{onClick:()=>_("/merchant/exchanges"),className:"px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700",children:"Retour aux échanges"})]})})});const j=t.status==="pending",l={total:x.length,validated:x.filter(s=>s.status==="validated"||s.status==="completed").length,rejected:x.filter(s=>s.status==="rejected").length};return e.jsx(y,{children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("button",{onClick:()=>_("/merchant/exchanges"),className:"flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6",children:[e.jsx(te,{className:"w-5 h-5"}),e.jsx("span",{className:"font-medium",children:"Retour aux échanges"})]}),e.jsxs("div",{className:"grid lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-1",children:t.exchange_code}),e.jsxs("p",{className:"text-slate-600",children:["Créé le"," ",new Date(t.created_at).toLocaleDateString("fr-FR")]})]}),e.jsx("span",{className:`px-4 py-2 rounded-full text-sm font-medium ${t.status==="pending"?"bg-amber-100 text-amber-800 border border-amber-200":t.status==="validated"?"bg-emerald-100 text-emerald-800 border border-emerald-200":t.status==="rejected"?"bg-red-100 text-red-800 border border-red-200":"bg-blue-100 text-blue-800 border border-blue-200"}`,children:N[t.status]})]}),j&&e.jsx("div",{className:"bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(he,{className:"w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-amber-900 mb-1",children:"Action requise"}),e.jsx("p",{className:"text-sm text-amber-700",children:"Cette demande attend votre validation. Examinez les détails ci-dessous et décidez de l'approuver ou de la refuser."})]})]})}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(ae,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Informations client"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:t.client_name})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Téléphone:"}),e.jsx("p",{className:"font-medium text-slate-900",children:e.jsx("a",{href:`tel:${t.client_phone}`,className:"text-sky-600 hover:text-sky-700",children:t.client_phone})})]})]})]}),e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(A,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Produit"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:t.product_name||"Non spécifié"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Raison:"}),e.jsx("p",{className:"font-medium text-slate-900",children:t.reason})]})]})]})]}),e.jsxs("div",{className:"bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200 mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(re,{className:"w-5 h-5 text-sky-700"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Adresse de livraison"})]}),e.jsx("div",{className:"space-y-2 text-sm",children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(ie,{className:"w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-slate-900",children:t.client_address||"Non fournie"}),e.jsx("p",{className:"text-slate-700",children:t.client_city&&t.client_postal_code?`${t.client_city} ${t.client_postal_code}, ${t.client_country||"Tunisia"}`:"Informations incomplètes"})]})]})})]}),t.video&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(le,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Vidéo du produit"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm text-slate-600",children:[e.jsx(oe,{className:"w-4 h-4"}),e.jsxs("span",{children:["Enregistrée le"," ",new Date(t.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})," ","à"," ",new Date(t.created_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})]})]})]}),e.jsx("video",{src:t.video,controls:!0,className:"w-full max-h-96 rounded-lg border border-slate-200 bg-black"})]}),t.images&&t.images.length>0&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(A,{className:"w-5 h-5 text-emerald-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Images extraites de la vidéo"}),e.jsxs("span",{className:"text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full",children:[t.images.length," images"]})]}),e.jsx("div",{className:"grid grid-cols-4 gap-3",children:t.images.map((s,a)=>e.jsxs("div",{className:"relative group",children:[e.jsx("img",{src:s,alt:`Frame ${a+1}`,className:"w-full aspect-square object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(s,"_blank")}),e.jsxs("span",{className:"absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded",children:[a+1,"/",t.images.length]})]},a))})]}),t.photos&&t.photos.length>0&&e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold text-slate-900 mb-4",children:"Photos du produit"}),e.jsx("div",{className:"grid grid-cols-3 gap-4",children:t.photos.map((s,a)=>e.jsx("img",{src:s,alt:`Photo ${a+1}`,className:"w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(s,"_blank")},a))})]}),j&&e.jsxs("div",{className:"flex gap-3 mt-6 pt-6 border-t border-slate-200",children:[e.jsxs("button",{onClick:()=>f(!0),className:"flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(w,{className:"w-5 h-5"}),"Valider l'échange"]}),e.jsxs("button",{onClick:()=>v(!0),className:"flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(D,{className:"w-5 h-5"}),"Refuser"]})]}),!j&&t.status==="validated"&&e.jsxs("div",{className:"mt-6 space-y-3",children:[e.jsxs("button",{onClick:Z,className:"w-full py-3 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(ne,{className:"w-5 h-5"}),e.jsx("span",{children:"Imprimer le Bordereau"})]}),e.jsx("p",{className:"text-xs text-slate-500 text-center",children:"Document unifié: Page 1 (ALLER) + Page 2 (RETOUR)"})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsx("h3",{className:"text-xl font-bold text-slate-900 mb-4",children:"Messages"}),e.jsx("div",{className:"space-y-4 mb-4 max-h-96 overflow-y-auto",children:k.length===0?e.jsx("p",{className:"text-slate-600 text-center py-8",children:"Aucun message"}):k.map(s=>e.jsxs("div",{className:`p-4 rounded-lg ${s.sender_type==="merchant"?"bg-sky-50 ml-auto max-w-md border border-sky-200":"bg-slate-100 mr-auto max-w-md border border-slate-200"}`,children:[e.jsx("p",{className:"text-sm font-medium text-slate-900 mb-1",children:s.sender_type==="merchant"?"Vous":t.client_name}),e.jsx("p",{className:"text-slate-700",children:s.message}),e.jsx("p",{className:"text-xs text-slate-500 mt-2",children:new Date(s.created_at).toLocaleString("fr-FR")})]},s.id))}),e.jsxs("form",{onSubmit:Q,className:"flex gap-2",children:[e.jsx("input",{type:"text",value:b,onChange:s=>R(s.target.value),placeholder:"Votre message...",className:"flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors",children:e.jsx(de,{className:"w-5 h-5"})})]})]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(ce,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique de livraison du colis"})]}),n.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx($,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600 mb-2",children:"Aucune tentative de livraison enregistrée"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Le client déclare vouloir échanger ce produit"})]}):e.jsxs("div",{className:"space-y-3",children:[t.delivery_accepted_on_attempt&&e.jsx("div",{className:"bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(w,{className:"w-4 h-4 text-emerald-600"}),e.jsxs("span",{className:"text-sm font-semibold text-emerald-900",children:["Colis accepté à la tentative"," ",t.delivery_accepted_on_attempt]})]})}),n.map((s,a)=>e.jsx("div",{className:`rounded-lg p-4 border ${s.status==="successful"?"bg-emerald-50 border-emerald-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`p-2 rounded-full ${s.status==="successful"?"bg-emerald-100":"bg-red-100"}`,children:s.status==="successful"?e.jsx(w,{className:`w-4 h-4 ${s.status==="successful"?"text-emerald-600":"text-red-600"}`}):e.jsx(D,{className:"w-4 h-4 text-red-600"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsxs("span",{className:`font-semibold text-sm ${s.status==="successful"?"text-emerald-900":"text-red-900"}`,children:["Tentative ",s.attempt_number]}),e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${s.status==="successful"?"bg-emerald-100 text-emerald-700 border border-emerald-300":"bg-red-100 text-red-700 border border-red-300"}`,children:s.status==="successful"?"Réussie":"Échouée"})]}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-slate-600 mb-2",children:[e.jsx(me,{className:"w-3 h-3"}),e.jsx("span",{children:new Date(s.attempt_date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})})]}),s.failure_reason&&e.jsxs("div",{className:"text-sm text-red-700 mb-1",children:[e.jsx("span",{className:"font-medium",children:"Raison: "}),s.failure_reason]}),s.notes&&e.jsxs("div",{className:"text-xs text-slate-600",children:[e.jsx("span",{className:"font-medium",children:"Notes: "}),s.notes]})]})]})},s.id)),n.length>0&&e.jsx("div",{className:`rounded-lg p-3 border mt-4 ${n.some(s=>s.status==="successful")?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(xe,{className:`w-4 h-4 mt-0.5 ${n.some(s=>s.status==="successful")?"text-amber-600":"text-red-600"}`}),e.jsx("div",{className:"text-xs",children:n.some(s=>s.status==="successful")?e.jsxs("p",{className:"text-amber-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Le client a accepté le colis après"," ",n.filter(s=>s.status==="failed").length," ","tentative(s) échouée(s), mais demande maintenant un échange."]}):e.jsxs("p",{className:"text-red-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Toutes les tentatives de livraison ont échoué (",n.length," tentative(s)). Le client demande maintenant un échange."]})})]})})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(pe,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique du client"})]}),x.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx($,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600",children:"Premier échange de ce client"})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-2 text-center",children:[e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200",children:[e.jsx("div",{className:"text-2xl font-bold text-slate-900",children:l.total}),e.jsx("div",{className:"text-xs text-slate-600",children:"Échanges"})]}),e.jsxs("div",{className:"bg-emerald-50 rounded-lg p-3 border border-emerald-200",children:[e.jsx("div",{className:"text-2xl font-bold text-emerald-700",children:l.validated}),e.jsx("div",{className:"text-xs text-emerald-700",children:"Validés"})]}),e.jsxs("div",{className:"bg-red-50 rounded-lg p-3 border border-red-200",children:[e.jsx("div",{className:"text-2xl font-bold text-red-700",children:l.rejected}),e.jsx("div",{className:"text-xs text-red-700",children:"Refusés"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-semibold text-slate-700 mb-2",children:"Derniers échanges"}),x.slice(0,3).map(s=>e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("span",{className:"font-mono text-xs text-slate-600",children:s.exchange_code}),e.jsx("span",{className:`text-xs px-2 py-0.5 rounded-full ${s.status==="validated"||s.status==="completed"?"bg-emerald-100 text-emerald-700":s.status==="rejected"?"bg-red-100 text-red-700":"bg-amber-100 text-amber-700"}`,children:N[s.status]})]}),e.jsx("p",{className:"text-xs text-slate-600 truncate",children:s.reason}),e.jsx("p",{className:"text-xs text-slate-500 mt-1",children:new Date(s.created_at).toLocaleDateString("fr-FR")})]},s.id))]}),l.total>0&&e.jsx("div",{className:`rounded-lg p-3 border ${l.validated/l.total>=.7?"bg-emerald-50 border-emerald-200":l.validated/l.total>=.4?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ge,{className:`w-4 h-4 ${l.validated/l.total>=.7?"text-emerald-600":l.validated/l.total>=.4?"text-amber-600":"text-red-600"}`}),e.jsxs("span",{className:"text-sm font-medium",children:["Taux de validation:"," ",Math.round(l.validated/l.total*100),"%"]})]})})]})]})]})]}),V&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-6",children:"Valider l'échange"}),e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"bg-sky-50 border border-sky-200 rounded-xl p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(ue,{className:"w-5 h-5 text-sky-700"}),e.jsx("h4",{className:"font-semibold text-slate-900",children:"Options de paiement"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("label",{className:"flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors",children:[e.jsx("input",{type:"radio",name:"paymentType",value:"free",checked:c==="free",onChange:s=>C(s.target.value),className:"w-4 h-4 text-sky-600"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-slate-900",children:"Échange gratuit"}),e.jsx("div",{className:"text-sm text-slate-600",children:"Pas de frais supplémentaires"})]})]}),e.jsxs("label",{className:"flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors",children:[e.jsx("input",{type:"radio",name:"paymentType",value:"paid",checked:c==="paid",onChange:s=>C(s.target.value),className:"w-4 h-4 text-sky-600 mt-1"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:"font-medium text-slate-900 mb-2",children:"Échange payant"}),c==="paid"&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm text-slate-700",children:"Montant à payer (TND)"}),e.jsx("input",{type:"number",step:"0.01",min:"0",value:S,onChange:s=>H(s.target.value),placeholder:"0.00",className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"}),e.jsx("p",{className:"text-xs text-slate-600",children:"Pour différence de prix ou frais de livraison"})]})]})]})]})]})}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>f(!1),className:"flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors",children:"Annuler"}),e.jsx("button",{onClick:W,className:"flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors",children:"Confirmer la validation"})]})]})})}),F&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-lg w-full",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-4",children:"Refuser l'échange"}),e.jsx("p",{className:"text-slate-600 mb-6",children:"Veuillez expliquer la raison du refus au client"}),e.jsx("textarea",{value:p,onChange:s=>G(s.target.value),placeholder:"Expliquez pourquoi l'échange est refusé...",rows:4,className:"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>v(!1),className:"flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors",children:"Annuler"}),e.jsx("button",{onClick:X,className:"flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors",children:"Confirmer le refus"})]})]})})})]})})}export{es as default};
