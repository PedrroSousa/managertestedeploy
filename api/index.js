const express = require('express');
const cors = require('cors');

const authRoutes = require('./authRoutes');

const inventoryRoutes = require('../labemanager-backend/src/routes/inventoryRoutes');
const financeController = require('../labemanager-backend/src/controllers/financeController');
const eventController = require('../labemanager-backend/src/controllers/eventController');
const peopleController = require('../labemanager-backend/src/controllers/peopleController');

const app = express();

/* ================= MIDDLEWARES ================= */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

/* ================= HEALTH ================= */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* ================= FINANCE ================= */
app.get('/api/finance/transactions', financeController.getAll);
app.post('/api/finance/transactions', financeController.create);
app.put('/api/finance/transactions/:id', financeController.update);
app.delete('/api/finance/transactions/:id', financeController.remove);

/* ================= CALENDAR ================= */
app.get('/api/calendar/events', eventController.getAll);
app.post('/api/calendar/events', eventController.create);
app.put('/api/calendar/events/:id', eventController.update);
app.delete('/api/calendar/events/:id', eventController.remove);

/* ================= PEOPLE ================= */
app.get('/api/pessoas', peopleController.getAll);
app.post('/api/pessoas', peopleController.create);
app.put('/api/pessoas/:id', peopleController.update);
app.delete('/api/pessoas/:id', peopleController.remove);

/* ================= ROUTES ================= */
app.use('/api', authRoutes);
app.use('/api/almoxarifado', inventoryRoutes);
app.use('/api/maquinas', inventoryRoutes);
app.use('/api/departamentos', inventoryRoutes);
app.use('/api/projetos', inventoryRoutes);
app.use('/api/artigos', inventoryRoutes);

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

console.log('[API] authRoutes:', authRoutes);


module.exports = app;
