/** Brief - the input contract for copy generation */
export interface Brief {
  type: string;           // e.g., 'cold outreach email', 'landing page hero'
  goal: string;           // e.g., 'Book a demo call'
  audience?: {
    who: string;          // Required for generation but optional here (briefing fills it)
    pain?: string;
    sophistication?: 'casual' | 'familiar' | 'expert';
  };
  product?: {
    name?: string;
    description?: string;
    differentiator?: string;
  };
  brand_voice?: {
    tone?: string;
    avoids?: string[];
    examples?: string[];
  };
  constraints?: {
    length?: string;
    format?: string;
    cta?: string;
    language?: string;
  };
}

/** Quality scores returned by evaluation */
export interface QualityScores {
  clarity: number;
  specificity: number;
  voice_match: number;
  ai_tell_score: number;  // 0-10, lower is better
  persuasion: number;
  action: number;
  overall: number;
}

/** Anti-slop detection result */
export interface AntiSlopIssue {
  pattern: string;
  line: number;
  suggestion?: string;
}

export interface AntiSlopResult {
  score: number;          // 0-10, capped
  issues: AntiSlopIssue[];
}

/** Framework selection result */
export interface FrameworkSelection {
  framework: string;      // e.g., 'PAS'
  path: string;           // e.g., 'persuasion-frameworks/references/pas.md'
  rationale: string;
}

/** Copy output - the output contract */
export interface CopyOutput {
  copy: {
    primary: string;
    variants?: string[];
  };
  metadata: {
    framework_used: string;
    domain: string;
    quality_scores: QualityScores;
    flags: string[];
  };
}

/** Assembled prompt pair ready for LLM */
export interface AssembledPrompt {
  systemPrompt: string;
  userPrompt: string;
}

/** Skill metadata from YAML frontmatter */
export interface SkillMetadata {
  name: string;
  description: string;
}

/** Full skill content (parsed frontmatter + body) */
export interface SkillContent {
  metadata: SkillMetadata;
  body: string;
}
