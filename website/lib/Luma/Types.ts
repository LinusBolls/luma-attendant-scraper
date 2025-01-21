export interface LumaEvent {
    eventId: string;
    ticketKey: string;
    eventName: string;
    coverImageUrl: string;
}

export interface LumaGuest {
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
}

export interface GetLumaGuestsResponse {
    entries: LumaGuest[];
    has_more: boolean;
    next_cursor: string;
}
