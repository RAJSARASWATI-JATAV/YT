import React, { useState, useCallback } from 'react';
import { CreativeTool } from './types';
import Header from './components/Header';
import StoryWriter from './pages/StoryWriter';
import ImageGenerator from './pages/ImageGenerator';
import ConceptVisualizer from './pages/ConceptVisualizer';
import SloganGenerator from './pages/SloganGenerator';
import ResearchAssistant from './pages/ResearchAssistant';
import Footer from './components/Footer';
import VideoGenerator from './pages/VideoGenerator';
import ChatPersona from './pages/ChatPersona';
import RecipeGenerator from './pages/RecipeGenerator';
import VisualAnalyst from './pages/VisualAnalyst';
import CodeAssistant from './pages/CodeAssistant';
import About from './pages/About';
import ImageStylizer from './pages/ImageStylizer';
import SocialMediaPostGenerator from './pages/SocialMediaPostGenerator';
import DocumentAnalyst from './pages/DocumentAnalyst';
import TripPlanner from './pages/TripPlanner';
import ModelComparisonHub from './pages/ModelComparisonHub';
import PromptLibrary from './pages/PromptLibrary';
import EmailWriter from './pages/EmailWriter';
import WorkoutPlanner from './pages/WorkoutPlanner';
import MealPlanner from './pages/MealPlanner';


const App: React.FC = () => {
    const [activeTool, setActiveTool] = useState<CreativeTool>(CreativeTool.StoryWriter);

    const handleToolChange = useCallback((tool: CreativeTool) => {
        setActiveTool(tool);
    }, []);

    const renderActiveTool = () => {
        switch (activeTool) {
            case CreativeTool.StoryWriter:
                return <StoryWriter />;
            case CreativeTool.ImageGenerator:
                return <ImageGenerator />;
            case CreativeTool.ImageStylizer:
                return <ImageStylizer />;
            case CreativeTool.ConceptVisualizer:
                return <ConceptVisualizer />;
            case CreativeTool.SloganGenerator:
                return <SloganGenerator />;
            case CreativeTool.ResearchAssistant:
                return <ResearchAssistant />;
            case CreativeTool.VideoGenerator:
                return <VideoGenerator />;
            case CreativeTool.ChatPersona:
                return <ChatPersona />;
            case CreativeTool.RecipeGenerator:
                return <RecipeGenerator />;
             case CreativeTool.EmailWriter:
                return <EmailWriter />;
            case CreativeTool.WorkoutPlanner:
                return <WorkoutPlanner />;
            case CreativeTool.MealPlanner:
                return <MealPlanner />;
            case CreativeTool.SocialMediaPostGenerator:
                return <SocialMediaPostGenerator />;
            case CreativeTool.VisualAnalyst:
                return <VisualAnalyst />;
            case CreativeTool.CodeAssistant:
                return <CodeAssistant />;
            case CreativeTool.DocumentAnalyst:
                return <DocumentAnalyst />;
            case CreativeTool.TripPlanner:
                return <TripPlanner />;
            case CreativeTool.ModelComparisonHub:
                return <ModelComparisonHub />;
            case CreativeTool.PromptLibrary:
                return <PromptLibrary />;
            case CreativeTool.About:
                return <About />;
            default:
                return <StoryWriter />;
        }
    };

    return (
        <div className="min-h-screen font-sans flex flex-col">
            <div className="relative z-10 flex flex-col min-h-screen">
                <Header activeTool={activeTool} onToolChange={handleToolChange} />
                <main className="flex-grow container mx-auto p-4 md:p-8">
                    {renderActiveTool()}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default App;