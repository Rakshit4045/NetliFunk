import { PortfolioSection } from '../functions/shared/types';

interface PortfolioData {
  about: {
    summary: string;
    currentRole: string;
    interests: string[];
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
  };
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    description: string[];
    technologies: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    github?: string;
  }>;
  techstack: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    databases: string[];
    cloud: string[];
  };
  contact: {
    email: string;
    linkedin: string;
    github: string;
    location: string;
  };
}

// Your portfolio data
export const portfolioData: Record<PortfolioSection, any> = {
  about: {
    summary:
      "I'm a results-driven Software Engineer with almost 3 years of experience building enterprise-grade solutions for Microsoft’s open-source FHIR projects. Skilled in backend, frontend, and DevOps with deep understanding of cloud platforms, authentication, and healthcare standards.",
    currentRole: "Software Engineer at Waferwire (Client: Microsoft)",
    interests: [
      "Healthcare Interoperability (FHIR, SMART on FHIR)",
      "Cloud-Native Development on Azure",
      "Authentication & Authorization Protocols (OAuth2, B2C)",
      "Data Engineering & CQL Testing Frameworks"
    ],
    education: [
      {
        degree: "Bachelor of Engineering in Information Technology",
        institution: "Mumbai University",
        year: "2022"
      }
    ]
  },
  experience: [
    {
      role: "Software Engineer",
      company: "Waferwire Cloud Technologies (Client: Microsoft)",
      duration: "Feb 2025 – Present",
      description: [
        "Delivered Smart on FHIR v2 and US Core 6.1.0 features in Microsoft’s open-source sample app",
        "Built optimized C# Azure Functions with structured diagnostics using App Insights",
        "Created a PySpark test framework to validate CQL queries on Microsoft Fabric",
        "Developed a React JS + TypeScript UI using Recoil for test orchestration",
        "Resolved GitHub issues and implemented critical feature enhancements"
      ],
      technologies: [
        "C#",
        "Azure Functions",
        "Python",
        "PySpark",
        "React",
        "TypeScript",
        "Recoil",
        "App Insights"
      ]
    },
    {
      role: "Software Engineer",
      company: "Xoriant Solutions (Client: Microsoft)",
      duration: "Aug 2023 – Jan 2025",
      description: [
        "Boosted API response time by 20% and reduced client issues by 35%",
        "Built scalable HTTP + Queue Azure Functions handling 500K+ daily requests",
        "Developed C# parallel-processing console app reducing FHIR data load time by 80%",
        "Led UI development with React and Blazor integrating Azure AD",
        "Documented deployments, reducing setup time by 30%"
      ],
      technologies: [
        "C#",
        ".NET",
        "Azure Functions",
        "React",
        "Blazor",
        "Azure AD",
        "Queue Storage"
      ]
    },
    {
      role: "Associate Software Engineer",
      company: "Xoriant Solutions",
      duration: "Aug 2022 – Jul 2023",
      description: [
        "Optimized ASP.NET Web APIs, improving response times by 20%",
        "Implemented role-based access control with ASP.NET Identity and JWT",
        "Enhanced EF Core queries and reduced latency with Redis caching",
        "Refactored ReactJS components, cutting load times by 25%",
        "Achieved 95% test coverage with NUnit and MSTest"
      ],
      technologies: [
        "ASP.NET Web API",
        "C#",
        "EF Core",
        "Redis",
        "ReactJS",
        "NUnit",
        "MSTest"
      ]
    },
    {
      role: "MERN Developer Intern",
      company: "Youth India E-School",
      duration: "Aug 2021 – Oct 2021",
      description: [
        "Designed schemas using Mongoose and Sequelize",
        "Built REST APIs using Node.js and Express",
        "Participated in Agile sprints and daily scrums"
      ],
      technologies: ["MongoDB", "PostgreSQL", "Node.js", "Express", "Mongoose", "Sequelize"]
    }
  ],
  projects: [
    {
      name: "CQL Test Framework",
      description:
        "A CQL testing framework for validating healthcare logic on Microsoft Fabric using PySpark and React. Reduced FHIR ingestion time from 24 hours to under 8 hours via parallelized .NET loader.",
      technologies: [
        "Python",
        "PySpark",
        "React",
        "Vite",
        "Azure AD",
        "C#",
        ".NET",
        "FHIR Service"
      ],
      github: "https://github.com/Rakshit4045/cql-test-framework" // Replace with actual repo if needed
    },
    {
      name: "SMART on FHIR Enhancements",
      description:
        "Integrated third-party IDPs using Azure AD B2C, implemented OAuth2.0 flows, enhanced security with VNet deployments, and added SMART v2 features for regulatory compliance.",
      technologies: [
        "Azure B2C",
        "OAuth2.0",
        "C#",
        "Azure Functions",
        "FHIR",
        "App Insights",
        "Private Endpoints",
        "ARM/Bicep"
      ],
      github: "https://github.com/microsoft/fhir-server" // Replace with actual repo/PR if required
    }
  ],
  skills: {
    languages: ["C#", "JavaScript", "TypeScript", "Python", "Shell"],
    frameworks: [
      ".NET",
      "ASP.NET Web API",
      "ReactJS",
      "PySpark",
      "NUnit",
      "MSTest"
    ],
    tools: ["Git", "GitHub", "Jenkins", "Docker", "Kubernetes", "PowerShell", "Bash"],
    databases: ["SQL Server", "MySQL", "MongoDB", "PostgreSQL"],
    cloud: [
      "Azure (Functions, VNet, Storage, Redis, Key Vault, FHIR Service)",
      "ARM",
      "Bicep",
      "Terraform"
    ]
  },
  contact: {
    email: "rakshitshinde.work@gmail.com",
    linkedin: "https://linkedin.com/in/rakshit-shinde",
    github: "https://github.com/Rakshit4045",
    location: "Hyderabad, India"
  }
};

