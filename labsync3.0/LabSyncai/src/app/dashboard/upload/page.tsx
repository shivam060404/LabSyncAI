'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Card, Button, Input, Select } from '../../../components/ui';
import { FiUpload, FiFile, FiX, FiImage, FiActivity, FiCheck } from 'react-icons/fi';
import ImageAnalysisUpload from '../../../components/ImageAnalysisUpload';
import { ReportType } from '../../../lib/aiService';

export default function UploadReport() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [reportType, setReportType] = useState<ReportType>(ReportType.OTHER);
  const [patientName, setPatientName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [activeTab, setActiveTab] = useState<'document' | 'image'>('document');
  const [imageAnalysisResult, setImageAnalysisResult] = useState<any>(null);
  const [analysisStatus, setAnalysisStatus] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    setFiles([...files, ...newFiles]);
    
    // Initialize progress for each file
    const newProgress = {...uploadProgress};
    newFiles.forEach(file => {
      newProgress[file.name] = 0;
    });
    setUploadProgress(newProgress);
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
    
    // Remove progress entry
    const newProgress = {...uploadProgress};
    delete newProgress[fileName];
    setUploadProgress(newProgress);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Initialize analysis status for each file
    const initialAnalysisStatus = {...analysisStatus};
    files.forEach(file => {
      initialAnalysisStatus[file.name] = 'pending';
    });
    setAnalysisStatus(initialAnalysisStatus);
    
    // Setup progress tracking
    const simulateProgress = () => {
      const newProgress = {...uploadProgress};
      
      files.forEach(file => {
        if (newProgress[file.name] < 100) {
          // Increment progress
          const increment = Math.floor(Math.random() * 10) + 5;
          newProgress[file.name] = Math.min(newProgress[file.name] + increment, 95);
        }
      });
      
      setUploadProgress(newProgress);
    };
    
    // Update progress every 500ms
    const progressInterval = setInterval(simulateProgress, 500);
    
    try {
      // Process each file
      for (const file of files) {
        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        
        // Add metadata if available
        if (reportType) formData.append('reportType', reportType);
        if (patientName) formData.append('patientName', patientName);
        if (dateOfBirth) formData.append('dateOfBirth', dateOfBirth);
        
        // Send to API
        const response = await fetch('/api/reports', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Upload result:', result);
        
        // If we have a report ID, perform analysis
        if (result.success && result.data && result.data.id) {
          // Update progress to indicate analysis is happening
          const analysisProgress = {...uploadProgress};
          analysisProgress[file.name] = 96; // Show that we're now analyzing
          setUploadProgress(analysisProgress);
          
          // Update analysis status
          const newAnalysisStatus = {...analysisStatus};
          newAnalysisStatus[file.name] = 'analyzing';
          setAnalysisStatus(newAnalysisStatus);
          
          try {
            // Fetch the report with analysis
            const analysisResponse = await fetch(`/api/reports/${result.data.id}`);
            if (analysisResponse.ok) {
              const analysisResult = await analysisResponse.json();
              console.log('Analysis result:', analysisResult);
              
              // Update analysis status
              const completedAnalysisStatus = {...analysisStatus};
              completedAnalysisStatus[file.name] = 'completed';
              setAnalysisStatus(completedAnalysisStatus);
            }
          } catch (analysisError) {
            console.error('Analysis fetch failed:', analysisError);
            // Update analysis status to error
            const errorAnalysisStatus = {...analysisStatus};
            errorAnalysisStatus[file.name] = 'error';
            setAnalysisStatus(errorAnalysisStatus);
            // Continue with upload process even if analysis fetch fails
          }
        }
      }
      
      // Set all to 100% when done
      const completedProgress = {...uploadProgress};
      files.forEach(file => {
        completedProgress[file.name] = 100;
      });
      setUploadProgress(completedProgress);
      
      // Redirect to analysis page after successful upload
      setTimeout(() => {
        window.location.href = '/dashboard/reports/analysis';
      }, 1000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      
      // Update analysis status to error for all files
      const errorAnalysisStatus = {...analysisStatus};
      files.forEach(file => {
        errorAnalysisStatus[file.name] = 'error';
      });
      setAnalysisStatus(errorAnalysisStatus);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  // Handle image analysis completion
  const handleImageAnalysisComplete = (result: any) => {
    setImageAnalysisResult(result);
    
    // Create a synthetic file from the analysis result
    const reportType = result.reportType || ReportType.IMAGING;
    const reportData = JSON.stringify(result, null, 2);
    const file = new File([reportData], `${reportType}_${new Date().toISOString()}.json`, {
      type: 'application/json',
    });
    
    // Add the file to the list
    setFiles(prev => [...prev, file]);
    
    // Switch to document tab to show the file
    setActiveTab('document');
  };

  return (
    <DashboardLayout activePage="upload">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Medical Reports</h1>
            <p className="text-gray-400 mt-2">Upload your medical reports for AI-powered analysis</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              className={`py-3 px-6 font-medium ${activeTab === 'document' ? 'text-accent border-b-2 border-accent' : 'text-gray-400'}`}
              onClick={() => setActiveTab('document')}
            >
              <span className="flex items-center">
                <FiFile className="mr-2" />
                Document Upload
              </span>
            </button>
            <button
              className={`py-3 px-6 font-medium ${activeTab === 'image' ? 'text-accent border-b-2 border-accent' : 'text-gray-400'}`}
              onClick={() => setActiveTab('image')}
            >
              <span className="flex items-center">
                <FiImage className="mr-2" />
                Image Analysis
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activeTab === 'document' ? (
                <Card>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center ${isDragging ? 'border-accent bg-accent/5' : 'border-gray-700'} transition-colors`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center cursor-pointer">
                      <div className="h-16 w-16 rounded-full border-2 border-accent flex items-center justify-center mb-4 text-accent text-2xl">
                        <FiUpload />
                      </div>
                      <h3 className="text-xl font-medium text-accent mb-2">Drop your file here</h3>
                      <p className="text-gray-400 mb-4">or click to upload</p>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        className="hidden"
                        multiple
                        accept=".pdf,.csv,.jpg,.jpeg,.png"
                      />
                      <div className="text-sm text-gray-500">
                        Supported formats: PDF, CSV, JPG, PNG
                      </div>
                    </div>
                  </div>

                {files.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-card-hover rounded-lg">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded bg-accent/10 flex items-center justify-center mr-3 text-accent">
                            {file.name.endsWith('.pdf') ? 'PDF' : 
                             file.name.endsWith('.csv') ? 'CSV' : 
                             file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png') ? 'IMG' : 'DOC'}
                          </div>
                          <div>
                            <div className="font-medium truncate max-w-xs">{file.name}</div>
                            <div className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</div>
                            
                            {/* Analysis status indicator */}
                            {analysisStatus[file.name] && (
                              <div className="mt-1 flex items-center">
                                {analysisStatus[file.name] === 'analyzing' && (
                                  <span className="flex items-center text-xs text-accent">
                                    <FiActivity className="animate-pulse mr-1" />
                                    Analyzing
                                  </span>
                                )}
                                {analysisStatus[file.name] === 'completed' && (
                                  <span className="flex items-center text-xs text-green-500">
                                    <FiCheck className="mr-1" />
                                    Analysis complete
                                  </span>
                                )}
                                {analysisStatus[file.name] === 'error' && (
                                  <span className="flex items-center text-xs text-red-500">
                                    <FiX className="mr-1" />
                                    Analysis failed
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {uploadProgress[file.name] > 0 && (
                            <div className="w-24 mr-4">
                              <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-accent rounded-full" 
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-right mt-1 text-gray-400">
                                {uploadProgress[file.name] === 96 && analysisStatus[file.name] === 'analyzing' 
                                  ? 'Analyzing...' 
                                  : `${uploadProgress[file.name]}%`}
                              </div>
                            </div>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.name);
                            }}
                            className="text-gray-400 hover:text-danger transition-colors"
                            disabled={isUploading}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={handleUpload}
                      variant="primary"
                      fullWidth
                      className="mt-4"
                      disabled={isUploading || files.length === 0}
                    >
                      {isUploading ? (
                        // Check if any file is in analyzing state
                        Object.values(analysisStatus).some(status => status === 'analyzing') ? 
                          'Analyzing Report...' : 'Uploading...'
                      ) : 'Analyze Reports'}
                    </Button>
                  </div>
                )}
              </Card>
               ) : (
                 <ImageAnalysisUpload onAnalysisComplete={handleImageAnalysisComplete} />
               )}
            </div>
            
            <div>
              <Card>
                <h2 className="text-xl font-bold mb-4">Report Details</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="reportType" className="block text-sm font-medium mb-1">
                      Report Type
                    </label>
                    <Select
                      id="reportType"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value as ReportType)}
                      options={[
                        { value: ReportType.CBC, label: 'Complete Blood Count (CBC)' },
                        { value: ReportType.LIPID_PANEL, label: 'Lipid Panel' },
                        { value: ReportType.METABOLIC_PANEL, label: 'Metabolic Panel' },
                        { value: ReportType.URINALYSIS, label: 'Urinalysis' },
                        { value: ReportType.THYROID_PANEL, label: 'Thyroid Panel' },
                        { value: ReportType.IMAGING, label: 'Imaging (X-Ray, MRI, CT)' },
                        { value: ReportType.PATHOLOGY, label: 'Pathology' },
                        { value: ReportType.OTHER, label: 'Other' }
                      ]}
                      placeholder="Select type"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="patientName" className="block text-sm font-medium mb-1">
                      Patient Name
                    </label>
                    <Input
                      id="patientName"
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-1">
                      Date of Birth
                    </label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
    </DashboardLayout>
  );
}