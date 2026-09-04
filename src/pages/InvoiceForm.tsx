import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarRange,
  FileText,
  ListChecks,
  Plus,
  ReceiptIndianRupee,
  RotateCcw,
  UserRoundPen,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import GeneralSection from "../components/GeneralSection";
import InvoiceDetails from "../components/InvoiceDetails";
import TaxSection from "../components/TaxSection";
import SectionCard from "../components/SectionCard";
import ConfirmDialog from "../components/ConfirmDialog";
import ThemeToggle from "../components/ThemeToggle";
import HeaderClock from "../components/HeaderClock";
import LanguageToggle from "../components/LanguageToggle";
import {
  LineItemsCardArt,
  ReceiverCardArt,
} from "../components/illustrations/cardArt";
import FullscreenToggle from "../components/FullscreenToggle";
import { Button } from "../components/Button";
import { SelectField } from "../components/Field";

import { useDataContext } from "../hooks/Context";
import { Month } from "../types/month";
import { getPreviousMonth, monthNames } from "../utils/getCurrentMonth";
import { getTodayInputDate } from "../utils/date";
import { getCompanyLogo } from "../utils/companyLogo";
import { useInvoiceStore } from "../store/useInvoiceStore";
import { fadeUp, staggerContainer } from "../utils/motion";

