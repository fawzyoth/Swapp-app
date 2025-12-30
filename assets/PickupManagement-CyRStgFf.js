import{s as E,j as e}from"./index-C-n_DeK3.js";import{u as ae,r as c}from"./react-vendor-CTUriZ5h.js";import{M as G}from"./MerchantLayout-BsF3-gyG.js";import{i as re,g as le,f as ie,a as ne,s as de,D as oe}from"./jaxService-Czfmsyg_.js";import{T as ce}from"./truck-CgEV9F53.js";import{S as H}from"./send-DlqxrGT5.js";import{C as S}from"./clock-Dhxn45-3.js";import{C as me}from"./calendar-upMk3ayk.js";import{C as v}from"./check-circle-CyNeZd0p.js";import{P as U}from"./printer-B3I1m1op.js";import{A as xe}from"./alert-circle-_Iqic_ih.js";import{P as q}from"./package-ChDCFdB3.js";import{R as he}from"./refresh-cw-EGIEbGnh.js";import{M as pe}from"./map-pin-DUtVdt2Q.js";import{D as ue}from"./dollar-sign-C401I3Os.js";import{F as ge}from"./file-text-B3Ewreww.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./createLucideIcon-CMjKDoEE.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./star-Cw7sdsKF.js";import"./video-Cwp6uQ4V.js";import"./log-out-BX30H4-p.js";const j=9;function Be(){const J=ae(),[X,D]=c.useState(!0),[A,$]=c.useState(!1),[_,T]=c.useState([]),[n,y]=c.useState([]),[r,B]=c.useState(null),[C,P]=c.useState(""),[R,u]=c.useState(""),[I,Y]=c.useState(null),[N,W]=c.useState(!1),[g,F]=c.useState([]),[b,L]=c.useState("pickup"),[fe,be]=c.useState(null),d=re()||N,K=le(),M=ie(K);c.useEffect(()=>{z()},[]);const z=async()=>{try{const{data:{session:t}}=await E.auth.getSession();if(!t){J("/merchant/login");return}const{data:s}=await E.from("merchants").select("*").eq("email",t.user.email).maybeSingle();if(!s){u("Marchand non trouve"),D(!1);return}B(s);const{data:i,error:m}=await E.from("exchanges").select("*").eq("merchant_id",s.id).in("status",["approved","validated","ready_for_pickup","in_transit"]).order("created_at",{ascending:!1});if(m)throw m;const a=(i||[]).filter(l=>l.jax_ean).map(l=>({id:l.id,exchange_code:l.exchange_code,client_name:l.client_name,client_address:l.client_address||"",client_city:l.client_city||"",product_name:l.product_name||"",status:l.status,jax_ean:l.jax_ean,jax_pickup_scheduled:!1,created_at:l.created_at,payment_amount:l.payment_amount||0,delivery_fee:l.delivery_fee||j,merchant_delivery_charge:l.merchant_delivery_charge||(l.payment_status==="free"?j:0),payment_status:l.payment_status||"pending"}));T(a);const o=localStorage.getItem(`pickup_history_${s.id}`);if(o)try{F(JSON.parse(o))}catch(l){console.error("Error parsing pickup history:",l)}}catch(t){console.error("Error loading data:",t),u("Erreur lors du chargement des donnees")}finally{D(!1)}},h=_.filter(t=>t.jax_ean&&!t.jax_pickup_scheduled),w=_.filter(t=>t.jax_ean&&t.jax_pickup_scheduled),Q=t=>{y(s=>s.includes(t)?s.filter(i=>i!==t):[...s,t])},Z=()=>{const t=h.map(s=>s.jax_ean).filter(s=>s!==null);y(t)},ee=()=>{y([])},p=t=>t.toFixed(3)+" TND",k=t=>{const s=window.open("","","height=800,width=600");if(!s)return;const i=new Date,m=i.toLocaleDateString("fr-TN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});s.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bordereau de Sortie - ${t.id}</title>
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
            <p>${(r==null?void 0:r.business_name)||(r==null?void 0:r.name)||"N/A"}</p>
            <p style="font-weight: normal; font-size: 12px;">${(r==null?void 0:r.business_address)||""}</p>
            <p style="font-weight: normal; font-size: 12px;">${(r==null?void 0:r.phone)||""}</p>
          </div>
          <div class="info-block" style="text-align: right;">
            <h3>DATE DE RAMASSAGE</h3>
            <p>${m}</p>
            <h3 style="margin-top: 10px;">N° BON</h3>
            <p>${t.id}</p>
          </div>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="number">${t.colis.length}</div>
            <div class="label">COLIS TOTAL</div>
          </div>
          <div class="summary-item">
            <div class="number">${t.totalDeliveryFees.toFixed(3)}</div>
            <div class="label">FRAIS LIVRAISON (TND)</div>
          </div>
          <div class="summary-item" style="background: #991b1b;">
            <div class="number">${t.totalMerchantCharge.toFixed(3)}</div>
            <div class="label">À VOTRE CHARGE (TND)</div>
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
              <th style="text-align: center;">TYPE</th>
              <th style="text-align: right;">LIVRAISON</th>
              <th style="text-align: right;">À CHARGE</th>
            </tr>
          </thead>
          <tbody>
            ${t.colis.map((a,o)=>`
              <tr>
                <td>${o+1}</td>
                <td class="ean-code">${a.jax_ean}</td>
                <td>${a.exchange_code}</td>
                <td>${a.client_name}</td>
                <td>${a.client_city||"-"}</td>
                <td style="text-align: center;">
                  <span style="padding: 2px 6px; border-radius: 4px; font-size: 10px; ${a.payment_status==="free"?"background: #fee2e2; color: #991b1b;":"background: #d1fae5; color: #065f46;"}">
                    ${a.payment_status==="free"?"GRATUIT":"PAYANT"}
                  </span>
                </td>
                <td class="amount">${(a.delivery_fee||9).toFixed(3)} TND</td>
                <td class="amount" style="${a.merchant_delivery_charge>0?"color: #dc2626; font-weight: bold;":""}">${(a.merchant_delivery_charge||0).toFixed(3)} TND</td>
              </tr>
            `).join("")}
            <tr class="total-row">
              <td colspan="6" style="text-align: right;">TOTAL FRAIS DE LIVRAISON:</td>
              <td class="amount">${t.totalDeliveryFees.toFixed(3)} TND</td>
              <td></td>
            </tr>
            <tr class="total-row" style="background: #fef2f2 !important;">
              <td colspan="6" style="text-align: right; color: #991b1b;">TOTAL À VOTRE CHARGE:</td>
              <td></td>
              <td class="amount" style="color: #dc2626; font-weight: bold;">${t.totalMerchantCharge.toFixed(3)} TND</td>
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
          <p style="font-size: 10px; margin-top: 5px;">Document généré par SWAPP - ${i.toISOString()}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        <\/script>
      </body>
      </html>
    `),s.document.close()},te=async()=>{if(n.length===0){u("Veuillez selectionner au moins un colis");return}if(!d){u("Les ramassages ne sont disponibles que le Mercredi et Dimanche");return}if(!(r!=null&&r.business_address)){u("Veuillez configurer votre adresse dans Parametres > Marque");return}$(!0),u(""),P("");try{const t=ne(r.business_city||"Tunis"),s=await de(oe,n,r.business_address,t,`Ramassage SWAPP - ${n.length} colis`);if(s.success){const i=_.filter(x=>x.jax_ean&&n.includes(x.jax_ean)),m=i.reduce((x,f)=>x+(f.payment_amount||0),0),a=i.reduce((x,f)=>x+(f.delivery_fee||j),0),o=i.reduce((x,f)=>x+(f.merchant_delivery_charge||0),0),l=`RAM-${Date.now().toString(36).toUpperCase()}`,O={id:l,date:new Date().toISOString(),colis:i,totalAmount:m,totalDeliveryFees:a,totalMerchantCharge:o};Y(O);const V=[{id:l,date:new Date().toISOString(),colisCount:i.length,totalAmount:m,totalDeliveryFees:a,totalMerchantCharge:o,colis:i},...g];F(V),r!=null&&r.id&&localStorage.setItem(`pickup_history_${r.id}`,JSON.stringify(V));const se=o>0?` Frais à votre charge: ${p(o)}`:"";P(`Ramassage programmé avec succès pour ${n.length} colis!${se} Vous pouvez imprimer le bordereau de sortie.`),y([]),T(x=>x.filter(f=>!f.jax_ean||!n.includes(f.jax_ean))),k(O)}else u(s.error||"Erreur lors de la programmation du ramassage")}catch(t){console.error("Pickup scheduling error:",t),u("Erreur lors de la programmation du ramassage")}finally{$(!1)}};return X?e.jsx(G,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})}):e.jsx(G,{children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("div",{className:"mb-6 flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsxs("h1",{className:"text-2xl font-bold text-slate-900 flex items-center gap-3",children:[e.jsx(ce,{className:"w-7 h-7 text-sky-600"}),"Gestion des Ramassages"]}),e.jsx("p",{className:"text-slate-600 mt-1",children:"Programmez le ramassage de vos colis par JAX Delivery"})]}),e.jsx("button",{onClick:()=>W(!N),className:`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${N?"bg-orange-100 text-orange-700 border border-orange-300":"bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"}`,children:N?"Mode Test: ON":"Mode Test"})]}),e.jsxs("div",{className:"mb-6 flex bg-slate-100 rounded-xl p-1",children:[e.jsxs("button",{onClick:()=>L("pickup"),className:`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${b==="pickup"?"bg-white text-sky-600 shadow-sm":"text-slate-600 hover:text-slate-900"}`,children:[e.jsx(H,{className:"w-4 h-4"}),"Demande de ramassage",h.length>0&&e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${b==="pickup"?"bg-sky-100 text-sky-700":"bg-slate-200 text-slate-600"}`,children:h.length})]}),e.jsxs("button",{onClick:()=>L("history"),className:`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${b==="history"?"bg-white text-sky-600 shadow-sm":"text-slate-600 hover:text-slate-900"}`,children:[e.jsx(S,{className:"w-4 h-4"}),"Historique",g.length>0&&e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${b==="history"?"bg-sky-100 text-sky-700":"bg-slate-200 text-slate-600"}`,children:g.length})]})]}),b==="pickup"&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:`mb-6 p-4 rounded-xl border-2 ${d?"bg-emerald-50 border-emerald-200":"bg-amber-50 border-amber-200"}`,children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:`p-3 rounded-full ${d?"bg-emerald-100":"bg-amber-100"}`,children:e.jsx(me,{className:`w-6 h-6 ${d?"text-emerald-600":"text-amber-600"}`})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:`font-semibold ${d?"text-emerald-900":"text-amber-900"}`,children:d?"Aujourd'hui est un jour de ramassage!":"Prochain jour de ramassage"}),e.jsx("p",{className:`text-sm ${d?"text-emerald-700":"text-amber-700"}`,children:d?"Vous pouvez programmer le ramassage de vos colis maintenant.":"Les ramassages sont disponibles uniquement le Mercredi et Dimanche."}),e.jsxs("div",{className:`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${d?"bg-emerald-200 text-emerald-800":"bg-amber-200 text-amber-800"}`,children:[e.jsx(S,{className:"w-4 h-4"}),M]})]})]})}),C&&e.jsxs("div",{className:"mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(v,{className:"w-5 h-5 text-emerald-600"}),e.jsx("span",{className:"text-emerald-800 flex-1",children:C})]}),I&&e.jsx("div",{className:"mt-3 flex gap-2",children:e.jsxs("button",{onClick:()=>k(I),className:"flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium",children:[e.jsx(U,{className:"w-4 h-4"}),"Reimprimer le Bordereau de Sortie"]})})]}),R&&e.jsxs("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3",children:[e.jsx(xe,{className:"w-5 h-5 text-red-600"}),e.jsx("span",{className:"text-red-800",children:R})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-6",children:[e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-amber-100 rounded-lg",children:e.jsx(q,{className:"w-5 h-5 text-amber-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:h.length}),e.jsx("p",{className:"text-sm text-slate-600",children:"En attente de ramassage"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-lg",children:e.jsx(v,{className:"w-5 h-5 text-emerald-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:w.length}),e.jsx("p",{className:"text-sm text-slate-600",children:"Ramassage programme"})]})]})})]}),e.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden mb-6",children:[e.jsxs("div",{className:"px-6 py-4 border-b border-slate-200 flex items-center justify-between",children:[e.jsx("h2",{className:"font-semibold text-slate-900",children:"Colis en attente de ramassage"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:z,className:"p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors",title:"Actualiser",children:e.jsx(he,{className:"w-4 h-4"})}),h.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:Z,className:"text-sm text-sky-600 hover:text-sky-700",children:"Tout selectionner"}),e.jsx("span",{className:"text-slate-300",children:"|"}),e.jsx("button",{onClick:ee,className:"text-sm text-slate-500 hover:text-slate-700",children:"Deselectionner"})]})]})]}),h.length===0?e.jsxs("div",{className:"p-8 text-center",children:[e.jsx(q,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-slate-500",children:"Aucun colis en attente de ramassage"}),e.jsx("p",{className:"text-sm text-slate-400 mt-1",children:"Les colis apparaissent ici apres l'impression du bordereau"})]}):e.jsx("div",{className:"divide-y divide-slate-100",children:h.map(t=>e.jsxs("div",{className:`p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${t.jax_ean&&n.includes(t.jax_ean)?"bg-sky-50":""}`,onClick:()=>t.jax_ean&&Q(t.jax_ean),children:[e.jsx("div",{className:`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${t.jax_ean&&n.includes(t.jax_ean)?"bg-sky-600 border-sky-600":"border-slate-300"}`,children:t.jax_ean&&n.includes(t.jax_ean)&&e.jsx(v,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-mono text-sm font-medium text-sky-600",children:t.jax_ean}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsx("span",{className:"text-sm text-slate-600",children:t.exchange_code})]}),e.jsx("p",{className:"text-sm text-slate-900 font-medium truncate",children:t.client_name}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-slate-500",children:[e.jsx(pe,{className:"w-3 h-3"}),t.client_city||t.client_address]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("span",{className:`inline-block px-2 py-0.5 rounded text-xs font-medium mb-1 ${t.payment_status==="free"?"bg-red-100 text-red-700":"bg-emerald-100 text-emerald-700"}`,children:t.payment_status==="free"?"Gratuit":"Payant"}),e.jsxs("p",{className:"text-xs text-slate-500",children:["Livraison:"," ",p(t.delivery_fee||j)]}),t.merchant_delivery_charge>0&&e.jsxs("p",{className:"text-xs font-medium text-red-600",children:["À charge:"," ",p(t.merchant_delivery_charge)]})]})]},t.id))}),h.length>0&&e.jsxs("div",{className:"px-6 py-4 bg-slate-50 border-t border-slate-200",children:[n.length>0&&(()=>{const t=h.filter(a=>a.jax_ean&&n.includes(a.jax_ean)),s=t.reduce((a,o)=>a+(o.delivery_fee||j),0),i=t.reduce((a,o)=>a+(o.merchant_delivery_charge||0),0),m=t.filter(a=>a.payment_status==="free").length;return e.jsxs("div",{className:"mb-3 space-y-2",children:[e.jsxs("div",{className:"p-3 bg-sky-50 border border-sky-200 rounded-lg",children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsxs("span",{className:"text-sm font-medium text-sky-800",children:[n.length," colis sélectionné(s)"]}),e.jsxs("span",{className:"text-sm text-sky-700",children:["Frais livraison:"," ",p(s)]})]}),m>0&&e.jsxs("div",{className:"text-xs text-sky-600",children:[m," échange(s) gratuit(s) •"," ",n.length-m," échange(s) payant(s)"]})]}),i>0&&e.jsxs("div",{className:"p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ue,{className:"w-4 h-4 text-red-600"}),e.jsx("span",{className:"text-sm font-medium text-red-800",children:"À votre charge (échanges gratuits)"})]}),e.jsx("span",{className:"text-lg font-bold text-red-700",children:p(i)})]})]})})(),e.jsx("button",{onClick:te,disabled:!d||n.length===0||A,className:`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${d&&n.length>0?"bg-emerald-600 text-white hover:bg-emerald-700":"bg-slate-200 text-slate-400 cursor-not-allowed"}`,children:A?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),"Programmation en cours..."]}):e.jsxs(e.Fragment,{children:[e.jsx(H,{className:"w-5 h-5"}),d?`Programmer le ramassage (${n.length} colis)`:`Disponible le ${M}`]})}),!d&&e.jsx("p",{className:"text-center text-sm text-slate-500 mt-2",children:"Les ramassages sont uniquement disponibles le Mercredi et Dimanche"})]})]}),w.length>0&&e.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden",children:[e.jsx("div",{className:"px-6 py-4 border-b border-slate-200",children:e.jsx("h2",{className:"font-semibold text-slate-900",children:"Ramassages programmes"})}),e.jsx("div",{className:"divide-y divide-slate-100",children:w.map(t=>e.jsxs("div",{className:"p-4 flex items-center gap-4",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-full",children:e.jsx(v,{className:"w-4 h-4 text-emerald-600"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-mono text-sm font-medium text-emerald-600",children:t.jax_ean}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsx("span",{className:"text-sm text-slate-600",children:t.exchange_code})]}),e.jsx("p",{className:"text-sm text-slate-900",children:t.client_name})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("span",{className:"text-sm font-semibold text-emerald-600",children:p(t.payment_amount)}),e.jsx("span",{className:"ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full",children:"Programme"})]})]},t.id))})]})]}),b==="history"&&e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden",children:g.length===0?e.jsxs("div",{className:"p-12 text-center",children:[e.jsx(S,{className:"w-16 h-16 text-slate-300 mx-auto mb-4"}),e.jsx("p",{className:"text-lg text-slate-500 font-medium",children:"Aucun historique de ramassage"}),e.jsx("p",{className:"text-sm text-slate-400 mt-2",children:"Les ramassages programmés apparaîtront ici"})]}):e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"divide-y divide-slate-100",children:g.map(t=>e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-slate-100 rounded-full",children:e.jsx(ge,{className:"w-5 h-5 text-slate-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-mono text-sm font-bold text-slate-800",children:t.id}),e.jsx("p",{className:"text-xs text-slate-500",children:new Date(t.date).toLocaleDateString("fr-TN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})})]})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-lg font-bold text-emerald-600",children:p(t.totalAmount)}),e.jsxs("p",{className:"text-xs text-slate-500",children:[t.colisCount," colis"]})]}),e.jsx("button",{onClick:()=>k({...t,totalAmount:t.totalAmount}),className:"p-2 bg-sky-100 text-sky-600 rounded-lg hover:bg-sky-200 transition-colors",title:"Imprimer le bordereau",children:e.jsx(U,{className:"w-4 h-4"})})]})]}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2",children:t.colis.map((s,i)=>e.jsxs("div",{className:"flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs",children:[e.jsxs("div",{className:"flex items-center gap-2 min-w-0",children:[e.jsx("span",{className:"w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 flex-shrink-0",children:i+1}),e.jsx("span",{className:"text-slate-700 truncate",children:s.client_name})]}),e.jsx("span",{className:"font-semibold text-emerald-600 ml-2 flex-shrink-0",children:p(s.payment_amount)})]},s.id))})]},t.id))}),e.jsx("div",{className:"px-6 py-4 bg-slate-50 border-t border-slate-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("span",{className:"text-sm text-slate-600",children:["Total:"," ",g.reduce((t,s)=>t+s.colisCount,0)," ","colis",e.jsx("span",{className:"text-slate-400 mx-2",children:"•"}),g.length," ramassage(s)"]}),e.jsx("span",{className:"text-xl font-bold text-slate-900",children:p(g.reduce((t,s)=>t+s.totalAmount,0))})]})})]})})]})})}export{Be as default};
