import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import { ResearchResult, Recipe, TripPlan, WorkoutPlan, MealPlan } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating text:", error);
        throw new Error("Failed to generate text from Gemini API.");
    }
}

export async function generateStoryStream(prompt: string, onChunk: (chunk: string) => void) {
    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are a master storyteller. Write a compelling and engaging story based on the user's prompt.",
            },
        });

        for await (const chunk of response) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error generating story stream:", error);
        throw new Error("Failed to generate story stream from Gemini API.");
    }
}

export async function generateStreamWithConfig(prompt: string, systemInstruction: string, temperature: number, onChunk: (chunk: string) => void) {
    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: temperature,
            },
        });

        for await (const chunk of response) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error generating stream with config:", error);
        throw new Error("Failed to generate stream from Gemini API.");
    }
}

export async function generateImages(prompt: string, aspectRatio: string): Promise<string[]> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            },
        });

        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    } catch (error) {
        console.error("Error generating images:", error);
        throw new Error("Failed to generate images from Gemini API.");
    }
}

export async function researchWithGoogle(prompt: string): Promise<ResearchResult> {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        
        const sources = rawChunks
            .map((chunk: any) => ({
                uri: chunk.web?.uri,
                title: chunk.web?.title,
            }))
            .filter((source: any) => source.uri && source.title);

        return { text, sources };
    } catch (error) {
        console.error("Error with Google Search grounding:", error);
        throw new Error("Failed to perform research with Gemini API.");
    }
}

export async function startVideoGeneration(prompt: string): Promise<any> {
    try {
        const operation = await ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            config: {
                numberOfVideos: 1
            }
        });
        return operation;
    } catch (error) {
        console.error("Error starting video generation:", error);
        throw new Error("Failed to start video generation with Gemini API.");
    }
}

export async function getVideosOperation(operation: any): Promise<any> {
    try {
        const result = await ai.operations.getVideosOperation({ operation: operation });
        return result;
    } catch (error) {
        console.error("Error polling video operation:", error);
        throw new Error("Failed to poll video operation from Gemini API.");
    }
}

export function createChatSession(systemInstruction: string): Chat {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        },
    });
}

export async function generateCode(language: string, description: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a code snippet in ${language} for the following task: ${description}`,
            config: {
                systemInstruction: `You are an expert programmer. Generate clean, efficient, and well-documented code in the requested language. Only output the raw code, with no extra explanations or markdown fences (like \`\`\`${language}).`,
                temperature: 0.2, 
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating code:", error);
        throw new Error("Failed to generate code from Gemini API.");
    }
}

export async function debugCode(language: string, code: string, errorDescription: string): Promise<string> {
    try {
        const systemInstruction = `You are an expert code debugger. Analyze the provided code snippet and the error description, identify the bug, explain it clearly and concisely, and provide the corrected code. Format your response with an "Explanation:" section and a "Corrected Code:" section.`;
        const prompt = `Language: ${language}\n\nCode with bug:\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\`\n\nError/Problem Description: ${errorDescription}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.1,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error debugging code:", error);
        throw new Error("Failed to debug code with Gemini API.");
    }
}

export async function generateRecipe(prompt: string): Promise<Recipe> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an expert chef. Generate a complete recipe based on the following request: "${prompt}". Ensure all fields are filled out appropriately.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        recipeName: { type: Type.STRING, description: "The name of the recipe." },
                        description: { type: Type.STRING, description: "A short, enticing description of the dish." },
                        prepTime: { type: Type.STRING, description: "Preparation time, e.g., '15 minutes'." },
                        cookTime: { type: Type.STRING, description: "Cooking time, e.g., '25 minutes'." },
                        totalTime: { type: Type.STRING, description: "Total time to make the dish." },
                        servings: { type: Type.STRING, description: "Number of servings, e.g., '4 servings'." },
                        ingredients: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of ingredients with quantities."
                        },
                        instructions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Step-by-step instructions for preparing the dish."
                        }
                    },
                    required: ["recipeName", "description", "prepTime", "cookTime", "totalTime", "servings", "ingredients", "instructions"]
                },
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as Recipe;
    } catch (error) {
        console.error("Error generating recipe:", error);
        throw new Error("Failed to generate recipe from Gemini API. The model may have returned an invalid format.");
    }
}


export async function analyzeImage(imageBase64: string, mimeType: string, prompt: string): Promise<string> {
    try {
        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw new Error("Failed to analyze image with Gemini API.");
    }
}

export async function stylizeImage(imageBase64: string, mimeType: string, style: string): Promise<string> {
    try {
        // Step 1: Analyze the uploaded image to get a detailed description
        const analysisPrompt = "Describe this image in vivid and extensive detail. Focus on the main subject, background elements, colors, lighting, mood, and overall composition. This description will be used to recreate the image in a different artistic style.";
        const detailedDescription = await analyzeImage(imageBase64, mimeType, analysisPrompt);

        // Step 2: Generate a new image using the description and the selected style
        const generationPrompt = `${detailedDescription}. Art style: ${style}.`;
        
        const generatedImages = await generateImages(generationPrompt, '1:1');
        
        if (generatedImages.length === 0) {
            throw new Error("The AI failed to generate a new image based on the style.");
        }

        return generatedImages[0];
    } catch (error) {
        console.error("Error stylizing image:", error);
        throw new Error("A failure occurred during the image stylization process.");
    }
}


export async function generateSocialMediaPost(platform: string, topic: string, tone: string): Promise<string> {
    try {
        const systemInstruction = `You are a social media marketing expert. Your goal is to create an engaging post for the specified platform.`;
        const prompt = `Create a social media post for ${platform} about "${topic}". The tone of the post should be ${tone}. Include 3-5 relevant and popular hashtags.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating social media post:", error);
        throw new Error("Failed to generate social media post from Gemini API.");
    }
}

