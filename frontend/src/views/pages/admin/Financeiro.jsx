// src/pages/admin/Financeiro.jsx

import React from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import FinanceForm from '../../components/finance/FinanceForm';
import { useFinanceController } from '../../../controllers/useFinanceController';
import { FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaCoins } from 'react-icons/fa';

const Financeiro = () => {
    const {
        transactions,
        loading,
        totalBalance: _unused, // Ignore controller balance, calc here for safety
        isFormOpen,
        transactionToEdit,
        handleOpenForm,
        handleCloseForm,
        handleSuccess,
        handleDelete
    } = useFinanceController();

    // CALCULO DO SALDO: RECEITA - DESPESA
    const saldoAtual = transactions.reduce((acc, t) => {
        const valor = parseFloat(t.valor || 0);
        if (t.tipo === 'RECEITA') return acc + valor;
        if (t.tipo === 'DESPESA') return acc - valor;
        return acc;
    }, 0);

    const TransactionLine = ({ t }) => {
        const isReceita = t.tipo === 'RECEITA';
        const colorClass = isReceita ? 'text-green-600' : 'text-red-600';
        const bgClass = isReceita ? 'bg-green-100' : 'bg-red-100';
        const icon = isReceita ? <FaArrowUp /> : <FaArrowDown />;
        const symbol = isReceita ? '+' : '-';

        return (
            <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${bgClass} ${colorClass}`}>
                        {icon}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-lg">{t.descricao}</p>
                        <div className="text-sm text-gray-500 font-medium flex items-center gap-2">
                            <span>{new Date(t.data).toLocaleDateString()}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className={`${colorClass} uppercase text-xs font-bold`}>{t.tipo}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <span className={`text-xl font-bold ${colorClass}`}>
                        {symbol} R$ {parseFloat(t.valor).toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => handleOpenForm(t)} className="p-2 text-gray-400 hover:text-blue-600 transition"><FaEdit size={18} /></button>
                        <button onClick={() => handleDelete(t.id)} className="p-2 text-gray-400 hover:text-red-600 transition"><FaTrash size={18} /></button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto p-6 md:p-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Financeiro</h1>
                        <p className="text-gray-500 font-medium">Controle de Receitas e Despesas</p>
                    </div>
                    <button
                        onClick={() => handleOpenForm(null)}
                        className="bg-[#e76f51] hover:brightness-110 text-white border-2 border-black py-3 px-6 rounded-xl font-bold shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
                    >
                        <FaPlus /> Nova Transação
                    </button>
                </div>

                {/* Saldo Card */}
                <div className="bg-white p-8 rounded-[24px] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] mb-10 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Saldo Atual</p>
                        <h2 className={`text-6xl font-black tracking-tighter ${saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            R$ {saldoAtual.toFixed(2)}
                        </h2>
                    </div>
                    <FaCoins className="absolute -right-6 -bottom-6 text-9xl text-gray-100 transform -rotate-12 z-0" />
                </div>

                {/* Lista */}
                <div className="bg-white border-2 border-black rounded-[24px] overflow-hidden shadow-sm">
                    <div className="bg-gray-50 p-4 border-b-2 border-gray-100">
                        <h3 className="font-bold text-gray-600 uppercase text-sm tracking-wide">Extrato Recente</h3>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-gray-500 font-medium">Carregando...</div>
                    ) : transactions.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {transactions.map(t => <TransactionLine key={t.id} t={t} />)}
                        </div>
                    ) : (
                        <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                            <FaCoins size={48} className="mb-4 opacity-20" />
                            <p className="font-bold text-lg">Nenhuma transação.</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="w-full max-w-lg animate-scaleIn">
                            <FinanceForm
                                dataToEdit={transactionToEdit}
                                onSuccess={handleSuccess}
                                onClose={handleCloseForm}
                            />
                        </div>
                    </div>
                )}

            </div>
        </MainLayout>
    );
};

export default Financeiro;
