'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui';

interface VoiceInterfaceProps {
  onTextInput: (text: string) => void;
  onVoiceResponse?: (playAudioFn: (text: string) => Promise<void>) => void;
  isProcessing?: boolean;
  className?: string;
}

/**
 * Voice Interface component for the conversational AI assistant
 * Provides speech-to-text and text-to-speech capabilities
 */
export default function VoiceInterface({
  onTextInput,
  onVoiceResponse,
  isProcessing = false,
  className = '',
}: VoiceInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMicAvailable, setIsMicAvailable] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Check if microphone is available and expose playAudioResponse method
  useEffect(() => {
    const checkMicrophoneAvailability = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsMicAvailable(true);
        // Stop the stream immediately after checking
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        console.error('Microphone not available:', error);
        setIsMicAvailable(false);
        setErrorMessage('Microphone access is required for voice input');
      }
    };
    
    checkMicrophoneAvailability();
    
    // Expose the playAudioResponse method to the parent component
    if (onVoiceResponse) {
      onVoiceResponse(playAudioResponse);
    }
  }, [onVoiceResponse]);
  
  // Start recording function
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setErrorMessage('Failed to start recording. Please check microphone permissions.');
    }
  };
  
  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };
  
  // Process the recorded audio
  const processAudio = async (audioBlob: Blob) => {
    try {
      // Create a FormData object to send the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      
      // Call the voice API endpoint for speech-to-text
      const response = await fetch('/api/voice', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to process speech');
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.text) {
        setTranscript(data.data.text);
        // Pass the transcript to the parent component
        onTextInput(data.data.text);
      } else {
        throw new Error(data.message || 'Failed to transcribe speech');
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      setErrorMessage('Failed to process speech. Please try again.');
    }
  };
  
  // Play audio response
  const playAudioResponse = async (text: string) => {
    try {
      setIsPlaying(true);
      
      // Call the voice API endpoint for text-to-speech
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceOptions: {
            gender: 'neutral',
            speed: 1.0,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // In a production environment, this would use the actual audio data
        // For now, we'll use the Web Speech API as a fallback
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = handlePlaybackEnded;
          speechSynthesis.speak(utterance);
        } else {
          setErrorMessage('Text-to-speech is not supported in this browser');
          setIsPlaying(false);
        }
      } else {
        throw new Error(data.message || 'Failed to generate speech');
      }
    } catch (error) {
      console.error('Error playing audio response:', error);
      setErrorMessage('Failed to play audio response');
      setIsPlaying(false);
    }
  };
  
  // Handle audio playback ended
  const handlePlaybackEnded = () => {
    setIsPlaying(false);
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <audio 
        ref={audioRef} 
        onEnded={handlePlaybackEnded} 
        onError={() => {
          setIsPlaying(false);
          setErrorMessage('Error playing audio');
        }} 
        className="hidden"
      />
      
      {errorMessage && (
        <div className="text-danger text-sm mb-2">{errorMessage}</div>
      )}
      
      {transcript && (
        <div className="bg-background-light p-3 rounded-lg mb-3 w-full">
          <p className="text-sm font-medium">You said:</p>
          <p className="text-primary">{transcript}</p>
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isMicAvailable || isProcessing || isPlaying}
          className={`flex items-center ${isRecording ? 'bg-danger hover:bg-danger-dark' : 'bg-primary hover:bg-primary-dark'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isRecording 
                ? "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" 
                : "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"} 
            />
          </svg>
          {isRecording ? 'Stop Recording' : 'Start Voice Input'}
        </Button>
      </div>
    </div>
  );
}