export async function analyzeDocument(documentText: string, mode: 'summarize' | 'extract' | 'qa', question?: string): Promise<string> {
    try {
        let prompt = '';
        const systemInstruction = 'You are a highly intelligent document analysis assistant. Your responses should be accurate, concise, and directly address the user\'s request based on the provided text.';

        switch (mode) {
            case 'summarize':
                prompt = `Please provide a concise summary of the following document:\n\n---\n\n${documentText}`;
                break;
            case 'extract':
                prompt = `Extract the key points from the following document. Present them as a clear, bulleted list:\n\n---\n\n${documentText}`;
                break;
            case 'qa':
                if (!question) throw new Error("A question is required for QA mode.");
                prompt = `Based *only* on the content of the document provided, answer the following question.\n\nQuestion: "${question}"\n\nDocument:\n---\n\n${documentText}`;
                break;
            default:
                throw new Error("Invalid analysis mode.");
        }

        return await generateText(prompt, systemInstruction);

    } catch (error) {
        console.error("Error analyzing document:", error);
        throw new Error("Failed to analyze document with Gemini API.");
    }
}

export async function generateTripPlan(destination: string, duration: number, interests: string, budget: string): Promise<TripPlan> {
    try {
        const systemInstruction = "You are an expert travel agent. Create a detailed, exciting, and practical travel itinerary based on the user's preferences. Ensure the plan is logical and considers travel time between locations.";
        const prompt = `Generate a travel itinerary for a ${duration}-day trip to ${destination}.
Interests: ${interests}.
Budget: ${budget}.
Provide a variety of activities covering morning, afternoon, and evening for each day. For each activity, specify a category from this list: 'Food', 'Sightseeing', 'Activity', 'Culture', 'Relaxation', 'Travel'.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tripTitle: { type: Type.STRING, description: "A catchy title for the trip, e.g., 'An Adventurous 5 Days in Tokyo'." },
                        itinerary: {
                            type: Type.ARRAY,
                            description: "An array of daily plans.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.INTEGER, description: "The day number, e.g., 1." },
                                    title: { type: Type.STRING, description: "A brief theme for the day, e.g., 'Historical Exploration'." },
                                    activities: {
                                        type: Type.ARRAY,
                                        description: "A list of activities for the day.",
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                timeOfDay: { type: Type.STRING, description: "e.g., 'Morning', 'Afternoon', 'Evening'." },
                                                title: { type: Type.STRING, description: "The name of the activity, e.g., 'Visit the Eiffel Tower'." },
                                                description: { type: Type.STRING, description: "A one or two-sentence description of the activity." },
                                                category: {
                                                    type: Type.STRING,
                                                    enum: ['Food', 'Sightseeing', 'Activity', 'Culture', 'Relaxation', 'Travel'],
                                                    description: "The category of the activity."
                                                }
                                            },
                                            required: ["timeOfDay", "title", "description", "category"]
                                        }
                                    }
                                },
                                required: ["day", "title", "activities"]
                            }
                        }
                    },
                    required: ["tripTitle", "itinerary"]
                }
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as TripPlan;
    } catch (error) {
        console.error("Error generating trip plan:", error);
        throw new Error("Failed to generate trip plan from Gemini API. The model may have returned an invalid format.");
    }
}

export async function generateEmail(purpose: string, tone: string, recipientInfo: string, moreInfo: string): Promise<string> {
    try {
        const systemInstruction = "You are an expert at writing clear, effective, and appropriately toned emails. Generate a complete email including a subject line and body.";
        const prompt = `
            Please write an email with the following specifications:
            - **Purpose:** ${purpose}
            - **Recipient Information:** ${recipientInfo}
            - **Tone:** ${tone}
            - **Additional Information/Context:** ${moreInfo}

            Return the email as a single block of text, starting with "Subject: [Your Subject]".
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error generating email:", error);
        throw new Error("Failed to generate email from Gemini API.");
    }
}

