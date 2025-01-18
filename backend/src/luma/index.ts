import * as cookie from 'cookie';
import { parse as parseHtml } from 'node-html-parser';

export type GetLumaGuestsResponse = {
  entries: LumaGuest[];
  has_more: boolean;
  /** looks like "usr-4GrEc2C38FpcMmE" */
  next_cursor: string;
};

export interface LumaGuest {
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
  constructor(public authToken: string) {}

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

    if (!rawCookie) {
      throw new Error(
        "Luma.fromEmailCode: Response didn't include set-cookie header"
      );
    }
    const parsedCookie = cookie.parse(rawCookie!);

    const authToken = parsedCookie['luma.auth-session-key'];

    if (!authToken) {
      throw new Error(
        'Luma.fromEmailCode: Failed to get auth token from set-cookie header'
      );
    }
    const luma = new LumaClient(authToken);

    return {
      luma,
      authToken,
      data,
    };
  }

  public readonly event = {
    getEvent: async (eventUrl: string) => {
      const res = await fetch(eventUrl, {
        headers: {
          Cookie: `luma.did=brapih2xmppo8o6jtmk495jfucxr8l; luma.native-referrer=https%3A%2F%2Flu.ma%2F; luma.evt-KZ3GVPQwrc0OFpU.referred_by=hzdtCD; luma.auth-session-key=${this.authToken}`,
        },
      });
      if (!res.ok) {
        throw new Error(
          `[Luma.event.getEvent] Non-ok response: status ${res.status}`
        );
      }
      const rawPage = await res.text();

      const page = parseHtml(rawPage);

      const el = page.querySelector('script#__NEXT_DATA__');

      if (!el) {
        throw new Error(
          `[Luma.event.getEvent] Failed to find JSON script element in response`
        );
      }
      const content = JSON.parse(el.innerHTML);

      const realEventId: string =
        content.props.pageProps.initialData.data.api_id;

      const ticketKey: string =
        content.props.pageProps.initialData.data.guest_data.ticket_key;

      if (!realEventId || !ticketKey) {
        throw new Error(
          `[Luma.event.getEvent] Failed to find eventId or ticketKey in response`
        );
      }
      return { eventId: realEventId, ticketKey };
    },
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
      if (!res.ok) {
        throw new Error(
          `[Luma.event.getGuests] Non-ok response: status ${res.status}`
        );
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
