/**
 * Cleans and parses a JSON string from an AI response
 */
export const cleanJsonResponse = <T>(text: string): T => {
  try {
    // Remove any markdown code block markers
    const cleanedText = text
      .replace(/```json\s*/, '')
      .replace(/```\s*$/, '')
      .replace(/\n/, '')
      .replace(/`\`/, '')
      .replace(/\\n/g, ' ')                // Remove escaped newlines
      .replace(/\\"/g, '"')                // Unescape double quotes
      .replace(/\\\\/g, '\\')              // Unescape double backslashes
      .replace(/,\s*(\}|\])/g, '$1')      
      .trim();

    // Find and extract JSON object if embedded in other text
    // const jsonMatch = cleanedText.match(/({[\s\S]*})/);
    // const jsonStr = jsonMatch ? jsonMatch[1] : cleanedText;

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error parsing JSON response:', error);
    throw new Error('Failed to parse AI response');
  }
};
