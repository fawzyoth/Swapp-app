import{s as k,j as e}from"./index-BtTcjjIS.js";import{u as ee,r as d}from"./react-vendor-CTUriZ5h.js";import{M as F}from"./MerchantLayout-Cg6mqLdb.js";import{i as se,g as te,f as ae,a as le,s as re,D as ie}from"./jaxService-Czfmsyg_.js";import{T as ne}from"./truck-CgEV9F53.js";import{S as U}from"./send-DlqxrGT5.js";import{C as E}from"./clock-Dhxn45-3.js";import{C as de}from"./calendar-upMk3ayk.js";import{C as v}from"./check-circle-CyNeZd0p.js";import{P as q}from"./printer-B3I1m1op.js";import{A as oe}from"./alert-circle-_Iqic_ih.js";import{P as J}from"./package-ChDCFdB3.js";import{R as ce}from"./refresh-cw-EGIEbGnh.js";import{M as me}from"./map-pin-DUtVdt2Q.js";import{F as xe}from"./file-text-B3Ewreww.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./createLucideIcon-CMjKDoEE.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";function Fe(){const X=ee(),[V,S]=d.useState(!0),[A,D]=d.useState(!1),[y,T]=d.useState([]),[l,b]=d.useState([]),[a,H]=d.useState(null),[$,P]=d.useState(""),[C,m]=d.useState(""),[R,B]=d.useState(null),[j,G]=d.useState(!1),[x,I]=d.useState([]),[g,z]=d.useState("pickup"),[pe,he]=d.useState(null),i=se()||j,W=te(),L=ae(W);d.useEffect(()=>{M()},[]);const M=async()=>{try{const{data:{session:s}}=await k.auth.getSession();if(!s){X("/merchant/login");return}const{data:t}=await k.from("merchants").select("*").eq("email",s.user.email).maybeSingle();if(!t){m("Marchand non trouve"),S(!1);return}H(t);const{data:n,error:p}=await k.from("exchanges").select("*").eq("merchant_id",t.id).in("status",["approved","validated","ready_for_pickup","in_transit"]).order("created_at",{ascending:!1});if(p)throw p;const o=(n||[]).filter(r=>r.jax_ean).map(r=>({id:r.id,exchange_code:r.exchange_code,client_name:r.client_name,client_address:r.client_address||"",client_city:r.client_city||"",product_name:r.product_name||"",status:r.status,jax_ean:r.jax_ean,jax_pickup_scheduled:!1,created_at:r.created_at,payment_amount:r.payment_amount||0}));T(o);const u=localStorage.getItem(`pickup_history_${t.id}`);if(u)try{I(JSON.parse(u))}catch(r){console.error("Error parsing pickup history:",r)}}catch(s){console.error("Error loading data:",s),m("Erreur lors du chargement des donnees")}finally{S(!1)}},c=y.filter(s=>s.jax_ean&&!s.jax_pickup_scheduled),_=y.filter(s=>s.jax_ean&&s.jax_pickup_scheduled),Y=s=>{b(t=>t.includes(s)?t.filter(n=>n!==s):[...t,s])},K=()=>{const s=c.map(t=>t.jax_ean).filter(t=>t!==null);b(s)},Q=()=>{b([])},h=s=>s.toFixed(3)+" TND",w=s=>{const t=window.open("","","height=800,width=600");if(!t)return;const n=new Date,p=n.toLocaleDateString("fr-TN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});t.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bordereau de Sortie - ${s.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #000;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .header h2 {
            font-size: 18px;
            color: #333;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .info-block h3 {
            font-size: 12px;
            color: #666;
            margin-bottom: 3px;
          }
          .info-block p {
            font-size: 14px;
            font-weight: bold;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
            padding: 15px;
            background: #000;
            color: #fff;
            border-radius: 5px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-item .number {
            font-size: 28px;
            font-weight: bold;
          }
          .summary-item .label {
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }
          th {
            background: #000;
            color: #fff;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background: #f9f9f9;
          }
          .ean-code {
            font-family: monospace;
            font-weight: bold;
            font-size: 12px;
          }
          .amount {
            text-align: right;
            font-weight: bold;
          }
          .total-row {
            background: #f0f0f0 !important;
            font-weight: bold;
          }
          .total-row td {
            font-size: 13px;
          }
          .footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
          }
          .signature-box {
            width: 45%;
            border: 1px solid #000;
            padding: 15px;
            text-align: center;
          }
          .signature-box h4 {
            font-size: 12px;
            margin-bottom: 40px;
          }
          .signature-line {
            border-top: 1px solid #000;
            margin-top: 30px;
            padding-top: 5px;
            font-size: 10px;
          }
          .jax-logo {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
          }
          @media print {
            body { padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BORDEREAU DE SORTIE EXPEDITEUR</h1>
          <h2>BON DE RAMASSAGE JAX DELIVERY</h2>
        </div>

        <div class="info-section">
          <div class="info-block">
            <h3>EXPEDITEUR</h3>
            <p>${(a==null?void 0:a.business_name)||(a==null?void 0:a.name)||"N/A"}</p>
            <p style="font-weight: normal; font-size: 12px;">${(a==null?void 0:a.business_address)||""}</p>
            <p style="font-weight: normal; font-size: 12px;">${(a==null?void 0:a.phone)||""}</p>
          </div>
          <div class="info-block" style="text-align: right;">
            <h3>DATE DE RAMASSAGE</h3>
            <p>${p}</p>
            <h3 style="margin-top: 10px;">N° BON</h3>
            <p>${s.id}</p>
          </div>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="number">${s.colis.length}</div>
            <div class="label">COLIS TOTAL</div>
          </div>
          <div class="summary-item">
            <div class="number">${s.totalAmount.toFixed(3)}</div>
            <div class="label">MONTANT TOTAL (TND)</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">#</th>
              <th>CODE EAN JAX</th>
              <th>REFERENCE</th>
              <th>DESTINATAIRE</th>
              <th>VILLE</th>
              <th>PRODUIT</th>
              <th style="text-align: right;">MONTANT</th>
            </tr>
          </thead>
          <tbody>
            ${s.colis.map((o,u)=>`
              <tr>
                <td>${u+1}</td>
                <td class="ean-code">${o.jax_ean}</td>
                <td>${o.exchange_code}</td>
                <td>${o.client_name}</td>
                <td>${o.client_city||"-"}</td>
                <td>${o.product_name||"-"}</td>
                <td class="amount">${o.payment_amount.toFixed(3)} TND</td>
              </tr>
            `).join("")}
            <tr class="total-row">
              <td colspan="6" style="text-align: right;">TOTAL:</td>
              <td class="amount">${s.totalAmount.toFixed(3)} TND</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <div class="signature-box">
            <h4>SIGNATURE EXPEDITEUR</h4>
            <div class="signature-line">Date: ___/___/______</div>
          </div>
          <div class="signature-box">
            <h4>SIGNATURE LIVREUR JAX</h4>
            <div class="signature-line">Date: ___/___/______</div>
          </div>
        </div>

        <div class="jax-logo">
          <p>Partenaire logistique: JAX DELIVERY</p>
          <p style="font-size: 10px; margin-top: 5px;">Document généré par SWAPP - ${n.toISOString()}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        <\/script>
      </body>
      </html>
    `),t.document.close()},Z=async()=>{if(l.length===0){m("Veuillez selectionner au moins un colis");return}if(!i){m("Les ramassages ne sont disponibles que le Mercredi et Dimanche");return}if(!(a!=null&&a.business_address)){m("Veuillez configurer votre adresse dans Parametres > Marque");return}D(!0),m(""),P("");try{const s=le(a.business_city||"Tunis"),t=await re(ie,l,a.business_address,s,`Ramassage SWAPP - ${l.length} colis`);if(t.success){const n=y.filter(f=>f.jax_ean&&l.includes(f.jax_ean)),p=n.reduce((f,N)=>f+(N.payment_amount||0),0),o=`RAM-${Date.now().toString(36).toUpperCase()}`,u={id:o,date:new Date().toISOString(),colis:n,totalAmount:p};B(u);const O=[{id:o,date:new Date().toISOString(),colisCount:n.length,totalAmount:p,colis:n},...x];I(O),a!=null&&a.id&&localStorage.setItem(`pickup_history_${a.id}`,JSON.stringify(O)),P(`Ramassage programme avec succes pour ${l.length} colis (${h(p)})! Vous pouvez imprimer le bordereau de sortie.`),b([]),T(f=>f.filter(N=>!N.jax_ean||!l.includes(N.jax_ean))),w(u)}else m(t.error||"Erreur lors de la programmation du ramassage")}catch(s){console.error("Pickup scheduling error:",s),m("Erreur lors de la programmation du ramassage")}finally{D(!1)}};return V?e.jsx(F,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})}):e.jsx(F,{children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("div",{className:"mb-6 flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-2xl font-bold text-slate-900 flex items-center gap-3",children:[e.jsx(ne,{className:"w-7 h-7 text-sky-600"}),"Gestion des Ramassages"]}),e.jsx("p",{className:"text-slate-600 mt-1",children:"Programmez le ramassage de vos colis par JAX Delivery"})]}),e.jsx("button",{onClick:()=>G(!j),className:`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${j?"bg-orange-100 text-orange-700 border border-orange-300":"bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"}`,children:j?"Mode Test: ON":"Mode Test"})]}),e.jsxs("div",{className:"mb-6 flex bg-slate-100 rounded-xl p-1",children:[e.jsxs("button",{onClick:()=>z("pickup"),className:`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${g==="pickup"?"bg-white text-sky-600 shadow-sm":"text-slate-600 hover:text-slate-900"}`,children:[e.jsx(U,{className:"w-4 h-4"}),"Demande de ramassage",c.length>0&&e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${g==="pickup"?"bg-sky-100 text-sky-700":"bg-slate-200 text-slate-600"}`,children:c.length})]}),e.jsxs("button",{onClick:()=>z("history"),className:`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${g==="history"?"bg-white text-sky-600 shadow-sm":"text-slate-600 hover:text-slate-900"}`,children:[e.jsx(E,{className:"w-4 h-4"}),"Historique",x.length>0&&e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${g==="history"?"bg-sky-100 text-sky-700":"bg-slate-200 text-slate-600"}`,children:x.length})]})]}),g==="pickup"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:`mb-6 p-4 rounded-xl border-2 ${i?"bg-emerald-50 border-emerald-200":"bg-amber-50 border-amber-200"}`,children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:`p-3 rounded-full ${i?"bg-emerald-100":"bg-amber-100"}`,children:e.jsx(de,{className:`w-6 h-6 ${i?"text-emerald-600":"text-amber-600"}`})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:`font-semibold ${i?"text-emerald-900":"text-amber-900"}`,children:i?"Aujourd'hui est un jour de ramassage!":"Prochain jour de ramassage"}),e.jsx("p",{className:`text-sm ${i?"text-emerald-700":"text-amber-700"}`,children:i?"Vous pouvez programmer le ramassage de vos colis maintenant.":"Les ramassages sont disponibles uniquement le Mercredi et Dimanche."}),e.jsxs("div",{className:`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${i?"bg-emerald-200 text-emerald-800":"bg-amber-200 text-amber-800"}`,children:[e.jsx(E,{className:"w-4 h-4"}),L]})]})]})}),$&&e.jsxs("div",{className:"mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(v,{className:"w-5 h-5 text-emerald-600"}),e.jsx("span",{className:"text-emerald-800 flex-1",children:$})]}),R&&e.jsx("div",{className:"mt-3 flex gap-2",children:e.jsxs("button",{onClick:()=>w(R),className:"flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium",children:[e.jsx(q,{className:"w-4 h-4"}),"Reimprimer le Bordereau de Sortie"]})})]}),C&&e.jsxs("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3",children:[e.jsx(oe,{className:"w-5 h-5 text-red-600"}),e.jsx("span",{className:"text-red-800",children:C})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-6",children:[e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-amber-100 rounded-lg",children:e.jsx(J,{className:"w-5 h-5 text-amber-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:c.length}),e.jsx("p",{className:"text-sm text-slate-600",children:"En attente de ramassage"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-lg",children:e.jsx(v,{className:"w-5 h-5 text-emerald-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:_.length}),e.jsx("p",{className:"text-sm text-slate-600",children:"Ramassage programme"})]})]})})]}),e.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden mb-6",children:[e.jsxs("div",{className:"px-6 py-4 border-b border-slate-200 flex items-center justify-between",children:[e.jsx("h2",{className:"font-semibold text-slate-900",children:"Colis en attente de ramassage"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:M,className:"p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors",title:"Actualiser",children:e.jsx(ce,{className:"w-4 h-4"})}),c.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:K,className:"text-sm text-sky-600 hover:text-sky-700",children:"Tout selectionner"}),e.jsx("span",{className:"text-slate-300",children:"|"}),e.jsx("button",{onClick:Q,className:"text-sm text-slate-500 hover:text-slate-700",children:"Deselectionner"})]})]})]}),c.length===0?e.jsxs("div",{className:"p-8 text-center",children:[e.jsx(J,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-slate-500",children:"Aucun colis en attente de ramassage"}),e.jsx("p",{className:"text-sm text-slate-400 mt-1",children:"Les colis apparaissent ici apres l'impression du bordereau"})]}):e.jsx("div",{className:"divide-y divide-slate-100",children:c.map(s=>e.jsxs("div",{className:`p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${s.jax_ean&&l.includes(s.jax_ean)?"bg-sky-50":""}`,onClick:()=>s.jax_ean&&Y(s.jax_ean),children:[e.jsx("div",{className:`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${s.jax_ean&&l.includes(s.jax_ean)?"bg-sky-600 border-sky-600":"border-slate-300"}`,children:s.jax_ean&&l.includes(s.jax_ean)&&e.jsx(v,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-mono text-sm font-medium text-sky-600",children:s.jax_ean}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsx("span",{className:"text-sm text-slate-600",children:s.exchange_code})]}),e.jsx("p",{className:"text-sm text-slate-900 font-medium truncate",children:s.client_name}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-slate-500",children:[e.jsx(me,{className:"w-3 h-3"}),s.client_city||s.client_address]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-sm font-semibold text-emerald-600",children:h(s.payment_amount)}),e.jsx("p",{className:"text-xs text-slate-500 truncate max-w-[150px]",children:s.product_name})]})]},s.id))}),c.length>0&&e.jsxs("div",{className:"px-6 py-4 bg-slate-50 border-t border-slate-200",children:[l.length>0&&e.jsxs("div",{className:"mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between",children:[e.jsxs("span",{className:"text-sm text-emerald-700",children:[l.length," colis sélectionné(s)"]}),e.jsx("span",{className:"text-lg font-bold text-emerald-700",children:h(c.filter(s=>s.jax_ean&&l.includes(s.jax_ean)).reduce((s,t)=>s+t.payment_amount,0))})]}),e.jsx("button",{onClick:Z,disabled:!i||l.length===0||A,className:`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${i&&l.length>0?"bg-emerald-600 text-white hover:bg-emerald-700":"bg-slate-200 text-slate-400 cursor-not-allowed"}`,children:A?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),"Programmation en cours..."]}):e.jsxs(e.Fragment,{children:[e.jsx(U,{className:"w-5 h-5"}),i?`Programmer le ramassage (${l.length} colis)`:`Disponible le ${L}`]})}),!i&&e.jsx("p",{className:"text-center text-sm text-slate-500 mt-2",children:"Les ramassages sont uniquement disponibles le Mercredi et Dimanche"})]})]}),_.length>0&&e.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden",children:[e.jsx("div",{className:"px-6 py-4 border-b border-slate-200",children:e.jsx("h2",{className:"font-semibold text-slate-900",children:"Ramassages programmes"})}),e.jsx("div",{className:"divide-y divide-slate-100",children:_.map(s=>e.jsxs("div",{className:"p-4 flex items-center gap-4",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-full",children:e.jsx(v,{className:"w-4 h-4 text-emerald-600"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-mono text-sm font-medium text-emerald-600",children:s.jax_ean}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsx("span",{className:"text-sm text-slate-600",children:s.exchange_code})]}),e.jsx("p",{className:"text-sm text-slate-900",children:s.client_name})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("span",{className:"text-sm font-semibold text-emerald-600",children:h(s.payment_amount)}),e.jsx("span",{className:"ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full",children:"Programme"})]})]},s.id))})]})]}),g==="history"&&e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden",children:x.length===0?e.jsxs("div",{className:"p-12 text-center",children:[e.jsx(E,{className:"w-16 h-16 text-slate-300 mx-auto mb-4"}),e.jsx("p",{className:"text-lg text-slate-500 font-medium",children:"Aucun historique de ramassage"}),e.jsx("p",{className:"text-sm text-slate-400 mt-2",children:"Les ramassages programmés apparaîtront ici"})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"divide-y divide-slate-100",children:x.map(s=>e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-slate-100 rounded-full",children:e.jsx(xe,{className:"w-5 h-5 text-slate-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-mono text-sm font-bold text-slate-800",children:s.id}),e.jsx("p",{className:"text-xs text-slate-500",children:new Date(s.date).toLocaleDateString("fr-TN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-lg font-bold text-emerald-600",children:h(s.totalAmount)}),e.jsxs("p",{className:"text-xs text-slate-500",children:[s.colisCount," colis"]})]}),e.jsx("button",{onClick:()=>w({...s,totalAmount:s.totalAmount}),className:"p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors",title:"Imprimer le bordereau",children:e.jsx(q,{className:"w-4 h-4"})})]})]}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2",children:s.colis.map((t,n)=>e.jsxs("div",{className:"flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs",children:[e.jsxs("div",{className:"flex items-center gap-2 min-w-0",children:[e.jsx("span",{className:"w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 flex-shrink-0",children:n+1}),e.jsx("span",{className:"text-slate-700 truncate",children:t.client_name})]}),e.jsx("span",{className:"font-semibold text-emerald-600 ml-2 flex-shrink-0",children:h(t.payment_amount)})]},t.id))})]},s.id))}),e.jsx("div",{className:"px-6 py-4 bg-slate-50 border-t border-slate-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{className:"text-sm text-slate-600",children:["Total:"," ",x.reduce((s,t)=>s+t.colisCount,0)," ","colis",e.jsx("span",{className:"text-slate-400 mx-2",children:"•"}),x.length," ramassage(s)"]}),e.jsx("span",{className:"text-xl font-bold text-slate-900",children:h(x.reduce((s,t)=>s+t.totalAmount,0))})]})})]})})]})})}export{Fe as default};
