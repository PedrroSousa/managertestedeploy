// src/routes/PrivateRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rotas.
 * @param {Object} props - Propriedades do componente.
 * @param {React.Component} props.Component - O componente da página a ser renderizado.
 * @param {boolean} props.isAdminRequired - Se a rota exige a role de Administrador.
 */
const PrivateRoute = ({ Component, isAdminRequired, ...rest }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // 1. Usuário NÃO AUTENTICADO: Redireciona para a tela de login.
    return <Navigate to="/login" replace />;
  }

  if (isAdminRequired && !isAdmin) {
    // 2. Usuário AUTENTICADO mas NÃO é ADMIN: Redireciona para o dashboard (acesso comum).
    // Esta é a regra de segurança para Financeiro e Relatórios.
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Usuário AUTENTICADO e AUTORIZADO: Renderiza o componente da página.
  return <Component {...rest} />;
};

export default PrivateRoute;