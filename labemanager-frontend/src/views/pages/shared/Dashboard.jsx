// src/pages/shared/Dashboard.jsx

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import MainLayout from '../../components/layouts/MainLayout';
import DashboardCard from '../../components/common/DashboardCard';

// Data for "Circles" visualization (Mock data)
const circleIconsMock = [
    { type: 'text', alt: 'Img1', content: '' },
    { type: 'text', alt: 'Img2', content: '' }
];
// In a real app these would be images. 
// The Plus icon is built-in to the card component as the first circle.

const CARD_DATA = [
    // --- Common Cards ---
    {
        id: 'almoxarifado',
        title: 'Almoxarifado',
        route: '/almoxarifado',
        iconColor: '#7aaeb5', // Blue/Teal
        circles: circleIconsMock,
        variant: 'default',
        isAdminOnly: false
    },
    {
        id: 'maquinas',
        title: 'Máquinas',
        route: '/maquinas',
        iconColor: '#7aaeb5', // Blue/Teal
        circles: circleIconsMock,
        variant: 'default',
        isAdminOnly: false
    },
    // "Logísticas" - shown as distinct small card in design
    // Logistics removed by user request
    /*
    {
        id: 'logisticas',
        title: 'Logísticas',
        route: '/almoxarifado', // Mapping to Almoxarifado for now
        iconColor: '#fff',
        variant: 'small', // Small card
        isAdminOnly: false
    },
    */
    {
        id: 'departamentos',
        title: 'Departamentos',
        route: '/departamentos',
        iconColor: '#e8e0cc', // Beige/Sand
        circles: circleIconsMock,
        variant: 'default',
        isAdminOnly: false
    },
    {
        id: 'projetos',
        title: 'Projetos',
        route: '/projetos',
        iconColor: '#e8e0cc', // Beige/Sand
        circles: circleIconsMock,
        variant: 'default',
        isAdminOnly: false
    },
    // --- Participant Only ---
    {
        id: 'calendario',
        title: 'Calendário',
        route: '/calendario',
        iconColor: '#e8e0cc',
        variant: 'small',
        isAdminOnly: false, // In theory only participant usage in designs? But admin could see.
        isParticipantSpecific: false
    },

    // --- Admin Only ---
    {
        id: 'financeiro',
        title: 'Financeiro',
        route: '/financeiro',
        iconColor: '#fff',
        variant: 'small',
        isAdminOnly: true,
        isFinance: true
    },
    {
        id: 'relatorios',
        title: 'Relatório Geral Mensal',
        route: '/relatorios',
        iconColor: '#ff8c69',
        variant: 'wide',
        isAdminOnly: true,
        isReport: true
    },
];

const Dashboard = () => {
    const { isAdmin } = useAuth();

    // Helper to find card by ID
    const getCard = (id) => {
        const card = CARD_DATA.find(c => c.id === id);
        // Special overrides for Participant specific styling differences from Admin if any
        // Special overrides for Participant specific styling differences from Admin if any
        /*
        if (!isAdmin && id === 'logisticas') {
            // In image 2, Logistics is blue/teal and small
            return { ...card, iconColor: '#7aaeb5' };
        }
        */
        return card;
    };

    const renderAdminLayout = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
                <DashboardCard {...getCard('almoxarifado')} />
                <DashboardCard {...getCard('maquinas')} />
                <DashboardCard {...getCard('financeiro')} />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
                <DashboardCard {...getCard('departamentos')} />
                <DashboardCard {...getCard('projetos')} />
                <DashboardCard {...getCard('calendario')} />
                <DashboardCard {...getCard('relatorios')} />
            </div>
        </div>
    );

    const renderParticipantLayout = () => (
        <div className="max-w-5xl mx-auto">
            {/* Header Text Section */}
            <div className="mb-12">
                <h1 className="text-[#7aaeb5] text-3xl font-bold mb-4 max-w-2xl leading-tight">
                    Laboratório de Aprendizagem de <br />
                    Máquina e Projetos Inovadores
                </h1>

                <p className="text-black text-sm mb-6 max-w-2xl leading-relaxed font-semibold">
                    O LAMPI é um espaço para desenvolvimento de projetos inovadores que
                    causem impacto positivo na comunidade interna e externa no IFCE
                    campus Canindé.
                </p>

                <p className="text-black text-sm max-w-2xl leading-relaxed font-semibold">
                    Nesta aplicação, você tem acesso à todas informações que podem
                    interessar a um novato, visitante ou gestor. Bem-vindo(a)! :)
                </p>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-black font-sans">Saiba mais:</h2>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                    <DashboardCard {...getCard('almoxarifado')} />
                    <DashboardCard {...getCard('maquinas')} />
                    <DashboardCard {...getCard('calendario')} />
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6">
                    {/* Logistics removed
                    <div className="h-[90px]">
                        <DashboardCard {...getCard('logisticas')} />
                    </div>
                    */}
                    <DashboardCard {...getCard('departamentos')} />
                    <DashboardCard {...getCard('projetos')} />
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout>
            <div className="p-4 md:p-8 min-h-screen bg-[#f7f2ea]"> {/* Using the beige/cream background from image */}
                {isAdmin ? renderAdminLayout() : renderParticipantLayout()}
            </div>
        </MainLayout>
    );
};

export default Dashboard;
