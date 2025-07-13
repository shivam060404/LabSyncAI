'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Card, TextArea } from './ui';
import VoiceInterface from './VoiceInterface';
import { AIResponse } from '../types';

interface AskAiHealthAdviceProps {
  patientContext?: {
    name: string;
    dob: string;
    previousConditions?: string[];
    medications?: string[];
    lifestyle?: {
      exercise?: string;
      diet?: string;
      smoking?: boolean;
      alcohol?: string;
    };
  };
  reportType?: string;
  reportResults?: Record<string, any>;
}

export default function AskAiHealthAdvice({ 
  patientContext, 
  reportType, 
  reportResults 
}: AskAiHealthAdviceProps) {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [conversationHistory, setConversationHistory] = useState<Array<{question: string; answer: string}>>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  const handleAskAi = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          patientContext,
          reportType,
          reportResults,
          conversationHistory,
          includeReferences: true,
          detailedExplanation: true
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      setAiResponse(data);
      
      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { question, answer: data.answer }
      ]);
      
      // Clear the question input
      setQuestion('');
    } catch (error) {
      console.error('Error asking AI:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVoiceInput = (text: string) => {
    setQuestion(text);
  };
  
  // Store the playAudioResponse function from VoiceInterface
  const [playAudioFn, setPlayAudioFn] = useState<((text: string) => Promise<void>) | null>(null);
  
  // Handle voice response using the function from VoiceInterface
  const handleVoiceResponse = async () => {
    if (!aiResponse || !playAudioFn) return;
    
    if (isPlayingAudio) {
      // Stop playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }
      setIsPlayingAudio(false);
      return;
    }
    
    setIsPlayingAudio(true);
    
    try {
      // Use the playAudioFn from VoiceInterface
      await playAudioFn(aiResponse.answer);
      
      // The audio will be played by VoiceInterface component
      // We'll handle the state here
      setIsPlayingAudio(false);
    } catch (error) {
      console.error('Error generating voice response:', error);
      setIsPlayingAudio(false);
    }
  };
  
  // Callback to receive the playAudioResponse function from VoiceInterface
  const handleVoiceResponseFn = (fn: (text: string) => Promise<void>) => {
    setPlayAudioFn(fn);
  };

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-800 p-4">
        <h3 className="text-lg font-medium">Ask AI Health Advisor</h3>
        <p className="text-sm text-gray-400 mt-1">
          Get personalized health advice based on your medical data
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex items-end gap-2 mb-4">
          <div className="flex-1">
            <TextArea
              placeholder="Ask a question about your health or medical reports..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div className="flex gap-2">
            <VoiceInterface 
              onTextInput={handleVoiceInput} 
              onVoiceResponse={handleVoiceResponseFn}
            />
            <Button 
              variant="primary" 
              onClick={handleAskAi} 
              disabled={isLoading || !question.trim()}
              className="h-10"
            >
              {isLoading ? 'Processing...' : 'Ask AI'}
            </Button>
          </div>
        </div>
        
        {aiResponse && (
          <div className="mt-6 bg-card-hover rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium">AI Response</h4>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleVoiceResponse}
                className="flex items-center"
              >
                <span className="mr-2">{isPlayingAudio ? '⏹️' : '🔊'}</span>
                {isPlayingAudio ? 'Stop' : 'Listen'}
              </Button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p>{aiResponse.answer}</p>
            </div>
            
            {aiResponse.references && aiResponse.references.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-400 mb-2">References</h5>
                <ul className="text-sm space-y-1">
                  {aiResponse.references.map((ref, index) => (
                    <li key={index} className="text-accent">{ref.text} - <span className="text-gray-400">{ref.location}</span></li>
                  ))}
                </ul>
              </div>
            )}
            
            {aiResponse.suggestedFollowUps && aiResponse.suggestedFollowUps.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-gray-400 mb-2">Suggested Follow-up Questions</h5>
                <div className="flex flex-wrap gap-2">
                  {aiResponse.suggestedFollowUps.map((followUp, index) => (
                    <Button 
                      key={index} 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setQuestion(followUp)}
                    >
                      {followUp}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {conversationHistory.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Conversation History</h4>
            <div className="space-y-4">
              {conversationHistory.map((item, index) => (
                <div key={index} className="bg-card-hover rounded-lg p-3">
                  <div className="font-medium text-accent mb-1">You asked:</div>
                  <p className="mb-3">{item.question}</p>
                  <div className="font-medium text-accent mb-1">AI answered:</div>
                  <p className="text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}