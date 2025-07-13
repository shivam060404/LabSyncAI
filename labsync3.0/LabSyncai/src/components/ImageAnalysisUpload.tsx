'use client';

import { useState, useRef } from 'react';
import { Button, Card } from './ui';

interface ImageAnalysisUploadProps {
  onAnalysisComplete?: (result: any) => void;
}

export default function ImageAnalysisUpload({ onAnalysisComplete }: ImageAnalysisUploadProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState<'medical' | 'ocr'>('medical');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      setSelectedImage(file);
      setError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image analysis
  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Create form data with image and analysis type
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('reportType', analysisType === 'ocr' ? 'ocr' : 'medical');
      
      // Add analysis type for more detailed processing
      if (analysisType === 'medical') {
        formData.append('analysisType', 'detailed');
      }
      
      // Send request to the image analysis API
      const response = await fetch('/api/image-analysis', {
        method: 'POST',
        body: formData,
      });
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      // Parse the response
      const result = await response.json();
      
      // Check if the analysis was successful
      if (result.success && result.data) {
        if (onAnalysisComplete) {
          onAnalysisComplete(result.data);
        }
      } else {
        throw new Error(result.message || 'Analysis failed with no error details');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(`Failed to analyze the image: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger file input click
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Medical Image Analysis</h3>
      
      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <Button 
            variant={analysisType === 'medical' ? 'primary' : 'secondary'}
            onClick={() => setAnalysisType('medical')}
            disabled={isAnalyzing}
          >
            Medical Analysis
          </Button>
          <Button 
            variant={analysisType === 'ocr' ? 'primary' : 'secondary'}
            onClick={() => setAnalysisType('ocr')}
            disabled={isAnalyzing}
          >
            Extract Text (OCR)
          </Button>
        </div>
        
        <div className="text-sm text-gray-400 mb-4">
          {analysisType === 'medical' ? 
            'Upload X-rays, MRIs, or other medical images for AI analysis' : 
            'Extract text from scanned reports or documents'}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isAnalyzing}
        />
        
        {!previewUrl ? (
          <div 
            className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors"
            onClick={handleSelectClick}
          >
            <div className="text-4xl mb-2">📷</div>
            <p className="mb-2">Click to select an image</p>
            <p className="text-sm text-gray-400">Supported formats: JPG, PNG, JPEG, GIF</p>
          </div>
        ) : (
          <div className="mb-4">
            <div className="relative rounded-lg overflow-hidden mb-4" style={{ maxHeight: '300px' }}>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full object-contain"
                style={{ maxHeight: '300px' }}
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <Button 
                variant="secondary" 
                onClick={handleSelectClick}
                disabled={isAnalyzing}
              >
                Change Image
              </Button>
              <Button 
                variant="primary" 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !selectedImage}
              >
                {isAnalyzing ? 'Analyzing...' : `Analyze with AI (${analysisType === 'medical' ? 'Medical' : 'OCR'})`}
              </Button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-danger/10 text-danger rounded-lg">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}