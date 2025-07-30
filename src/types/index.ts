export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    images: string[];
    featured: boolean;
    amenities: string[];
    owner_id?: string;
    agency_id?: string;
    agent_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Experience {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    duration: number;
    max_participants: number;
    photos: string[];
    featured: boolean;
    category: string;
    what_is_included?: string;
    what_is_needed?: string;
    external_url?: string;
    recurring_dates?: {
        type: string;
        dates: string[];
        days: string[];
    };
    created_at?: string;
    updated_at?: string;
} 