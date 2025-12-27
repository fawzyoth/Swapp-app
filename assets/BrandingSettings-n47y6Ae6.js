import{s as p,j as e}from"./index-DJR32chX.js";import{u as F,r as l}from"./react-vendor-CTUriZ5h.js";import{Q as M}from"./qr-display-BZBHW9NW.js";import{M as y,P as Q}from"./MerchantLayout-DiPx1J-e.js";import{Q as U}from"./qr-code-ByVDLSXi.js";import{C as X}from"./check-circle-CyNeZd0p.js";import{A as D}from"./alert-circle-_Iqic_ih.js";import{P as B}from"./printer-B3I1m1op.js";import{S as V}from"./settings-C58fTzTa.js";import{c as b}from"./createLucideIcon-CMjKDoEE.js";import{E as G}from"./eye-B0fj8J_e.js";import{B as k}from"./building-2-D3YxmJoi.js";import{T as W}from"./trash-2-DAKlHNH6.js";import{P as H}from"./phone-BNQXnIac.js";import{M as K}from"./map-pin-DUtVdt2Q.js";import{S as J}from"./save-DeLrZxpc.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./package-ChDCFdB3.js";import"./truck-CgEV9F53.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=b("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=b("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=b("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);function Ce(){const C=F(),c=l.useRef(null),[S,P]=l.useState(!0),[g,f]=l.useState(!1),[z,m]=l.useState(!1),[v,n]=l.useState(""),[x,L]=l.useState(""),[d,j]=l.useState("exchange-paper"),[u,E]=l.useState(!1),[a,o]=l.useState({logo_base64:"",business_name:"",phone:"",business_address:"",business_city:"",business_postal_code:""}),[r,i]=l.useState({title:"Besoin d'echanger votre article ?",subtitle:"Scannez le QR code ci-dessous",instruction1:"1. Scannez le QR code avec votre telephone",instruction2:"2. Remplissez le formulaire d'echange",instruction3:"3. Nous vous contacterons sous 24h",footerText:"Service client disponible 7j/7",showLogo:!0,showPhone:!0});l.useEffect(()=>{R()},[]);const R=async()=>{try{const{data:{session:s}}=await p.auth.getSession();if(!s){C("/merchant/login");return}const{data:t}=await p.from("merchants").select("*").eq("email",s.user.email).maybeSingle();t&&(L(t.id),o({logo_base64:t.logo_base64||"",business_name:t.business_name||t.name||"",phone:t.phone||"",business_address:t.business_address||"",business_city:t.business_city||"",business_postal_code:t.business_postal_code||""}))}catch(s){console.error("Error fetching merchant data:",s),n("Erreur lors du chargement des donnees")}finally{P(!1)}},$=s=>{var w;const t=(w=s.target.files)==null?void 0:w[0];if(!t)return;if(t.size>5e5){n("L'image ne doit pas depasser 500 Ko");return}const h=new FileReader;h.onloadend=()=>{o(I=>({...I,logo_base64:h.result})),n("")},h.readAsDataURL(t)},T=()=>{o(s=>({...s,logo_base64:""})),c.current&&(c.current.value="")},N=()=>{const s=`https://fawzyoth.github.io/Swapp-app/#/client/exchange/new?merchant=${x}`;return console.log("QR Code URL:",s,"MerchantId:",x),s},A=()=>{const s=window.open("","","height=800,width=600");s&&(s.document.write(`
        <html>
        <head>
          <title>Fiche d'echange - ${a.business_name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { size: A5; margin: 10mm; }
            body {
              font-family: Arial, Helvetica, sans-serif;
              padding: 20px;
              max-width: 500px;
              margin: 0 auto;
              color: #1e293b;
            }
            .paper {
              border: 2px solid #0ea5e9;
              border-radius: 16px;
              padding: 24px;
              text-align: center;
              background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            }
            .header {
              margin-bottom: 20px;
            }
            .logo {
              max-width: 120px;
              max-height: 60px;
              margin-bottom: 12px;
            }
            .business-name {
              font-size: 18px;
              font-weight: bold;
              color: #0369a1;
              margin-bottom: 4px;
            }
            .phone {
              font-size: 14px;
              color: #64748b;
            }
            .title {
              font-size: 22px;
              font-weight: bold;
              color: #0c4a6e;
              margin-bottom: 8px;
            }
            .subtitle {
              font-size: 14px;
              color: #475569;
              margin-bottom: 20px;
            }
            .qr-container {
              background: white;
              padding: 16px;
              border-radius: 12px;
              display: inline-block;
              margin-bottom: 20px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .qr-container img {
              display: block;
            }
            .instructions {
              text-align: left;
              background: white;
              padding: 16px;
              border-radius: 12px;
              margin-bottom: 16px;
            }
            .instruction {
              font-size: 14px;
              color: #334155;
              padding: 8px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .instruction:last-child {
              border-bottom: none;
            }
            .footer {
              font-size: 12px;
              color: #64748b;
              margin-top: 16px;
            }
            .swapp-branding {
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px dashed #cbd5e1;
              font-size: 11px;
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <div class="paper">
            <div class="header">
              ${r.showLogo&&a.logo_base64?`<img src="${a.logo_base64}" alt="Logo" class="logo" />`:""}
              <div class="business-name">${a.business_name||"Votre Boutique"}</div>
              ${r.showPhone&&a.phone?`<div class="phone">${a.phone}</div>`:""}
            </div>

            <div class="title">${r.title}</div>
            <div class="subtitle">${r.subtitle}</div>

            <div class="qr-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(N())}" alt="QR Code" width="180" height="180" />
            </div>

            <div class="instructions">
              <div class="instruction">${r.instruction1}</div>
              <div class="instruction">${r.instruction2}</div>
              <div class="instruction">${r.instruction3}</div>
            </div>

            <div class="footer">${r.footerText}</div>

            <div class="swapp-branding">
              Powered by SWAPP - Plateforme d'echange
            </div>
          </div>
        </body>
        </html>
      `),s.document.close(),setTimeout(()=>{s.print()},500))},q=async s=>{s.preventDefault(),f(!0),n(""),m(!1);try{const{error:t}=await p.from("merchants").update({logo_base64:a.logo_base64||null,business_name:a.business_name||null,phone:a.phone,business_address:a.business_address||null,business_city:a.business_city||null,business_postal_code:a.business_postal_code||null}).eq("id",x);if(t)throw t;m(!0),setTimeout(()=>m(!1),3e3)}catch(t){console.error("Error saving branding:",t),n("Erreur lors de la sauvegarde")}finally{f(!1)}};return S?e.jsx(y,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})}):e.jsx(y,{children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsx("div",{className:"mb-6",children:e.jsx("h1",{className:"text-2xl font-bold text-slate-900",children:"Parametres"})}),e.jsxs("div",{className:"flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl",children:[e.jsxs("button",{onClick:()=>j("exchange-paper"),className:`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${d==="exchange-paper"?"bg-white text-emerald-600 shadow-sm":"text-slate-600 hover:text-slate-900"}`,children:[e.jsx(U,{className:"w-5 h-5"}),"Fiche QR Code"]}),e.jsxs("button",{onClick:()=>j("branding"),className:`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${d==="branding"?"bg-white text-sky-600 shadow-sm":"text-slate-600 hover:text-slate-900"}`,children:[e.jsx(Q,{className:"w-5 h-5"}),"Marque & Logo"]})]}),z&&e.jsxs("div",{className:"mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3",children:[e.jsx(X,{className:"w-5 h-5 text-emerald-600"}),e.jsx("span",{className:"text-emerald-800",children:"Modifications enregistrees avec succes"})]}),v&&e.jsxs("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3",children:[e.jsx(D,{className:"w-5 h-5 text-red-600"}),e.jsx("span",{className:"text-red-800",children:v})]}),d==="exchange-paper"&&e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden",children:[e.jsxs("div",{className:"bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4 flex items-center justify-between",children:[e.jsxs("div",{className:"text-white",children:[e.jsx("h2",{className:"text-lg font-bold",children:"Fiche d'Echange"}),e.jsx("p",{className:"text-emerald-100 text-sm",children:"Imprimez cette fiche et glissez-la dans vos colis"})]}),e.jsxs("button",{onClick:A,className:"flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors font-semibold shadow-lg",children:[e.jsx(B,{className:"w-5 h-5"}),"Imprimer"]})]}),e.jsx("div",{className:"p-6 bg-slate-50",children:e.jsx("div",{className:"max-w-sm mx-auto",children:e.jsxs("div",{className:"border-2 border-sky-400 rounded-2xl p-6 text-center shadow-lg",style:{background:"linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"},children:[e.jsxs("div",{className:"mb-4",children:[r.showLogo&&a.logo_base64&&e.jsx("img",{src:a.logo_base64,alt:"Logo",className:"max-w-[80px] max-h-[40px] mx-auto mb-2 object-contain"}),e.jsx("div",{className:"text-base font-bold text-sky-700",children:a.business_name||"Votre Boutique"}),r.showPhone&&a.phone&&e.jsx("div",{className:"text-xs text-slate-500",children:a.phone})]}),e.jsx("div",{className:"text-lg font-bold text-sky-900 mb-1",children:r.title}),e.jsx("div",{className:"text-xs text-slate-600 mb-4",children:r.subtitle}),e.jsx("div",{className:"bg-white p-3 rounded-xl inline-block mb-4 shadow-md",children:e.jsx(M,{value:N(),size:120,level:"M"})}),e.jsxs("div",{className:"bg-white rounded-xl p-3 text-left mb-3",children:[e.jsx("div",{className:"text-xs text-slate-700 py-1.5 border-b border-slate-100",children:r.instruction1}),e.jsx("div",{className:"text-xs text-slate-700 py-1.5 border-b border-slate-100",children:r.instruction2}),e.jsx("div",{className:"text-xs text-slate-700 py-1.5",children:r.instruction3})]}),e.jsx("div",{className:"text-[10px] text-slate-500",children:r.footerText}),e.jsx("div",{className:"mt-3 pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-400",children:"Powered by SWAPP"})]})})})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden",children:[e.jsxs("button",{onClick:()=>E(!u),className:"w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(V,{className:"w-5 h-5 text-slate-500"}),e.jsx("span",{className:"font-medium text-slate-700",children:"Personnaliser le contenu"})]}),u?e.jsx(Y,{className:"w-5 h-5 text-slate-400"}):e.jsx(O,{className:"w-5 h-5 text-slate-400"})]}),u&&e.jsxs("div",{className:"px-6 pb-6 border-t border-slate-100",children:[e.jsxs("div",{className:"grid md:grid-cols-2 gap-4 pt-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Titre principal"}),e.jsx("input",{type:"text",value:r.title,onChange:s=>i(t=>({...t,title:s.target.value})),className:"w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Sous-titre"}),e.jsx("input",{type:"text",value:r.subtitle,onChange:s=>i(t=>({...t,subtitle:s.target.value})),className:"w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Instruction 1"}),e.jsx("input",{type:"text",value:r.instruction1,onChange:s=>i(t=>({...t,instruction1:s.target.value})),className:"w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Instruction 2"}),e.jsx("input",{type:"text",value:r.instruction2,onChange:s=>i(t=>({...t,instruction2:s.target.value})),className:"w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Instruction 3"}),e.jsx("input",{type:"text",value:r.instruction3,onChange:s=>i(t=>({...t,instruction3:s.target.value})),className:"w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Pied de page"}),e.jsx("input",{type:"text",value:r.footerText,onChange:s=>i(t=>({...t,footerText:s.target.value})),className:"w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"})]})]}),e.jsxs("div",{className:"flex gap-6 mt-4 pt-4 border-t border-slate-100",children:[e.jsxs("label",{className:"flex items-center gap-2 cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:r.showLogo,onChange:s=>i(t=>({...t,showLogo:s.target.checked})),className:"w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"}),e.jsx("span",{className:"text-sm text-slate-700",children:"Afficher le logo"})]}),e.jsxs("label",{className:"flex items-center gap-2 cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:r.showPhone,onChange:s=>i(t=>({...t,showPhone:s.target.checked})),className:"w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"}),e.jsx("span",{className:"text-sm text-slate-700",children:"Afficher le telephone"})]})]})]})]}),e.jsx("div",{className:"bg-blue-50 border border-blue-200 rounded-xl p-4",children:e.jsxs("div",{className:"flex gap-3",children:[e.jsx("div",{className:"flex-shrink-0",children:e.jsx(G,{className:"w-5 h-5 text-blue-600 mt-0.5"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium text-blue-900 mb-1",children:"Comment ca marche ?"}),e.jsx("p",{className:"text-sm text-blue-700",children:"Imprimez cette fiche et glissez-la dans chaque colis. Vos clients scannent le QR code pour demander un echange facilement. Plus besoin d'imprimer un bordereau pour chaque echange !"})]})]})})]}),d==="branding"&&e.jsxs("form",{onSubmit:q,className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("h2",{className:"text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2",children:[e.jsx(_,{className:"w-5 h-5 text-sky-600"}),"Logo de l'entreprise"]}),e.jsxs("div",{className:"flex items-start gap-6",children:[e.jsx("div",{className:"w-32 h-32 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden",children:a.logo_base64?e.jsx("img",{src:a.logo_base64,alt:"Logo",className:"w-full h-full object-contain"}):e.jsx(k,{className:"w-12 h-12 text-slate-400"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("input",{ref:c,type:"file",accept:"image/*",onChange:$,className:"hidden",id:"logo-upload"}),e.jsxs("label",{htmlFor:"logo-upload",className:"inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition-colors",children:[e.jsx(_,{className:"w-4 h-4"}),"Telecharger une image"]}),a.logo_base64&&e.jsxs("button",{type:"button",onClick:T,className:"ml-3 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors",children:[e.jsx(W,{className:"w-4 h-4"}),"Supprimer"]}),e.jsx("p",{className:"text-sm text-slate-500 mt-3",children:"Format recommande: PNG ou JPG, max 500 Ko"})]})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("h2",{className:"text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2",children:[e.jsx(k,{className:"w-5 h-5 text-sky-600"}),"Informations de l'entreprise"]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Nom commercial"}),e.jsx("input",{type:"text",value:a.business_name,onChange:s=>o(t=>({...t,business_name:s.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"Nom de votre entreprise"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:[e.jsx(H,{className:"w-4 h-4 inline mr-1"}),"Telephone"]}),e.jsx("input",{type:"tel",value:a.phone,onChange:s=>o(t=>({...t,phone:s.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"+216 XX XXX XXX"})]})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("h2",{className:"text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2",children:[e.jsx(K,{className:"w-5 h-5 text-sky-600"}),"Adresse"]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Adresse"}),e.jsx("input",{type:"text",value:a.business_address,onChange:s=>o(t=>({...t,business_address:s.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"Rue, numero, etc."})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Ville"}),e.jsx("input",{type:"text",value:a.business_city,onChange:s=>o(t=>({...t,business_city:s.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"Tunis"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Code postal"}),e.jsx("input",{type:"text",value:a.business_postal_code,onChange:s=>o(t=>({...t,business_postal_code:s.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"1000"})]})]})]})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx("button",{type:"submit",disabled:g,className:"flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",children:g?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),"Enregistrement..."]}):e.jsxs(e.Fragment,{children:[e.jsx(J,{className:"w-5 h-5"}),"Enregistrer les modifications"]})})})]})]})})}export{Ce as default};
