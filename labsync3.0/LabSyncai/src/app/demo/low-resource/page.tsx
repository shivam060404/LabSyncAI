'use client';

import { useState, useEffect } from 'react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import Button from '../../../components/ui/Button';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { Slider } from '../../../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useToast } from '../../../components/ui/use-toast';
import SmsTestComponent from '../../../components/SmsTestComponent';
import { useLanguage } from '../../../contexts/LanguageContext';

export default function LowResourceDemo() {
  const { toast } = useToast();
  const { translate } = useLanguage();
  const [lowResourceMode, setLowResourceMode] = useState(false);
  const [imageQuality, setImageQuality] = useState(50);
  const [disableAnimations, setDisableAnimations] = useState(false);
  const [simplifyUi, setSimplifyUi] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('fast');
  const [dataUsage, setDataUsage] = useState(0);

  // Simulate connection speed detection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate data usage increasing
      setDataUsage(prev => prev + (lowResourceMode ? 0.5 : 2));
    }, 1000);

    return () => clearInterval(interval);
  }, [lowResourceMode]);

  const toggleLowResourceMode = () => {
    setLowResourceMode(!lowResourceMode);
    toast({
      title: !lowResourceMode ? 'Low Resource Mode Enabled' : 'Low Resource Mode Disabled',
      description: !lowResourceMode 
        ? 'The application will use less data and resources.'
        : 'The application will use normal resources.',
    });

    // Apply or remove the low-resource-mode class to the body
    if (!lowResourceMode) {
      document.body.classList.add('low-resource-mode');
      if (simplifyUi) document.body.classList.add('simplified-ui');
      if (disableAnimations) document.body.classList.add('disable-animations');
    } else {
      document.body.classList.remove('low-resource-mode', 'simplified-ui', 'disable-animations');
    }
  };

  const toggleSimplifyUi = () => {
    setSimplifyUi(!simplifyUi);
    if (lowResourceMode) {
      if (!simplifyUi) {
        document.body.classList.add('simplified-ui');
      } else {
        document.body.classList.remove('simplified-ui');
      }
    }
  };

  const toggleDisableAnimations = () => {
    setDisableAnimations(!disableAnimations);
    if (lowResourceMode) {
      if (!disableAnimations) {
        document.body.classList.add('disable-animations');
      } else {
        document.body.classList.remove('disable-animations');
      }
    }
  };

  const simulateConnectionChange = (speed: string) => {
    setConnectionSpeed(speed);
    toast({
      title: `Connection Speed: ${speed.charAt(0).toUpperCase() + speed.slice(1)}`,
      description: `Simulating ${speed} network conditions.`,
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{translate('Low Resource Mode Demo')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Low Resource Mode Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="low-resource-mode">Enable Low Resource Mode</Label>
                <Switch 
                  id="low-resource-mode" 
                  checked={lowResourceMode} 
                  onCheckedChange={toggleLowResourceMode} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image-quality">Image Quality: {imageQuality}%</Label>
                <Slider 
                  id="image-quality" 
                  min={10} 
                  max={100} 
                  step={5}
                  value={[imageQuality]} 
                  onValueChange={(value) => setImageQuality(value[0])}
                  disabled={!lowResourceMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="disable-animations">Disable Animations</Label>
                <Switch 
                  id="disable-animations" 
                  checked={disableAnimations} 
                  onCheckedChange={toggleDisableAnimations}
                  disabled={!lowResourceMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="simplify-ui">Simplify UI</Label>
                <Switch 
                  id="simplify-ui" 
                  checked={simplifyUi} 
                  onCheckedChange={toggleSimplifyUi}
                  disabled={!lowResourceMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Connection Simulator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Simulate Connection Speed</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant={connectionSpeed === 'slow' ? "primary" : "secondary"}
                    onClick={() => simulateConnectionChange('slow')}
                  >
                    2G (Slow)
                  </Button>
                  <Button 
                    variant={connectionSpeed === 'medium' ? "primary" : "secondary"}
                    onClick={() => simulateConnectionChange('medium')}
                  >
                    3G (Medium)
                  </Button>
                  <Button 
                    variant={connectionSpeed === 'fast' ? "primary" : "secondary"}
                    onClick={() => simulateConnectionChange('fast')}
                  >
                    4G+ (Fast)
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Data Usage Simulation</Label>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${Math.min(dataUsage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500">
                  {dataUsage.toFixed(1)} MB used {lowResourceMode && "(Low Resource Mode saving data)"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="normal">
        <TabsList className="mb-4">
          <TabsTrigger value="normal">{translate('Normal View')}</TabsTrigger>
          <TabsTrigger value="comparison">{translate('Side-by-Side Comparison')}</TabsTrigger>
          <TabsTrigger value="sms">{translate('SMS Notifications')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="normal">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sample Medical Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      AB
                    </div>
                    <div>
                      <h3 className="font-bold">Anil Bhardwaj</h3>
                      <p className="text-gray-500">42 years, Male</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Complete Blood Count</h4>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left">Test</th>
                          <th className="p-2 text-left">Result</th>
                          <th className="p-2 text-left">Normal Range</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">Hemoglobin</td>
                          <td className="p-2">13.5 g/dL</td>
                          <td className="p-2">13.0 - 17.0 g/dL</td>
                          <td className="p-2 text-green-500">Normal</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">White Blood Cells</td>
                          <td className="p-2">11.5 x10^9/L</td>
                          <td className="p-2">4.5 - 11.0 x10^9/L</td>
                          <td className="p-2 text-red-500">High</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Platelets</td>
                          <td className="p-2">250 x10^9/L</td>
                          <td className="p-2">150 - 450 x10^9/L</td>
                          <td className="p-2 text-green-500">Normal</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Red Blood Cells</td>
                          <td className="p-2">4.8 x10^12/L</td>
                          <td className="p-2">4.5 - 5.5 x10^12/L</td>
                          <td className="p-2 text-green-500">Normal</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Lipid Profile</h4>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 text-left">Test</th>
                          <th className="p-2 text-left">Result</th>
                          <th className="p-2 text-left">Normal Range</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2">Total Cholesterol</td>
                          <td className="p-2">220 mg/dL</td>
                          <td className="p-2">&lt; 200 mg/dL</td>
                          <td className="p-2 text-red-500">High</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">HDL Cholesterol</td>
                          <td className="p-2">45 mg/dL</td>
                          <td className="p-2">&gt; 40 mg/dL</td>
                          <td className="p-2 text-green-500">Normal</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">LDL Cholesterol</td>
                          <td className="p-2">140 mg/dL</td>
                          <td className="p-2">&lt; 130 mg/dL</td>
                          <td className="p-2 text-red-500">High</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2">Triglycerides</td>
                          <td className="p-2">180 mg/dL</td>
                          <td className="p-2">&lt; 150 mg/dL</td>
                          <td className="p-2 text-red-500">High</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Analysis</h4>
                    <p className="mb-2">
                      The patient's blood count is generally normal with slightly elevated white blood cell count, which may indicate an ongoing infection or inflammation. The lipid profile shows elevated total cholesterol, LDL cholesterol, and triglycerides, suggesting a risk for cardiovascular disease.
                    </p>
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                      <h5 className="font-semibold text-yellow-800 mb-1">Recommendations</h5>
                      <ul className="list-disc pl-5 text-yellow-800">
                        <li>Follow up with a physician to address the elevated white blood cell count</li>
                        <li>Consider dietary modifications to reduce cholesterol and triglycerides</li>
                        <li>Increase physical activity to at least 150 minutes per week</li>
                        <li>Reduce intake of saturated fats and simple carbohydrates</li>
                        <li>Consider follow-up lipid profile in 3 months</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        

        
        <TabsContent value="sms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SmsTestComponent />
            <Card>
              <CardHeader>
                <CardTitle>{translate('SMS in Low Resource Environments')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>{translate('SMS notifications are crucial for reaching users in areas with limited internet connectivity or for users without smartphones. Key benefits include:')}</p>
                  
                  <ul className="list-disc pl-5 space-y-2">
                    <li>{translate('Accessibility for users without smartphones or with basic feature phones')}</li>
                    <li>{translate('Reliable delivery in areas with poor internet connectivity')}</li>
                    <li>{translate('Lower data usage compared to app notifications')}</li>
                    <li>{translate('Immediate alerts for critical health information')}</li>
                    <li>{translate('Support for multiple Indian languages')}</li>
                  </ul>
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
                    <h4 className="font-semibold text-blue-800 mb-2">{translate('Implementation Details')}</h4>
                    <p className="text-blue-800">
                      {translate('Our SMS service compresses and optimizes medical information to fit within SMS character limits while preserving critical details. Messages are translated into the user\'s preferred language and formatted for maximum readability on basic phones.')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}