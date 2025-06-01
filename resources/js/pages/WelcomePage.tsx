import ImageCard from '@/components/welcomePage/ImageCard';
import ContentCard from '@/components/welcomePage/ContentCard';
import WelcomeLayout from '@/layouts/WelcomeLayout';
import { type ButtonLink, type Status, type Stage, type User } from '@/types';
import { usePage } from '@inertiajs/react';

type WelcomePageProps = {
  user: User;
  stages: Stage[];
};

export default function WelcomePage() {
  const { user, stages } = usePage<WelcomePageProps>().props;
  
  // Get the current stage based on user.stage
  const currentStage = stages.find(stage => stage.order === Number(user.stage)) || stages[0];
  
  // Parse button_linking JSON string
  const parseButtonLinks = (buttonLinkingStr?: string): ButtonLink[] => {
    if (!buttonLinkingStr) return [];
    try {
      return JSON.parse(buttonLinkingStr);
    } catch (e) {
      console.error('Error parsing button_linking:', e);
      return [];
    }
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
    <WelcomeLayout>
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