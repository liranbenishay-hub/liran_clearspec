export interface OpenQuestion {
  question: string;
  owner: string;
}

export interface ToolState {
  productTitle: string;          // New: product / feature name for PRD header
  problemStatement: string;
  operationalPain: string;
  currentWorkaround: string;
  successMetric: string;
  buildNow: string;
  deferToPhase2: string;
  chosenApproachGivesUp: string;
  rejectedApproach: string;
  rejectedApproachGivesUp: string;
  openQuestions: OpenQuestion[];
}

export const EMPTY_TOOL_STATE: ToolState = {
  productTitle: "",
  problemStatement: "",
  operationalPain: "",
  currentWorkaround: "",
  successMetric: "",
  buildNow: "",
  deferToPhase2: "",
  chosenApproachGivesUp: "",
  rejectedApproach: "",
  rejectedApproachGivesUp: "",
  openQuestions: [{ question: "", owner: "" }],
};

export type StepId =
  | "title"
  | "problem"
  | "pain"
  | "workaround"
  | "metric"
  | "scope"
  | "tradeoff"
  | "questions"
  | "output";

export interface Step {
  id: StepId;
  number: number;
  heading: string;
  subtext: string;
  placeholder?: string;
  hint?: string;
}
