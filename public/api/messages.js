// messages.js

// Temporary in-memory storage for messages
const messages = [];

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle POST request to send a new message
    const { username, text } = req.body;

    if (!username || !text) {
      return res.status(400).json({ error: 'Username and text are required.' });
    }

    const newMessage = { username, text, timestamp: new Date().toISOString() };
    messages.push(newMessage);

    return res.status(200).json({ message: 'Message sent!', newMessage });
  } else if (req.method === 'GET') {
    // Handle GET request to retrieve all messages
    return res.status(200).json({ messages });
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
