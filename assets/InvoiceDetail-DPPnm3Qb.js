import{s as n,j as e}from"./index-BvuTS9li.js";import{h as N,u as y,r}from"./react-vendor-CTUriZ5h.js";import{A as l}from"./AdminLayout-KYTYGQPM.js";import{F as p}from"./file-text-B3Ewreww.js";import{A as w}from"./arrow-left-CxjwE-xR.js";import{C as u}from"./calendar-upMk3ayk.js";import{P as _}from"./package-ChDCFdB3.js";import{B as D}from"./banknote-JI0QWWz-.js";import{P as F}from"./printer-B3I1m1op.js";import{D as k}from"./download-BkxpqmAo.js";import{S as P}from"./send-DlqxrGT5.js";import{C as f}from"./check-circle-CyNeZd0p.js";import{C as S}from"./clock-Dhxn45-3.js";import"./supabase-Bl4YWSQ9.js";import"./x-D4qrk5Qy.js";import"./createLucideIcon-CMjKDoEE.js";import"./menu-DP2azNEK.js";import"./shield-BNgLrtrc.js";import"./layout-dashboard-CqNl1jWq.js";import"./users-4zMWxYqH.js";import"./truck-CgEV9F53.js";import"./wallet-CVOcG8S4.js";import"./store-B-5iV_wL.js";import"./home-9mW_oZwz.js";function ee(){const{id:a}=N(),o=y(),[b,h]=r.useState(!0),[s,g]=r.useState(null),[d,c]=r.useState(!1);r.useEffect(()=>{a&&m()},[a]);const m=async()=>{try{const{data:t,error:i}=await n.from("weekly_invoices").select("*").eq("id",a).maybeSingle();if(i)throw i;g(t)}catch(t){console.error("Error fetching invoice:",t)}finally{h(!1)}},v=async()=>{if(s){c(!0);try{const{error:t}=await n.from("weekly_invoices").update({status:"paid",paid_at:new Date().toISOString(),paid_amount:s.net_payable}).eq("id",a);if(t)throw t;await n.from("financial_transactions").insert({invoice_id:s.id,transaction_type:"invoice_paid",amount:s.net_payable,currency:"TND",direction:"credit",status:"completed",description:`Paiement facture ${s.invoice_number}`}),m(),alert("Facture marquée comme payée")}catch(t){console.error("Error updating invoice:",t),alert("Erreur lors de la mise à jour")}finally{c(!1)}}},x=()=>{if(!s)return;const t=window.open("","_blank");if(!t)return;const i=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Facture ${s.invoice_number}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: bold; color: #7c3aed; }
          .invoice-info { text-align: right; }
          .invoice-number { font-size: 20px; font-weight: bold; margin-bottom: 8px; }
          .period { color: #666; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 14px; font-weight: bold; color: #666; margin-bottom: 10px; text-transform: uppercase; }
          .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
          .summary-item { background: #f8f9fa; padding: 20px; border-radius: 8px; }
          .summary-label { font-size: 12px; color: #666; margin-bottom: 4px; }
          .summary-value { font-size: 24px; font-weight: bold; }
          .totals { background: #f8f9fa; padding: 20px; border-radius: 8px; }
          .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .total-row:last-child { border-bottom: none; font-weight: bold; font-size: 18px; }
          .total-row.net { background: #7c3aed; color: white; margin: 10px -20px -20px; padding: 20px; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-paid { background: #d1fae5; color: #059669; }
          .status-generated { background: #e0e7ff; color: #4f46e5; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SWAPP</div>
            <p>Plateforme d'échange e-commerce</p>
          </div>
          <div class="invoice-info">
            <div class="invoice-number">${s.invoice_number}</div>
            <div class="period">
              Semaine ${s.week_number}, ${s.year}<br>
              ${new Date(s.period_start).toLocaleDateString("fr-FR")} - ${new Date(s.period_end).toLocaleDateString("fr-FR")}
            </div>
            <span class="status-badge ${s.status==="paid"?"status-paid":"status-generated"}">
              ${s.status==="paid"?"PAYÉE":"GÉNÉRÉE"}
            </span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Résumé de la période</div>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Échanges traités</div>
              <div class="summary-value">${s.total_exchanges_handled}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Montant encaissé</div>
              <div class="summary-value">${s.total_amount_collected.toFixed(2)} TND</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Détail financier</div>
          <div class="totals">
            <div class="total-row">
              <span>Total encaissé clients</span>
              <span>${s.total_amount_collected.toFixed(2)} TND</span>
            </div>
            <div class="total-row">
              <span>Frais de service (10%)</span>
              <span>-${s.total_fees.toFixed(2)} TND</span>
            </div>
            <div class="total-row">
              <span>Commission SWAPP (5%)</span>
              <span>-${s.total_commissions.toFixed(2)} TND</span>
            </div>
            <div class="total-row net">
              <span>Net à payer</span>
              <span>${s.net_payable.toFixed(2)} TND</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>Cette facture a été générée automatiquement par SWAPP.</p>
          <p>Date de génération: ${s.generated_at?new Date(s.generated_at).toLocaleDateString("fr-FR"):new Date(s.created_at).toLocaleDateString("fr-FR")}</p>
        </div>
      </body>
      </html>
    `;t.document.write(i),t.document.close(),t.focus(),setTimeout(()=>{t.print()},250)},j=t=>{switch(t){case"paid":return e.jsxs("span",{className:"inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium",children:[e.jsx(f,{className:"w-4 h-4"}),"Payée"]});case"generated":case"sent":return e.jsxs("span",{className:"inline-flex items-center gap-1 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium",children:[e.jsx(S,{className:"w-4 h-4"}),t==="sent"?"Envoyée":"Générée"]});default:return e.jsx("span",{className:"px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium",children:t})}};return b?e.jsx(l,{children:e.jsx("div",{className:"flex items-center justify-center h-96",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"})})}):s?e.jsx(l,{children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("button",{onClick:()=>o("/admin/invoices"),className:"flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6",children:[e.jsx(w,{className:"w-5 h-5"}),e.jsx("span",{className:"font-medium",children:"Retour aux factures"})]}),e.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6",children:e.jsxs("div",{className:"flex flex-col md:flex-row md:items-center md:justify-between gap-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:"w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center",children:e.jsx(p,{className:"w-7 h-7 text-purple-600"})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-slate-900",children:s.invoice_number}),e.jsxs("p",{className:"text-slate-600 flex items-center gap-2",children:[e.jsx(u,{className:"w-4 h-4"}),"Semaine ",s.week_number,", ",s.year]})]})]}),e.jsx("div",{className:"flex items-center gap-3",children:j(s.status)})]})}),e.jsxs("div",{className:"grid md:grid-cols-3 gap-6 mb-6",children:[e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 text-slate-600 mb-2",children:[e.jsx(u,{className:"w-5 h-5"}),e.jsx("span",{className:"text-sm font-medium",children:"Période"})]}),e.jsx("p",{className:"font-semibold text-slate-900",children:new Date(s.period_start).toLocaleDateString("fr-FR")}),e.jsx("p",{className:"text-slate-600",children:"au"}),e.jsx("p",{className:"font-semibold text-slate-900",children:new Date(s.period_end).toLocaleDateString("fr-FR")})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 text-slate-600 mb-2",children:[e.jsx(_,{className:"w-5 h-5"}),e.jsx("span",{className:"text-sm font-medium",children:"Échanges Traités"})]}),e.jsx("p",{className:"text-3xl font-bold text-slate-900",children:s.total_exchanges_handled})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsxs("div",{className:"flex items-center gap-2 text-slate-600 mb-2",children:[e.jsx(D,{className:"w-5 h-5"}),e.jsx("span",{className:"text-sm font-medium",children:"Montant Encaissé"})]}),e.jsx("p",{className:"text-3xl font-bold text-slate-900",children:s.total_amount_collected.toFixed(2)}),e.jsx("p",{className:"text-sm text-slate-500",children:"TND"})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6",children:[e.jsx("h2",{className:"text-lg font-semibold text-slate-900 mb-6",children:"Détail Financier"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between py-3 border-b border-slate-200",children:[e.jsx("span",{className:"text-slate-600",children:"Total encaissé clients"}),e.jsxs("span",{className:"font-semibold text-slate-900",children:[s.total_amount_collected.toFixed(2)," TND"]})]}),e.jsxs("div",{className:"flex items-center justify-between py-3 border-b border-slate-200",children:[e.jsx("span",{className:"text-slate-600",children:"Frais de service (10%)"}),e.jsxs("span",{className:"font-semibold text-red-600",children:["-",s.total_fees.toFixed(2)," TND"]})]}),e.jsxs("div",{className:"flex items-center justify-between py-3 border-b border-slate-200",children:[e.jsx("span",{className:"text-slate-600",children:"Commission SWAPP (5%)"}),e.jsxs("span",{className:"font-semibold text-red-600",children:["-",s.total_commissions.toFixed(2)," TND"]})]}),e.jsxs("div",{className:"flex items-center justify-between py-4 bg-purple-50 rounded-lg px-4 -mx-4",children:[e.jsx("span",{className:"font-semibold text-purple-900",children:"Net à payer"}),e.jsxs("span",{className:"text-2xl font-bold text-purple-700",children:[s.net_payable.toFixed(2)," TND"]})]})]})]}),e.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-slate-200 p-6",children:[e.jsx("h2",{className:"text-lg font-semibold text-slate-900 mb-4",children:"Actions"}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsxs("button",{onClick:x,className:"inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors",children:[e.jsx(F,{className:"w-5 h-5"}),"Imprimer"]}),e.jsxs("button",{onClick:x,className:"inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors",children:[e.jsx(k,{className:"w-5 h-5"}),"Télécharger PDF"]}),s.status!=="paid"&&e.jsxs(e.Fragment,{children:[e.jsxs("button",{className:"inline-flex items-center gap-2 px-4 py-2 border border-sky-300 text-sky-700 rounded-lg hover:bg-sky-50 transition-colors",children:[e.jsx(P,{className:"w-5 h-5"}),"Envoyer au partenaire"]}),e.jsxs("button",{onClick:v,disabled:d,className:"inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 transition-colors",children:[e.jsx(f,{className:"w-5 h-5"}),d?"Traitement...":"Marquer comme payée"]})]})]}),s.paid_at&&e.jsxs("div",{className:"mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg",children:[e.jsxs("p",{className:"text-sm text-emerald-700",children:[e.jsx("strong",{children:"Payée le:"})," ",new Date(s.paid_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})]}),s.paid_amount&&e.jsxs("p",{className:"text-sm text-emerald-700",children:[e.jsx("strong",{children:"Montant reçu:"})," ",s.paid_amount.toFixed(2)," TND"]})]})]})]})}):e.jsx(l,{children:e.jsxs("div",{className:"text-center py-12",children:[e.jsx(p,{className:"w-12 h-12 text-slate-300 mx-auto mb-4"}),e.jsx("p",{className:"text-slate-500",children:"Facture non trouvée"}),e.jsx("button",{onClick:()=>o("/admin/invoices"),className:"mt-4 text-purple-600 hover:text-purple-700",children:"Retour aux factures"})]})})}export{ee as default};
