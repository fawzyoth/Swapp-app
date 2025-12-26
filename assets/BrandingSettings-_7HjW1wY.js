import{s as x,j as e}from"./index-Bh_QX8JX.js";import{u as T,r as o}from"./react-vendor-CTUriZ5h.js";import{Q as R}from"./qr-display-BZBHW9NW.js";import{M as v,P as $}from"./MerchantLayout-zId9QWpS.js";import{C as F}from"./check-circle-CyNeZd0p.js";import{A as q}from"./alert-circle-_Iqic_ih.js";import{c as I}from"./createLucideIcon-CMjKDoEE.js";import{B as j}from"./building-2-D3YxmJoi.js";import{T as M}from"./trash-2-DAKlHNH6.js";import{P as Q}from"./phone-BNQXnIac.js";import{M as X}from"./map-pin-DUtVdt2Q.js";import{S as B}from"./save-DeLrZxpc.js";import{Q as U}from"./qr-code-ByVDLSXi.js";import{F as D}from"./file-text-B3Ewreww.js";import{P as V}from"./printer-B3I1m1op.js";import{E as G}from"./eye-B0fj8J_e.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./menu-DP2azNEK.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./package-ChDCFdB3.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./log-out-BX30H4-p.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=I("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);function Ne(){const y=T(),d=o.useRef(null),[w,k]=o.useState(!0),[u,p]=o.useState(!1),[_,c]=o.useState(!1),[h,n]=o.useState(""),[b,P]=o.useState(""),[a,l]=o.useState({logo_base64:"",business_name:"",phone:"",business_address:"",business_city:"",business_postal_code:""}),[r,i]=o.useState({title:"Besoin d'echanger votre article ?",subtitle:"Scannez le QR code ci-dessous",instruction1:"1. Scannez le QR code avec votre telephone",instruction2:"2. Remplissez le formulaire d'echange",instruction3:"3. Nous vous contacterons sous 24h",footerText:"Service client disponible 7j/7",showLogo:!0,showPhone:!0}),[W,H]=o.useState(!1);o.useEffect(()=>{S()},[]);const S=async()=>{try{const{data:{session:t}}=await x.auth.getSession();if(!t){y("/merchant/login");return}const{data:s}=await x.from("merchants").select("*").eq("email",t.user.email).maybeSingle();s&&(P(s.id),l({logo_base64:s.logo_base64||"",business_name:s.business_name||s.name||"",phone:s.phone||"",business_address:s.business_address||"",business_city:s.business_city||"",business_postal_code:s.business_postal_code||""}))}catch(t){console.error("Error fetching merchant data:",t),n("Erreur lors du chargement des donnees")}finally{k(!1)}},C=t=>{var f;const s=(f=t.target.files)==null?void 0:f[0];if(!s)return;if(s.size>5e5){n("L'image ne doit pas depasser 500 Ko");return}const m=new FileReader;m.onloadend=()=>{l(L=>({...L,logo_base64:m.result})),n("")},m.readAsDataURL(s)},z=()=>{l(t=>({...t,logo_base64:""})),d.current&&(d.current.value="")},g=()=>`https://fawzyoth.github.io/Swapp-app/#/client/exchange?merchant=${b}`,E=()=>{const t=window.open("","","height=800,width=600");t&&(t.document.write(`
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
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(g())}" alt="QR Code" width="180" height="180" />
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
      `),t.document.close(),setTimeout(()=>{t.print()},500))},A=async t=>{t.preventDefault(),p(!0),n(""),c(!1);try{const{error:s}=await x.from("merchants").update({logo_base64:a.logo_base64||null,business_name:a.business_name||null,phone:a.phone,business_address:a.business_address||null,business_city:a.business_city||null,business_postal_code:a.business_postal_code||null}).eq("id",b);if(s)throw s;c(!0),setTimeout(()=>c(!1),3e3)}catch(s){console.error("Error saving branding:",s),n("Erreur lors de la sauvegarde")}finally{p(!1)}};return w?e.jsx(v,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})})}):e.jsx(v,{children:e.jsxs("div",{className:"max-w-3xl mx-auto",children:[e.jsxs("div",{className:"mb-8",children:[e.jsxs("h1",{className:"text-3xl font-bold text-slate-900 flex items-center gap-3",children:[e.jsx($,{className:"w-8 h-8 text-sky-600"}),"Parametres de Marque"]}),e.jsx("p",{className:"text-slate-600 mt-2",children:"Personnalisez votre logo et vos informations de contact pour les bordereaux"})]}),_&&e.jsxs("div",{className:"mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3",children:[e.jsx(F,{className:"w-5 h-5 text-emerald-600"}),e.jsx("span",{className:"text-emerald-800",children:"Modifications enregistrees avec succes"})]}),h&&e.jsxs("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3",children:[e.jsx(q,{className:"w-5 h-5 text-red-600"}),e.jsx("span",{className:"text-red-800",children:h})]}),e.jsxs("form",{onSubmit:A,className:"space-y-8",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("h2",{className:"text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2",children:[e.jsx(N,{className:"w-5 h-5 text-sky-600"}),"Logo de l'entreprise"]}),e.jsxs("div",{className:"flex items-start gap-6",children:[e.jsx("div",{className:"w-32 h-32 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden",children:a.logo_base64?e.jsx("img",{src:a.logo_base64,alt:"Logo",className:"w-full h-full object-contain"}):e.jsx(j,{className:"w-12 h-12 text-slate-400"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("input",{ref:d,type:"file",accept:"image/*",onChange:C,className:"hidden",id:"logo-upload"}),e.jsxs("label",{htmlFor:"logo-upload",className:"inline-flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition-colors",children:[e.jsx(N,{className:"w-4 h-4"}),"Telecharger une image"]}),a.logo_base64&&e.jsxs("button",{type:"button",onClick:z,className:"ml-3 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors",children:[e.jsx(M,{className:"w-4 h-4"}),"Supprimer"]}),e.jsx("p",{className:"text-sm text-slate-500 mt-3",children:"Format recommande: PNG ou JPG, max 500 Ko"})]})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("h2",{className:"text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2",children:[e.jsx(j,{className:"w-5 h-5 text-sky-600"}),"Informations de l'entreprise"]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Nom commercial"}),e.jsx("input",{type:"text",value:a.business_name,onChange:t=>l(s=>({...s,business_name:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"Nom de votre entreprise"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:[e.jsx(Q,{className:"w-4 h-4 inline mr-1"}),"Telephone"]}),e.jsx("input",{type:"tel",value:a.phone,onChange:t=>l(s=>({...s,phone:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"+216 XX XXX XXX"})]})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("h2",{className:"text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2",children:[e.jsx(X,{className:"w-5 h-5 text-sky-600"}),"Adresse"]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Adresse"}),e.jsx("input",{type:"text",value:a.business_address,onChange:t=>l(s=>({...s,business_address:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"Rue, numero, etc."})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Ville"}),e.jsx("input",{type:"text",value:a.business_city,onChange:t=>l(s=>({...s,business_city:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"Tunis"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Code postal"}),e.jsx("input",{type:"text",value:a.business_postal_code,onChange:t=>l(s=>({...s,business_postal_code:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500",placeholder:"1000"})]})]})]})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx("button",{type:"submit",disabled:u,className:"flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",children:u?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),"Enregistrement..."]}):e.jsxs(e.Fragment,{children:[e.jsx(B,{className:"w-5 h-5"}),"Enregistrer les modifications"]})})})]}),e.jsxs("div",{className:"mt-12 pt-8 border-t border-slate-200",children:[e.jsxs("div",{className:"mb-8",children:[e.jsxs("h2",{className:"text-2xl font-bold text-slate-900 flex items-center gap-3",children:[e.jsx(U,{className:"w-7 h-7 text-emerald-600"}),"Fiche d'Echange QR Code"]}),e.jsx("p",{className:"text-slate-600 mt-2",children:"Personnalisez et imprimez une fiche avec un QR code que vos clients peuvent scanner pour demander un echange"})]}),e.jsxs("div",{className:"grid lg:grid-cols-2 gap-8",children:[e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2",children:[e.jsx(D,{className:"w-5 h-5 text-emerald-600"}),"Personnaliser le texte"]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Titre principal"}),e.jsx("input",{type:"text",value:r.title,onChange:t=>i(s=>({...s,title:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Sous-titre"}),e.jsx("input",{type:"text",value:r.subtitle,onChange:t=>i(s=>({...s,subtitle:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Instruction 1"}),e.jsx("input",{type:"text",value:r.instruction1,onChange:t=>i(s=>({...s,instruction1:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Instruction 2"}),e.jsx("input",{type:"text",value:r.instruction2,onChange:t=>i(s=>({...s,instruction2:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Instruction 3"}),e.jsx("input",{type:"text",value:r.instruction3,onChange:t=>i(s=>({...s,instruction3:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-slate-700 mb-1",children:"Texte du pied de page"}),e.jsx("input",{type:"text",value:r.footerText,onChange:t=>i(s=>({...s,footerText:t.target.value})),className:"w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"})]}),e.jsxs("div",{className:"flex gap-6 pt-2",children:[e.jsxs("label",{className:"flex items-center gap-2 cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:r.showLogo,onChange:t=>i(s=>({...s,showLogo:t.target.checked})),className:"w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"}),e.jsx("span",{className:"text-sm text-slate-700",children:"Afficher le logo"})]}),e.jsxs("label",{className:"flex items-center gap-2 cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:r.showPhone,onChange:t=>i(s=>({...s,showPhone:t.target.checked})),className:"w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"}),e.jsx("span",{className:"text-sm text-slate-700",children:"Afficher le telephone"})]})]})]})]}),e.jsxs("button",{type:"button",onClick:E,className:"w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold text-lg shadow-lg",children:[e.jsx(V,{className:"w-6 h-6"}),"Imprimer la fiche d'echange"]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("h3",{className:"text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2",children:[e.jsx(G,{className:"w-5 h-5 text-emerald-600"}),"Apercu en direct"]}),e.jsxs("div",{className:"border-2 border-sky-400 rounded-2xl p-6 text-center",style:{background:"linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"},children:[e.jsxs("div",{className:"mb-5",children:[r.showLogo&&a.logo_base64&&e.jsx("img",{src:a.logo_base64,alt:"Logo",className:"max-w-[100px] max-h-[50px] mx-auto mb-3 object-contain"}),e.jsx("div",{className:"text-lg font-bold text-sky-700",children:a.business_name||"Votre Boutique"}),r.showPhone&&a.phone&&e.jsx("div",{className:"text-sm text-slate-500",children:a.phone})]}),e.jsx("div",{className:"text-xl font-bold text-sky-900 mb-2",children:r.title}),e.jsx("div",{className:"text-sm text-slate-600 mb-5",children:r.subtitle}),e.jsx("div",{className:"bg-white p-4 rounded-xl inline-block mb-5 shadow-md",children:e.jsx(R,{value:g(),size:140,level:"M"})}),e.jsxs("div",{className:"bg-white rounded-xl p-4 text-left mb-4",children:[e.jsx("div",{className:"text-sm text-slate-700 py-2 border-b border-slate-100",children:r.instruction1}),e.jsx("div",{className:"text-sm text-slate-700 py-2 border-b border-slate-100",children:r.instruction2}),e.jsx("div",{className:"text-sm text-slate-700 py-2",children:r.instruction3})]}),e.jsx("div",{className:"text-xs text-slate-500",children:r.footerText}),e.jsx("div",{className:"mt-4 pt-3 border-t border-dashed border-slate-300 text-xs text-slate-400",children:"Powered by SWAPP"})]}),e.jsx("p",{className:"text-xs text-slate-500 mt-4 text-center",children:"Taille d'impression recommandee: A5 ou A6"})]})]})]})]})})}export{Ne as default};
