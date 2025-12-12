// src/components/common/FinanceForm.jsx

import React, { useState } from 'react';
// We are temporarily bypassing the model to ensure direct connectivity
// import { addTransaction, updateTransaction } from '../../../models/finance';
import { FaCalendarAlt, FaMoneyBillWave, FaList, FaTag } from 'react-icons/fa';

const FinanceForm = ({ dataToEdit, onSuccess, onClose }) => {
    const isEditing = !!dataToEdit;

    // Estado do formulário
    const [formData, setFormData] = useState({
        tipo: 'DESPESA',
        valor: '',
        descricao: '',
        data: new Date().toISOString().substring(0, 10),
        ...dataToEdit
    });

    // Handle number-to-string conversion for inputs
    if (isEditing && typeof formData.valor === 'number') {
        formData.valor = formData.valor.toString();
    }

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // DIRECT FETCH IMPLEMENTATION (Bypassing axios/interceptors for reliability)
    const directSave = async (payload) => {
        const token = localStorage.getItem('token');
        const baseUrl = 'http://127.0.0.1:9090/api/finance/transactions';

        const url = isEditing ? `${baseUrl}/${dataToEdit.id}` : baseUrl;
        const method = isEditing ? 'PUT' : 'POST';

        console.log(`[FinanceForm] Sending ${method} to ${url}`, payload);

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const textResponse = await response.text();
        console.log('[FinanceForm] Server Response:', textResponse);

        if (!response.ok) {
            let errorMessage = `Erro ${response.status}: ${response.statusText}`;
            try {
                // Try to parse JSON error if possible
                const json = JSON.parse(textResponse);
                if (json.message) errorMessage = json.message;
            } catch (e) {
                // If not JSON, use the raw text (likely HTML error from Express)
                errorMessage = textResponse.substring(0, 150); // Truncate if too long
            }
            throw new Error(errorMessage);
        }

        return JSON.parse(textResponse);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.valor || !formData.descricao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...formData,
                valor: parseFloat(formData.valor)
            };

            // Call Direct Fetch
            await directSave(payload);

            alert('Transação salva com sucesso!');
            onSuccess();
        } catch (err) {
            console.error("Erro ao salvar:", err);
            alert(`Erro ao salvar: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#e76f51] focus:bg-white transition-all font-medium text-gray-700 placeholder-gray-400";
    const labelClass = "block text-sm font-bold text-gray-600 mb-1 ml-1";

    return (
        <div className="bg-white w-full rounded-[30px] border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 relative overflow-hidden">
            <h3 className="text-3xl font-black text-[#e76f51] mb-6 border-b-2 border-gray-100 pb-3">
                {isEditing ? 'Editar Transação' : 'Nova Transação'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Tipo de Transação */}
                <div>
                    <label className={labelClass}>Tipo</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <FaList />
                        </div>
                        <select
                            name="tipo"
                            value={formData.tipo}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="DESPESA">Despesa (Gasto)</option>
                            <option value="RECEITA">Receita (Entrada)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Valor */}
                    <div>
                        <label className={labelClass}>Valor (R$)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaMoneyBillWave />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                name="valor"
                                value={formData.valor}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    {/* Data */}
                    <div>
                        <label className={labelClass}>Data</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <FaCalendarAlt />
                            </div>
                            <input
                                type="date"
                                name="data"
                                value={formData.data}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Descrição */}
                <div>
                    <label className={labelClass}>Descrição</label>
                    <div className="relative">
                        <div className="absolute top-4 left-3 text-gray-400">
                            <FaTag />
                        </div>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Ex: Compra de filamentos, Venda de kit..."
                            className={`${inputClass} pl-10 h-24 resize-none`}
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4 mt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border-2 border-black font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl border-2 border-black font-bold text-white bg-[#e76f51] hover:brightness-110 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default FinanceForm;