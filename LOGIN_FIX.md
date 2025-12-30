# Guide de Connexion - Solution aux Problèmes de Login

## Problème: Le login ne fonctionne pas

### Solution 1: Utiliser le bouton "Connexion Demo" (Recommandé)

Le bouton "Connexion Demo" crée automatiquement le compte s'il n'existe pas.

1. Allez sur: http://localhost:5173/merchant/login
2. Cliquez sur le bouton **"Connexion Demo"**
3. Le système va:
   - Essayer de se connecter avec demo@merchant.com
   - Si le compte n'existe pas, il le créera automatiquement
   - Vous redirigera vers le dashboard

### Solution 2: Créer le compte manuellement via Supabase

Si la connexion automatique ne fonctionne pas, créez le compte manuellement:

1. Allez sur: https://supabase.com/dashboard/project/wlitiuzirsayfizwjaye/auth/users

2. Cliquez sur **"Add user"** → **"Create new user"**

3. Remplissez:
   - **Email:** `demo@merchant.com`
   - **Password:** `demo123456`
   - ✅ **Cochez:** "Auto Confirm User"

4. Cliquez sur **"Create user"**

5. Une fois créé, connectez le compte à la table merchants:

```sql
-- Copiez l'UUID du user créé (par exemple: abc123...)
UPDATE merchants
SET id = 'UUID_DU_USER_CREE_DANS_AUTH'
WHERE email = 'demo@merchant.com';
```

6. Retournez sur http://localhost:5173/merchant/login et connectez-vous

### Solution 3: Vérifier la configuration Supabase

Vérifiez que le fichier `.env` contient les bonnes clés:

```bash
VITE_SUPABASE_URL=https://wlitiuzirsayfizwjaye.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vérifier que l'authentification fonctionne

1. Ouvrez la console du navigateur (F12)
2. Dans l'onglet Console, tapez:

```javascript
// Vérifier la connexion
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'demo@merchant.com',
  password: 'demo123456'
});
console.log('Auth data:', data);
console.log('Auth error:', error);
```

### Messages d'erreur courants

#### "Invalid login credentials"
- Le compte n'existe pas encore
- Utilisez le bouton "Connexion Demo" pour le créer automatiquement

#### "Email not confirmed"
- Le compte existe mais n'est pas confirmé
- Allez dans Supabase Dashboard → Auth → Users
- Trouvez l'utilisateur et cliquez "Confirm email"

#### "User already registered"
- Le compte existe déjà
- Utilisez simplement email/password pour vous connecter

### Politique RLS et Authentification

Les politiques RLS sont configurées pour:

**Exchanges (Table):**
- ✅ Lecture publique (anon) - Pour que les clients puissent voir leurs échanges
- ✅ Insertion publique (anon) - Pour que les clients puissent créer des échanges
- ✅ Lecture authentifiée (authenticated) - Merchants voient leurs propres échanges
- ✅ Mise à jour authentifiée (authenticated) - Merchants peuvent valider/rejeter

**Merchants (Table):**
- ✅ Lecture authentifiée uniquement (auth.uid() = id)
- ✅ Mise à jour authentifiée uniquement (auth.uid() = id)

### Test Complet du Flow

1. **Page Login:** http://localhost:5173/merchant/login
   - Cliquez "Connexion Demo"
   - Attendez 2-3 secondes

2. **Dashboard:** http://localhost:5173/merchant/dashboard
   - Vous devriez voir les statistiques
   - 5 échanges de test doivent apparaître

3. **Liste Échanges:** http://localhost:5173/merchant/exchanges
   - Filtres fonctionnels
   - Recherche fonctionnelle

4. **Déconnexion:**
   - Cliquez sur le bouton "Déconnexion" en haut à droite

### En cas de problème persistant

Si rien ne fonctionne, réinitialisez tout:

```bash
# Supprimer tous les utilisateurs de Supabase Auth
# Via Supabase Dashboard → Auth → Users

# Relancer l'app
npm run dev

# Utiliser le bouton "Connexion Demo"
```

Le compte sera recréé automatiquement avec les bonnes permissions.

---

## Résumé

**Méthode la plus simple:** Utilisez le bouton **"Connexion Demo"** qui gère tout automatiquement!

L'application créera:
- ✅ Le compte Auth (demo@merchant.com)
- ✅ L'entrée dans la table merchants
- ✅ La liaison entre les deux
- ✅ La redirection vers le dashboard

Aucune configuration manuelle nécessaire!
