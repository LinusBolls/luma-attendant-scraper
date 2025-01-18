const headersSharedBetweenProtocols = {
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Referer: "https://www.linkedin.com/feed/",
  "x-li-lang": "en_US",
  "x-li-track":
    '{"clientVersion":"1.12.5839","mpVersion":"1.12.5839","osName":"web","timezoneOffset":2,"timezone":"Europe/Berlin","deviceFormFactor":"DESKTOP","mpName":"voyager-web","displayDensity":2,"displayWidth":2940,"displayHeight":1912}',
  "x-li-page-instance": "urn:li:page:d_flagship3_feed;j6fMd6zGQ0q9BNCo4RXagA==",
  "x-restli-protocol-version": "2.0.0",
  DNT: "1",
  Connection: "keep-alive",
};

/**
 * @returns HTTP headers to authenticate us with LinkedIn.
 */
export function getAuthHeaders(
  csrfToken: string,
  sessionToken?: string | null
) {
  // const cookie = `li_at=${sessionToken}&JSESSIONID=${csrfToken}`;

  const cookie = `bcookie="v=2&ac0181a7-674b-4098-80b8-d8069f1114b9"; bscookie="v=1&202307081102400efd5bb1-77d0-45f2-8c5f-0303d90aedb3AQF6CrlMJb9pD_dFQZNWZSMgcR7CLmw3"; li_alerts=e30=; li_theme=light; li_theme_set=app; visit=v=1&M; li_rm=AQGgtR2iqmM2UAAAAYle23gWNFFs9WS17UZWlUJliH5erMXaioLyx0-IFvTA5_923spEbFXoPUSdWQyJwbgldgQE_0JVv9IEY6HTj7YeDIjeWb78FGU0joGa; dfpfpt=b1d47a2012fe41a0986b90a9bebcc289; JSESSIONID=${csrfToken}; PLAY_LANG=de; sdsc=1%3A1SZM1shxDNbLt36wZwCgPgvN58iw%3D; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7InNlc3Npb25faWQiOiIzZTEzZTNlNC00MjQ5LTQ5MWQtYjNmZS1hZTk5MjE2MTcwNDl8MTcwOTIzMTI0NyIsImFsbG93bGlzdCI6Int9IiwicmVjZW50bHktc2VhcmNoZWQiOiIiLCJyZWZlcnJhbC11cmwiOiJodHRwczovL3d3dy5saW5rZWRpbi5jb20vaGVscC9saW5rZWRpbi9hbnN3ZXIvYTYyMTQwNzU_dHJrPXBzZXR0aW5ncy1kYXRhLWV4cG9ydCZsYW5nPWRlIiwicmVjZW50bHktdmlld2VkIjoiIiwiQ1BULWlkIjoiw4fDtsOdwrcnw4nCg8KTS1jCjWvClXdlwpkiLCJleHBlcmllbmNlIjoiIiwidHJrIjoiIn0sIm5iZiI6MTcwOTIzMTI0NywiaWF0IjoxNzA5MjMxMjQ3fQ.-53i_UC_56xBIMK_Ol0Aw6L434V6KcuxoXkd8ZwU4BQ; lang=v=2&lang=de-de; liap=true; timezone=Europe/Berlin; li_at=${sessionToken}; lidc="b=VB83:s=V:r=V:a=V:p=V:g=3719:u=1147:x=1:i=1737169344:t=1737255744:v=2:sig=AQG4f4Kvn1Z0b-iYDAi0fRaUYDBPOS2D"; fptctx2=taBcrIH61PuCVH7eNCyH0F58uBDuZFZOunQHZt3FugmH1DJNP%252b7zqkvC46x0tzcHbnqMNcca3ERm5xeIQixYjM2Luv2OwHm9wwGWwnKQbK4J9iV%252bro7ijXh9sCDqR%252bntP7IQ05j8jrOEdgJ86sncWcY2CrYT1RX29Ue0QaZaSCCHJs5wOx63SaIJMiW3wcTCYM8n5HezIWjGk%252bkM3aeYL%252fu7CrcCwjNRxLWRTB7qkytPKBK9R7%252b1wqqZ2V98ls2lg1JDBK6IhbDDu38fTSKgX66uYbDj%252bJAAuBB9d37uRVqLHka%252bhCjoSQ0Rey%252fVxC8JhsLVtNXdWfpa4n1NX9oeQtM7w144rvCuq6QIxlOjulE%253d; __cf_bm=5QKJjjsMoFG4bBwSn3ewmycrkpT4bMHPiaewYRFpwnk-1737204111-1.0.1.1-m6qcdHHcGiNJjVMGysBWG2MYDMvbcQalXXdVNLQQhVwSHu3GCbgm2Lznm0.rtFobYNWOrqOFx5zWJrUK5m_42g; li_mc=MTs0MjsxNzM3MjA0NDU3OzI7MDIxnDljoknuvV7G5l+uvtI6XFYL3ABv+GUb3r7Np6GFhFs=`;

  return {
    "csrf-token": csrfToken.replace(/"/g, ""),
    Cookie: cookie,
    ...headersSharedBetweenProtocols,
  };
}
