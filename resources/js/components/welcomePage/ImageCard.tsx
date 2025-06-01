import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { type Stage } from '@/types';
import { useState } from 'react';

interface ImageCardProps {
  currentStage: Stage;
}

export default function ImageCard({ currentStage }: ImageCardProps) {
  // Generate the image URL from the stage data
  const imageUrl = currentStage.image ? `/storage/${currentStage.image}` : '';
  
  // State to track image loading errors
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="h-full  w-full flex-1 bg-white p-0 md:w-1/2 lg:w-1/2 dark:bg-[#121212]">
      <div className="relative h-full w-full overflow-hidden">
        <div className="flex h-full w-full items-center justify-center">
          <AnimatePresence mode="wait">
            {!imageError && imageUrl ? (
              <motion.img
                key={currentStage.id}
                src={imageUrl}
                loading="lazy"
                alt={`${currentStage.title} illustration`}
                className="h-full w-full rounded-xl object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onError={() => setImageError(true)}
              />
            ) : (
              <motion.div
                key="fallback"
                className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <p className=" text-center text-gray-500 dark:text-gray-400">
                  {imageError ? "Failed to load image" : "No image available"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}