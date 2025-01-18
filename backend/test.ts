const authToken = 'usr-AkoQfAUWXN1KLyH.2cy8cwiqkbj5yb0xiapy';

const eventUrl = 'https://lu.ma/bkevcvsk';

const res = await fetch('http://127.0.0.1:5000/api/v1/get-event-data', {
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
  method: 'POST',
  body: JSON.stringify({ eventUrl, authToken }),
});

const data = await res.json();

console.log(data);
