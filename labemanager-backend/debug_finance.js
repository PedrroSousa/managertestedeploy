// debug_finance.js
const db = require('./src/config/db');
const FinanceModel = require('./src/models/financeModel');

console.log('Testing Database Connection and Insert...');

const testTransaction = {
    tipo: 'DESPESA',
    valor: 50.00,
    descricao: 'Teste Manual Backend',
    data: '2025-12-12'
};

FinanceModel.add(testTransaction, (err, result) => {
    if (err) {
        console.error('❌ Insert FAILED:', err);
    } else {
        console.log('✅ Insert SUCCESS:', result);

        // Now try to read it back
        FinanceModel.getAll((err, rows) => {
            if (err) {
                console.error('❌ Read FAILED:', err);
            } else {
                console.log('✅ Read SUCCESS. Total rows:', rows.length);
                console.log('Last row:', rows[rows.length - 1]);
            }
        });
    }
});
