import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Course, Faculty, Room, ScheduledClass, DAYS_OF_WEEK, TIME_SLOTS } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTimetableWithGemini = async (
  courses: Course[],
  faculty: Faculty[],
  rooms: Room[]
): Promise<ScheduledClass[]> => {
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const modelId = "gemini-2.5-flash"; // Good balance of speed and logic for constraint solving

  const systemInstruction = `
    You are an expert academic scheduler algorithm designed to implement flexible, multidisciplinary education standards.
    
    Your goal is to create a conflict-free timetable for a multidisciplinary institution.
    
    Constraints:
    1. A Faculty member cannot teach two classes at the same time.
    2. A Room cannot host two classes at the same time.
    3. Distribute courses evenly across the week.
    4. Prioritize "Skill Enhancement" and "Vocational" courses for afternoon slots if possible.
    5. Ensure every course provided is scheduled at least twice in the week (credits permitting) but do not overbook.
    6. Return ONLY the JSON data.
  `;

  // Define the schema for the output
  const responseSchema: Schema = {
    type: Type.ARRAY,
    description: "A list of scheduled classes representing the weekly timetable.",
    items: {
      type: Type.OBJECT,
      properties: {
        courseId: { type: Type.STRING, description: "ID of the course being taught" },
        facultyId: { type: Type.STRING, description: "ID of the faculty member teaching" },
        roomId: { type: Type.STRING, description: "ID of the room used" },
        day: { type: Type.STRING, description: "Day of the week (Monday, Tuesday, etc.)" },
        timeSlot: { type: Type.STRING, description: "Time slot string (e.g., '09:00 - 10:00')" }
      },
      required: ["courseId", "facultyId", "roomId", "day", "timeSlot"]
    }
  };

  const prompt = `
    Here is the available data for scheduling:
    
    Courses: ${JSON.stringify(courses)}
    Faculty: ${JSON.stringify(faculty)}
    Rooms: ${JSON.stringify(rooms)}
    
    Available Days: ${JSON.stringify(DAYS_OF_WEEK)}
    Available Time Slots: ${JSON.stringify(TIME_SLOTS)}
    
    Please generate a valid schedule. Attempt to use all courses. Assign appropriate faculty based on expertise matching course names (fuzzy match) or random valid assignment if strictly not specified. Ensure rooms are large enough if capacity was provided (assume standard size if not).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Lower temperature for more deterministic/logic-based results
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini.");
    }

    const rawData = JSON.parse(jsonText);
    
    // Add unique IDs to the generated classes
    return rawData.map((item: any, index: number) => ({
      ...item,
      id: `scheduled-${index}-${Date.now()}`
    }));

  } catch (error) {
    console.error("Error generating timetable:", error);
    throw error;
  }
};