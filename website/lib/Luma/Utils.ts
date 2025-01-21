export const LUMA_API = {
    BASE_URL: 'https://api.lu.ma',
    WEB_URL: 'https://lu.ma',
    CLIENT_VERSION: '5247e4cbd7ebb4eca4dd4b0011e5dab38f0ea748',
    CLIENT_TYPE: 'luma-web',
} as const;

export const DEFAULT_HEADERS = {
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
    'x-luma-client-type': LUMA_API.CLIENT_TYPE,
    'x-luma-client-version': LUMA_API.CLIENT_VERSION,
};
