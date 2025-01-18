import fs from 'fs';
import { HTMLElement, parse as parseHtml } from 'node-html-parser';
import OpenAI from 'openai';

import { linkedinJobQueue } from './jobQueue';
import { env } from './env';
import { LinkedinClient } from './linkedin';
import { parseCodeTags } from './linkedin/parseCodeTags';
import { parseProfileSections } from './linkedin/requests/getProfileSections';
import { LumaClient } from './luma';
import { askQuestion } from './util/askQuestion';

async function signIn() {
  const email = 'qlaiseq@gmail.com';

  await LumaClient.requestEmailCode(email);

  const rawCode = await askQuestion('enter the code: ');

  const code = rawCode.trim();

  const { luma, data, authToken } = await LumaClient.fromEmailCode(email, code);

  console.log('authToken:', authToken);
  console.log('welcome', data.user.name);
}

async function getProfileInfo(linkedinHandle: string) {
  const linkedin = new LinkedinClient(
    env.linkedin.csrfToken,
    env.linkedin.sessionToken
  );

  const res = await linkedin.profile.getPage(
    'https://www.linkedin.com' + linkedinHandle
  );
  const rawPage = await res.text();

  const page = parseHtml(rawPage);

  const codeTags = parseCodeTags(page);

  const profileUrns = codeTags
    .map((tag) => {
      const profileUrn =
        tag.data?.data?.data?.identityDashProfilesByMemberIdentity?.[
          '*elements'
        ]?.[0];

      return profileUrn;
    })
    .filter((i) => i != null);

  const profileUrn = profileUrns[0];

  const profileSections = parseProfileSections(
    await linkedin.profile.getSections(profileUrn)
  );
  return { data: profileSections };
}

async function main() {
  const luma = new LumaClient(env.luma.sessionToken);

  const guests = await luma.event.getGuests('evt-KZ3GVPQwrc0OFpU', 'hzdtCD');

  const guestsWithLinkedin = guests.entries.filter((i) => i.linkedin_handle);

  const allGuestProfiles = await Promise.allSettled(
    guestsWithLinkedin.map(async (guest) => {
      return await linkedinJobQueue.execute(async () => {
        const profileData = await getProfileInfo(guest.linkedin_handle!);

        return profileData.data;
      });
    })
  );

  console.log(allGuestProfiles);

  // const openai = new OpenAI({ apiKey: env.openai.apiKey });

  // const response = await openai.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: [],
  //   temperature: 1,
  //   max_tokens: 256,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  // });
  // return response;
}
main();
