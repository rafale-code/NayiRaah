import React, { JSX, useMemo, useState } from "react";

// Saathi – Bereavement Help (India)
// Single-file React component, TailwindCSS only (no external UI libs)
// Minimal changes: added TypeScript types for component props and handlers
// (keeps your original structure & content intact)

const SHEETS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzxBLZQ1Z11ybkrdFTJ-DLyUzrKlQA5p2et4F-EjHqmWihMWFsUWgxTgd8RsREjYbAqQw/exec"; // ← replace with your Apps Script URL

type Lang = "en" | "hi";

interface Step {
  title: { en: string; hi: string };
  points: { en: string[]; hi: string[] };
}

interface Resource {
  name: string;
  desc: { en: string; hi: string };
  link: string;
}

interface SectionProps {
  title: string;
  children?: React.ReactNode;
  id?: string;
}

interface StepCardProps {
  idx: number;
  title: string;
  points: string[];
  lang: Lang;
}

interface ResourceCardProps {
  name: string;
  desc: string;
  link: string;
  visitLabel: string;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title: string;
}

const CONTENT = {
  en: {
    brand: "Nayi Raah",
    tagline: "Help after a loss",
    heroTitle: "Step-by-step help when a loved one passes",
    heroDesc:
      "A simple, step-by-step checklist with trusted resources. No legal jargon. No sign-up. Free.",
    searchPlaceholder: "Search steps e.g. EPF, nominee, property",
    quickFactsTitle: "Quick facts",
    startChecklist: "Start checklist",
    visit: "Visit",
    stepLabel: "Step",
    checklistTitle: "Step-by-step Checklist",
    resourcesTitle: "Resources & Helplines (Haryana)",
    faqTitle: "Frequently Asked Questions",
    nav: {
      checklist: "Checklist",
      resources: "Resources",
      faq: "FAQ",
      contact: "Consult",
    },
    copyLink: "Copy link",
    copied: "Link copied",
    print: "Print checklist",
    footer: {
      privacy: "Privacy",
      disclaimer: "Disclaimer",
      feedback: "Feedback",
    },
    consult: {
      open: "Request Consultation",
      title: "Request a Consultation",
      subtitle:
        "Share your details and we’ll connect you with the right legal help for succession, property transfer, insurance/PF claims, and more.",
      name: "Full Name",
      age: "Age",
      gender: "Gender",
      genderOpts: { male: "Male", female: "Female", other: "Other" },
      phone: "Phone Number",
      email: "Email",
      submit: "Submit",
      cancel: "Cancel",
      success: "Thanks! We’ll reach out soon.",
      error: "Submitted. If there’s an issue, please try again.",
    },
    quickFacts: [
      "Keep 10–15 copies of the death certificate.",
      "Nominee receives funds first; final rights follow succession law.",
      "DLSA provides free legal aid in every district.",
      "Avoid middlemen; use official claim forms only.",
    ],
    faq: [
      {
        q: "Nominee vs legal heir — who actually gets the money?",
        a: "A nominee is a caretaker to receive funds; distribution ultimately follows succession laws or a valid will.",
      },
      {
        q: "No nominee in bank account — what now?",
        a: "Ask the bank for their deceased claim process. You may need a legal heir or succession certificate.",
      },
      {
        q: "How many copies of the death certificate should I keep?",
        a: "Keep 10–15 certified copies; many institutions still ask for a physical copy.",
      },
      {
        q: "Where can I get free legal aid?",
        a: "DLSA (through HSLSA in Haryana) provides free legal assistance in every district.",
      },
    ],
  },
  hi: {
    brand: "नई राह",
    tagline: "शोक के बाद सहायता",
    heroTitle: "जब कोई अपना चला जाए — कदम-दर-कदम सहारा।",
    heroDesc:
      "सरल चरण-दर-चरण चेकलिस्ट और भरोसेमंद संसाधन। बिना कानूनी जटिल भाषा, बिना साइन-अप, निःशुल्क।",
    searchPlaceholder: "खोजें: EPF, नामित व्यक्ति, संपत्ति",
    quickFactsTitle: "त्वरित तथ्य",
    startChecklist: "चेकलिस्ट शुरू करें",
    visit: "देखें",
    stepLabel: "चरण",
    checklistTitle: "चरण-दर-चरण चेकलिस्ट",
    resourcesTitle: "संसाधन व हेल्पलाइन (हरियाणा)",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    nav: {
      checklist: "चेकलिस्ट",
      resources: "संसाधन",
      faq: "प्रश्न",
      contact: "परामर्श",
    },
    copyLink: "लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया",
    print: "चेकलिस्ट प्रिंट करें",
    footer: {
      privacy: "गोपनीयता",
      disclaimer: "अस्वीकरण",
      feedback: "प्रतिक्रिया",
    },
    consult: {
      open: "कानूनी परामर्श का अनुरोध करें",
      title: "परामर्श अनुरोध",
      subtitle:
        "अपना विवरण साझा करें — उत्तराधिकार, संपत्ति नामांतरण, बीमा/पीएफ दावे आदि के लिए हम आपको सही कानूनी सहायता से जोड़ेंगे।",
      name: "पूरा नाम",
      age: "आयु",
      gender: "लिंग",
      genderOpts: { male: "पुरुष", female: "महिला", other: "अन्य" },
      phone: "फ़ोन नंबर",
      email: "ईमेल",
      submit: "जमा करें",
      cancel: "रद्द करें",
      success: "धन्यवाद! हम शीघ्र आपसे संपर्क करेंगे।",
      error: "जमा कर दिया गया। समस्या हो तो कृपया पुनः प्रयास करें।",
    },
    quickFacts: [
      "मृत्यु प्रमाणपत्र की 10–15 प्रतियाँ रखें।",
      "नामित व्यक्ति को राशि मिलती है; अंतिम अधिकार उत्तराधिकार कानून से तय होते हैं।",
      "हर ज़िले में DLSA द्वारा निःशुल्क विधिक सहायता उपलब्ध है।",
      "बिचौलियों से बचें; केवल आधिकारिक फॉर्म का उपयोग करें।",
    ],
    faq: [
      {
        q: "नामित व्यक्ति बनाम कानूनी वारिस — वास्तविक अधिकार किसका?",
        a: "नामित व्यक्ति धन प्राप्त करने का अभिकर्ता होता है; अंतिम अधिकार उत्तराधिकार कानून या वैध वसीयत से तय होते हैं।",
      },
      {
        q: "बैंक खाते में नामित व्यक्ति नहीं है — अब क्या करें?",
        a: "बैंक की मृतक दावे की प्रक्रिया पूछें। कानूनी वारिस/उत्तराधिकार प्रमाणपत्र की आवश्यकता पड़ सकती है।",
      },
      {
        q: "मृत्यु प्रमाणपत्र की कितनी प्रतियाँ रखें?",
        a: "10–15 सत्यापित प्रतियाँ रखें; अनेक संस्थाएँ अभी भी भौतिक प्रति मांगती हैं।",
      },
      {
        q: "निःशुल्क कानूनी सहायता कहाँ मिलेगी?",
        a: "हरियाणा में HSLSA के माध्यम से DLSA प्रत्येक ज़िले में निःशुल्क विधिक सहायता प्रदान करता है।",
      },
    ],
  },
};

