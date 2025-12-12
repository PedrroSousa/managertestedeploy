const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const financeController = require('./src/controllers/financeController');
const eventController = require('./src/controllers/eventController');
const peopleController = require('./src/controllers/peopleController');

const server = express();
const PORT = 9090;

// === 1. MIDDLEWARES ===
server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ limit: '50mb', extended: true }));

// Manual CORS to be absolutely sure
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

server.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Debug Logger
server.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

// Connectivity Test
server.get('/', (req, res) => {
    res.send('Backend Online - Root Route Working');
});

// === 2. FINANCE ROUTES (High Priority) ===
// Explicitly defined to ensure they are registered first
console.log('[SERVER] Registering Priority Finance Routes...');
server.get('/api/finance/transactions', financeController.getAll);
server.post('/api/finance/transactions', financeController.create);
server.put('/api/finance/transactions/:id', financeController.update);
server.delete('/api/finance/transactions/:id', financeController.remove);

// === 2.1 CALENDAR ROUTES ===
console.log('[SERVER] Registering Calendar Routes...');
server.get('/api/calendar/events', eventController.getAll);
server.post('/api/calendar/events', eventController.create);
server.put('/api/calendar/events/:id', eventController.update);
server.delete('/api/calendar/events/:id', eventController.remove);

// === 2.2 PEOPLE ROUTES ===
console.log('[SERVER] Registering People Routes...');
server.get('/api/pessoas', peopleController.getAll);
server.post('/api/pessoas', peopleController.create);
server.put('/api/pessoas/:id', peopleController.update);
server.delete('/api/pessoas/:id', peopleController.remove);

// === 3. OTHER ROUTES ===
server.use('/api/auth', authRoutes);
server.use('/api/almoxarifado', inventoryRoutes);
server.use('/api/maquinas', inventoryRoutes);
server.use('/api/departamentos', inventoryRoutes);
server.use('/api/projetos', inventoryRoutes);
server.use('/api/artigos', inventoryRoutes);

// === 4. ERROR HANDLING ===

// 404 Handler (Route not found)
server.use((req, res, next) => {
    console.error(`[404 NOT FOUND] ${req.method} ${req.url}`);
    res.status(404).json({
        message: 'Rota não encontrada.',
        path: req.url,
        method: req.method
    });
});

// 500 Handler (Server Error / Crash)
server.use((err, req, res, next) => {
    console.error('[500 SERVER ERROR]', err);
    res.status(500).json({
        message: 'Erro interno do servidor.',
        error: err.message
    });
});

// === 5. START UP ===
server.listen(PORT, () => {
    console.log(`Servidor Node.js rodando na porta ${PORT}`);
    console.log(`[v2.2 STABLE] Finance Routes Active.`);
});
