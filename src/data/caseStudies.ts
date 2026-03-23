import type { Study } from "../components/CaseStudyCard";

const base = import.meta.env.BASE_URL;

export const CASE_STUDIES: Study[] = [
  {
    company: "DigitalOcean | Cloud Computing & Hosting",
    title: "RBAC - Predefined Roles",
    description:
      "Adding 3 new roles to simplify users' more granular access needs with more restrictive RBAC solutions.",
    tags: ["IAM", "Access control"],
    metrics: [
      { value: "Simplified", label: "access management" },
      { value: "Granular", label: "role options" },
    ],
    link: "/case-studies/predefined-roles",
    images: [`${base}invite-team-members.png`, `${base}rbac-role-modal.png`],
    imageAlts: [
      "Invite team members screen showing member list and roles",
      "Change role modal for assigning a predefined RBAC role",
    ],
    sideOverlapSecondLeftExtraPx: 32,
  },
  {
    company: "DigitalOcean | Cloud Computing & Hosting",
    title: "DDoS Protection",
    description:
      'Building an e2e simple "set it and forget it" experience for DigitalOcean users against DDoS Attacks so users are protected and informed about their networks.',
    tags: ["Security", "Networking"],
    metrics: [
      { value: "Protected", label: "networks" },
      { value: "Informed", label: "users" },
    ],
    link: "https://ajzichella.com/",
    images: [`${base}ddos1.png`],
    imageAlts: [
      "DDoS Protection networking dashboard with Back Online notification card showing shrimp illustration and recovery message",
    ],
  },
  {
    company: "DigitalOcean | Cloud Computing & Hosting",
    title: "DBaaS - Kafka",
    description:
      "Integrating a Kafka solution into our Managed Databases product to simplify users' architecture and Topic upkeep as well as provide a reliable environment to prevent data loss.",
    tags: ["Managed databases", "DevOps"],
    metrics: [
      { value: "Simplified", label: "Topic upkeep" },
      { value: "Reliable", label: "data environment" },
    ],
    link: "https://ajzichella.com/",
    images: [`${base}kafka-permissions.png`, `${base}kafka-create-topic.png`],
    imageAlts: [
      "Kafka topic permissions modal with Admin, Produce, Consume, and Consume and Produce roles",
      "Create Topic form with partition count, replication factor, and retention settings",
    ],
  },
  {
    company: "STORIS | Retail ERP & eCommerce",
    title: "eCommerce Enhanced Checkout Redesign",
    description:
      "Redesigned a broken multi-step checkout that hurt retailers and shoppers with a faster flow that solved conversion issues and lifted revenue.",
    tags: ["eCommerce", "B2B and B2C", "Billing"],
    metrics: [
      { value: "Streamlined", label: "checkout experience" },
      { value: "Increased", label: "conversions and revenue" },
    ],
    link: "https://ajzichella.com/",
    images: [`${base}estoris2.png`, `${base}checkout_mobile.png`],
    imageAlts: [
      "STORIS admin Checkout Settings with delivery options and store pickup",
      "STORIS mobile secure checkout — shipping information step",
    ],
    twoImageLayout: "hero-phone",
  },
];

/** Titles of studies shown on the Home teaser (order preserved). */
export const FEATURED_CASE_STUDY_TITLES: readonly string[] = [
  "RBAC - Predefined Roles",
  "DDoS Protection",
];

export function getFeaturedCaseStudies(): Study[] {
  return FEATURED_CASE_STUDY_TITLES.map((title) => {
    const study = CASE_STUDIES.find((s) => s.title === title);
    if (!study) {
      throw new Error(`Featured case study not found: ${title}`);
    }
    return study;
  });
}

export function getAllTags(): string[] {
  return [...new Set(CASE_STUDIES.flatMap((s) => s.tags))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}
