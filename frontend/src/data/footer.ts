import { IMenuItem } from "@/types";

export const footerDetails: {
    subheading: string;
    quickLinks: IMenuItem[];
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
    ]
}