export default function InvoiceForm() {
  const { t } = useTranslation();
  const { setData } = useDataContext();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [failedLogo, setFailedLogo] = useState<string>();
  const {
    selectedInvoiceMonth,
    setSelectedInvoiceMonth,
    formData,
    setFormData,
    resetForm,
  } = useInvoiceStore();

  // Every visit starts on the previous billing month and today's invoice date.
  useEffect(() => {
    setSelectedInvoiceMonth(getPreviousMonth());
    setFormData({ invoiceDate: getTodayInputDate() });
  }, [setSelectedInvoiceMonth, setFormData]);

  const navigate = useNavigate();

  const companyLogo = getCompanyLogo(formData.invoiceFromCompany);
  const showCompanyLogo = Boolean(companyLogo) && companyLogo !== failedLogo;

  const validateForm = () => {
    const errors = [];

    if (!formData.invoiceDetails?.length) {
      toast.error(t("validation.atLeastOneDuty"));
      errors.push("invoiceDetails");
      return false;
    } else {
      let isValid = formData.invoiceDetails.every((details) => {
        const isAnyFieldFilled =
          (details.amount !== undefined && details.amount !== "") ||
          (details.duty !== undefined && details.duty !== "") ||
          (details.description !== undefined && details.description !== "") ||
          (details.rate !== undefined && details.rate !== "");

        return (
          !isAnyFieldFilled ||
          (details.amount &&
            details.duty &&
            details.description &&
            details.rate) // Otherwise, all must be filled
        );
      });

      if (!isValid) {
        toast.error(t("validation.incompleteDetails"));
        errors.push("invoiceDetails");
        return false;
      }
    }

    if (!formData.invoiceNumber) {
      toast.error(t("validation.invoiceNumber"));
      errors.push("invoiceNumber");
      return false;
    }

    if (!formData.invoiceDate) {
      toast.error(t("validation.invoiceDate"));
      errors.push("invoiceDate");
      return false;
    }

    if (!formData.companyAddress) {
      toast.error(t("validation.companyAddress"));
      errors.push("companyAddress");
      return false;
    }

    if (!formData.totalInvoiceInWords || !formData.totalInvoicePayable) {
      toast.error(t("validation.totals"));
      errors.push("totalInvoice");
      return false;
    }

    if (!formData.totalTaxableAmount) {
      toast.error(t("validation.taxableAmount"));
      errors.push("Tax Error");
      return false;
    }

    if (!formData.taxDuty) {
      toast.error(t("validation.taxDuty"));
      errors.push("Tax Error");
      return false;
    }

    return errors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (setData) setData(formData);
    navigate("/pdf-preview");
  };

  const handleAddRow = () => {
    setFormData({
      invoiceDetails: [
        ...(formData.invoiceDetails || []),
        {
          description: "",
          duty: "",
          rate: "",
          amount: "",
        },
      ],
    });
  };

  const handleSelectChangeInvoiceType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ [name]: value === "Monthly Wage" });
  };

  const handleSelectChangeInvoiceFrom = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ [name]: value });
  };

  const handleSelectChangeMonth = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedInvoiceMonth(event.target.value as Month);
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-10 lg:py-12 xl:px-20 2xl:px-32">
      <motion.form
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <motion.header
          variants={fadeUp}
          className="rounded-card border border-line bg-card/80 p-5 shadow-sm backdrop-blur-[2px] sm:p-7"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <AnimatePresence mode="wait" initial={false}>
                {showCompanyLogo ? (
                  <motion.span
                    key={companyLogo}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex shrink-0 items-center rounded-xl border border-line bg-white p-1.5 shadow-sm dark:border-white/20"
                  >
                    <img
                      src={companyLogo}
                      alt={formData.invoiceFromCompany}
                      onError={() => setFailedLogo(companyLogo)}
                      className="h-9 w-auto max-w-[110px] object-contain sm:h-12 sm:max-w-[180px]"
                    />
                  </motion.span>
                ) : (
                  <motion.span
                    key="fallback"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm dark:text-surface"
                  >
                    <ReceiptIndianRupee className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>

              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  {t("app.name")}
                </h1>
                <p className="mt-0.5 hidden text-sm text-muted sm:block">
                  {t("app.tagline")}
                </p>
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <HeaderClock />
                <LanguageToggle />
                <ThemeToggle />
                <FullscreenToggle />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-line pt-5 sm:grid-cols-3">
              <SelectField
                id="invoiceFromCompany"
                name="invoiceFromCompany"
                label={t("header.company")}
                icon={<Building2 className="h-4 w-4" />}
                value={formData.invoiceFromCompany}
                onChange={handleSelectChangeInvoiceFrom}
              >
                <option value="BLUE SKY ENTERPRICESS">
                  Blue Sky Enterpricess
                </option>
                <option value="RAJAGOPALAN P.V">Rajagopalan P.V</option>
              </SelectField>

              <SelectField
                id="invoiceType"
                name="invoiceType"
                label={t("header.invoiceType")}
                icon={<ReceiptIndianRupee className="h-4 w-4" />}
                value={formData.invoiceType ? "Monthly Wage" : "Daily Wage"}
                onChange={handleSelectChangeInvoiceType}
              >
                <option value="Daily Wage">{t("header.dailyWage")}</option>
                <option value="Monthly Wage">{t("header.monthlyWage")}</option>
              </SelectField>

              <SelectField
                id="invoiceMonth"
                label={t("header.month")}
                icon={<CalendarRange className="h-4 w-4" />}
                value={selectedInvoiceMonth || ""}
                onChange={handleSelectChangeMonth}
              >
                <option value="">{t("header.selectMonth")}</option>
                {monthNames.map((month: Month) => (
                  <option key={month} value={month}>
                    {t(`months.${month}`)}
                  </option>
                ))}
              </SelectField>
            </div>
          </div>
        </motion.header>

        <SectionCard
          step={1}
          title={t("general.title")}
          icon={<UserRoundPen className="h-5 w-5" />}
          art={<ReceiverCardArt />}
          description={t("general.description")}
          action={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              title={t("actions.resetForm")}
              icon={<RotateCcw className="h-4 w-4" />}
            >
              {t("actions.reset")}
            </Button>
          }
        >
          <GeneralSection />
        </SectionCard>

        <SectionCard
          step={2}
          title={t("details.title")}
          icon={<ListChecks className="h-5 w-5" />}
          art={<LineItemsCardArt />}
          description={t("details.description")}
          action={
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddRow}
              icon={<Plus className="h-4 w-4" />}
            >
              {t("details.addRow")}
            </Button>
          }
        >
          <InvoiceDetails />
        </SectionCard>

        <SectionCard
          step={3}
          title={t("tax.title")}
          icon={<Wallet className="h-5 w-5" />}
          description={t("tax.description")}
        >
          <TaxSection />
        </SectionCard>

        <motion.div variants={fadeUp} className="flex justify-center pt-2">
          <Button
            type="submit"
            size="lg"
            className="group w-full sm:w-auto"
            icon={<FileText className="h-5 w-5" />}
          >
            {t("actions.generate")}
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.form>

      <ConfirmDialog
        open={isResetConfirmOpen}
        title={t("resetDialog.title")}
        message={t("resetDialog.message")}
        icon={<RotateCcw className="h-5 w-5" />}
        confirmLabel={t("actions.resetForm")}
        onConfirm={resetForm}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
