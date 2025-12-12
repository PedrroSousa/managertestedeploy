const FinanceModel = require('../models/financeModel');

const getAll = (req, res) => {
    FinanceModel.getAll((err, rows) => {
        if (err) return res.status(500).json({ message: 'Erro ao buscar transações.' });
        res.status(200).json(rows);
    });
};

const create = (req, res) => {
    console.log('[FINANCEIRO] Create request body:', req.body);
    const { tipo, valor, descricao, data } = req.body;

    if (!tipo || valor === undefined || valor === '' || !descricao || !data) {
        console.error('[FINANCEIRO] Missing fields:', { tipo, valor, descricao, data });
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.', received: req.body });
    }

    FinanceModel.add(req.body, (err, result) => {
        if (err) {
            console.error('[FINANCEIRO] DB Error:', err);
            return res.status(500).json({ message: 'Erro ao salvar transação.', error: err.message });
        }
        console.log('[FINANCEIRO] Saved success:', result);
        res.status(201).json(result);
    });
};

const update = (req, res) => {
    const { id } = req.params;
    FinanceModel.update(id, req.body, (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao atualizar transação.' });
        res.status(200).json({ message: 'Transação atualizada com sucesso.' });
    });
};

const remove = (req, res) => {
    const { id } = req.params;
    FinanceModel.delete(id, (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao deletar transação.' });
        res.status(200).json({ message: 'Transação removida com sucesso.' });
    });
};

module.exports = {
    getAll,
    create,
    update,
    remove
};
