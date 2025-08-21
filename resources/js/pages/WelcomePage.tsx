import ImageCard from '@/components/welcomePage/ImageCard';
import ContentCard from '@/components/welcomePage/ContentCard';
import WelcomeLayout from '@/layouts/WelcomeLayout';
import { type ButtonLink, type Status, type Stage, type User } from '@/types';
import { usePage } from '@inertiajs/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';

type TrustedPartnersFile = {
  id?: number;
  fileLink: string | null;
};

type WelcomePageProps = {
  user: User;
  stages: Stage[];
  file?: TrustedPartnersFile | null;
};

export default function WelcomePage() {
  const { user, stages, file } = usePage<WelcomePageProps>().props;
  
  // Get the current stage based on user.stage
  const currentStage = stages.find(stage => stage.order === Number(user.stage)) || stages[0];
  
  // Parse button_linking into ButtonLink array
  const parseButtonLinks = (buttonLinking: any): ButtonLink[] => {
    if (!buttonLinking) return [];
    
    // If it's already an array, return it directly
    if (Array.isArray(buttonLinking)) {
      return buttonLinking.map(link => ({
        text: link.text || '',
        popup: link.popup || 'nothing',
        status: link.status || '0'
      }));
    }
    
    // If it's a single object, wrap it in an array
    return [{
      text: buttonLinking.text || '',
      popup: buttonLinking.popup || 'nothing',
      status: buttonLinking.status || '0'
    }];
  };
  
  // Create current step content from current stage
  const currentStepContent = {
    header: currentStage.title,
    subheader: currentStage.subtitle,
    content: currentStage.description || '',
    buttonLinks: parseButtonLinks(currentStage.button_linking)
  };
  
  // Determine status based on user stage
  const status: Status = 'not requested';

  return (
    <WelcomeLayout
    file={file}
    >
      {/* Image Card */}
      <ImageCard 
        currentStage={currentStage}
      />

      {/* Content Card */}
      <ContentCard
        currentStepContent={currentStepContent}
        user={user}
        stage={currentStage}
        status={status}
      />
    </WelcomeLayout>
  );
}