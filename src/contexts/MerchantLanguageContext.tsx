import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Language,
  getTranslation,
  getDirection,
  TranslationKey,
} from "../lib/i18n";

interface MerchantLanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
}

const MerchantLanguageContext = createContext<MerchantLanguageContextType | undefined>(
  undefined,
);

export function MerchantLanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("merchantLanguage");
    return saved === "ar" || saved === "fr" ? saved : "fr";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("merchantLanguage", newLang);
  };

  const t = (key: TranslationKey) => getTranslation(lang, key);
  const dir = getDirection(lang);

  useEffect(() => {
    // Only apply direction if we're in merchant context
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  return (
    <MerchantLanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </MerchantLanguageContext.Provider>
  );
}

export function useMerchantLanguage() {
  const context = useContext(MerchantLanguageContext);
  if (!context) {
    throw new Error("useMerchantLanguage must be used within a MerchantLanguageProvider");
  }
  return context;
}
