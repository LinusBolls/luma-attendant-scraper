import Events from './events';

type Job = {
  exec: () => unknown;
  data: unknown;
  state: string;
  inserted: Date;
};

class JobQueue {
  private jobs: Record<string, Job> = {};

  public async execute<T>(exec: () => unknown): Promise<T> {
    const jobId = crypto.randomUUID();

    this.jobs[jobId] = {
      exec,
      state: 'NOT_STARTED',
      data: null,
      inserted: new Date(),
    };

    return new Promise((res) =>
      this.events.addEventListener('jobDone', (job) => {
        if (job === this.jobs[jobId]) {
          res(job.data as T);
        }
      })
    );
  }

  public async tick() {
    const job = Object.values(this.jobs).find((i) => i.state === 'NOT_STARTED');

    if (!job) return;

    job.state = 'RUNNING';

    try {
      console.log('executing job');
      job.data = await job.exec();
    } catch (err) {}

    job.state = 'DONE';

    this.events.dispatch('jobDone', job);
  }

  private events = new Events<JobQueueEvents>();
}
type JobQueueEvents = {
  jobDone: (job: Job) => void;
};

/**
 * used to throttle requests to linkedin so they don't all get made at the same time, which would trigger LinkedIn's rate limiting.
 */
export const linkedinJobQueue = new JobQueue();

setInterval(linkedinJobQueue.tick.bind(linkedinJobQueue), 200);
