import { env } from 'env';
import { LinkedinClient } from 'linkedin';
import { parseCodeTags } from 'linkedin/parseCodeTags';
import { parseProfileSections } from 'linkedin/requests/getProfileSections';
import { parse as parseHtml } from 'node-html-parser';

export async function getLinkedinProfile(linkedinHandle: string) {
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

  if (!profileUrn) {
    throw new Error('[getProfileInfo] failed to get profile urn');
  }
  const rawProfile = await linkedin.profile.getSections(profileUrn);

  const profileSections = parseProfileSections(rawProfile);

  return { data: profileSections };
}
