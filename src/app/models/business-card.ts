export interface BusinessCard {
    id?: number;
    name: string;
    gender: string;
    dateOfBirth: string;
    phone : string;
    email: string;
    photo? : string;
    address : string;
}

export interface BusinessCardCreate {
    name: string;
    gender: string;
    dateOfBirth: string;
    phone : string;
    email: string;
    photo? : string;
    address : string;
}  


export interface BusinessCardFilter {
    name?: string;
    gender?: string;
    email?: string;
    phone?: string;
}