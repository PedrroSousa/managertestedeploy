// src/routes/AppRoutes.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Importação das Páginas Públicas
import Home from '../views/pages/public/Home';
import Login from '../views/pages/public/Login';
import Register from '../views/pages/public/Register';
import NotFound from '../views/pages/public/NotFound';

// Importação das Páginas Compartilhadas e Admin (usaremos o mesmo arquivo por enquanto)
import Dashboard from '../views/pages/shared/Dashboard';
import Almoxarifado from '../views/pages/shared/Almoxarifado';
import Departamentos from '../views/pages/shared/Departamentos';
import Maquinas from '../views/pages/shared/Maquinas';
import Projetos from '../views/pages/shared/Projetos';
import Membros from '../views/pages/shared/Membros';
import Calendario from '../views/pages/shared/Calendario';

// Importação das Páginas APENAS Admin
import Financeiro from '../views/pages/admin/Financeiro';
import Relatorios from '../views/pages/admin/Relatorios';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ======================================= */}
      {/* ROTAS PÚBLICAS (Sem Autenticação)        */}
      {/* ======================================= */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />

      {/* ======================================= */}
      {/* ROTAS RESTRITAS (Todos os Usuários)    */}
      {/* ======================================= */}

      {/* O Dashboard é a primeira página restrita após o login */}
      <Route path="/dashboard" element={<PrivateRoute Component={Dashboard} isAdminRequired={false} />} />

      {/* Módulos Compartilhados (Acesso para todos, mas só Admin edita) */}
      <Route path="/almoxarifado" element={<PrivateRoute Component={Almoxarifado} isAdminRequired={false} />} />
      <Route path="/departamentos" element={<PrivateRoute Component={Departamentos} isAdminRequired={false} />} />
      <Route path="/maquinas" element={<PrivateRoute Component={Maquinas} isAdminRequired={false} />} />
      <Route path="/projetos" element={<PrivateRoute Component={Projetos} isAdminRequired={false} />} />
      <Route path="/membros" element={<PrivateRoute Component={Membros} isAdminRequired={false} />} />
      <Route path="/calendario" element={<PrivateRoute Component={Calendario} isAdminRequired={false} />} />

      {/* ======================================= */}
      {/* ROTAS APENAS ADMIN                     */}
      {/* ======================================= */}

      {/* Financeiro e Relatórios SÓ são acessíveis se isAdminRequired=true */}
      <Route path="/financeiro" element={<PrivateRoute Component={Financeiro} isAdminRequired={true} />} />
      <Route path="/relatorios" element={<PrivateRoute Component={Relatorios} isAdminRequired={true} />} />

      {/* ======================================= */}
      {/* ROTA NÃO ENCONTRADA (404)              */}
      {/* ======================================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;