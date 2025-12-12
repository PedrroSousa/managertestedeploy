
// src/pages/shared/Conta.jsx

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layouts/MainLayout';
import { useAuth } from '../../../context/AuthContext';
import { getProfile, updateProfile } from '../../../models/profile';
import { FaUserCircle, FaLock, FaCheckCircle } from 'react-icons/fa';

// Reutilização de estilos
const inputStyle = { width: '100%', padding: '10px', margin: '8px 0 15px 0', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', color: '#fff' };

const Conta = () => {
    const { userRole } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    // Estado para formulários
    const [profileData, setProfileData] = useState({ fullName: '', email: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await getMyProfile();
            setProfile(data);
            setProfileData({ fullName: data.fullName, email: data.email });
        } catch (error) {
            setError('Falha ao carregar dados do perfil.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Reseta mensagens de erro/sucesso após 5 segundos
    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error]);


    // --- 1. Atualização de Perfil (Nome/Email) ---
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccessMessage('');

        try {
            await updateMyProfile(profileData);
            setSuccessMessage('Perfil atualizado com sucesso!');
            // O ideal seria refetchProfile para atualizar o Header, mas simplificamos aqui
            fetchProfile();
        } catch (err) {
            setError(err.message || 'Erro ao atualizar perfil.');
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Alteração de Senha ---
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setSuccessMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('A nova senha e a confirmação não coincidem.');
            setLoading(false);
            return;
        }

        try {
            await updateMyPassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            setSuccessMessage('Senha alterada com sucesso!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }); // Limpa campos
        } catch (err) {
            setError(err.message || 'Erro ao alterar senha. Verifique a senha antiga.');
        } finally {
            setLoading(false);
        }
    };

    const StatusMessage = ({ message, type }) => (
        <div style={{ padding: '10px', borderRadius: '5px', marginBottom: '15px', color: type === 'success' ? '#155724' : '#721c24', backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da', display: 'flex', alignItems: 'center' }}>
            <FaCheckCircle style={{ marginRight: '10px' }} /> {message}
        </div>
    );

    if (loading) return <MainLayout><p>Carregando dados da conta...</p></MainLayout>;


    return (
        <MainLayout>
            <h1 style={{ color: '#6c9a9b' }}>Conta Pessoal</h1>
            <p style={{ color: '#888', marginBottom: '30px' }}>Gerencie suas informações e credenciais de acesso.</p>

            {successMessage && <StatusMessage message={successMessage} type="success" />}
            {error && <StatusMessage message={error} type="error" />}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>

                {/* === SEÇÃO 1: DETALHES DO PERFIL === */}
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', border: '1px solid #ccc' }}>
                    <h3 style={{ color: '#6c9a9b', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <FaUserCircle style={{ marginRight: '10px' }} /> Dados Pessoais
                    </h3>

                    <form onSubmit={handleProfileSubmit}>
                        <label style={{ color: '#666' }}>Nome Completo:</label>
                        <input
                            name="fullName"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                            style={inputStyle}
                            required
                        />

                        <label style={{ color: '#666' }}>E-mail:</label>
                        <input
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            style={inputStyle}
                            required
                        />

                        <p style={{ color: '#e76f51', fontWeight: 'bold' }}>
                            Cargo/Nível: {userRole}
                        </p>

                        <button type="submit" style={{ ...buttonStyle, backgroundColor: '#95b8bc', marginTop: '10px' }} disabled={loading}>
                            {loading ? 'Salvando...' : 'Atualizar Perfil'}
                        </button>
                    </form>
                </div>

                {/* === SEÇÃO 2: ALTERAR SENHA === */}
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', border: '1px solid #ccc' }}>
                    <h3 style={{ color: '#6c9a9b', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <FaLock style={{ marginRight: '10px' }} /> Alterar Senha
                    </h3>

                    <form onSubmit={handlePasswordSubmit}>
                        <label style={{ color: '#666' }}>Senha Antiga:</label>
                        <input
                            type="password"
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                            style={inputStyle}
                            required
                        />

                        <label style={{ color: '#666' }}>Nova Senha:</label>
                        <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            style={inputStyle}
                            required
                        />

                        <label style={{ color: '#666' }}>Confirme Nova Senha:</label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            style={inputStyle}
                            required
                        />

                        <button type="submit" style={{ ...buttonStyle, backgroundColor: '#e76f51', marginTop: '10px' }} disabled={loading}>
                            {loading ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                    </form>
                </div>

            </div>
        </MainLayout>
    );
};

export default Conta;