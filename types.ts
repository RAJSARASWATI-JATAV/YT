export enum CreativeTool {
    StoryWriter = 'Story Writer',
    ImageGenerator = 'Image Generator',
    ImageStylizer = 'Image Stylizer',
    ConceptVisualizer = 'Concept Visualizer',
    SloganGenerator = 'Slogan Generator',
    ResearchAssistant = 'Research Assistant',
    VideoGenerator = 'Video Generator',
    ChatPersona = 'Chat Persona',
    RecipeGenerator = 'Recipe Generator',
    EmailWriter = 'Email Writer',
    WorkoutPlanner = 'Workout Planner',
    MealPlanner = 'Meal Planner',
    SocialMediaPostGenerator = 'Social Media Post Generator',
    VisualAnalyst = 'Visual Analyst',
    CodeAssistant = 'Code Assistant',
    DocumentAnalyst = 'Document Analyst',
    TripPlanner = 'Trip Planner',
    ModelComparisonHub = 'Model Hub',
    PromptLibrary = 'Prompt Library',
    About = 'About',
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface ResearchResult {
    text: string;
    sources: GroundingSource[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface Recipe {
    recipeName: string;
    description: string;
    prepTime: string;
    cookTime: string;
    totalTime: string;
    servings: string;
    ingredients: string[];
    instructions: string[];
}

export type ActivityCategory = 'Food' | 'Sightseeing' | 'Activity' | 'Culture' | 'Relaxation' | 'Travel';

export interface Activity {
    timeOfDay: string;
    title: string;
    description: string;
    category: ActivityCategory;
}

export interface DailyPlan {
    day: number;
    title: string;
    activities: Activity[];
}

export interface TripPlan {
    tripTitle: string;
    itinerary: DailyPlan[];
}

export interface ModelConfig {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    systemInstruction: string;
    temperature: number;
}

export interface SavedPrompt {
    id: string;
    title: string;
    prompt: string;
}

export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    rest: string;
}

export interface DailyWorkout {
    day: string;
    focus: string;
    exercises: Exercise[];
}

export interface WorkoutPlan {
    planTitle: string;
    weeklySchedule: DailyWorkout[];
}

export interface Meal {
    name: string;
    calories: number;
    description: string;
}

export interface DailyMealPlan {
    day: string;
    meals: {
        breakfast: Meal;
        lunch: Meal;
        dinner: Meal;
        snack: Meal;
    };
    totalCalories: number;
}

export interface GroceryItem {
    item: string;
    quantity: string;
}

export interface MealPlan {
    planTitle: string;
    dailyPlans: DailyMealPlan[];
    groceryList: GroceryItem[];
}
