/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Users, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight,
  TrendingUp as ProfitIcon,
  Wrench,
  Percent,
  FileText,
  Lock,
  Unlock,
  KeyRound,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { Cliente, Peca, Servico, Orcamento, Transacao } from '../types';

interface DashboardProps {
  clientes: Cliente[];
  pecas: Peca[];
  servicos: Servico[];
  orcamentos: Orcamento[];
  transacoes: Transacao[];
  onNavigate: (tabId: string) => void;
  adminUnlocked: boolean;
  onToggleAdmin: () => void;
}

export default function Dashboard({ 
  clientes, 
  pecas, 
  servicos, 
  orcamentos, 
  transacoes, 
  onNavigate,
  adminUnlocked,
  onToggleAdmin
}: DashboardProps) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // 1. Cálculos de Lucros e Faturamento
  const faturamentoTotal = orcamentos
    .filter(o => o.status === 'Concluido' || o.status === 'Aprovado')
    .reduce((acc, o) => acc + o.valorTotal, 0);

  // Custo de peças usadas nos Orçamentos concluídos/aprovados
  const custoPecasUsadas = orcamentos
    .filter(o => o.status === 'Concluido' || o.status === 'Aprovado')
    .reduce((acc, o) => acc + o.custoTotalPecas, 0);

  // Faturamento de Serviços
  const faturamentoServicos = orcamentos
    .filter(o => o.status === 'Concluido' || o.status === 'Aprovado')
    .reduce((acc, o) => acc + o.custoTotalMaoDeObra, 0);

  // Despesa total real cadastrada no financeiro
  const despesasTotais = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + t.valor, 0);

  // Receita total real cadastrada no financeiro
  const receitasTotais = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + t.valor, 0);

  // Lucro Bruto da oficina
  const lucroBruto = faturamentoTotal - custoPecasUsadas;

  // Lucro Líquido Real = Receitas Totais - Despesas Totais
  const lucroLiquidoReal = receitasTotais - despesasTotais;

  // Margem de Lucro Bruto %
  const margemLucroBruto = faturamentoTotal > 0 ? (lucroBruto / faturamentoTotal) * 100 : 0;

  // Valor total bloqueado em estoque físico
  const custoTotalEstoque = pecas.reduce((acc, p) => acc + (p.precoCusto * p.quantidade), 0);
  const valorPotencialEstoque = pecas.reduce((acc, p) => acc + (p.precoVenda * p.quantidade), 0);
  const lucroPotencialEstoque = valorPotencialEstoque - custoTotalEstoque;

  // Alertas de estoque baixo (quantidade < 10)
  const pecasEstoqueBaixo = pecas.filter(p => p.quantidade < 10);

  // Últimos orçamentos pendentes
  const orcamentosPendentes = orcamentos
    .filter(o => o.status === 'Pendente')
    .slice(0, 3);

  // Obter nome de cliente por Id
  const getClienteNome = (id: string) => {
    const cli = clientes.find(c => c.id === id);
    return cli ? cli.nome : 'Cliente Não Identificado';
  };

  // Dados fictícios para o Gráfico de Lucros por Mês (SVG interativo)
  const chartData = [
    { mes: 'Jan', receita: 4200, despesa: 1800, lucro: 2400 },
    { mes: 'Fev', receita: 5100, despesa: 1950, lucro: 3150 },
    { mes: 'Mar', receita: 6200, despesa: 2400, lucro: 3800 },
    { mes: 'Abr', receita: 5800, despesa: 2200, lucro: 3600 },
    { mes: 'Mai', receita: faturamentoTotal > 0 ? Math.round(faturamentoTotal * 0.8) : 7100, despesa: despesasTotais > 0 ? Math.round(despesasTotais * 0.7) : 2900, lucro: 4200 },
    { mes: 'Jun', receita: faturamentoTotal || 8500, despesa: despesasTotais || 3100, lucro: lucroBruto || 5400 }
  ];

  // Configuração para renderizar o gráfico SVG dinamicamente
  const maxVal = Math.max(...chartData.map(d => Math.max(d.receita, d.despesa))) * 1.15;
  const graphHeight = 180;
  const graphWidth = 500;

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      onToggleAdmin();
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="dashboard-tab">
      
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-blue-950 tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            Painel Geral & Performance
          </h2>
          <p className="text-slate-500 text-sm">
            Acompanhe a produtividade operacional, alertas de estoque e o faturamento do seu estabelecimento.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] bg-blue-50 border border-blue-105 rounded-xl py-1.5 px-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          <span className="text-blue-800 font-bold uppercase">SISTEMA ATIVO & INTEGRADO</span>
        </div>
      </div>

      {/* SEÇÃO 1: CARDS DE MÉTRICAS OPERACIONAIS (Sempre Visíveis!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card Fidelização de Clientes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">Base de Clientes</span>
              <span className="text-2xl font-black text-slate-900 mt-1">{clientes.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Proprietários cadastrados na oficina.
          </div>
        </div>

        {/* Card Peças no Catálogo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">Componentes de Estoque</span>
              <span className="text-2xl font-black text-slate-900 mt-1">{pecas.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Tipos de peças ativas com código de barras.
          </div>
        </div>

        {/* Card Serviços Oferecidos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">Serviços Mecânicos</span>
              <span className="text-2xl font-black text-slate-900 mt-1">{servicos.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Procedimentos cadastrados no catálogo.
          </div>
        </div>

        {/* Card Orçamentos Criados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-slate-500">Orçamentos Criados</span>
              <span className="text-2xl font-black text-slate-900 mt-1">{orcamentos.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {orcamentos.filter(o => o.status === 'Concluido').length} Concluídos, {' '}
            {orcamentos.filter(o => o.status === 'Pendente').length} Aguardando.
          </div>
        </div>

      </div>

      {/* SEÇÃO 2: MÉTRICAS FINANCEIRAS E GRÁFICOS (Restrição de Visibilidade Solicitada pelo usuário!) */}
      {!adminUnlocked ? (
        /* LOCK SCREEN FINANCEIRO: Impede que funcionários vejam faturamentos e lucros */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden text-center flex flex-col items-center justify-center gap-4 py-12 shadow-sm" id="dashboard-locked-view">
          <div className="absolute right-0 top-0 -translate-y-4 translate-x-4 text-slate-100">
            <Lock className="w-40 h-40 stroke-[0.3]" />
          </div>
          
          <div className="p-4 bg-amber-50 text-amber-700 rounded-full border border-amber-200 inline-block animate-pulse relative z-10">
            <EyeOff className="w-8 h-8" />
          </div>

          <div className="max-w-md flex flex-col gap-2 relative z-10">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              🔓 Painel Financeiro Restrito ao Dono
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              O faturamento, gráficos de lucratividade, margens e markups comerciais foram ocultados. Para visualizar os dados financeiros consolidados, insira a senha administrativa.
            </p>
          </div>

          <form onSubmit={handleUnlockPin} className="flex flex-col sm:flex-row items-center gap-2 max-w-sm w-full mt-4 relative z-10">
            <div className="relative flex-1 w-full">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Insira a Senha Administrativa..."
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full bg-slate-50 text-slate-800 text-xs pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:bg-white transition ${pinError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'}`}
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition shadow-md w-full sm:w-auto shrink-0 cursor-pointer"
            >
              Revelar Lucros
            </button>
          </form>

          {pinError && (
            <p className="text-xs text-rose-600 font-bold mt-1 font-mono animate-shake relative z-10">
              ❌ Senha incorreta! Use "1234" para testar a simulação do SaaS.
            </p>
          )}

          <div className="mt-4 text-[11px] text-slate-400 font-mono">
            * Dica: Você pode ativar/desativar o Modo Admin a qualquer momento no menu lateral de acesso rápido.
          </div>
        </div>
      ) : (
        /* REVELA CONTEÚDO SENSÍVEL CASO ADMIN ESTEJA DESBLOQUEADO (Branco e Azul) */
        <div className="flex flex-col gap-6" id="dashboard-sensitive-metrics">
          
          {/* Alerta de Modo Protetor Ativo */}
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold">
                Acesso Autenticado de Dono de Oficina Ativo! Relatórios e métricas de lucros reais liberados.
              </span>
            </div>
            <button
              onClick={onToggleAdmin}
              className="text-xs font-extrabold text-blue-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              Bloquear Tela (Esconder)
            </button>
          </div>

          {/* Grid de Balanço Estratégico (Branco e Azul) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Faturamento */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500">Faturamento Efetivo</span>
                  <span className="text-2xl font-black text-slate-900 mt-1">
                    R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 text-[11px] font-mono text-slate-400 flex flex-col gap-0.5">
                <div>• R$ {faturamentoServicos.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} em Serviços</div>
                <div>• R$ {(custoPecasUsadas * 1.5).toLocaleString('pt-BR', { minimumFractionDigits: 1 })} Comercialização Peças</div>
              </div>
            </div>

            {/* Lucro Bruto */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500">Lucro Bruto Comercial</span>
                  <span className="text-2xl font-black text-emerald-700 mt-1">
                    R$ {lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                  <ProfitIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 text-[11px] font-mono text-slate-500">
                Markup médio aplicado: <strong className="text-emerald-600">+{margemLucroBruto.toFixed(1)}% Margem</strong>
              </div>
            </div>

            {/* Saldo Líquido de Caixa */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500">Saldo Líquido Livro Caixa</span>
                  <span className={`text-2xl font-black mt-1 ${lucroLiquidoReal >= 0 ? 'text-blue-700' : 'text-rose-600'}`}>
                    R$ {lucroLiquidoReal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-400 font-mono">
                Receitas: R$ {receitasTotais.toFixed(1)} | Despesas: R$ {despesasTotais.toFixed(1)}
              </div>
            </div>

            {/* Patrimônio Estocado */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500">Capital Ativo em Peças</span>
                  <span className="text-2xl font-black text-slate-900 mt-1">
                    R$ {custoTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
                  <Percent className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-400 font-mono">
                Potencial Venda: R$ {valorPotencialEstoque.toFixed(0)} (+R$ {lucroPotencialEstoque.toFixed(0)} Lucro)
              </div>
            </div>

          </div>

          {/* Gráfico SVG de Fendimento Mensal - Visual White & Blue */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 uppercase tracking-wide">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Evolução Mensal do Faturamento & Margem Comercial
                </h3>
                <p className="text-xs text-slate-500">Visualização de faturamento comparado com custos por competência.</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold font-mono">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                  Receitas Média
                </div>
                <div className="flex items-center gap-1.5 text-rose-500">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                  Despesas Média
                </div>
              </div>
            </div>

            {/* Renderização do Bar-Chart em SVG Limpo (Sem Libs) */}
            <div className="flex justify-center py-2 overflow-x-auto">
              <svg 
                viewBox={`0 0 ${graphWidth} ${graphHeight}`} 
                className="w-full max-w-lg shrink-0 h-44 font-mono select-none"
              >
                {/* Linhas de grade e valores da esquerda */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const val = Math.round(maxVal * ratio);
                  const y = graphHeight - 20 - (graphHeight - 40) * ratio;
                  return (
                    <g key={idx} className="opacity-40">
                      <line 
                        x1="45" 
                        y1={y} 
                        x2={graphWidth - 10} 
                        y2={y} 
                        stroke="#cbd5e1" 
                        strokeDasharray="3,3" 
                        strokeWidth="1" 
                      />
                      <text x="5" y={y + 4} className="text-[9px] fill-slate-500 font-bold">R$ {val}</text>
                    </g>
                  );
                })}

                {/* Plotagem de Colunas de Receita, Despesa e Lucro */}
                {chartData.map((d, i) => {
                  const itemWidth = (graphWidth - 60) / chartData.length;
                  const xCenter = 50 + i * itemWidth;
                  
                  // Alturas proporcionais
                  const recH = ((graphHeight - 40) * d.receita) / maxVal;
                  const despH = ((graphHeight - 40) * d.despesa) / maxVal;

                  const recY = graphHeight - 20 - recH;
                  const despY = graphHeight - 20 - despH;

                  return (
                    <g key={i} className="group cursor-pointer">
                      {/* Barra de Receita (Sky Blue) */}
                      <rect 
                        x={xCenter + 2} 
                        y={recY} 
                        width={itemWidth * 0.35} 
                        height={recH} 
                        fill="#3b82f6" 
                        rx="4"
                        className="hover:opacity-90 transition duration-200" 
                      />
                      
                      {/* Barra de Despesas (Rose Red) */}
                      <rect 
                        x={xCenter + itemWidth * 0.35 + 4} 
                        y={despY} 
                        width={itemWidth * 0.35} 
                        height={despH} 
                        fill="#f43f5e" 
                        rx="4"
                        className="hover:opacity-90 transition duration-200" 
                      />

                      {/* Info de Lucro sutil flutuante acima */}
                      <text 
                        x={xCenter + itemWidth * 0.35} 
                        y={Math.min(recY, despY) - 5} 
                        className="text-[8px] font-black fill-emerald-600 text-center opacity-0 group-hover:opacity-100 transition duration-200" 
                        textAnchor="middle"
                      >
                        +{Math.round(((d.receita - d.despesa)/d.despesa)*100)}%
                      </text>

                      {/* Identificador de Mês no Eixo X */}
                      <text 
                        x={xCenter + itemWidth * 0.35} 
                        y={graphHeight - 5} 
                        className="text-[10px] font-bold fill-slate-500" 
                        textAnchor="middle"
                      >
                        {d.mes}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100">
              <span>* Os dados consolidados do mês de Junho refletem as baixas automáticas dos orçamentos aprovados de sua oficina.</span>
            </div>
          </div>

        </div>
      )}

      {/* SEÇÃO 3: NOTIFICAÇÕES E SEÇÃO OPERACIONAL (Branco e Azul) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel de Alertas de Reposição */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm lg:col-span-1">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
            Alertas de Reposição Mecânica
          </h3>

          <div className="flex flex-col gap-3">
            {pecasEstoqueBaixo.length > 0 ? (
              pecasEstoqueBaixo.slice(0, 3).map((p) => (
                <div key={p.id} className="flex gap-3 bg-amber-50/60 border border-amber-200 py-3 px-3.5 rounded-xl items-center justify-between">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">{p.nome}</span>
                    <span className="text-[10px] text-amber-700 font-mono mt-0.5">Estoque Crítico: restam {p.quantidade} un. Se prateleira: {p.localizacao}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('estoque')}
                    className="px-2.5 py-1 text-[10px] font-black text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shrink-0 cursor-pointer"
                  >
                    Repor
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                Níveis de suprimentos operando em verde! 🟢
              </div>
            )}

            {/* Dica do SaaS para Oficina */}
            <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 flex flex-col gap-1 text-[11px] mt-1">
              <span className="text-blue-700 font-black font-mono uppercase tracking-wider text-[9px]">Insight Corporativo Tech Gestor</span>
              <p className="text-slate-600 leading-relaxed font-sans">
                Lembre de cobrar o valor correto sobre as peças vendidas: configurar markups de 40% a 60% custeia custos de frete e garante maior lucratividade operacional!
              </p>
            </div>
          </div>
        </div>

        {/* Orçamentos Pendentes Rápidos */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-blue-650" />
              Orçamentos Aguardando Aprovação
            </h3>
            <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-750 px-2 py-0.5 rounded-full font-mono font-bold">
              {orcamentos.filter(o => o.status === 'Pendente').length} em espera
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {orcamentosPendentes.length > 0 ? (
              orcamentosPendentes.map((orc) => (
                <div 
                  key={orc.id} 
                  className="p-3.5 bg-slate-50/70 hover:bg-slate-50 transition border border-slate-200/80 rounded-xl flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-800 truncate">{getClienteNome(orc.clienteId)}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{orc.codigo}</span>
                    </div>
                    <span className="text-xs font-bold text-blue-700 font-mono">
                      R$ {orc.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 pt-2 text-[10px]">
                    <span className="text-slate-500 font-mono">Ficha: {orc.dataCriacao}</span>
                    <button 
                      onClick={() => onNavigate('orcamentos')} 
                      className="text-blue-600 hover:text-blue-700 font-black flex items-center gap-0.5 cursor-pointer"
                    >
                      Processar Aprovação <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-6 text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                Nenhum orçamento pendente para aprovar no momento! 😊
              </div>
            )}
          </div>
        </div>
        
      </div>

    </div>
  );
}
