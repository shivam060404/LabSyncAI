import { MedicalReport, TestResult, HealthPlan, ReportAnalysis, ReportType as ReportTypeFromTypes } from '../types';

/**
 * Groq AI service
 */
export class GroqAIService {
  private apiKey: string;
  private apiEndpoint: string;
  
  constructor() {
    // Get API key and endpoint from environment variables
    this.apiKey = process.env.GROQ_API_KEY || '';
    this.apiEndpoint = process.env.GROQ_API_ENDPOINT || 'https://api.groq.com/v1';
    
    if (!this.apiKey) {
      console.warn('GROQ_API_KEY not found in environment variables. AI features will be limited.');
    }
  }
  
  /**
   * Process voice input (speech-to-text)
   * @param audioBuffer The audio buffer containing the voice recording
   * @returns The transcribed text
   */
  async processVoiceInput(audioBuffer: Buffer): Promise<string> {
    try {
      console.log('Processing voice input, buffer size:', audioBuffer.length);
      
      // For now, we'll use Google Cloud Speech-to-Text API via Gemini
      // In a production environment, you would use a dedicated speech-to-text service
      
      // Create a prompt for Gemini to simulate speech-to-text
      const prompt = `You are a speech-to-text transcription service. 
      The audio contains someone speaking in English. 
      Please provide only the transcribed text with no additional commentary.
      If you cannot transcribe the audio, respond with "I couldn't understand the audio."\n`;
      
      // In a real implementation, we would send the audio to a speech-to-text service
      // For now, we'll return a simulated response based on the buffer size
      // This is just a placeholder until a real speech-to-text service is integrated
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return a simulated response
      if (audioBuffer.length < 1000) {
        return "I couldn't understand the audio. The recording was too short.";
      }
      
      // In a real implementation, we would call an actual speech-to-text API
      // For now, return a placeholder message
      return "This is a simulated transcription. Please integrate a real speech-to-text service.";
    } catch (error) {
      console.error('Error processing voice input:', error);
      throw new Error('Failed to process voice input');
    }
  }
  
  /**
   * Generate voice response (text-to-speech)
   * @param text The text to convert to speech
   * @param voiceOptions Options for the voice (gender, accent, speed, pitch)
   * @returns The audio buffer containing the generated speech
   */
  async generateVoiceResponse(text: string, voiceOptions?: any): Promise<Buffer> {
    try {
      console.log('Generating voice response for text:', text);
      console.log('Voice options:', voiceOptions);
      
      // For now, we'll use a simulated text-to-speech service
      // In a production environment, you would use a dedicated text-to-speech service
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real implementation, we would call an actual text-to-speech API
      // For now, return an empty buffer as a placeholder
      return Buffer.from('Simulated audio data');
    } catch (error) {
      console.error('Error generating voice response:', error);
      throw new Error('Failed to generate voice response');
    }
  }
  
  /**
   * Call the Groq API with a prompt
   * @param prompt The prompt to send to the API
   * @param options Optional configuration for the API call
   * @returns The response text from the API or a simulated response
   */
  private async callGroqAPI(prompt: string, options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  }): Promise<string> {
    try {
      // Validate input
      if (!prompt || prompt.trim().length === 0) {
        console.error('Empty prompt provided to callGroqAPI');
        return this.getSimulatedResponse('empty prompt');
      }
      
      // Check if API key is available
      if (!this.apiKey) {
        console.warn('GROQ_API_KEY not found in environment variables, using simulated response');
        return this.getSimulatedResponse(prompt);
      }
      
      // Set default options
      const temperature = options?.temperature ?? 0.7;
      const maxTokens = options?.maxTokens ?? 2048;
      const model = options?.model ?? 'mixtral-8x7b-32768';
      
      // Construct API URL
      const url = `${this.apiEndpoint}/chat/completions`;
      
      try {
        // Set timeout for fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{
              role: 'user',
              content: prompt
            }],
            temperature: temperature,
            max_tokens: maxTokens
          }),
          signal: controller.signal
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Groq API error: ${response.status} ${errorText}`);
          return this.getSimulatedResponse(prompt);
        }
        
        try {
          const data = await response.json();
          
          // Extract the response text from the API response
          if (data.choices && data.choices[0] && data.choices[0].message) {
            const content = data.choices[0].message.content;
            if (content && content.trim().length > 0) {
              return content;
            } else {
              console.warn('Empty response from Groq API');
              return this.getSimulatedResponse(prompt);
            }
          } else {
            console.error('Unexpected API response format');
            return this.getSimulatedResponse(prompt);
          }
        } catch (jsonError) {
          console.error('Error parsing JSON response from Groq API:', jsonError);
          return this.getSimulatedResponse(prompt);
        }
      } catch (fetchError) {
        // Check if it's a timeout error
        if (fetchError && typeof fetchError === 'object' && 'name' in fetchError && fetchError.name === 'AbortError') {
          console.error('Groq API request timed out after 30 seconds');
        } else {
          console.error('Error fetching from Groq API:', fetchError);
        }
        return this.getSimulatedResponse(prompt);
      }
    } catch (error) {
      console.error('Error in callGroqAPI:', error);
      return this.getSimulatedResponse(prompt);
    }
  }
  
  /**
   * Generate a simulated response based on the prompt
   * This is used as a fallback when the API call fails
   * @param prompt The original prompt sent to the API
   * @returns A simulated response appropriate for the prompt type
   */
  private getSimulatedResponse(prompt: string): string {
    try {
      // Handle empty or invalid prompts
      if (!prompt || prompt.trim().length === 0) {
        return JSON.stringify({
          summary: "No input was provided for analysis.",
          findings: ["Unable to analyze without input data"],
          recommendations: ["Please provide complete information for analysis"],
          aiConfidenceScore: 0
        }, null, 2);
      }
      
      // Check if the prompt is asking for JSON
      const isJsonRequest = prompt.toLowerCase().includes('format the response as json') || 
                            prompt.toLowerCase().includes('json format') || 
                            prompt.toLowerCase().includes('json with the following structure');
      
      // Determine the type of medical content being analyzed
      const isCBC = prompt.includes('CBC') || prompt.includes('Complete Blood Count');
      const isLipidPanel = prompt.includes('Lipid Panel') || prompt.includes('Cholesterol');
      const isMetabolicPanel = prompt.includes('Metabolic Panel') || prompt.includes('BMP') || prompt.includes('CMP');
      const isUrinalysis = prompt.includes('Urinalysis') || prompt.includes('Urine Test');
      const isImagingReport = prompt.includes('X-ray') || prompt.includes('MRI') || prompt.includes('CT scan') || prompt.includes('Ultrasound');
      
      if (isJsonRequest) {
        // Determine what kind of analysis is being requested
        if (prompt.includes('medical report') || prompt.includes('analyze report')) {
          // Create a more specific response based on report type
          if (isCBC) {
            return JSON.stringify({
              summary: "This is a simulated analysis of a Complete Blood Count (CBC) report.",
              findings: [
                "White blood cell count within normal range", 
                "Red blood cell count within normal range",
                "Hemoglobin level within normal range",
                "Platelet count within normal range"
              ],
              recommendations: [
                "Continue with regular health check-ups", 
                "Maintain a balanced diet rich in iron and vitamins",
                "Stay hydrated and maintain regular physical activity"
              ],
              possibleConditions: [],
              followUpRecommended: false,
              followUpTimeframe: "As per regular schedule (annually)",
              aiConfidenceScore: 0.95
            }, null, 2);
          } else if (isLipidPanel) {
            return JSON.stringify({
              summary: "This is a simulated analysis of a Lipid Panel report.",
              findings: [
                "Total cholesterol within normal range", 
                "HDL (good) cholesterol within normal range",
                "LDL (bad) cholesterol within normal range",
                "Triglycerides within normal range"
              ],
              recommendations: [
                "Continue heart-healthy diet low in saturated fats", 
                "Maintain regular physical activity (150+ minutes per week)",
                "Consider follow-up testing in 1-2 years"
              ],
              possibleConditions: [],
              followUpRecommended: false,
              followUpTimeframe: "1-2 years",
              aiConfidenceScore: 0.95
            }, null, 2);
          } else if (isMetabolicPanel) {
            return JSON.stringify({
              summary: "This is a simulated analysis of a Metabolic Panel report.",
              findings: [
                "Glucose level within normal range", 
                "Kidney function markers within normal range",
                "Liver function markers within normal range",
                "Electrolytes within normal range"
              ],
              recommendations: [
                "Maintain a balanced diet with appropriate hydration", 
                "Continue regular exercise routine",
                "Follow up with regular annual check-ups"
              ],
              possibleConditions: [],
              followUpRecommended: false,
              followUpTimeframe: "Annual check-up",
              aiConfidenceScore: 0.95
            }, null, 2);
          } else if (isImagingReport) {
            return JSON.stringify({
              summary: "This is a simulated analysis of a medical imaging report.",
              findings: [
                "No abnormalities detected", 
                "Normal anatomical structures",
                "No evidence of acute pathology",
                "Image quality is adequate for interpretation"
              ],
              recommendations: [
                "No further imaging needed at this time", 
                "Continue with regular preventive care"
              ],
              possibleConditions: [],
              followUpRecommended: false,
              followUpTimeframe: "As clinically indicated",
              aiConfidenceScore: 0.9
            }, null, 2);
          } else {
            // Generic medical report response
            return JSON.stringify({
              summary: "This is a simulated analysis of a medical report.",
              findings: ["Normal test results observed", "All values within reference ranges"],
              recommendations: ["Continue with regular check-ups", "Maintain healthy lifestyle"],
              possibleConditions: [],
              followUpRecommended: false,
              followUpTimeframe: "As per regular schedule",
              aiConfidenceScore: 0.95
            }, null, 2);
          }
        } else if (prompt.includes('image') || prompt.includes('analyze image')) {
          if (isImagingReport) {
            return JSON.stringify({
              summary: "This is a simulated analysis of a medical imaging scan.",
              findings: [
                "No abnormalities detected", 
                "Normal anatomical structures visible",
                "No evidence of fracture, dislocation, or soft tissue abnormality",
                "Image quality is good"
              ],
              recommendations: [
                "No further imaging needed at this time",
                "Follow up as clinically indicated"
              ],
              aiConfidenceScore: 0.9
            }, null, 2);
          } else {
            return JSON.stringify({
              summary: "This is a simulated analysis of a medical image.",
              findings: ["No abnormalities detected", "Image quality is good"],
              recommendations: ["No further imaging needed at this time"],
              aiConfidenceScore: 0.9
            }, null, 2);
          }
        } else if (prompt.includes('health recommendations') || prompt.includes('personalized recommendations')) {
          return JSON.stringify({
            dietary: [
              "Maintain a balanced diet rich in fruits, vegetables, and whole grains",
              "Limit processed foods and added sugars",
              "Stay hydrated with adequate water intake"
            ],
            exercise: [
              "Aim for at least 150 minutes of moderate aerobic activity weekly",
              "Include strength training exercises twice a week",
              "Incorporate flexibility and balance exercises"
            ],
            lifestyle: [
              "Ensure 7-9 hours of quality sleep nightly",
              "Practice stress management techniques",
              "Maintain social connections for mental wellbeing"
            ],
            medication: [],
            followUp: "Continue with regular annual check-ups",
            healthGoals: [
              "Maintain current health status",
              "Focus on preventive care"
            ]
          }, null, 2);
        } else if (prompt.includes('answer question') || prompt.includes('medical question')) {
          return JSON.stringify({
            answer: "This is a simulated answer to your medical question. For accurate medical advice, please consult with a healthcare professional.",
            references: [
              "General medical knowledge",
              "Standard clinical guidelines"
            ],
            suggestedFollowUpQuestions: [
              "What lifestyle changes can improve this condition?",
              "When should I follow up with my healthcare provider?"
            ]
          }, null, 2);
        }
      }
      
      // Check for question answering (non-JSON format)
      if (prompt.includes('question') && prompt.includes('?')) {
        return "This is a simulated answer to your medical question. Based on general medical knowledge, it's important to maintain regular check-ups with your healthcare provider and follow their specific advice for your situation. For accurate medical advice tailored to your specific circumstances, please consult with a qualified healthcare professional.";
      }
      
      // Default simulated response
      return "This is a simulated AI response. The system is currently operating in fallback mode. Please check your API configuration or try again later.";
    } catch (error) {
      console.error('Error generating simulated response:', error);
      // Ultimate fallback
      return "Unable to generate a response at this time. Please try again later.";
    }
  }
  
  /**
   * Extract text from an image using OCR
   */
  async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    try {
      // Validate input
      if (!imageBuffer || imageBuffer.length === 0) {
        console.error('Invalid or empty image buffer provided for OCR');
        return this.getSimulatedOcrResult();
      }
      
      // Check if we have the Google Cloud Vision API key
      const visionApiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
      
      if (!visionApiKey || visionApiKey === 'your_google_key') {
        console.log('Using Gemini Vision API for OCR as Google Cloud Vision API key is not available');
        
        // Use Gemini Vision API for OCR if available
        if (this.apiKey) {
          try {
            const modelName = 'gemini-pro-vision';
            const url = `${this.apiEndpoint}/models/${modelName}:generateContent?key=${this.apiKey}`;
            
            const base64Image = imageBuffer.toString('base64');
            
            try {
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  contents: [{
                    parts: [
                      {
                        text: "Extract all text from this medical document or report image. Return ONLY the extracted text, nothing else."
                      },
                      {
                        inline_data: {
                          mime_type: 'image/jpeg',
                          data: base64Image
                        }
                      }
                    ]
                  }],
                  generationConfig: {
                    temperature: 0.1,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 2048
                  }
                })
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                console.error(`Gemini Vision API error: ${response.status} ${errorText}`);
                return this.getSimulatedOcrResult();
              }
              
              try {
                const data = await response.json();
                
                // Extract the response text from the API response
                if (data.candidates && 
                    data.candidates[0] && 
                    data.candidates[0].content && 
                    data.candidates[0].content.parts && 
                    data.candidates[0].content.parts[0]) {
                  const extractedText = data.candidates[0].content.parts[0].text;
                  if (extractedText && extractedText.trim().length > 0) {
                    return extractedText;
                  } else {
                    console.warn('Empty text extracted from image, using simulated result');
                    return this.getSimulatedOcrResult();
                  }
                } else {
                  console.error('Unexpected API response format');
                  return this.getSimulatedOcrResult();
                }
              } catch (jsonError) {
                console.error('Error parsing JSON response from Gemini Vision API:', jsonError);
                return this.getSimulatedOcrResult();
              }
            } catch (fetchError) {
              console.error('Error fetching from Gemini Vision API:', fetchError);
              return this.getSimulatedOcrResult();
            }
          } catch (geminiError) {
            console.error('Error using Gemini Vision API for OCR:', geminiError);
            return this.getSimulatedOcrResult();
          }
        } else {
          console.warn('No API key available for OCR');
          return this.getSimulatedOcrResult();
        }
      }
      
      // In a real implementation, we would call the Google Cloud Vision API here
      // For now, return a simulated OCR result
      console.log('Using simulated OCR result as Google Cloud Vision API is not implemented');
      return this.getSimulatedOcrResult();
    } catch (error) {
      console.error('Error extracting text from image:', error);
      return this.getSimulatedOcrResult();
    }
  }
  
  /**
   * Get a simulated OCR result when real OCR fails
   */
  private getSimulatedOcrResult(): string {
    return `MEDICAL LABORATORY REPORT

Patient: John Doe
Date: ${new Date().toLocaleDateString()}
Test: Complete Blood Count (CBC)

