import{s as n,j as e,S as te}from"./index-BqLLfkOr.js";import{r as a,h as Me,u as Ae}from"./react-vendor-CTUriZ5h.js";import{M as ae}from"./MerchantLayout-Fa0GU5HX.js";import{V as oe}from"./video-Cwp6uQ4V.js";import{X as $e}from"./x-D4qrk5Qy.js";import{S as ce}from"./send-DlqxrGT5.js";import{A as ve}from"./alert-circle-_Iqic_ih.js";import{U as K}from"./user-DEx4Ce9L.js";import{P as Re}from"./phone-BNQXnIac.js";import{C as Ne}from"./clock-Dhxn45-3.js";import{I as O,s as Ie,a as Le,b as ze}from"./smsService-qtIlF6gc.js";import{b as Oe,c as Pe,D as qe,J as Ve}from"./jaxService-Czfmsyg_.js";import{A as Xe}from"./arrow-left-CxjwE-xR.js";import{A as Fe}from"./alert-triangle-1NuODUVJ.js";import{P as re}from"./package-ChDCFdB3.js";import{M as Be}from"./map-pin-DUtVdt2Q.js";import{H as Je}from"./home-9mW_oZwz.js";import{C as $}from"./check-circle-CyNeZd0p.js";import{X as fe}from"./x-circle-D3f66Y07.js";import{P as le}from"./printer-B3I1m1op.js";import{T as ne}from"./truck-CgEV9F53.js";import{C as Ue}from"./calendar-upMk3ayk.js";import{T as He}from"./trending-up-9gPHMyOx.js";import{C as ie}from"./check-Cm21nyZb.js";import{D as de}from"./dollar-sign-C401I3Os.js";import"./supabase-Bl4YWSQ9.js";import"./menu-DP2azNEK.js";import"./createLucideIcon-CMjKDoEE.js";import"./store-B-5iV_wL.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./banknote-JI0QWWz-.js";import"./message-square-B53yKzw3.js";import"./star-Cw7sdsKF.js";import"./log-out-BX30H4-p.js";async function Ge(r){const{clientPhone:p,clientName:s,videoCallLink:u,videoCallId:C}=r,f=`Bonjour ${s}, vous etes invite a un appel video.
Lien: ${u}
Duree max: 5 minutes. L'appel peut etre enregistre.`;console.log("=".repeat(50)),console.log("[SMS SIMULATION]"),console.log("=".repeat(50)),console.log(`To: ${p}`),console.log("Message:"),console.log(f),console.log("=".repeat(50));try{const{data:j,error:E}=await n.from("sms_logs").insert({video_call_id:C,recipient_phone:p,message_content:f,status:"sent",sent_at:new Date().toISOString()}).select().single();return E?(console.error("Error saving SMS log:",E),{success:!1,message:"Erreur lors de l'envoi du SMS"}):(await n.from("video_calls").update({sms_sent_at:new Date().toISOString()}).eq("id",C),{success:!0,message:"SMS envoye avec succes (simulation)",smsLogId:j==null?void 0:j.id})}catch(j){return console.error("SMS service error:",j),{success:!1,message:"Erreur technique lors de l'envoi"}}}function Ke(){const r=Date.now().toString(36),p=Math.random().toString(36).substring(2,8);return`room-${r}-${p}`}function Qe(r){return`${typeof window<"u"?window.location.origin:"http://localhost:5173"}/call/${r}`}function We({isOpen:r,onClose:p,clientName:s,clientPhone:u,exchangeId:C,onSuccess:f}){const[j,E]=a.useState(!1),[Q,P]=a.useState(""),[y,v]=a.useState(!1),[W,q]=a.useState("");if(!r)return null;const Y=async()=>{E(!0),P("");try{const g="11111111-1111-1111-1111-111111111111",_=Ke(),h=Qe(_),{data:T,error:w}=await n.from("video_calls").insert({exchange_id:C||null,merchant_id:g,client_phone:u,client_name:s,room_id:_,status:"pending",max_duration_seconds:300,recording_consent:!1}).select().single();if(w)throw w;const M=await Ge({clientPhone:u,clientName:s,videoCallLink:h,videoCallId:T.id});if(!M.success)throw new Error(M.message);q(h),v(!0),f&&f(T.id,_)}catch(g){console.error("Error sending invite:",g),P(g.message||"Erreur lors de l'envoi de l'invitation")}finally{E(!1)}},R=()=>{v(!1),P(""),q(""),p()};return e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-md w-full",children:e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-sky-100 rounded-lg",children:e.jsx(oe,{className:"w-6 h-6 text-sky-600"})}),e.jsx("h2",{className:"text-xl font-bold text-slate-900",children:"Inviter a un appel video"})]}),e.jsx("button",{onClick:R,className:"p-2 hover:bg-slate-100 rounded-full transition-colors",children:e.jsx($e,{className:"w-5 h-5 text-slate-500"})})]}),y?e.jsxs("div",{className:"text-center py-6",children:[e.jsx("div",{className:"inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4",children:e.jsx(ce,{className:"w-8 h-8 text-emerald-600"})}),e.jsx("h3",{className:"text-lg font-semibold text-slate-900 mb-2",children:"Invitation envoyee !"}),e.jsxs("p",{className:"text-slate-600 mb-4",children:["Un SMS a ete envoye a ",s]}),e.jsxs("div",{className:"bg-slate-50 rounded-lg p-4 mb-4",children:[e.jsx("p",{className:"text-xs text-slate-500 mb-1",children:"Lien de l'appel:"}),e.jsx("p",{className:"text-sm font-mono text-sky-600 break-all",children:W})]}),e.jsx("p",{className:"text-xs text-slate-500 mb-6",children:"Consultez la console du navigateur pour voir le SMS simule"}),e.jsx("button",{onClick:R,className:"px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors",children:"Fermer"})]}):e.jsxs(e.Fragment,{children:[Q&&e.jsxs("div",{className:"mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3",children:[e.jsx(ve,{className:"w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"}),e.jsx("p",{className:"text-red-700 text-sm",children:Q})]}),e.jsxs("div",{className:"space-y-4 mb-6",children:[e.jsxs("div",{className:"flex items-center gap-3 p-4 bg-slate-50 rounded-lg",children:[e.jsx(K,{className:"w-5 h-5 text-slate-500"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-slate-500",children:"Client"}),e.jsx("p",{className:"font-medium text-slate-900",children:s})]})]}),e.jsxs("div",{className:"flex items-center gap-3 p-4 bg-slate-50 rounded-lg",children:[e.jsx(Re,{className:"w-5 h-5 text-slate-500"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-slate-500",children:"Telephone"}),e.jsx("p",{className:"font-medium text-slate-900",children:u})]})]}),e.jsxs("div",{className:"flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200",children:[e.jsx(Ne,{className:"w-5 h-5 text-amber-600"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs text-amber-600",children:"Duree maximale"}),e.jsx("p",{className:"font-medium text-amber-700",children:"5 minutes"})]})]})]}),e.jsx("p",{className:"text-sm text-slate-600 mb-6",children:"Un SMS sera envoye au client avec un lien pour rejoindre l'appel video. L'appel peut etre enregistre avec le consentement du client."}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:R,className:"flex-1 px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors",children:"Annuler"}),e.jsxs("button",{onClick:Y,disabled:j,className:"flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-lg font-medium transition-colors",children:[e.jsx(ce,{className:"w-5 h-5"}),j?"Envoi...":"Envoyer SMS"]})]})]})]})})})}const k=9,je={"demo-1":{id:"demo-1",exchange_code:"EXC-2024-001",client_name:"Ahmed Ben Ali",client_phone:"+216 55 123 456",client_address:"15 Rue de la Liberte",client_city:"Tunis",client_postal_code:"1000",client_country:"Tunisie",product_name:"T-Shirt Nike - Taille L",reason:"Taille incorrecte",status:"pending",payment_amount:0,payment_status:"pending",created_at:new Date().toISOString(),video:null,images:null},"demo-2":{id:"demo-2",exchange_code:"EXC-2024-002",client_name:"Leila Mansouri",client_phone:"+216 98 111 222",client_address:"42 Avenue Habib Bourguiba",client_city:"Sfax",client_postal_code:"3000",client_country:"Tunisie",product_name:"Robe Zara - Rouge",reason:"Couleur non conforme",status:"pending",payment_amount:15,payment_status:"pending",created_at:new Date(Date.now()-36e5).toISOString(),video:null,images:null},"demo-3":{id:"demo-3",exchange_code:"EXC-2024-003",client_name:"Karim Bouzid",client_phone:"+216 22 333 444",client_address:"8 Rue Ibn Khaldoun",client_city:"Sousse",client_postal_code:"4000",client_country:"Tunisie",product_name:"Chaussures Adidas - 42",reason:"Produit defectueux",status:"pending",payment_amount:0,payment_status:"pending",created_at:new Date(Date.now()-72e5).toISOString(),video:null,images:null},"demo-4":{id:"demo-4",exchange_code:"EXC-2024-004",client_name:"Fatma Trabelsi",client_phone:"+216 22 987 654",client_address:"25 Rue de Marseille",client_city:"Tunis",client_postal_code:"1000",client_country:"Tunisie",product_name:"Sac a main Guess",reason:"Ne correspond pas a la description",status:"validated",payment_amount:0,payment_status:"free",validated_at:new Date(Date.now()-864e5).toISOString(),created_at:new Date(Date.now()-864e5*2).toISOString(),video:null,images:null},"demo-9":{id:"demo-9",exchange_code:"EXC-2024-009",client_name:"Mohamed Kacem",client_phone:"+216 98 456 123",client_address:"55 Rue de Rome",client_city:"Tunis",client_postal_code:"1000",client_country:"Tunisie",product_name:"Smartphone Samsung Galaxy",reason:"Batterie defectueuse",status:"completed",payment_amount:0,payment_status:"free",return_product_status:"accepted",return_product_notes:"Produit en bon etat, echange effectue",completed_at:new Date(Date.now()-864e5*2).toISOString(),created_at:new Date(Date.now()-864e5*5).toISOString(),video:null,images:null},"demo-11":{id:"demo-11",exchange_code:"EXC-2024-011",client_name:"Raouf Jebali",client_phone:"+216 58 777 888",client_address:"9 Rue de Hollande",client_city:"Sousse",client_postal_code:"4000",client_country:"Tunisie",product_name:"Casque Beats Solo",reason:"Son defectueux",status:"completed",payment_amount:0,payment_status:"free",return_product_status:"problem",return_product_notes:"Legere rayure sur le produit retourne",completed_at:new Date(Date.now()-864e5*4).toISOString(),created_at:new Date(Date.now()-864e5*7).toISOString(),video:null,images:null},"demo-12":{id:"demo-12",exchange_code:"EXC-2024-012",client_name:"Sarra Bouaziz",client_phone:"+216 50 789 012",client_address:"14 Rue de Grece",client_city:"Tunis",client_postal_code:"1000",client_country:"Tunisie",product_name:"Lunettes Ray-Ban",reason:"Ne me plait plus",status:"rejected",rejection_reason:"Delai de retour depasse (30 jours)",created_at:new Date(Date.now()-864e5*8).toISOString(),video:null,images:null}},Ye={id:"demo-123",exchange_code:"EXC-DEMO-2024",client_name:"Ahmed Ben Ali",client_phone:"+216 55 123 456",client_address:"15 Rue de la Liberte",client_city:"Tunis",client_postal_code:"1000",client_country:"Tunisie",product_name:"T-Shirt Nike - Taille L",reason:"Taille incorrecte",status:"pending",payment_amount:0,payment_status:"pending",created_at:new Date().toISOString(),video:null,images:null},Ze=[{id:"msg-1",sender_type:"client",message:"Bonjour, j'ai commande une taille L mais j'ai recu une taille M. Je voudrais echanger.",created_at:new Date(Date.now()-36e5).toISOString()},{id:"msg-2",sender_type:"merchant",message:"Bonjour, nous avons bien recu votre demande. Nous allons l'examiner.",created_at:new Date(Date.now()-18e5).toISOString()}],es=[{id:"hist-1",exchange_code:"EXC-ABC123",reason:"Couleur non conforme",status:"completed",created_at:new Date(Date.now()-864e5*30).toISOString()},{id:"hist-2",exchange_code:"EXC-DEF456",reason:"Produit defectueux",status:"validated",created_at:new Date(Date.now()-864e5*60).toISOString()}];function qs(){const{id:r}=Me(),p=Ae(),[s,u]=a.useState(null),[C,f]=a.useState(null),[j,E]=a.useState(null),[Q,P]=a.useState(!1),[y,v]=a.useState([]),[W,q]=a.useState([]),[Y,R]=a.useState([]),[g,_]=a.useState([]),[h,T]=a.useState([]),[w,M]=a.useState(""),[ye,I]=a.useState(!1),[_e,L]=a.useState(!1),[ss,ts]=a.useState(""),[as,rs]=a.useState(""),[V,me]=a.useState("0"),[i,Z]=a.useState("free"),[S,xe]=a.useState(""),[we,X]=a.useState(!0),[ee,F]=a.useState(!1),[ue,he]=a.useState(!1),[pe,B]=a.useState(null),[Se,J]=a.useState(!1),[b,De]=a.useState(()=>sessionStorage.getItem("demo_mode")==="true");a.useEffect(()=>{b?ke():U()},[r,b]);const ke=()=>{X(!0),setTimeout(()=>{const t=r&&je[r]?je[r]:Ye;u(t),v(Ze),_(es),T([]),f({id:"demo-merchant",name:"Boutique Demo",business_name:"Ma Boutique Demo",phone:"+216 70 000 000",business_address:"Avenue Habib Bourguiba, Tunis",business_city:"Tunis"}),X(!1)},500)},ge=()=>{De(!b),u(null),v([]),_([]),T([]),I(!1),L(!1),Z("free"),me("0")},U=async()=>{var t,o;try{const{data:{session:l}}=await n.auth.getSession();console.log("Session email:",(t=l==null?void 0:l.user)==null?void 0:t.email);const{data:c}=await n.from("exchanges").select("*").eq("id",r).maybeSingle();if(!c){X(!1);return}console.log("Exchange merchant_id:",c.merchant_id),u(c);const[N,z,A,H,G,d]=await Promise.all([n.from("messages").select("id, sender_type, message, created_at").eq("exchange_id",r).order("created_at",{ascending:!0}),n.from("transporters").select("id, name"),n.from("mini_depots").select("id, name, address"),n.from("exchanges").select("id, exchange_code, reason, status, created_at").eq("client_phone",c.client_phone).neq("id",r).order("created_at",{ascending:!1}).limit(5),n.from("delivery_attempts").select("*").eq("exchange_id",r).order("attempt_number",{ascending:!0}).then(x=>x.error?{data:[]}:x).catch(()=>({data:[]})),(o=l==null?void 0:l.user)!=null&&o.email?n.from("merchants").select("id, name, business_name, phone, business_address, business_city").eq("email",l.user.email).maybeSingle():Promise.resolve({data:null})]);console.log("Merchant query result:",d),v(N.data||[]),q(z.data||[]),R(A.data||[]),_(H.data||[]),T(G.data||[]),f(d.data||null)}catch(l){console.error("Error fetching data:",l)}finally{X(!1)}},Ce=async t=>{if(t.preventDefault(),!!w.trim()){if(b){v([...y,{id:`msg-demo-${Date.now()}`,sender_type:"merchant",message:w,created_at:new Date().toISOString()}]),M("");return}try{await n.from("messages").insert({exchange_id:r,sender_type:"merchant",message:w}),s&&r&&await Ie(s.client_phone,s.client_name,s.exchange_code,r),M(""),U()}catch(o){console.error("Error sending message:",o)}}},Ee=async()=>{const t=i==="free"?0:parseFloat(V),o=k,l=i==="free"?o:0;if(b){u({...s,status:"validated",payment_amount:t,delivery_fee:o,merchant_delivery_charge:l,payment_status:i==="free"?"free":"pending"}),v([...y,{id:`msg-demo-${Date.now()}`,sender_type:"merchant",message:i==="free"?"Votre échange a été validé. Aucun paiement supplémentaire requis.":`Votre échange a été validé. Montant à payer: ${t.toFixed(2)} TND.`,created_at:new Date().toISOString()}]),I(!1),J(!0);return}try{await n.from("exchanges").update({status:"validated",payment_amount:t,delivery_fee:o,merchant_delivery_charge:l,payment_status:i==="free"?"free":"pending",updated_at:new Date().toISOString()}).eq("id",r),await n.from("status_history").insert({exchange_id:r,status:"validated"});const c=i==="free"?"Votre échange a été validé. Aucun paiement supplémentaire requis.":`Votre échange a été validé. Montant à payer: ${t.toFixed(2)} TND.`;if(await n.from("messages").insert({exchange_id:r,sender_type:"merchant",message:c}),s){const N=new Date;N.setDate(N.getDate()+3);const z=N.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});await Le(s.client_phone,s.client_name,s.exchange_code,z)}I(!1),J(!0),U()}catch(c){console.error("Error validating exchange:",c)}},Te=async()=>{if(!S.trim()){alert("Veuillez fournir une raison pour le refus");return}if(b){u({...s,status:"rejected",rejection_reason:S}),v([...y,{id:`msg-demo-${Date.now()}`,sender_type:"merchant",message:`Votre demande d'échange a été refusée. Raison: ${S}`,created_at:new Date().toISOString()}]),L(!1),xe("");return}try{await n.from("exchanges").update({status:"rejected",rejection_reason:S,updated_at:new Date().toISOString()}).eq("id",r),await n.from("status_history").insert({exchange_id:r,status:"rejected"}),await n.from("messages").insert({exchange_id:r,sender_type:"merchant",message:`Votre demande d'échange a été refusée. Raison: ${S}`}),s&&await ze(s.client_phone,s.client_name,s.exchange_code,S),L(!1),U()}catch(t){console.error("Error rejecting exchange:",t)}},be=async()=>{var H,G;if(!s)return;const t=Y.find(d=>d.id===s.mini_depot_id),o=W.find(d=>d.id===s.transporter_id);let l=s.jax_ean,c=C;if(!c){const{data:{session:d}}=await n.auth.getSession();if(console.log("Fetching merchant for email:",(H=d==null?void 0:d.user)==null?void 0:H.email),(G=d==null?void 0:d.user)!=null&&G.email){const{data:x,error:D}=await n.from("merchants").select("id, name, business_name, phone, business_address, business_city").eq("email",d.user.email).maybeSingle();console.log("Fresh merchant data:",x),console.log("Merchant query error:",D),x&&(c=x,f(x))}}console.log("Merchant data for JAX:",c),console.log("business_name:",c==null?void 0:c.business_name),console.log("name:",c==null?void 0:c.name);const N=qe;if(!l&&N){F(!0),B(null);try{const d=Oe(s,c||{}),x=await Pe(N,d);if(x.success&&x.ean){l=x.ean;try{console.log("Saving JAX EAN to database:",l,"for exchange:",s.id);const D=await n.from("exchanges").update({jax_ean:l,jax_created_at:new Date().toISOString(),status:"ready_for_pickup"}).eq("id",s.id);console.log("JAX EAN update result:",D),D.error?console.error("Could not save jax_ean to database:",D.error.message):(console.log("JAX EAN saved successfully!"),await n.from("status_history").insert({exchange_id:s.id,status:"ready_for_pickup"}))}catch(D){console.error("Error saving jax_ean:",D)}u({...s,jax_ean:l,status:"ready_for_pickup"})}else{B(x.error||x.message||"Erreur lors de la création du colis JAX"),F(!1);return}}catch(d){console.error("JAX API Error:",d),d instanceof Ve?B(d.message):B("Erreur de connexion à JAX"),F(!1);return}F(!1)}const z=`https://fawzyoth.github.io/Swapp-app/#/delivery/verify/${s.exchange_code}`,A=window.open("","","height=800,width=600");A&&(A.document.write(`
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
            ${l?`<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #000; font-size: 12px;"><strong>JAX:</strong> <span style="font-family: 'Courier New', monospace;">${l}</span></div>`:""}
          </div>

          <div class="codes-section">
            <div class="code-box">
              <div class="title">QR Vérification</div>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(z)}" alt="QR Code" width="100" height="100" />
              <div class="code-label">SCAN LIVREUR</div>
            </div>
            <div class="code-box">
              <div class="title">Code-Barres JAX</div>
              <img src="https://barcodeapi.org/api/128/${l||s.exchange_code.slice(-8)}" alt="Barcode" width="160" height="50" />
              <div class="code-label">${l||s.exchange_code.slice(-8)}</div>
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

          ${o?`
          <table class="info-table">
            <tr>
              <th>Transporteur</th>
              <td>${o.name}</td>
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
            <div>Statut: ${te[s.status]}</div>
          </div>
        </body>
        </html>
      `),A.document.close(),setTimeout(()=>{A.print()},500))};if(we)return e.jsxs(ae,{children:[e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"})}),ue&&s&&e.jsx(We,{isOpen:ue,onClose:()=>he(!1),clientPhone:s.client_phone,clientName:s.client_name,exchangeId:s.id})]});if(!s)return e.jsx(ae,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-2",children:"Échange non trouvé"}),e.jsx("button",{onClick:()=>p("/merchant/exchanges"),className:"px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700",children:"Retour aux échanges"})]})})});const se=s.status==="pending",m={total:g.length,validated:g.filter(t=>t.status==="validated"||t.status==="completed").length,rejected:g.filter(t=>t.status==="rejected").length};return e.jsx(ae,{children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("button",{onClick:()=>p("/merchant/exchanges"),className:"flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors",children:[e.jsx(Xe,{className:"w-5 h-5"}),e.jsx("span",{className:"font-medium",children:"Retour aux échanges"})]}),e.jsxs("button",{onClick:ge,className:`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${b?"bg-purple-600 text-white shadow-lg shadow-purple-200":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`,children:[e.jsx("div",{className:`w-2 h-2 rounded-full ${b?"bg-white animate-pulse":"bg-slate-400"}`}),b?"Mode Demo Actif":"Activer Mode Demo"]})]}),b&&e.jsx("div",{className:"mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-white/20 rounded-full flex items-center justify-center",children:e.jsx(O,{className:"w-5 h-5"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h3",{className:"font-bold",children:"Mode Démonstration"}),e.jsx("p",{className:"text-purple-100 text-sm",children:'Vous visualisez des données fictives. Cliquez sur "Activer Mode Demo" pour revenir aux vraies données.'})]}),e.jsx("button",{onClick:ge,className:"px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold text-sm hover:bg-purple-50 transition-colors",children:"Voir données réelles"})]})}),e.jsxs("div",{className:"grid lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-6",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-900 mb-1",children:s.exchange_code}),e.jsxs("p",{className:"text-slate-600",children:["Créé le"," ",new Date(s.created_at).toLocaleDateString("fr-FR")]})]}),e.jsx("span",{className:`px-4 py-2 rounded-full text-sm font-medium ${s.status==="pending"?"bg-amber-100 text-amber-800 border border-amber-200":s.status==="validated"?"bg-emerald-100 text-emerald-800 border border-emerald-200":s.status==="rejected"?"bg-red-100 text-red-800 border border-red-200":"bg-blue-100 text-blue-800 border border-blue-200"}`,children:te[s.status]})]}),se&&e.jsx("div",{className:"bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(Fe,{className:"w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-semibold text-amber-900 mb-1",children:"Action requise"}),e.jsx("p",{className:"text-sm text-amber-700",children:"Cette demande attend votre validation. Examinez les détails ci-dessous et décidez de l'approuver ou de la refuser."})]})]})}),e.jsxs("div",{className:"grid md:grid-cols-2 gap-6 mb-6",children:[e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(K,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Informations client"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:s.client_name})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Téléphone:"}),e.jsx("p",{className:"font-medium text-slate-900",children:e.jsx("a",{href:`tel:${s.client_phone}`,className:"text-sky-600 hover:text-sky-700",children:s.client_phone})})]})]})]}),e.jsxs("div",{className:"bg-slate-50 rounded-xl p-5 border border-slate-200",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(re,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Produit"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Nom:"}),e.jsx("p",{className:"font-medium text-slate-900",children:s.product_name||"Non spécifié"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-slate-600",children:"Raison:"}),e.jsx("p",{className:"font-medium text-slate-900",children:s.reason})]})]})]})]}),e.jsxs("div",{className:"bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-200 mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(Be,{className:"w-5 h-5 text-sky-700"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Adresse de livraison"})]}),e.jsx("div",{className:"space-y-2 text-sm",children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(Je,{className:"w-4 h-4 text-sky-600 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-medium text-slate-900",children:s.client_address||"Non fournie"}),e.jsx("p",{className:"text-slate-700",children:s.client_city&&s.client_postal_code?`${s.client_city} ${s.client_postal_code}, ${s.client_country||"Tunisia"}`:"Informations incomplètes"})]})]})})]}),s.video&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(oe,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Vidéo du produit"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm text-slate-600",children:[e.jsx(Ne,{className:"w-4 h-4"}),e.jsxs("span",{children:["Enregistrée le"," ",new Date(s.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})," ","à"," ",new Date(s.created_at).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})]})]})]}),e.jsx("video",{src:s.video,controls:!0,className:"w-full max-h-96 rounded-lg border border-slate-200 bg-black"})]}),s.images&&s.images.length>0&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(re,{className:"w-5 h-5 text-emerald-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Images extraites de la vidéo"}),e.jsxs("span",{className:"text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full",children:[s.images.length," images"]})]}),e.jsx("div",{className:"grid grid-cols-4 gap-3",children:s.images.map((t,o)=>e.jsxs("div",{className:"relative group",children:[e.jsx("img",{src:t,alt:`Frame ${o+1}`,className:"w-full aspect-square object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(t,"_blank")}),e.jsxs("span",{className:"absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded",children:[o+1,"/",s.images.length]})]},o))})]}),s.photos&&s.photos.length>0&&e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold text-slate-900 mb-4",children:"Photos du produit"}),e.jsx("div",{className:"grid grid-cols-3 gap-4",children:s.photos.map((t,o)=>e.jsx("img",{src:t,alt:`Photo ${o+1}`,className:"w-full h-40 object-cover rounded-lg border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity",onClick:()=>window.open(t,"_blank")},o))})]}),se&&e.jsxs(e.Fragment,{children:[e.jsxs("button",{onClick:()=>he(!0),className:"w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mb-4",children:[e.jsx(oe,{className:"w-5 h-5"}),"Inviter a un appel video"]}),e.jsxs("div",{className:"flex gap-3 mt-6 pt-6 border-t border-slate-200",children:[e.jsxs("button",{onClick:()=>I(!0),className:"flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx($,{className:"w-5 h-5"}),"Valider l'échange"]}),e.jsxs("button",{onClick:()=>L(!0),className:"flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2",children:[e.jsx(fe,{className:"w-5 h-5"}),"Refuser"]})]})]}),!se&&s.status==="validated"&&e.jsxs("div",{className:"mt-6 space-y-3",children:[e.jsx("p",{className:"text-sm font-medium text-slate-700 text-center",children:"Imprimer le bordereau"}),s.jax_ean&&e.jsxs("div",{className:"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center",children:[e.jsx("p",{className:"text-xs text-emerald-700 mb-1",children:"Code JAX créé"}),e.jsx("p",{className:"font-mono font-bold text-emerald-900",children:s.jax_ean})]}),pe&&e.jsxs("div",{className:"bg-red-50 border border-red-200 rounded-lg p-3 text-center",children:[e.jsx("p",{className:"text-sm text-red-700",children:pe}),e.jsx("p",{className:"text-xs text-red-500 mt-1",children:"Vérifiez votre token JAX dans les paramètres"})]}),e.jsx("button",{onClick:be,disabled:ee,className:`w-full py-3 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${ee?"bg-slate-400 cursor-not-allowed":"bg-sky-600 hover:bg-sky-700"}`,children:ee?e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-white"}),e.jsx("span",{children:"Création du colis JAX..."})]}):e.jsxs(e.Fragment,{children:[e.jsx(le,{className:"w-5 h-5"}),e.jsx("span",{children:s.jax_ean?"Réimprimer Bordereau":"Créer & Imprimer Bordereau"})]})}),e.jsx("p",{className:"text-xs text-slate-500 text-center",children:"Le colis sera créé automatiquement chez JAX Delivery"})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsx("h3",{className:"text-xl font-bold text-slate-900 mb-4",children:"Messages"}),e.jsx("div",{className:"space-y-4 mb-4 max-h-96 overflow-y-auto",children:y.length===0?e.jsx("p",{className:"text-slate-600 text-center py-8",children:"Aucun message"}):y.map(t=>e.jsxs("div",{className:`p-4 rounded-lg ${t.sender_type==="merchant"?"bg-sky-50 ml-auto max-w-md border border-sky-200":"bg-slate-100 mr-auto max-w-md border border-slate-200"}`,children:[e.jsx("p",{className:"text-sm font-medium text-slate-900 mb-1",children:t.sender_type==="merchant"?"Vous":s.client_name}),e.jsx("p",{className:"text-slate-700",children:t.message}),e.jsx("p",{className:"text-xs text-slate-500 mt-2",children:new Date(t.created_at).toLocaleString("fr-FR")})]},t.id))}),e.jsxs("form",{onSubmit:Ce,className:"flex gap-2",children:[e.jsx("input",{type:"text",value:w,onChange:t=>M(t.target.value),placeholder:"Votre message...",className:"flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"}),e.jsx("button",{type:"submit",className:"px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors",children:e.jsx(ce,{className:"w-5 h-5"})})]})]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(ne,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique de livraison du colis"})]}),h.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx(O,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600 mb-2",children:"Aucune tentative de livraison enregistrée"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Le client déclare vouloir échanger ce produit"})]}):e.jsxs("div",{className:"space-y-3",children:[s.delivery_accepted_on_attempt&&e.jsx("div",{className:"bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx($,{className:"w-4 h-4 text-emerald-600"}),e.jsxs("span",{className:"text-sm font-semibold text-emerald-900",children:["Colis accepté à la tentative"," ",s.delivery_accepted_on_attempt]})]})}),h.map((t,o)=>e.jsx("div",{className:`rounded-lg p-4 border ${t.status==="successful"?"bg-emerald-50 border-emerald-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:`p-2 rounded-full ${t.status==="successful"?"bg-emerald-100":"bg-red-100"}`,children:t.status==="successful"?e.jsx($,{className:`w-4 h-4 ${t.status==="successful"?"text-emerald-600":"text-red-600"}`}):e.jsx(fe,{className:"w-4 h-4 text-red-600"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsxs("span",{className:`font-semibold text-sm ${t.status==="successful"?"text-emerald-900":"text-red-900"}`,children:["Tentative ",t.attempt_number]}),e.jsx("span",{className:`px-2 py-0.5 text-xs rounded-full ${t.status==="successful"?"bg-emerald-100 text-emerald-700 border border-emerald-300":"bg-red-100 text-red-700 border border-red-300"}`,children:t.status==="successful"?"Réussie":"Échouée"})]}),e.jsxs("div",{className:"flex items-center gap-1 text-xs text-slate-600 mb-2",children:[e.jsx(Ue,{className:"w-3 h-3"}),e.jsx("span",{children:new Date(t.attempt_date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})})]}),t.failure_reason&&e.jsxs("div",{className:"text-sm text-red-700 mb-1",children:[e.jsx("span",{className:"font-medium",children:"Raison: "}),t.failure_reason]}),t.notes&&e.jsxs("div",{className:"text-xs text-slate-600",children:[e.jsx("span",{className:"font-medium",children:"Notes: "}),t.notes]})]})]})},t.id)),h.length>0&&e.jsx("div",{className:`rounded-lg p-3 border mt-4 ${h.some(t=>t.status==="successful")?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-start gap-2",children:[e.jsx(ve,{className:`w-4 h-4 mt-0.5 ${h.some(t=>t.status==="successful")?"text-amber-600":"text-red-600"}`}),e.jsx("div",{className:"text-xs",children:h.some(t=>t.status==="successful")?e.jsxs("p",{className:"text-amber-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Le client a accepté le colis après"," ",h.filter(t=>t.status==="failed").length," ","tentative(s) échouée(s), mais demande maintenant un échange."]}):e.jsxs("p",{className:"text-red-900",children:[e.jsx("span",{className:"font-semibold",children:"Attention:"})," ","Toutes les tentatives de livraison ont échoué (",h.length," tentative(s)). Le client demande maintenant un échange."]})})]})})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-4",children:[e.jsx(He,{className:"w-5 h-5 text-sky-600"}),e.jsx("h3",{className:"font-semibold text-slate-900",children:"Historique du client"})]}),g.length===0?e.jsxs("div",{className:"text-center py-8",children:[e.jsx(O,{className:"w-12 h-12 text-slate-300 mx-auto mb-3"}),e.jsx("p",{className:"text-sm text-slate-600",children:"Premier échange de ce client"})]}):e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-2 text-center",children:[e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200",children:[e.jsx("div",{className:"text-2xl font-bold text-slate-900",children:m.total}),e.jsx("div",{className:"text-xs text-slate-600",children:"Échanges"})]}),e.jsxs("div",{className:"bg-emerald-50 rounded-lg p-3 border border-emerald-200",children:[e.jsx("div",{className:"text-2xl font-bold text-emerald-700",children:m.validated}),e.jsx("div",{className:"text-xs text-emerald-700",children:"Validés"})]}),e.jsxs("div",{className:"bg-red-50 rounded-lg p-3 border border-red-200",children:[e.jsx("div",{className:"text-2xl font-bold text-red-700",children:m.rejected}),e.jsx("div",{className:"text-xs text-red-700",children:"Refusés"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"text-sm font-semibold text-slate-700 mb-2",children:"Derniers échanges"}),g.slice(0,3).map(t=>e.jsxs("div",{className:"bg-slate-50 rounded-lg p-3 border border-slate-200 text-sm",children:[e.jsxs("div",{className:"flex items-center justify-between mb-1",children:[e.jsx("span",{className:"font-mono text-xs text-slate-600",children:t.exchange_code}),e.jsx("span",{className:`text-xs px-2 py-0.5 rounded-full ${t.status==="validated"||t.status==="completed"?"bg-emerald-100 text-emerald-700":t.status==="rejected"?"bg-red-100 text-red-700":"bg-amber-100 text-amber-700"}`,children:te[t.status]})]}),e.jsx("p",{className:"text-xs text-slate-600 truncate",children:t.reason}),e.jsx("p",{className:"text-xs text-slate-500 mt-1",children:new Date(t.created_at).toLocaleDateString("fr-FR")})]},t.id))]}),m.total>0&&e.jsx("div",{className:`rounded-lg p-3 border ${m.validated/m.total>=.7?"bg-emerald-50 border-emerald-200":m.validated/m.total>=.4?"bg-amber-50 border-amber-200":"bg-red-50 border-red-200"}`,children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ie,{className:`w-4 h-4 ${m.validated/m.total>=.7?"text-emerald-600":m.validated/m.total>=.4?"text-amber-600":"text-red-600"}`}),e.jsxs("span",{className:"text-sm font-medium",children:["Taux de validation:"," ",Math.round(m.validated/m.total*100),"%"]})]})})]})]})]})]}),ye&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto",children:[e.jsxs("div",{className:"bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5 rounded-t-2xl",children:[e.jsxs("h3",{className:"text-xl font-bold text-white flex items-center gap-3",children:[e.jsx($,{className:"w-6 h-6"}),"Valider l'échange"]}),e.jsxs("p",{className:"text-emerald-100 text-sm mt-1",children:[s==null?void 0:s.exchange_code," • ",s==null?void 0:s.client_name]})]}),e.jsxs("div",{className:"p-6",children:[e.jsxs("div",{className:"bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx(O,{className:"w-5 h-5 text-blue-600"}),e.jsx("h4",{className:"font-bold text-blue-900",children:"Tarification transparente"})]}),e.jsx("div",{className:"bg-white rounded-lg p-3 border border-blue-200",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center",children:e.jsx(ne,{className:"w-5 h-5 text-blue-600"})}),e.jsxs("div",{children:[e.jsx("p",{className:"font-semibold text-slate-900",children:"Frais de livraison"}),e.jsx("p",{className:"text-xs text-slate-500",children:"Coût fixe par colis"})]})]}),e.jsx("div",{className:"text-right",children:e.jsxs("p",{className:"text-2xl font-bold text-blue-600",children:[k," TND"]})})]})}),e.jsx("p",{className:"text-xs text-blue-700 mt-2 text-center",children:"Pas de frais cachés • Prix unique pour tous les colis"})]}),e.jsxs("div",{className:"mb-6",children:[e.jsxs("h4",{className:"font-semibold text-slate-900 mb-3 flex items-center gap-2",children:[e.jsx(de,{className:"w-5 h-5 text-slate-600"}),"Qui paie les frais de livraison ?"]}),e.jsxs("div",{className:"grid gap-3",children:[e.jsxs("div",{onClick:()=>Z("free"),className:`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${i==="free"?"border-orange-400 bg-orange-50 shadow-md":"border-slate-200 bg-white hover:border-slate-300"}`,children:[i==="free"&&e.jsx("div",{className:"absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center",children:e.jsx(ie,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:`w-12 h-12 rounded-xl flex items-center justify-center ${i==="free"?"bg-orange-200":"bg-slate-100"}`,children:e.jsx(K,{className:"w-6 h-6 text-orange-600"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h5",{className:"font-bold text-slate-900",children:"Vous payez"}),e.jsxs("span",{className:"text-lg font-bold text-orange-600",children:[k," TND"]})]}),e.jsx("p",{className:"text-sm text-slate-600 mt-1",children:"Échange gratuit pour votre client"}),e.jsxs("div",{className:"mt-2 flex items-center gap-2 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full w-fit",children:[e.jsx(re,{className:"w-3 h-3"}),"Le client ne paie rien"]})]})]})]}),e.jsxs("div",{onClick:()=>Z("paid"),className:`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${i==="paid"?"border-emerald-400 bg-emerald-50 shadow-md":"border-slate-200 bg-white hover:border-slate-300"}`,children:[i==="paid"&&e.jsx("div",{className:"absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center",children:e.jsx(ie,{className:"w-4 h-4 text-white"})}),e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsx("div",{className:`w-12 h-12 rounded-xl flex items-center justify-center ${i==="paid"?"bg-emerald-200":"bg-slate-100"}`,children:e.jsx(de,{className:"w-6 h-6 text-emerald-600"})}),e.jsxs("div",{className:"flex-1",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h5",{className:"font-bold text-slate-900",children:"Le client paie"}),e.jsx("span",{className:"text-lg font-bold text-emerald-600",children:"0 TND pour vous"})]}),e.jsx("p",{className:"text-sm text-slate-600 mt-1",children:"Définissez le montant à payer par le client"}),i==="paid"&&e.jsxs("div",{className:"mt-3 space-y-3",children:[e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"number",step:"0.01",min:"0",value:V,onChange:t=>me(t.target.value),placeholder:"Montant en TND",className:"w-full px-4 py-3 pr-16 border-2 border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-semibold"}),e.jsx("span",{className:"absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium",children:"TND"})]}),e.jsxs("div",{className:"bg-emerald-100 rounded-lg p-3 flex items-start gap-2",children:[e.jsx(O,{className:"w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5"}),e.jsxs("p",{className:"text-xs text-emerald-800",children:[e.jsx("strong",{children:"Conseil :"})," Mettez"," ",k," TND ou plus pour couvrir les frais de livraison. Le client paie à la réception du colis."]})]})]})]})]})]})]})]}),e.jsxs("div",{className:`rounded-xl p-4 mb-6 ${i==="free"?"bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200":"bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200"}`,children:[e.jsx("h4",{className:"font-bold text-slate-900 mb-3 text-center",children:"Récapitulatif de votre choix"}),e.jsxs("div",{className:"bg-white rounded-lg p-4 space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center pb-2 border-b border-slate-100",children:[e.jsxs("span",{className:"text-slate-600 flex items-center gap-2",children:[e.jsx(ne,{className:"w-4 h-4"}),"Frais de livraison"]}),e.jsxs("span",{className:"font-semibold",children:[k," TND"]})]}),e.jsxs("div",{className:"flex justify-between items-center pb-2 border-b border-slate-100",children:[e.jsxs("span",{className:"text-slate-600 flex items-center gap-2",children:[e.jsx(K,{className:"w-4 h-4"}),"Le client paie"]}),e.jsx("span",{className:`font-semibold ${i==="free"?"text-slate-400":"text-emerald-600"}`,children:i==="free"?"0 TND (gratuit)":`${V||"0"} TND`})]}),e.jsxs("div",{className:`flex justify-between items-center pt-1 ${i==="free"?"text-orange-700":"text-emerald-700"}`,children:[e.jsxs("span",{className:"font-bold flex items-center gap-2",children:[e.jsx(de,{className:"w-4 h-4"}),"Vous payez"]}),e.jsx("span",{className:"text-xl font-bold",children:i==="free"?`${k} TND`:"0 TND"})]})]}),i==="free"&&e.jsx("p",{className:"text-xs text-orange-700 text-center mt-3",children:"Ce montant sera déduit lors du ramassage"}),i==="paid"&&parseFloat(V)>=k&&e.jsx("p",{className:"text-xs text-emerald-700 text-center mt-3",children:"Les frais de livraison sont couverts par le paiement client"})]}),e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>I(!1),className:"flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold transition-colors",children:"Annuler"}),e.jsxs("button",{onClick:Ee,className:`flex-1 px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${i==="free"?"bg-orange-500 hover:bg-orange-600 text-white":"bg-emerald-600 hover:bg-emerald-700 text-white"}`,children:[e.jsx($,{className:"w-5 h-5"}),"Confirmer"]})]})]})]})}),_e&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsx("div",{className:"bg-white rounded-2xl shadow-xl max-w-lg w-full",children:e.jsxs("div",{className:"p-6",children:[e.jsx("h3",{className:"text-2xl font-bold text-slate-900 mb-4",children:"Refuser l'échange"}),e.jsx("p",{className:"text-slate-600 mb-6",children:"Veuillez expliquer la raison du refus au client"}),e.jsx("textarea",{value:S,onChange:t=>xe(t.target.value),placeholder:"Expliquez pourquoi l'échange est refusé...",rows:4,className:"w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"}),e.jsxs("div",{className:"flex gap-3 mt-6",children:[e.jsx("button",{onClick:()=>L(!1),className:"flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors",children:"Annuler"}),e.jsx("button",{onClick:Te,className:"flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors",children:"Confirmer le refus"})]})]})})}),Se&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden",children:[e.jsxs("div",{className:"bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center",children:[e.jsx("div",{className:"w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4",children:e.jsx($,{className:"w-10 h-10 text-white"})}),e.jsx("h3",{className:"text-2xl font-bold text-white mb-2",children:"Échange validé !"}),e.jsx("p",{className:"text-emerald-100",children:s==null?void 0:s.exchange_code})]}),e.jsxs("div",{className:"p-6",children:[e.jsx("div",{className:"bg-sky-50 border-2 border-sky-200 rounded-xl p-4 mb-6",children:e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0",children:e.jsx(le,{className:"w-5 h-5 text-sky-600"})}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-sky-900 mb-1",children:"Prochaine étape"}),e.jsx("p",{className:"text-sm text-sky-700",children:"Imprimez le bordereau pour préparer l'expédition du colis au client."})]})]})}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("button",{onClick:()=>{J(!1),be()},className:"w-full py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2",children:[e.jsx(le,{className:"w-5 h-5"}),"Imprimer le bordereau"]}),e.jsx("button",{onClick:()=>J(!1),className:"w-full py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors",children:"Imprimer plus tard"})]}),e.jsx("p",{className:"text-xs text-slate-500 text-center mt-4",children:"Vous pourrez toujours imprimer le bordereau depuis la page de l'échange"})]})]})})]})})}export{qs as default};
