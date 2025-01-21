import { LumaEventService } from "./LumaEventService";
import { LUMA_API, DEFAULT_HEADERS } from "./Utils";
export class LumaAuthService {
    static async requestEmailCode(email: string): Promise<void> {
      const res = await fetch(`${LUMA_API.BASE_URL}/auth/email/start-with-email`, {
        headers: {
          ...DEFAULT_HEADERS,
          'x-luma-web-url': `${LUMA_API.WEB_URL}/signin`,
        },
        referrer: LUMA_API.WEB_URL,
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: JSON.stringify({ email }),
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      });
  
      const data = await res.json();
  
      if (data.has_password) {
        await fetch(`${LUMA_API.BASE_URL}/auth/email/send-sign-in-code`, {
          headers: {
            ...DEFAULT_HEADERS,
            'x-luma-web-url': `${LUMA_API.WEB_URL}/signin`,
          },
          referrer: LUMA_API.WEB_URL,
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: JSON.stringify({ email }),
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
        });
      }
    }
  
    static async signInWithEmailCode(email: string, code: string) {
      const res = await fetch(`${LUMA_API.BASE_URL}/auth/email/sign-in-with-code`, {
        headers: {
          ...DEFAULT_HEADERS,
          'x-luma-web-url': `${LUMA_API.WEB_URL}/signin`,
        },
        referrer: LUMA_API.WEB_URL,
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: JSON.stringify({ email, code }),
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      });
  
      const data = await res.json();
      const authToken = this.extractAuthToken(res);
      const eventService = new LumaEventService(authToken);
  
      return { eventService, authToken, data };
    }
  
    private static extractAuthToken(res: Response): string {
      const cookies = res.headers.get('set-cookie');
      if (!cookies) {
        throw new Error("Response didn't include set-cookie header");
      }
  
      const cookieHeader = cookies.split(';')[0];
      const authToken = cookieHeader.split('=')[1];
  
      if (!authToken) {
        throw new Error('Failed to get auth token from set-cookie header');
      }
  
      return authToken;
    }
  }
  