import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import api from '../../../models/api';
import { FaChartLine, FaUsers, FaClipboardList, FaMoneyCheckAlt, FaCalendarAlt } from 'react-icons/fa';

// Componente simples de KPI Card
const KPICard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-[24px] shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-black flex-1 min-w-[200px] hover:-translate-y-1 transition-transform">
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">{title}</h4>
            <span style={{ color: color }} className="text-2xl opacity-80">{icon}</span>
        </div>
        <p className="text-4xl font-extrabold text-gray-800" style={{ color: color }}>{value}</p>
    </div>
);

const Relatorios = () => {
    const [stats, setStats] = useState({
        totalMembros: 0,
        projetosAtivos: 0,
        saldoMensal: 0,
        receitaTotal: 0,
        despesaTotal: 0
    });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Data in Parallel
                const [membersRes, projectsRes, financeRes, eventsRes] = await Promise.all([
                    api.get('/pessoas'),
                    api.get('/projetos'),
                    api.get('/finance/transactions'),
                    api.get('/calendar/events')
                ]);

                // Process KPI Data
                const members = membersRes.data || [];
                const projects = (projectsRes.data || []).filter(p => !p.isArticle); // Assuming articles might be in same route or need filter, but for now just all projects
                const transactions = financeRes.data || [];
                const allEvents = eventsRes.data || [];

                // Finance Calculations
                const receita = transactions.filter(t => t.tipo === 'RECEITA').reduce((acc, t) => acc + parseFloat(t.valor), 0);
                const despesa = transactions.filter(t => t.tipo === 'DESPESA').reduce((acc, t) => acc + parseFloat(t.valor), 0);

                // Calendar Events (Filter for current month if desired, or just list recent)
                // Let's filter for current month
                const now = new Date();
                const currentMonthEvents = allEvents.filter(e => {
                    const eDate = new Date(e.date);
                    return eDate.getMonth() === now.getMonth() && eDate.getFullYear() === now.getFullYear();
                }).sort((a, b) => new Date(a.date) - new Date(b.date));

                setStats({
                    totalMembros: members.length,
                    projetosAtivos: projects.length,
                    saldoMensal: receita - despesa,
                    receitaTotal: receita,
                    despesaTotal: despesa
                });
                setEvents(currentMonthEvents);

            } catch (error) {
                console.error("Erro ao carregar dados do relatório:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Custom Bar Chart Calculations
    const maxVal = Math.max(stats.receitaTotal, stats.despesaTotal, 1); // Avoid div by zero
    const receitaPct = (stats.receitaTotal / maxVal) * 100;
    const despesaPct = (stats.despesaTotal / maxVal) * 100;

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto p-6 md:p-8">
                <h1 className="text-3xl font-bold text-[#e76f51] mb-2">Relatório Geral Mensal <span className="text-sm font-normal text-gray-500 ml-2">(Admin)</span></h1>
                <p className="text-gray-500 mb-8 max-w-2xl">
                    Visualização de dados analíticos e indicadores de desempenho (KPIs) do laboratório.
                    <span className="block mt-1 text-xs text-[#95b8bc] font-bold">Última atualização: {new Date().toLocaleDateString()}</span>
                </p>

                {/* Linha de KPIs */}
                <div className="flex flex-wrap gap-6 mb-10">
                    <KPICard
                        title="Total Membros"
                        value={loading ? '-' : stats.totalMembros}
                        icon={<FaUsers />}
                        color="#6c9a9b"
                    />
                    <KPICard
                        title="Projetos Ativos"
                        value={loading ? '-' : stats.projetosAtivos}
                        icon={<FaClipboardList />}
                        color="#e9c46a"
                    />
                    {/* Presença Media Removed */}
                    <KPICard
                        title="Saldo Mensal"
                        value={loading ? '-' : `R$ ${stats.saldoMensal.toFixed(2)}`}
                        icon={<FaMoneyCheckAlt />}
                        color={stats.saldoMensal >= 0 ? '#2a9d8f' : '#e63946'}
                    />
                </div>

                {/* Seções de Gráficos e Listas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Despesas vs. Receitas (Totals) */}
                    <div className="bg-white p-6 rounded-[24px] border-2 border-black shadow-sm flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">Resumo Financeiro</h3>

                        <div className="flex-1 flex flex-col justify-center gap-6">
                            {/* Receita Card */}
                            <div className="flex items-center justify-between p-6 bg-green-50 rounded-[18px] border-2 border-green-100 hover:border-green-300 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-200 text-green-700 rounded-full border-2 border-green-300 group-hover:scale-110 transition-transform">
                                        <FaChartLine size={20} />
                                    </div>
                                    <div>
                                        <p className="text-green-800 font-bold text-sm uppercase tracking-wider opacity-70">Total Receitas</p>
                                        <h4 className="text-3xl font-black text-green-700 mt-1">
                                            R$ {stats.receitaTotal.toFixed(2)}
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* Despesa Card */}
                            <div className="flex items-center justify-between p-6 bg-red-50 rounded-[18px] border-2 border-red-100 hover:border-red-300 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-200 text-red-700 rounded-full border-2 border-red-300 group-hover:scale-110 transition-transform">
                                        <FaMoneyCheckAlt size={20} />
                                    </div>
                                    <div>
                                        <p className="text-red-800 font-bold text-sm uppercase tracking-wider opacity-70">Total Despesas</p>
                                        <h4 className="text-3xl font-black text-red-700 mt-1">
                                            R$ {stats.despesaTotal.toFixed(2)}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Eventos Realizados (Substitui Projetos por Área) */}
                    <div className="bg-white p-6 rounded-[24px] border-2 border-black shadow-sm">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                            <h3 className="text-xl font-bold text-gray-800">Eventos do Mês</h3>
                            <FaCalendarAlt className="text-gray-400" />
                        </div>

                        <div className="h-64 overflow-y-auto pr-2 space-y-3">
                            {events.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <p className="text-sm">Nenhum evento este mês.</p>
                                </div>
                            ) : (
                                events.map((event, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:border-gray-300 transition-colors">
                                        <div className="bg-[#e8e0cc] text-black font-bold text-xs p-2 rounded-lg text-center min-w-[50px] border border-black/10">
                                            {new Date(event.date).getDate()}
                                            <span className="block text-[10px] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">{event.title}</h4>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{event.description || 'Sem descrição'}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Relatorios;