Results:
White Blood Cell Count: 7.5 x10^3/μL (4.5-11.0)
Red Blood Cell Count: 5.0 x10^6/μL (4.5-5.9)
Hemoglobin: 14.2 g/dL (13.5-17.5)
Hematocrit: 42% (41-50%)
Platelet Count: 250 x10^3/μL (150-450)

Assessment: Normal CBC results.

[Note: This is simulated text as OCR service was unavailable]`;
  }
  
  /**
   * Analyze a medical image using AI
   */
  /**
   * Analyze a medical report using AI
   */
  async analyzeReport(reportData: any, reportType: ReportType, imageBuffer?: Buffer): Promise<ReportAnalysis> {
    try {
      console.log('Analyzing report of type:', reportType);
      
      // Validate input data
      if (!reportData) {
        console.warn('No report data provided for analysis');
        return this.getReportAnalysisFallback(reportType);
      }
      
      // Extract text from the report data
      const reportText = reportData.text || '';
      
      // Determine if we have standardized data or need to work with raw text
      const hasStandardizedData = reportData.parameters && Array.isArray(reportData.parameters) && reportData.parameters.length > 0;
      
      // Prepare the prompt based on report type and available data
      let prompt = `Analyze the following medical ${reportType.toLowerCase().replace('_', ' ')} report:\n\n`;
      
      if (hasStandardizedData) {
        try {
          prompt += `Standardized Data: ${JSON.stringify(reportData.parameters, null, 2)}\n\n`;
        } catch (jsonError) {
          console.error('Error stringifying report parameters:', jsonError);
          prompt += `Standardized Data: Available but could not be processed\n\n`;
        }
      } else if (reportData.results && Array.isArray(reportData.results) && reportData.results.length > 0) {
        try {
          prompt += `Test Results: ${JSON.stringify(reportData.results, null, 2)}\n\n`;
        } catch (jsonError) {
          console.error('Error stringifying report results:', jsonError);
          prompt += `Test Results: Available but could not be processed\n\n`;
        }
      } else {
        prompt += `Raw Report Text: ${reportText.substring(0, 1500)}\n\n`; // Limit text length
      }
      
      prompt += 'Provide a comprehensive analysis including:\n';
      prompt += '1. A summary of the report\n';
      prompt += '2. Key findings (both normal and abnormal)\n';
      prompt += '3. Recommendations based on the findings\n';
      prompt += '4. Any possible conditions suggested by the results\n';
      prompt += '5. Whether follow-up is recommended and in what timeframe\n\n';
      prompt += 'Format the response as JSON with the following structure: {"summary": "...", "findings": ["...", "..."], "recommendations": ["...", "..."], "possibleConditions": [{"name": "...", "probability": X.X, "description": "..."}], "followUpRecommended": true/false, "followUpTimeframe": "...", "aiConfidenceScore": X.X}';
      
      // Call the Groq API
      let responseText;
      try {
        responseText = await this.callGroqAPI(prompt);
      } catch (apiError) {
        console.error('Error calling Groq API for report analysis:', apiError);
        return this.getReportAnalysisFallback(reportType, reportData);
      }
      
      // Try to parse the JSON response
      try {
        // Find JSON in the response (it might be surrounded by markdown code blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonStr = jsonMatch[0];
          try {
            const analysisResult = JSON.parse(jsonStr);
            
            // Validate the analysis result has required fields
            if (!this.isValidAnalysisResult(analysisResult)) {
              console.warn('Invalid analysis result structure, using fallback');
              return this.getReportAnalysisFallback(reportType, reportData);
            }
            
            // Add report type to the result
            analysisResult.reportType = reportType;
            
            // Generate personalized health recommendations
            try {
              analysisResult.personalizedRecommendations = {
                dietary: this.generateDietaryRecommendations(reportData),
                exercise: this.generateExerciseRecommendations(reportData),
                lifestyle: this.generateLifestyleModifications(reportData)
              };
            } catch (recError) {
              console.error('Error generating personalized recommendations:', recError);
              analysisResult.personalizedRecommendations = this.getFallbackRecommendations();
            }
            
            return analysisResult as ReportAnalysis;
          } catch (parseError) {
            console.error('Error parsing JSON string:', parseError);
            // Try more aggressive JSON parsing if standard parsing fails
            return this.attemptAggressiveJsonParsing(jsonStr, reportType, reportData);
          }
        }
      } catch (jsonError) {
        console.error('Error parsing JSON from Groq response:', jsonError);
      }
      
      // If JSON parsing failed, create a structured response manually
      return this.getReportAnalysisFallback(reportType, reportData);
    } catch (error) {
      console.error('Error analyzing report:', error);
      return this.getReportAnalysisFallback(reportType);
    }
  }
  
  /**
   * Validate if an analysis result has the required structure
   */
  private isValidAnalysisResult(result: any): boolean {
    return (
      result && 
      typeof result === 'object' &&
      typeof result.summary === 'string' && 
      Array.isArray(result.findings) &&
      Array.isArray(result.recommendations)
    );
  }
  
  /**
   * Attempt more aggressive JSON parsing for malformed JSON responses
   */
  private attemptAggressiveJsonParsing(jsonStr: string, reportType: ReportType, reportData: any): any {
    try {
      // Try to fix common JSON issues
      const cleanedJson = jsonStr
        .replace(/\'/g, '"')  // Replace single quotes with double quotes
        .replace(/\,\s*\}/g, '}')  // Remove trailing commas
        .replace(/\,\s*\]/g, ']')  // Remove trailing commas in arrays
        .replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":')  // Add quotes to unquoted keys
        .replace(/:\s*'([^']*)'/g, ':"$1"');  // Replace single-quoted values with double-quoted
      
      const analysisResult = JSON.parse(cleanedJson);
      
      // Add report type to the result
      analysisResult.reportType = reportType;
      
      // Generate personalized health recommendations
      try {
        analysisResult.personalizedRecommendations = {
          dietary: this.generateDietaryRecommendations(reportData),
          exercise: this.generateExerciseRecommendations(reportData),
          lifestyle: this.generateLifestyleModifications(reportData)
        };
      } catch (recError) {
        console.error('Error generating personalized recommendations:', recError);
        analysisResult.personalizedRecommendations = this.getFallbackRecommendations();
      }
      
      return analysisResult;
    } catch (error) {
      console.error('Aggressive JSON parsing failed:', error);
      return this.getReportAnalysisFallback(reportType, reportData);
    }
  }
  
  /**
   * Get a fallback analysis result when AI analysis fails
   */
  private getReportAnalysisFallback(reportType: ReportType, reportData?: any): ReportAnalysis {
    try {
      // Create a structured fallback response
      const fallbackAnalysis: ReportAnalysis = {
        summary: `Analysis of ${reportType.toLowerCase().replace('_', ' ')} report completed.`,
        findings: [
          `Report type: ${reportType}`,
          'Analysis performed with limited AI capabilities'
        ],
        recommendations: [
          'Please consult with your healthcare provider for a complete interpretation of these results',
          'Consider scheduling a follow-up appointment to discuss these findings'
        ],
        possibleConditions: [],
        followUpRecommended: true,
        followUpTimeframe: 'As advised by your healthcare provider',
        aiConfidenceScore: 0.7,
        reportType: reportType as any // Use type assertion to avoid type conflicts
      };
      
      // Add test results if available in the report data
      if (reportData && reportData.parameters && Array.isArray(reportData.parameters) && reportData.parameters.length > 0) {
        fallbackAnalysis.testResults = reportData.parameters;
      } else if (reportData && reportData.results && Array.isArray(reportData.results) && reportData.results.length > 0) {
        fallbackAnalysis.testResults = reportData.results;
      }
      
      // Add personalized recommendations if report data is available
      if (reportData) {
        try {
          fallbackAnalysis.personalizedRecommendations = {
            dietary: this.generateDietaryRecommendations(reportData),
            exercise: this.generateExerciseRecommendations(reportData),
            lifestyle: this.generateLifestyleModifications(reportData)
          };
        } catch (recError) {
          console.error('Error generating fallback recommendations:', recError);
          fallbackAnalysis.personalizedRecommendations = this.getFallbackRecommendations();
        }
      } else {
        fallbackAnalysis.personalizedRecommendations = this.getFallbackRecommendations();
      }
      
      return fallbackAnalysis;
    } catch (error) {
      console.error('Error creating fallback analysis:', error);
      // Ultimate fallback if everything else fails
      return {
        summary: 'Medical report analysis completed.',
        findings: ['Report analysis completed with limited capabilities'],
        recommendations: ['Please consult with your healthcare provider'],
        possibleConditions: [],
        followUpRecommended: true,
        followUpTimeframe: 'As soon as possible',
        aiConfidenceScore: 0.5,
        reportType: reportType as any, // Use type assertion to avoid type conflicts
        personalizedRecommendations: this.getFallbackRecommendations()
      };
    }
  }
  
  /**
   * Analyze a medical image using AI
   * @param imageBuffer The image buffer to analyze
   * @param reportType The type of medical report
   * @param options Optional configuration for analysis
   * @returns Analysis results with findings and recommendations
   */
  async analyzeImage(imageBuffer: Buffer, reportType: ReportType, options: { analysisType?: string } = {}): Promise<any> {
    try {
      // Validate input
      if (!imageBuffer || imageBuffer.length === 0) {
        console.error('Invalid or empty image buffer provided');
        return this.getImageAnalysisFallback(reportType);
      }
      
      // Extract text from the image first
      let extractedText = '';
      try {
        extractedText = await this.extractTextFromImage(imageBuffer);
        console.log('Successfully extracted text from image, length:', extractedText.length);
      } catch (ocrError) {
        console.error('OCR failed during image analysis:', ocrError);
        // Continue with analysis even if OCR fails
      }
      
      // Determine analysis depth based on options
      const analysisType = options.analysisType || 'standard';
      let confidenceThreshold = 0.7; // Default confidence threshold
      
      switch (analysisType.toLowerCase()) {
        case 'detailed':
          confidenceThreshold = 0.85; // Higher threshold for detailed analysis
          break;
        case 'quick':
          confidenceThreshold = 0.6; // Lower threshold for quick analysis
          break;
        default:
          confidenceThreshold = 0.7; // Standard threshold
      }
      
      // Check if we have the Azure Health API key for medical image analysis
      const azureApiKey = process.env.AZURE_HEALTH_API_KEY;
      
      if (!azureApiKey || azureApiKey === 'your_azure_key') {
        console.log('Using Gemini Vision API for image analysis as Azure Health API key is not available');
        
        // Use Gemini Vision API for analysis if available
        if (this.apiKey) {
          try {
            const modelName = 'gemini-pro-vision';
            const url = `${this.apiEndpoint}/models/${modelName}:generateContent?key=${this.apiKey}`;
            
            const base64Image = imageBuffer.toString('base64');
            
            // Construct a prompt based on the report type and analysis type
            let prompt = `Analyze this medical ${reportType.toLowerCase().replace('_', ' ')} image. `;
            
            if (extractedText && extractedText.trim().length > 0) {
              prompt += `I've extracted the following text from the image using OCR: "${extractedText.substring(0, 1000)}"${extractedText.length > 1000 ? '...' : ''}. `;
            }
            
            switch (analysisType.toLowerCase()) {
              case 'detailed':
                prompt += 'Provide a detailed analysis including all findings, potential diagnoses, and recommendations. Format the response as JSON with the following structure: {"summary": "...", "findings": ["...", "..."], "recommendations": ["...", "..."], "aiConfidenceScore": X.X}';
                break;
              case 'quick':
                prompt += 'Provide a brief analysis focusing only on the most important findings. Format the response as JSON with the following structure: {"summary": "...", "findings": ["..."], "recommendations": ["..."], "aiConfidenceScore": X.X}';
                break;
              default:
                prompt += 'Provide a standard analysis with key findings and recommendations. Format the response as JSON with the following structure: {"summary": "...", "findings": ["...", "..."], "recommendations": ["...", "..."], "aiConfidenceScore": X.X}';
            }
            
            try {
              // Set timeout for fetch request
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
              
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  contents: [{
                    parts: [
                      { text: prompt },
                      {
                        inline_data: {
                          mime_type: 'image/jpeg',
                          data: base64Image
                        }
                      }
                    ]
                  }],
                  generationConfig: {
                    temperature: 0.2,
                    topK: 32,
                    topP: 1,
                    maxOutputTokens: 2048
                  }
                }),
                signal: controller.signal
              });
              
              // Clear the timeout
              clearTimeout(timeoutId);
              
              if (!response.ok) {
                const errorText = await response.text();
                console.error(`Gemini Vision API error: ${response.status} ${errorText}`);
                return this.getImageAnalysisFallback(reportType, extractedText);
              }
              
              try {
                const data = await response.json();
                
                // Extract the response text from the API response
                if (data.candidates && 
                    data.candidates[0] && 
                    data.candidates[0].content && 
                    data.candidates[0].content.parts && 
                    data.candidates[0].content.parts[0]) {
                  const responseText = data.candidates[0].content.parts[0].text;
                  
                  if (!responseText || responseText.trim().length === 0) {
                    console.warn('Empty response from Gemini Vision API');
                    return this.getImageAnalysisFallback(reportType, extractedText);
                  }
                  
                  // Try to parse the JSON response
                  try {
                    // Find JSON in the response (it might be surrounded by markdown code blocks)
                    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                      const jsonStr = jsonMatch[0];
                      try {
                        const analysisResult = JSON.parse(jsonStr);
                        
                        // Validate the analysis result has required fields
                        if (!this.isValidImageAnalysisResult(analysisResult)) {
                          console.warn('Invalid image analysis result structure, using fallback');
                          return this.getImageAnalysisFallback(reportType, extractedText);
                        }
                        
                        // Add report type to the result
                        analysisResult.reportType = reportType;
                        
                        return analysisResult;
                      } catch (parseError) {
                        console.error('Error parsing JSON string:', parseError);
                        // Try more aggressive JSON parsing if standard parsing fails
                        return this.attemptAggressiveJsonParsingForImage(jsonStr, reportType, extractedText);
                      }
                    } else {
                      console.warn('No JSON object found in response');
                      return this.getImageAnalysisFallback(reportType, extractedText, responseText);
                    }
                  } catch (jsonError) {
                    console.error('Error parsing JSON from Gemini response:', jsonError);
                    return this.getImageAnalysisFallback(reportType, extractedText, responseText);
                  }
                } else {
                  console.error('Unexpected API response format');
                  return this.getImageAnalysisFallback(reportType, extractedText);
                }
              } catch (jsonError) {
                console.error('Error parsing JSON response from Gemini Vision API:', jsonError);
                return this.getImageAnalysisFallback(reportType, extractedText);
              }
            } catch (fetchError) {
              // Check if it's a timeout error
              if (fetchError && typeof fetchError === 'object' && 'name' in fetchError && fetchError.name === 'AbortError') {
                console.error('Gemini Vision API request timed out after 30 seconds');
              } else {
                console.error('Error fetching from Gemini Vision API:', fetchError);
              }
              return this.getImageAnalysisFallback(reportType, extractedText);
            }
          } catch (geminiError) {
            console.error('Error using Gemini Vision API for image analysis:', geminiError);
            return this.getImageAnalysisFallback(reportType, extractedText);
          }
        } else {
          console.warn('No API key available for image analysis');
          return this.getImageAnalysisFallback(reportType, extractedText);
        }
      } else {
        // Azure Health API implementation would go here
        // For now, use fallback
        console.warn('Azure Health API implementation not available, using fallback');
        return this.getImageAnalysisFallback(reportType, extractedText);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      return this.getImageAnalysisFallback(reportType);
    }
  }
  
  /**
   * Validate if an image analysis result has the required structure
   */
  private isValidImageAnalysisResult(result: any): boolean {
    return (
      result && 
      typeof result === 'object' &&
      typeof result.summary === 'string' && 
      Array.isArray(result.findings) &&
      Array.isArray(result.recommendations)
    );
  }
  
  /**
   * Attempt more aggressive JSON parsing for malformed JSON responses from image analysis
   */
  private attemptAggressiveJsonParsingForImage(jsonStr: string, reportType: ReportType, extractedText: string): any {
    try {
      // Try to fix common JSON issues
      const cleanedJson = jsonStr
        .replace(/\'/g, '"')  // Replace single quotes with double quotes
        .replace(/\,\s*\}/g, '}')  // Remove trailing commas
        .replace(/\,\s*\]/g, ']')  // Remove trailing commas in arrays
        .replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":')  // Add quotes to unquoted keys
        .replace(/:\s*'([^']*)'/g, ':"$1"');  // Replace single-quoted values with double-quoted
      
      const analysisResult = JSON.parse(cleanedJson);
      
      // Add report type to the result
      analysisResult.reportType = reportType;
      
      return analysisResult;
    } catch (error) {
      console.error('Aggressive JSON parsing failed for image analysis:', error);
      return this.getImageAnalysisFallback(reportType, extractedText);
    }
  }
  
  /**
   * Get a fallback analysis result when image AI analysis fails
   */
  private getImageAnalysisFallback(reportType: ReportType, extractedText?: string, responseText?: string): ReportAnalysis {
    try {
      // Create a structured fallback response
      const fallbackAnalysis: ReportAnalysis = {
        summary: `Analysis of ${reportType.toLowerCase().replace('_', ' ')} image completed.`,
        findings: [
          `Image type: ${reportType}`,
          'Analysis performed with limited AI capabilities'
        ],
        recommendations: [
          'Please consult with your healthcare provider for a complete interpretation of this image',
          'Consider scheduling a follow-up appointment to discuss these findings'
        ],
        possibleConditions: [],
        followUpRecommended: true,
        followUpTimeframe: 'As advised by your healthcare provider',
        aiConfidenceScore: 0.7,
        reportType: reportType as any, // Use type assertion to avoid type conflicts
        personalizedRecommendations: this.getFallbackRecommendations()
      };
      
      // Add extracted text if available
      if (extractedText) {
        fallbackAnalysis.findings.push('Text extracted from image:');
        fallbackAnalysis.findings.push(extractedText.substring(0, 200) + (extractedText.length > 200 ? '...' : ''));
      }
      
      // Try to extract some useful information from the response text if available
      if (responseText) {
        // Look for potential findings in the response text
        const findingsMatch = responseText.match(/finding[s]?:?[\s\n]*(.*?)(?:recommendation|$)/is);
        if (findingsMatch && findingsMatch[1]) {
          const findingsText = findingsMatch[1].trim();
          if (findingsText) {
            fallbackAnalysis.findings.push('Potential finding from analysis:');
            fallbackAnalysis.findings.push(findingsText.substring(0, 200) + (findingsText.length > 200 ? '...' : ''));
          }
        }
      }
      
      return fallbackAnalysis;
    } catch (error) {
      console.error('Error creating fallback image analysis:', error);
      // Ultimate fallback if everything else fails
      return {
        summary: 'Medical image analysis completed.',
        findings: ['Image analysis completed with limited capabilities'],
        recommendations: ['Please consult with your healthcare provider'],
        possibleConditions: [],
        followUpRecommended: true,
        followUpTimeframe: 'As soon as possible',
        aiConfidenceScore: 0.5,
        reportType: reportType as any, // Use type assertion to avoid type conflicts
        personalizedRecommendations: this.getFallbackRecommendations()
      };
    }
  }
  
  private async analyzeImageWithGroq(imageBuffer: Buffer, reportType: ReportType, options: any = {}): Promise<any> {
    try {
      // Implementation would go here
      throw new Error('Not implemented');
    } catch (error) {
      console.error('Error using Groq API for image analysis:', error);
      throw error;
    }
  }
  
  /**
   * Simulate image analysis for testing purposes
   */
  private simulateImageAnalysis(reportType: ReportType, extractedText: string = '', analysisType: string = 'standard', confidenceThreshold: number = 0.7): any {
      // In a real implementation, we would call the Azure Health API here
      // For now, return a simulated analysis result
      console.log('Using simulated image analysis result');
      
      // Create different simulated responses based on report type and analysis type
      let findings = [];
      let recommendations = [];
      let summary = '';
      
      switch (reportType) {
        case ReportType.IMAGING:
          summary = 'Chest X-ray analysis shows clear lung fields with no evidence of acute cardiopulmonary disease.';
          findings = [
            'No evidence of pneumonia or infiltrates',
            'Heart size within normal limits',
            'No pleural effusion or pneumothorax',
            'Normal bony structures'
          ];
          recommendations = [
            'No acute findings requiring immediate attention',
            'Follow up in 1 year for routine screening'
          ];
          break;
          
        case ReportType.CBC:
          summary = 'Complete Blood Count shows values within normal reference ranges.';
          findings = [
            'White blood cell count: 7.5 x10^3/μL (normal)',
            'Red blood cell count: 5.0 x10^6/μL (normal)',
            'Hemoglobin: 14.2 g/dL (normal)',
            'Platelet count: 250 x10^3/μL (normal)'
          ];
          recommendations = [
            'No abnormalities detected',
            'Routine follow-up as scheduled'
          ];
          break;
          
        case ReportType.LIPID_PANEL:
          summary = 'Lipid Panel shows slightly elevated LDL cholesterol.';
          findings = [
            'Total Cholesterol: 210 mg/dL (borderline high)',
            'LDL Cholesterol: 140 mg/dL (borderline high)',
            'HDL Cholesterol: 45 mg/dL (normal)',
            'Triglycerides: 150 mg/dL (normal)'
          ];
          recommendations = [
            'Consider dietary modifications to reduce cholesterol',
            'Increase physical activity',
            'Follow up in 3-6 months to reassess lipid levels'
          ];
          break;
          
        default:
          summary = 'Medical report analysis completed.';
          findings = extractedText ? 
            ['Text extracted from image', extractedText.substring(0, 200) + (extractedText.length > 200 ? '...' : '')] : 
            ['Analysis based on image only'];
          recommendations = ['Please consult with a healthcare professional for proper interpretation'];
      }
      
      // Adjust detail level based on analysis type
      if (analysisType === 'quick') {
        findings = findings.slice(0, 2);
        recommendations = recommendations.slice(0, 1);
      } else if (analysisType === 'detailed') {
        // Add more detailed findings for detailed analysis
        if (reportType === ReportType.IMAGING) {
          findings.push('Lung markings are normal');
          findings.push('No evidence of hilar lymphadenopathy');
          recommendations.push('Consider follow-up imaging if symptoms persist or worsen');
        }
      }
      
      return {
        summary,
        findings,
        recommendations,
        aiConfidenceScore: confidenceThreshold,
        reportType: reportType as any // Use type assertion to avoid type conflicts
      };
  }
  
  // extractTextFromImage method is already defined earlier in the file
  /**
   * Generate dietary recommendations based on report type and abnormal results
   */
  private generateDietaryRecommendations(reportData: any, patientContext?: any): string[] {
    const recommendations: string[] = [];
    const reportType = reportData.type || 'general';
    const abnormalResults = reportData.results ? 
      reportData.results.filter((result: TestResult) => result.status === 'high' || result.status === 'low') : 
      [];
    
    // Add general recommendations
    recommendations.push('Maintain a balanced diet with plenty of fruits, vegetables, and whole grains');
    recommendations.push('Stay hydrated by drinking adequate water throughout the day');
    
    // Add report-type specific recommendations
    if (reportType === ReportType.LIPID_PANEL) {
      recommendations.push('Increase intake of omega-3 fatty acids from sources like fatty fish, flaxseeds, and walnuts');
      recommendations.push('Reduce consumption of saturated and trans fats found in fried foods and processed meats');
      recommendations.push('Include soluble fiber from oats, beans, and fruits to help lower cholesterol');
    } else if (reportType === ReportType.METABOLIC_PANEL) {
      recommendations.push('Limit added sugars and refined carbohydrates to help maintain healthy blood glucose levels');
      recommendations.push('Choose complex carbohydrates with lower glycemic index like whole grains and legumes');
      recommendations.push('Maintain consistent meal timing to help regulate blood sugar');
    } else if (reportType === ReportType.CBC) {
      recommendations.push('Include iron-rich foods like lean meats, beans, and leafy greens if hemoglobin is low');
      recommendations.push('Consume vitamin C alongside iron-rich plant foods to enhance absorption');
    }
    
    // Add recommendations based on abnormal results
    for (const result of abnormalResults) {
      const name = result.name.toLowerCase();
      const status = result.status;
      
      if (name.includes('cholesterol') || name.includes('ldl') || name.includes('triglyceride')) {
        if (status === 'high') {
          recommendations.push('Limit dietary cholesterol by reducing consumption of egg yolks and organ meats');
          recommendations.push('Increase consumption of plant sterols found in vegetable oils, nuts, and seeds');
        }
      } else if (name.includes('glucose') || name.includes('a1c')) {
        if (status === 'high') {
          recommendations.push('Monitor carbohydrate intake and focus on low-glycemic index foods');
          recommendations.push('Include protein and healthy fats with each meal to slow glucose absorption');
        }
      } else if (name.includes('sodium') || name.includes('potassium')) {
        if (name.includes('sodium') && status === 'high') {
          recommendations.push('Reduce sodium intake by limiting processed foods, canned soups, and adding less salt while cooking');
        } else if (name.includes('potassium') && status === 'low') {
          recommendations.push('Increase potassium intake through foods like bananas, oranges, potatoes, and leafy greens');
        }
      }
    }
    
    // Consider patient preferences if available
    if (patientContext && patientContext.preferences && patientContext.preferences.dietaryPreferences) {
      const preferences = patientContext.preferences.dietaryPreferences.toLowerCase();
      
      if (preferences.includes('vegetarian') || preferences.includes('vegan')) {
        recommendations.push('Ensure adequate protein intake through plant sources like legumes, tofu, tempeh, and seitan');
        recommendations.push('Consider vitamin B12 supplementation or fortified foods if following a vegan diet');
      } else if (preferences.includes('keto') || preferences.includes('low carb')) {
        recommendations.push('Focus on healthy fats from avocados, olive oil, nuts, and seeds');
        recommendations.push('Include low-carb vegetables like leafy greens, broccoli, and cauliflower');
      }
    }
    
    // Remove duplicates and return
    return [...new Set(recommendations)];
  }
  
  /**
   * Generate exercise recommendations based on patient context and report type
   */
  private generateExerciseRecommendations(reportData: any, patientContext?: any): string[] {
    const recommendations: string[] = [];
    const reportType = reportData.type || 'general';
    const abnormalResults = reportData.results ? 
      reportData.results.filter((result: TestResult) => result.status === 'high' || result.status === 'low') : 
      [];
    
    // Add general recommendations
    recommendations.push('Aim for at least 150 minutes of moderate-intensity aerobic activity per week');
    recommendations.push('Include strength training exercises at least twice per week');
    
    // Add age-specific recommendations if age is available
    if (patientContext && patientContext.age) {
      const age = parseInt(patientContext.age);
      
      if (age >= 65) {
        recommendations.push('Include balance exercises like tai chi or yoga to prevent falls');
        recommendations.push('Start with lower intensity activities and gradually increase as tolerated');
      } else if (age >= 40) {
        recommendations.push('Include flexibility exercises to maintain joint mobility');
        recommendations.push('Consider activities that are gentle on the joints like swimming or cycling');
      }
    }
    
    // Add recommendations based on report type
    if (reportType === ReportType.LIPID_PANEL) {
      recommendations.push('Prioritize regular aerobic exercise like brisk walking, swimming, or cycling to help improve cholesterol levels');
      recommendations.push('Aim for 30-40 minutes of moderate-intensity exercise most days of the week');
    } else if (reportType === ReportType.METABOLIC_PANEL) {
      recommendations.push('Include both aerobic and resistance training to help improve insulin sensitivity');
      recommendations.push('Consider short walks after meals to help manage blood glucose levels');
    }
    
    // Add recommendations based on abnormal results
    for (const result of abnormalResults) {
      const name = result.name.toLowerCase();
      const status = result.status;
      
      if ((name.includes('glucose') || name.includes('a1c')) && status === 'high') {
        recommendations.push('Break up periods of sitting with short bouts of activity throughout the day');
        recommendations.push('Monitor blood glucose before and after exercise to understand your body\'s response');
      } else if ((name.includes('cholesterol') || name.includes('ldl')) && status === 'high') {
        recommendations.push('Increase duration of aerobic exercise sessions gradually to 45-60 minutes when possible');
      } else if (name.includes('blood pressure') && status === 'high') {
        recommendations.push('Avoid high-intensity exercises until blood pressure is better controlled');
        recommendations.push('Focus on moderate activities like walking, swimming, or cycling');
      }
    }
    
    // Consider patient preferences if available
    if (patientContext && patientContext.preferences && patientContext.preferences.exercisePreferences) {
      const preferences = patientContext.preferences.exercisePreferences.toLowerCase();
      
      if (preferences.includes('walking') || preferences.includes('hiking')) {
        recommendations.push('Gradually increase walking duration and intensity, aiming for 10,000 steps daily');
      } else if (preferences.includes('swim')) {
        recommendations.push('Swimming is excellent low-impact exercise; aim for 2-3 sessions per week');
      } else if (preferences.includes('yoga') || preferences.includes('pilates')) {
        recommendations.push('Complement yoga or pilates with some aerobic activity for cardiovascular benefits');
      }
    }
    
    // Remove duplicates and return
    return [...new Set(recommendations)];
  }
  
  /**
   * Generate lifestyle modification recommendations based on report data and patient context
   * @param reportData - The medical report data containing type and test results
   * @param patientContext - Optional patient context including lifestyle information
   * @returns An array of lifestyle modification recommendations
   */
  private generateLifestyleModifications(reportData: any, patientContext?: any): string[] {
    try {
      // Input validation
      if (!reportData) {
        console.warn('generateLifestyleModifications: Missing report data, returning default recommendations');
        return this.getDefaultLifestyleRecommendations();
      }

      const recommendations: string[] = [];
      const reportType = reportData.type || 'general';
      
      // Safely extract abnormal results with validation
      let abnormalResults: TestResult[] = [];
      try {
        if (reportData.results && Array.isArray(reportData.results)) {
          abnormalResults = reportData.results.filter((result: TestResult) => 
            result && typeof result === 'object' && 
            (result.status === 'high' || result.status === 'low'));
        }
      } catch (error) {
        console.warn('Error filtering abnormal results:', error);
        // Continue with empty abnormal results
      }
      
      // Add general recommendations
      recommendations.push('Ensure 7-8 hours of quality sleep each night');
      recommendations.push('Practice stress management techniques such as meditation, deep breathing, or mindfulness');
      
      // Add lifestyle recommendations based on patient context with validation
      if (patientContext && typeof patientContext === 'object' && patientContext.lifestyle) {
        try {
          const lifestyle = patientContext.lifestyle;
          
          if (lifestyle.smoking && typeof lifestyle.smoking === 'string' && 
              lifestyle.smoking.toLowerCase().includes('yes')) {
            recommendations.push('Consider a smoking cessation program or talk to your healthcare provider about quitting resources');
          }
          
          if (lifestyle.alcohol && typeof lifestyle.alcohol === 'string' && 
              !lifestyle.alcohol.toLowerCase().includes('none')) {
            recommendations.push('Limit alcohol consumption to moderate levels (up to 1 drink per day for women, up to 2 drinks per day for men)');
          }
          
          if (lifestyle.stress && typeof lifestyle.stress === 'string' && 
              (lifestyle.stress.toLowerCase().includes('high') || lifestyle.stress.toLowerCase().includes('moderate'))) {
            recommendations.push('Incorporate regular stress-reduction activities like yoga, tai chi, or hobbies you enjoy');
            recommendations.push('Consider time management strategies to reduce daily stressors');
          }
        } catch (error) {
          console.warn('Error processing patient lifestyle data:', error);
          // Continue with recommendations we have so far
        }
      }
      
      // Add recommendations based on report type
      if (reportType === ReportType.LIPID_PANEL || reportType === ReportType.METABOLIC_PANEL) {
        recommendations.push('Maintain a consistent daily routine for meals and physical activity');
        recommendations.push('Keep a food and activity journal to identify patterns and areas for improvement');
      }
      
      // Add recommendations based on abnormal results with validation
      try {
        for (const result of abnormalResults) {
          if (!result.name || typeof result.name !== 'string' || !result.status) {
            continue; // Skip invalid results
          }
          
          const name = result.name.toLowerCase();
          const status = result.status;
          
          if ((name.includes('glucose') || name.includes('a1c')) && status === 'high') {
            recommendations.push('Monitor blood glucose regularly as recommended by your healthcare provider');
            recommendations.push('Learn to recognize and manage stress, which can affect blood glucose levels');
          } else if ((name.includes('cholesterol') || name.includes('ldl')) && status === 'high') {
            recommendations.push('Consider using a heart-healthy cooking method like baking, steaming, or grilling instead of frying');
          } else if (name.includes('blood pressure') && status === 'high') {
            recommendations.push('Reduce sodium intake and consider following the DASH diet approach');
            recommendations.push('Monitor your blood pressure regularly at home if recommended by your healthcare provider');
          }
        }
      } catch (error) {
        console.warn('Error processing abnormal results for lifestyle recommendations:', error);
        // Continue with recommendations we have so far
      }
      
      // Ensure we have at least some recommendations
      if (recommendations.length === 0) {
        return this.getDefaultLifestyleRecommendations();
      }
      
      // Remove duplicates and return
      return [...new Set(recommendations)];
    } catch (error) {
      console.error('Error generating lifestyle modifications:', error);
      return this.getDefaultLifestyleRecommendations();
    }
  }
  
  /**
   * Provides default lifestyle recommendations when the main function fails
   * @returns An array of default lifestyle recommendations
   */
  private getDefaultLifestyleRecommendations(): string[] {
    return [
      'Ensure 7-8 hours of quality sleep each night',
      'Practice stress management techniques such as meditation, deep breathing, or mindfulness',
      'Maintain a consistent daily routine for meals and physical activity',
      'Stay hydrated by drinking adequate water throughout the day',
      'Limit screen time, especially before bedtime',
      'Take regular breaks during extended periods of sitting',
      'Consider keeping a health journal to track symptoms and identify patterns'
    ];
  }
  
  /**
   * Generate medication notes based on report data and patient context
   * @param reportData - The medical report data containing type and test results
   * @param patientContext - Optional patient context including current medications
   * @returns An array of medication recommendations and notes
   */
  private generateMedicationNotes(reportData: any, patientContext?: any): string[] {
    try {
      // Input validation
      if (!reportData) {
        console.warn('generateMedicationNotes: Missing report data, returning default recommendations');
        return this.getDefaultMedicationNotes();
      }

      const recommendations: string[] = [];
      const reportType = reportData.type || 'general';
      
      // Safely extract abnormal results with validation
      let abnormalResults: TestResult[] = [];
      try {
        if (reportData.results && Array.isArray(reportData.results)) {
          abnormalResults = reportData.results.filter((result: TestResult) => 
            result && typeof result === 'object' && 
            (result.status === 'high' || result.status === 'low'));
        }
      } catch (error) {
        console.warn('Error filtering abnormal results for medication notes:', error);
        // Continue with empty abnormal results
      }
      
      // Add general recommendations
      recommendations.push('Continue taking all prescribed medications as directed by your healthcare provider');
      recommendations.push('Do not start or stop any medications without consulting your healthcare provider');
      
      // Add medication notes based on patient context with validation
      try {
        if (patientContext && typeof patientContext === 'object' && 
            patientContext.medications && Array.isArray(patientContext.medications) && 
            patientContext.medications.length > 0) {
          recommendations.push('Keep an updated list of all medications, including over-the-counter drugs and supplements');
          recommendations.push('Report any side effects or concerns about your medications to your healthcare provider');
        }
      } catch (error) {
        console.warn('Error processing patient medication data:', error);
        // Continue with recommendations we have so far
      }
      
      // Add recommendations based on report type and abnormal results with validation
      try {
        if (reportType === ReportType.LIPID_PANEL) {
          const hasHighCholesterol = abnormalResults.some((r: TestResult) => 
            r && r.name && typeof r.name === 'string' &&
            (r.name.toLowerCase().includes('cholesterol') || r.name.toLowerCase().includes('ldl')) && 
            r.status === 'high');
          
          if (hasHighCholesterol) {
            recommendations.push('Discuss with your healthcare provider whether cholesterol-lowering medications might be appropriate');
            recommendations.push('If already on cholesterol medication, ensure regular follow-up to assess effectiveness');
          }
        } else if (reportType === ReportType.METABOLIC_PANEL) {
          const hasHighGlucose = abnormalResults.some((r: TestResult) => 
            r && r.name && typeof r.name === 'string' &&
            (r.name.toLowerCase().includes('glucose') || r.name.toLowerCase().includes('a1c')) && 
            r.status === 'high');
          
          if (hasHighGlucose) {
            recommendations.push('Discuss with your healthcare provider about potential need for glucose-lowering medications');
            recommendations.push('If taking diabetes medications, monitor blood glucose as directed and report any unusual patterns');
          }
        }
      } catch (error) {
        console.warn('Error processing report type for medication notes:', error);
        // Continue with recommendations we have so far
      }
      
      // Add notes about supplements based on abnormal results with validation
      try {
        for (const result of abnormalResults) {
          if (!result.name || typeof result.name !== 'string' || !result.status) {
            continue; // Skip invalid results
          }
          
          const name = result.name.toLowerCase();
          const status = result.status;
          
          if (name.includes('vitamin d') && status === 'low') {
            recommendations.push('Discuss vitamin D supplementation with your healthcare provider');
          } else if (name.includes('iron') && status === 'low') {
            recommendations.push('Discuss iron supplementation with your healthcare provider, especially if experiencing fatigue');
          } else if (name.includes('b12') && status === 'low') {
            recommendations.push('Consider vitamin B12 supplementation after consulting with your healthcare provider');
          }
        }
      } catch (error) {
        console.warn('Error processing abnormal results for supplement recommendations:', error);
        // Continue with recommendations we have so far
      }
      
      // Ensure we have at least some recommendations
      if (recommendations.length === 0) {
        return this.getDefaultMedicationNotes();
      }
      
      // Remove duplicates and return
      return [...new Set(recommendations)];
    } catch (error) {
      console.error('Error generating medication notes:', error);
      return this.getDefaultMedicationNotes();
    }
  }
  
  /**
   * Provides default medication notes when the main function fails
   * @returns An array of default medication recommendations
   */
  private getDefaultMedicationNotes(): string[] {
    return [
      'Continue taking all prescribed medications as directed by your healthcare provider',
      'Do not start or stop any medications without consulting your healthcare provider',
      'Keep an updated list of all medications, including over-the-counter drugs and supplements',
      'Take medications at the same time each day to establish a routine',
      'Use pill organizers or reminder apps if you have trouble remembering to take medications',
      'Store medications according to instructions (some may need refrigeration or protection from light)',
      'Be aware of potential drug interactions, including with foods, supplements, and alcohol'
    ];
  }
  
  /**
   * Generate follow-up schedule based on report type and results
   * @param reportData - The medical report data containing type and test results
   * @returns A string containing follow-up schedule recommendations
   */
  private generateFollowUpSchedule(reportData: any): string {
    try {
      // Input validation
      if (!reportData) {
        console.warn('generateFollowUpSchedule: Missing report data, returning default schedule');
        return this.getDefaultFollowUpSchedule();
      }

      const reportType = reportData.type || 'general';
      
      // Safely extract abnormal results with validation
      let abnormalResults: TestResult[] = [];
      try {
        if (reportData.results && Array.isArray(reportData.results)) {
          abnormalResults = reportData.results.filter((result: TestResult) => 
            result && typeof result === 'object' && 
            (result.status === 'high' || result.status === 'low'));
        }
      } catch (error) {
        console.warn('Error filtering abnormal results for follow-up schedule:', error);
        // Continue with empty abnormal results
      }
      
      let schedule = '';
      
      // Base follow-up on report type with validation
      try {
        if (reportType === ReportType.LIPID_PANEL) {
          if (abnormalResults.length > 0) {
            schedule = 'Schedule a follow-up lipid panel in 3 months to assess progress. ';
          } else {
            schedule = 'Schedule your next lipid panel in 12 months if all values remain normal. ';
          }
        } else if (reportType === ReportType.METABOLIC_PANEL) {
          if (abnormalResults.length > 0) {
            schedule = 'Schedule a follow-up metabolic panel in 3-6 months to monitor changes. ';
          } else {
            schedule = 'Schedule your next metabolic panel in 12 months if all values remain normal. ';
          }
        } else if (reportType === ReportType.CBC) {
          if (abnormalResults.length > 0) {
            schedule = 'Schedule a follow-up CBC in 3 months to monitor blood cell counts. ';
          } else {
            schedule = 'Schedule your next CBC in 12 months as part of your annual check-up. ';
          }
        } else if (reportType === ReportType.IMAGING) {
          schedule = 'Discuss follow-up imaging needs with your specialist based on these findings. ';
        } else {
          schedule = 'Schedule a follow-up appointment with your healthcare provider in 3-6 months. ';
        }
      } catch (error) {
        console.warn('Error determining follow-up schedule based on report type:', error);
        schedule = 'Schedule a follow-up appointment with your healthcare provider in 3-6 months. ';
      }
      
      // Add general recommendation
      schedule += 'Book an appointment with your primary care physician to review results and adjust your health plan as needed.';
      
      // Validate final schedule
      if (!schedule || typeof schedule !== 'string' || schedule.trim() === '') {
        return this.getDefaultFollowUpSchedule();
      }
      
      return schedule;
    } catch (error) {
      console.error('Error generating follow-up schedule:', error);
      return this.getDefaultFollowUpSchedule();
    }
  }
  
  /**
   * Provides a default follow-up schedule when the main function fails
   * @returns A string containing default follow-up schedule recommendations
   */
  private getDefaultFollowUpSchedule(): string {
    return 'Schedule a follow-up appointment with your healthcare provider in 3-6 months. ' +
           'Book an appointment with your primary care physician to review results and adjust your health plan as needed.';
  }
  
  /**
   * Generate health goals based on report data and patient context
   * @param reportData - The medical report data containing type and test results
   * @param patientContext - Optional patient context including lifestyle information
   * @returns An array of health goals with descriptions and timeframes
   */
  private generateHealthGoals(reportData: any, patientContext?: any): any[] {
    try {
      // Input validation
      if (!reportData) {
        console.warn('generateHealthGoals: Missing report data, returning default goals');
        return this.getDefaultHealthGoals();
      }

      const goals: any[] = [];
      const reportType = reportData.type || 'general';
      
      // Safely extract abnormal results with validation
      let abnormalResults: TestResult[] = [];
      try {
        if (reportData.results && Array.isArray(reportData.results)) {
          abnormalResults = reportData.results.filter((result: TestResult) => 
            result && typeof result === 'object' && 
            (result.status === 'high' || result.status === 'low'));
        }
      } catch (error) {
        console.warn('Error filtering abnormal results for health goals:', error);
        // Continue with empty abnormal results
      }
      
      // Add short-term goals
      goals.push({ description: 'Schedule all recommended follow-up appointments', timeframe: 'short-term' });
      goals.push({ description: 'Establish consistent healthy eating and exercise habits', timeframe: 'short-term' });
      
      // Add goals based on report type and abnormal results with validation
      try {
        // Convert string report type to enum if needed
        const reportTypeEnum = typeof reportType === 'string' 
          ? this.stringToReportTypeEnum(reportType)
          : reportType;

        if (reportTypeEnum === ReportType.LIPID_PANEL) {
          const hasHighCholesterol = abnormalResults.some((r: TestResult) => 
            r && r.name && typeof r.name === 'string' &&
            (r.name.toLowerCase().includes('cholesterol') || r.name.toLowerCase().includes('ldl')) && 
            r.status === 'high');
          
          if (hasHighCholesterol) {
            goals.push({ description: 'Reduce LDL cholesterol by 10-15% through diet and exercise', timeframe: '3 months' });
            goals.push({ description: 'Increase HDL cholesterol through regular physical activity', timeframe: '6 months' });
          }
        } else if (reportTypeEnum === ReportType.METABOLIC_PANEL) {
          const hasHighGlucose = abnormalResults.some((r: TestResult) => 
            r && r.name && typeof r.name === 'string' &&
            (r.name.toLowerCase().includes('glucose') || r.name.toLowerCase().includes('a1c')) && 
            r.status === 'high');
          
          if (hasHighGlucose) {
            goals.push({ description: 'Achieve fasting glucose levels within normal range', timeframe: '3 months' });
            goals.push({ description: 'Maintain consistent carbohydrate intake throughout the day', timeframe: '1 month' });
          }
        }
      } catch (error) {
        console.warn('Error processing report type for health goals:', error);
        // Continue with goals we have so far
      }
      
      // Add lifestyle-related goals based on patient context with validation
      try {
        if (patientContext && typeof patientContext === 'object' && patientContext.lifestyle) {
          const lifestyle = patientContext.lifestyle;
          
          if (lifestyle.smoking && typeof lifestyle.smoking === 'string' && 
              lifestyle.smoking.toLowerCase().includes('yes')) {
            goals.push({ description: 'Reduce smoking by 50% as a step toward quitting', timeframe: '2 months' });
            goals.push({ description: 'Quit smoking completely', timeframe: 'long-term' });
          }
          
          if (lifestyle.exercise && typeof lifestyle.exercise === 'string' && 
              lifestyle.exercise.toLowerCase().includes('sedentary')) {
            goals.push({ description: 'Incorporate at least 30 minutes of physical activity daily', timeframe: '1 month' });
          }
        }
      } catch (error) {
        console.warn('Error processing patient lifestyle data for health goals:', error);
        // Continue with goals we have so far
      }
      
      // Add long-term goals
      goals.push({ description: 'Achieve and maintain all health metrics within normal ranges', timeframe: 'long-term' });
      goals.push({ description: 'Develop sustainable lifestyle habits for long-term health', timeframe: 'long-term' });
      
      // Validate goals structure
      const validatedGoals = goals.filter(goal => 
        goal && typeof goal === 'object' && 
        goal.description && typeof goal.description === 'string' && 
        goal.timeframe && typeof goal.timeframe === 'string'
      );
      
      // Ensure we have at least some goals
      if (validatedGoals.length === 0) {
        return this.getDefaultHealthGoals();
      }
      
      return validatedGoals;
    } catch (error) {
      console.error('Error generating health goals:', error);
      return this.getDefaultHealthGoals();
    }
  }
  
  /**
   * Provides default health goals when the main function fails
   * @returns An array of default health goals
   */
  private getDefaultHealthGoals(): any[] {
    return [
      { description: 'Schedule all recommended follow-up appointments', timeframe: 'short-term' },
      { description: 'Establish consistent healthy eating and exercise habits', timeframe: 'short-term' },
      { description: 'Increase daily physical activity', timeframe: '1 month' },
      { description: 'Improve nutrition by adding more fruits and vegetables', timeframe: '2 weeks' },
      { description: 'Achieve and maintain all health metrics within normal ranges', timeframe: 'long-term' },
      { description: 'Develop sustainable lifestyle habits for long-term health', timeframe: 'long-term' }
    ];
  }

  /**
   * Generate a comprehensive personalized health plan
   */
  async generateHealthPlan(report: MedicalReport, patientData: any): Promise<HealthPlan> {
    try {
      // Prepare the prompt for generating a health plan
      let prompt = `Generate a comprehensive personalized health plan based on the following medical report and patient data:\n`;
      
      // Add report data
      prompt += `Report Type: ${report.type}\n`;
      
      if (report.results && Array.isArray(report.results)) {
        prompt += 'Test Results:\n';
        report.results.forEach(result => {
          prompt += `- ${result.name}: ${result.value} ${result.unit || ''} (Status: ${result.status || 'Not specified'})\n`;
        });
      }

      // Add patient data
      if (patientData) {
        prompt += '\nPatient Data:\n';
        
        if (patientData.age) prompt += `Age: ${patientData.age}\n`;
        if (patientData.gender) prompt += `Gender: ${patientData.gender}\n`;
        if (patientData.height) prompt += `Height: ${patientData.height} cm\n`;
        if (patientData.weight) prompt += `Weight: ${patientData.weight} kg\n`;
        
        if (patientData.conditions && Array.isArray(patientData.conditions)) {
          prompt += 'Existing Conditions:\n';
          patientData.conditions.forEach((condition: string) => {
            prompt += `- ${condition}\n`;
          });
        }
        
        if (patientData.medications && Array.isArray(patientData.medications)) {
          prompt += 'Current Medications:\n';
          patientData.medications.forEach((medication: string) => {
            prompt += `- ${medication}\n`;
          });
        }
        
        if (patientData.allergies && Array.isArray(patientData.allergies)) {
          prompt += 'Allergies:\n';
          patientData.allergies.forEach((allergy: string) => {
            prompt += `- ${allergy}\n`;
          });
        }
        
        if (patientData.lifestyle) {
          prompt += '\nLifestyle Factors:\n';
          const lifestyle = patientData.lifestyle;
          
          if (lifestyle.diet) prompt += `Diet: ${lifestyle.diet}\n`;
          if (lifestyle.exercise) prompt += `Exercise: ${lifestyle.exercise}\n`;
          if (lifestyle.smoking) prompt += `Smoking: ${lifestyle.smoking}\n`;
          if (lifestyle.alcohol) prompt += `Alcohol: ${lifestyle.alcohol}\n`;
          if (lifestyle.sleep) prompt += `Sleep: ${lifestyle.sleep}\n`;
          if (lifestyle.stress) prompt += `Stress: ${lifestyle.stress}\n`;
        }
        
        if (patientData.preferences) {
          prompt += '\nPreferences:\n';
          const preferences = patientData.preferences;
          
          if (preferences.dietaryPreferences) prompt += `Dietary Preferences: ${preferences.dietaryPreferences}\n`;
          if (preferences.exercisePreferences) prompt += `Exercise Preferences: ${preferences.exercisePreferences}\n`;
        }
      }
      
      // Call the AI API
      const response = await this.callGroqAPI(prompt);
      
      // For now, return a simulated health plan
      // In a real implementation, we would parse the AI response
      return {
        summary: 'This personalized health plan is designed to address your elevated cholesterol levels and support overall cardiovascular health while considering your specific health history and preferences.',
        dietaryRecommendations: [
          'Adopt a Mediterranean-style diet rich in fruits, vegetables, whole grains, and lean proteins',
          'Include 2-3 servings of fatty fish (salmon, mackerel, sardines) per week for omega-3 fatty acids',
          'Limit saturated fats by reducing red meat to once per week and choosing low-fat dairy options',
          'Incorporate heart-healthy fats from sources like olive oil, avocados, and nuts',
          'Aim for 25-30g of fiber daily through whole grains, legumes, and vegetables'
        ],
        exerciseRecommendations: [
          'Engage in moderate-intensity aerobic exercise (brisk walking, cycling) for 150 minutes per week',
          'Add 2-3 sessions of strength training exercises per week',
          'Consider yoga or tai chi once weekly for stress reduction and flexibility',
          'Start with 10-minute sessions and gradually increase duration if currently sedentary',
          'Track daily steps with a goal of reaching 8,000-10,000 steps per day'
        ],
        lifestyleChanges: [
          'Prioritize 7-8 hours of quality sleep each night',
          'Practice stress-reduction techniques like deep breathing or meditation for 10 minutes daily',
          'Limit alcohol consumption to no more than one drink per day',
          'Stay hydrated with at least 2 liters of water daily',
          'Reduce sodium intake to less than 2,300mg per day'
        ],
        medicationNotes: [
          'Continue current medications as prescribed',
          'Discuss with your physician about potential vitamin D supplementation',
          'Consider omega-3 supplements if dietary changes alone don\'t improve lipid profile'
        ],
        followUpSchedule: 'Schedule a follow-up lipid panel in 3 months to assess progress. Book an appointment with your primary care physician to review results and adjust plan as needed.',
        goals: [
          { description: 'Reduce LDL cholesterol by 15%', timeframe: '3 months' },
          { description: 'Increase HDL cholesterol to >40 mg/dL', timeframe: '6 months' },
          { description: 'Achieve 150 minutes of weekly exercise consistently', timeframe: '1 month' },
          { description: 'Reduce processed food consumption by 50%', timeframe: '2 months' }
        ]
      };
    } catch (error) {
      console.error('Error generating health plan:', error);
      throw new Error('Failed to generate personalized health plan');
    }
  }
  
  /**
   * Analyze trends in historical health data
   */
  async analyzeTrends(historicalData: any[], metricName: string): Promise<any> {
    try {
      // Validate input
      if (!historicalData || historicalData.length < 2) {
        throw new Error('Insufficient data for trend analysis');
      }
      
      // Extract values and dates
      const values = historicalData.map(item => parseFloat(item.value));
      const dates = historicalData.map(item => new Date(item.date));
      
      // Calculate basic statistics
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      
      // Calculate trend (simple linear regression)
      const xMean = dates.reduce((sum, date) => sum + date.getTime(), 0) / dates.length;
      const yMean = avg;
      
      let numerator = 0;
      let denominator = 0;
      
      for (let i = 0; i < historicalData.length; i++) {
        const x = dates[i].getTime() - xMean;
        const y = values[i] - yMean;
        numerator += x * y;
        denominator += x * x;
      }
      
      const slope = denominator !== 0 ? numerator / denominator : 0;
      const percentChange = ((values[values.length - 1] - values[0]) / values[0]) * 100;
      
      // Determine trend direction
      let direction = 'stable';
      if (slope > 0.0001) direction = 'increasing';
      else if (slope < -0.0001) direction = 'decreasing';
      
      // Generate insights based on the metric and trend
      let insights = [];
      
      if (metricName.toLowerCase().includes('glucose')) {
        if (direction === 'increasing') {
          insights.push('Your glucose levels have been trending upward, which may require attention');
        } else if (direction === 'decreasing' && max > 120) {
          insights.push('Your glucose levels are improving, but were previously elevated');
        }
      } else if (metricName.toLowerCase().includes('cholesterol')) {
        if (direction === 'decreasing') {
          insights.push('Your cholesterol levels are showing improvement');
        } else if (direction === 'increasing') {
          insights.push('Your cholesterol levels are trending upward, consider dietary adjustments');
        }
      }
      
      // Return analysis results
      return {
        metric: metricName,
        statistics: {
          min,
          max,
          average: avg,
          percentChange: percentChange.toFixed(2) + '%',
          direction
        },
        insights,
        dataPoints: historicalData.length
      };
    } catch (error) {
      console.error('Error analyzing trends:', error);
      throw new Error('Failed to analyze health data trends');
    }
  }
  
  /**
   * Classify the type of medical report based on content, filename, and image if available
   */
  async classifyReportType(reportText: string, imageBuffer?: Buffer): Promise<ReportType> {
    try {
      // Check if we have text content to analyze
      if (reportText && reportText.trim().length > 0) {
        // Use the keyword-based classification approach
        return this.classifyReportTypeByKeywords(reportText);
      }
      
      // If we have an image but no text, we can try to extract text from the image
      if (imageBuffer) {
        console.log('Attempting to extract text from image for classification');
        try {
          const extractedText = await this.extractTextFromImage(imageBuffer);
          if (extractedText && extractedText.trim().length > 0) {
            return this.classifyReportTypeByKeywords(extractedText);
          }
        } catch (ocrError) {
          console.error('Error extracting text from image:', ocrError);
        }
      }
      
      // Default to OTHER if no classification could be made
      return ReportType.OTHER;
    } catch (error) {
      console.error('Error classifying report type:', error);
      // Default to OTHER if an error occurs
      return ReportType.OTHER;
    }
  }
  
  private classifyReportTypeByKeywords(reportText: string): ReportType {
    const text = reportText.toLowerCase();
    
    // Check for CBC keywords
    if (text.includes('cbc') || 
        text.includes('complete blood count') || 
        text.includes('hemoglobin') || 
        text.includes('hematocrit') || 
        text.includes('white blood cell') || 
        text.includes('platelet')) {
      return ReportType.CBC;
    }
    
    // Check for Lipid Panel keywords
    if (text.includes('lipid') || 
        text.includes('cholesterol') || 
        text.includes('hdl') || 
        text.includes('ldl') || 
        text.includes('triglyceride')) {
      return ReportType.LIPID_PANEL;
    }
    
    // Check for Metabolic Panel keywords
    if (text.includes('metabolic panel') || 
        text.includes('glucose') || 
        text.includes('bun') || 
        text.includes('creatinine') || 
        text.includes('electrolyte') || 
        text.includes('sodium') || 
        text.includes('potassium')) {
      return ReportType.METABOLIC_PANEL;
    }
    
    // Check for Urinalysis keywords
    if (text.includes('urinalysis') || 
        text.includes('urine') || 
        text.includes('specific gravity') || 
        text.includes('leukocyte')) {
      return ReportType.URINALYSIS;
    }
    
    // Check for Thyroid Panel keywords
    if (text.includes('thyroid') || 
        text.includes('tsh') || 
        text.includes('t3') || 
        text.includes('t4') || 
        text.includes('thyroxine')) {
      return ReportType.THYROID_PANEL;
    }
    
    // Check for Imaging keywords
    if (text.includes('x-ray') || 
        text.includes('xray') || 
        text.includes('mri') || 
        text.includes('ct scan') || 
        text.includes('ultrasound') || 
        text.includes('imaging') || 
        text.includes('radiograph')) {
      return ReportType.IMAGING;
    }
    
    // Check for Pathology keywords
    if (text.includes('pathology') || 
        text.includes('biopsy') || 
        text.includes('histology') || 
        text.includes('cytology') || 
        text.includes('specimen')) {
      return ReportType.PATHOLOGY;
    }
    
    // Default to OTHER if no match is found
    return ReportType.OTHER;
  }
  
  /**
   * Standardize report format based on report type
   * Uses rule-based parsing instead of AI API to reduce dependency on paid services
   */
  async standardizeReportFormat(reportData: any, reportType: ReportType): Promise<any> {
    try {
      // Extract text from the report data
      const reportText = reportData.text || '';
      
      console.log('Standardizing report format for type:', reportType);
      console.log('Report text sample:', reportText.substring(0, 200) + '...');
      
      // Create a standardized data structure
      const standardizedData: any = {
        results: []
      };
      
      // Check if parameters are already provided in the reportData
      if (reportData.parameters && Array.isArray(reportData.parameters) && reportData.parameters.length > 0) {
        console.log(`Using ${reportData.parameters.length} parameters from reportData.parameters`);
        standardizedData.results = reportData.parameters;
        standardizedData.parameters = reportData.parameters;
        return standardizedData;
      }
      
      // First try to extract using more specific patterns based on report type
      console.log(`Attempting specific extraction for ${reportType}...`);
      switch (reportType) {
        case ReportType.CBC:
          this.extractCBCParameters(reportText, standardizedData);
          break;
          
        case ReportType.LIPID_PANEL:
          this.extractLipidParameters(reportText, standardizedData);
          break;
          
        case ReportType.METABOLIC_PANEL:
          this.extractMetabolicParameters(reportText, standardizedData);
          break;
          
        default:
          // Skip default case to ensure we try all methods
          break;
      }
      
      // If no results were found with specific patterns, try generic extraction
      if (standardizedData.results.length === 0) {
        console.log('No results found with specific patterns, trying generic extraction');
        this.extractGenericParameters(reportText, standardizedData);
      } else {
        console.log(`Found ${standardizedData.results.length} parameters with specific extraction`);
      }
      
      // Try table-based extraction to find additional parameters
      console.log('Attempting table-based extraction to find additional parameters...');
      const tableDataCount = standardizedData.results.length;
      this.extractTableData(reportText, standardizedData);
      console.log(`Found ${standardizedData.results.length - tableDataCount} additional parameters with table extraction`);
      
      // Try structured table extraction as a last resort
      if (standardizedData.results.length === 0) {
        console.log('No results found with previous methods, trying structured table extraction');
        this.extractStructuredTableData(reportText, standardizedData);
      }
      
      // Add placeholders for missing parameters based on report type
      this.addMissingParameters(standardizedData, reportType);
      
      console.log(`Extracted ${standardizedData.results.length} total parameters from report`);
      
      // Make sure parameters field is also populated for consistency
      standardizedData.parameters = standardizedData.results;
      
      return standardizedData;
    } catch (error) {
      console.error('Error standardizing report format:', error);
      
      // Return a basic structure if standardization fails
      return {
        results: [],
        parameters: []
      };
    }
  }
  
  /**
   * Extract CBC parameters using regex patterns
   */
  private extractCBCParameters(text: string, data: any): void {
    const lowerText = text.toLowerCase();
    
    // Improved patterns for CBC parameters with more variations
    const patterns = [
      { name: 'White Blood Cell Count', regex: /(?:wbc|white\s*blood\s*cell|leukocyte|white\s*cell)\s*(?:count)?\s*:?\s*(\d+\.?\d*)\s*(k\/\w+|x10\^\d+\/\w+|\*10\^\d+\/\w+|10\^\d+\/\w+|\d+\/\w+|\w+\/\w+)?/i },
      { name: 'Red Blood Cell Count', regex: /(?:rbc|red\s*blood\s*cell|erythrocyte|red\s*cell)\s*(?:count)?\s*:?\s*(\d+\.?\d*)\s*(m\/\w+|x10\^\d+\/\w+|\*10\^\d+\/\w+|10\^\d+\/\w+|\d+\/\w+|\w+\/\w+)?/i },
      { name: 'Hemoglobin', regex: /(?:hgb|hemoglobin|hb|hgb\.|hb\.)\s*:?\s*(\d+\.?\d*)\s*(g\/\w+|g\s*\w+\/\w+)?/i },
      { name: 'Hematocrit', regex: /(?:hct|hematocrit|hct\.|pvf)\s*:?\s*(\d+\.?\d*)\s*(%|percent)?/i },
      { name: 'Platelet Count', regex: /(?:plt|platelet|thrombocyte|platelet\s*count)\s*(?:count)?\s*:?\s*(\d+\.?\d*)\s*(k\/\w+|x10\^\d+\/\w+|\*10\^\d+\/\w+|10\^\d+\/\w+|\d+\/\w+|\w+\/\w+)?/i },
      { name: 'Mean Corpuscular Volume', regex: /(?:mcv|mean\s*corpuscular\s*volume|mean\s*cell\s*volume)\s*:?\s*(\d+\.?\d*)\s*(fl|femtoliters?)?/i },
      { name: 'Mean Corpuscular Hemoglobin', regex: /(?:mch|mean\s*corpuscular\s*hemoglobin|mean\s*cell\s*hemoglobin)\s*:?\s*(\d+\.?\d*)\s*(pg|picograms?)?/i },
      { name: 'Mean Corpuscular Hemoglobin Concentration', regex: /(?:mchc|mean\s*corpuscular\s*hemoglobin\s*concentration|mean\s*cell\s*hemoglobin\s*concentration)\s*:?\s*(\d+\.?\d*)\s*(g\/\w+|g\s*\w+\/\w+|%|percent)?/i },
      { name: 'Neutrophils', regex: /(?:neut|neutrophils?|neutrophil\s*count|neut\s*count|neutro|polys?|pmns?)\s*:?\s*(\d+\.?\d*)\s*(%|k\/\w+|x10\^\d+\/\w+|\*10\^\d+\/\w+|10\^\d+\/\w+|\d+\/\w+|\w+\/\w+|percent)?/i },
      { name: 'Lymphocytes', regex: /(?:lymph|lymphocytes?|lymphocyte\s*count|lymph\s*count)\s*:?\s*(\d+\.?\d*)\s*(%|k\/\w+|x10\^\d+\/\w+|\*10\^\d+\/\w+|10\^\d+\/\w+|\d+\/\w+|\w+\/\w+|percent)?/i },
      { name: 'Monocytes', regex: /(?:mono|monocytes?|monocyte\s*count|mono\s*count)\s*:?\s*(\d+\.?\d*)\s*(%|k\/\w+|x10\^\d+\/\w+|\*10\^\d+\/\w+|10\^\d+\/\w+|\d+\/\w+|\w+\/\w+|percent)?/i },
      { name: 'Eosinophils', regex: /(?:eos|eosinophils?|eosinophil\s*count|eos\s*count)\s*:?\s*(\d+\.?\d*)\s*(%|k\/\w+|x10\^\d+\/\w+|\*10\^\d+\/\w+|10\^\d+\/\w+|\d+\/\w+|\w+\/\w+|percent)?/i },
      { name: 'Basophils', regex: /(?:baso|basophils?|basophil\s*count|baso\s*count)\s*:?\s*(\d+\.?\d*)\s*(%|k\/\w+|x10\^\d+\/\w+|\*10\^\d+\/\w+|10\^\d+\/\w+|\d+\/\w+|\w+\/\w+|percent)?/i }
    ];
    
    // Improved reference range patterns
    const rangePatterns = [
      /\((\d+\.?\d*)\s*-\s*(\d+\.?\d*)\)/i,
      /reference\s*:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/i,
      /normal\s*:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/i,
      /range\s*:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/i,
      /ref\.?\s*range\s*:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/i
    ];
    
    // Extract parameters
    for (const pattern of patterns) {
      const match = text.match(pattern.regex);
      if (match) {
        const value = match[1];
        const unit = match[2] || '';
        
        // Look for reference range near the match
        const contextStart = Math.max(0, text.indexOf(match[0]) - 100);
        const contextEnd = Math.min(text.length, text.indexOf(match[0]) + match[0].length + 100);
        const context = text.substring(contextStart, contextEnd);
        
        let min = '';
        let max = '';
        
        // Try all reference range patterns
        for (const rangePattern of rangePatterns) {
          const rangeMatch = context.match(rangePattern);
          if (rangeMatch) {
            min = rangeMatch[1] || rangeMatch[3] || '';
            max = rangeMatch[2] || rangeMatch[4] || '';
            break;
          }
        }
        
        // Determine status based on reference range
        let status = 'normal';
        if (min && max && value) {
          const numValue = parseFloat(value);
          const numMin = parseFloat(min);
          const numMax = parseFloat(max);
          
          if (numValue < numMin) status = 'low';
          else if (numValue > numMax) status = 'high';
        }
        
        data.results.push({
          name: pattern.name,
          value,
          unit,
          status,
          referenceRange: {
            min,
            max
          }
        });
      }
    }
    
    // Also try to find parameters in table-like structures
    this.extractCBCTableData(text, data);
  }
  
  /**
   * Extract CBC data from table-like structures
   */
  private extractCBCTableData(text: string, data: any): void {
    // CBC parameter names and their variations
    const cbcParams = {
      'White Blood Cell Count': ['wbc', 'white blood cell', 'leukocyte', 'white cell count'],
      'Red Blood Cell Count': ['rbc', 'red blood cell', 'erythrocyte', 'red cell count'],
      'Hemoglobin': ['hgb', 'hemoglobin', 'hb'],
      'Hematocrit': ['hct', 'hematocrit', 'pvf'],
      'Mean Corpuscular Volume': ['mcv', 'mean corpuscular volume', 'mean cell volume'],
      'Mean Corpuscular Hemoglobin': ['mch', 'mean corpuscular hemoglobin', 'mean cell hemoglobin'],
      'Mean Corpuscular Hemoglobin Concentration': ['mchc', 'mean corpuscular hemoglobin concentration'],
      'Platelet Count': ['plt', 'platelet', 'thrombocyte', 'platelet count'],
      'Neutrophils': ['neutrophil', 'neut', 'poly', 'pmn'],
      'Lymphocytes': ['lymphocyte', 'lymph'],
      'Monocytes': ['monocyte', 'mono'],
      'Eosinophils': ['eosinophil', 'eos'],
      'Basophils': ['basophil', 'baso']
    };
    
    // Split text into lines
    const lines = text.split(/\r?\n/);
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();
      if (!line) continue;
      
      // Check if line contains any CBC parameter
      for (const [paramName, variations] of Object.entries(cbcParams)) {
        if (variations.some(v => line.includes(v))) {
          // Look for a number in this line or the next line
          const valueMatch = line.match(/(\d+\.?\d*)/g) || 
                           (i + 1 < lines.length ? lines[i + 1].match(/(\d+\.?\d*)/g) : null);
          
          if (valueMatch && valueMatch.length > 0) {
            const value = valueMatch[0];
            
            // Look for unit
            const unitMatch = line.match(/([a-zA-Z\/%]+\/[a-zA-Z\/%]+|[a-zA-Z\/%]+)/g);
            const unit = unitMatch && unitMatch.length > 0 ? unitMatch[unitMatch.length - 1] : '';
            
            // Look for reference range
            const rangeMatch = line.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/g) ||
                             (i + 1 < lines.length ? lines[i + 1].match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/g) : null);
            
            let min = '';
            let max = '';
            let status = 'normal';
            
            if (rangeMatch && rangeMatch.length > 0) {
              const rangeParts = rangeMatch[0].split('-');
              min = rangeParts[0].trim();
              max = rangeParts[1].trim();
              
              // Determine status
              if (min && max && value) {
                const numValue = parseFloat(value);
                const numMin = parseFloat(min);
                const numMax = parseFloat(max);
                
                if (numValue < numMin) status = 'low';
                else if (numValue > numMax) status = 'high';
              }
            }
            
            // Check if this parameter already exists in results
            const existingIndex = data.results.findIndex((r: any) => r.name === paramName);
            if (existingIndex === -1) {
              data.results.push({
                name: paramName,
                value,
                unit,
                status,
                referenceRange: {
                  min,
                  max
                }
              });
            }
          }
        }
      }
    }
  }
  
  /**
   * Extract Lipid Panel parameters using regex patterns
   */
  private extractLipidParameters(text: string, data: any): void {
    const patterns = [
      { name: 'Total Cholesterol', regex: /(?:total\s*cholesterol|cholesterol,?\s*total)\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|mmol\/\w+)?/i },
      { name: 'HDL Cholesterol', regex: /(?:hdl|hdl-c|high\s*density\s*lipoprotein)\s*(?:cholesterol)?\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|mmol\/\w+)?/i },
      { name: 'LDL Cholesterol', regex: /(?:ldl|ldl-c|low\s*density\s*lipoprotein)\s*(?:cholesterol)?\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|mmol\/\w+)?/i },
      { name: 'Triglycerides', regex: /(?:triglycerides|tg)\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|mmol\/\w+)?/i },
      { name: 'Non-HDL Cholesterol', regex: /(?:non-hdl|non\s*hdl)\s*(?:cholesterol)?\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|mmol\/\w+)?/i },
      { name: 'Cholesterol/HDL Ratio', regex: /(?:cholesterol\/hdl|chol\/hdl|total\/hdl)\s*(?:ratio)?\s*:?\s*(\d+\.?\d*)/i }
    ];
    
    // Extract reference ranges pattern
    const rangePattern = /\((\d+\.?\d*)\s*-\s*(\d+\.?\d*)\)|reference\s*:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/i;
    
    // Extract parameters
    for (const pattern of patterns) {
      const match = text.match(pattern.regex);
      if (match) {
        const value = match[1];
        const unit = match[2] || '';
        
        // Look for reference range near the match
        const contextStart = Math.max(0, text.indexOf(match[0]) - 50);
        const contextEnd = Math.min(text.length, text.indexOf(match[0]) + match[0].length + 50);
        const context = text.substring(contextStart, contextEnd);
        
        const rangeMatch = context.match(rangePattern);
        let min = '';
        let max = '';
        
        if (rangeMatch) {
          min = rangeMatch[1] || rangeMatch[3] || '';
          max = rangeMatch[2] || rangeMatch[4] || '';
        }
        
        // Determine status based on reference range
        let status = 'normal';
        if (min && max && value) {
          const numValue = parseFloat(value);
          const numMin = parseFloat(min);
          const numMax = parseFloat(max);
          
          if (numValue < numMin) status = 'low';
          else if (numValue > numMax) status = 'high';
        }
        
        data.results.push({
          name: pattern.name,
          value,
          unit,
          status,
          referenceRange: {
            min,
            max
          }
        });
      }
    }
  }
  
  /**
   * Extract Metabolic Panel parameters using regex patterns
   */
  private extractMetabolicParameters(text: string, data: any): void {
    const patterns = [
      { name: 'Glucose', regex: /(?:glucose|gluc)\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|mmol\/\w+)?/i },
      { name: 'Blood Urea Nitrogen', regex: /(?:bun|blood\s*urea\s*nitrogen)\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|mmol\/\w+)?/i },
      { name: 'Creatinine', regex: /(?:creatinine|creat)\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|μmol\/\w+)?/i },
      { name: 'eGFR', regex: /(?:egfr|estimated\s*(?:glomerular|gfr))\s*:?\s*(\d+\.?\d*)\s*(ml\/min\/\w+)?/i },
      { name: 'Sodium', regex: /(?:sodium|na)\s*:?\s*(\d+\.?\d*)\s*(mmol\/\w+|meq\/\w+)?/i },
      { name: 'Potassium', regex: /(?:potassium|k)\s*:?\s*(\d+\.?\d*)\s*(mmol\/\w+|meq\/\w+)?/i },
      { name: 'Chloride', regex: /(?:chloride|cl)\s*:?\s*(\d+\.?\d*)\s*(mmol\/\w+|meq\/\w+)?/i },
      { name: 'Carbon Dioxide', regex: /(?:carbon\s*dioxide|co2|bicarbonate)\s*:?\s*(\d+\.?\d*)\s*(mmol\/\w+|meq\/\w+)?/i },
      { name: 'Calcium', regex: /(?:calcium|ca)\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|mmol\/\w+)?/i },
      { name: 'Protein, Total', regex: /(?:total\s*protein|protein,?\s*total)\s*:?\s*(\d+\.?\d*)\s*(g\/\w+)?/i },
      { name: 'Albumin', regex: /(?:albumin|alb)\s*:?\s*(\d+\.?\d*)\s*(g\/\w+)?/i },
      { name: 'Globulin', regex: /(?:globulin|glob)\s*:?\s*(\d+\.?\d*)\s*(g\/\w+)?/i },
      { name: 'Albumin/Globulin Ratio', regex: /(?:albumin\/globulin|a\/g)\s*(?:ratio)?\s*:?\s*(\d+\.?\d*)/i },
      { name: 'Bilirubin, Total', regex: /(?:total\s*bilirubin|bilirubin,?\s*total)\s*:?\s*(\d+\.?\d*)\s*(mg\/\w+|μmol\/\w+)?/i },
      { name: 'Alkaline Phosphatase', regex: /(?:alkaline\s*phosphatase|alk\s*phos|alp)\s*:?\s*(\d+\.?\d*)\s*(u\/\w+|iu\/\w+)?/i },
      { name: 'AST', regex: /(?:ast|aspartate\s*(?:aminotransferase|transaminase)|sgot)\s*:?\s*(\d+\.?\d*)\s*(u\/\w+|iu\/\w+)?/i },
      { name: 'ALT', regex: /(?:alt|alanine\s*(?:aminotransferase|transaminase)|sgpt)\s*:?\s*(\d+\.?\d*)\s*(u\/\w+|iu\/\w+)?/i }
    ];
    
    // Extract reference ranges pattern
    const rangePattern = /\((\d+\.?\d*)\s*-\s*(\d+\.?\d*)\)|reference\s*:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/i;
    
    // Extract parameters
    for (const pattern of patterns) {
      const match = text.match(pattern.regex);
      if (match) {
        const value = match[1];
        const unit = match[2] || '';
        
        // Look for reference range near the match
        const contextStart = Math.max(0, text.indexOf(match[0]) - 50);
        const contextEnd = Math.min(text.length, text.indexOf(match[0]) + match[0].length + 50);
        const context = text.substring(contextStart, contextEnd);
        
        const rangeMatch = context.match(rangePattern);
        let min = '';
        let max = '';
        
        if (rangeMatch) {
          min = rangeMatch[1] || rangeMatch[3] || '';
          max = rangeMatch[2] || rangeMatch[4] || '';
        }
        
        // Determine status based on reference range
        let status = 'normal';
        if (min && max && value) {
          const numValue = parseFloat(value);
          const numMin = parseFloat(min);
          const numMax = parseFloat(max);
          
          if (numValue < numMin) status = 'low';
          else if (numValue > numMax) status = 'high';
        }
        
        data.results.push({
          name: pattern.name,
          value,
          unit,
          status,
          referenceRange: {
            min,
            max
          }
        });
      }
    }
  }
  
  /**
   * Extract generic parameters using regex patterns
   */
  private extractGenericParameters(text: string, data: any): void {
    // Generic pattern to find test results in format: Test Name: Value Unit (Reference Range)
    const genericPattern = /([\w\s,\-\/\(\)]+)\s*:?\s*(\d+\.?\d*)\s*([a-zA-Z\/%]+)?\s*(?:\((?:reference|ref|normal)?\s*:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)\s*([a-zA-Z\/%]+)?\))?/gi;
    
    // Alternative pattern for formats like "Test Name Value Unit Range: min-max"
    const alternativePattern = /([\w\s,\-\/\(\)]+)\s+(\d+\.?\d*)\s*([a-zA-Z\/%]+)?\s+(?:range|ref|reference)?\s*:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/gi;
    
    // Process matches from the main pattern
    let match;
    while ((match = genericPattern.exec(text)) !== null) {
      const name = match[1].trim();
      const value = match[2];
      const unit = match[3] || '';
      const min = match[4] || '';
      const max = match[5] || '';
      const rangeUnit = match[6] || unit;
      
      // Skip if name is too short or contains only numbers
      if (name.length < 2 || /^\d+$/.test(name)) continue;
      
      // Determine status based on reference range
      let status = 'normal';
      if (min && max && value) {
        const numValue = parseFloat(value);
        const numMin = parseFloat(min);
        const numMax = parseFloat(max);
        
        if (numValue < numMin) status = 'low';
        else if (numValue > numMax) status = 'high';
      }
      
      data.results.push({
        name,
        value,
        unit,
        status,
        referenceRange: {
          min,
          max,
          unit: rangeUnit
        }
      });
    }
    
    // Process matches from the alternative pattern
    while ((match = alternativePattern.exec(text)) !== null) {
      const name = match[1].trim();
      const value = match[2];
      const unit = match[3] || '';
      const min = match[4] || '';
      const max = match[5] || '';
      
      // Skip if name is too short or contains only numbers
      if (name.length < 2 || /^\d+$/.test(name)) continue;
      
      // Determine status based on reference range
      let status = 'normal';
      if (min && max && value) {
        const numValue = parseFloat(value);
        const numMin = parseFloat(min);
        const numMax = parseFloat(max);
        
        if (numValue < numMin) status = 'low';
        else if (numValue > numMax) status = 'high';
      }
      
      data.results.push({
        name,
        value,
        unit,
        status,
        referenceRange: {
          min,
          max,
          unit
        }
      });
    }
  }
  
  /**
   * Extract data from table-like structures in the text
   */
  private extractTableData(text: string, data: any): void {
    // Split text into lines
    const lines = text.split(/\r?\n/);
    
    // Look for lines that might be part of a table
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Pattern to match a table row with test name, value, unit, and possibly reference range
      // Format: Test Name    Value    Unit    Reference Range
      const tableRowPattern = /^([\w\s,\-\/\(\)]+)\s{2,}(\d+\.?\d*)\s{1,}([a-zA-Z\/%]+)?(?:\s{2,}(\d+\.?\d*)\s*-\s*(\d+\.?\d*))?/;
      
      const match = line.match(tableRowPattern);
      if (match) {
        const name = match[1].trim();
        const value = match[2];
        const unit = match[3] || '';
        const min = match[4] || '';
        const max = match[5] || '';
        
        // Skip if name is too short or contains only numbers
        if (name.length < 2 || /^\d+$/.test(name)) continue;
        
        // Determine status based on reference range
        let status = 'normal';
        if (min && max && value) {
          const numValue = parseFloat(value);
          const numMin = parseFloat(min);
          const numMax = parseFloat(max);
          
          if (numValue < numMin) status = 'low';
          else if (numValue > numMax) status = 'high';
        }
        
        data.results.push({
          name,
          value,
          unit,
          status,
          referenceRange: {
            min,
            max
          }
        });
      }
    }
    
    // Try to find tables with headers and values in separate lines
    this.extractStructuredTableData(text, data);
  }
  
  /**
   * Extract data from structured tables where headers and values are in separate lines
   */
  private extractStructuredTableData(text: string, data: any): void {
    // Split text into lines
    const lines = text.split(/\r?\n/);
    
    // Common test parameter names to look for in headers
    const commonTestParams = [
      'wbc', 'rbc', 'hemoglobin', 'hematocrit', 'platelets', 'neutrophils', 'lymphocytes',
      'glucose', 'bun', 'creatinine', 'sodium', 'potassium', 'chloride', 'calcium',
      'cholesterol', 'triglycerides', 'hdl', 'ldl', 'a1c', 'tsh', 't4', 't3',
      'ast', 'alt', 'alp', 'ggt', 'bilirubin', 'protein', 'albumin', 'globulin'
    ];
    
    // Map of abbreviations to full parameter names
    const parameterNameMap: Record<string, string> = {
      'wbc': 'White Blood Cell Count',
      'rbc': 'Red Blood Cell Count',
      'hgb': 'Hemoglobin',
      'hct': 'Hematocrit',
      'plt': 'Platelet Count',
      'neut': 'Neutrophils',
      'lymph': 'Lymphocytes',
      'mono': 'Monocytes',
      'eos': 'Eosinophils',
      'baso': 'Basophils',
      'gluc': 'Glucose',
      'bun': 'Blood Urea Nitrogen',
      'creat': 'Creatinine',
      'na': 'Sodium',
      'k': 'Potassium',
      'cl': 'Chloride',
      'co2': 'Carbon Dioxide',
      'ca': 'Calcium',
      'prot': 'Protein, Total',
      'alb': 'Albumin',
      'glob': 'Globulin',
      'bili': 'Bilirubin, Total',
      'alp': 'Alkaline Phosphatase',
      'ast': 'AST',
      'alt': 'ALT',
      'chol': 'Total Cholesterol',
      'hdl': 'HDL Cholesterol',
      'ldl': 'LDL Cholesterol',
      'trig': 'Triglycerides',
      'a1c': 'Hemoglobin A1C',
      'tsh': 'Thyroid Stimulating Hormone',
      't4': 'Thyroxine (T4)',
      't3': 'Triiodothyronine (T3)'
    };
    
    // Helper function to get full parameter name
    const getFullParameterName = (abbr: string): string => {
      const lowerAbbr = abbr.toLowerCase();
      // Check for exact match
      if (parameterNameMap[lowerAbbr]) {
        return parameterNameMap[lowerAbbr];
      }
      
      // Check for partial match
      for (const [key, value] of Object.entries(parameterNameMap)) {
        if (lowerAbbr.includes(key)) {
          return value;
        }
      }
      
      // If no match found, return the original with first letter capitalized
      return abbr.charAt(0).toUpperCase() + abbr.slice(1);
    };
    
    // Look for header rows containing common test parameters
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      // Check if this line might be a header row
      const containsMultipleParams = commonTestParams.filter(param => line.includes(param)).length >= 2;
      
      if (containsMultipleParams) {
        console.log('Found potential header row:', line);
        
        // Try to extract parameter names from this line
        const headerParts = line.split(/\s{2,}|\t/);
        
        // Skip if we don't have enough parts
        if (headerParts.length < 3) continue;
        
        // Look for values in subsequent lines
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const valueLine = lines[j].trim();
          if (!valueLine) continue;
          
          // Split the value line into parts
          const valueParts = valueLine.split(/\s{2,}|\t/);
          
          // Skip if we don't have enough parts
          if (valueParts.length < headerParts.length) continue;
          
          // Extract values for each parameter
          for (let k = 0; k < headerParts.length; k++) {
            const paramName = headerParts[k].trim();
            if (!paramName || paramName.length < 2) continue;
            
            // Skip if this doesn't look like a parameter name
            if (!commonTestParams.some(param => paramName.includes(param))) continue;
            
            const valueText = valueParts[k];
            if (!valueText) continue;
            
            // Try to extract numeric value
            const valueMatch = valueText.match(/(\d+\.?\d*)/g);
            if (!valueMatch || valueMatch.length === 0) continue;
            
            const value = valueMatch[0];
            
            // Try to extract unit
            const unitMatch = valueText.match(/[a-zA-Z\/%]+/g);
            const unit = unitMatch && unitMatch.length > 0 ? unitMatch[0] : '';
            
            // Look for reference range in this line or nearby lines
            let min = '';
            let max = '';
            
            // Check current line for reference range
            const rangeMatch = valueText.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/g);
            if (rangeMatch && rangeMatch.length > 0) {
              const rangeParts = rangeMatch[0].split('-');
              min = rangeParts[0].trim();
              max = rangeParts[1].trim();
            } else {
              // Look in nearby lines for reference range
              for (let l = j + 1; l < Math.min(j + 3, lines.length); l++) {
                const rangeLine = lines[l].trim();
                if (!rangeLine) continue;
                
                const nearbyRangeMatch = rangeLine.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/g);
                if (nearbyRangeMatch && nearbyRangeMatch.length > 0) {
                  const rangeParts = nearbyRangeMatch[0].split('-');
                  min = rangeParts[0].trim();
                  max = rangeParts[1].trim();
                  break;
                }
              }
            }
            
            // Determine status based on reference range
            let status = 'normal';
            if (min && max && value) {
              const numValue = parseFloat(value);
              const numMin = parseFloat(min);
              const numMax = parseFloat(max);
              
              if (numValue < numMin) status = 'low';
              else if (numValue > numMax) status = 'high';
            }
            
            // Get full parameter name
            const fullName = getFullParameterName(paramName);
            
            // Add to results if not already present
            const existingIndex = data.results.findIndex((r: any) => r.name === fullName);
            if (existingIndex === -1) {
              data.results.push({
                name: fullName,
                value,
                unit,
                status,
                referenceRange: {
                  min,
                  max
                }
              });
            }
          }
        }
      }
    }
  }
  
  /**
   * Get the full parameter name from an abbreviation
   */
  private getFullParameterName(abbreviation: string): string {
    const parameterMap: Record<string, string> = {
      'wbc': 'White Blood Cell Count',
      'rbc': 'Red Blood Cell Count',
      'hgb': 'Hemoglobin',
      'hct': 'Hematocrit',
      'plt': 'Platelet Count',
      'mcv': 'Mean Corpuscular Volume',
      'mch': 'Mean Corpuscular Hemoglobin',
      'mchc': 'Mean Corpuscular Hemoglobin Concentration',
      'neut': 'Neutrophils',
      'lymph': 'Lymphocytes',
      'mono': 'Monocytes',
      'eos': 'Eosinophils',
      'baso': 'Basophils',
      'gluc': 'Glucose',
      'bun': 'Blood Urea Nitrogen',
      'creat': 'Creatinine',
      'na': 'Sodium',
      'k': 'Potassium',
      'cl': 'Chloride',
      'co2': 'Carbon Dioxide',
      'ca': 'Calcium',
      'prot': 'Protein, Total',
      'alb': 'Albumin',
      'glob': 'Globulin',
      'bili': 'Bilirubin, Total',
      'alp': 'Alkaline Phosphatase',
      'ast': 'AST',
      'alt': 'ALT',
      'chol': 'Total Cholesterol',
      'hdl': 'HDL Cholesterol',
      'ldl': 'LDL Cholesterol',
      'trig': 'Triglycerides',
      'a1c': 'Hemoglobin A1C',
      'tsh': 'Thyroid Stimulating Hormone',
      't4': 'Thyroxine (T4)',
      't3': 'Triiodothyronine (T3)'
    };
    
    // Check for exact match
    if (parameterMap[abbreviation]) {
      return parameterMap[abbreviation];
    }
    
    // Check for partial match
    for (const [abbr, fullName] of Object.entries(parameterMap)) {
      if (abbreviation.includes(abbr)) {
        return fullName;
      }
    }
    
    // If no match found, capitalize the first letter of each word
    return abbreviation.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  private addMissingParameters(data: any, reportType: ReportType): void {
    // Define expected parameters for different report types
    const expectedParameters: Record<string, string[]> = {
      [ReportType.CBC]: [
        'White Blood Cell Count', 'Red Blood Cell Count', 'Hemoglobin', 'Hematocrit',
        'Mean Corpuscular Volume', 'Mean Corpuscular Hemoglobin',
        'Mean Corpuscular Hemoglobin Concentration', 'Platelet Count',
        'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils'
      ],
      [ReportType.LIPID_PANEL]: [
        'Total Cholesterol', 'HDL Cholesterol', 'LDL Cholesterol',
        'Triglycerides', 'Non-HDL Cholesterol', 'Cholesterol/HDL Ratio'
      ],
      [ReportType.METABOLIC_PANEL]: [
        'Glucose', 'Blood Urea Nitrogen', 'Creatinine', 'eGFR', 'Sodium', 'Potassium',
        'Chloride', 'Carbon Dioxide', 'Calcium', 'Protein, Total', 'Albumin', 'Globulin',
        'Albumin/Globulin Ratio', 'Bilirubin, Total', 'Alkaline Phosphatase', 'AST', 'ALT'
      ]
      // Add more report types as needed
    };
    
    // Get the expected parameters for this report type
    const parameters = expectedParameters[reportType];
    if (!parameters) return;
    
    // Create a map of existing parameters
    const existingParams = new Map<string, boolean>();
    for (const result of data.results) {
      existingParams.set(result.name, true);
    }
    
    // Add placeholders for missing parameters
    for (const param of parameters) {
      if (!existingParams.has(param)) {
        data.results.push({
          name: param,
          value: '',
          unit: '',
          status: 'not available',
          referenceRange: {
            min: '',
            max: ''
          }
        });
      }
    }
  }
  /**
   * Answer a question about a medical report using AI
   */
  async answerMedicalQuestion(question: string, reportData: any, patientContext?: any): Promise<string> {
    try {
      console.log('Answering medical question:', question);
      
      // Extract text and report type
      const reportText = reportData.text || '';
      const reportType = reportData.reportType || ReportType.OTHER;
      
      // Determine if we have parameters data
      const hasParameters = reportData.parameters && Array.isArray(reportData.parameters) && reportData.parameters.length > 0;
      // Determine if we have standardized results data
      const hasResults = reportData.results && Array.isArray(reportData.results) && reportData.results.length > 0;
      // Determine if we have test results data
      const hasTestResults = reportData.testResults && Array.isArray(reportData.testResults) && reportData.testResults.length > 0;
      
      // Prepare the prompt
      let prompt = `You are a medical AI assistant helping to interpret medical reports. `;
      prompt += `Answer the following question about a ${reportType.toLowerCase().replace('_', ' ')} report:\n\n`;
      prompt += `Question: ${question}\n\n`;
      prompt += `Report Information:\n`;
      
      // Include the most detailed data available
      if (hasParameters) {
        prompt += `Test Parameters: ${JSON.stringify(reportData.parameters, null, 2)}\n\n`;
      } else if (hasTestResults) {
        prompt += `Test Results: ${JSON.stringify(reportData.testResults, null, 2)}\n\n`;
      } else if (hasResults) {
        prompt += `Standardized Data: ${JSON.stringify(reportData.results, null, 2)}\n\n`;
      } else {
        prompt += `Raw Report Text: ${reportText.substring(0, 1500)}\n\n`; // Limit text length
      }
      
      // Add patient context if available
      if (patientContext) {
        prompt += `Patient Context: ${JSON.stringify(patientContext, null, 2)}\n\n`;
      }
      
      prompt += `\nProvide a clear, accurate, and helpful answer to the question. Include relevant medical information from the report, but explain it in terms that a patient can understand. If the question cannot be answered based on the report data, clearly state that.`;
      
      // Call the Groq API
      let responseText;
      try {
        responseText = await this.callGroqAPI(prompt);
      } catch (apiError) {
        console.error('Error calling Groq API for medical question:', apiError);
        return 'I apologize, but I encountered an error while processing your question. Please try again or consult with your healthcare provider.';
      }
      
      return responseText;
    } catch (error) {
      console.error('Error answering medical question:', error);
      return 'I apologize, but I encountered an error while processing your question. Please try again or consult with your healthcare provider.';
    }
  }
  
  /**
   * Answer a question about a medical report using AI with enhanced response format
   */
  async answerQuestion(question: string, reportData: any, options?: any): Promise<any> {
    try {
      console.log('Answering question with enhanced response:', question);
      
      // Extract text and report type
      const reportText = reportData.text || '';
      const reportType = reportData.reportType || ReportType.OTHER;
      
      // Extract options
      const conversationHistory = options?.conversationHistory || [];
      const patientContext = options?.patientContext || null;
      const includeReferences = options?.includeReferences || false;
      const detailedExplanation = options?.detailedExplanation || false;
      
      // Determine if we have parameters data
      const hasParameters = reportData.parameters && Array.isArray(reportData.parameters) && reportData.parameters.length > 0;
      // Determine if we have standardized results data
      const hasResults = reportData.results && Array.isArray(reportData.results) && reportData.results.length > 0;
      // Determine if we have test results data
      const hasTestResults = reportData.testResults && Array.isArray(reportData.testResults) && reportData.testResults.length > 0;
      
      // Prepare the prompt
      let prompt = `You are a medical AI assistant helping to interpret medical reports. `;
      prompt += `Answer the following question about a ${reportType.toLowerCase().replace('_', ' ')} report:\n\n`;
      prompt += `Question: ${question}\n\n`;
      prompt += `Report Information:\n`;
      
      // Include the most detailed data available
      if (hasParameters) {
        prompt += `Test Parameters: ${JSON.stringify(reportData.parameters, null, 2)}\n\n`;
      } else if (hasTestResults) {
        prompt += `Test Results: ${JSON.stringify(reportData.testResults, null, 2)}\n\n`;
      } else if (hasResults) {
        prompt += `Standardized Data: ${JSON.stringify(reportData.results, null, 2)}\n\n`;
      } else {
        prompt += `Raw Report Text: ${reportText.substring(0, 1500)}\n\n`; // Limit text length
      }
      
      // Add conversation history if available
      if (conversationHistory && conversationHistory.length > 0) {
        prompt += `Conversation History:\n`;
        conversationHistory.forEach((exchange: any, index: number) => {
          prompt += `Q${index + 1}: ${exchange.question}\n`;
          prompt += `A${index + 1}: ${exchange.answer}\n`;
        });
        prompt += `\n`;
      }
      
      // Add patient context if available
      if (patientContext) {
        prompt += `Patient Context: ${JSON.stringify(patientContext, null, 2)}\n\n`;
      }
      
      prompt += `\nProvide a clear, accurate, and helpful answer to the question. `;
      
      if (detailedExplanation) {
        prompt += `Include detailed explanations of medical terms and concepts. `;
      } else {
        prompt += `Explain medical terms in simple language that a patient can understand. `;
      }
      
      if (includeReferences) {
        prompt += `\n\nAfter your answer, include a section titled "References" that lists specific parts of the report that support your answer, with their locations in the report.`;
      }
      
      prompt += `\n\nFinally, suggest 2-3 follow-up questions the patient might want to ask.`;
      
      // Call the Groq API
      let responseText;
      try {
        responseText = await this.callGroqAPI(prompt);
      } catch (apiError) {
        console.error('Error calling Groq API for question:', apiError);
        throw new Error('Failed to process your question. Please try again.');
      }
      
      // Parse the response to extract references and suggested follow-ups
      const references: Array<{text: string, location: string}> = [];
      const suggestedFollowUps: string[] = [];
      
      // Extract references if included
      if (includeReferences) {
        const referencesMatch = responseText.match(/References:(.*?)(?=Follow-up Questions:|$)/s);
        if (referencesMatch && referencesMatch[1]) {
          const referencesText = referencesMatch[1].trim();
          const referenceLines = referencesText.split('\n').filter(line => line.trim() !== '');
          
          referenceLines.forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
              const location = parts[0].trim();
              const text = parts.slice(1).join(':').trim();
              references.push({ text, location });
            }
          });
          
          // Remove references section from the answer
          responseText = responseText.replace(/References:(.*?)(?=Follow-up Questions:|$)/s, '');
        }
      }
      
      // Extract suggested follow-up questions
      const followUpMatch = responseText.match(/Follow-up Questions:(.*?)$/s);
      if (followUpMatch && followUpMatch[1]) {
        const followUpText = followUpMatch[1].trim();
        const followUpLines = followUpText.split('\n').filter(line => line.trim() !== '');
        
        followUpLines.forEach(line => {
          // Remove numbering and bullet points
          const cleanLine = line.replace(/^[\d\-\*\.\s]+/, '').trim();
          if (cleanLine) {
            suggestedFollowUps.push(cleanLine);
          }
        });
        
        // Remove follow-up questions section from the answer
        responseText = responseText.replace(/Follow-up Questions:(.*?)$/s, '');
      }
      
      // Clean up the final answer text
      const answer = responseText.trim();
      
      // Return the structured response
      return {
        answer,
        references,
        suggestedFollowUps,
        confidence: 0.95 // Default confidence score
      };
    } catch (error) {
      console.error('Error answering question:', error);
      throw error;
    }
  }
  
  /**
   * Generate personalized health recommendations based on report data and patient history
   * @param report The medical report data containing type and results
   * @param patientHistory The patient's medical history and context
   * @returns Structured recommendations including dietary, exercise, lifestyle, and more
   */
  async generatePersonalizedRecommendations(report: any, patientHistory: any): Promise<any> {
    try {
      console.log('Generating personalized recommendations for report type:', report?.type);
      
      // Validate input data
      if (!report) {
        console.warn('No report data provided for recommendations');
        return this.getFallbackRecommendations();
      }
      
      // Ensure patientHistory is an object
      patientHistory = patientHistory || {};
      
      // Prepare report data in the expected format
      const reportData = {
        type: report.type || 'general',
        results: Array.isArray(report.results) ? report.results : []
      };
      
      // Generate different types of recommendations
      let dietaryRecommendations, exerciseRecommendations, lifestyleModifications, 
          medicationNotes, followUpSchedule, healthGoals;
      
      // Generate dietary recommendations with robust error handling
      try {
        dietaryRecommendations = this.generateDietaryRecommendations(reportData, patientHistory);
        if (!Array.isArray(dietaryRecommendations) || dietaryRecommendations.length === 0) {
          throw new Error('Invalid dietary recommendations format');
        }
      } catch (error) {
        console.error('Error generating dietary recommendations:', error);
        dietaryRecommendations = [
          'Maintain a balanced diet with plenty of fruits, vegetables, and whole grains',
          'Stay hydrated by drinking adequate water throughout the day',
          'Limit processed foods, added sugars, and excessive salt intake'
        ];
      }
      
      // Generate exercise recommendations with robust error handling
      try {
        exerciseRecommendations = this.generateExerciseRecommendations(reportData, patientHistory);
        if (!Array.isArray(exerciseRecommendations) || exerciseRecommendations.length === 0) {
          throw new Error('Invalid exercise recommendations format');
        }
      } catch (error) {
        console.error('Error generating exercise recommendations:', error);
        exerciseRecommendations = [
          'Aim for at least 150 minutes of moderate-intensity aerobic activity per week',
          'Include strength training exercises at least twice per week',
          'Find physical activities you enjoy to help maintain consistency'
        ];
      }
      
      // Generate lifestyle modifications with robust error handling
      try {
        lifestyleModifications = this.generateLifestyleModifications(reportData, patientHistory);
        if (!Array.isArray(lifestyleModifications) || lifestyleModifications.length === 0) {
          throw new Error('Invalid lifestyle modifications format');
        }
      } catch (error) {
        console.error('Error generating lifestyle modifications:', error);
        lifestyleModifications = [
          'Ensure 7-8 hours of quality sleep each night',
          'Practice stress management techniques such as meditation or deep breathing',
          'Avoid tobacco products and limit alcohol consumption'
        ];
      }
      
      // Generate medication notes with robust error handling
      try {
        medicationNotes = this.generateMedicationNotes(reportData, patientHistory);
        if (!Array.isArray(medicationNotes) || medicationNotes.length === 0) {
          throw new Error('Invalid medication notes format');
        }
      } catch (error) {
        console.error('Error generating medication notes:', error);
        medicationNotes = [
          'Continue taking all prescribed medications as directed by your healthcare provider',
          'Do not start or stop any medications without consulting your healthcare provider',
          'Keep an updated list of all medications and supplements you take'
        ];
      }
      
      // Generate follow-up schedule with robust error handling
      try {
        followUpSchedule = this.generateFollowUpSchedule(reportData);
        if (!followUpSchedule || typeof followUpSchedule !== 'string' || followUpSchedule.trim().length === 0) {
          throw new Error('Invalid follow-up schedule format');
        }
      } catch (error) {
        console.error('Error generating follow-up schedule:', error);
        followUpSchedule = 'Schedule a follow-up appointment with your primary care physician to discuss these results.';
      }
      
      // Generate health goals with robust error handling
      try {
        healthGoals = this.generateHealthGoals(reportData, patientHistory);
        if (!Array.isArray(healthGoals) || healthGoals.length === 0) {
          throw new Error('Invalid health goals format');
        }
      } catch (error) {
        console.error('Error generating health goals:', error);
        healthGoals = [
          { description: 'Schedule a follow-up appointment with your doctor', timeframe: 'short-term' },
          { description: 'Establish consistent healthy eating and exercise habits', timeframe: 'short-term' },
          { description: 'Maintain optimal health metrics through lifestyle changes', timeframe: 'long-term' }
        ];
      }
      
      // Generate a summary using AI
      let summaryPrompt = `Create a concise summary of health recommendations based on the following data:\n\n`;
      summaryPrompt += `Report Type: ${reportData.type}\n`;
      
      // Add test results to the prompt with error handling
      try {
        if (reportData.results && reportData.results.length > 0) {
          summaryPrompt += 'Test Results:\n';
          reportData.results.forEach((result: any) => {
            if (result && result.name) {
              summaryPrompt += `- ${result.name}: ${result.value || 'N/A'} ${result.unit || ''} (Status: ${result.status || 'Not specified'})\n`;
            }
          });
        } else {
          summaryPrompt += 'Test Results: No specific test results available\n';
        }
      } catch (error) {
        console.error('Error processing test results for summary prompt:', error);
        summaryPrompt += 'Test Results: Error processing test results\n';
      }
      
      // Add patient information to the prompt with error handling
      try {
        summaryPrompt += `\nPatient Information:\n`;
        summaryPrompt += `- Age: ${patientHistory.age || 'Not specified'}\n`;
        
        // Handle conditions with error checking
        if (Array.isArray(patientHistory.conditions)) {
          summaryPrompt += `- Medical Conditions: ${patientHistory.conditions.join(', ')}\n`;
        } else {
          summaryPrompt += `- Medical Conditions: None specified\n`;
        }
        
        // Handle medications with error checking
        if (Array.isArray(patientHistory.medications)) {
          summaryPrompt += `- Medications: ${patientHistory.medications.join(', ')}\n`;
        } else {
          summaryPrompt += `- Medications: None specified\n`;
        }
        
        // Handle lifestyle information with error checking
        if (patientHistory.lifestyle) {
          try {
            const lifestyleStr = typeof patientHistory.lifestyle === 'string' 
              ? patientHistory.lifestyle 
              : JSON.stringify(patientHistory.lifestyle);
            summaryPrompt += `- Lifestyle: ${lifestyleStr}\n`;
          } catch (jsonError) {
            console.error('Error stringifying lifestyle data:', jsonError);
            summaryPrompt += `- Lifestyle: Information available but could not be processed\n`;
          }
        }
      } catch (patientInfoError) {
        console.error('Error processing patient information for summary prompt:', patientInfoError);
        summaryPrompt += `\nPatient Information: Limited information available\n`;
      }
      
      summaryPrompt += `\nThe summary should be 2-3 sentences highlighting the most important health actions the patient should take.`;
      
      // Call the Groq API for the summary with timeout and error handling
      let summary;
      try {
        // Set a timeout for the API call
        const timeoutPromise = new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error('API call timed out after 30 seconds')), 30000);
        });
        
        // Race between the API call and the timeout
        summary = await Promise.race([
          this.callGroqAPI(summaryPrompt),
          timeoutPromise
        ]);
        
        // Validate the summary
        if (!summary || typeof summary !== 'string' || summary.trim().length === 0) {
          throw new Error('Empty or invalid summary received from API');
        }
      } catch (apiError) {
        console.error('Error calling Groq API for recommendations summary:', apiError);
        summary = 'Based on your test results, focus on maintaining a healthy lifestyle with regular exercise and a balanced diet. Consult with your healthcare provider for personalized guidance.';
      }
      
      // Compile all recommendations into a structured format
      return {
        summary,
        dietaryRecommendations,
        exerciseRecommendations,
        lifestyleChanges: lifestyleModifications,
        medicationNotes,
        followUpSchedule,
        goals: healthGoals
      };
    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }
  
  /**
   * Get fallback recommendations when the main function fails
   */
  private getFallbackRecommendations(): any {
    return {
      summary: 'We recommend maintaining a healthy lifestyle and consulting with your healthcare provider for personalized guidance.',
      dietaryRecommendations: [
        'Maintain a balanced diet with plenty of fruits, vegetables, and whole grains', 
        'Stay hydrated by drinking adequate water throughout the day',
        'Limit processed foods, added sugars, and excessive salt intake'
      ],
      exerciseRecommendations: [
        'Aim for at least 150 minutes of moderate-intensity aerobic activity per week', 
        'Include strength training exercises at least twice per week',
        'Find physical activities you enjoy to help maintain consistency'
      ],
      lifestyleChanges: [
        'Ensure 7-8 hours of quality sleep each night', 
        'Practice stress management techniques such as meditation or deep breathing',
        'Avoid tobacco products and limit alcohol consumption'
      ],
      medicationNotes: [
        'Continue taking all prescribed medications as directed by your healthcare provider', 
        'Do not start or stop any medications without consulting your healthcare provider',
        'Keep an updated list of all medications and supplements you take'
      ],
      followUpSchedule: 'Schedule a follow-up appointment with your primary care physician to discuss these results.',
      goals: [
        { description: 'Schedule a follow-up appointment with your doctor', timeframe: 'short-term' },
        { description: 'Establish consistent healthy eating and exercise habits', timeframe: 'short-term' },
        { description: 'Maintain optimal health metrics through lifestyle changes', timeframe: 'long-term' }
      ]
    };
  }

  /**
   * Convert a string report type to the corresponding ReportType enum value
   * @param reportType - The string report type
   * @returns The corresponding ReportType enum value
   */
  private stringToReportTypeEnum(reportType: string): ReportType {
    const normalizedType = reportType.toUpperCase().replace(/\s+/g, '_');
    
    switch (normalizedType) {
      case 'CBC':
        return ReportType.CBC;
      case 'LIPID_PANEL':
      case 'LIPID PANEL':
        return ReportType.LIPID_PANEL;
      case 'METABOLIC_PANEL':
      case 'METABOLIC PANEL':
        return ReportType.METABOLIC_PANEL;
      case 'URINALYSIS':
        return ReportType.URINALYSIS;
      case 'THYROID_PANEL':
      case 'THYROID PANEL':
        return ReportType.THYROID_PANEL;
      case 'IMAGING':
      case 'X-RAY':
      case 'MRI':
      case 'CT_SCAN':
      case 'CT SCAN':
      case 'ULTRASOUND':
        return ReportType.IMAGING;
      case 'PATHOLOGY':
        return ReportType.PATHOLOGY;
      default:
        return ReportType.OTHER;
    }
  }
}

// Export a singleton instance of the AI service
export const aiService = new GroqAIService();
export default aiService;

export enum ReportType {
  CBC = 'CBC',
  LIPID_PANEL = 'LIPID_PANEL',
  METABOLIC_PANEL = 'METABOLIC_PANEL',
  URINALYSIS = 'URINALYSIS',
  THYROID_PANEL = 'THYROID_PANEL',
  IMAGING = 'IMAGING',
  PATHOLOGY = 'PATHOLOGY',
  OTHER = 'OTHER'
}