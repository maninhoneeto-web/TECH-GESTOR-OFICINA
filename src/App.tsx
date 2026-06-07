/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cliente, 
  Peca, 
  Servico, 
  Orcamento, 
  Transacao, 
  AssinaturaSaaS 
} from './types';
import { 
  CLIENTES_PADRAO, 
  PECAS_PADRAO, 
  SERVICOS_PADRAO, 
  ORCAMENTOS_PADRAO, 
  TRANSCOES_PADRAO, 
  ASSINATURA_PADRAO 
} from './data';

// Importando os Componentes de Tabs
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientsTab from './components/ClientsTab';
import InventoryTab from './components/InventoryTab';
import ServicesTab from './components/ServicesTab';
import BudgetsTab from './components/BudgetsTab';
import FinancialTab from './components/FinancialTab';
import PlansTab from './components/PlansTab';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estados principais persistidos no localStorage
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [assinatura, setAssinatura] = useState<AssinaturaSaaS>(ASSINATURA_PADRAO);

  // Inicialização e Carregamento do localStorage
  useEffect(() => {
    const loadedClients = localStorage.getItem('tg_clientes');
    const loadedPecas = localStorage.getItem('tg_pecas');
    const loadedServicos = localStorage.getItem('tg_servicos');
    const loadedOrcamentos = localStorage.getItem('tg_orcamentos');
    const loadedTransacoes = localStorage.getItem('tg_transacoes');
    const loadedAssinatura = localStorage.getItem('tg_assinatura');

    if (loadedClients) setClientes(JSON.parse(loadedClients));
    else {
      setClientes(CLIENTES_PADRAO);
      localStorage.setItem('tg_clientes', JSON.stringify(CLIENTES_PADRAO));
    }

    if (loadedPecas) setPecas(JSON.parse(loadedPecas));
    else {
      setPecas(PECAS_PADRAO);
      localStorage.setItem('tg_pecas', JSON.stringify(PECAS_PADRAO));
    }

    if (loadedServicos) setServicos(JSON.parse(loadedServicos));
    else {
      setServicos(SERVICOS_PADRAO);
      localStorage.setItem('tg_servicos', JSON.stringify(SERVICOS_PADRAO));
    }

    if (loadedOrcamentos) setOrcamentos(JSON.parse(loadedOrcamentos));
    else {
      setOrcamentos(ORCAMENTOS_PADRAO);
      localStorage.setItem('tg_orcamentos', JSON.stringify(ORCAMENTOS_PADRAO));
    }

    if (loadedTransacoes) setTransacoes(JSON.parse(loadedTransacoes));
    else {
      setTransacoes(TRANSCOES_PADRAO);
      localStorage.setItem('tg_transacoes', JSON.stringify(TRANSCOES_PADRAO));
    }

    if (loadedAssinatura) setAssinatura(JSON.parse(loadedAssinatura));
    else {
      setAssinatura(ASSINATURA_PADRAO);
      localStorage.setItem('tg_assinatura', JSON.stringify(ASSINATURA_PADRAO));
    }
  }, []);

  // Sync states com local storage de forma segura em grupo
  useEffect(() => {
    if (clientes.length > 0) localStorage.setItem('tg_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    if (pecas.length > 0) localStorage.setItem('tg_pecas', JSON.stringify(pecas));
  }, [pecas]);

  useEffect(() => {
    if (servicos.length > 0) localStorage.setItem('tg_servicos', JSON.stringify(servicos));
  }, [servicos]);

  useEffect(() => {
    if (orcamentos.length > 0) localStorage.setItem('tg_orcamentos', JSON.stringify(orcamentos));
  }, [orcamentos]);

  useEffect(() => {
    if (transacoes.length > 0) localStorage.setItem('tg_transacoes', JSON.stringify(transacoes));
  }, [transacoes]);

  useEffect(() => {
    localStorage.setItem('tg_assinatura', JSON.stringify(assinatura));
  }, [assinatura]);


  // ---- Operações do Módulo de Clientes ----
  const handleAddCliente = (novo: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    const clientePayload: Cliente = {
      ...novo,
      id: 'c_' + Math.random().toString(36).substring(2, 9),
      dataCadastro: new Date().toISOString().split('T')[0]
    };
    setClientes(prev => [clientePayload, ...prev]);
  };

  const handleEditCliente = (id: string, camposAtualizados: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...camposAtualizados } : c));
  };

  const handleDeleteCliente = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
  };


  // ---- Operações do Módulo de Estoque (Peças) ----
  const handleAddPeca = (nova: Omit<Peca, 'id'>) => {
    const pecaPayload: Peca = {
      ...nova,
      id: 'p_' + Math.random().toString(36).substring(2, 9)
    };
    setPecas(prev => [pecaPayload, ...prev]);
  };

  const handleEditPeca = (id: string, camposAtualizados: Partial<Peca>) => {
    setPecas(prev => prev.map(p => p.id === id ? { ...p, ...camposAtualizados } : p));
  };

  const handleDeletePeca = (id: string) => {
    setPecas(prev => prev.filter(p => p.id !== id));
  };


  // ---- Operações do Módulo de Serviços Auto ----
  const handleAddServico = (novo: Omit<Servico, 'id'>) => {
    const servicoPayload: Servico = {
      ...novo,
      id: 's_' + Math.random().toString(36).substring(2, 9)
    };
    setServicos(prev => [servicoPayload, ...prev]);
  };

  const handleEditServico = (id: string, camposAtualizados: Partial<Servico>) => {
    setServicos(prev => prev.map(s => s.id === id ? { ...s, ...camposAtualizados } : s));
  };

  const handleDeleteServico = (id: string) => {
    setServicos(prev => prev.filter(s => s.id !== id));
  };


  // ---- Operações de Orçamentos de Oficina ----
  const handleAddOrcamento = (novo: Omit<Orcamento, 'id' | 'codigo' | 'dataCriacao'>) => {
    const totalOrcamentos = orcamentos.length;
    const proximoNumero = 2600 + totalOrcamentos + 1;
    
    const orcamentoPayload: Orcamento = {
      ...novo,
      id: 'o_' + Math.random().toString(36).substring(2, 9),
      codigo: `ORC-${proximoNumero}`,
      dataCriacao: new Date().toISOString().split('T')[0]
    };

    setOrcamentos(prev => [orcamentoPayload, ...prev]);
  };

  // Atualizar Status do Orçamento com Integração de Baixa e Liquidação de Caixa
  const handleUpdateStatusOrcamento = (id: string, novoStatus: Orcamento['status']) => {
    setOrcamentos(prev => prev.map(o => {
      if (o.id === id) {
        // Se o orçamento foi CONCLUÍDO e antes não estava, executa as integrações
        if (novoStatus === 'Concluido' && o.status !== 'Concluido') {
          // 1. Cria transação financeira de receita automática de serviços e peças
          const novaTransacao: Transacao = {
            id: 't_' + Math.random().toString(36).substring(2, 9),
            tipo: 'receita',
            categoria: 'Serviço Executado',
            valor: Number(o.valorTotal),
            descricao: `Faturamento Orç. Concluído ${o.codigo} (${clientes.find(c => c.id === o.clienteId)?.nome || 'Oficina'})`,
            data: new Date().toISOString().split('T')[0],
            orcamentoId: o.id
          };
          setTransacoes(t => [novaTransacao, ...t]);

          // 2. Deduz quantitativo de peças do estoque físico
          setPecas(estoqueAtual => estoqueAtual.map(originalPeca => {
            const pecaUtilizada = o.pecas.find(itemPeca => itemPeca.pecaId === originalPeca.id);
            if (pecaUtilizada) {
              return {
                ...originalPeca,
                quantidade: Math.max(0, originalPeca.quantidade - pecaUtilizada.quantidade)
              };
            }
            return originalPeca;
          }));
        }
        return { ...o, status: novoStatus };
      }
      return o;
    }));
  };

  const handleDeleteOrcamento = (id: string) => {
    setOrcamentos(prev => prev.filter(o => o.id !== id));
  };


  // ---- Operações Financeiras de Livro Caixa ----
  const handleAddTransacao = (nova: Omit<Transacao, 'id'>) => {
    const transacaoPayload: Transacao = {
      ...nova,
      id: 't_' + Math.random().toString(36).substring(2, 9)
    };
    setTransacoes(prev => [transacaoPayload, ...prev]);
  };

  const handleDeleteTransacao = (id: string) => {
    setTransacoes(prev => prev.filter(t => t.id !== id));
  };


  // ---- Operações do Plano SaaS ----
  const handleChangeAssinatura = (nova: AssinaturaSaaS) => {
    setAssinatura(nova);
  };

  // ---- Controle de Acesso Admin Dono / Mecânico ----
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('tg_admin_unlocked') === 'true';
  });

  const handleToggleAdmin = () => {
    if (adminUnlocked) {
      setAdminUnlocked(false);
      localStorage.setItem('tg_admin_unlocked', 'false');
    } else {
      const pin = prompt("Insira a senha de login do Proprietário/Dono para revelar lucros, faturamento e fluxo de caixa:");
      if (pin === '1234') {
        setAdminUnlocked(true);
        localStorage.setItem('tg_admin_unlocked', 'true');
      } else if (pin !== null) {
        alert("❌ Senha administrativa incorreta! Para homologação de demonstração, use: 1234");
      }
    }
  };

  const handleSetStatusSaaS = (status: AssinaturaSaaS['status']) => {
    const updated = { ...assinatura, status };
    setAssinatura(updated);
    localStorage.setItem('tg_assinatura', JSON.stringify(updated));
  };


  // ---- Controle de Renderização de Acordo com a Tab Ativa ----
  const renderActiveTab = () => {
    // Se o status estiver bloqueado ou expirado, impede o acesso a qualquer ERP operacional (exceto o próprio Hub de planos para permitir reativação)
    if ((assinatura.status === 'bloqueado' || assinatura.status === 'expired') && activeTab !== 'planos') {
      return (
        <div className="bg-white border-2 border-rose-500 rounded-3xl p-8 shadow-lg max-w-2xl mx-auto my-10 animate-fade-in text-center flex flex-col items-center gap-6" id="saas-locked-notification">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-full border border-rose-100 animate-bounce">
            <Lock className="w-10 h-10" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest bg-rose-100 text-rose-800 px-3 py-1.5 rounded-full inline-block self-center">
              Acesso Suspenso - Pendência Financeira
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-2">
              Licença do ERP Tech Gestor Suspensa
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mt-1">
              Olá. O acesso de sua oficina, <strong>{assinatura.nomeOficina || 'Nova Oficina'}</strong>, a este software de gestão comercial foi temporariamente suspenso pelo administrador de licenciamento SaaS devido ao atraso de compensação de mensalidade recorrente.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-205 w-full text-left flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-800">📋 O que fazer para retomar as operações comerciais?</h4>
            <ul className="text-xs text-slate-600 flex flex-col gap-1.5 list-disc pl-5">
              <li>Entre em contato direto com o reseller pelo e-mail <strong>maninhoneeto@gmail.com</strong>.</li>
              <li>Consulte os planos ativos e realize o faturamento na aba de planos.</li>
              <li>Efetue o pagamento da mensalidade correspondente.</li>
            </ul>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('planos')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition cursor-pointer"
            >
              Ir para Hub SaaS (Ver Custos / Ativar)
            </button>
            <button
              onClick={() => {
                handleSetStatusSaaS('active');
                alert('🟢 Simulação: Pagamento compensado pelo cliente! Acesso restaurado e liberado.');
              }}
              className="px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-250 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Simular Quitação de Boleto (Liberar)
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            clientes={clientes}
            pecas={pecas}
            servicos={servicos}
            orcamentos={orcamentos}
            transacoes={transacoes}
            onNavigate={(id) => setActiveTab(id)}
            adminUnlocked={adminUnlocked}
            onToggleAdmin={handleToggleAdmin}
          />
        );
      case 'clientes':
        return (
          <ClientsTab
            clientes={clientes}
            onAddCliente={handleAddCliente}
            onEditCliente={handleEditCliente}
            onDeleteCliente={handleDeleteCliente}
          />
        );
      case 'estoque':
        return (
          <InventoryTab
            pecas={pecas}
            onAddPeca={handleAddPeca}
            onEditPeca={handleEditPeca}
            onDeletePeca={handleDeletePeca}
          />
        );
      case 'servicos':
        return (
          <ServicesTab
            servicos={servicos}
            onAddServico={handleAddServico}
            onEditServico={handleEditServico}
            onDeleteServico={handleDeleteServico}
          />
        );
      case 'orcamentos':
        return (
          <BudgetsTab
            orcamentos={orcamentos}
            clientes={clientes}
            pecas={pecas}
            servicos={servicos}
            onAddOrcamento={handleAddOrcamento}
            onUpdateStatusOrcamento={handleUpdateStatusOrcamento}
            onDeleteOrcamento={handleDeleteOrcamento}
          />
        );
      case 'financeiro':
        return (
          <FinancialTab
            transacoes={transacoes}
            onAddTransacao={handleAddTransacao}
            onDeleteTransacao={handleDeleteTransacao}
            adminUnlocked={adminUnlocked}
            onToggleAdmin={handleToggleAdmin}
          />
        );
      case 'planos':
        return (
          <PlansTab
            assinatura={assinatura}
            onChangeAssinatura={handleChangeAssinatura}
          />
        );
      default:
        return <div className="text-slate-500">Página em desenvolvimento</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Sidebar de Navegação */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        assinatura={assinatura}
        adminUnlocked={adminUnlocked}
        onToggleAdmin={handleToggleAdmin}
        onSetStatus={handleSetStatusSaaS}
      />

      {/* Conteúdo Principal de Trabalho */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          
          {/* Header Superior sutil para Branding do SaaS */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Tech Gestor</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs text-blue-600 font-black uppercase font-mono tracking-wider">{activeTab}</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Usuário de demonstração */}
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-none">maninhoneeto@gmail.com</p>
                <span className="text-[9px] font-mono font-bold text-emerald-700 tracking-wider">LICENÇA HOMOLOGADA</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-250 text-blue-800 font-black text-xs flex items-center justify-center uppercase">
                MN
              </div>
            </div>
          </div>

          {/* Renderizador de Tabs Dinâmico */}
          <div className="pb-10">
            {renderActiveTab()}
          </div>

        </div>
      </main>

    </div>
  );
}
