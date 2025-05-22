import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { type StepKey } from '@/types';

interface ImageCardProps {
  currentImageIndex: number;
  imageArray: string[];
  step: StepKey;
}

export default function ImageCard({ currentImageIndex, imageArray, step }: ImageCardProps) {
  return (
    <Card className="h-full w-full flex-1 bg-white p-0 md:w-1/2 lg:w-1/2 dark:bg-[#121212]">
      <div className="relative h-full w-full overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={imageArray[currentImageIndex]}
              loading="lazy"
              alt={`${step} illustration`}
              className="h-full w-full rounded-lg object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}