import{s as E,j as e}from"./index-tgDUDyOv.js";import{u as se,r as n}from"./react-vendor-CTUriZ5h.js";import{M as q}from"./MerchantLayout-t80rec16.js";import{i as te,g as ae,f as le,a as re,s as ie,D as ne}from"./jaxService-Czfmsyg_.js";import{T as de}from"./truck-CgEV9F53.js";import{C as oe}from"./calendar-upMk3ayk.js";import{C as v}from"./clock-Dhxn45-3.js";import{C as y}from"./check-circle-CyNeZd0p.js";import{P as U}from"./printer-B3I1m1op.js";import{A as ce}from"./alert-circle-_Iqic_ih.js";import{P as J}from"./package-ChDCFdB3.js";import{R as me}from"./refresh-cw-EGIEbGnh.js";import{M as xe}from"./map-pin-DUtVdt2Q.js";import{S as he}from"./send-DlqxrGT5.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./createLucideIcon-CMjKDoEE.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";function ze(){const X=se(),[H,S]=n.useState(!0),[D,A]=n.useState(!1),[w,T]=n.useState([]),[l,b]=n.useState([]),[a,V]=n.useState(null),[$,P]=n.useState(""),[C,x]=n.useState(""),[R,B]=n.useState(null),[j,G]=n.useState(!1),[m,I]=n.useState([]),[W,L]=n.useState(!1),[d,M]=n.useState(null),i=te()||j,Y=ae(),z=le(Y);n.useEffect(()=>{O()},[]);const O=async()=>{try{const{data:{session:s}}=await E.auth.getSession();if(!s){X("/merchant/login");return}const{data:t}=await E.from("merchants").select("*").eq("email",s.user.email).maybeSingle();if(!t){x("Marchand non trouve"),S(!1);return}V(t);const{data:o,error:p}=await E.from("exchanges").select("*").eq("merchant_id",t.id).in("status",["approved","validated","ready_for_pickup","in_transit"]).order("created_at",{ascending:!1});if(p)throw p;const c=(o||[]).filter(r=>r.jax_ean).map(r=>({id:r.id,exchange_code:r.exchange_code,client_name:r.client_name,client_address:r.client_address||"",client_city:r.client_city||"",product_name:r.product_name||"",status:r.status,jax_ean:r.jax_ean,jax_pickup_scheduled:!1,created_at:r.created_at,payment_amount:r.payment_amount||0}));T(c);const g=localStorage.getItem(`pickup_history_${t.id}`);if(g)try{I(JSON.parse(g))}catch(r){console.error("Error parsing pickup history:",r)}}catch(s){console.error("Error loading data:",s),x("Erreur lors du chargement des donnees")}finally{S(!1)}},u=w.filter(s=>s.jax_ean&&!s.jax_pickup_scheduled),_=w.filter(s=>s.jax_ean&&s.jax_pickup_scheduled),K=s=>{b(t=>t.includes(s)?t.filter(o=>o!==s):[...t,s])},Q=()=>{const s=u.map(t=>t.jax_ean).filter(t=>t!==null);b(s)},Z=()=>{b([])},h=s=>s.toFixed(3)+" TND",k=s=>{const t=window.open("","","height=800,width=600");if(!t)return;const o=new Date,p=o.toLocaleDateString("fr-TN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});t.document.write(`
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
            ${s.colis.map((c,g)=>`
              <tr>
                <td>${g+1}</td>
                <td class="ean-code">${c.jax_ean}</td>
                <td>${c.exchange_code}</td>
                <td>${c.client_name}</td>
                <td>${c.client_city||"-"}</td>
                <td>${c.product_name||"-"}</td>
                <td class="amount">${c.payment_amount.toFixed(3)} TND</td>
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
          <p style="font-size: 10px; margin-top: 5px;">Document généré par SWAPP - ${o.toISOString()}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        <\/script>
      </body>
      </html>
    `),t.document.close()},ee=async()=>{if(l.length===0){x("Veuillez selectionner au moins un colis");return}if(!i){x("Les ramassages ne sont disponibles que le Mercredi et Dimanche");return}if(!(a!=null&&a.business_address)){x("Veuillez configurer votre adresse dans Parametres > Marque");return}A(!0),x(""),P("");try{const s=re(a.business_city||"Tunis"),t=await ie(ne,l,a.business_address,s,`Ramassage SWAPP - ${l.length} colis`);if(t.success){const o=w.filter(f=>f.jax_ean&&l.includes(f.jax_ean)),p=o.reduce((f,N)=>f+(N.payment_amount||0),0),c=`RAM-${Date.now().toString(36).toUpperCase()}`,g={id:c,date:new Date().toISOString(),colis:o,totalAmount:p};B(g);const F=[{id:c,date:new Date().toISOString(),colisCount:o.length,totalAmount:p,colis:o},...m];I(F),a!=null&&a.id&&localStorage.setItem(`pickup_history_${a.id}`,JSON.stringify(F)),P(`Ramassage programme avec succes pour ${l.length} colis (${h(p)})! Vous pouvez imprimer le bordereau de sortie.`),b([]),T(f=>f.filter(N=>!N.jax_ean||!l.includes(N.jax_ean))),k(g)}else x(t.error||"Erreur lors de la programmation du ramassage")}catch(s){console.error("Pickup scheduling error:",s),x("Erreur lors de la programmation du ramassage")}finally{A(!1)}};return H?e.jsx(q,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})}):e.jsxs(q,{children:[e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("div",{className:"mb-6 flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-2xl font-bold text-slate-900 flex items-center gap-3",children:[e.jsx(de,{className:"w-7 h-7 text-sky-600"}),"Gestion des Ramassages"]}),e.jsx("p",{className:"text-slate-600 mt-1",children:"Programmez le ramassage de vos colis par JAX Delivery"})]}),e.jsx("button",{onClick:()=>G(!j),className:`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${j?"bg-orange-100 text-orange-700 border border-orange-300":"bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"}`,children:j?"Mode Test: ON":"Mode Test"})]}),e.jsx("div",{className:`mb-6 p-4 rounded-xl border-2 ${i?"bg-emerald-50 border-emerald-200":"bg-amber-50 border-amber-200"}`,children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:`p-3 rounded-full ${i?"bg-emerald-100":"bg-amber-100"}`,children:e.jsx(oe,{className:`w-6 h-6 ${i?"text-emerald-600":"text-amber-600"}`})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:`font-semibold ${i?"text-emerald-900":"text-amber-900"}`,children:i?"Aujourd'hui est un jour de ramassage!":"Prochain jour de ramassage"}),e.jsx("p",{className:`text-sm ${i?"text-emerald-700":"text-amber-700"}`,children:i?"Vous pouvez programmer le ramassage de vos colis maintenant.":"Les ramassages sont disponibles uniquement le Mercredi et Dimanche."}),e.jsxs("div",{className:`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${i?"bg-emerald-200 text-emerald-800":"bg-amber-200 text-amber-800"}`,children:[e.jsx(v,{className:"w-4 h-4"}),z]})]})]})}),$&&e.jsxs("div",{className:"mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(y,{className:"w-5 h-5 text-emerald-600"}),e.jsx("span",{className:"text-emerald-800 flex-1",children:$})]}),R&&e.jsx("div",{className:"mt-3 flex gap-2",children:e.jsxs("button",{onClick:()=>k(R),className:"flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium",children:[e.jsx(U,{className:"w-4 h-4"}),"Reimprimer le Bordereau de Sortie"]})})]}),C&&e.jsxs("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3",children:[e.jsx(ce,{className:"w-5 h-5 text-red-600"}),e.jsx("span",{className:"text-red-800",children:C})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-6",children:[e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-amber-100 rounded-lg",children:e.jsx(J,{className:"w-5 h-5 text-amber-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:u.length}),e.jsx("p",{className:"text-sm text-slate-600",children:"En attente de ramassage"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-lg",children:e.jsx(y,{className:"w-5 h-5 text-emerald-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:_.length}),e.jsx("p",{className:"text-sm text-slate-600",children:"Ramassage programme"})]})]})})]}),e.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden mb-6",children:[e.jsxs("div",{className:"px-6 py-4 border-b border-slate-200 flex items-center justify-between",children:[e.jsx("h2",{className:"font-semibold text-slate-900",children:"Colis en attente de ramassage"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:O,className:"p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors",title:"Actualiser",children:e.jsx(me,{className:"w-4 h-4"})}),u.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:Q,className:"text-sm text-sky-600 hover:text-sky-700",children:"Tout selectionner"}),e.jsx("span",{className:"text-slate-300",children:"|"}),e.jsx("button",{onClick:Z,className:"text-sm text-slate-500 hover:text-slate-700",children:"Deselectionner"})]})]})]}),u.length===0?e.jsxs("div",{className:"p-8 text-center",children:[e.jsx(J,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-slate-500",children:"Aucun colis en attente de ramassage"}),e.jsx("p",{className:"text-sm text-slate-400 mt-1",children:"Les colis apparaissent ici apres l'impression du bordereau"})]}):e.jsx("div",{className:"divide-y divide-slate-100",children:u.map(s=>e.jsxs("div",{className:`p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${s.jax_ean&&l.includes(s.jax_ean)?"bg-sky-50":""}`,onClick:()=>s.jax_ean&&K(s.jax_ean),children:[e.jsx("div",{className:`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${s.jax_ean&&l.includes(s.jax_ean)?"bg-sky-600 border-sky-600":"border-slate-300"}`,children:s.jax_ean&&l.includes(s.jax_ean)&&e.jsx(y,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-mono text-sm font-medium text-sky-600",children:s.jax_ean}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsx("span",{className:"text-sm text-slate-600",children:s.exchange_code})]}),e.jsx("p",{className:"text-sm text-slate-900 font-medium truncate",children:s.client_name}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-slate-500",children:[e.jsx(xe,{className:"w-3 h-3"}),s.client_city||s.client_address]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-sm font-semibold text-emerald-600",children:h(s.payment_amount)}),e.jsx("p",{className:"text-xs text-slate-500 truncate max-w-[150px]",children:s.product_name})]})]},s.id))}),u.length>0&&e.jsxs("div",{className:"px-6 py-4 bg-slate-50 border-t border-slate-200",children:[l.length>0&&e.jsxs("div",{className:"mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between",children:[e.jsxs("span",{className:"text-sm text-emerald-700",children:[l.length," colis sélectionné(s)"]}),e.jsx("span",{className:"text-lg font-bold text-emerald-700",children:h(u.filter(s=>s.jax_ean&&l.includes(s.jax_ean)).reduce((s,t)=>s+t.payment_amount,0))})]}),e.jsx("button",{onClick:ee,disabled:!i||l.length===0||D,className:`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${i&&l.length>0?"bg-emerald-600 text-white hover:bg-emerald-700":"bg-slate-200 text-slate-400 cursor-not-allowed"}`,children:D?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),"Programmation en cours..."]}):e.jsxs(e.Fragment,{children:[e.jsx(he,{className:"w-5 h-5"}),i?`Programmer le ramassage (${l.length} colis)`:`Disponible le ${z}`]})}),!i&&e.jsx("p",{className:"text-center text-sm text-slate-500 mt-2",children:"Les ramassages sont uniquement disponibles le Mercredi et Dimanche"})]})]}),_.length>0&&e.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden",children:[e.jsx("div",{className:"px-6 py-4 border-b border-slate-200",children:e.jsx("h2",{className:"font-semibold text-slate-900",children:"Ramassages programmes"})}),e.jsx("div",{className:"divide-y divide-slate-100",children:_.map(s=>e.jsxs("div",{className:"p-4 flex items-center gap-4",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-full",children:e.jsx(y,{className:"w-4 h-4 text-emerald-600"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-mono text-sm font-medium text-emerald-600",children:s.jax_ean}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsx("span",{className:"text-sm text-slate-600",children:s.exchange_code})]}),e.jsx("p",{className:"text-sm text-slate-900",children:s.client_name})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("span",{className:"text-sm font-semibold text-emerald-600",children:h(s.payment_amount)}),e.jsx("span",{className:"ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full",children:"Programme"})]})]},s.id))})]}),e.jsx("div",{className:"mt-6 flex justify-center",children:e.jsxs("button",{onClick:()=>L(!0),className:"flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors",children:[e.jsx(v,{className:"w-5 h-5"}),e.jsx("span",{className:"font-medium",children:"Historique des Ramassages"}),m.length>0&&e.jsx("span",{className:"ml-1 px-2 py-0.5 bg-slate-600 text-white text-xs rounded-full",children:m.length})]})})]}),W&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl",children:[e.jsxs("div",{className:"px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0",children:[e.jsxs("h2",{className:"text-lg font-bold text-slate-900 flex items-center gap-2",children:[e.jsx(v,{className:"w-5 h-5 text-slate-600"}),"Historique des Ramassages"]}),e.jsx("button",{onClick:()=>{L(!1),M(null)},className:"p-2 hover:bg-slate-100 rounded-lg transition-colors",children:e.jsx("svg",{className:"w-5 h-5 text-slate-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"flex-1 overflow-hidden flex",children:[e.jsx("div",{className:`${d?"w-1/2 border-r border-slate-200":"w-full"} overflow-y-auto`,children:m.length===0?e.jsxs("div",{className:"p-8 text-center",children:[e.jsx(v,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-slate-500",children:"Aucun historique"}),e.jsx("p",{className:"text-sm text-slate-400 mt-1",children:"Les ramassages apparaîtront ici"})]}):e.jsx("div",{className:"divide-y divide-slate-100",children:m.map(s=>e.jsx("div",{onClick:()=>M(s),className:`p-4 cursor-pointer transition-colors ${(d==null?void 0:d.id)===s.id?"bg-sky-50 border-l-4 border-sky-500":"hover:bg-slate-50"}`,children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-mono text-sm font-medium text-slate-800",children:s.id}),e.jsx("p",{className:"text-xs text-slate-500 mt-0.5",children:new Date(s.date).toLocaleDateString("fr-TN",{day:"numeric",month:"short",year:"numeric"})})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"font-bold text-emerald-600",children:h(s.totalAmount)}),e.jsxs("p",{className:"text-xs text-slate-500",children:[s.colisCount," colis"]})]})]})},s.id))})}),d&&e.jsx("div",{className:"w-1/2 overflow-y-auto bg-slate-50",children:e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"bg-white rounded-xl p-4 mb-4 shadow-sm",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("span",{className:"font-mono text-sm font-bold text-slate-800",children:d.id}),e.jsxs("button",{onClick:()=>k({...d,totalAmount:d.totalAmount}),className:"flex items-center gap-1 px-3 py-1.5 bg-sky-100 text-sky-700 rounded-lg text-xs font-medium hover:bg-sky-200 transition-colors",children:[e.jsx(U,{className:"w-3 h-3"}),"Imprimer"]})]}),e.jsx("p",{className:"text-xs text-slate-500",children:new Date(d.date).toLocaleDateString("fr-TN",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}),e.jsxs("div",{className:"mt-3 pt-3 border-t border-slate-100 flex items-center justify-between",children:[e.jsx("span",{className:"text-sm text-slate-600",children:"Total"}),e.jsx("span",{className:"text-xl font-bold text-emerald-600",children:h(d.totalAmount)})]})]}),e.jsxs("h4",{className:"text-xs font-semibold text-slate-500 uppercase mb-2",children:["Détail des colis (",d.colisCount,")"]}),e.jsx("div",{className:"space-y-2",children:d.colis.map((s,t)=>e.jsx("div",{className:"bg-white rounded-lg p-3 shadow-sm",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-600",children:t+1}),e.jsxs("div",{children:[e.jsx("p",{className:"font-mono text-xs text-slate-600",children:s.jax_ean}),e.jsx("p",{className:"text-sm font-medium text-slate-800",children:s.client_name})]})]}),e.jsx("span",{className:"font-semibold text-emerald-600",children:h(s.payment_amount)})]})},s.id))})]})})]}),m.length>0&&e.jsx("div",{className:"px-6 py-4 border-t border-slate-200 bg-slate-50 flex-shrink-0",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{className:"text-sm text-slate-600",children:["Total:"," ",m.reduce((s,t)=>s+t.colisCount,0)," ","colis",e.jsx("span",{className:"text-slate-400 mx-2",children:"•"}),m.length," ramassage(s)"]}),e.jsx("span",{className:"text-xl font-bold text-slate-900",children:h(m.reduce((s,t)=>s+t.totalAmount,0))})]})})]})})]})}export{ze as default};
