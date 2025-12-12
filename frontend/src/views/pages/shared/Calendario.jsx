import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../models/api';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaCalendarAlt, FaClock } from 'react-icons/fa';

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const Calendario = () => {
    const { isAdmin } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDesc, setNewEventDesc] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/calendar/events');
            setEvents(response.data);
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        if (!newEventTitle) return;

        const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD

        try {
            await api.post('/calendar/events', {
                title: newEventTitle,
                description: newEventDesc,
                date: dateStr
            });
            setNewEventTitle('');
            setNewEventDesc('');
            setIsModalOpen(false);
            fetchEvents();
        } catch (error) {
            console.error("Erro ao criar evento:", error);
            alert("Erro ao criar evento.");
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este evento?")) return;
        try {
            await api.delete(`/calendar/events/${id}`);
            fetchEvents();
        } catch (error) {
            console.error("Erro ao deletar evento:", error);
        }
    };

    // Calendar Grid Logic
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);

    // Filter events for selected date
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const eventsForSelectedDate = events.filter(e => e.date === selectedDateStr);

    // Get all events for current month (for markers)
    const getEventsForDay = (day) => {
        const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        return events.filter(e => e.date === dateStr);
    };

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Calendário</h1>
                        <p className="text-gray-500 font-medium">Gestão de Eventos e Atividades</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Calendar Card */}
                    <div className="lg:col-span-2 bg-white rounded-[24px] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6">

                        {/* Month Nav */}
                        <div className="flex justify-between items-center mb-6">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
                                <FaChevronLeft size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 capitalize">
                                {MONTHS[currentDate.getMonth()]} <span className="text-gray-400">{currentDate.getFullYear()}</span>
                            </h2>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600">
                                <FaChevronRight size={20} />
                            </button>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-7 mb-2">
                            {DAYS_OF_WEEK.map(d => (
                                <div key={d} className="text-center text-sm font-bold text-gray-400 py-2 uppercase tracking-wide">
                                    {d}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {blanks.map((_, i) => (
                                <div key={`blank-${i}`} className="h-24 bg-gray-50 rounded-xl opacity-50"></div>
                            ))}
                            {daysArray.map(day => {
                                const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                                const isToday = new Date().toISOString().split('T')[0] === dateStr;
                                const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentDate.getMonth() && selectedDate.getFullYear() === currentDate.getFullYear();
                                const dayEvents = getEventsForDay(day);

                                return (
                                    <div
                                        key={day}
                                        onClick={() => handleDayClick(day)}
                                        className={`
                                            h-24 rounded-xl border-2 transition cursor-pointer relative p-2 flex flex-col justify-between
                                            ${isSelected ? 'border-black bg-[#e8e0cc]' : 'border-transparent hover:border-gray-200 bg-white hover:bg-gray-50'}
                                            ${isToday && !isSelected ? 'bg-blue-50' : ''}
                                        `}
                                    >
                                        <span className={`text-sm font-bold ${isSelected ? 'text-black' : 'text-gray-500'} ${isToday ? 'text-blue-600' : ''}`}>
                                            {day}
                                        </span>
                                        <div className="flex gap-1 flex-wrap content-end">
                                            {dayEvents.slice(0, 3).map((_, idx) => (
                                                <div key={idx} className="w-2 h-2 rounded-full bg-[#e76f51]"></div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar / Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[24px] border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-6 h-full flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-xl text-gray-800">
                                    {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()]}
                                </h3>
                                {isAdmin && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-[#7aaeb5] hover:bg-[#689aa0] text-white p-2 rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition"
                                    >
                                        <FaPlus />
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {eventsForSelectedDate.length === 0 ? (
                                    <div className="text-center text-gray-400 py-10 flex flex-col items-center">
                                        <FaCalendarAlt size={32} className="mb-2 opacity-20" />
                                        <p>Nenhum evento.</p>
                                    </div>
                                ) : (
                                    eventsForSelectedDate.map(evt => (
                                        <div key={evt.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 group relative">
                                            <h4 className="font-bold text-gray-800 mb-1">{evt.title}</h4>
                                            {evt.description && (
                                                <p className="text-sm text-gray-600 leading-relaxed">{evt.description}</p>
                                            )}
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteEvent(evt.id)}
                                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal for Check-in / Add Event */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white w-full max-w-md rounded-[24px] border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-6 animate-scaleIn">
                            <h2 className="text-2xl font-black text-gray-800 mb-6">Novo Evento</h2>
                            <form onSubmit={handleCreateEvent}>
                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
                                        <input
                                            type="text"
                                            required
                                            value={newEventTitle}
                                            onChange={e => setNewEventTitle(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black rounded-lg p-3 outline-none transition font-medium"
                                            placeholder="Ex: Reunião Geral"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                                        <textarea
                                            value={newEventDesc}
                                            onChange={e => setNewEventDesc(e.target.value)}
                                            className="w-full bg-gray-50 border-2 border-gray-200 focus:border-black rounded-lg p-3 outline-none transition font-medium h-24 resize-none"
                                            placeholder="Detalhes do evento..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                                        <div className="p-3 bg-gray-100 rounded-lg text-gray-600 font-bold border-2 border-transparent">
                                            {selectedDate.toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 font-bold text-white bg-[#e76f51] border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none rounded-xl transition"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Calendario;
