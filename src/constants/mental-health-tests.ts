// Mental Health Test Constants

export type TestQuestion = {
  id: number;
  question: string;
};

export type ResponseOption = {
  value: number;
  label: string;
};

export type TestType = "PHQ9" | "GAD7";

export type SeverityLevel = {
  level: string;
  description: string;
  suggestions: string[];
  color: string;
};

// PHQ-9: Patient Health Questionnaire for Depression
export const PHQ9_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    question: "Little interest or pleasure in doing things",
  },
  {
    id: 2,
    question: "Feeling down, depressed, or hopeless",
  },
  {
    id: 3,
    question: "Trouble falling or staying asleep, or sleeping too much",
  },
  {
    id: 4,
    question: "Feeling tired or having little energy",
  },
  {
    id: 5,
    question: "Poor appetite or overeating",
  },
  {
    id: 6,
    question: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
  },
  {
    id: 7,
    question: "Trouble concentrating on things, such as reading the newspaper or watching television",
  },
  {
    id: 8,
    question: "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  },
  {
    id: 9,
    question: "Thoughts that you would be better off dead, or of hurting yourself",
  },
];

// GAD-7: Generalized Anxiety Disorder Questionnaire
export const GAD7_QUESTIONS: TestQuestion[] = [
  {
    id: 1,
    question: "Feeling nervous, anxious, or on edge",
  },
  {
    id: 2,
    question: "Not being able to stop or control worrying",
  },
  {
    id: 3,
    question: "Worrying too much about different things",
  },
  {
    id: 4,
    question: "Trouble relaxing",
  },
  {
    id: 5,
    question: "Being so restless that it is hard to sit still",
  },
  {
    id: 6,
    question: "Becoming easily annoyed or irritable",
  },
  {
    id: 7,
    question: "Feeling afraid, as if something awful might happen",
  },
];

export const RESPONSE_OPTIONS: ResponseOption[] = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

// PHQ-9 Severity Levels
export function getPHQ9Severity(score: number): SeverityLevel {
  if (score >= 0 && score <= 4) {
    return {
      level: "Minimal Depression",
      description: "Your score suggests minimal or no depression symptoms.",
      suggestions: [
        "Continue maintaining your current mental health practices",
        "Keep engaging in activities you enjoy",
        "Maintain social connections and healthy routines",
        "Practice self-care and stress management techniques",
      ],
      color: "text-green-600",
    };
  } else if (score >= 5 && score <= 9) {
    return {
      level: "Mild Depression",
      description: "Your score suggests mild depression symptoms.",
      suggestions: [
        "Consider lifestyle changes: regular exercise, healthy diet, adequate sleep",
        "Practice stress reduction techniques like meditation or mindfulness",
        "Stay connected with friends and family",
        "Monitor your symptoms; if they worsen, consider professional support",
        "Engage in activities that bring you joy and fulfillment",
      ],
      color: "text-yellow-600",
    };
  } else if (score >= 10 && score <= 14) {
    return {
      level: "Moderate Depression",
      description: "Your score suggests moderate depression symptoms.",
      suggestions: [
        "Consider consulting with a mental health professional",
        "Cognitive Behavioral Therapy (CBT) has shown effectiveness for moderate depression",
        "Maintain regular physical activity and healthy sleep patterns",
        "Reach out to trusted friends or family members for support",
        "Consider joining a support group",
        "Track your mood and symptoms to identify patterns",
      ],
      color: "text-orange-600",
    };
  } else if (score >= 15 && score <= 19) {
    return {
      level: "Moderately Severe Depression",
      description: "Your score suggests moderately severe depression symptoms.",
      suggestions: [
        "It is recommended to consult with a mental health professional promptly",
        "Consider both psychotherapy and medication options with a healthcare provider",
        "Seek support from friends, family, or support groups",
        "Avoid isolation - maintain social connections even when difficult",
        "Follow up regularly with your healthcare provider to monitor progress",
        "In crisis, contact a crisis helpline or emergency services",
      ],
      color: "text-red-600",
    };
  } else {
    return {
      level: "Severe Depression",
      description: "Your score suggests severe depression symptoms.",
      suggestions: [
        "Immediate consultation with a mental health professional is strongly recommended",
        "Contact your healthcare provider as soon as possible",
        "Consider comprehensive treatment including therapy and medication",
        "Inform trusted friends or family members who can provide support",
        "If you're having thoughts of self-harm, contact emergency services immediately",
        "Crisis resources: National Suicide Prevention Lifeline: 988 (US)",
        "You are not alone - effective treatments are available",
      ],
      color: "text-red-800",
    };
  }
}

