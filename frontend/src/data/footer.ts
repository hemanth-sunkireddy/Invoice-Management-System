import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
    email: string;
    telephone: string;
    socials: ISocials;
} = {
    subheading: "Create your Invoices, Purchases & Quotations in less than 10 seconds. Share on WhatsApp with payment links and get paid faster!",
    quickLinks: [
        {
            text: "Code Documentation",
            url: "https://github.com/hemanth-sunkireddy/Swipe-Invoice-Management/wiki"
        },
        {
            text: "Github Code Link",
            url: "https://github.com/hemanth-sunkireddy/Swipe-Invoice-Management"
        },
        {
            text: "Backend Server URL",
            url: "https://swipe-invoice-management.vercel.app/"
        }
    ],
    // email: 'address@yoursite.com',
    // telephone: '+1 (123) 456-7890',
    // socials: {
    //     // github: 'https://github.com',
    //     // x: 'https://twitter.com/x',
    //     twitter: 'https://twitter.com/Twitter',
    //     facebook: 'https://facebook.com',
    //     // youtube: 'https://youtube.com',
    //     linkedin: 'https://www.linkedin.com',
    //     // threads: 'https://www.threads.net',
    //     instagram: 'https://www.instagram.com',
    // }
}