export async function generateWorkoutPlan(goal: string, level: string, daysPerWeek: number): Promise<WorkoutPlan> {
    try {
        const systemInstruction = "You are a certified personal trainer. Create a structured, effective, and safe workout plan based on the user's goals and fitness level.";
        const prompt = `Create a 1-week workout plan for a user with the following details:
        - Fitness Goal: ${goal}
        - Fitness Level: ${level}
        - Days per week: ${daysPerWeek}
        
        For each workout day, provide a clear focus (e.g., 'Upper Body Strength', 'Cardio & Core') and a list of 5-7 exercises. For each exercise, specify the name, sets, reps, and rest period.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planTitle: { type: Type.STRING, description: "A catchy title for the workout plan." },
                        weeklySchedule: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING, description: "The day of the week or day number, e.g., 'Day 1' or 'Monday'." },
                                    focus: { type: Type.STRING, description: "The main focus of the day's workout, e.g., 'Full Body Strength'." },
                                    exercises: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING },
                                                sets: { type: Type.STRING, description: "e.g., '3 sets' or '4 sets'." },
                                                reps: { type: Type.STRING, description: "e.g., '8-12 reps' or '45 seconds'." },
                                                rest: { type: Type.STRING, description: "e.g., '60s rest' or '90s rest'." },
                                            },
                                            required: ["name", "sets", "reps", "rest"],
                                        },
                                    },
                                },
                                required: ["day", "focus", "exercises"],
                            },
                        },
                    },
                    required: ["planTitle", "weeklySchedule"],
                },
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as WorkoutPlan;
    } catch (error) {
        console.error("Error generating workout plan:", error);
        throw new Error("Failed to generate workout plan from Gemini API.");
    }
}

export async function generateMealPlan(diet: string, calories: number, days: number): Promise<MealPlan> {
    try {
        const systemInstruction = "You are a registered dietitian. Create a balanced, healthy, and varied meal plan based on the user's dietary preferences and calorie goals. Also, generate a consolidated grocery list for the entire plan.";
        const prompt = `Create a ${days}-day meal plan for a user with the following requirements:
        - Dietary Preference: ${diet}
        - Daily Calorie Target: Approximately ${calories} calories.
        
        For each day, provide meals for breakfast, lunch, dinner, and one snack. For each meal, provide a name, a short description, and an approximate calorie count. Calculate the total calories for each day.
        Finally, create a consolidated grocery list for all the ingredients needed for the entire plan.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        planTitle: { type: Type.STRING },
                        dailyPlans: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING, description: "e.g., 'Day 1'." },
                                    meals: {
                                        type: Type.OBJECT,
                                        properties: {
                                            breakfast: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.INTEGER }, description: { type: Type.STRING } } },
                                            lunch: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.INTEGER }, description: { type: Type.STRING } } },
                                            dinner: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.INTEGER }, description: { type: Type.STRING } } },
                                            snack: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.INTEGER }, description: { type: Type.STRING } } },
                                        },
                                    },
                                    totalCalories: { type: Type.INTEGER },
                                },
                            },
                        },
                        groceryList: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    item: { type: Type.STRING },
                                    quantity: { type: Type.STRING },
                                },
                            },
                        },
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as MealPlan;
    } catch (error) {
        console.error("Error generating meal plan:", error);
        throw new Error("Failed to generate meal plan from Gemini API.");
    }
}