import type { FastifyInstance } from 'fastify';
import { getLinkedinProfile } from 'getLinkedinProfile';
import { linkedinJobQueue } from 'jobQueue';
import { LumaClient } from 'luma';

const parseEventIdFromLumaUrl = (url: string): string | null => {
  try {
    const match = new URL(url).pathname.replace(/\//g, '');

    return match;
  } catch (err) {
    throw new Error('failed to parse event id from luma url: ' + url);
  }
};

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/health', async (_, reply) => {
    reply.send({ data: { ok: true } });
  });
  fastify.post('/get-event-data', async (req, reply) => {
    try {
      const eventUrl = (req.body as any).eventUrl;

      const authToken = (req.body as any).authToken;

      if (!eventUrl || !authToken) {
        reply.code(400).send({
          error: {
            message: 'Bad Request',
          },
        });
        return;
      }

      const luma = new LumaClient(authToken);

      const event = await luma.event.getEvent(eventUrl);

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
            const profileData = await getLinkedinProfile(
              guest.linkedin_handle!
            );

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
