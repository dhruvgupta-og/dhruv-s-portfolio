export interface ProjectItem {
  id: string;
  dispatchNo: string;
  title: string;
  subtitle: string;
  category: string;
  status: string;
  liveUrl?: string;
  githubUrl?: string;
  metrics: string[];
  techTags: string[];
  bulletPoints: {
    heading: string;
    description: string;
  }[];
  specSnippet?: string;
  architectureDiagram?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'languages' | 'frontend' | 'backend' | 'databases' | 'tools' | 'core_cs';
  specialty: string;
  noticeNo: string;
  level: string;
}

export interface CandidateInfo {
  name: string;
  role: string;
  edition: string;
  badge: string;
  ticketSerial: string;
  institution: string;
  degree: string;
  major: string;
  period: string;
  headline: string;
  leadParagraph: string;
  secondaryParagraph: string;
  quote: string;
  email: string;
  github: string;
  githubUser: string;
  leetcode: string;
  leetcodeUser: string;
  linkedin: string;
  linkedinUser: string;
  availability: string;
  location: string;
}

export interface ModalContent {
  type: 'project' | 'ticket' | 'stamp' | 'education' | 'wire' | 'skill';
  title: string;
  subtitle?: string;
  stampText?: string;
  data: ProjectItem | SkillItem | CandidateInfo | Record<string, unknown>;
}
