import type { FastifyInstance } from 'fastify';
import { getLinkedinProfile } from 'getLinkedinProfile';
import { linkedinJobQueue } from 'jobQueue';
import { LumaClient, LumaGuest } from 'luma';

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

      let event: { eventId: string; ticketKey: string };

      try {
        event = await luma.event.getEvent(eventUrl);
      } catch (err) {
        reply.code(502).send({
          error: {
            message: 'Failed to get event id or ticket key for event',
          },
        });
      }

      let lumaGuests: LumaGuest[];

      try {
        lumaGuests = await luma.event.getAllGuests(
          event!.eventId,
          event!.ticketKey
        );
      } catch (err) {
        reply.code(502).send({
          error: {
            message: 'Failed to get event id or ticket key for event',
          },
        });
      }

      const guests = await Promise.all(
        lumaGuests!.map(async (guest) => {
          if (!guest.linkedin_handle) {
            return { luma: guest, linkedin: null };
          }
          try {
            return await linkedinJobQueue.execute(async () => {
              const profileData = await getLinkedinProfile(
                guest.linkedin_handle!
              );

              return { luma: guest, linkedin: profileData.data };
            });
          } catch (err) {
            console.error(
              'Failed to get linkedin profile for guest:',
              guest,
              err
            );
            return { luma: guest, linkedin: null };
          }
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