// GAD-7 Severity Levels
export function getGAD7Severity(score: number): SeverityLevel {
  if (score >= 0 && score <= 4) {
    return {
      level: "Minimal Anxiety",
      description: "Your score suggests minimal or no anxiety symptoms.",
      suggestions: [
        "Continue your current stress management practices",
        "Maintain healthy lifestyle habits including regular exercise",
        "Keep practicing relaxation techniques when needed",
        "Stay connected with supportive friends and family",
      ],
      color: "text-green-600",
    };
  } else if (score >= 5 && score <= 9) {
    return {
      level: "Mild Anxiety",
      description: "Your score suggests mild anxiety symptoms.",
      suggestions: [
        "Practice relaxation techniques: deep breathing, progressive muscle relaxation",
        "Regular physical exercise can help reduce anxiety",
        "Consider mindfulness meditation or yoga",
        "Limit caffeine and alcohol intake",
        "Maintain consistent sleep schedule",
        "Monitor symptoms and seek help if they worsen",
      ],
      color: "text-yellow-600",
    };
  } else if (score >= 10 && score <= 14) {
    return {
      level: "Moderate Anxiety",
      description: "Your score suggests moderate anxiety symptoms.",
      suggestions: [
        "Consider consulting with a mental health professional",
        "Cognitive Behavioral Therapy (CBT) is highly effective for anxiety",
        "Practice daily relaxation and mindfulness exercises",
        "Identify and address sources of stress in your life",
        "Consider joining an anxiety support group",
        "Maintain regular exercise and healthy sleep patterns",
      ],
      color: "text-orange-600",
    };
  } else {
    return {
      level: "Severe Anxiety",
      description: "Your score suggests severe anxiety symptoms.",
      suggestions: [
        "It is strongly recommended to consult with a mental health professional",
        "Contact your healthcare provider to discuss treatment options",
        "Treatment may include therapy, medication, or a combination",
        "Practice grounding techniques when experiencing acute anxiety",
        "Inform trusted friends or family who can provide support",
        "For panic attacks or severe symptoms, don't hesitate to seek immediate help",
        "Remember: anxiety is treatable and you can feel better",
      ],
      color: "text-red-600",
    };
  }
}

// Test Metadata
export const TEST_METADATA = {
  PHQ9: {
    name: "PHQ-9",
    fullName: "Patient Health Questionnaire-9",
    description: "Depression Screening Test",
    instructions: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
    maxScore: 27,
    scoreRanges: [
      { range: "0-4", level: "Minimal depression" },
      { range: "5-9", level: "Mild depression" },
      { range: "10-14", level: "Moderate depression" },
      { range: "15-19", level: "Moderately severe depression" },
      { range: "20-27", level: "Severe depression" },
    ],
    about: "The PHQ-9 is a validated, widely-used screening tool for depression. It was developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke, and colleagues.",
    questions: PHQ9_QUESTIONS,
    getSeverity: getPHQ9Severity,
  },
  GAD7: {
    name: "GAD-7",
    fullName: "Generalized Anxiety Disorder-7",
    description: "Anxiety Screening Test",
    instructions: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    maxScore: 21,
    scoreRanges: [
      { range: "0-4", level: "Minimal anxiety" },
      { range: "5-9", level: "Mild anxiety" },
      { range: "10-14", level: "Moderate anxiety" },
      { range: "15-21", level: "Severe anxiety" },
    ],
    about: "The GAD-7 is a validated screening tool for generalized anxiety disorder. It was developed by Drs. Robert L. Spitzer, Kurt Kroenke, Janet B.W. Williams, and Bernd Löwe.",
    questions: GAD7_QUESTIONS,
    getSeverity: getGAD7Severity,
  },
};

