import { ImgHTMLAttributes } from 'react';
import WebsiteIcon from '@/assets/logo.png';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            src={WebsiteIcon} 
            alt="Website Logo" 
            {...props} 
        />
    );
}