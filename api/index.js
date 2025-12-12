const express = require('express');
const cors = require('cors');

const authRoutes = require('../labemanager-backend/src/routes/authRoutes');
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
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* ================= FINANCE ================= */
app.get('/finance/transactions', financeController.getAll);
app.post('/finance/transactions', financeController.create);
app.put('/finance/transactions/:id', financeController.update);
app.delete('/finance/transactions/:id', financeController.remove);

/* ================= CALENDAR ================= */
app.get('/calendar/events', eventController.getAll);
app.post('/calendar/events', eventController.create);
app.put('/calendar/events/:id', eventController.update);
app.delete('/calendar/events/:id', eventController.remove);

/* ================= PEOPLE ================= */
app.get('/pessoas', peopleController.getAll);
app.post('/pessoas', peopleController.create);
app.put('/pessoas/:id', peopleController.update);
app.delete('/pessoas/:id', peopleController.remove);

/* ================= ROUTES ================= */
app.use('/auth', authRoutes);
app.use('/almoxarifado', inventoryRoutes);
app.use('/maquinas', inventoryRoutes);
app.use('/departamentos', inventoryRoutes);
app.use('/projetos', inventoryRoutes);
app.use('/artigos', inventoryRoutes);

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

module.exports = app;
