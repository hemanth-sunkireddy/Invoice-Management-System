export interface IMenuItem {
    text: string;
    url: string;
}

export interface IBenefit {
    title: string;
    description: string;
    imageSrc: string;
    bullets: IBenefitBullet[]
}

export interface IBenefitBullet {
    title: string;
    description: string;
    icon: JSX.Element;
}

export interface IPricing {
    name: string;
    price: number | string;
    features: string[];
}

export interface IFAQ {
    question: string;
    answer: string;
}

export interface ITestimonial {
    name: string;
    role: string;
    message: string;
    avatar: string;
}

export interface IStats {
    title: string;
    icon: JSX.Element;
    description: string;
}

export interface ISocials {
    facebook?: string;
    github?: string;
    instagram?: string;
    linkedin?: string;
    threads?: string;
    twitter?: string;
    youtube?: string;
    x?: string;
    [key: string]: string | undefined;
}

export interface Invoice {
    invoice_num: number,
    invoice_date: string,
    invoice_tax: string,
    total_amount: string,
}

export interface Customers {
    customer_name: string,
    phone_number: number,
    totalPurAmnt: number,
}

export interface Products {
    product_name: string,
    quantity: number,
    item_price: number,
    taxable_value: number,
    priceWithTax: number,
    discount: number,
}
