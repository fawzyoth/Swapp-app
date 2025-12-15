import{s as d,j as e,S as j}from"./index-D01ZxZsI.js";import{h as Y,u as Z,r as i}from"./react-vendor-CTUriZ5h.js";import{M as N}from"./MerchantLayout-CGdiu9oT.js";import{I as $,s as ee,a as te,b as se}from"./smsService-qtIlF6gc.js";import{A as ae}from"./arrow-left-CxjwE-xR.js";import{A as ie}from"./alert-triangle-1NuODUVJ.js";import{U as re}from"./user-DEx4Ce9L.js";import{P as z}from"./package-ChDCFdB3.js";import{M as le}from"./map-pin-DUtVdt2Q.js";import{H as de}from"./home-9mW_oZwz.js";import{V as oe}from"./video-Cwp6uQ4V.js";import{C as ne}from"./clock-Dhxn45-3.js";import{C as y}from"./check-circle-CyNeZd0p.js";import{X as A}from"./x-circle-D3f66Y07.js";import{P as D}from"./printer-B3I1m1op.js";import{S as ce}from"./send-DlqxrGT5.js";import{T as xe}from"./truck-CgEV9F53.js";import{C as me}from"./calendar-upMk3ayk.js";import{A as pe}from"./alert-circle-_Iqic_ih.js";import{T as he}from"./trending-up-9gPHMyOx.js";import{C as ge}from"./check-Cm21nyZb.js";import{c as be}from"./createLucideIcon-CMjKDoEE.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=be("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);function at(){const{id:r}=Y(),w=Z(),[t,T]=i.useState(null),[fe,ve]=i.useState(null),[je,Ne]=i.useState(!1),[_,E]=i.useState([]),[L,P]=i.useState([]),[M,q]=i.useState([]),[m,U]=i.useState([]),[o,I]=i.useState([]),[b,S]=i.useState(""),[V,u]=i.useState(!1),[F,f]=i.useState(!1),[ye,we]=i.useState(""),[_e,Se]=i.useState(""),[k,O]=i.useState("0"),[x,R]=i.useState("free"),[p,B]=i.useState(""),[H,C]=i.useState(!0);i.useEffect(()=>{g()},[r]);const g=async()=>{try{const{data:s}=await d.from("exchanges").select("*").eq("id",r).maybeSingle();if(!s){C(!1);return}T(s);const[a,c,n,h,K]=await Promise.all([d.from("messages").select("id, sender_type, message, created_at").eq("exchange_id",r).order("created_at",{ascending:!0}),d.from("transporters").select("id, name"),d.from("mini_depots").select("id, name, address"),d.from("exchanges").select("id, exchange_code, reason, status, created_at").eq("client_phone",s.client_phone).neq("id",r).order("created_at",{ascending:!1}).limit(5),d.from("delivery_attempts").select("id, attempt_number, status, scheduled_date, notes, created_at").eq("exchange_id",r).order("attempt_number",{ascending:!0})]);E(a.data||[]),P(c.data||[]),q(n.data||[]),U(h.data||[]),I(K.data||[])}catch(s){console.error("Error fetching data:",s)}finally{C(!1)}},Q=async s=>{if(s.preventDefault(),!!b.trim())try{await d.from("messages").insert({exchange_id:r,sender_type:"merchant",message:b}),t&&r&&await ee(t.client_phone,t.client_name,t.exchange_code,r),S(""),g()}catch(a){console.error("Error sending message:",a)}},W=async()=>{const s=x==="free"?0:parseFloat(k);try{await d.from("exchanges").update({status:"validated",payment_amount:s,payment_status:x==="free"?"free":"pending",updated_at:new Date().toISOString()}).eq("id",r),await d.from("status_history").insert({exchange_id:r,status:"validated"});const a=x==="free"?"Votre échange a été validé. Aucun paiement supplémentaire requis.":`Votre échange a été validé. Montant à payer: ${s.toFixed(2)} TND.`;if(await d.from("messages").insert({exchange_id:r,sender_type:"merchant",message:a}),t){const c=new Date;c.setDate(c.getDate()+3);const n=c.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});await te(t.client_phone,t.client_name,t.exchange_code,n)}u(!1),g()}catch(a){console.error("Error validating exchange:",a)}},G=async()=>{if(!p.trim()){alert("Veuillez fournir une raison pour le refus");return}try{await d.from("exchanges").update({status:"rejected",rejection_reason:p,updated_at:new Date().toISOString()}).eq("id",r),await d.from("status_history").insert({exchange_id:r,status:"rejected"}),await d.from("messages").insert({exchange_id:r,sender_type:"merchant",message:`Votre demande d'échange a été refusée. Raison: ${p}`}),t&&await se(t.client_phone,t.client_name,t.exchange_code,p),f(!1),g()}catch(s){console.error("Error rejecting exchange:",s)}},X=()=>{if(!t)return;const s=M.find(h=>h.id===t.mini_depot_id),a=L.find(h=>h.id===t.transporter_id),c=`https://fawzyoth.github.io/Swapp-app/#/delivery/verify/${t.exchange_code}`,n=window.open("","","height=800,width=600");n&&(n.document.write(`
        <html>
        <head>
          <title>Bordereau ALLER - ${t.exchange_code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 15px;
              max-width: 600px;
              margin: 0 auto;
              color: #000;
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
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .doc-type {
              background: #000;
              color: #fff;
              padding: 5px 15px;
              font-weight: bold;
              font-size: 14px;
            }
            .header-info {
              display: flex;
              justify-content: space-between;
            }
            .exchange-code {
              font-family: 'Courier New', monospace;
              font-size: 20px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .date {
              font-size: 12px;
              color: #333;
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
              font-size: 12px;
              font-weight: bold;
              margin-top: 8px;
            }

            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .info-table th, .info-table td {
              border: 1px solid #000;
              padding: 8px 10px;
              text-align: left;
              font-size: 12px;
            }
            .info-table th {
              background: #f0f0f0;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 10px;
              width: 120px;
            }
            .info-table td {
              font-size: 13px;
            }

            .address-box {
              border: 2px solid #000;
              padding: 12px;
              margin-bottom: 15px;
            }
            .address-box .title {
              font-weight: bold;
              font-size: 11px;
              text-transform: uppercase;
              margin-bottom: 8px;
              padding-bottom: 5px;
              border-bottom: 1px solid #000;
            }
            .address-box .content {
              font-size: 13px;
              line-height: 1.5;
            }

            .payment-box {
              border: 3px solid #000;
              padding: 12px;
              margin-bottom: 15px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .payment-box .label {
              font-weight: bold;
              font-size: 14px;
              text-transform: uppercase;
            }
            .payment-box .amount {
              font-size: 22px;
              font-weight: bold;
              font-family: 'Courier New', monospace;
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

            .signature-area {
              display: flex;
              gap: 15px;
              margin-top: 15px;
            }
            .signature-box {
              flex: 1;
              border: 1px solid #000;
              padding: 10px;
              height: 60px;
            }
            .signature-box .label {
              font-size: 9px;
              text-transform: uppercase;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-top">
              <div class="logo">SWAPP</div>
              <div class="doc-type">BORDEREAU ALLER</div>
            </div>
            <div class="header-info">
              <div class="exchange-code">${t.exchange_code}</div>
              <div class="date">${new Date(t.created_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"})}</div>
            </div>
          </div>

          <div class="codes-section">
            <div class="code-box">
              <div class="title">QR Vérification</div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(c)}" alt="QR Code" width="100" height="100" />
              <div class="code-label">SCAN LIVREUR</div>
            </div>
            <div class="code-box">
              <div class="title">Code-Barres Colis</div>
              <img src="https://barcodeapi.org/api/128/${t.exchange_code.slice(-8)}" alt="Barcode" width="160" height="50" />
              <div class="code-label">${t.exchange_code.slice(-8)}</div>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <th>Client</th>
              <td><strong>${t.client_name}</strong></td>
            </tr>
            <tr>
              <th>Téléphone</th>
              <td>${t.client_phone}</td>
            </tr>
            <tr>
              <th>Produit</th>
              <td>${t.product_name||"Non spécifié"}</td>
            </tr>
            <tr>
              <th>Motif</th>
              <td>${t.reason}</td>
            </tr>
          </table>

          <div class="address-box">
            <div class="title">Adresse de livraison</div>
            <div class="content">
              ${t.client_address||"Non fournie"}<br>
              ${t.client_city||""} ${t.client_postal_code||""}<br>
              ${t.client_country||"Tunisie"}
            </div>
          </div>

          ${s?`
          <table class="info-table">
            <tr>
              <th>Dépôt</th>
              <td>${s.name}</td>
            </tr>
          </table>
          `:""}

          ${a?`
          <table class="info-table">
            <tr>
              <th>Transporteur</th>
              <td>${a.name}</td>
            </tr>
          </table>
          `:""}

          <div class="payment-box">
            <div class="label">Montant à encaisser</div>
            <div class="amount">${t.payment_amount>0?t.payment_amount+" TND":"GRATUIT"}</div>
          </div>

          <div class="notice">
            <div class="title">COLIS CONTENANT LE PRODUIT D'ÉCHANGE</div>
            <div class="text">À livrer au client. Le bordereau RETOUR est inclus pour le retour du produit.</div>
          </div>

          <div class="signature-area">
            <div class="signature-box">
              <div class="label">Signature expéditeur</div>
            </div>
            <div class="signature-box">
              <div class="label">Signature livreur</div>
            </div>
            <div class="signature-box">
              <div class="label">Signature client</div>
            </div>
          </div>

          <div class="footer">
            <div class="brand">SWAPP - Plateforme d'échange</div>
            <div>Statut: ${j[t.status]}</div>
          </div>
        </body>
        </html>
      `),n.document.close(),setTimeout(()=>{n.print()},500))},J=()=>{if(!t)return;const s=`https://fawzyoth.github.io/Swapp-app/#/client/exchange/${t.exchange_code}`,a=window.open("","","height=900,width=600");a&&(a.document.write(`
        <html>
        <head>
          <title>Bordereau RETOUR - ${t.exchange_code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 15px;
              max-width: 600px;
              margin: 0 auto;
              color: #000;
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
              font-size: 24px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .doc-type {
              background: #000;
              color: #fff;
              padding: 5px 15px;
              font-weight: bold;
              font-size: 14px;
            }
            .header-info {
              text-align: center;
            }
            .exchange-code {
              font-family: 'Courier New', monospace;
              font-size: 22px;
              font-weight: bold;
              letter-spacing: 3px;
            }
            .subtitle {
              font-size: 11px;
              margin-top: 5px;
            }

            .codes-section {
              display: flex;
              gap: 15px;
              margin-bottom: 15px;
            }
            .code-box {
              flex: 1;
              border: 2px solid #000;
              padding: 12px;
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
              font-size: 12px;
              font-weight: bold;
              margin-top: 8px;
            }
            .code-box .desc {
              font-size: 9px;
              margin-top: 5px;
              color: #333;
            }

            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .info-table th, .info-table td {
              border: 1px solid #000;
              padding: 8px 10px;
              text-align: left;
              font-size: 12px;
            }
            .info-table th {
              background: #f0f0f0;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 10px;
              width: 100px;
            }

            .instructions-section {
              display: flex;
              gap: 15px;
              margin-bottom: 15px;
            }
            .instructions-box {
              flex: 1;
              border: 2px solid #000;
              padding: 12px;
            }
            .instructions-box .title {
              font-weight: bold;
              font-size: 11px;
              text-transform: uppercase;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #000;
            }
            .instructions-box ol {
              margin-left: 18px;
              font-size: 10px;
              line-height: 1.6;
            }
            .instructions-box ol li {
              margin: 4px 0;
            }
            .instructions-box.ar {
              direction: rtl;
              text-align: right;
            }
            .instructions-box.ar ol {
              margin-left: 0;
              margin-right: 18px;
              list-style-type: arabic-indic;
            }

            .notice {
              border: 3px solid #000;
              padding: 12px;
              text-align: center;
              margin-bottom: 15px;
            }
            .notice .title {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 5px;
              text-transform: uppercase;
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
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-top">
              <div class="logo">SWAPP</div>
              <div class="doc-type">BORDEREAU RETOUR</div>
            </div>
            <div class="header-info">
              <div class="exchange-code">${t.exchange_code}</div>
              <div class="subtitle">Fiche d'échange / بطاقة التبديل</div>
            </div>
          </div>

          <div class="codes-section">
            <div class="code-box">
              <div class="title">QR Client</div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(s)}" alt="QR Code" width="100" height="100" />
              <div class="code-label">SCAN CLIENT</div>
              <div class="desc">Scanner pour initier l'échange</div>
            </div>
            <div class="code-box">
              <div class="title">Code-Barres Retour</div>
              <img src="https://barcodeapi.org/api/128/${t.exchange_code.slice(-8)}" alt="Barcode" width="160" height="50" />
              <div class="code-label">${t.exchange_code.slice(-8)}</div>
              <div class="desc">Scanner lors de la collecte</div>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <th>Produit</th>
              <td>${t.product_name||"Non spécifié"}</td>
            </tr>
            <tr>
              <th>Motif</th>
              <td>${t.reason}</td>
            </tr>
          </table>

          <div class="instructions-section">
            <div class="instructions-box">
              <div class="title">Instructions</div>
              <ol>
                <li>Scannez le QR code avec votre téléphone</li>
                <li>Préparez le produit dans son emballage</li>
                <li>Gardez ce bordereau avec le produit</li>
                <li>Remettez le tout au livreur</li>
              </ol>
            </div>
            <div class="instructions-box ar">
              <div class="title">التعليمات</div>
              <ol>
                <li>امسح رمز QR بهاتفك</li>
                <li>جهّز المنتج في عبوته</li>
                <li>احتفظ بهذه البطاقة مع المنتج</li>
                <li>سلّم كل شيء للمندوب</li>
              </ol>
            </div>
          </div>

          <div class="notice">
            <div class="title">A remettre au livreur</div>
            <div class="text">Ce bordereau doit accompagner le produit retourné</div>
          </div>

          <div class="footer">
            <div class="brand">SWAPP - Plateforme d'échange</div>
            <div>${new Date(t.created_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"})}</div>
          </div>
        </body>
        </html>
      `),a.document.close(),setTimeout(()=>{a.print()},500))};if(H)return e.jsx(N,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})});if(!t)return e.jsx(N,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-2",children:"Échange non trouvé"}),e.jsx("button",{onClick:()=>w("/merchant/exchanges"),className:"px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700",children:"Retour aux échanges"})]})})});const v=t.status==="pending",l={total:m.length,validated:m.filter(s=>s.status==="validated"||s.status==="completed").length,rejected:m.filter(s=>s.status==="rejected").length};return e.jsx(N,{children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("button",{onClick:()=>w("/merchant/exchanges"),className:"flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6",children:[e.jsx(ae,{className:"w-5 h-5"}),e.jsx("span",{className:"font-medium",children:"Retour aux échanges"})]}),e.jsxs("div",{className:"grid lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-1",children:t.exchange_code}),e.jsxs("p",{className:"text-slate-600",children:["Créé le"," ",new Date(t.created_at).toLocaleDateString("fr-FR")]})]}),e.jsx("span",{className:`px-4 py-2 rounded-full text-sm font-medium ${t.status==="pending"?"bg-amber-100 text-amber-800 border border-amber-200":t.status==="validated"?"bg-emerald-100 text-emerald-800 border border-emerald-200":t.status==="rejected"?"bg-red-100 text-red-800 border border-red-200":"bg-blue-100 text-blue-800 border border-blue-200"}`,children:j[t.status]})]}),v&&e.jsx("div",{className:"bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(ie,{className:"w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-amber-900 mb-1",children:"Action requise"}),e.jsx("p",{className:"text-sm text-amber-700",children:"Cette demande attend votre validation. Examinez les détails ci-dessous et décidez de l'approuver ou de la refuser."})]})]})}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(re,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Informations client"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:t.client_name})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Téléphone:"}),e.jsx("p",{className:"font-medium text-slate-900",children:e.jsx("a",{href:`tel:${t.client_phone}`,className:"text-sky-600 hover:text-sky-700",children:t.client_phone})})]})]})]}),e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(z,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Produit"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:t.product_name||"Non spécifié"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Raison:"}),e.jsx("p",{className:"font-medium text-slate-900",children:t.reason})]})]})]})]}),e.jsxs("div",{className:"bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200 mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(le,{className:"w-5 h-5 text-sky-700"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Adresse de livraison"})]}),e.jsx("div",{className:"space-y-2 text-sm",children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(de,{className:"w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-slate-900",children:t.client_address||"Non fournie"}),e.jsx("p",{className:"text-slate-700",children:t.client_city&&t.client_postal_code?`${t.client_city} ${t.client_postal_code}, ${t.client_country||"Tunisia"}`:"Informations incomplètes"})]})]})})]}),t.video&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(oe,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Vidéo du produit"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm text-slate-600",children:[e.jsx(ne,{className:"w-4 h-4"}),e.jsxs("span",{children:["Enregistrée le"," ",new Date(t.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})," ","à"," ",new Date(t.created_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})]})]})]}),e.jsx("video",{src:t.video,controls:!0,className:"w-full max-h-96 rounded-lg border border-slate-200 bg-black"})]}),t.images&&t.images.length>0&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(z,{className:"w-5 h-5 text-emerald-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Images extraites de la vidéo"}),e.jsxs("span",{className:"text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full",children:[t.images.length," images"]})]}),e.jsx("div",{className:"grid grid-cols-4 gap-3",children:t.images.map((s,a)=>e.jsxs("div",{className:"relative group",children:[e.jsx("img",{src:s,alt:`Frame ${a+1}`,className:"w-full aspect-square object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(s,"_blank")}),e.jsxs("span",{className:"absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded",children:[a+1,"/",t.images.length]})]},a))})]}),t.photos&&t.photos.length>0&&e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold text-slate-900 mb-4",children:"Photos du produit"}),e.jsx("div",{className:"grid grid-cols-3 gap-4",children:t.photos.map((s,a)=>e.jsx("img",{src:s,alt:`Photo ${a+1}`,className:"w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(s,"_blank")},a))})]}),v&&e.jsxs("div",{className:"flex gap-3 mt-6 pt-6 border-t border-slate-200",children:[e.jsxs("button",{onClick:()=>u(!0),className:"flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(y,{className:"w-5 h-5"}),"Valider l'échange"]}),e.jsxs("button",{onClick:()=>f(!0),className:"flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(A,{className:"w-5 h-5"}),"Refuser"]})]}),!v&&t.status==="validated"&&e.jsxs("div",{className:"mt-6 space-y-3",children:[e.jsx("p",{className:"text-sm font-medium text-slate-700 text-center",children:"Imprimer les bordereaux"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("button",{onClick:X,className:"py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(D,{className:"w-5 h-5"}),e.jsx("span",{children:"ALLER →"})]}),e.jsxs("button",{onClick:J,className:"py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(D,{className:"w-5 h-5"}),e.jsx("span",{children:"← RETOUR"})]})]}),e.jsx("p",{className:"text-xs text-slate-500 text-center",children:"ALLER: Produit d'échange | RETOUR: Sac vide pour le retour client"})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsx("h3",{className:"text-xl font-bold text-slate-900 mb-4",children:"Messages"}),e.jsx("div",{className:"space-y-4 mb-4 max-h-96 overflow-y-auto",children:_.length===0?e.jsx("p",{className:"text-slate-600 text-center py-8",children:"Aucun message"}):_.map(s=>e.jsxs("div",{className:`p-4 rounded-lg ${s.sender_type==="merchant"?"bg-sky-50 ml-auto max-w-md border border-sky-200":"bg-slate-100 mr-auto max-w-md border border-slate-200"}`,children:[e.jsx("p",{className:"text-sm font-medium text-slate-900 mb-1",children:s.sender_type==="merchant"?"Vous":t.client_name}),e.jsx("p",{className:"text-slate-700",children:s.message}),e.jsx("p",{className:"text-xs text-slate-500 mt-2",children:new Date(s.created_at).toLocaleString("fr-FR")})]},s.id))}),e.jsxs("form",{onSubmit:Q,className:"flex gap-2",children:[e.jsx("input",{type:"text",value:b,onChange:s=>S(s.target.value),placeholder:"Votre message...",className:"flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors",children:e.jsx(ce,{className:"w-5 h-5"})})]})]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(xe,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique de livraison du colis"})]}),o.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx($,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600 mb-2",children:"Aucune tentative de livraison enregistrée"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Le client déclare vouloir échanger ce produit"})]}):e.jsxs("div",{className:"space-y-3",children:[t.delivery_accepted_on_attempt&&e.jsx("div",{className:"bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(y,{className:"w-4 h-4 text-emerald-600"}),e.jsxs("span",{className:"text-sm font-semibold text-emerald-900",children:["Colis accepté à la tentative"," ",t.delivery_accepted_on_attempt]})]})}),o.map((s,a)=>e.jsx("div",{className:`rounded-lg p-4 border ${s.status==="successful"?"bg-emerald-50 border-emerald-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`p-2 rounded-full ${s.status==="successful"?"bg-emerald-100":"bg-red-100"}`,children:s.status==="successful"?e.jsx(y,{className:`w-4 h-4 ${s.status==="successful"?"text-emerald-600":"text-red-600"}`}):e.jsx(A,{className:"w-4 h-4 text-red-600"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsxs("span",{className:`font-semibold text-sm ${s.status==="successful"?"text-emerald-900":"text-red-900"}`,children:["Tentative ",s.attempt_number]}),e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${s.status==="successful"?"bg-emerald-100 text-emerald-700 border border-emerald-300":"bg-red-100 text-red-700 border border-red-300"}`,children:s.status==="successful"?"Réussie":"Échouée"})]}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-slate-600 mb-2",children:[e.jsx(me,{className:"w-3 h-3"}),e.jsx("span",{children:new Date(s.attempt_date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})})]}),s.failure_reason&&e.jsxs("div",{className:"text-sm text-red-700 mb-1",children:[e.jsx("span",{className:"font-medium",children:"Raison: "}),s.failure_reason]}),s.notes&&e.jsxs("div",{className:"text-xs text-slate-600",children:[e.jsx("span",{className:"font-medium",children:"Notes: "}),s.notes]})]})]})},s.id)),o.length>0&&e.jsx("div",{className:`rounded-lg p-3 border mt-4 ${o.some(s=>s.status==="successful")?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(pe,{className:`w-4 h-4 mt-0.5 ${o.some(s=>s.status==="successful")?"text-amber-600":"text-red-600"}`}),e.jsx("div",{className:"text-xs",children:o.some(s=>s.status==="successful")?e.jsxs("p",{className:"text-amber-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Le client a accepté le colis après"," ",o.filter(s=>s.status==="failed").length," ","tentative(s) échouée(s), mais demande maintenant un échange."]}):e.jsxs("p",{className:"text-red-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Toutes les tentatives de livraison ont échoué (",o.length," tentative(s)). Le client demande maintenant un échange."]})})]})})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(he,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique du client"})]}),m.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx($,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600",children:"Premier échange de ce client"})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-2 text-center",children:[e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200",children:[e.jsx("div",{className:"text-2xl font-bold text-slate-900",children:l.total}),e.jsx("div",{className:"text-xs text-slate-600",children:"Échanges"})]}),e.jsxs("div",{className:"bg-emerald-50 rounded-lg p-3 border border-emerald-200",children:[e.jsx("div",{className:"text-2xl font-bold text-emerald-700",children:l.validated}),e.jsx("div",{className:"text-xs text-emerald-700",children:"Validés"})]}),e.jsxs("div",{className:"bg-red-50 rounded-lg p-3 border border-red-200",children:[e.jsx("div",{className:"text-2xl font-bold text-red-700",children:l.rejected}),e.jsx("div",{className:"text-xs text-red-700",children:"Refusés"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-semibold text-slate-700 mb-2",children:"Derniers échanges"}),m.slice(0,3).map(s=>e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("span",{className:"font-mono text-xs text-slate-600",children:s.exchange_code}),e.jsx("span",{className:`text-xs px-2 py-0.5 rounded-full ${s.status==="validated"||s.status==="completed"?"bg-emerald-100 text-emerald-700":s.status==="rejected"?"bg-red-100 text-red-700":"bg-amber-100 text-amber-700"}`,children:j[s.status]})]}),e.jsx("p",{className:"text-xs text-slate-600 truncate",children:s.reason}),e.jsx("p",{className:"text-xs text-slate-500 mt-1",children:new Date(s.created_at).toLocaleDateString("fr-FR")})]},s.id))]}),l.total>0&&e.jsx("div",{className:`rounded-lg p-3 border ${l.validated/l.total>=.7?"bg-emerald-50 border-emerald-200":l.validated/l.total>=.4?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ge,{className:`w-4 h-4 ${l.validated/l.total>=.7?"text-emerald-600":l.validated/l.total>=.4?"text-amber-600":"text-red-600"}`}),e.jsxs("span",{className:"text-sm font-medium",children:["Taux de validation:"," ",Math.round(l.validated/l.total*100),"%"]})]})})]})]})]})]}),V&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-6",children:"Valider l'échange"}),e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"bg-sky-50 border border-sky-200 rounded-xl p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(ue,{className:"w-5 h-5 text-sky-700"}),e.jsx("h4",{className:"font-semibold text-slate-900",children:"Options de paiement"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("label",{className:"flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors",children:[e.jsx("input",{type:"radio",name:"paymentType",value:"free",checked:x==="free",onChange:s=>R(s.target.value),className:"w-4 h-4 text-sky-600"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-slate-900",children:"Échange gratuit"}),e.jsx("div",{className:"text-sm text-slate-600",children:"Pas de frais supplémentaires"})]})]}),e.jsxs("label",{className:"flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors",children:[e.jsx("input",{type:"radio",name:"paymentType",value:"paid",checked:x==="paid",onChange:s=>R(s.target.value),className:"w-4 h-4 text-sky-600 mt-1"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:"font-medium text-slate-900 mb-2",children:"Échange payant"}),x==="paid"&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm text-slate-700",children:"Montant à payer (TND)"}),e.jsx("input",{type:"number",step:"0.01",min:"0",value:k,onChange:s=>O(s.target.value),placeholder:"0.00",className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"}),e.jsx("p",{className:"text-xs text-slate-600",children:"Pour différence de prix ou frais de livraison"})]})]})]})]})]})}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>u(!1),className:"flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors",children:"Annuler"}),e.jsx("button",{onClick:W,className:"flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors",children:"Confirmer la validation"})]})]})})}),F&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-lg w-full",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-4",children:"Refuser l'échange"}),e.jsx("p",{className:"text-slate-600 mb-6",children:"Veuillez expliquer la raison du refus au client"}),e.jsx("textarea",{value:p,onChange:s=>B(s.target.value),placeholder:"Expliquez pourquoi l'échange est refusé...",rows:4,className:"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>f(!1),className:"flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors",children:"Annuler"}),e.jsx("button",{onClick:G,className:"flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors",children:"Confirmer le refus"})]})]})})})]})})}export{at as default};