const STEPS: Step[] = [
  {
    title: {
      en: "Get the Death Certificate",
      hi: "मृत्यु प्रमाणपत्र प्राप्त करें",
    },
    points: {
      en: [
        "Apply at local municipal authority/hospital.",
        "Collect 10–15 certified copies for claims and transfers.",
        "Keep soft scans (PDF/photos) for easy submission.",
      ],
      hi: [
        "स्थानीय नगर निगम/अस्पताल से आवेदन करें।",
        "दावों/हस्तांतरण हेतु 10–15 सत्यापित प्रतियाँ लें।",
        "आसान जमा हेतु स्कैन/फ़ोटो सुरक्षित रखें।",
      ],
    },
  },
  {
    title: {
      en: "Inform Key Institutions",
      hi: "महत्वपूर्ण संस्थाओं को सूचित करें",
    },
    points: {
      en: [
        "Banks, employer (EPF/Gratuity/Pension), insurer.",
        "Police if sudden/unnatural death.",
      ],
      hi: [
        "बैंक, नियोक्ता (EPF/ग्रेच्युटी/पेंशन), बीमा कंपनी।",
        "अचानक/अस्वाभाविक मृत्यु पर पुलिस को सूचित करें।",
      ],
    },
  },
  {
    title: {
      en: "Secure Important Documents",
      hi: "महत्वपूर्ण दस्तावेज़ सुरक्षित रखें",
    },
    points: {
      en: [
        "Aadhaar, PAN, Passport, Voter ID.",
        "Bank passbooks, insurance policies, EPF details.",
        "Property papers, vehicle RCs, marriage certificate.",
      ],
      hi: [
        "आधार, पैन, पासपोर्ट, वोटर आईडी।",
        "बैंक पासबुक, बीमा पॉलिसी, EPF विवरण।",
        "संपत्ति कागज़ात, वाहन आरसी, विवाह प्रमाणपत्र।",
      ],
    },
  },
  {
    title: {
      en: "Access Bank Accounts & Funds",
      hi: "बैंक खातों/राशि तक पहुँच",
    },
    points: {
      en: [
        "If nominee exists: submit death certificate + your ID.",
        "If no nominee: legal heir/succession certificate may be required.",
        "Ask bank for their deceased claim forms.",
      ],
      hi: [
        "यदि नामित व्यक्ति है: मृत्यु प्रमाणपत्र + पहचान दें।",
        "यदि नामित नहीं: कानूनी वारिस/उत्तराधिकार प्रमाणपत्र लग सकता है।",
        "बैंक से मृतक दावा फॉर्म माँगें।",
      ],
    },
  },
  {
    title: { en: "Claim Insurance & PF", hi: "बीमा व पीएफ दावा करें" },
    points: {
      en: [
        "Life insurance: file claim with death certificate.",
        "EPF/Gratuity: apply via employer/EPFO with forms.",
        "Keep acknowledgement receipts.",
      ],
      hi: [
        "जीवन बीमा: मृत्यु प्रमाणपत्र के साथ दावा करें।",
        "EPF/ग्रेच्युटी: नियोक्ता/EPFO माध्यम से फॉर्म जमा करें।",
        "प्राप्ति रसीदें सुरक्षित रखें।",
      ],
    },
  },
  {
    title: { en: "Transfer Property/Assets", hi: "संपत्ति/संपदा का हस्तांतरण" },
    points: {
      en: [
        "If will exists: probate may be required (state-specific).",
        "No will: apply for succession certificate in court.",
        "Get mutation of land/house at municipal/revenue office.",
      ],
      hi: [
        "वसीयत हो तो (राज्य अनुसार) प्रोबेट लग सकता है।",
        "वसीयत न हो तो न्यायालय से उत्तराधिकार प्रमाणपत्र लें।",
        "भूमि/मकान नामांतरण (म्यूटेशन) कराएँ।",
      ],
    },
  },
  {
    title: { en: "Govt Support & Schemes", hi: "सरकारी सहायता व योजनाएँ" },
    points: {
      en: [
        "State Widow Pension (names vary by state).",
        "PM Suraksha Bima / PM Jeevan Jyoti Bima (if enrolled).",
        "Scholarships for children of deceased parents.",
      ],
      hi: [
        "राज्य की विधवा पेंशन (राज्य अनुसार नाम अलग)।",
        "पीएम सुरक्षा बीमा / पीएम जीवन ज्योति बीमा (यदि नामांकित)।",
        "अभिभावक-विहीन बच्चों के लिए छात्रवृत्तियाँ।",
      ],
    },
  },
  {
    title: {
      en: "Notify & Update Utilities",
      hi: "यूटिलिटीज़ अपडेट/सूचित करें",
    },
    points: {
      en: [
        "Transfer/cancel electricity, water, gas, mobile lines.",
        "Close subscriptions: DTH, streaming, gym, etc.",
        "Update address/KYC.",
      ],
      hi: [
        "बिजली, पानी, गैस, मोबाइल लाइनों का हस्तांतरण/समापन।",
        "DTH, स्ट्रीमिंग, जिम आदि सदस्यता बंद करें।",
        "पता/KYC अपडेट करें।",
      ],
    },
  },
  {
    title: {
      en: "Support for Children/Dependents",
      hi: "बच्चों/आश्रितों के लिए सहायता",
    },
    points: {
      en: [
        "NGO-led free/discounted education programs.",
        "Apply for state/central scholarships and fee waivers.",
        "Seek grief counselling (some NGOs offer free).",
      ],
      hi: [
        "NGO द्वारा संचालित निःशुल्क/रियायती शिक्षा कार्यक्रम।",
        "राज्य/केंद्र छात्रवृत्ति व फीस छूट के लिए आवेदन करें।",
        "शोक परामर्श लें (कई NGO निःशुल्क देते हैं)।",
      ],
    },
  },
  {
    title: {
      en: "Get Legal Help (if stuck)",
      hi: "कानूनी मदद लें (यदि अटकें)",
    },
    points: {
      en: [
        "District Legal Services Authority (DLSA) — free legal aid.",
        "Local bar association lawyers for succession/property.",
        "Use verified NGOs; avoid paying middlemen.",
      ],
      hi: [
        "जिला विधिक सेवा प्राधिकरण (DLSA) — निःशुल्क विधिक सहायता।",
        "उत्तराधिकार/संपत्ति हेतु स्थानीय वकीलों से सलाह लें।",
        "सत्यापित NGO ही चुनें; बिचौलियों से बचें।",
      ],
    },
  },
];

