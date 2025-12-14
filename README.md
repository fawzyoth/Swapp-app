# Plateforme d'Échange MVP

Plateforme complète de gestion d'échanges de produits avec interface Client et Dashboard E-Commerçant.

## 🚀 Démarrage Rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration Supabase

La base de données Supabase est **déjà configurée** avec:
- ✅ 6 tables créées (merchants, mini_depots, transporters, exchanges, messages, status_history)
- ✅ Row Level Security (RLS) activé sur toutes les tables
- ✅ 3 mini-dépôts (Tunis, Sousse, Sfax)
- ✅ 3 transporteurs (Aramex, DHL, Chronopost)
- ✅ 5 échanges de test
- ✅ 1 merchant de test

### 3. Créer un compte E-Commerçant

**IMPORTANT:** Vous devez créer un compte Supabase Auth pour vous connecter au dashboard merchant.

#### Option A: Via l'interface Supabase (Recommandé)

1. Allez sur: https://supabase.com/dashboard/project/wlitiuzirsayfizwjaye/auth/users
2. Cliquez sur "Add user" → "Create new user"
3. Email: `demo@merchant.com`
4. Password: `demo123456`
5. Cochez "Auto Confirm User"
6. Cliquez sur "Create user"

#### Option B: Via l'API (pendant le développement)

Une fois l'app lancée, allez sur `/merchant/login` et utilisez le bouton "Connexion Demo" qui créera automatiquement le compte s'il n'existe pas.

### 4. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur: **http://localhost:5173**

---

## 📱 Utilisation

### Espace Client

**URL:** http://localhost:5173/client/scan

1. Scanner un QR code ou entrer manuellement un code
2. Codes de test disponibles:
   - `EXC-2025-001` (En attente)
   - `EXC-2025-002` (Validé)
   - `EXC-2025-003` (Complété)
   - `EXC-2025-004` (Rejeté)
   - `EXC-2025-005` (En attente)

3. Remplir le formulaire d'échange
4. Suivre l'échange en temps réel

### Espace E-Commerçant

**URL:** http://localhost:5173/merchant/login

**Identifiants:**
- Email: `demo@merchant.com`
- Mot de passe: `demo123456`

**Fonctionnalités:**
- 📊 Dashboard avec statistiques
- 📦 Liste des échanges (filtres, recherche)
- ✅ Validation/Rejet d'échanges
- 🖨️ Génération de bordereaux
- 💬 Messagerie avec clients
- 👥 Liste des clients
- 🧪 Mode simulation (test des statuts)

---

## 🗄️ Structure de la Base de Données

### Tables

1. **merchants** - Commerçants (1 enregistrement)
2. **mini_depots** - Mini-dépôts (3 enregistrements)
3. **transporters** - Transporteurs (3 enregistrements)
4. **exchanges** - Échanges (5 enregistrements de test)
5. **messages** - Messages client/commerçant
6. **status_history** - Historique des statuts

### Sécurité

- ✅ Row Level Security (RLS) activé sur toutes les tables
- ✅ Politiques pour merchants authentifiés
- ✅ Politiques publiques pour clients (lecture via code)

---

## 📊 Statuts d'Échange

| Statut | Français |
|--------|----------|
| `pending` | En attente |
| `validated` | Validé |
| `preparing` | Préparation mini-dépôt |
| `in_transit` | En route |
| `completed` | Échange effectué |
| `returned` | Produit retourné |
| `rejected` | Rejeté |

---

## 🛠️ Technologies

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **Database:** Supabase (PostgreSQL)
- **QR Scanner:** html5-qrcode
- **Auth:** Supabase Auth

---

## 📝 Variables d'Environnement

Le fichier `.env` est déjà configuré:

```env
VITE_SUPABASE_URL=https://wlitiuzirsayfizwjaye.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## 🎯 Fonctionnalités Complètes

### Client (100%)
- [x] Scanner QR code
- [x] Formulaire d'échange (nom, téléphone, raison, 1-3 photos)
- [x] Suivi en temps réel avec timeline
- [x] Liste de tous les échanges
- [x] Détails d'échange avec messagerie

### E-Commerçant (100%)
- [x] Login/Authentification
- [x] Dashboard avec statistiques
- [x] Liste des échanges (filtres + recherche)
- [x] Validation d'échange (choix transporteur + dépôt)
- [x] Rejet d'échange (avec raison)
- [x] Génération bordereau d'échange
- [x] Messagerie avec clients
- [x] Liste des clients (historique + stats)
- [x] Mode simulation (test des statuts)

---

## 🐛 Dépannage

### Problème: "Cannot find module 'vite'"

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Problème: "User not authenticated" sur le dashboard

1. Assurez-vous d'avoir créé le compte via Supabase Dashboard
2. Ou utilisez le bouton "Connexion Demo" qui créera le compte automatiquement

### Problème: Les échanges ne s'affichent pas

Vérifiez que:
1. La base de données est bien configurée (voir section 2)
2. Les politiques RLS sont activées
3. Vous êtes connecté avec le bon compte merchant

---

## 📖 Documentation Complète

Voir `FEATURES.md` pour la liste exhaustive des fonctionnalités.

---

## 🎨 Design

- Design moderne et professionnel
- Palette: Émeraude et Sky (pas de violet)
- Responsive (mobile, tablette, desktop)
- Transitions fluides
- Contrastes optimaux (WCAG AA)

---

## 🚀 Prochaines Étapes (Optionnelles)

- [ ] Upload photos vers Supabase Storage
- [ ] Notifications push/email
- [ ] Export PDF avancé (avec QR codes)
- [ ] Graphiques de statistiques (charts)
- [ ] Mode multi-merchant
- [ ] API webhooks pour intégrations

---

**Bon développement! 🎉**
