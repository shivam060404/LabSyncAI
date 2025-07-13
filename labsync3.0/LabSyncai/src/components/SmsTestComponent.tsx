'use client';

import { useState } from 'react';
import Card, { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Button from './ui/Button';
import Input from './ui/Input';
import { Label } from './ui/label';
import Select from './ui/Select';
import { Select as SelectShadcn, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select-shadcn';
import { useToast } from './ui/use-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { SupportedLanguage } from '../types';

// Helper function to get language name from language code
const getLanguageName = (code: SupportedLanguage): string => {
  const languageNames: Record<SupportedLanguage, string> = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    bn: 'বাংলা (Bengali)',
    te: 'తెలుగు (Telugu)',
    ta: 'தமிழ் (Tamil)',
    mr: 'मराठी (Marathi)',
    gu: 'ગુજરાતી (Gujarati)',
    kn: 'ಕನ್ನಡ (Kannada)',
    ml: 'മലയാളം (Malayalam)',
    pa: 'ਪੰਜਾਬੀ (Punjabi)',
    ur: 'اردو (Urdu)',
    or: 'ଓଡ଼ିଆ (Odia)',
    as: 'অসমীয়া (Assamese)'
  };
  return languageNames[code] || code;
};

export default function SmsTestComponent() {
  const { toast } = useToast();
  const { language, translate, availableLanguages } = useLanguage();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language as SupportedLanguage);
  const [messageType, setMessageType] = useState('report');
  const [isSending, setIsSending] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const handleSendSms = async () => {
    if (!phoneNumber) {
      toast({
        title: translate('Error'),
        description: translate('Please enter a phone number'),
        type: 'error',
      });
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/sms-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          language: selectedLanguage,
          messageType,
          reportId: 'demo-report-123', // Demo report ID
        }),
      });

      const data = await response.json();
      setLastResponse(data);

      if (data.status === 'success') {
        toast({
          title: translate('SMS Sent'),
          description: translate('The SMS notification was sent successfully'),
        });
      } else {
        toast({
          title: translate('Error'),
          description: data.message || translate('Failed to send SMS notification'),
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      toast({
        title: translate('Error'),
        description: translate('An unexpected error occurred'),
        type: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translate('SMS Notification Test')}</CardTitle>
        <CardDescription>
          {translate('Test sending SMS notifications in different languages')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone-number">{translate('Phone Number')}</Label>
          <Input
            id="phone-number"
            placeholder="+91 98765 43210"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">{translate('Language')}</Label>
          <SelectShadcn
            value={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder={translate('Select language')} />
            </SelectTrigger>
            <SelectContent>
              {availableLanguages.map((code) => (
                <SelectItem key={code} value={code}>
                  {getLanguageName(code)}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectShadcn>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message-type">{translate('Message Type')}</Label>
          <SelectShadcn
            value={messageType}
            onValueChange={setMessageType}
          >
            <SelectTrigger id="message-type">
              <SelectValue placeholder={translate('Select message type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="report">{translate('New Report')}</SelectItem>
              <SelectItem value="abnormal">{translate('Abnormal Results')}</SelectItem>
              <SelectItem value="recommendation">{translate('Health Recommendations')}</SelectItem>
            </SelectContent>
          </SelectShadcn>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <Button onClick={handleSendSms} disabled={isSending}>
          {isSending ? translate('Sending...') : translate('Send SMS')}
        </Button>

        {lastResponse && (
          <div className="w-full mt-4">
            <h4 className="font-medium mb-2">{translate('Last Response')}:</h4>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-40">
              {JSON.stringify(lastResponse, null, 2)}
            </pre>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}