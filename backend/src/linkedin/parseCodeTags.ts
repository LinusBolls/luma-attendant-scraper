import { HTMLElement } from 'node-html-parser';

interface CodeTagContent {
  id: string;
  data: any;
  request?: {
    id: string;
    data: {
      request: string;
      status: number;
      body: string;
      method: string;
      headers: Record<string, string>;
    };
  };
}

/**
 * linkedin embeds all kinds of json data (most commonly, api responses) into code tags inside their server-side rendered html.
 */
export const parseCodeTags = (document: HTMLElement): CodeTagContent[] => {
  const codeEls = document.querySelectorAll('code');

  const inlineJsonContents = codeEls.map((el) => {
    const codeText = el.innerText;

    /**
     * the json code inside the `<code>` elements has every `"` encoded as `&quot;`, which is it's html entity name.
     *
     * @see https://www.fileformat.info/info/unicode/char/22/index.htm
     */
    const cleanedCodeText = codeText.replace(/(?<!&#92;)&quot;/g, '"');

    try {
      return {
        id: el.id,
        data: JSON.parse(cleanedCodeText),
      };
    } catch (err) {
      return {
        id: el.id,
        data: cleanedCodeText,
      };
    }
  });
  const requests = inlineJsonContents.filter(
    (i) => typeof i.data.request === 'string' && typeof i.data.body === 'string'
  );

  for (const request of requests) {
    const response = inlineJsonContents.find((i) => i.id === request.data.body);

    if (response) {
      (response as CodeTagContent).request = request;
    } else {
      console.warn(
        `failed to find response for request ${request.id} (${request.data.request})`
      );
    }
  }
  return inlineJsonContents;
};
