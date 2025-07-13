import Link from "next/link";
import { Bell, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Button from "../ui/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import LanguageSelector from "../LanguageSelector";
import { useCompressionSettings } from "../../contexts/CompressionContext";

type NavbarProps = {
  userName?: string;
  notificationCount?: number;
};

export default function Navbar({ userName = 'JS', notificationCount = 5 }: NavbarProps) {
  const { compressionSettings, enableLowResourceMode, disableLowResourceMode } = useCompressionSettings();
  
  // Get initials from user name
  const initials = userName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();
    
  const toggleLowResourceMode = () => {
    if (compressionSettings.enabled) {
      disableLowResourceMode();
    } else {
      enableLowResourceMode();
    }
  };

  return (
    <nav className="flex justify-between items-center p-6 border-b border-gray-800">
      <div className="flex items-center space-x-2">
        <Link href="/dashboard" className="text-2xl font-bold text-accent">LABSYNC AI</Link>
      </div>
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={compressionSettings.enabled ? "primary" : "secondary"} 
                size="sm"
                onClick={toggleLowResourceMode}
              >
                <Zap className={`h-5 w-5 ${compressionSettings.enabled ? "text-white" : "text-yellow-500"}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{compressionSettings.enabled ? "Disable" : "Enable"} Low Resource Mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link href="/settings" className="text-sm hover:text-accent transition-colors">
          Settings
        </Link>
        <LanguageSelector variant="minimal" className="mr-2" />
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-card-hover transition-colors">
            <span className="text-xl">🔔</span>
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 bg-danger text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>
        </div>
        <Link href="/dashboard/profile">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-background font-bold cursor-pointer">
            {initials}
          </div>
        </Link>
      </div>
    </nav>
  );
}