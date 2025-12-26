import{s as o,j as e,S as T}from"./index-DFGvS2nn.js";import{h as pe,u as ue,r as l}from"./react-vendor-CTUriZ5h.js";import{M as I}from"./MerchantLayout-b4Vg5ov-.js";import{I as G,s as he,a as be,b as fe}from"./smsService-qtIlF6gc.js";import{A as ge}from"./arrow-left-CxjwE-xR.js";import{A as je}from"./alert-triangle-1NuODUVJ.js";import{U as ve}from"./user-DEx4Ce9L.js";import{P as H}from"./package-ChDCFdB3.js";import{M as Ne}from"./map-pin-DUtVdt2Q.js";import{H as ye}from"./home-9mW_oZwz.js";import{V as we}from"./video-Cwp6uQ4V.js";import{C as _e}from"./clock-Dhxn45-3.js";import{C as L}from"./check-circle-CyNeZd0p.js";import{X as B}from"./x-circle-D3f66Y07.js";import{P as Se}from"./printer-B3I1m1op.js";import{S as ke}from"./send-DlqxrGT5.js";import{T as Ae}from"./truck-CgEV9F53.js";import{C as Ce}from"./calendar-upMk3ayk.js";import{A as Re}from"./alert-circle-_Iqic_ih.js";import{T as $e}from"./trending-up-9gPHMyOx.js";import{C as De}from"./check-Cm21nyZb.js";import{D as Ee}from"./dollar-sign-C401I3Os.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./createLucideIcon-CMjKDoEE.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";const Me="https://core.jax-delivery.com/api",ze="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2NvcmUuamF4LWRlbGl2ZXJ5LmNvbS9hcGkvdXRpbGlzYXRldXJzL0xvbmdUb2tlbiIsImlhdCI6MTc2Njc2NjI5MSwiZXhwIjoxODI5ODM4MjkxLCJuYmYiOjE3NjY3NjYyOTEsImp0aSI6IjY4T1RuNDB2aVN2VzdpMHQiLCJzdWIiOiIzNDIyIiwicHJ2IjoiZDA5MDViY2Y2NWE2ZDk5MmQ5MGNiZmU0NjIyNmJkMzEzYWU1MTkzZiJ9.2OZPJSLbCALAMgmrUR41u1CNk5e6Ozagc5pHFMHBj_4",P={tunis:1,ariana:2,"ben arous":3,manouba:4,bizerte:5,beja:6,jendouba:7,kef:8,siliana:9,nabeul:10,zaghouan:11,sousse:12,monastir:13,mahdia:14,sfax:15,kairouan:16,kasserine:17,"sidi bouzid":18,gabes:19,medenine:20,tataouine:21,gafsa:22,tozeur:23,kebili:24},Y=a=>{if(!a)return 1;const r=a.toLowerCase().trim();if(P[r])return P[r];for(const[s,x]of Object.entries(P))if(r.includes(s)||s.includes(r))return x;return 1},Te=async(a,r)=>{try{const s=await fetch(`${Me}/user/colis/add`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${a}`},body:JSON.stringify(r)}),x=await s.json();return console.log("JAX API Response:",x),s.ok?{...x,success:!0,ean:x.code||x.ean}:{success:!1,error:x.message||`JAX API error: ${s.status}`}}catch(s){return console.error("JAX API Error:",s),{success:!1,error:s instanceof Error?s.message:"Unknown error"}}};class u extends Error{constructor(r){super(r),this.name="JaxValidationError"}}const Ie=(a,r)=>{if(!(a!=null&&a.exchange_code))throw new u("Code d'échange manquant");if(!(a!=null&&a.client_name))throw new u("Nom du client manquant");if(!(a!=null&&a.client_phone))throw new u("Téléphone du client manquant");if(!(a!=null&&a.client_address))throw new u("Adresse du client manquante");if(!(a!=null&&a.client_governorate_id)&&!(a!=null&&a.client_city))throw new u("Gouvernorat du client manquant");const s=(a==null?void 0:a.client_delegation)||(a==null?void 0:a.client_postal_code);if(!s)throw new u("Délégation du client manquante");const x=(r==null?void 0:r.business_name)||(r==null?void 0:r.name);if(!x)throw new u("Nom commercial du marchand manquant (Paramètres > Marque)");if(!(r!=null&&r.phone))throw new u("Téléphone du marchand manquant");if(!(r!=null&&r.business_address))throw new u("Adresse du marchand manquante (Paramètres > Marque)");const A=a.client_governorate_id||Y(a.client_city||""),v=Y(r.business_city||""),C=a.client_phone.replace(/\s/g,""),J=r.phone.replace(/\s/g,"");return{referenceExterne:a.exchange_code,nomContact:a.client_name,tel:C,tel2:C,adresseLivraison:a.client_address,governorat:A.toString(),delegation:s,description:`Échange: ${a.product_name||"Produit"} - ${a.reason||"Échange"}`,cod:(a.payment_amount||0).toString(),echange:1,gouvernorat_pickup:v,adresse_pickup:r.business_address,expediteur_phone:parseInt(J,10),expediteur_name:x}};function Ns(){const{id:a}=pe(),r=ue(),[s,x]=l.useState(null),[A,v]=l.useState(null),[C,J]=l.useState(null),[Le,Pe]=l.useState(!1),[q,W]=l.useState([]),[Z,Q]=l.useState([]),[K,ee]=l.useState([]),[g,se]=l.useState([]),[h,te]=l.useState([]),[R,V]=l.useState(""),[ae,$]=l.useState(!1),[re,D]=l.useState(!1),[Je,qe]=l.useState(""),[Ve,Oe]=l.useState(""),[O,ie]=l.useState("0"),[b,X]=l.useState("free"),[j,le]=l.useState(""),[ne,F]=l.useState(!0),[E,N]=l.useState(!1),[U,y]=l.useState(null);l.useEffect(()=>{w()},[a]);const w=async()=>{var t,d;try{const{data:{session:i}}=await o.auth.getSession();console.log("Session email:",(t=i==null?void 0:i.user)==null?void 0:t.email);const{data:c}=await o.from("exchanges").select("*").eq("id",a).maybeSingle();if(!c){F(!1);return}console.log("Exchange merchant_id:",c.merchant_id),x(c);const[_,z,f,S,k,n]=await Promise.all([o.from("messages").select("id, sender_type, message, created_at").eq("exchange_id",a).order("created_at",{ascending:!0}),o.from("transporters").select("id, name"),o.from("mini_depots").select("id, name, address"),o.from("exchanges").select("id, exchange_code, reason, status, created_at").eq("client_phone",c.client_phone).neq("id",a).order("created_at",{ascending:!1}).limit(5),o.from("delivery_attempts").select("id, attempt_number, status, scheduled_date, notes, created_at").eq("exchange_id",a).order("attempt_number",{ascending:!0}),(d=i==null?void 0:i.user)!=null&&d.email?o.from("merchants").select("id, name, business_name, phone, business_address, business_city").eq("email",i.user.email).maybeSingle():Promise.resolve({data:null})]);console.log("Merchant query result:",n),W(_.data||[]),Q(z.data||[]),ee(f.data||[]),se(S.data||[]),te(k.data||[]),v(n.data||null)}catch(i){console.error("Error fetching data:",i)}finally{F(!1)}},de=async t=>{if(t.preventDefault(),!!R.trim())try{await o.from("messages").insert({exchange_id:a,sender_type:"merchant",message:R}),s&&a&&await he(s.client_phone,s.client_name,s.exchange_code,a),V(""),w()}catch(d){console.error("Error sending message:",d)}},oe=async()=>{const t=b==="free"?0:parseFloat(O);try{await o.from("exchanges").update({status:"validated",payment_amount:t,payment_status:b==="free"?"free":"pending",updated_at:new Date().toISOString()}).eq("id",a),await o.from("status_history").insert({exchange_id:a,status:"validated"});const d=b==="free"?"Votre échange a été validé. Aucun paiement supplémentaire requis.":`Votre échange a été validé. Montant à payer: ${t.toFixed(2)} TND.`;if(await o.from("messages").insert({exchange_id:a,sender_type:"merchant",message:d}),s){const i=new Date;i.setDate(i.getDate()+3);const c=i.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});await be(s.client_phone,s.client_name,s.exchange_code,c)}$(!1),w()}catch(d){console.error("Error validating exchange:",d)}},ce=async()=>{if(!j.trim()){alert("Veuillez fournir une raison pour le refus");return}try{await o.from("exchanges").update({status:"rejected",rejection_reason:j,updated_at:new Date().toISOString()}).eq("id",a),await o.from("status_history").insert({exchange_id:a,status:"rejected"}),await o.from("messages").insert({exchange_id:a,sender_type:"merchant",message:`Votre demande d'échange a été refusée. Raison: ${j}`}),s&&await fe(s.client_phone,s.client_name,s.exchange_code,j),D(!1),w()}catch(t){console.error("Error rejecting exchange:",t)}},me=async()=>{var S,k;if(!s)return;const t=K.find(n=>n.id===s.mini_depot_id),d=Z.find(n=>n.id===s.transporter_id);let i=s.jax_ean,c=A;if(!c){const{data:{session:n}}=await o.auth.getSession();if(console.log("Fetching merchant for email:",(S=n==null?void 0:n.user)==null?void 0:S.email),(k=n==null?void 0:n.user)!=null&&k.email){const{data:p,error:xe}=await o.from("merchants").select("id, name, business_name, phone, business_address, business_city").eq("email",n.user.email).maybeSingle();console.log("Fresh merchant data:",p),console.log("Merchant query error:",xe),p&&(c=p,v(p))}}console.log("Merchant data for JAX:",c),console.log("business_name:",c==null?void 0:c.business_name),console.log("name:",c==null?void 0:c.name);const _=ze;if(!i&&_){N(!0),y(null);try{const n=Ie(s,c||{}),p=await Te(_,n);if(p.success&&p.ean)i=p.ean,await o.from("exchanges").update({jax_ean:i,jax_created_at:new Date().toISOString()}).eq("id",s.id),x({...s,jax_ean:i});else{y(p.error||p.message||"Erreur lors de la création du colis JAX"),N(!1);return}}catch(n){console.error("JAX API Error:",n),n instanceof u?y(n.message):y("Erreur de connexion à JAX"),N(!1);return}N(!1)}const z=`https://fawzyoth.github.io/Swapp-app/#/delivery/verify/${s.exchange_code}`,f=window.open("","","height=800,width=600");f&&(f.document.write(`
        <html>
        <head>
          <title>Bordereau ALLER - ${s.exchange_code}</title>
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
              <div class="exchange-code">${s.exchange_code}</div>
              <div class="date">${new Date(s.created_at).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"})}</div>
            </div>
            ${i?`<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #000; font-size: 12px;"><strong>JAX:</strong> <span style="font-family: 'Courier New', monospace;">${i}</span></div>`:""}
          </div>

          <div class="codes-section">
            <div class="code-box">
              <div class="title">QR Vérification</div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(z)}" alt="QR Code" width="100" height="100" />
              <div class="code-label">SCAN LIVREUR</div>
            </div>
            <div class="code-box">
              <div class="title">Code-Barres JAX</div>
              <img src="https://barcodeapi.org/api/128/${i||s.exchange_code.slice(-8)}" alt="Barcode" width="160" height="50" />
              <div class="code-label">${i||s.exchange_code.slice(-8)}</div>
            </div>
          </div>

          <table class="info-table">
            <tr>
              <th>Client</th>
              <td><strong>${s.client_name}</strong></td>
            </tr>
            <tr>
              <th>Téléphone</th>
              <td>${s.client_phone}</td>
            </tr>
            <tr>
              <th>Produit</th>
              <td>${s.product_name||"Non spécifié"}</td>
            </tr>
            <tr>
              <th>Motif</th>
              <td>${s.reason}</td>
            </tr>
          </table>

          <div class="address-box">
            <div class="title">Adresse de livraison</div>
            <div class="content">
              ${s.client_address||"Non fournie"}<br>
              ${s.client_city||""} ${s.client_postal_code||""}<br>
              ${s.client_country||"Tunisie"}
            </div>
          </div>

          ${t?`
          <table class="info-table">
            <tr>
              <th>Dépôt</th>
              <td>${t.name}</td>
            </tr>
          </table>
          `:""}

          ${d?`
          <table class="info-table">
            <tr>
              <th>Transporteur</th>
              <td>${d.name}</td>
            </tr>
          </table>
          `:""}

          <div class="payment-box">
            <div class="label">Montant à encaisser</div>
            <div class="amount">${s.payment_amount>0?s.payment_amount+" TND":"GRATUIT"}</div>
          </div>

          <div class="notice">
            <div class="title">COLIS CONTENANT LE PRODUIT D'ÉCHANGE</div>
            <div class="text">À livrer au client. Le retour du produit sera géré par notre partenaire de livraison.</div>
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
            <div>Statut: ${T[s.status]}</div>
          </div>
        </body>
        </html>
      `),f.document.close(),setTimeout(()=>{f.print()},500))};if(ne)return e.jsx(I,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})});if(!s)return e.jsx(I,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-2",children:"Échange non trouvé"}),e.jsx("button",{onClick:()=>r("/merchant/exchanges"),className:"px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700",children:"Retour aux échanges"})]})})});const M=s.status==="pending",m={total:g.length,validated:g.filter(t=>t.status==="validated"||t.status==="completed").length,rejected:g.filter(t=>t.status==="rejected").length};return e.jsx(I,{children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("button",{onClick:()=>r("/merchant/exchanges"),className:"flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6",children:[e.jsx(ge,{className:"w-5 h-5"}),e.jsx("span",{className:"font-medium",children:"Retour aux échanges"})]}),e.jsxs("div",{className:"grid lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-1",children:s.exchange_code}),e.jsxs("p",{className:"text-slate-600",children:["Créé le"," ",new Date(s.created_at).toLocaleDateString("fr-FR")]})]}),e.jsx("span",{className:`px-4 py-2 rounded-full text-sm font-medium ${s.status==="pending"?"bg-amber-100 text-amber-800 border border-amber-200":s.status==="validated"?"bg-emerald-100 text-emerald-800 border border-emerald-200":s.status==="rejected"?"bg-red-100 text-red-800 border border-red-200":"bg-blue-100 text-blue-800 border border-blue-200"}`,children:T[s.status]})]}),M&&e.jsx("div",{className:"bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(je,{className:"w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-amber-900 mb-1",children:"Action requise"}),e.jsx("p",{className:"text-sm text-amber-700",children:"Cette demande attend votre validation. Examinez les détails ci-dessous et décidez de l'approuver ou de la refuser."})]})]})}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(ve,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Informations client"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:s.client_name})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Téléphone:"}),e.jsx("p",{className:"font-medium text-slate-900",children:e.jsx("a",{href:`tel:${s.client_phone}`,className:"text-sky-600 hover:text-sky-700",children:s.client_phone})})]})]})]}),e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(H,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Produit"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:s.product_name||"Non spécifié"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Raison:"}),e.jsx("p",{className:"font-medium text-slate-900",children:s.reason})]})]})]})]}),e.jsxs("div",{className:"bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200 mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(Ne,{className:"w-5 h-5 text-sky-700"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Adresse de livraison"})]}),e.jsx("div",{className:"space-y-2 text-sm",children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(ye,{className:"w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-slate-900",children:s.client_address||"Non fournie"}),e.jsx("p",{className:"text-slate-700",children:s.client_city&&s.client_postal_code?`${s.client_city} ${s.client_postal_code}, ${s.client_country||"Tunisia"}`:"Informations incomplètes"})]})]})})]}),s.video&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(we,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Vidéo du produit"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm text-slate-600",children:[e.jsx(_e,{className:"w-4 h-4"}),e.jsxs("span",{children:["Enregistrée le"," ",new Date(s.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})," ","à"," ",new Date(s.created_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})]})]})]}),e.jsx("video",{src:s.video,controls:!0,className:"w-full max-h-96 rounded-lg border border-slate-200 bg-black"})]}),s.images&&s.images.length>0&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(H,{className:"w-5 h-5 text-emerald-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Images extraites de la vidéo"}),e.jsxs("span",{className:"text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full",children:[s.images.length," images"]})]}),e.jsx("div",{className:"grid grid-cols-4 gap-3",children:s.images.map((t,d)=>e.jsxs("div",{className:"relative group",children:[e.jsx("img",{src:t,alt:`Frame ${d+1}`,className:"w-full aspect-square object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(t,"_blank")}),e.jsxs("span",{className:"absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded",children:[d+1,"/",s.images.length]})]},d))})]}),s.photos&&s.photos.length>0&&e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold text-slate-900 mb-4",children:"Photos du produit"}),e.jsx("div",{className:"grid grid-cols-3 gap-4",children:s.photos.map((t,d)=>e.jsx("img",{src:t,alt:`Photo ${d+1}`,className:"w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(t,"_blank")},d))})]}),M&&e.jsxs("div",{className:"flex gap-3 mt-6 pt-6 border-t border-slate-200",children:[e.jsxs("button",{onClick:()=>$(!0),className:"flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(L,{className:"w-5 h-5"}),"Valider l'échange"]}),e.jsxs("button",{onClick:()=>D(!0),className:"flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(B,{className:"w-5 h-5"}),"Refuser"]})]}),!M&&s.status==="validated"&&e.jsxs("div",{className:"mt-6 space-y-3",children:[e.jsx("p",{className:"text-sm font-medium text-slate-700 text-center",children:"Imprimer le bordereau"}),s.jax_ean&&e.jsxs("div",{className:"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center",children:[e.jsx("p",{className:"text-xs text-emerald-700 mb-1",children:"Code JAX créé"}),e.jsx("p",{className:"font-mono font-bold text-emerald-900",children:s.jax_ean})]}),U&&e.jsxs("div",{className:"bg-red-50 border border-red-200 rounded-lg p-3 text-center",children:[e.jsx("p",{className:"text-sm text-red-700",children:U}),e.jsx("p",{className:"text-xs text-red-500 mt-1",children:"Vérifiez votre token JAX dans les paramètres"})]}),e.jsx("button",{onClick:me,disabled:E,className:`w-full py-3 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${E?"bg-slate-400 cursor-not-allowed":"bg-sky-600 hover:bg-sky-700"}`,children:E?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),e.jsx("span",{children:"Création du colis JAX..."})]}):e.jsxs(e.Fragment,{children:[e.jsx(Se,{className:"w-5 h-5"}),e.jsx("span",{children:s.jax_ean?"Réimprimer Bordereau":"Créer & Imprimer Bordereau"})]})}),e.jsx("p",{className:"text-xs text-slate-500 text-center",children:"Le colis sera créé automatiquement chez JAX Delivery"})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsx("h3",{className:"text-xl font-bold text-slate-900 mb-4",children:"Messages"}),e.jsx("div",{className:"space-y-4 mb-4 max-h-96 overflow-y-auto",children:q.length===0?e.jsx("p",{className:"text-slate-600 text-center py-8",children:"Aucun message"}):q.map(t=>e.jsxs("div",{className:`p-4 rounded-lg ${t.sender_type==="merchant"?"bg-sky-50 ml-auto max-w-md border border-sky-200":"bg-slate-100 mr-auto max-w-md border border-slate-200"}`,children:[e.jsx("p",{className:"text-sm font-medium text-slate-900 mb-1",children:t.sender_type==="merchant"?"Vous":s.client_name}),e.jsx("p",{className:"text-slate-700",children:t.message}),e.jsx("p",{className:"text-xs text-slate-500 mt-2",children:new Date(t.created_at).toLocaleString("fr-FR")})]},t.id))}),e.jsxs("form",{onSubmit:de,className:"flex gap-2",children:[e.jsx("input",{type:"text",value:R,onChange:t=>V(t.target.value),placeholder:"Votre message...",className:"flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors",children:e.jsx(ke,{className:"w-5 h-5"})})]})]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(Ae,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique de livraison du colis"})]}),h.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx(G,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600 mb-2",children:"Aucune tentative de livraison enregistrée"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Le client déclare vouloir échanger ce produit"})]}):e.jsxs("div",{className:"space-y-3",children:[s.delivery_accepted_on_attempt&&e.jsx("div",{className:"bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(L,{className:"w-4 h-4 text-emerald-600"}),e.jsxs("span",{className:"text-sm font-semibold text-emerald-900",children:["Colis accepté à la tentative"," ",s.delivery_accepted_on_attempt]})]})}),h.map((t,d)=>e.jsx("div",{className:`rounded-lg p-4 border ${t.status==="successful"?"bg-emerald-50 border-emerald-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`p-2 rounded-full ${t.status==="successful"?"bg-emerald-100":"bg-red-100"}`,children:t.status==="successful"?e.jsx(L,{className:`w-4 h-4 ${t.status==="successful"?"text-emerald-600":"text-red-600"}`}):e.jsx(B,{className:"w-4 h-4 text-red-600"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsxs("span",{className:`font-semibold text-sm ${t.status==="successful"?"text-emerald-900":"text-red-900"}`,children:["Tentative ",t.attempt_number]}),e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${t.status==="successful"?"bg-emerald-100 text-emerald-700 border border-emerald-300":"bg-red-100 text-red-700 border border-red-300"}`,children:t.status==="successful"?"Réussie":"Échouée"})]}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-slate-600 mb-2",children:[e.jsx(Ce,{className:"w-3 h-3"}),e.jsx("span",{children:new Date(t.attempt_date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})})]}),t.failure_reason&&e.jsxs("div",{className:"text-sm text-red-700 mb-1",children:[e.jsx("span",{className:"font-medium",children:"Raison: "}),t.failure_reason]}),t.notes&&e.jsxs("div",{className:"text-xs text-slate-600",children:[e.jsx("span",{className:"font-medium",children:"Notes: "}),t.notes]})]})]})},t.id)),h.length>0&&e.jsx("div",{className:`rounded-lg p-3 border mt-4 ${h.some(t=>t.status==="successful")?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(Re,{className:`w-4 h-4 mt-0.5 ${h.some(t=>t.status==="successful")?"text-amber-600":"text-red-600"}`}),e.jsx("div",{className:"text-xs",children:h.some(t=>t.status==="successful")?e.jsxs("p",{className:"text-amber-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Le client a accepté le colis après"," ",h.filter(t=>t.status==="failed").length," ","tentative(s) échouée(s), mais demande maintenant un échange."]}):e.jsxs("p",{className:"text-red-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Toutes les tentatives de livraison ont échoué (",h.length," tentative(s)). Le client demande maintenant un échange."]})})]})})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx($e,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique du client"})]}),g.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx(G,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600",children:"Premier échange de ce client"})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-2 text-center",children:[e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200",children:[e.jsx("div",{className:"text-2xl font-bold text-slate-900",children:m.total}),e.jsx("div",{className:"text-xs text-slate-600",children:"Échanges"})]}),e.jsxs("div",{className:"bg-emerald-50 rounded-lg p-3 border border-emerald-200",children:[e.jsx("div",{className:"text-2xl font-bold text-emerald-700",children:m.validated}),e.jsx("div",{className:"text-xs text-emerald-700",children:"Validés"})]}),e.jsxs("div",{className:"bg-red-50 rounded-lg p-3 border border-red-200",children:[e.jsx("div",{className:"text-2xl font-bold text-red-700",children:m.rejected}),e.jsx("div",{className:"text-xs text-red-700",children:"Refusés"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-semibold text-slate-700 mb-2",children:"Derniers échanges"}),g.slice(0,3).map(t=>e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("span",{className:"font-mono text-xs text-slate-600",children:t.exchange_code}),e.jsx("span",{className:`text-xs px-2 py-0.5 rounded-full ${t.status==="validated"||t.status==="completed"?"bg-emerald-100 text-emerald-700":t.status==="rejected"?"bg-red-100 text-red-700":"bg-amber-100 text-amber-700"}`,children:T[t.status]})]}),e.jsx("p",{className:"text-xs text-slate-600 truncate",children:t.reason}),e.jsx("p",{className:"text-xs text-slate-500 mt-1",children:new Date(t.created_at).toLocaleDateString("fr-FR")})]},t.id))]}),m.total>0&&e.jsx("div",{className:`rounded-lg p-3 border ${m.validated/m.total>=.7?"bg-emerald-50 border-emerald-200":m.validated/m.total>=.4?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(De,{className:`w-4 h-4 ${m.validated/m.total>=.7?"text-emerald-600":m.validated/m.total>=.4?"text-amber-600":"text-red-600"}`}),e.jsxs("span",{className:"text-sm font-medium",children:["Taux de validation:"," ",Math.round(m.validated/m.total*100),"%"]})]})})]})]})]})]}),ae&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-6",children:"Valider l'échange"}),e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"bg-sky-50 border border-sky-200 rounded-xl p-4",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(Ee,{className:"w-5 h-5 text-sky-700"}),e.jsx("h4",{className:"font-semibold text-slate-900",children:"Options de paiement"})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("label",{className:"flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors",children:[e.jsx("input",{type:"radio",name:"paymentType",value:"free",checked:b==="free",onChange:t=>X(t.target.value),className:"w-4 h-4 text-sky-600"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium text-slate-900",children:"Échange gratuit"}),e.jsx("div",{className:"text-sm text-slate-600",children:"Pas de frais supplémentaires"})]})]}),e.jsxs("label",{className:"flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-300 cursor-pointer hover:border-sky-500 transition-colors",children:[e.jsx("input",{type:"radio",name:"paymentType",value:"paid",checked:b==="paid",onChange:t=>X(t.target.value),className:"w-4 h-4 text-sky-600 mt-1"}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:"font-medium text-slate-900 mb-2",children:"Échange payant"}),b==="paid"&&e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm text-slate-700",children:"Montant à payer (TND)"}),e.jsx("input",{type:"number",step:"0.01",min:"0",value:O,onChange:t=>ie(t.target.value),placeholder:"0.00",className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"}),e.jsx("p",{className:"text-xs text-slate-600",children:"Pour différence de prix ou frais de livraison"})]})]})]})]})]})}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>$(!1),className:"flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors",children:"Annuler"}),e.jsx("button",{onClick:oe,className:"flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors",children:"Confirmer la validation"})]})]})})}),re&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-lg w-full",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-4",children:"Refuser l'échange"}),e.jsx("p",{className:"text-slate-600 mb-6",children:"Veuillez expliquer la raison du refus au client"}),e.jsx("textarea",{value:j,onChange:t=>le(t.target.value),placeholder:"Expliquez pourquoi l'échange est refusé...",rows:4,className:"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>D(!1),className:"flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors",children:"Annuler"}),e.jsx("button",{onClick:ce,className:"flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors",children:"Confirmer le refus"})]})]})})})]})})}export{Ns as default};
