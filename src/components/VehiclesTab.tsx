/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Car, 
  Search, 
  User, 
  Phone, 
  Calendar, 
  ExternalLink, 
  ClipboardCheck, 
  AlertTriangle,
  History,
  FileText,
  BadgeAlert,
  Hash,
  Sparkles,
  Layers
} from 'lucide-react';
import { Cliente, CheckInItem, Orcamento } from '../types';

interface VehiclesTabProps {
  clientes: Cliente[];
  checkins: CheckInItem[];
  orcamentos: Orcamento[];
  onNavigateToTab: (tabId: string) => void;
}

export default function VehiclesTab({ 
  clientes, 
  checkins, 
  orcamentos,
  onNavigateToTab
}: VehiclesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('');

  // Extrair marcas únicas para filtro
  const marcasUnicas = Array.from(new Set(clientes.map(c => c.veiculoMarca).filter(Boolean)));

  // Filtrar lista de veículos baseado no termo de busca e no filtro de marca
  const filteredVehicles = clientes.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = (
      c.veiculoMarca?.toLowerCase().includes(q) ||
      c.veiculoModelo?.toLowerCase().includes(q) ||
      c.veiculoPlaca?.toLowerCase().includes(q) ||
      c.nome?.toLowerCase().includes(q)
    );
    const matchesBrand = selectedBrandFilter === '' || c.veiculoMarca === selectedBrandFilter;
    return matchesSearch && matchesBrand;
  });

  // Obter contagem de check-ins para um cliente/veículo
  const getCheckinCount = (clienteId: string) => {
    return checkins.filter(ck => ck.clienteId === clienteId).length;
  };

  // Obter orçamentos/OS ativos
  const getBudgetCount = (clienteId: string) => {
    return orcamentos.filter(o => o.clienteId === clienteId).length;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="vehicles-tab-view">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cyan-400 rounded-full inline-block"></span>
            Frota de Veículos Registrados
          </h2>
          <p className="text-slate-400 text-sm">
            Base de dados unificada de automóveis sob manutenção, laudos de vistoria técnica e histórico mecânico.
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab('clientes')}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-xl transition duration-300 shadow-md shadow-cyan-500/10 cursor-pointer self-start text-xs"
        >
          <Car className="w-4 h-4 stroke-[2.5]" />
          Cadastrar Novo Veículo (Via Cliente)
        </button>
      </div>

      {/* Caixa de Ferramentas / Filtros */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch shadow-lg">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar por placa, modelo de carro, fabricante ou proprietário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 text-xs pl-11 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none transition font-sans placeholder-slate-500"
          />
        </div>

        {/* Filtro por Fabricante */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <select
            value={selectedBrandFilter}
            onChange={(e) => setSelectedBrandFilter(e.target.value)}
            className="w-full md:w-48 bg-slate-900 text-slate-200 text-xs rounded-xl py-2.5 px-3 border border-slate-800 focus:border-cyan-500 focus:outline-none transition"
          >
            <option value="">Todas as Marcas</option>
            {marcasUnicas.map(marca => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>

          <div className="text-[10px] whitespace-nowrap bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 font-mono flex items-center gap-1.5 leading-none">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{filteredVehicles.length} Veículo(s)</span>
          </div>
        </div>
      </div>

      {/* Grid de Veículos */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="vehicles-grid">
          {filteredVehicles.map((c) => {
            const hasCheckins = getCheckinCount(c.id);
            const hasBudgets = getBudgetCount(c.id);

            return (
              <div 
                key={c.id} 
                id={`vehicle-card-${c.id}`}
                className="bg-slate-950 border border-slate-900 hover:border-slate-850 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
              >
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-300 pointer-events-none"></div>

                <div>
                  {/* Cabeçalho do Card: Marca, Modelo e Placa */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-900 text-cyan-400 border border-slate-800 rounded-xl group-hover:border-cyan-500/30 transition-all">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-100 text-base leading-tight group-hover:text-cyan-400 transition-colors">
                          {c.veiculoMarca} {c.veiculoModelo}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          Ano Fabricação: {c.veiculoAno || 'Não Definido'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-900 my-4" />

                  {/* Informações da Placa em Destaque */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono">Identificação Placa</span>
                      <span className="text-sm font-black text-slate-100 tracking-widest uppercase font-mono mt-0.5">{c.veiculoPlaca || 'SEM PLACA'}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold bg-cyan-950/40 text-cyan-400 px-2 py-1 rounded border border-cyan-900/30">
                      VISTORIADO
                    </span>
                  </div>

                  {/* Detalhes do Dono do Carro */}
                  <div className="flex flex-col gap-2 bg-slate-900/50 rounded-xl p-3 border border-slate-900">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider font-mono">Proprietário Responsável</span>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-200 truncate">{c.nome}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs text-slate-400 font-mono">{c.telefone}</span>
                    </div>
                  </div>

                  {/* Status Rápido (Histórico de Checkins / Orçamentos ativos) */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
                    <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                      <ClipboardCheck className="w-4 h-4 text-emerald-400 mb-1" />
                      <span className="text-slate-500 font-mono text-[9px] uppercase">Vistorias</span>
                      <strong className="text-slate-200 text-xs mt-0.5">{hasCheckins} realizada(s)</strong>
                    </div>

                    <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-2.5 flex flex-col items-center justify-center text-center">
                      <FileText className="w-4 h-4 text-blue-400 mb-1" />
                      <span className="text-slate-500 font-mono text-[9px] uppercase">Orçamentos</span>
                      <strong className="text-slate-200 text-xs mt-0.5">{hasBudgets} ativo(s)</strong>
                    </div>
                  </div>
                </div>

                {/* Seção das Ações Rápidas */}
                <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between">
                  <button
                    onClick={() => onNavigateToTab('checkin')}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-900/30 hover:border-cyan-500/30 px-3 py-2 rounded-xl transition cursor-pointer"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Novo Check-in
                  </button>

                  <button
                    onClick={() => onNavigateToTab('clientes')}
                    className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-cyan-400 transition"
                  >
                    Editar Ficha
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-950 border-2 border-dashed border-slate-900 p-12 text-center rounded-2xl">
          <p className="text-slate-500 text-xs">Nenhum veículo cadastrado na frota sob as regras de busca.</p>
          <button 
            onClick={() => onNavigateToTab('clientes')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs rounded-xl hover:from-cyan-400 hover:to-blue-400 transition"
          >
            Cadastrar Primeiro Proprietário e Veículo
          </button>
        </div>
      )}

    </div>
  );
}
