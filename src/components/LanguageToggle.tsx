import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Menu, MenuItem } from "./Menu";
import { Language, languages, storeLanguage } from "../i18n";

// Switches the interface language and remembers the choice.
export const LanguageToggle = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = (
    languages.includes(i18n.language as Language) ? i18n.language : "en"
  ) as Language;

  const items: MenuItem[] = languages.map((language) => ({
    label: t(`language.${language}`),
    selected: language === currentLanguage,
    onClick: () => {
      i18n.changeLanguage(language);
      storeLanguage(language);
    },
  }));

  return (
    <Menu
      items={items}
      label={t("language.label")}
      icon={<Languages className="h-4 w-4" />}
      triggerText={currentLanguage.toUpperCase()}
    />
  );
};

export default LanguageToggle;
