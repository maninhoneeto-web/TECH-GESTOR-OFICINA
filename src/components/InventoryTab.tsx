/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Barcode, 
  Trash2, 
  Edit3, 
  Layers, 
  ShieldAlert, 
  ArrowUpRight, 
  X, 
  Check, 
  AlertCircle,
  Package,
  Wrench,
  HelpCircle,
  QrCode,
  Tag
} from 'lucide-react';
import { Peca } from '../types';

interface InventoryTabProps {
  pecas: Peca[];
  onAddPeca: (peca: Omit<Peca, 'id'>) => void;
  onEditPeca: (id: string, updatedFields: Partial<Peca>) => void;
  onDeletePeca: (id: string) => void;
}

export default function InventoryTab({ 
  pecas, 
  onAddPeca, 
  onEditPeca, 
  onDeletePeca 
}: InventoryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estados dos inputs de formulário
  const [nome, setNome] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [precoCusto, setPrecoCusto] = useState(0);
  const [precoVenda, setPrecoVenda] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [localizacao, setLocalizacao] = useState('');

  // Configuração Scanner do Código de Barras
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scannerNotification, setScannerNotification] = useState<{
    message: string;
    type: 'success' | 'warning' | 'info';
    active: boolean;
  }>({ message: '', type: 'success', active: false });

  // Referência para focar input do scanner
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Temporizador para esconder notificações de scan
  useEffect(() => {
    if (scannerNotification.active) {
      const timer = setTimeout(() => {
        setScannerNotification(prev => ({ ...prev, active: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scannerNotification.active]);

  // Listener para simular escaneamento físico real da pistola de código de barras
  // Pistolas de código de barras digitam rápido e terminam com "Enter".
  // Vamos escutar digitações rápidas globais quando o usuário focar o painel ou usar o input
  useEffect(() => {
    let rawBuffer = '';
    let lastKeyTime = Date.now();

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignorar teclas funcionais
      if (e.key.length > 1 && e.key !== 'Enter') return;

      const currentTime = Date.now();
      const diff = currentTime - lastKeyTime;
      lastKeyTime = currentTime;

      // Se passou muito tempo (> 45ms), assumimos que é digitação manual humana normal.
      // Se for rápido ou vier do leitor, acumula no buffer
      if (diff < 45) {
        if (e.key === 'Enter') {
          if (rawBuffer.length > 5) {
            handleBarcodeProcess(rawBuffer);
            rawBuffer = '';
          }
        } else {
          rawBuffer += e.key;
        }
      } else {
        // Se demorou, reinicia o buffer com a tecla atual
        rawBuffer = e.key === 'Enter' ? '' : e.key;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [pecas]);

  // Limpar formulário
  const resetForm = () => {
    setNome('');
    setCodigoBarras('');
    setQuantidade(1);
    setPrecoCusto(0);
    setPrecoVenda(0);
    setCategoria('');
    setLocalizacao('');
    setEditingId(null);
  };

  const handleOpenCadastro = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Processamento do Código de Barras Escaneado
  const handleBarcodeProcess = (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return;

    // Achar peça no estoque correspondente ao código de barras
    const pecaExistente = pecas.find(p => p.codigoBarras === cleanCode);

    if (pecaExistente) {
      // Se já existe, INCREMENTA automaticante a quantidade física em 1 unidade
      const novaQtd = pecaExistente.quantidade + 1;
      onEditPeca(pecaExistente.id, { quantidade: novaQtd });
      
      setScannerNotification({
        message: `✓ [Código: ${cleanCode}] Peça localizada: "${pecaExistente.nome}". Estoque incrementado para ${novaQtd} unidades! 📦`,
        type: 'success',
        active: true
      });
    } else {
      // Código de barras não encontrado em nosso estoque
      setScannerNotification({
        message: `⚠ [Código: ${cleanCode}] Código de barras NÃO cadastrado! Clique no botão "+" abaixo para registrar este produto no inventário.`,
        type: 'warning',
        active: true
      });
      // Abre o modal de cadastro pré-carregando o código de barras
      resetForm();
      setCodigoBarras(cleanCode);
      setIsModalOpen(true);
    }
    setBarcodeInput('');
  };

  const handleManualBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      handleBarcodeProcess(barcodeInput);
    }
  };

  // Simular escaneamento de um código cadastrado com um clique
  const simulateScan = (code: string) => {
    handleBarcodeProcess(code);
  };

  const handleOpenEdit = (peca: Peca) => {
    setEditingId(peca.id);
    setNome(peca.nome);
    setCodigoBarras(peca.codigoBarras);
    setQuantidade(peca.quantidade);
    setPrecoCusto(peca.precoCusto);
    setPrecoVenda(peca.precoVenda);
    setCategoria(peca.categoria);
    setLocalizacao(peca.localizacao);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !codigoBarras.trim() || precoVenda <= 0) {
      alert('Por favor, preencha Nome, Código de Barras e Preço de Venda.');
      return;
    }

    const payload = {
      nome,
      codigoBarras,
      quantidade: Number(quantidade),
      precoCusto: Number(precoCusto),
      precoVenda: Number(precoVenda),
      categoria: categoria || 'Geral',
      localizacao: localizacao || 'Almoxarifado'
    };

    if (editingId) {
      onEditPeca(editingId, payload);
    } else {
      onAddPeca(payload);
    }

    setIsModalOpen(false);
    resetForm();
  };

  // Filtragem de busca
  const filteredPecas = pecas.filter(p => {
    const q = searchTerm.toLowerCase();
    return (
      p.nome.toLowerCase().includes(q) ||
      p.codigoBarras.includes(q) ||
      p.categoria.toLowerCase().includes(q) ||
      p.localizacao.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="inventory-tab">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-cyan-400 rounded-full inline-block"></span>
            Controle de Estoque & Barcode
          </h2>
          <p className="text-slate-400 text-sm">
            Adicione componentes digitando ou conectando uma pistola de código de barras USB/Bluetooth.
          </p>
        </div>
        <button
          onClick={handleOpenCadastro}
          id="btn-adicionar-peca"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold rounded-xl transition duration-300 shadow-md shadow-cyan-500/10 cursor-pointer self-start"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          Registrar Nova Peça
        </button>
      </div>

      {/* PAINEL ESPECIAL: PISTOLA DE CÓDIGO DE BARRAS */}
      <div className="bg-slate-950 border border-slate-900 rounded-3xl p-5 relative overflow-hidden" id="barcode-scanner-widget">
        <div className="absolute right-0 top-0 -translate-x-4 translate-y-4 text-cyan-500/10 hover:text-cyan-500/20 transition duration-500">
          <QrCode className="w-32 h-32" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col gap-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 items-center justify-center relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <h3 className="font-extrabold text-slate-200 text-md flex items-center gap-2 uppercase tracking-wide">
                Integração Mestra de Pistola Barcode
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              O sistema detecta escaneamentos automaticamente em qualquer tela. Conecte sua pistola de código de barras física e aperte o gatilho. Para simulações Rápidas de demonstração do SaaS, digite abaixo ou clique nas placas teste.
            </p>
          </div>

          {/* Formulador de Entrada de Código de Barras Simulador */}
          <form onSubmit={handleManualBarcodeSubmit} className="flex gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <Barcode className="absolute left-3.5 top-3 w-5 h-5 text-cyan-400" />
              <input
                ref={barcodeInputRef}
                type="text"
                placeholder="Escaneie ou digite código..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full bg-slate-900/80 text-cyan-400 text-sm font-mono pl-11 pr-4 py-2.5 rounded-xl border border-cyan-500/20 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-bold text-xs rounded-xl transition"
            >
              Simular Gatilho
            </button>
          </form>
        </div>

        {/* Notificação Flutuante do Scanner */}
        {scannerNotification.active && (
          <div className={`mt-4 p-3.5 rounded-xl border flex items-start gap-2.5 animate-bounce ${scannerNotification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-xs font-semibold leading-relaxed">
              {scannerNotification.message}
            </div>
          </div>
        )}

        {/* Atalhos Rápidos para Simulações rápidas */}
        <div className="mt-4 pt-3.5 border-t border-slate-900 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-mono">Simuladores Rápidos de Placas de Peças:</span>
          {pecas.slice(0, 3).map(p => (
            <button
              key={p.id}
              onClick={() => simulateScan(p.codigoBarras)}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/30 text-slate-300 rounded-lg transition font-mono flex items-center gap-1.5"
            >
              <span>{p.nome.split(' ')[0]}</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1 text-bold rounded">{p.codigoBarras}</span>
            </button>
          ))}
          <button
            onClick={() => simulateScan('7890000000100')}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/30 text-slate-300 rounded-lg transition font-mono flex items-center gap-1.5"
          >
            <span>Novo Registro</span>
            <span className="text-[10px] bg-amber-950 text-amber-400 px-1 text-bold rounded">7890000000100</span>
          </button>
        </div>
      </div>

      {/* Barra de Busca de Peças em Estoque */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Pesquisar estoque por descrição da peça, prateleira, categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 text-slate-100 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none transition"
          />
        </div>
        <div className="flex items-center justify-center px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
          {filteredPecas.length} Itens em Catálogo
        </div>
      </div>

      {/* Tabela de Lançamento e Prateleiras de Estoque */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden" id="inventory-table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-900/10 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-4 px-5">Artigo / Código</th>
                <th className="py-4 px-5">Categoria</th>
                <th className="py-4 px-5">Localização</th>
                <th className="py-4 px-5 text-center">Quantidade</th>
                <th className="py-4 px-5 text-right">Preço de Custo</th>
                <th className="py-4 px-5 text-right">Preço de Venda</th>
                <th className="py-4 px-5 text-center">Markup / Lucro</th>
                <th className="py-4 px-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-slate-300">
              {filteredPecas.length > 0 ? (
                filteredPecas.map((p) => {
                  const markup = p.precoCusto > 0 ? ((p.precoVenda - p.precoCusto) / p.precoCusto) * 100 : 0;
                  const lucroUnitario = p.precoVenda - p.precoCusto;

                  return (
                    <tr key={p.id} id={`inventory-row-${p.id}`} className="hover:bg-slate-900/40 transition">
                      <td className="py-4 px-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-200">{p.nome}</span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                            <Barcode className="w-3.5 h-3.5 inline text-cyan-500/80" />
                            {p.codigoBarras}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400">
                          <Layers className="w-3 h-3 text-cyan-400" />
                          {p.categoria}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-mono text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800/60">{p.localizacao}</span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEditPeca(p.id, { quantidade: Math.max(0, p.quantidade - 1) })}
                            className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className={`font-mono font-extrabold text-base w-10 text-center ${p.quantidade < 10 ? 'text-amber-500' : 'text-slate-100'}`}>
                            {p.quantidade}
                          </span>
                          <button
                            onClick={() => onEditPeca(p.id, { quantidade: p.quantidade + 1 })}
                            className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-medium">
                        R$ {p.precoCusto.toFixed(2)}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-extrabold text-slate-100">
                        R$ {p.precoVenda.toFixed(2)}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-emerald-400 font-bold font-mono text-xs">
                            +{markup.toFixed(0)}%
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Lucro: +R$ {lucroUnitario.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-400 hover:text-cyan-400 bg-slate-900 border border-slate-800 rounded-lg transition"
                            title="Editar Dados"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Tem certeza de que deseja deletar a peça ${p.nome}?`)) {
                                onDeletePeca(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-900 border border-slate-800 rounded-lg transition"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Nenhuma peça encontrada no catálogo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Nova Peça / Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden" id="inventory-modal">
            
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

            <div className="flex items-center justify-between p-6 border-b border-slate-905">
              <h3 className="font-extrabold text-slate-100 text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                {editingId ? 'Editar Detalhes da Peça' : 'Cadastrar Artigo no Catálogo'}
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
                <label className="text-xs font-bold text-slate-400">Nome do Componente *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Cabeçote Motor AP, Pastilha Bosch Dianteira"
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1 text-cyan-400">
                    <Barcode className="w-3.5 h-3.5" />
                    Código de Barras *
                  </label>
                  <input
                    type="text"
                    required
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                    placeholder="Escanear com a pistola"
                    className="bg-slate-900 border border-slate-850 text-cyan-400 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Quantidade Inicial</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Preço de Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={precoCusto}
                    onChange={(e) => setPrecoCusto(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={precoVenda}
                    onChange={(e) => setPrecoVenda(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Categoria</label>
                  <input
                    type="text"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    placeholder="Ex: Freios, Lubrificantes, Suspensão"
                    className="bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-3.5 py-2 focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400">Prateleira / Localização</label>
                  <input
                    type="text"
                    value={localizacao}
                    onChange={(e) => setLocalizacao(e.target.value)}
                    placeholder="Ex: Prateleira B1, Caixa 4"
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
                  id="submit-inventory-form"
                  className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold rounded-xl text-sm shadow-md transition"
                >
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  {editingId ? 'Salvar Especificações' : 'Adicionar ao Estoque'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
