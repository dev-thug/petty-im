/** A row in the at-a-glance table. Both columns must be verifiable. */
export type ComparisonRow = {
  label: string;
  competitor: string;
  petty: string;
};

export type ComparisonSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type ComparisonFaq = {
  question: string;
  answer: string;
};

export type ComparisonSource = {
  label: string;
  url: string;
};

/**
 * One competitor comparison. Claims about the other product come from the
 * sources listed at the bottom of the page; claims about Petty come from what
 * the product actually does. Nothing here is invented to win the comparison —
 * readers are evaluating both and will check.
 */
export type Comparison = {
  slug: string;
  competitorName: string;
  competitorOperator: string;
  /** Extra phrasings people search for, used in copy rather than meta keywords. */
  aliases: readonly string[];
  title: string;
  description: string;
  heading: string;
  summary: readonly string[];
  whySwitch: ComparisonSection;
  tableCaption: string;
  rows: readonly ComparisonRow[];
  sections: readonly ComparisonSection[];
  stayWithCompetitor: readonly string[];
  choosePetty: readonly string[];
  faqs: readonly ComparisonFaq[];
  sources: readonly ComparisonSource[];
};
