import React from 'react';
import MainLayout from '../../../views/components/layouts/MainLayout';
import ArticleLine from '../../../views/components/common/ArticleLine';
import ProjectCard from '../../../views/components/projects/ProjectCard';
import { useProjectsController } from '../../../controllers/useProjectsController';

// --- Form Genérico para Cadastro/Edição ---
const AcademicForm = ({ type, dataToEdit, onSuccess, onClose, controller }) => {
    const isEditing = !!dataToEdit;
    const [formData, setFormData] = React.useState({
        nome: '',
        descricao: '',
        lideres: '', // Shared for autores and members
        imageUrl: '',
        pdfUrl: '',
        ...dataToEdit
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    // Get API methods from controller (or directly from model if preferred, but passing via controller is cleaner for strict MVC)
    const apiCall = type === 'artigo'
        ? (isEditing ? controller.updateArtigo : controller.addArtigo)
        : (isEditing ? controller.updateProjeto : controller.addProjeto);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(null);

        // Basic validation
        if (!formData.nome) {
            setError('Título é obrigatório.');
            setLoading(false);
            return;
        }
        // Validation: Description is optional for articles now (handled by backend too, but good to have)
        if (type === 'projeto' && !formData.descricao) {
            setError('Resumo é obrigatório para projetos.');
            setLoading(false);
            return;
        }

        try {
            if (isEditing) {
                await apiCall(dataToEdit.id, formData);
            } else {
                await apiCall(formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.message || `Erro ao salvar ${type}.`);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full p-3 mb-4 rounded-xl border-2 border-black focus:outline-none focus:ring-0 text-gray-700 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all";
    const labelClass = "block text-sm font-bold text-gray-700 mb-1 ml-1";

    return (
        <div className="bg-[#fcfbf9] p-6 rounded-[30px] border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] max-w-lg w-full relative">
            <h3 className="text-2xl font-bold text-center mb-6 text-black border-b-2 border-black pb-2">
                {isEditing ? 'Editar' : 'Cadastrar'} {type === 'artigo' ? 'Artigo' : 'Projeto'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className={labelClass}>Título</label>
                    <input
                        name="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className={inputClass}
                        required
                    />
                </div>

                {type === 'projeto' && (
                    <div>
                        <label className={labelClass}>Resumo</label>
                        <textarea
                            name="descricao"
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            className={`${inputClass} h-24 resize-none`}
                            required
                        />
                    </div>
                )}

                <div>
                    <label className={labelClass}>{type === 'artigo' ? 'Autores / Membros' : 'Membros do Projeto'}</label>
                    <input
                        name="lideres"
                        value={formData.lideres}
                        onChange={(e) => setFormData({ ...formData, lideres: e.target.value })}
                        placeholder="Ex: Ana Silva, João Santos"
                        className={inputClass}
                    />
                </div>

                {/* Campos Projéto Específicos */}
                {type === 'projeto' && (
                    <div>
                        <label className={labelClass}>Ícone/Capa (URL da Imagem)</label>
                        <input
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://exemplo.com/imagem.png"
                            className={inputClass}
                        />
                    </div>
                )}

                {/* PDF Link - Admin Only for Projects logic in view, but form allows setting it */}
                <div>
                    <label className={labelClass}>Link do Documento (PDF/Drive)</label>
                    <input
                        name="pdfUrl"
                        value={formData.pdfUrl}
                        onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                        placeholder="https://..."
                        className={inputClass}
                    />
                    {type === 'projeto' && <p className="text-xs text-red-500 font-bold ml-1 mb-2">* Visível apenas para o Admin em Projetos</p>}
                </div>

                {error && <p className="text-red-500 font-bold text-center mb-4 bg-red-100 p-2 rounded-lg border border-red-200">{error}</p>}

                <div className="flex justify-between items-center mt-6 gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border-2 border-black font-bold bg-gray-200 hover:bg-gray-300 transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl border-2 border-black font-bold bg-[#6c9a9b] text-white hover:brightness-110 transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
};
// --- FIM Form Genérico ---


const Projetos = () => {
    // MVC: Controller provides state and handlers
    const controller = useProjectsController();
    const { isAdmin, artigos, projetos, loading, isFormOpen, formData, handleOpenForm, handleCloseForm, handleDelete, handleSuccess } = controller;

    if (loading) {
        return (
            <MainLayout>
                <div className="flex h-screen items-center justify-center">
                    <p className="text-xl font-bold text-gray-500 animate-pulse">Carregando produção acadêmica...</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-[#6c9a9b] mb-8 border-b-2 border-black inline-block pb-2">Acadêmico</h1>

                {/* Renderiza o formulário se estiver aberto */}
                {isFormOpen ? (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="relative w-full max-w-lg">
                            <AcademicForm
                                type={formData.type}
                                dataToEdit={formData.data}
                                onSuccess={handleSuccess}
                                onClose={handleCloseForm}
                                controller={controller}
                            />

                            {/* Botão de Excluir só aparece durante a EDIÇÃO e fora do form principal para evitar submit acidental */}
                            {isAdmin && formData.data && (
                                <div className="absolute -bottom-16 right-0 w-full flex justify-center">
                                    <button
                                        onClick={() => handleDelete(formData.type, formData.data.id)}
                                        className="bg-[#e76f51] text-white border-2 border-black py-2 px-6 rounded-xl font-bold hover:brightness-110 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                                    >
                                        Excluir {formData.type === 'artigo' ? 'Artigo' : 'Projeto'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* SEÇÃO ARTIGOS */}
                        <section className="mb-12">
                            <div className="flex justify-between items-center mb-6 border-b-2 border-[#95b8bc] pb-2">
                                <h2 className="text-2xl font-bold text-[#6c9a9b]">Artigos</h2>
                                {isAdmin && (
                                    <button
                                        onClick={() => handleOpenForm('artigo')}
                                        className="bg-[#95b8bc] text-white border-2 border-black px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                                    >
                                        + Adicionar Artigo
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {artigos.length > 0 ? artigos.map(artigo => (
                                    <ArticleLine
                                        key={artigo.id}
                                        artigo={artigo}
                                        onEdit={handleOpenForm}
                                        isAdmin={isAdmin}
                                    />
                                )) : (
                                    <p className="text-gray-500 italic">Nenhum artigo cadastrado.</p>
                                )}
                            </div>
                        </section>

                        {/* SEÇÃO PROJETOS */}
                        <section>
                            <div className="flex justify-between items-center mb-6 border-b-2 border-[#95b8bc] pb-2">
                                <h2 className="text-2xl font-bold text-[#6c9a9b]">Projetos</h2>
                                {isAdmin && (
                                    <button
                                        onClick={() => handleOpenForm('projeto')}
                                        className="bg-[#95b8bc] text-white border-2 border-black px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                                    >
                                        + Adicionar Projeto
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {projetos.length > 0 ? projetos.map(projeto => (
                                    <ProjectCard
                                        key={projeto.id}
                                        project={projeto}
                                        onEdit={handleOpenForm}
                                        isAdmin={isAdmin}
                                    />
                                )) : (
                                    <p className="text-gray-500 italic">Nenhum projeto cadastrado.</p>
                                )}
                            </div>
                        </section>

                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default Projetos;