const HARYANA_RESOURCES: Resource[] = [
  {
    name: "Antyodaya Saral Haryana",
    desc: {
      en: "Single-window portal for state services (certificates, pensions, etc.)",
      hi: "राज्य सेवाओं (प्रमाणपत्र, पेंशन आदि) हेतु एकल-पोर्टल",
    },
    link: "https://saralharyana.gov.in/",
  },
  {
    name: "Social Justice & Empowerment Dept (Haryana)",
    desc: {
      en: "Widow/destitute pensions and social welfare schemes",
      hi: "विधवा/निर्धन पेंशन व सामाजिक कल्याण योजनाएँ",
    },
    link: "https://socialjusticehry.gov.in/",
  },
  {
    name: "Women & Child Development (Haryana)",
    desc: {
      en: "Support schemes for women and children",
      hi: "महिला व बाल कल्याण हेतु योजनाएँ",
    },
    link: "https://wcdhry.gov.in/",
  },
  {
    name: "Haryana State Legal Services Authority (HSLSA)",
    desc: {
      en: "Free legal aid via DLSA in every district",
      hi: "हर ज़िले में DLSA के माध्यम से निःशुल्क विधिक सहायता",
    },
    link: "https://hslsa.gov.in/",
  },
  {
    name: "EPFO – Death Claims (All-India)",
    desc: {
      en: "How to file EPF/EDLI/Gratuity death claims",
      hi: "EPF/EDLI/ग्रेच्युटी मृत्यु दावे कैसे करें",
    },
    link: "https://www.epfindia.gov.in/",
  },
];

