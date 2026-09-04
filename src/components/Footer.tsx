import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 border-t border-line bg-card/80 backdrop-blur-[2px]">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
        <p className="text-center text-sm text-muted">
          {t("footer.rights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
