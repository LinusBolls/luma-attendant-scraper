import fs from "fs"

import { env } from 'env';
import type { FastifyInstance } from 'fastify';
import { linkedinJobQueue } from 'jobQueue';
import { LinkedinClient } from 'linkedin';
import { parseCodeTags } from 'linkedin/parseCodeTags';
import { parseProfileSections } from 'linkedin/requests/getProfileSections';
import { LumaClient } from 'luma';
import { parse as parseHtml } from 'node-html-parser';

const parseEventIdFromLumaUrl = (url: string): string | null => {
  try {
    const match = new URL(url).pathname.replace(/\//g, '');

    return match;
  } catch (err) {
    throw new Error('failed to parse event id from luma url: ' + url);
  }
};

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

  if (!profileUrn) {
    throw new Error("[getProfileInfo] failed to get profile urn");
  }
  const rawProfile = await linkedin.profile.getSections(profileUrn)

  const profileSections = parseProfileSections(rawProfile);

  return { data: profileSections };
}

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/health', async (_, reply) => {
    reply.send({ data: { ok: true } });
  });
  fastify.post('/get-event-data', async (req, reply) => {
    try {
      const eventUrl = (req.body as any).eventUrl;

      // account for the client directly sending an eventId instead of a full URL
      const eventId = eventUrl.includes('/')
        ? parseEventIdFromLumaUrl(eventUrl)!
        : eventUrl;

      const authToken = (req.body as any).authToken;

      if (!eventId || !authToken) {
        reply.code(400).send({
          error: {
            message: 'Bad Request',
          },
        });
        return;
      }

      const luma = new LumaClient(authToken);

      const event = await luma.event.getEvent(eventId);

      if (!event.ticketKey) {
        reply.code(403).send({
          error: {
            message: 'Failed to get ticket key for event',
          },
        });
        return;
      }

      const lumaGuests = await luma.event.getGuests(
        event.eventId,
        event.ticketKey
      );

      const guests = await Promise.allSettled(
        lumaGuests.entries.map(async (guest) => {
          if (!guest.linkedin_handle) {
            return { luma: guest, linkedin: null };
          }
          return await linkedinJobQueue.execute(async () => {
            const profileData = await getProfileInfo(guest.linkedin_handle!);

            return { luma: guest, linkedin: profileData.data };
          });
        })
      );

      reply.send({ data: { guests } });
      // eslint-disable-next-line
    } catch (err) {
      console.error(err);
      reply.code(500).send({
        error: {
          message: 'Internal Server Error',
        },
      });
    }
  });
}
