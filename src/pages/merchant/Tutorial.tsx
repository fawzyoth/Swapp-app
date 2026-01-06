import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  Package,
  Video,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Printer,
  Truck,
  MessageSquare,
  Star,
  Play,
  ShoppingBag,
  Box,
  FileText,
} from "lucide-react";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: any;
  content: React.ReactNode;
}

export default function MerchantTutorial() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const handleSkip = () => {
    // Mark tutorial as completed in localStorage
    localStorage.setItem("merchant_tutorial_completed", "true");
    navigate("/merchant/dashboard");
  };

  const handleComplete = () => {
    localStorage.setItem("merchant_tutorial_completed", "true");
    navigate("/merchant/dashboard");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps: TutorialStep[] = [
    {
      id: 1,
      title: "Bienvenue sur SWAPP!",
      description: "Découvrez comment gérer vos échanges de produits facilement",
      icon: ShoppingBag,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Bienvenue dans votre espace marchand!
            </h3>
            <p className="text-lg text-slate-600 mb-6">
              SWAPP simplifie la gestion des échanges de produits pour votre e-commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <QrCode className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900 mb-1">QR Codes</h4>
              <p className="text-sm text-green-700">Génération automatique</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Video className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 mb-1">Vidéo</h4>
              <p className="text-sm text-blue-700">Vérification visuelle</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900 mb-1">Validation</h4>
              <p className="text-sm text-purple-700">Processus simple</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6">
            <h4 className="font-semibold text-slate-900 mb-3">Ce que vous allez apprendre:</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-slate-700">Comment générer et imprimer vos QR codes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-slate-700">Où placer les QR codes sur vos colis</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-slate-700">Comment fonctionne le processus d'échange</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-slate-700">La vérification vidéo par le livreur</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <span className="text-slate-700">Communication avec vos clients</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Générer votre QR Code",
      description: "Créez un QR code unique pour chaque client",
      icon: QrCode,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <QrCode className="w-16 h-16 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              QR Code Unique pour Chaque Client
            </h3>
            <p className="text-slate-600">
              Chaque QR code est lié à un client spécifique et permet de suivre tous ses échanges
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Comment ça marche?
            </h4>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <p className="font-medium text-blue-900">Créez un QR code depuis votre dashboard</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Allez dans "Dashboard" → Section "QR Codes" → "Générer un QR Code"
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <p className="font-medium text-blue-900">Entrez les informations du client</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Nom, téléphone, et email (optionnel) du client
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <p className="font-medium text-blue-900">Le QR code est généré instantanément</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Unique et lié au client pour tous ses futurs échanges
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="w-48 h-48 bg-slate-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-32 h-32 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 mt-2">QR Code Exemple</p>
                </div>
              </div>
              <p className="text-center text-sm text-slate-600">
                Aperçu du QR code généré
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Avantages
                </h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• QR code réutilisable</li>
                  <li>• Historique complet des échanges</li>
                  <li>• Traçabilité totale</li>
                  <li>• Pas de saisie manuelle</li>
                </ul>
              </div>

              <div className="bg-amber-50 rounded-lg p-4">
                <h5 className="font-semibold text-amber-900 mb-2">💡 Conseil</h5>
                <p className="text-sm text-amber-800">
                  Imprimez plusieurs QR codes à l'avance pour vos clients réguliers!
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Imprimer et Placer le QR Code",
      description: "Instructions pour l'impression et le placement sur vos colis",
      icon: Printer,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Printer className="w-16 h-16 text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Imprimer et Coller votre QR Code
            </h3>
            <p className="text-slate-600">
              Placez le QR code à l'extérieur du colis pour un scan facile
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Printing Instructions */}
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <Printer className="w-5 h-5" />
                Impression
              </h4>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-purple-900">Téléchargez le QR code</p>
                    <p className="text-sm text-purple-700">Format PNG haute résolution</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-purple-900">Imprimez sur papier autocollant</p>
                    <p className="text-sm text-purple-700">Taille recommandée: 8x8 cm minimum</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-purple-900">Utilisez du papier résistant</p>
                    <p className="text-sm text-purple-700">Pour supporter le transport</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Placement Instructions */}
            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Box className="w-5 h-5" />
                Placement sur le Colis
              </h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border-2 border-green-500">
                  <p className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    ✓ BON Emplacement
                  </p>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• Face avant du colis</li>
                    <li>• Bien visible et accessible</li>
                    <li>• Sur surface plane</li>
                    <li>• Éviter les plis du carton</li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-red-500">
                  <p className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <X className="w-4 h-4" />
                    ✗ À ÉVITER
                  </p>
                  <ul className="text-sm text-slate-700 space-y-1">
                    <li>• À l'intérieur du colis</li>
                    <li>• Sur les coins ou plis</li>
                    <li>• Zone cachée ou difficile d'accès</li>
                    <li>• Surface courbe ou irrégulière</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Example */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-slate-900 mb-4 text-center">Exemple Visuel</h4>
            <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
              <div className="relative">
                <div className="w-full aspect-square bg-amber-100 rounded-lg border-4 border-amber-300 flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-20 h-20 text-amber-600 mx-auto mb-3" />
                    <p className="text-amber-800 font-semibold">COLIS</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white p-2 rounded-lg border-2 border-blue-500 shadow-lg">
                  <QrCode className="w-16 h-16 text-slate-800" />
                  <p className="text-xs text-center text-blue-600 font-semibold mt-1">QR Code</p>
                </div>
              </div>
              <p className="text-center text-sm text-slate-600 mt-4">
                QR code collé en haut à droite, bien visible
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Processus d'Échange Client",
      description: "Découvrez comment vos clients initient un échange",
      icon: Package,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Package className="w-16 h-16 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Comment le Client Demande un Échange
            </h3>
            <p className="text-slate-600">
              Processus simple et guidé pour vos clients
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <h4 className="font-semibold text-slate-900 mb-6 text-center text-lg">
              Étapes pour le Client
            </h4>

            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1 bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-slate-900 mb-1">Scanner le QR Code</h5>
                  <p className="text-sm text-slate-600">
                    Le client scanne le QR code sur son colis avec son smartphone
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1 bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-slate-900 mb-1">Formulaire d'Échange</h5>
                  <p className="text-sm text-slate-600">
                    Remplir les informations: produit, raison de l'échange, description
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1 bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    Vidéo du Produit
                    <Video className="w-4 h-4 text-green-600" />
                  </h5>
                  <p className="text-sm text-slate-600">
                    Enregistrer une courte vidéo montrant l'état du produit
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1 bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-slate-900 mb-1">Soumettre la Demande</h5>
                  <p className="text-sm text-slate-600">
                    La demande vous est envoyée instantanément pour validation
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h5 className="font-semibold text-blue-900 mb-3">📱 Exemple de Demande</h5>
              <div className="bg-white rounded-lg p-4 text-sm space-y-2">
                <p><span className="font-medium">Produit:</span> T-Shirt Nike Taille L</p>
                <p><span className="font-medium">Raison:</span> Taille incorrecte</p>
                <p><span className="font-medium">Description:</span> J'ai besoin d'une taille M</p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Vidéo:</span>
                  <span className="text-green-600 flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    Jointe (30s)
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <h5 className="font-semibold text-purple-900 mb-3">⚡ Ce que vous recevez</h5>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5" />
                  <span>Notification immédiate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5" />
                  <span>Toutes les informations du client</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5" />
                  <span>Vidéo de vérification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5" />
                  <span>Détails du produit et raison</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Vérification Vidéo",
      description: "Comment la vidéo protège contre les fraudes",
      icon: Video,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Video className="w-16 h-16 text-red-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Vérification Vidéo par le Livreur
            </h3>
            <p className="text-slate-600">
              Protection contre les fraudes et garantie de qualité
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
            <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Pourquoi la Vidéo est Importante?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-red-600" />
                </div>
                <h5 className="font-semibold text-slate-900 mb-2">Preuve Visuelle</h5>
                <p className="text-sm text-slate-600">
                  Vidéo enregistrée par le client montrant l'état réel du produit
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <Video className="w-6 h-6 text-red-600" />
                </div>
                <h5 className="font-semibold text-slate-900 mb-2">Double Vérification</h5>
                <p className="text-sm text-slate-600">
                  Le livreur compare le produit reçu avec la vidéo initiale
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <Truck className="w-6 h-6 text-red-600" />
                </div>
                <h5 className="font-semibold text-slate-900 mb-2">Protection</h5>
                <p className="text-sm text-slate-600">
                  Évite les échanges frauduleux et les produits substitués
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-slate-900 mb-4 text-center">
              Processus de Vérification Livreur
            </h4>

            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-4 flex gap-4 items-center">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Scan du Bordereau</p>
                  <p className="text-sm text-slate-600">Le livreur scanne le bordereau d'échange</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 flex gap-4 items-center">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 flex items-center gap-2">
                    Visionne la Vidéo
                    <Play className="w-4 h-4 text-blue-600" />
                  </p>
                  <p className="text-sm text-slate-600">
                    Regarde la vidéo enregistrée par le client
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 flex gap-4 items-center">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Compare le Produit</p>
                  <p className="text-sm text-slate-600">
                    Vérifie que le produit reçu correspond à la vidéo
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 flex gap-4 items-center">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Accepte ou Refuse</p>
                  <p className="text-sm text-slate-600">
                    Valide ou rejette l'échange selon la conformité
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-500">
              <h5 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                ✓ Échange Accepté
              </h5>
              <p className="text-sm text-green-800 mb-3">
                Quand le produit correspond à la vidéo
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Produit conforme</li>
                <li>• État identique à la vidéo</li>
                <li>• Pas de substitution</li>
                <li>• Livraison du nouveau produit</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-500">
              <h5 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <X className="w-5 h-5" />
                ✗ Échange Refusé
              </h5>
              <p className="text-sm text-red-800 mb-3">
                Quand le produit ne correspond pas
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Produit différent de la vidéo</li>
                <li>• État non conforme</li>
                <li>• Tentative de fraude</li>
                <li>• Retour chez le client</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "Communication Client",
      description: "Messagerie intégrée et suivi des échanges",
      icon: MessageSquare,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <MessageSquare className="w-16 h-16 text-indigo-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Communiquez avec vos Clients
            </h3>
            <p className="text-slate-600">
              Messagerie en temps réel et notifications automatiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat en Temps Réel
              </h4>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-indigo-600">C</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Client</p>
                      <p className="text-xs text-slate-600">Est-ce que la taille M est disponible?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 flex-row-reverse">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">V</span>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-sm font-medium text-slate-900">Vous</p>
                      <p className="text-xs text-slate-600">Oui, nous avons la taille M en stock!</p>
                    </div>
                  </div>
                </div>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Messages instantanés
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Historique complet
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Notifications push
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-4">Notifications Automatiques</h4>
              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                  <p className="text-sm font-medium text-green-900">Nouvelle demande d'échange</p>
                  <p className="text-xs text-green-700">Client: Ahmed Ben Ali</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                  <p className="text-sm font-medium text-blue-900">Échange validé</p>
                  <p className="text-xs text-blue-700">Code: EXC-2024-001</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                  <p className="text-sm font-medium text-purple-900">En cours de livraison</p>
                  <p className="text-xs text-purple-700">Livreur assigné</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3 border-l-4 border-emerald-500">
                  <p className="text-sm font-medium text-emerald-900">Échange terminé</p>
                  <p className="text-xs text-emerald-700">Client satisfait ⭐⭐⭐⭐⭐</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600" />
              Avis Clients
            </h4>
            <p className="text-slate-700 mb-4">
              Après chaque échange réussi, vos clients peuvent laisser un avis sur votre service
            </p>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-slate-900">5.0</span>
              </div>
              <p className="text-sm text-slate-600 italic">
                "Service excellent! Échange rapide et facile. Très satisfait du nouveau produit."
              </p>
              <p className="text-xs text-slate-500 mt-2">- Ahmed, Client vérifié</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Prêt à Commencer!",
      description: "Vous maîtrisez maintenant tous les aspects de SWAPP",
      icon: CheckCircle2,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">
              Félicitations!
            </h3>
            <p className="text-lg text-slate-600">
              Vous êtes prêt à utiliser SWAPP pour gérer vos échanges
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
            <h4 className="font-semibold text-slate-900 mb-4 text-center text-lg">
              Récapitulatif
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h5 className="font-semibold text-slate-900">QR Codes</h5>
                </div>
                <p className="text-sm text-slate-600">
                  Vous savez comment générer, imprimer et placer vos QR codes
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h5 className="font-semibold text-slate-900">Processus d'Échange</h5>
                </div>
                <p className="text-sm text-slate-600">
                  Vous comprenez comment les clients demandent un échange
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h5 className="font-semibold text-slate-900">Vérification Vidéo</h5>
                </div>
                <p className="text-sm text-slate-600">
                  Vous savez comment la vidéo protège contre les fraudes
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h5 className="font-semibold text-slate-900">Communication</h5>
                </div>
                <p className="text-sm text-slate-600">
                  Vous pouvez chatter avec vos clients en temps réel
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-4">🚀 Prochaines Étapes</h4>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <p className="font-medium text-blue-900">Explorez votre Dashboard</p>
                  <p className="text-sm text-blue-700">
                    Familiarisez-vous avec toutes les fonctionnalités
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <p className="font-medium text-blue-900">Générez vos premiers QR Codes</p>
                  <p className="text-sm text-blue-700">
                    Créez des QR codes pour vos clients réguliers
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <p className="font-medium text-blue-900">Personnalisez votre Marque</p>
                  <p className="text-sm text-blue-700">
                    Ajoutez votre logo et couleurs dans les paramètres
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <div>
                  <p className="font-medium text-blue-900">Commencez à recevoir des échanges!</p>
                  <p className="text-sm text-blue-700">
                    Tout est prêt pour vos premiers échanges
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-900 text-center">
              💡 <strong>Conseil:</strong> Vous pouvez toujours revoir ce tutoriel depuis les paramètres de votre compte
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Guide de Démarrage</h1>
            <p className="text-slate-600 mt-1">
              Étape {currentStep + 1} sur {steps.length}
            </p>
          </div>
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            Passer le tutoriel
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8 gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                index === currentStep
                  ? "bg-blue-600 text-white scale-110"
                  : index < currentStep
                  ? "bg-green-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="font-bold">{index + 1}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <currentStepData.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {currentStepData.title}
              </h2>
              <p className="text-slate-600">{currentStepData.description}</p>
            </div>
          </div>

          <div>{currentStepData.content}</div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Précédent
          </button>

          <div className="flex gap-3">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
              >
                Suivant
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
              >
                Commencer à utiliser SWAPP
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
