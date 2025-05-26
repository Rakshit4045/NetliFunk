import { ProfessionalProfile } from '../functions/shared/types';
import { calculateYearsOfExperience } from '../functions/shared/utils/date';

const CAREER_START_DATE = '2022-08-01'; // Format: YYYY-MM-DD

export const professionalProfile: ProfessionalProfile = {
  currentRole: "Software Engineer at WCT (Microsoft)",
  totalExperience: calculateYearsOfExperience(CAREER_START_DATE),
  startedWorking: CAREER_START_DATE,

  workPreferences: {
    location: {
      remote: true,
      hybrid: true,
      onsite: true,
      relocation: {
        domestic: true,
        international: true,
        visaRequired: true
      }
    },
    workSchedule: {
      maxDaysPerWeek: 5,
      flexibleHours: true
    },
    roleType: ['full-time', 'contract', 'freelance']
  },

  skillsets: [
    { 
      name: "React", 
      rating: 4,
      experience: "3+ years",
      description: "Built modern UIs with state management (Recoil) and secure login using Azure AD",
      category: 'frontend'
    },
    { 
      name: "TypeScript", 
      rating: 4,
      experience: "2.5+ years",
      description: "Built type-safe frontends and orchestrator apps using React and Recoil",
      category: 'frontend'
    },
    { 
      name: "Recoil", 
      rating: 3,
      experience: "1+ year",
      description: "Used in a custom testing dashboard for managing global app state efficiently",
      category: 'frontend'
    },
    { 
      name: "JavaScript", 
      rating: 4,
      experience: "4+ years",
      description: "Used for dynamic UI development in React and MERN stack projects",
      category: 'frontend'
    },
    { 
      name: "Blazor", 
      rating: 2,
      experience: "6+ months",
      description: "Built components with Azure AD integration as part of frontend UI work",
      category: "frontend"
    },
    { 
      name: "HTML", 
      rating: 4,
      experience: "4+ years",
      description: "Built SEO friendly and DOM optimized web applications",
      category: 'frontend'
    },
    { 
      name: "CSS", 
      rating: 4,
      experience: "4+ years",
      description: "Used in building responsive web pages and animations",
      category: 'frontend'
    },
    { 
      name: "Material-UI", 
      rating: 3,
      experience: "2+ years",
      description: "Built consistent and responsive UI components in enterprise projects",
      category: 'frontend'
    },
    { 
      name: ".NET Core", 
      rating: 4,
      experience: "2+ years",
      description: "Built and maintained .NET applications for healthcare systems on Azure",
      category: 'backend'
    },
    { 
      name: ".NET Web API", 
      rating: 4,
      experience: "2+ years",
      description: "Built and maintained .NET applications for healthcare systems on Azure",
      category: 'backend'
    },
    {
      name: "ASP.NET Web API",
      rating: 4,
      experience: "2+ years",
      description: "Developed scalable APIs with performance tuning and JWT-based authentication",
      category: "backend"
    },
    { 
      name: ".NET", 
      rating: 4,
      experience: "2+ years",
      description: "Built and maintained .NET applications for healthcare systems on Azure",
      category: 'backend'
    },
    { 
      name: "ASP.NET", 
      rating: 4,
      experience: "2+ years",
      description: "Built and maintained .NET applications for healthcare systems on Azure",
      category: 'backend'
    },
    {
      name: "ASP.NET Identity",
      rating: 4,
      experience: "1.5+ years",
      description: "Implemented role-based authentication and JWT token validation",
      category: "backend"
    },
    { 
      name: "C#", 
      rating: 4,
      experience: "2+ years",
      description: "Used in .NET-based services and console apps",
      category: 'backend'
    },
    { 
      name: "Entity Framework", 
      rating: 4,
      experience: "2+ years",
      description: "Optimized queries and integrated Redis for caching to reduce API latency",
      category: 'backend'
    },
    {
      name: "EF Core",
      rating: 4,
      experience: "2+ years",
      description: "Managed data access layer with optimized LINQ queries and Redis caching",
      category: "backend"
    },
    { 
      name: "OOP", 
      rating: 4,
      experience: "2+ years",
      description: "Used in .NET-based services and console apps",
      category: 'backend'
    },
    { 
      name: "SOLID Principles", 
      rating: 4,
      experience: "2+ years",
      description: "Used in .NET-based services and console apps",
      category: 'backend'
    },
    { 
      name: "Design Patterns", 
      rating: 4,
      experience: "2+ years",
      description: "Used in .NET-based services and console apps",
      category: 'backend'
    },
    {
      name: "Data Structures & Algorithms", 
      rating: 4,
      experience: "3+ years",
      description: "Practiced regularly using LeetCode and real-world problem solving",
      category: 'backend'
    },
    { 
      name: "Python", 
      rating: 3,
      experience: "1+ year",
      description: "Developed a custom CLI testing framework with CQL and Spark integration",
      category: 'backend'
    },
    { 
      name: "Apache Spark", 
      rating: 3,
      experience: "1 year",
      description: "Used for high-volume CQL query processing and validation",
      category: 'backend'
    },
    { 
      name: "Node.js", 
      rating: 3,
      experience: "1.5+ years",
      description: "Built REST APIs for small apps and learned Express integration",
      category: 'backend'
    },
    { 
      name: "Express", 
      rating: 3,
      experience: "1+ year",
      description: "Created RESTful endpoints and middleware flows in Node.js projects",
      category: 'backend'
    },
    { 
      name: "NUnit", 
      rating: 3,
      experience: "1+ year",
      description: "Wrote unit and integration tests for .NET Core services",
      category: 'backend'
    },
    { 
      name: "MSTest", 
      rating: 3,
      experience: "1+ year",
      description: "Used for .NET test automation with 90%+ coverage",
      category: 'backend'
    },
    {
      name: "OAuth 2.0",
      rating: 4,
      experience: "1.5+ years",
      description: "Implemented PKCE, client credentials, and auth code flows with Azure AD B2C",
      category: "backend"
    },
    { 
      name: "SQL Server", 
      rating: 4,
      experience: "3+ years",
      description: "Handled complex queries and optimized performance for FHIR data",
      category: 'database'
    },
    { 
      name: "MySQL", 
      rating: 3,
      experience: "1+ year",
      description: "Used in practice environments and basic query work",
      category: 'database'
    },
    { 
      name: "MongoDB", 
      rating: 3,
      experience: "1+ year",
      description: "Experience with document-based storage for simple apps",
      category: 'database'
    },
    { 
      name: "PostgreSQL", 
      rating: 2,
      experience: "Learning",
      description: "Explored schema design and SQL operations",
      category: 'database'
    },
    {
      name: "Git", 
      rating: 3,
      experience: "4+ years",
      description: "Well versed with different git commands",
      category: 'devops'
    },
    {
      name: "GitHub",
      rating: 5,
      experience: "2.5+ years",
      description: "Managed issues, PRs, and CI workflows as part of collaborative development",
      category: "tools"
    },
    { 
      name: "Docker", 
      rating: 3,
      experience: "2+ years",
      description: "Containerized services for consistent cloud deployment",
      category: 'devops'
    },
    { 
      name: "Kubernetes", 
      rating: 2,
      experience: "learning",
      description: "Gained basic understanding of Kubernetes from KodeKloud",
      category: 'devops'
    },
    { 
      name: "GitHub Actions", 
      rating: 3,
      experience: "1+ year",
      description: "Implemented CI/CD workflows for frontend/backend apps",
      category: 'devops'
    },
    { 
      name: "Jenkins", 
      rating: 3,
      experience: "1+ year",
      description: "Automated build and deployment pipelines",
      category: 'devops'
    },
    { 
      name: "PowerShell", 
      rating: 3,
      experience: "1+ year",
      description: "Used for scripting infrastructure and system automation",
      category: 'devops'
    },
    { 
      name: "Shell Scripting", 
      rating: 3,
      experience: "1+ year",
      description: "Wrote automation scripts using Bash and PowerShell",
      category: 'devops'
    },
    {
      name: "Linux Fundamentals", 
      rating: 3,
      experience: "1+ year",
      description: "Comfortable with CLI tools, file management, and permissions",
      category: 'devops'
    },
    {
      name: "Linux",
      rating: 3,
      experience: "1+ year",
      description: "Worked in Linux-based development environments with shell tools and scripting",
      category: "tools"
    },
    { 
      name: "ARM Templates", 
      rating: 4,
      experience: "2+ years",
      description: "Deployed multiple Azure resources using ARM template",
      category: 'devops'
    },
    { 
      name: "Bicep", 
      rating: 4,
      experience: "2+ years",
      description: "Deployed multiple Azure resources using Bicep template",
      category: 'devops'
    },
    { 
      name: "Terraform", 
      rating: 2,
      experience: "Learning",
      description: "Basic understanding of IaC principles and resource provisioning",
      category: 'devops'
    },
    { 
      name: "Azure", 
      rating: 4,
      experience: "2+ years",
      description: "Worked with Azure Functions, B2C, VNet, and other cloud services",
      category: 'cloud'
    },
    { 
      name: "Azure Entra ID", 
      rating: 4,
      experience: "2+ years",
      description: "Worked with Azure Entra ID handling auth functionality",
      category: 'cloud'
    },
    { 
      name: "Azure AD", 
      rating: 4,
      experience: "2+ years",
      description: "Worked with Azure AD handling auth functionality",
      category: 'cloud'
    },
    { 
      name: "Azure B2C", 
      rating: 4,
      experience: "1.5+ years",
      description: "Implemented OAuth2 flows for enterprise authentication",
      category: 'cloud'
    },
    { 
      name: "Function App", 
      rating: 4,
      experience: "2+ years",
      description: "Built and deployed queue/HTTP-triggered Azure Functions",
      category: 'cloud'
    },
    { 
      name: "Application Insights", 
      rating: 4,
      experience: "2+ years",
      description: "Handled telemetry logging using application insights",
      category: 'cloud'
    },
    { 
      name: "Virtual Network", 
      rating: 3,
      experience: "1+ year",
      description: "Configured VNet with private endpoints and rules",
      category: 'cloud'
    },
    { 
      name: "Key Vault", 
      rating: 3,
      experience: "1+ year",
      description: "Managed secrets and keys for secure deployments",
      category: 'cloud'
    },
    { 
      name: "FHIR Service", 
      rating: 3,
      experience: "1+ year",
      description: "Worked extensively on Microsoft’s FHIR implementation",
      category: 'cloud'
    },
    { 
      name: "Storage Account", 
      rating: 3,
      experience: "1+ year",
      description: "Worked extensively with Storage Accounts to handle FHIR Resources",
      category: 'cloud'
    },
    { 
      name: "Azure API Management", 
      rating: 3,
      experience: "1+ year",
      description: "Utilized API Management service in Smart on FHIR project",
      category: 'cloud'
    },
    { 
      name: "Redis Cache", 
      rating: 3,
      experience: "1+ year",
      description: "Improved performance with distributed in-memory cache",
      category: 'cloud'
    },
    { 
      name: "SMART on FHIR", 
      rating: 3,
      experience: "Ongoing",
      description: "Upgrading Microsoft FHIR samples to support SMART v2 standards",
      category: 'domain'
    },
    { 
      name: "HL7 US Core", 
      rating: 3,
      experience: "Ongoing",
      description: "Analyzing compliance with HL7 standards and USCDI requirements",
      category: 'domain'
    },
    { 
      name: "CQL(Clinical Query Language)", 
      rating: 3,
      experience: "1 year",
      description: "Created a complete framework for automated CQL query validation",
      category: 'domain'
    }
  ],

  domainExpertise: {
    healthcare: {
      areas: ["FHIR", "SMART on FHIR", "HL7 standards", "US Core", "USCDI"],
      experience: "2 years",
      projects: ["Azure FHIR Service", "SMART on FHIR Implementation"]
    }
  },

  achievements: [
    {
      area: "Performance Optimization",
      impact: "Improved API performance by 20%, reducing client issues by 35%",
      skills: ["API Development", "Performance Tuning", ".NET Core"]
    },
    {
      area: "Authentication & Security",
      impact: "Integrated Azure B2C auth with 40% improved flexibility",
      skills: ["OAuth 2.0", "Azure B2C", "Security"]
    }
  ]
};
