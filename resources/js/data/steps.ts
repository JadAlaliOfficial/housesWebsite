import { type StepKey, type Status } from '@/types';

export type StepContent = {
    header: string;
    subheader?: string;
    content: string;
};

export const stepContentMap: Record<StepKey, StepContent> = {
    'First step': {
        header: 'Meet your builder and design your home',
        subheader: 'This is where your journey begins!',
        content:
            "You'll sit down with your builder to discuss your vision, needs, and budget. Bring any inspiration photos or ideas you have — this is the time to explore layouts, room count, and style preferences. You'll walk away with a clear plan and timeline. Get ready for your journey 🚀",
    },
    'Second step': {
        header: 'Plumbing Company',
        subheader: "Let's get the water flowing",
        content:
            "time to choose your sinks, tubs, faucets, and more! Whether you're after sleek modern vibes or cozy traditional touches, your plumbing Choices will bring both function and flair to your new home.\n\nYour style, your pace, your home. Let's do this!💪",
    },
    'Third step': {
        header: 'Light Fixture Company',
        subheader: 'Set the Mood',
        content:
            'From statement chandeliers to soft, cozy lighting, this step helps you create the perfect ambiance in every room. Explore finishes, styles, and smart lighting options that match your personality and lifestyle.\n\nLet your home glow!🌟',
    },
    'Fourth step': {
        header: 'Countertop Company',
        subheader: 'Get ready to add that WOW factor',
        content:
            "It's time to meet with the countertop company and explore stunning materials like quartz, granite, or marble. Your consultant will guide you through the options, helping you match style with durability, so you get something beautiful and built to last.\n\nIt's where everyday function meets standout design!🏡🔨",
    },
    'Fifth step': {
        header: 'Cabinet Company',
        subheader: 'Time to get organized — beautifully!🧁🛠️',
        content:
            "You'll meet with the cabinet company to select your cabinet design, finish, color, and hardware. Together, you'll create a kitchen and bathroom that's both practical and picture-perfect.\n\nWhether you're going for classic charm or sleek minimalism, this is where the magic truly happens.✨",
    },
    'Sixth step': {
        header: 'Flooring & Tile',
        subheader: 'Something something!',
        content:
            "Something something something 🔍🏠",
    },
    'Final step': {
        header: 'Key Handed',
        subheader: 'Welcome Home!',
        content:
            "You made it!🎉🏡 It's time to receive your keys and step into your brand new home. Enjoy a final walkthrough, get helpful info and documents, and celebrate the big moment. This is the start of your next chapter — welcome home!🥂🔑",
    },
};

export const stepLabels = [
    {
        label: 'Meet your builder and design your home',
    },
    {
        label: 'Plumbing Company ',
    },
    {
        label: 'Light Fixture Company',
    },
    {
        label: 'Countertop Company',
    },
    {
        label: ' Cabinet Company ',
    },
    {
        label: 'Final Inspection',
    },
    {
        label: 'Key Handed – Welcome Home!',
    },
];

export const getStepAndStatus = (stage: number): { step: StepKey; status: Status } => {
    const stepMap: Record<number, StepKey> = {
        1: 'First step',
        2: 'Second step',
        2.5: 'Second step',
        3: 'Third step',
        3.5: 'Third step',
        4: 'Fourth step',
        4.5: 'Fourth step',
        5: 'Fifth step',
        5.5: 'Fifth step',
        6: 'Sixth step',
        6.5: 'Sixth step',
        7: 'Final step',
    };

    const statusMap: Record<number, Status> = {
        1: 'not requested',
        2: 'not requested',
        2.5: 'on hold',
        3: 'not requested',
        3.5: 'on hold',
        4: 'not requested',
        4.5: 'on hold',
        5: 'not requested',
        5.5: 'on hold',
        6: 'not requested',
        6.5: 'on hold',
        7: 'done',
    };

    return {
        step: stepMap[stage] || 'First step',
        status: statusMap[stage] || 'not requested',
    };
};

export const stepToImageIndex: Record<StepKey, number> = {
    'First step': 0,
    'Second step': 1,
    'Third step': 2,
    'Fourth step': 3,
    'Fifth step': 4,
    'Sixth step': 5,
    'Final step': 6,
};