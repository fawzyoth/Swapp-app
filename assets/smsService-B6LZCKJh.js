import{c as l}from"./createLucideIcon-DGm6Wim6.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=l("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]),i="https://fawzyoth.github.io/Swapp-app",u=e=>`${i}/#/client/tracking/${e}`,d=e=>`${i}/#/client/chat/${e}`,r=async e=>{const n=new Date().toLocaleString("fr-FR");return console.log(`
========================================`),console.log("📱 SMS NOTIFICATION (Console Mode)"),console.log("========================================"),console.log(`📅 Time: ${n}`),console.log(`📞 To: ${e.to}`),console.log(`📋 Type: ${e.type.toUpperCase()}`),console.log("----------------------------------------"),console.log("💬 Message:"),console.log(e.message),console.log(`========================================
`),await new Promise(o=>setTimeout(o,100)),!0},v=async(e,n,o,s)=>{const a=`SWAPP - Demande refusee

Bonjour ${n},

Votre demande d'echange ${o} a ete refusee.

Raison: ${s}

Pour plus d'informations, scannez le QR code de votre bordereau ou contactez le commercant.

SWAPP`;return r({to:e,message:a,type:"rejection"})},S=async(e,n,o,s)=>{const a=u(o),c=s?`Date estimee de reception: ${s}`:"Vous serez informe de la date de livraison.",t=`SWAPP - Echange accepte!

Bonjour ${n},

Votre demande d'echange ${o} a ete ACCEPTEE!

${c}

Suivez votre echange:
${a}

SWAPP`;return r({to:e,message:t,type:"acceptance"})},$=async(e,n,o,s)=>{const a=d(s),c=`SWAPP - Nouveau message

Bonjour ${n},

Vous avez recu un nouveau message concernant votre echange ${o}.

Consultez vos messages:
${a}

Ou scannez le QR code de votre bordereau.

SWAPP`;return r({to:e,message:c,type:"message"})},P=async(e,n,o,s,a)=>{const c=u(o);let t="";switch(s){case"validated":t="Votre echange a ete valide et sera bientot prepare.";break;case"preparing":t="Votre colis est en cours de preparation au mini-depot.";break;case"in_transit":t="Votre colis est en route vers vous!";break;case"delivery_verified":t="Le livreur a verifie et accepte votre echange.";break;case"delivery_rejected":t="Le livreur a signale un probleme avec l'echange.";break;case"completed":t="Votre echange est termine avec succes! Merci.";break;case"returned":t="Le produit a ete retourne.";break;default:t=`Nouveau statut: ${a}`}const g=`SWAPP - Mise a jour

Bonjour ${n},

Echange ${o}:
${t}

Statut: ${a}

Suivez votre echange:
${c}

SWAPP`;return r({to:e,message:g,type:"status_change"})};export{m as I,S as a,v as b,P as c,$ as s};
