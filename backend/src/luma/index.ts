import * as cookie from 'cookie';

export interface Guest {
  name: string;
  /** looks like "usr-utQ0XFISWcR6xtm" */
  api_id: string;
  website: string | null;
  /** looks like "Europe/Berlin" */
  timezone: string;
  username: null;
  bio_short: null;
  avatar_url: string | null;
  tiktok_handle: null;
  /** iso timestamp */
  last_online_at: string | null;
  twitter_handle: string | null;
  youtube_handle: string | null;
  /** looks like "/in/mehmet-alperen-derin" */
  linkedin_handle: string | null;
  /** "mehmetaderin" */
  instagram_handle: string | null;
  user: {};
  num_tickets_registered: number;
}

/**
 * @param {string} authToken - The token of the bot, looks like `usr-AkoQfAUWXN1KLyH.2cy8cwiqkbj5yb0xiapy`
 */
export class LumaClient {
  constructor(private authToken: string) {}

  public static async requestEmailCode(email: string) {
    await fetch('https://api.lu.ma/auth/email/start-with-email', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en',
        'content-type': 'application/json',
        priority: 'u=1, i',
        'sec-ch-ua':
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
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
        'x-luma-web-url':
          'https://lu.ma/signin?next=%2Fuser%2Fusr-RMcKtEE7BKGK22C',
      },
      referrer: 'https://lu.ma/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify({ email, code }),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    const data = await res.json();

    const rawCookie = res.headers.get('set-cookie');

    const parsedCookie = cookie.parse(rawCookie!);

    const authToken = parsedCookie['luma.auth-session-key']!;

    const luma = new LumaClient(authToken);

    return {
      luma,
      authToken,
      data,
    };
  }

  public readonly event = {
    /**
     * @param eventId looks like `evt-KZ3GVPQwrc0OFpU`
     * @param ticketKey looks like `hzdtCD`
     * @param paginationCursor looks like `usr-4GrEc2C38FpcMmE`
     */
    getGuests: async (
      eventId: string,
      ticketKey: string,
      paginationCursor?: string | null
    ) => {
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
            'sec-ch-ua':
              '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'x-luma-client-type': 'luma-web',
            'x-luma-client-version': '5247e4cbd7ebb4eca4dd4b0011e5dab38f0ea748',
            'x-luma-web-url': 'https://lu.ma/bkevcvsk?tk=hzdtCD',
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
      const data: {
        entries: Guest[];
        has_more: boolean;
        /** looks like "usr-4GrEc2C38FpcMmE" */
        next_cursor: string;
      } = await res.json();

      return data;
    },
  };
}
