import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User, Building2, Check, Shield, Clock, Truck, MapPin, Phone, Upload, FileText, CreditCard, X } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function MerchantSignup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactName: "",
    phone: "",
    address: "",
    city: "",
    governorate: "",
    businessType: "" as "individual" | "enterprise" | "",
    documentFile: null as File | null,
    documentPreview: "",
  });

  const governorates = [
    "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
    "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse",
    "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
    "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep1 = () => {
    if (!formData.businessType) {
      setError("Veuillez sélectionner le type de compte");
      return false;
    }
    if (!formData.businessName.trim()) {
      setError("Le nom de l'entreprise est requis");
      return false;
    }
    if (!formData.city.trim()) {
      setError("La ville est requise");
      return false;
    }
    if (!formData.governorate) {
      setError("Le gouvernorat est requis");
      return false;
    }
    if (!formData.address.trim()) {
      setError("L'adresse est requise");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.contactName.trim()) {
      setError("Le nom de contact est requis");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Le numéro de téléphone est requis");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Email invalide");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.documentFile) {
      setError(formData.businessType === "individual"
        ? "Veuillez télécharger votre carte CIN"
        : "Veuillez télécharger votre patente");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError("Format non supporté. Utilisez JPG, PNG, WebP ou PDF.");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Le fichier est trop volumineux. Maximum 5MB.");
        return;
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            documentFile: file,
            documentPreview: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData(prev => ({
          ...prev,
          documentFile: file,
          documentPreview: "",
        }));
      }
      setError("");
    }
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      documentFile: null,
      documentPreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nextStep = () => {
    setError("");
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setError("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const uploadDocument = async (userId: string): Promise<string | null> => {
    if (!formData.documentFile) return null;

    const fileExt = formData.documentFile.name.split('.').pop();
    const docType = formData.businessType === "individual" ? "cin" : "patente";
    const fileName = `${userId}/${docType}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('merchant-documents')
      .upload(fileName, formData.documentFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Document upload error:", error);
      throw new Error("Erreur lors du téléchargement du document");
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('merchant-documents')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateStep3()) {
      setLoading(false);
      return;
    }

    try {
      // Create auth user with email confirmation enabled
      const redirectUrl = `${window.location.origin}/#/confirm-email`;
      console.log("Signup with email redirect to:", redirectUrl);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            business_name: formData.businessName,
            contact_name: formData.contactName,
            phone: formData.phone,
            user_type: 'merchant',
          },
        },
      });

      if (authError) throw authError;

      console.log("Signup successful:", authData);

      if (authData.user) {
        // Upload document
        setUploading(true);
        let documentUrl = null;
        try {
          documentUrl = await uploadDocument(authData.user.id);
        } catch (uploadErr) {
          console.error("Document upload failed:", uploadErr);
          // Continue with signup even if upload fails - they can upload later
        }
        setUploading(false);

        // Create or update merchant record
        // First try to update existing record by id
        const { data: existingMerchant } = await supabase
          .from("merchants")
          .select("id")
          .eq("id", authData.user.id)
          .single();

        let merchantError;
        if (existingMerchant) {
          // Update existing merchant
          const { error } = await supabase
            .from("merchants")
            .update({
              email: formData.email.trim().toLowerCase(),
              name: formData.contactName,
              phone: formData.phone,
              business_name: formData.businessName,
              business_address: formData.address,
              business_city: formData.city,
              business_postal_code: formData.governorate,
              business_type: formData.businessType,
              verification_document_url: documentUrl,
              verification_status: documentUrl ? 'pending' : 'not_submitted',
            })
            .eq("id", authData.user.id);
          merchantError = error;
        } else {
          // Insert new merchant
          const { error } = await supabase
            .from("merchants")
            .insert({
              id: authData.user.id,
              email: formData.email.trim().toLowerCase(),
              name: formData.contactName,
              phone: formData.phone,
              business_name: formData.businessName,
              business_address: formData.address,
              business_city: formData.city,
              business_postal_code: formData.governorate,
              business_type: formData.businessType,
              verification_document_url: documentUrl,
              verification_status: documentUrl ? 'pending' : 'not_submitted',
            });
          merchantError = error;
        }

        if (merchantError) {
          console.error("Merchant creation error:", merchantError);
          throw new Error("Erreur lors de la création du compte marchand");
        }

        // Auto-add Test Delivery integration for all new merchants
        const { error: testDeliveryError } = await supabase
          .from("delivery_integrations")
          .insert({
            merchant_id: authData.user.id,
            delivery_company: "test_delivery",
            api_key: "test-key-auto-generated",
            status: "active",
          });

        if (testDeliveryError) {
          console.error("Test delivery integration error:", testDeliveryError);
        }

        // Redirect to check email page immediately
        navigate(`/check-email?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      console.error("Signup error:", err);

      if (err.message?.includes("User already registered")) {
        setError("Cette adresse email est déjà enregistrée. Veuillez vous connecter ou utiliser une autre adresse email.");
      } else if (err.message?.includes("duplicate key")) {
        setError("Un compte avec cette adresse email existe déjà. Veuillez vous connecter.");
      } else {
        setError(err.message || "Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12 bg-white">
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-slate-500 hover:text-slate-900 mb-8 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </button>

          <div className="mb-8">
            <span className="text-2xl font-bold text-slate-900 mb-8 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>ixmoove</span>
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-slate-500">
              Commencez à gérer vos échanges efficacement
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-sm font-medium hidden sm:block">Entreprise</span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200">
              <div className={`h-full bg-blue-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-sm font-medium hidden sm:block">Compte</span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200">
              <div className={`h-full bg-blue-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                3
              </div>
              <span className="text-sm font-medium hidden sm:block">Document</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={step === 3 ? handleSignup : (e) => { e.preventDefault(); nextStep(); }}>
            {step === 1 && (
              <div className="space-y-5">
                {/* Business Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Type de compte
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, businessType: "individual" }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.businessType === "individual"
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <CreditCard className={`w-6 h-6 mb-2 ${formData.businessType === "individual" ? "text-blue-600" : "text-slate-400"}`} />
                      <p className={`font-medium ${formData.businessType === "individual" ? "text-blue-600" : "text-slate-700"}`}>Particulier</p>
                      <p className="text-xs text-slate-500 mt-1">Avec carte CIN</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, businessType: "enterprise" }))}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.businessType === "enterprise"
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Building2 className={`w-6 h-6 mb-2 ${formData.businessType === "enterprise" ? "text-blue-600" : "text-slate-400"}`} />
                      <p className={`font-medium ${formData.businessType === "enterprise" ? "text-blue-600" : "text-slate-700"}`}>Entreprise</p>
                      <p className="text-xs text-slate-500 mt-1">Avec patente</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {formData.businessType === "individual" ? "Nom de votre boutique" : "Nom de l'entreprise"}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder={formData.businessType === "individual" ? "Ma Boutique" : "Mon Entreprise SARL"}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Tunis"
                      className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Gouvernorat
                    </label>
                    <select
                      name="governorate"
                      required
                      value={formData.governorate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900"
                    >
                      <option value="">Sélectionner</option>
                      {governorates.map((gov) => (
                        <option key={gov} value={gov}>
                          {gov}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Adresse complète
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="15 Rue de la Liberté"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
                >
                  Continuer
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nom du responsable
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="Ahmed Ben Ali"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Téléphone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+216 XX XXX XXX"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email professionnel
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@monentreprise.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">Minimum 6 caractères</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3.5 border border-slate-300 text-slate-700 rounded-md font-medium transition-colors hover:bg-slate-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
                  >
                    Continuer
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {formData.businessType === "individual" ? (
                      <CreditCard className="w-8 h-8 text-blue-600" />
                    ) : (
                      <FileText className="w-8 h-8 text-blue-600" />
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">
                    {formData.businessType === "individual"
                      ? "Téléchargez votre carte CIN"
                      : "Téléchargez votre patente"}
                  </h2>
                  <p className="text-slate-500 text-sm">
                    {formData.businessType === "individual"
                      ? "Photo recto de votre carte d'identité nationale"
                      : "Document officiel de votre registre de commerce"}
                  </p>
                </div>

                {/* File Upload Area */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="document-upload"
                  />

                  {!formData.documentFile ? (
                    <label
                      htmlFor="document-upload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all"
                    >
                      <Upload className="w-10 h-10 text-slate-400 mb-3" />
                      <p className="text-sm font-medium text-slate-600">
                        Cliquez pour télécharger
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        JPG, PNG, WebP ou PDF (max. 5MB)
                      </p>
                    </label>
                  ) : (
                    <div className="relative border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 p-1.5 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {formData.documentPreview ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={formData.documentPreview}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-slate-700 truncate max-w-[200px]">
                              {formData.documentFile.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {(formData.documentFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Prêt à télécharger
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center">
                            <FileText className="w-10 h-10 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-700 truncate max-w-[200px]">
                              {formData.documentFile.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {(formData.documentFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Prêt à télécharger
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Important:</strong> Ce document sera vérifié par notre équipe pour valider votre compte. Assurez-vous que le document est lisible et non expiré.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3.5 border border-slate-300 text-slate-700 rounded-md font-medium transition-colors hover:bg-slate-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-md font-semibold transition-colors"
                  >
                    {uploading ? "Téléchargement..." : loading ? "Création en cours..." : "Créer mon compte"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Vous avez déjà un compte?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col justify-center px-16 py-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full mb-8">
            <span className="text-sm font-medium text-blue-400">Rejoignez-nous</span>
          </div>

          <h2 className="text-4xl font-semibold text-white mb-6 leading-tight">
            Externalisez vos échanges{" "}
            <span className="text-blue-400">en toute confiance</span>
          </h2>

          <p className="text-lg text-slate-400 mb-12 leading-relaxed">
            ixmoove gère vos livraisons d'échanges avec vérification terrain.
            Concentrez-vous sur votre business, on s'occupe du reste.
          </p>

          <div className="space-y-4">
            {[
              {
                icon: Shield,
                title: "Protection anti-fraude",
                desc: "Vérification de chaque produit retourné"
              },
              {
                icon: Truck,
                title: "Livraison spécialisée",
                desc: "Livreurs formés aux échanges"
              },
              {
                icon: Clock,
                title: "Délai 24-48h",
                desc: "Échanges traités rapidement"
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6">
            {[
              { value: "5,000+", label: "Échanges" },
              { value: "98%", label: "Satisfaction" },
              { value: "9 TND", label: "Par échange" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-semibold text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
