import{s as b,j as e}from"./index-C-B8WsRp.js";import{u as X,r as d}from"./react-vendor-CTUriZ5h.js";import{M as P}from"./MerchantLayout-CbLhEEqa.js";import{i as V,g as q,f as F,a as J,s as B,D as G}from"./jaxService-Czfmsyg_.js";import{T as W}from"./truck-CgEV9F53.js";import{C as Y}from"./calendar-upMk3ayk.js";import{C as K}from"./clock-Dhxn45-3.js";import{C as h}from"./check-circle-CyNeZd0p.js";import{P as H}from"./printer-B3I1m1op.js";import{A as Q}from"./alert-circle-_Iqic_ih.js";import{P as R}from"./package-ChDCFdB3.js";import{R as Z}from"./refresh-cw-EGIEbGnh.js";import{M as ee}from"./map-pin-DUtVdt2Q.js";import{S as se}from"./send-DlqxrGT5.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./createLucideIcon-CMjKDoEE.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";function Se(){const $=X(),[C,f]=d.useState(!0),[j,v]=d.useState(!1),[u,N]=d.useState([]),[l,p]=d.useState([]),[r,I]=d.useState(null),[_,y]=d.useState(""),[w,o]=d.useState(""),[E,T]=d.useState(null),i=V(),z=q(),S=F(z);d.useEffect(()=>{k()},[]);const k=async()=>{try{const{data:{session:s}}=await b.auth.getSession();if(!s){$("/merchant/login");return}const{data:t}=await b.from("merchants").select("*").eq("email",s.user.email).maybeSingle();if(!t){o("Marchand non trouve"),f(!1);return}I(t);const{data:c,error:x}=await b.from("exchanges").select("*").eq("merchant_id",t.id).in("status",["approved","in_transit"]).order("created_at",{ascending:!1});if(x)throw x;const n=(c||[]).filter(a=>a.jax_ean).map(a=>({id:a.id,exchange_code:a.exchange_code,client_name:a.client_name,client_address:a.client_address||"",client_city:a.client_city||"",product_name:a.product_name||"",status:a.status,jax_ean:a.jax_ean,jax_pickup_scheduled:!1,created_at:a.created_at}));N(n)}catch(s){console.error("Error loading data:",s),o("Erreur lors du chargement des donnees")}finally{f(!1)}},m=u.filter(s=>s.jax_ean&&!s.jax_pickup_scheduled),g=u.filter(s=>s.jax_ean&&s.jax_pickup_scheduled),L=s=>{p(t=>t.includes(s)?t.filter(c=>c!==s):[...t,s])},M=()=>{const s=m.map(t=>t.jax_ean).filter(t=>t!==null);p(s)},O=()=>{p([])},D=s=>{const t=window.open("","","height=800,width=600");if(!t)return;const c=new Date,x=c.toLocaleDateString("fr-TN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});t.document.write(`
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
            <p>${x}</p>
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
            <div class="number">${s.colis.length}</div>
            <div class="label">A RAMASSER</div>
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
            </tr>
          </thead>
          <tbody>
            ${s.colis.map((n,a)=>`
              <tr>
                <td>${a+1}</td>
                <td class="ean-code">${n.jax_ean}</td>
                <td>${n.exchange_code}</td>
                <td>${n.client_name}</td>
                <td>${n.client_city||"-"}</td>
                <td>${n.product_name||"-"}</td>
              </tr>
            `).join("")}
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
          <p style="font-size: 10px; margin-top: 5px;">Document généré par SWAPP - ${c.toISOString()}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        <\/script>
      </body>
      </html>
    `),t.document.close()},U=async()=>{if(l.length===0){o("Veuillez selectionner au moins un colis");return}if(!i){o("Les ramassages ne sont disponibles que le Mercredi et Dimanche");return}if(!(r!=null&&r.business_address)){o("Veuillez configurer votre adresse dans Parametres > Marque");return}v(!0),o(""),y("");try{const s=J(r.business_city||"Tunis"),t=await B(G,l,r.business_address,s,`Ramassage SWAPP - ${l.length} colis`);if(t.success){const c=u.filter(a=>a.jax_ean&&l.includes(a.jax_ean)),n={id:`RAM-${Date.now().toString(36).toUpperCase()}`,date:new Date().toISOString(),colis:c};T(n),y(`Ramassage programme avec succes pour ${l.length} colis! Vous pouvez imprimer le bordereau de sortie.`),p([]),N(a=>a.filter(A=>!A.jax_ean||!l.includes(A.jax_ean))),D(n)}else o(t.error||"Erreur lors de la programmation du ramassage")}catch(s){console.error("Pickup scheduling error:",s),o("Erreur lors de la programmation du ramassage")}finally{v(!1)}};return C?e.jsx(P,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})}):e.jsx(P,{children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("div",{className:"mb-6",children:[e.jsxs("h1",{className:"text-2xl font-bold text-slate-900 flex items-center gap-3",children:[e.jsx(W,{className:"w-7 h-7 text-sky-600"}),"Gestion des Ramassages"]}),e.jsx("p",{className:"text-slate-600 mt-1",children:"Programmez le ramassage de vos colis par JAX Delivery"})]}),e.jsx("div",{className:`mb-6 p-4 rounded-xl border-2 ${i?"bg-emerald-50 border-emerald-200":"bg-amber-50 border-amber-200"}`,children:e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:`p-3 rounded-full ${i?"bg-emerald-100":"bg-amber-100"}`,children:e.jsx(Y,{className:`w-6 h-6 ${i?"text-emerald-600":"text-amber-600"}`})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:`font-semibold ${i?"text-emerald-900":"text-amber-900"}`,children:i?"Aujourd'hui est un jour de ramassage!":"Prochain jour de ramassage"}),e.jsx("p",{className:`text-sm ${i?"text-emerald-700":"text-amber-700"}`,children:i?"Vous pouvez programmer le ramassage de vos colis maintenant.":"Les ramassages sont disponibles uniquement le Mercredi et Dimanche."}),e.jsxs("div",{className:`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${i?"bg-emerald-200 text-emerald-800":"bg-amber-200 text-amber-800"}`,children:[e.jsx(K,{className:"w-4 h-4"}),S]})]})]})}),_&&e.jsxs("div",{className:"mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(h,{className:"w-5 h-5 text-emerald-600"}),e.jsx("span",{className:"text-emerald-800 flex-1",children:_})]}),E&&e.jsx("div",{className:"mt-3 flex gap-2",children:e.jsxs("button",{onClick:()=>D(E),className:"flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium",children:[e.jsx(H,{className:"w-4 h-4"}),"Reimprimer le Bordereau de Sortie"]})})]}),w&&e.jsxs("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3",children:[e.jsx(Q,{className:"w-5 h-5 text-red-600"}),e.jsx("span",{className:"text-red-800",children:w})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 mb-6",children:[e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-amber-100 rounded-lg",children:e.jsx(R,{className:"w-5 h-5 text-amber-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:m.length}),e.jsx("p",{className:"text-sm text-slate-600",children:"En attente de ramassage"})]})]})}),e.jsx("div",{className:"bg-white rounded-xl border border-slate-200 p-4",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-lg",children:e.jsx(h,{className:"w-5 h-5 text-emerald-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"text-2xl font-bold text-slate-900",children:g.length}),e.jsx("p",{className:"text-sm text-slate-600",children:"Ramassage programme"})]})]})})]}),e.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden mb-6",children:[e.jsxs("div",{className:"px-6 py-4 border-b border-slate-200 flex items-center justify-between",children:[e.jsx("h2",{className:"font-semibold text-slate-900",children:"Colis en attente de ramassage"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{onClick:k,className:"p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors",title:"Actualiser",children:e.jsx(Z,{className:"w-4 h-4"})}),m.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:M,className:"text-sm text-sky-600 hover:text-sky-700",children:"Tout selectionner"}),e.jsx("span",{className:"text-slate-300",children:"|"}),e.jsx("button",{onClick:O,className:"text-sm text-slate-500 hover:text-slate-700",children:"Deselectionner"})]})]})]}),m.length===0?e.jsxs("div",{className:"p-8 text-center",children:[e.jsx(R,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-slate-500",children:"Aucun colis en attente de ramassage"}),e.jsx("p",{className:"text-sm text-slate-400 mt-1",children:"Les colis apparaissent ici apres l'impression du bordereau"})]}):e.jsx("div",{className:"divide-y divide-slate-100",children:m.map(s=>e.jsxs("div",{className:`p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${s.jax_ean&&l.includes(s.jax_ean)?"bg-sky-50":""}`,onClick:()=>s.jax_ean&&L(s.jax_ean),children:[e.jsx("div",{className:`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${s.jax_ean&&l.includes(s.jax_ean)?"bg-sky-600 border-sky-600":"border-slate-300"}`,children:s.jax_ean&&l.includes(s.jax_ean)&&e.jsx(h,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-mono text-sm font-medium text-sky-600",children:s.jax_ean}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsx("span",{className:"text-sm text-slate-600",children:s.exchange_code})]}),e.jsx("p",{className:"text-sm text-slate-900 font-medium truncate",children:s.client_name}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-slate-500",children:[e.jsx(ee,{className:"w-3 h-3"}),s.client_city||s.client_address]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-sm text-slate-600 truncate max-w-[150px]",children:s.product_name}),e.jsx("p",{className:"text-xs text-slate-400",children:new Date(s.created_at).toLocaleDateString("fr-TN")})]})]},s.id))}),m.length>0&&e.jsxs("div",{className:"px-6 py-4 bg-slate-50 border-t border-slate-200",children:[e.jsx("button",{onClick:U,disabled:!i||l.length===0||j,className:`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${i&&l.length>0?"bg-emerald-600 text-white hover:bg-emerald-700":"bg-slate-200 text-slate-400 cursor-not-allowed"}`,children:j?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),"Programmation en cours..."]}):e.jsxs(e.Fragment,{children:[e.jsx(se,{className:"w-5 h-5"}),i?`Programmer le ramassage (${l.length} colis)`:`Disponible le ${S}`]})}),!i&&e.jsx("p",{className:"text-center text-sm text-slate-500 mt-2",children:"Les ramassages sont uniquement disponibles le Mercredi et Dimanche"})]})]}),g.length>0&&e.jsxs("div",{className:"bg-white rounded-xl border border-slate-200 overflow-hidden",children:[e.jsx("div",{className:"px-6 py-4 border-b border-slate-200",children:e.jsx("h2",{className:"font-semibold text-slate-900",children:"Ramassages programmes"})}),e.jsx("div",{className:"divide-y divide-slate-100",children:g.map(s=>e.jsxs("div",{className:"p-4 flex items-center gap-4",children:[e.jsx("div",{className:"p-2 bg-emerald-100 rounded-full",children:e.jsx(h,{className:"w-4 h-4 text-emerald-600"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"font-mono text-sm font-medium text-emerald-600",children:s.jax_ean}),e.jsx("span",{className:"text-slate-300",children:"•"}),e.jsx("span",{className:"text-sm text-slate-600",children:s.exchange_code})]}),e.jsx("p",{className:"text-sm text-slate-900",children:s.client_name})]}),e.jsx("span",{className:"px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full",children:"Programme"})]},s.id))})]})]})})}export{Se as default};
