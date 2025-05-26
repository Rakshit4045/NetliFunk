/**
 * Calculates years of experience from a start date
 * @param startDate Start date in format YYYY-MM-DD
 * @returns Experience in years with months as decimal (e.g., 2.83 for 2 years 10 months)
 */
export const calculateYearsOfExperience = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  
  const years = now.getFullYear() - start.getFullYear();
  const months = now.getMonth() - start.getMonth();
  const days = now.getDate() - start.getDate();
  
  // Calculate total months including fractional part from days
  let totalMonths = (years * 12) + months;
  if (days < 0) {
    totalMonths -= 1;
  }
  
  // Convert to years with 2 decimal places
  return Number((totalMonths / 12).toFixed(2));
};

/**
 * Formats years of experience into a human-readable string
 * @param years Experience in years (e.g., 2.83)
 * @returns Formatted string (e.g., "2 years 10 months")
 */
export const formatExperience = (years: number): string => {
  const totalMonths = Math.round(years * 12);
  const wholeYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  const yearText = wholeYears === 1 ? "year" : "years";
  const monthText = remainingMonths === 1 ? "month" : "months";
  
  if (wholeYears === 0) return `${remainingMonths} ${monthText}`;
  if (remainingMonths === 0) return `${wholeYears} ${yearText}`;
  return `${wholeYears} ${yearText} ${remainingMonths} ${monthText}`;
};