function Section({ title, children, id }: SectionProps) {
  return (
    <section id={id} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
        {title}
      </h2>
      <div className="text-base sm:text-lg leading-relaxed text-gray-700">
        {children}
      </div>
    </section>
  );
}

function StepCard({ idx, title, points, lang }: StepCardProps) {
  const [open, setOpen] = useState<boolean>(idx < 3);
  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start justify-between gap-4"
        aria-expanded={open}
      >
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {CONTENT[lang].stepLabel} {idx}
          </div>
          <div className="mt-1 text-lg sm:text-xl font-semibold">{title}</div>
        </div>
        <span className="shrink-0 text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <ul className="mt-4 list-disc pl-5 space-y-2">
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ResourceCard({ name, desc, link, visitLabel }: ResourceCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="block bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
    >
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
      <div className="mt-3 text-sm underline">{visitLabel}</div>
    </a>
  );
}

function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function SaathiApp(): JSX.Element {
  const [lang, setLang] = useState<Lang>("en");
  const t = CONTENT[lang];
  const [query, setQuery] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // using a string-indexed form state to avoid implicit any/type issues when updating by name
  const [form, setForm] = useState<{ [key: string]: string }>({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
  });

  const filteredSteps = useMemo<Step[]>(() => {
    if (!query.trim()) return STEPS;
    const q = query.toLowerCase();
    return STEPS.filter(
      (s) =>
        s.title.en.toLowerCase().includes(q) ||
        s.title.hi.toLowerCase().includes(q) ||
        s.points.en.some((p) => p.toLowerCase().includes(q)) ||
        s.points.hi.some((p) => p.toLowerCase().includes(q))
    );
  }, [query]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert(t.copied);
    } catch {}
  };

  const printPage = () => window.print();

  const onFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Post to Google Apps Script (replace SHEETS_SCRIPT_URL)
      await fetch(SHEETS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ts: new Date().toISOString() }),
      });
      alert(t.consult.success);
      setShowForm(false);
      setForm({ name: "", age: "", gender: "", phone: "", email: "" });
    } catch (err) {
      alert(t.consult.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              {t.brand}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {t.tagline}
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#checklist" className="hover:underline">
              {t.nav.checklist}
            </a>
            <a href="#resources" className="hover:underline">
              {t.nav.resources}
            </a>
            <a href="#faq" className="hover:underline">
              {t.nav.faq}
            </a>
            <button
              onClick={() => setShowForm(true)}
              className="hover:underline"
            >
              {t.nav.contact}
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded-lg text-sm ${
                lang === "en" ? "bg-gray-900 text-white" : "bg-white border"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-3 py-1 rounded-lg text-sm ${
                lang === "hi" ? "bg-gray-900 text-white" : "bg-white border"
              }`}
            >
              हिं
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              {t.heroTitle}
            </h1>
            <p className="mt-4 text-gray-700 text-base sm:text-lg">
              {t.heroDesc}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full md:w-96 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <button
                onClick={copy}
                className="px-4 py-3 rounded-xl bg-gray-900 text-white text-sm shadow"
              >
                {t.copyLink}
              </button>
              <button
                onClick={printPage}
                className="px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm shadow"
              >
                {t.print}
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm shadow"
              >
                {t.consult.open}
              </button>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 uppercase">
                {t.quickFactsTitle}
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {t.quickFacts.map((f, i) => (
                  <li key={i}>✔ {f}</li>
                ))}
              </ul>
              <a
                href="#checklist"
                className="inline-block mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm"
              >
                {t.startChecklist}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist */}
      <Section title={t.checklistTitle} id="checklist">
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredSteps.map((s, i) => (
            <StepCard
              key={i}
              idx={i + 1}
              title={s.title[lang]}
              points={s.points[lang]}
              lang={lang}
            />
          ))}
        </div>
      </Section>

      {/* Resources – Haryana */}
      <Section title={t.resourcesTitle} id="resources">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HARYANA_RESOURCES.map((r, i) => (
            <ResourceCard
              key={i}
              name={r.name}
              desc={r.desc[lang]}
              link={r.link}
              visitLabel={t.visit}
            />
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title={t.faqTitle} id="faq">
        <div className="divide-y rounded-2xl border border-gray-200 bg-white">
          {t.faq.map((it, i) => (
            <div key={i} className="p-5">
              <div className="font-semibold">{it.q}</div>
              <p className="mt-2 text-gray-700">{it.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-10 border-t bg-white/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              © {new Date().getFullYear()} Saathi • Built as a public-good MVP.
              No tracking. No ads.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:underline">
                {t.footer.privacy}
              </a>
              <a href="#" className="hover:underline">
                {t.footer.disclaimer}
              </a>
              <a href="#" className="hover:underline">
                {t.footer.feedback}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Consultation Modal */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={t.consult.title}
      >
        <p className="text-sm text-gray-600 mb-4">{t.consult.subtitle}</p>
        <form onSubmit={submitForm} className="space-y-3">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onFormChange}
            required
            placeholder={t.consult.name}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={onFormChange}
              required
              min="1"
              placeholder={t.consult.age}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={onFormChange}
              required
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">{t.consult.gender}</option>
              <option value="male">{t.consult.genderOpts.male}</option>
              <option value="female">{t.consult.genderOpts.female}</option>
              <option value="other">{t.consult.genderOpts.other}</option>
            </select>
          </div>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onFormChange}
            required
            placeholder={t.consult.phone}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onFormChange}
            required
            placeholder={t.consult.email}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border"
              disabled={submitting}
            >
              {t.consult.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
              disabled={submitting}
            >
              {submitting ? "…" : t.consult.submit}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
