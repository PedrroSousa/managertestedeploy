const InventoryModel = require('../models/inventoryModel');

const getTableFromPath = (req) => {
    // Extract table name from route path, e.g., /api/almoxarifado -> almoxarifado
    const path = req.baseUrl.split('/').pop();
    return path;
};

const getAll = (req, res) => {
    const table = getTableFromPath(req);
    InventoryModel.getAll(table, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Erro ao buscar dados.' });
        res.status(200).json(rows);
    });
};

const create = (req, res) => {
    const table = getTableFromPath(req);
    console.log(`[API] Creating in ${table}. Body keys:`, Object.keys(req.body));
    console.log(`[API] Payload Check -> Lideres: "${req.body.lideres}", PDF: "${req.body.pdfUrl}"`);

    const { nome, descricao } = req.body;

    // Validation: Description is optional for 'artigos'
    const isArticle = table === 'artigos';
    if (!nome || (!isArticle && !descricao)) {
        return res.status(400).json({ message: isArticle ? 'Título é obrigatório.' : 'Nome e Descrição são obrigatórios.' });
    }

    InventoryModel.add(table, req.body, (err, data) => {
        if (err) {
            console.error('[API] Error saving:', err.message);
            return res.status(500).json({ message: 'Erro ao salvar.' });
        }
        console.log('[API] Saved successfully:', data.id);
        res.status(201).json(data);
    });
};

const update = (req, res) => {
    const table = getTableFromPath(req);
    const { id } = req.params;
    console.log(`[API] Updating ${table} ID ${id}. Lideres: ${req.body.lideres}`);

    InventoryModel.update(table, id, req.body, (err) => {
        if (err) {
            console.error('[API] Error updating:', err.message);
            return res.status(500).json({ message: 'Erro ao atualizar.' });
        }
        res.status(200).json({ message: 'Atualizado com sucesso.' });
    });
};

const remove = (req, res) => {
    const table = getTableFromPath(req);
    const { id } = req.params;
    InventoryModel.delete(table, id, (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao deletar.' });
        res.status(200).json({ message: 'Removido com sucesso.' });
    });
};

module.exports = {
    getAll,
    create,
    update,
    remove
};
