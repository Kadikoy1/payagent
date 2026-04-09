const express = require('express');

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000', 10);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'operational', agent: 'PayAgent' });
});

app.listen(PORT, () => {
  console.log('PayAgent listening on port', PORT);
});
