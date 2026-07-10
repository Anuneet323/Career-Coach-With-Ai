import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getGeminiModel = (modelName = "gemini-3.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Helper to call Gemini model with exponential backoff on 429 Rate Limit/Quota errors.
 */
export async function generateContentWithRetry(
  model,
  prompt,
  maxRetries = 3,
  initialDelay = 1500,
) {
  let delay = initialDelay;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error) {
      const errorMsg = error.message || "";
      const isRateLimit =
        error.status === 429 ||
        errorMsg.includes("429") ||
        errorMsg.includes("quota") ||
        errorMsg.includes("Quota") ||
        errorMsg.includes("limit");

      if (attempt === maxRetries || !isRateLimit) {
        throw error;
      }
      console.warn(
        `[Gemini API] 429 Rate Limit/Quota exceeded. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2.5; // Exponential backoff with slightly higher multiplier to clear time-based limits
    }
  }
}

// Fallback technical questions by industry if Gemini is fully rate-limited or fails
export const FALLBACK_QUIZZES = {
  tech: [
    {
      question:
        "Which of the following data structures operates on a Last-In, First-Out (LIFO) basis?",
      options: ["Queue", "Stack", "Binary Tree", "Hash Table"],
      correctAnswer: "Stack",
      explanation:
        "A stack is a linear data structure that follows the LIFO (Last-In, First-Out) principle, where the last element added is the first one to be removed.",
    },
    {
      question: "What does the 'S' in SOLID design principles stand for?",
      options: [
        "Single Responsibility Principle",
        "State Segregation Principle",
        "Static Analysis Principle",
        "System Optimization Principle",
      ],
      correctAnswer: "Single Responsibility Principle",
      explanation:
        "The Single Responsibility Principle (SRP) states that a class should have only one reason to change, meaning it should have only one job or responsibility.",
    },
    {
      question:
        "Which HTTP status code represents a successful resource creation?",
      options: ["200 OK", "201 Created", "204 No Content", "400 Bad Request"],
      correctAnswer: "201 Created",
      explanation:
        "HTTP 201 Created indicates that the request has been fulfilled and has resulted in one or more new resources being created.",
    },
    {
      question:
        "What is the primary purpose of an index in a relational database?",
      options: [
        "To encrypt sensitive data",
        "To speed up data retrieval operations",
        "To automatically back up the database",
        "To enforce referential integrity constraints",
      ],
      correctAnswer: "To speed up data retrieval operations",
      explanation:
        "An index is a database structure that improves the speed of data retrieval operations on a table at the cost of additional writes and storage space.",
    },
    {
      question:
        "Which of the following is NOT a fundamental concept of Object-Oriented Programming (OOP)?",
      options: ["Inheritance", "Polymorphism", "Compilation", "Encapsulation"],
      correctAnswer: "Compilation",
      explanation:
        "The four pillars of OOP are Inheritance, Polymorphism, Encapsulation, and Abstraction. Compilation is a build-time process, not an OOP concept.",
    },
    {
      question:
        "What is the main benefit of using a CDN (Content Delivery Network)?",
      options: [
        "To perform heavy database queries",
        "To compile server-side code",
        "To deliver static assets from servers closer to users for lower latency",
        "To handle user authentication",
      ],
      correctAnswer:
        "To deliver static assets from servers closer to users for lower latency",
      explanation:
        "CDNs cache static assets (like images, JS, CSS) on edge servers geographically closer to users, minimizing page load times and network latency.",
    },
    {
      question:
        "In git, what command is used to combine multiple commits into a single commit before pushing?",
      options: [
        "git merge",
        "git commit --amend",
        "git rebase -i (Interactive Rebase)",
        "git push --force",
      ],
      correctAnswer: "git rebase -i (Interactive Rebase)",
      explanation:
        "An interactive rebase ('git rebase -i') allows you to modify commit history, including 'squashing' (combining) multiple commits into one.",
    },
    {
      question: "What does the 'Big O' notation measure in computer science?",
      options: [
        "The storage space on disk",
        "The time or space complexity of an algorithm relative to the input size",
        "The execution speed in milliseconds",
        "The size of compiled binaries",
      ],
      correctAnswer:
        "The time or space complexity of an algorithm relative to the input size",
      explanation:
        "Big O notation describes the upper bound of the execution time or space requirement of an algorithm in terms of the size of the input (n).",
    },
    {
      question:
        "Which of the following is a primary difference between SQL and NoSQL databases?",
      options: [
        "SQL databases are always faster than NoSQL",
        "SQL databases are generally table-based/relational, while NoSQL databases can be document, key-value, or graph-based",
        "NoSQL databases do not support transactions",
        "SQL databases cannot be run in the cloud",
      ],
      correctAnswer:
        "SQL databases are generally table-based/relational, while NoSQL databases can be document, key-value, or graph-based",
      explanation:
        "SQL databases are relational and schema-driven. NoSQL databases are non-relational, offer dynamic schemas, and scale horizontally more easily.",
    },
    {
      question: "What is the purpose of Docker in software deployment?",
      options: [
        "To write code in multiple languages",
        "To bundle an application and its dependencies into a standardized container",
        "To automatically write unit tests",
        "To manage project tasks and backlogs",
      ],
      correctAnswer:
        "To bundle an application and its dependencies into a standardized container",
      explanation:
        "Docker containerizes applications to ensure they run consistently across different computing environments (local, staging, production).",
    },
  ],
  finance: [
    {
      question: "What is the primary goal of financial management?",
      options: [
        "To maximize sales",
        "To minimize taxes",
        "To maximize shareholder value",
        "To minimize risk completely",
      ],
      correctAnswer: "To maximize shareholder value",
      explanation:
        "The primary operational goal of financial management is to maximize shareholder wealth, typically reflected in the market value of the company's common stock.",
    },
    {
      question:
        "Which financial statement provides a snapshot of a company's assets, liabilities, and equity at a specific point in time?",
      options: [
        "Income Statement",
        "Balance Sheet",
        "Cash Flow Statement",
        "Statement of Retained Earnings",
      ],
      correctAnswer: "Balance Sheet",
      explanation:
        "The Balance Sheet displays a company's financial position at a single point in time, showing what it owns (assets), what it owes (liabilities), and the remaining equity.",
    },
    {
      question:
        "What does a high Price-to-Earnings (P/E) ratio typically suggest about a stock?",
      options: [
        "The company is close to bankruptcy",
        "Investors expect high future growth and are willing to pay more per dollar of current earnings",
        "The stock is severely undervalued",
        "The company pays very high dividends",
      ],
      correctAnswer:
        "Investors expect high future growth and are willing to pay more per dollar of current earnings",
      explanation:
        "A high P/E ratio implies that investors are projecting higher growth in the future and are paying a premium for current earnings.",
    },
    {
      question: "What is the formula for calculating Net Working Capital?",
      options: [
        "Total Assets - Total Liabilities",
        "Current Assets - Current Liabilities",
        "Gross Revenue - Operating Expenses",
        "Cash + Accounts Receivable",
      ],
      correctAnswer: "Current Assets - Current Liabilities",
      explanation:
        "Net Working Capital is calculated as Current Assets minus Current Liabilities, measuring a firm's short-term liquidity and operational efficiency.",
    },
    {
      question:
        "What does 'diversification' achieve in an investment portfolio?",
      options: [
        "Guarantees a positive return",
        "Reduces unsystematic (specific) risk by spreading investments across various assets",
        "Eliminates market (systematic) risk entirely",
        "Increases transaction costs without any benefits",
      ],
      correctAnswer:
        "Reduces unsystematic (specific) risk by spreading investments across various assets",
      explanation:
        "Diversification reduces risk by allocating capital across different industries, asset classes, or regions, minimizing the impact of any single asset's poor performance.",
    },
    {
      question:
        "What is the primary difference between debt and equity financing?",
      options: [
        "Debt financing dilutes ownership, while equity does not",
        "Equity financing involves borrowing funds that must be paid back with interest",
        "Debt financing involves borrowing money that must be repaid, while equity involves selling ownership shares",
        "Debt financing is only available to startups",
      ],
      correctAnswer:
        "Debt financing involves borrowing money that must be repaid, while equity involves selling ownership shares",
      explanation:
        "Debt is borrowed money that requires regular interest payments and principal repayment. Equity is raising capital by selling shares of ownership, which doesn't require repayment but dilutes control.",
    },
    {
      question: "What is a 'bond yield'?",
      options: [
        "The initial principal of the bond",
        "The maturity date of the bond",
        "The return an investor realizes on a bond, usually expressed as an annual percentage",
        "The total debt a government owes",
      ],
      correctAnswer:
        "The return an investor realizes on a bond, usually expressed as an annual percentage",
      explanation:
        "Bond yield is the annual rate of return earned by a bondholder, calculated based on the bond's coupon payments and its purchase price.",
    },
    {
      question: "What does EBITDA stand for?",
      options: [
        "Earnings Before Income, Taxes, Depreciation, and Amortization",
        "Earnings Before Interest, Taxes, Depreciation, and Amortization",
        "Equity Balance Interest Taxes Debt Assets",
        "Estimated Budget Including Taxes Depreciation Accounts",
      ],
      correctAnswer:
        "Earnings Before Interest, Taxes, Depreciation, and Amortization",
      explanation:
        "EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It is widely used to evaluate a company's core operating profitability.",
    },
    {
      question:
        "Which metric is commonly used to measure the volatility or systematic risk of a stock relative to the overall market?",
      options: ["Alpha", "Beta", "Standard Deviation", "Sharpe Ratio"],
      correctAnswer: "Beta",
      explanation:
        "Beta measures a stock's sensitivity or volatility relative to the broader market (usually represented by a benchmark index like the S&P 500, which has a Beta of 1.0).",
    },
    {
      question: "What does the term 'liquidity' refer to in finance?",
      options: [
        "The amount of cash a firm keeps in banks",
        "The ease and speed with which an asset can be converted into cash without major loss of value",
        "The ratio of debt to equity",
        "The cash paid out as dividends",
      ],
      correctAnswer:
        "The ease and speed with which an asset can be converted into cash without major loss of value",
      explanation:
        "Liquidity describes how quickly and easily an asset can be sold and converted into cash at a stable, fair market price.",
    },
  ],
  healthcare: [
    {
      question:
        "What is the primary purpose of the HIPAA Act of 1996 in the United States?",
      options: [
        "To regulate pharmaceutical pricing",
        "To protect patient data privacy and secure medical records",
        "To provide medical insurance to all citizens",
        "To govern clinical trial procedures",
      ],
      correctAnswer:
        "To protect patient data privacy and secure medical records",
      explanation:
        "HIPAA (Health Insurance Portability and Accountability Act) sets national standards for protecting sensitive patient health information from being disclosed without consent.",
    },
    {
      question:
        "What does the abbreviation 'PRN' on a medical prescription mean?",
      options: [
        "Immediately (Stat)",
        "As needed",
        "Every morning",
        "After meals",
      ],
      correctAnswer: "As needed",
      explanation:
        "PRN stands for 'pro re nata', a Latin phrase meaning 'as the circumstance arises' or 'as needed'.",
    },
    {
      question:
        "Which of the following describes the term 'Triage' in healthcare?",
      options: [
        "The process of billing insurance companies",
        "The process of prioritizing patients based on the severity of their condition",
        "A type of cardiovascular surgery",
        "A method for sterilizing medical equipment",
      ],
      correctAnswer:
        "The process of prioritizing patients based on the severity of their condition",
      explanation:
        "Triage is the prioritization of patient care based on clinical urgency, ensuring those with life-threatening conditions receive treatment first.",
    },
    {
      question: "What is a pathogen?",
      options: [
        "A type of cell membrane",
        "An agent or microorganism that causes disease",
        "A chemical used in chemotherapy",
        "A vital sign monitor",
      ],
      correctAnswer: "An agent or microorganism that causes disease",
      explanation:
        "A pathogen is any organism that can produce disease, such as bacteria, viruses, fungi, or parasites.",
    },
    {
      question:
        "Which vital sign measurement indicates the force of blood pushing against the walls of the arteries?",
      options: [
        "Heart Rate",
        "Blood Pressure",
        "Oxygen Saturation",
        "Respiratory Rate",
      ],
      correctAnswer: "Blood Pressure",
      explanation:
        "Blood pressure measures the pressure exerted by circulating blood against the walls of the body's arterial blood vessels.",
    },
    {
      question: "What does 'EHR' stand for in healthcare informatics?",
      options: [
        "Emergency Health Response",
        "Electronic Health Record",
        "Essential Healthcare Requirements",
        "External Hospital Registrar",
      ],
      correctAnswer: "Electronic Health Record",
      explanation:
        "EHR stands for Electronic Health Record, which is a digital, real-time version of a patient's medical history.",
    },
    {
      question:
        "What is the primary function of white blood cells in the human body?",
      options: [
        "To transport oxygen",
        "To help blood clot",
        "To fight infections and support the immune system",
        "To regulate body temperature",
      ],
      correctAnswer: "To fight infections and support the immune system",
      explanation:
        "White blood cells (leukocytes) are part of the body's immune system, protecting against infectious diseases and foreign invaders.",
    },
    {
      question:
        "Which of the following is considered a standard 'nosocomial' infection?",
      options: [
        "An infection acquired in a hospital or healthcare facility",
        "A genetic genetic disorder",
        "An infection caught from contaminated food outdoors",
        "A seasonal allergy",
      ],
      correctAnswer:
        "An infection acquired in a hospital or healthcare facility",
      explanation:
        "Nosocomial infections, also known as healthcare-associated infections (HAIs), are contracted by patients during their stay in a hospital or healthcare environment.",
    },
    {
      question: "What is the main objective of palliative care?",
      options: [
        "To cure terminal illnesses",
        "To provide pain relief and improve the quality of life for patients with serious illnesses",
        "To perform high-risk surgeries",
        "To speed up patient discharge",
      ],
      correctAnswer:
        "To provide pain relief and improve the quality of life for patients with serious illnesses",
      explanation:
        "Palliative care focuses on relieving symptoms, pain, and stress associated with a serious illness, prioritizing patient comfort and quality of life.",
    },
    {
      question: "What does 'informed consent' require in a medical setting?",
      options: [
        "Signing any document without reading it",
        "Ensuring a patient fully understands the risks, benefits, and alternatives of a procedure before agreeing to it",
        "Obtaining verbal permission from a relative only",
        "Allowing doctors to make all decisions without explanation",
      ],
      correctAnswer:
        "Ensuring a patient fully understands the risks, benefits, and alternatives of a procedure before agreeing to it",
      explanation:
        "Informed consent is the ethical and legal requirement to ensure patients are fully educated on all key details of a treatment/procedure before consenting.",
    },
  ],
  default: [
    {
      question:
        "What is the primary advantage of defining clear SMART goals in project management?",
      options: [
        "They ensure the project costs nothing",
        "They make goals specific, measurable, achievable, relevant, and time-bound",
        "They eliminate the need for team communication",
        "They guarantee automatic project success",
      ],
      correctAnswer:
        "They make goals specific, measurable, achievable, relevant, and time-bound",
      explanation:
        "SMART goals provide clear structure and target criteria, making goals trackable, realistic, and easier to manage.",
    },
    {
      question:
        "Which of the following is a key element of effective active listening?",
      options: [
        "Formulating your response while the other person is still speaking",
        "Interrupting frequently to share your opinion",
        "Paraphrasing and reflecting back what you heard to confirm understanding",
        "Looking at your phone to show multitasking skills",
      ],
      correctAnswer:
        "Paraphrasing and reflecting back what you heard to confirm understanding",
      explanation:
        "Active listening involves fully focusing, understanding, responding, and remembering what is said. Reflecting back or paraphrasing demonstrates this engagement.",
    },
    {
      question:
        "What does the 'Pareto Principle' (80/20 rule) state in professional contexts?",
      options: [
        "80% of workers do 20% of the work",
        "80% of results come from 20% of effort or causes",
        "20% of meetings solve 80% of problems",
        "80% of companies fail within 20 months",
      ],
      correctAnswer: "80% of results come from 20% of effort or causes",
      explanation:
        "The Pareto Principle states that roughly 80% of consequences come from 20% of causes, suggesting focus should be prioritized on the most impactful 20% of tasks.",
    },
    {
      question:
        "In professional communication, what is the 'elevator pitch' designed to be?",
      options: [
        "A detailed business presentation lasting 1 hour",
        "A brief, persuasive 30-to-60 second summary of an idea, product, or background",
        "A speech given inside an elevator to strangers",
        "A written contract agreement",
      ],
      correctAnswer:
        "A brief, persuasive 30-to-60 second summary of an idea, product, or background",
      explanation:
        "An elevator pitch is a concise, high-level summary designed to spark interest and explain a concept or background in the time it takes to ride an elevator.",
    },
    {
      question:
        "What is the main purpose of a post-mortem or retrospective meeting after completing a project?",
      options: [
        "To assign blame for mistakes",
        "To celebrate without discussing problems",
        "To analyze what went well, what went wrong, and how to improve future projects",
        "To report status to senior executives only",
      ],
      correctAnswer:
        "To analyze what went well, what went wrong, and how to improve future projects",
      explanation:
        "Retrospective/post-mortem meetings focus on collaborative learning and continuous improvement, identifying actionable takeaways for future work.",
    },
    {
      question:
        "Which conflict resolution style involves finding a solution that fully satisfies the concerns of all parties involved?",
      options: ["Avoiding", "Competing", "Collaborating", "Accommodating"],
      correctAnswer: "Collaborating",
      explanation:
        "Collaboration is a win-win approach where all parties work together to integrate their concerns and find a mutually satisfactory solution.",
    },
    {
      question: "What does 'scope creep' refer to in project management?",
      options: [
        "The project budget decreasing",
        "Uncontrolled or continuous growth in a project's scope without adjustments to time, cost, or resources",
        "Team members leaving the project",
        "The speed of project delivery increasing",
      ],
      correctAnswer:
        "Uncontrolled or continuous growth in a project's scope without adjustments to time, cost, or resources",
      explanation:
        "Scope creep happens when new features or requirements are added to a project without proper authorization, budget adjustments, or timeline updates.",
    },
    {
      question: "What is the primary benefit of delegation in leadership?",
      options: [
        "It frees up leader time and empowers team members by building skills and responsibility",
        "It allows leaders to avoid all work",
        "It reduces team accountability",
        "It guarantees the task is done faster",
      ],
      correctAnswer:
        "It frees up leader time and empowers team members by building skills and responsibility",
      explanation:
        "Delegation distributes tasks to appropriate team members, optimizing leader bandwidth while fostering trust and skill development within the team.",
    },
    {
      question: "What is the core focus of 'change management'?",
      options: [
        "Changing bank accounts or software vendors",
        "Supporting and preparing individuals and teams to successfully adopt organizational change",
        "Rewriting corporate bylaws",
        "Enforcing strict disciplinary codes",
      ],
      correctAnswer:
        "Supporting and preparing individuals and teams to successfully adopt organizational change",
      explanation:
        "Change management focuses on the human side of transition, ensuring employees accept and adopt new systems, structures, or processes.",
    },
    {
      question:
        "Which of the following best describes 'emotional intelligence' (EQ) in the workplace?",
      options: [
        "Being highly emotional during team arguments",
        "The capacity to recognize, understand, and manage your own emotions and influence the emotions of others",
        "The intelligence measured by standard IQ exams",
        "Never showing any emotion under stress",
      ],
      correctAnswer:
        "The capacity to recognize, understand, and manage your own emotions and influence the emotions of others",
      explanation:
        "Emotional intelligence involves self-awareness, self-regulation, motivation, empathy, and social skills, which are crucial for team dynamics and leadership.",
    },
  ],
};

export function getFallbackQuiz(industryName = "") {
  const norm = industryName.toLowerCase();
  if (
    norm.includes("tech") ||
    norm.includes("software") ||
    norm.includes("computer") ||
    norm.includes("data")
  ) {
    return FALLBACK_QUIZZES.tech;
  }
  if (
    norm.includes("finance") ||
    norm.includes("bank") ||
    norm.includes("investment") ||
    norm.includes("wealth")
  ) {
    return FALLBACK_QUIZZES.finance;
  }
  if (
    norm.includes("health") ||
    norm.includes("medical") ||
    norm.includes("pharm") ||
    norm.includes("clinical")
  ) {
    return FALLBACK_QUIZZES.healthcare;
  }
  return FALLBACK_QUIZZES.default;
}

export const getFallbackInsights = (industryName = "") => {
  const norm = industryName.toLowerCase();
  if (
    norm.includes("tech") ||
    norm.includes("software") ||
    norm.includes("computer") ||
    norm.includes("data")
  ) {
    return {
      salaryRanges: [
        {
          role: "Software Engineer",
          min: 85000,
          max: 160000,
          median: 120000,
          location: "United States",
        },
        {
          role: "Frontend Developer",
          min: 75000,
          max: 140000,
          median: 105000,
          location: "United States",
        },
        {
          role: "Backend Engineer",
          min: 90000,
          max: 170000,
          median: 125000,
          location: "United States",
        },
        {
          role: "Product Manager",
          min: 95000,
          max: 180000,
          median: 135000,
          location: "United States",
        },
        {
          role: "DevOps Specialist",
          min: 95000,
          max: 165000,
          median: 130000,
          location: "United States",
        },
      ],
      growthRate: 15,
      demandLevel: "High",
      topSkills: [
        "JavaScript",
        "React",
        "Node.js",
        "TypeScript",
        "Cloud (AWS/GCP)",
        "System Design",
      ],
      marketOutlook: "Positive",
      keyTrends: [
        "Generative AI Integration",
        "Serverless Computing",
        "Micro-frontends",
        "Enhanced Cybersecurity (DevSecOps)",
      ],
      recommendedSkills: ["Next.js", "TailwindCSS", "Docker", "GraphQL"],
    };
  }
  if (
    norm.includes("finance") ||
    norm.includes("bank") ||
    norm.includes("investment") ||
    norm.includes("wealth")
  ) {
    return {
      salaryRanges: [
        {
          role: "Financial Analyst",
          min: 65000,
          max: 110000,
          median: 85000,
          location: "United States",
        },
        {
          role: "Investment Banker",
          min: 100000,
          max: 250000,
          median: 160000,
          location: "United States",
        },
        {
          role: "Portfolio Manager",
          min: 110000,
          max: 230000,
          median: 155000,
          location: "United States",
        },
        {
          role: "Risk Manager",
          min: 85000,
          max: 155000,
          median: 115000,
          location: "United States",
        },
        {
          role: "Wealth Advisor",
          min: 70000,
          max: 145000,
          median: 95000,
          location: "United States",
        },
      ],
      growthRate: 8,
      demandLevel: "Medium",
      topSkills: [
        "Financial Modeling",
        "Data Analysis",
        "Risk Assessment",
        "Portfolio Management",
        "Strategic Planning",
      ],
      marketOutlook: "Positive",
      keyTrends: [
        "FinTech Innovation",
        "ESG (Environmental, Social, Governance) Investing",
        "Automated Wealth Management",
        "Cryptocurrency Regulation",
      ],
      recommendedSkills: [
        "Python for Finance",
        "Data Visualization",
        "SQL",
        "Compliance Certification",
      ],
    };
  }
  if (
    norm.includes("health") ||
    norm.includes("medical") ||
    norm.includes("pharm") ||
    norm.includes("clinical")
  ) {
    return {
      salaryRanges: [
        {
          role: "Registered Nurse (RN)",
          min: 65000,
          max: 105000,
          median: 80000,
          location: "United States",
        },
        {
          role: "Clinical Research Coordinator",
          min: 55000,
          max: 90000,
          median: 70000,
          location: "United States",
        },
        {
          role: "Healthcare Administrator",
          min: 75000,
          max: 145000,
          median: 100000,
          location: "United States",
        },
        {
          role: "Biostatistician",
          min: 85000,
          max: 150000,
          median: 110000,
          location: "United States",
        },
        {
          role: "Medical Device Engineer",
          min: 80000,
          max: 135000,
          median: 105000,
          location: "United States",
        },
      ],
      growthRate: 12,
      demandLevel: "High",
      topSkills: [
        "Patient Care",
        "Regulatory Compliance (HIPAA)",
        "Clinical Data Management",
        "Healthcare Informatics",
        "Quality Assurance",
      ],
      marketOutlook: "Positive",
      keyTrends: [
        "Telehealth Adoption",
        "AI in Diagnostics",
        "Personalized Medicine",
        "Digital Electronic Health Records (EHR)",
      ],
      recommendedSkills: [
        "Healthcare Data Standards (FHIR)",
        "Data Privacy",
        "Clinical Trial Software",
      ],
    };
  }

  // Default fallback for other industries
  return {
    salaryRanges: [
      {
        role: "Associate Specialist",
        min: 50000,
        max: 85000,
        median: 65000,
        location: "National Average",
      },
      {
        role: "Team Lead",
        min: 65000,
        max: 110000,
        median: 85000,
        location: "National Average",
      },
      {
        role: "Manager",
        min: 80000,
        max: 140000,
        median: 105000,
        location: "National Average",
      },
      {
        role: "Senior Consultant",
        min: 90000,
        max: 160000,
        median: 120000,
        location: "National Average",
      },
      {
        role: "Director",
        min: 120000,
        max: 220000,
        median: 160000,
        location: "National Average",
      },
    ],
    growthRate: 8,
    demandLevel: "Medium",
    topSkills: [
      "Project Management",
      "Data-Driven Decision Making",
      "Effective Communication",
      "Strategic Planning",
      "Adaptability",
    ],
    marketOutlook: "Neutral",
    keyTrends: [
      "Digital Transformation",
      "Remote & Hybrid Collaboration",
      "Process Automation",
      "Sustainability & ESG Compliance",
    ],
    recommendedSkills: [
      "Data Analysis",
      "Leadership Development",
      "Agile Methodologies",
    ],
  };
};
