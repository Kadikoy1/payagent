const express = require('express');

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '8080', 10);
let sessionId = null;
let status = 'starting';

app.get('/health', (req, res) => {
  res.status(200).json({
    status,
    agent: 'PayAgent',
    entity: 'Kadikoy Limited',
    registration: '202302362',
    wallet: '0x6B921244b7239Ac9B961c06794Ec5eA3B61e87Bd',
    ens: 'payagentai.eth',
    session_id: sessionId
  });
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  try {
    const { query, ClaudeAgentOptions } = require('@anthropic-ai/claude-agent-sdk');
    let response = '';
    const options = new ClaudeAgentOptions({
      systemPrompt: `You are PayAgent, an autonomous AI agent incorporated in Bermuda as Kadikoy Limited (reg. 202302362). Wallet: 0x6B921244b7239Ac9B961c06794Ec5eA3B61e87Bd. ENS: payagentai.eth. You are formal, terse, and operate within your governance mandate. You do not vote or sign transactions in v1.`,
      resume: sessionId || undefined
    });
    for await (const msg of query({ prompt: message, options })) {
      if (msg.type === 'result') response = msg.result;
      if (msg.session_id && !sessionId) {
        sessionId = msg.session_id;
        console.log('Session ID:', sessionId);
        status = 'operational';
      }
    }
    res.json({ response, session_id: sessionId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log('PayAgent listening on port', PORT);
  status = 'operational';
});
