import { GoogleGenAI, Type } from "@google/genai";
import { Expense, Category } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

export const suggestCategory = async (description: string, amount: number, availableCategories: Category[]): Promise<string | null> => {
  if (!description || !isOnline()) return null;

  try {
    const categoryNames = availableCategories.map(c => c.name).join(', ');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Categorize this expense into exactly one of these categories: [${categoryNames}].
      
      Expense: "${description}"
      Amount: ${amount}
      
      Return ONLY the exact category name from the list provided.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categoryName: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const matchedName = result.categoryName;

    const found = availableCategories.find(c => c.name.toLowerCase() === matchedName?.toLowerCase());
    return found ? found.id : null;
  } catch (error) {
    console.error("Gemini categorization failed:", error);
    return null;
  }
};

export const getMonthlyInsights = async (expenses: Expense[], categories: Category[], monthName: string): Promise<string> => {
  if (expenses.length === 0) return "No expenses yet. Start spending (wisely)! 😉";
  if (!isOnline()) return "Connect to internet for AI tips! 🌐";

  try {
    // Map category IDs to names for the AI
    const summary = expenses.map(e => {
      const catName = categories.find(c => c.id === e.categoryId)?.name || 'Unknown';
      return `${e.date}: ${e.description} (${e.amount}) - ${catName}`;
    }).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze these expenses for ${monthName}. 
      Give me a VERY SHORT, FUN, and FRIENDLY observation or tip (Max 20 words). 
      Use emojis. Be like a cool best friend. Currency is ₹.
      
      Expenses:
      ${summary}`,
    });

    return response.text || "You're doing great! Keep it up! 🚀";
  } catch (error) {
    console.error("Gemini insights failed:", error);
    return "AI is taking a quick nap. 😴";
  }
};
