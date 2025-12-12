import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const linkClass = (path, extraClass = '') => `
    block px-4 py-2 text-base font-semibold transition-colors duration-200 
    ${isActive(path) ? 'text-lampi-dark border-l-4 border-lampi-dark bg-gray-50 md:bg-transparent md:border-l-0 md:border-b-2' : 'text-lampi-text hover:text-lampi-green'} 
    ${extraClass}
    md:inline-block md:py-0 md:mx-4
  `;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 relative">
      {/* Main Bar */}
      <div className="flex justify-between items-center px-8 py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-lampi-dark tracking-tight">
          Lampi<span className="text-lampi-green">Manager</span>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-lampi-dark focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Nav (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center">
          <Link to="/dashboard" className={linkClass('/dashboard')}>Laboratório</Link>
          <Link to="/membros" className={linkClass('/membros')}>Membros</Link>
          <Link to="/projetos" className={linkClass('/projetos')}>Acadêmico</Link>

          {isAdmin && (
            <>
              <Link to="/financeiro" className={linkClass('/financeiro', 'text-orange-500 hover:text-orange-700')}>Financeiro</Link>
              <Link to="/relatorios" className={linkClass('/relatorios', 'text-orange-500 hover:text-orange-700')}>Relatórios</Link>
            </>
          )}

          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <a href="#" onClick={handleLogout} className="mx-4 text-base font-semibold text-red-500 hover:text-red-700 transition-colors">Sair</a>
        </nav>
      </div>

      {/* Mobile Nav (Dropdown) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-md absolute w-full z-50">
          <nav className="flex flex-col py-4">
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className={linkClass('/dashboard')}>Laboratório</Link>
            <Link to="/membros" onClick={() => setIsMenuOpen(false)} className={linkClass('/membros')}>Membros</Link>
            <Link to="/projetos" onClick={() => setIsMenuOpen(false)} className={linkClass('/projetos')}>Acadêmico</Link>

            {isAdmin && (
              <>
                <Link to="/financeiro" onClick={() => setIsMenuOpen(false)} className={linkClass('/financeiro', '!text-orange-500')}>Financeiro</Link>
                <Link to="/relatorios" onClick={() => setIsMenuOpen(false)} className={linkClass('/relatorios', '!text-orange-500')}>Relatórios</Link>
              </>
            )}

            <div className="h-px w-full bg-gray-200 my-2"></div>

            <a href="#" onClick={handleLogout} className="block px-4 py-2 text-base font-semibold text-red-500 hover:bg-gray-50">Sair</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
