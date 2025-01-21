export type LumaEvent = {
  eventId: string;
  ticketKey: string;
  eventName: string;
  coverImageUrl: string;
}

export type GetLumaGuestsResponse = {
  entries: LumaGuest[];
  has_more: boolean;
  next_cursor: string;
};

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

export class LumaClient {
  constructor(public authToken: string) { }

  public static async requestEmailCode(email: string) {
    const res = await fetch('https://api.lu.ma/auth/email/start-with-email', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en',
        'content-type': 'application/json',
        priority: 'u=1, i',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'x-luma-client-type': 'luma-web',
        'x-luma-client-version': '5247e4cbd7ebb4eca4dd4b0011e5dab38f0ea748',
        'x-luma-web-url': 'https://lu.ma/signin',
      },
      referrer: 'https://lu.ma/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify({ email }),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    const data: {
      is_new_user: boolean;
      has_password: boolean;
      has_name: boolean;
      has_phone_number: boolean;
    } = await res.json();

    if (data.has_password) {
      await fetch('https://api.lu.ma/auth/email/send-sign-in-code', {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en',
          'content-type': 'application/json',
          priority: 'u=1, i',
          'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
          'x-luma-client-type': 'luma-web',
          'x-luma-client-version': '5247e4cbd7ebb4eca4dd4b0011e5dab38f0ea748',
          'x-luma-web-url': 'https://lu.ma/signin',
        },
        referrer: 'https://lu.ma/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: JSON.stringify({ email }),
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      });
    }
  }

  public static async fromEmailCode(email: string, code: string) {
    const res = await fetch('https://api.lu.ma/auth/email/sign-in-with-code', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en',
        'content-type': 'application/json',
        priority: 'u=1, i',
        'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'x-luma-client-type': 'luma-web',
        'x-luma-client-version': '5247e4cbd7ebb4eca4dd4b0011e5dab38f0ea748',
        'x-luma-web-url': 'https://lu.ma/signin',
      },
      referrer: 'https://lu.ma/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify({ email, code }),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    const data = await res.json();

    const cookies = res.headers.get('set-cookie');
    if (!cookies) {
      throw new Error("Response didn't include set-cookie header");
    }

    const cookieHeader = cookies.split(';')[0];
    const authToken = cookieHeader.split('=')[1];

    if (!authToken) {
      throw new Error('Failed to get auth token from set-cookie header');
    }

    const luma = new LumaClient(authToken);
    return { luma, authToken, data };
  }

  public readonly event = {
    getEvent: async (eventUrl: string): Promise<LumaEvent> => {
      const res = await fetch(eventUrl, {
        headers: {
          Cookie: `luma.auth-session-key=${this.authToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Non-ok response: status ${res.status}`);
      }
      const rawPage = await res.text();
      const scriptMatch = rawPage.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);

      if (!scriptMatch) {
        throw new Error('Failed to find JSON script element in response');
      }

      const content = JSON.parse(scriptMatch[1]);
      console.log(content.props.pageProps.initialData.data);
      
      const realEventId: string = content.props.pageProps.initialData.data.api_id;
      const ticketKey: string = content.props.pageProps.initialData.data.guest_data.ticket_key;
      const eventData = content.props.pageProps.initialData.data.event;
      const eventName: string = eventData.name;
      const coverImageUrl: string = eventData.cover_url;

      if (!realEventId || !ticketKey) {
        throw new Error('Failed to find eventId or ticketKey in response');
      }

      const event: LumaEvent = {
        eventId: realEventId,
        ticketKey,
        eventName,
        coverImageUrl,
      };

      return event;
    },

    getGuests: async (
      eventId: string,
      ticketKey: string,
      paginationCursor?: string | null
    ): Promise<GetLumaGuestsResponse> => {
      const paginationCursorString = paginationCursor
        ? `&pagination_cursor=${paginationCursor}`
        : '';

      const res = await fetch(
        `https://api.lu.ma/event/get-guest-list?event_api_id=${eventId}&ticket_key=${ticketKey}${paginationCursorString}&pagination_limit=100`,
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en',
            priority: 'u=1, i',
            'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'x-luma-client-type': 'luma-web',
            'x-luma-client-version': '5247e4cbd7ebb4eca4dd4b0011e5dab38f0ea748',
            'x-luma-web-url': `https://lu.ma/event?tk=${ticketKey}`,
            Cookie: `luma.auth-session-key=${this.authToken}`,
          },
          referrer: 'https://lu.ma/',
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        }
      );
      if (!res.ok) {
        throw new Error(`Non-ok response: status ${res.status}`);
      }
      const data: GetLumaGuestsResponse = await res.json();
      return data;
    },

    getAllGuests: async (eventId: string, ticketKey: string) => {
      let guests: LumaGuest[] = [];
      let cursor: string | null = null;
      let hasMore = true;
      while (hasMore) {
        const data = await this.event.getGuests(eventId, ticketKey, cursor);
        guests = guests.concat(data.entries);
        cursor = data.next_cursor;
        hasMore = data.has_more;
      }
      return guests;
    },
  };
} 