export type LumaEvent = {
    eventId: string;
    ticketKey: string;
    eventName: string;
    coverImageUrl: string;
};

export type LumaGuest = {
    name: string;
    api_id: string;
    website: string | null;
    timezone: string;
    username: null;
    bio_short: null;
    avatar_url: string | null;
    tiktok_handle: null;
    last_online_at: string | null;
    twitter_handle: string | null;
    youtube_handle: string | null;
    linkedin_handle: string | null;
    instagram_handle: string | null;
    user: object;
    num_tickets_registered: number;
};

export type GetLumaGuestsResponse = {
    entries: LumaGuest[];
    has_more: boolean;
    next_cursor: string;
};

export type LumaUserEvent = {
    api_id: string;
    event: {
        api_id: string;
        name: string;
        cover_url: string;
        start_at: string;
        end_at: string;
        timezone: string;
        url: string;
        location_type: string;
        geo_address_info?: {
            full_address: string;
            city: string;
            country: string;
        };
    };
    guest_count: number;
    ticket_info: {
        is_free: boolean;
        is_sold_out: boolean;
        spots_remaining: number;
        require_approval: boolean;
    };
    featured_guests: Array<{
        api_id: string;
        name: string;
        avatar_url: string;
        linkedin_handle: string | null;
    }>;
};

export type GetLumaUserEventsResponse = {
    entries: LumaUserEvent[];
};
