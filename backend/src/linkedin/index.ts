import { getAuthHeaders } from './getHeaders';
import type { RequestConfig } from './requestConfig';
import { getProfileSections } from './requests/getProfileSections';

export class LinkedinClient {
  private getRequestConfig(): RequestConfig {
    return {
      fetch: (...args) => fetch(args[0], { ...args[1] }),
      getHeaders: () => getAuthHeaders(this.csrfToken, this.sessionToken),
    };
  }

  constructor(
    private csrfToken: string,
    private sessionToken: string | null = null
  ) {}

  public profile = {
    /**
     * @param profileUrn looks like `urn:li:fsd_profile:ACoAADGkcUMBQNjSHkhWsmTPzbQiux41aDYORvI`
     */
    getSections: async (profileUrn: string) => {
      return getProfileSections(this.getRequestConfig(), profileUrn);
    },
    getPage: async (url: string) => {
      return await this.getRequestConfig().fetch(url, {
        headers: this.getRequestConfig().getHeaders(),
      });
    },
  };
}
