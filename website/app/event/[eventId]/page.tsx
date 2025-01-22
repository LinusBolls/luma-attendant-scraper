

export default function EventPage({ params }: { params: { eventId: string } }) {
  return (
    <div>
      <h1>Event Page</h1>
      <p>Event ID: {params.eventId}</p>
    </div>
  );
}