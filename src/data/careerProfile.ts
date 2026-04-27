export type Milestone = {
  role: string;
  company: string;
  period: string;
  location: string;
  impact: string;
};

export type Education = {
  school: string;
  detail: string;
};

export const milestones: Milestone[] = [
  {
    role: "Owner & Operations",
    company: "Crow & Lilac",
    period: "January 2020 - Present",
    location: "San Diego, CA",
    impact:
      "Founded and ran an independent retail and wholesale botanicals business end-to-end: P&L, forecasting, vendor negotiation, legal and tax filings. Built SOPs for order processing, inventory, and customer communication across in-store, online, and wholesale channels. Handled customer interactions from inquiry through fulfillment and follow-up. Managed payments, invoicing, and reconciliation (Square POS and integrated tools) with clean records for tax filings. Ran marketing and acquisition with a consistent, personal brand experience.",
  },
  {
    role: "Founder & Owner",
    company: "JClarke Claims",
    period: "January 2014 - December 2016",
    location: "San Diego, CA",
    impact:
      "Independent medical billing practice for up to eight wellness providers (acupuncturists and chiropractors) across California. Full revenue cycle: verification, benefits interpretation, claims submission, AR follow-up, denial appeals. Submitted and tracked claims via carrier portals (Blue Shield, Medicare, Medi-Cal, private carriers). Reduced denials and sped reimbursement by aligning chart documentation with billing codes and following claims through to payment. Grew by word-of-mouth referrals. HIPAA-compliant records and communications.",
  },
  {
    role: "Office Manager & Billing Coordinator",
    company: "Thive Wellness",
    period: "January 2013 - December 2015",
    location: "San Diego, CA",
    impact:
      "Front desk, scheduling, and patient intake for a multi-practitioner wellness clinic. Insurance verifications, claim submissions, payment posting, account reconciliation, and discrepancy resolution. HIPAA-compliant records; primary liaison between patients, providers, and insurers. Streamlined office systems and documentation for accuracy and efficiency.",
  },
  {
    role: "Office Manager",
    company: "AcuSport Health Center",
    period: "June 2011 - June 2013",
    location: "San Diego, CA",
    impact:
      "Front desk operations, patient flow, and scheduling. Organized digital and physical records with patient privacy compliance. Supported insurance verification and basic billing with providers.",
  },
  {
    role: "Field Canvasser",
    company: "Greenpeace",
    period: "January 2010 - October 2010",
    location: "San Diego, CA",
    impact:
      "Public education and grassroots fundraising for a national environmental nonprofit during relocation to San Diego. Direct community engagement, rapport-building, and resilient communication with diverse audiences.",
  },
  {
    role: "Educational Aide",
    company: "St. Timothy's School",
    period: "January 2008 - December 2009",
    location: "Cohoes, NY",
    impact:
      "One-on-one aide for a 13-year-old student on the autism spectrum in a self-contained classroom. Led the classroom after the lead teacher's mid-year departure until a credentialed replacement: daily curriculum, structure, continuity of learning. Partnered with parents, therapists, and administrators on lesson plans and progress communication.",
  },
  {
    role: "Teacher's Assistant - Early Intervention",
    company: "Institute for Child Development",
    period: "January 2007 - January 2008",
    location: "Binghamton, NY",
    impact:
      "One-on-one and small-group instruction for children ages 2-5 on the autism spectrum within a multidisciplinary early-intervention team using ABA techniques. Logged behavioral and developmental data for clinicians. Applied Psychology training with structured communication for students, families, and staff.",
  },
];

export const careerSummary = [
  "Jessica Clarke Dennis is an operations and administration professional with 15+ years of combined experience across healthcare offices, medical billing, and small business ownership.",
  "Most recently she built and ran Crow & Lilac, a botanicals business handling inventory, fulfillment, bookkeeping, vendor relationships, and customer care.",
  "Prior years in wellness clinics as office manager and billing coordinator included verifying insurance, submitting claims, managing HIPAA-compliant patient records, and keeping the front desk smooth.",
  "She also ran a freelance medical billing practice supporting multiple acupuncturists and chiropractors.",
  "She excels at making complicated processes calm and organized and being the reliable link between customers, vendors, and internal teams (SOPs, email, closed loops).",
  "Seeking next roles in operations, office management, medical billing, customer success, or anywhere administrative excellence and problem-solving matter.",
  "Open to remote, hybrid, and San Diego-area opportunities.",
].join(" ");

// Concise list used in the Digital Twin knowledge base.
export const topSkills = [
  "Office & operations management",
  "Scheduling, intake, and front-desk coordination",
  "SOPs, documentation standards, and workflow improvement",
  "Medical billing and revenue-cycle administration",
  "HIPAA-minded records and stakeholder liaison work",
  "Inventory, vendor relations, and small-business back office",
  "Clear customer and internal communication (closed-loop follow-through)",
];

// Longer visitor-facing strengths used by the homepage.
export const officeStrengths = [
  "Office management: scheduling, intake, front-desk flow, and day-to-day clinic or business operations",
  "Process ownership: SOPs, documentation standards, and workflows that keep teams aligned and errors low",
  "Revenue-cycle administration: eligibility, claims, payment posting, AR follow-up, and clean handoffs to providers",
  "HIPAA-minded records, organized filing, and careful communication between patients, vendors, and internal teams",
  "Small-business operations: inventory and fulfillment, vendor coordination, invoicing, and bookkeeping discipline",
];

export const education: Education[] = [
  {
    school: "Binghamton University",
    detail: "Bachelor of Science (BS), Psychology — September 2005 - June 2007",
  },
  {
    school: "Hudson Valley Community College",
    detail:
      "Associate's Degree, Liberal Arts and Sciences/Liberal Studies — August 2003 - June 2005",
  },
];

export const contact = {
  email: "jmclarke826@gmail.com",
  linkedInUrl: "https://www.linkedin.com/in/jessica-clarke-dennis-762a5321a",
};

export function buildDigitalTwinKnowledgeBase(): string {
  const experience = milestones
    .filter((m) => m.role && m.company && m.period && m.impact)
    .map(
      (m) =>
        `- ${m.role} at ${m.company} (${m.period}, ${m.location}): ${m.impact}`,
    )
    .join("\n");

  const edu = education
    .map((e) => `- ${e.school}: ${e.detail}`)
    .join("\n");

  const skills = topSkills.map((s) => `- ${s}`).join("\n");
  const strengths = officeStrengths.map((s) => `- ${s}`).join("\n");

  return `
Name: Jessica Clarke Dennis
Location focus: United States; San Diego area; open to remote/hybrid.

Summary:
${careerSummary}

Top skills:
${skills}

Office management and operations strengths:
${strengths}

Experience:
${experience}

Education:
${edu}

Contact (public on profile):
- Email: ${contact.email}
- LinkedIn: ${contact.linkedInUrl}
`.trim();
}
