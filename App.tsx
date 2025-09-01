import React, { useMemo, useState } from "react";

// Saathi – Bereavement Help (India)
// Single-file React component, TailwindCSS only (no external UI libs)
// Features: Hindi/English toggle, Haryana resources, print/copy link, checklist search

const CONTENT = {
  en: {
    brand: "Saathi",
    tagline: "Help after a loss",
    heroTitle: "What to do after a death in the family (India)",
    heroDesc:
      "A simple, step-by-step checklist with trusted resources. No legal jargon. No sign-up. Free.",
    searchPlaceholder: "Search steps e.g. EPF, nominee, property",
    quickFacts: [
      "Keep 10–15 copies of the death certificate.",
      "Nominee receives funds first; final rights follow succession law.",
      "DLSA provides free legal aid in every district.",
      "Avoid middlemen; use official claim forms only.",
    ],
    checklistTitle: "Step-by-step Checklist",
    resourcesTitle: "Resources & Helplines (Haryana)",
    faqTitle: "Frequently Asked Questions",
    contactTitle: "Need help? (No-cost, no spam)",
    contactLine:
      "This is an information-only MVP. We don’t store sensitive documents. If you need help finding the right resource, fill this tiny form and we’ll point you in the right direction.",
    openForm: "Open Quick Form",
    orEmail: "Or email us",
    disclaimer:
      "By contacting us you agree that this site provides general information, not legal or financial advice. For legal issues, contact DLSA or a licensed advocate.",
    copyLink: "Copy link",
    copied: "Link copied",
    print: "Print checklist",
    nav: {
      checklist: "Checklist",
      resources: "Resources",
      faq: "FAQ",
      contact: "Contact",
    },
  },
  hi: {
    brand: "साथी",
    tagline: "शोक के बाद सहायता",
    heroTitle: "परिवार में मृत्यु के बाद क्या करें (भारत)",
    heroDesc:
      "सरल चरण-दर-चरण सूची और भरोसेमंद संसाधन। बिना कानूनी जटिल भाषा, बिना साइन-अप, निःशुल्क।",
    searchPlaceholder: "खोजें: EPF, नामित व्यक्ति, संपत्ति",
    quickFacts: [
      "मृत्यु प्रमाणपत्र की 10–15 प्रतियाँ रखें।",
      "नामित व्यक्ति को राशि मिलती है; अंतिम अधिकार उत्तराधिकार कानून से तय होते हैं।",
      "हर ज़िले में DLSA द्वारा निःशुल्क विधिक सहायता उपलब्ध है।",
      "बिचौलियों से बचें; केवल आधिकारिक फॉर्म का उपयोग करें।",
    ],
    checklistTitle: "चरण-दर-चरण चेकलिस्ट",
    resourcesTitle: "संसाधन व हेल्पलाइन (हरियाणा)",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    contactTitle: "मदद चाहिए? (फ्री, बिना स्पैम)",
    contactLine:
      "यह केवल जानकारी हेतु एमवीपी है। हम संवेदनशील दस्तावेज़ नहीं मांगते। सही संसाधन ढूँढने में मदद चाहिए तो यह छोटा फॉर्म भरें।",
    openForm: "फ़ॉर्म खोलें",
    orEmail: "या हमें ईमेल करें",
    disclaimer:
      "संपर्क करने पर आप सहमत हैं कि यह साइट सामान्य जानकारी देती है, कानूनी/वित्तीय सलाह नहीं। कानूनी मामलों हेतु DLSA/वकील से संपर्क करें।",
    copyLink: "लिंक कॉपी करें",
    copied: "लिंक कॉपी हो गया",
    print: "चेकलिस्ट प्रिंट करें",
    nav: {
      checklist: "चेकलिस्ट",
      resources: "संसाधन",
      faq: "प्रश्न",
      contact: "संपर्क",
    },
  },
};

const STEPS = [
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

const HARYANA_RESOURCES = [
  {
    name: "Antyodaya Saral Haryana",
    desc: "Single-window portal for state services (certificates, pensions, etc.)",
    link: "https://saralharyana.gov.in/",
  },
  {
    name: "Social Justice & Empowerment Dept (Haryana)",
    desc: "Widow/destitute pensions and social welfare schemes",
    link: "https://socialjusticehry.gov.in/",
  },
  {
    name: "Women & Child Development (Haryana)",
    desc: "Support schemes for women and children",
    link: "https://wcdhry.gov.in/",
  },
  {
    name: "Haryana State Legal Services Authority (HSLSA)",
    desc: "Free legal aid via DLSA in every district",
    link: "https://hslsa.gov.in/",
  },
  {
    name: "EPFO – Death Claims (All-India)",
    desc: "How to file EPF/EDLI/Gratuity death claims",
    link: "https://www.epfindia.gov.in/",
  },
];

function Section({ title, children, id }) {
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

function StepCard({ idx, title, points }) {
  const [open, setOpen] = useState(idx < 3);
  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start justify-between gap-4"
        aria-expanded={open}
      >
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Step {idx}
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

function ResourceCard({ name, desc, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="block bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
    >
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
      <div className="mt-3 text-sm underline">Visit</div>
    </a>
  );
}

export default function SaathiApp() {
  const [lang, setLang] = useState("en");
  const t = CONTENT[lang];
  const [query, setQuery] = useState("");

  const filteredSteps = useMemo(() => {
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
            <a href="#contact" className="hover:underline">
              {t.nav.contact}
            </a>
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
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 uppercase">
                Quick facts
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
                Start checklist
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
            />
          ))}
        </div>
      </Section>

      {/* Resources – Haryana */}
      <Section title={t.resourcesTitle} id="resources">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HARYANA_RESOURCES.map((r, i) => (
            <ResourceCard key={i} {...r} />
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title={t.faqTitle} id="faq">
        <div className="divide-y rounded-2xl border border-gray-200 bg-white">
          {[
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
          ].map((it, i) => (
            <div key={i} className="p-5">
              <div className="font-semibold">{it.q}</div>
              <p className="mt-2 text-gray-700">{it.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section title={t.contactTitle} id="contact">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-gray-700">{t.contactLine}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href="https://forms.gle/YOUR_FORM_ID"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm"
            >
              {t.openForm}
            </a>
            <a
              href="mailto:help@saathi.example?subject=Saathi%20Help%20Request&body=Briefly%20describe%20your%20situation%20and%20city%3A%20"
              className="text-sm underline"
            >
              {t.orEmail}
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-4">{t.disclaimer}</p>
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
                Privacy
              </a>
              <a href="#" className="hover:underline">
                Disclaimer
              </a>
              <a href="#" className="hover:underline">
                Feedback
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
