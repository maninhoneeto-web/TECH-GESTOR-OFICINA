/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Wrench, 
  Trash2, 
  Edit3, 
  Clock, 
  DollarSign, 
  X, 
  Check,
  ShieldCheck
} from 'lucide-react';
import { Servico } from '../types';

interface ServicesTabProps {
  servicos: Servico[];
  onAddServico: (servico: Omit<Servico, 'id'>) => void;
  onEditServico: (id: string, updatedFields: Partial<Servico>) => void;
  onDeleteServico: (id: string) => void;
}

export default function ServicesTab({ 
  servicos, 
  onAddServico, 
  onEditServico, 
  onDeleteServico 
}: ServicesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados dos inputs
  const [descricao, setDescricao] = useState('');
  const [valorMaoDeObra, setValorMaoDeObra] = useState(0);
  const [tempoEstimated, setTempoEstimated] = useState('');

  const resetForm = () => {
    setDescricao('');
    setValorMaoDeObra(0);
    setTempoEstimated('');
    setEditingId(null);
  };

  const handleOpenCadastro = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (serv: Servico) => {
    setEditingId(serv.id);
    setDescricao(serv.descricao);
    setValorMaoDeObra(serv.valorMaoDeObra);
    setTempoEstimated(serv.tempoEstimado);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!descricao.trim() || valorMaoDeObra <= 0) {
      alert('Preencha a descrição do serviço e atribua um valor de mão de obra.');
      return;
    }

    const payload = {
      descricao,
      valorMaoDeObra: Number(valorMaoDeObra),
      tempoEstimado: tempoEstimated || '1h 00m'
    };

    if (editingId) {
      onEditServico(editingId, payload);
    } else {
      onAddServico(payload);
    }

    setIsModalOpen(false);
    resetForm();
  };

  const filteredServicos = servicos.filter(s =>
    s.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="services-tab">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cyan-400 rounded-full inline-block"></span>
            Tabela de Serviços Auto
          </h2>
          <p className="text-slate-400 text-sm">
            Configure seu catálogo de mão de obra e tempos estimados para acelerar orçamentos.
          </p>
        </div>
        <button
          onClick={handleOpenCadastro}
          id="btn-adicionar-servico"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-xl transition duration-300 shadow-md shadow-cyan-500/10 cursor-pointer self-start"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          Novo Serviço
        </button>
      </div>

      {/* Busca */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar por descrição de serviço de mecânica, elétrica..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none transition"
          />
        </div>
        <div className="flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
          {filteredServicos.length} Serviços Cadastrados
        </div>
      </div>

      {/* Grid de Serviços */}
      {filteredServicos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="services-grid">
          {filteredServicos.map((s) => (
            <div 
              key={s.id} 
              id={`service-card-${s.id}`}
              className="bg-slate-950 border border-slate-905 hover:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:shadow-lg transition duration-300 relative overflow-hidden group"
            >
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-cyan-500/5 group-hover:text-cyan-500/10 transition duration-500">
                <Wrench className="w-24 h-24" />
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-cyan-950 to-blue-950 text-cyan-400 border border-cyan-500/20 rounded-xl">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-200 text-sm leading-snug">{s.descricao}</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900 pt-3 mt-1.5">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tempo: <span className="font-mono text-slate-300 font-bold">{s.tempoEstimado}</span></span>
                  </div>
                  <div className="bg-cyan-500/5 px-3 py-1.5 rounded-xl border border-cyan-500/10">
                    <span className="text-[10px] text-cyan-500 font-bold block uppercase tracking-wider">Mão de Obra</span>
                    <span className="text-base font-extrabold text-cyan-400 font-mono">R$ {s.valorMaoDeObra.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-900/60 flex justify-end gap-2 text-xs relative z-10">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition"
                  title="Editar Serviço"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Tem certeza de que deseja apagar o serviço "${s.descricao}"?`)) {
                      onDeleteServico(s.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-950 border border-dashed border-slate-800 p-12 text-center rounded-2xl">
          <p className="text-slate-400 text-sm">Nenhum serviço automotivo encontrado.</p>
        </div>
      )}

      {/* Modal de Cadastro de Serviço */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden" id="service-modal">
            
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

            <div className="flex items-center justify-between p-6 border-b border-slate-900">
              <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5 text-cyan-400" />
                {editingId ? 'Editar Detalhes de Serviço' : 'Novo Serviço no Portfólio'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Descrição do Serviço *</label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Troca de pastilhas de freio dianteiras"
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Preço Mão de Obra (R$) *</label>
                  <input
                    type="number"
                    step="5.00"
                    min="0.01"
                    required
                    value={valorMaoDeObra}
                    onChange={(e) => setValorMaoDeObra(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Tempo Estimado</label>
                  <input
                    type="text"
                    required
                    value={tempoEstimated}
                    onChange={(e) => setTempoEstimated(e.target.value)}
                    placeholder="Ex: 1h 30m, 45m"
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="border-t border-slate-900 pt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="submit-service-form"
                  className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-md transition"
                >
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  {editingId ? 'Salvar Configurações' : 'Cadastrar Serviço'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
