const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tickets',   require('./routes/tickets'));
app.use('/api/analytics', require('./routes/analytics'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'Srijan Nirvana ITSM' }));

// Serve frontend build in production
const FRONTEND_BUILD = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(FRONTEND_BUILD));
app.get('*', (_, res) => res.sendFile(path.join(FRONTEND_BUILD, 'index.html')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Srijan Nirvana ITSM backend running on http://localhost:${PORT}`);
});
