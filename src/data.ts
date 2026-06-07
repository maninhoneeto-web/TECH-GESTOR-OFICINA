/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Cliente, Peca, Servico, Orcamento, Transacao, PlanoSaaS, AssinaturaSaaS, CheckInItem } from './types';

export const CLIENTES_PADRAO: Cliente[] = [
  {
    id: 'c1',
    nome: 'Carlos Eduardo Souza',
    telefone: '(11) 98765-4321',
    email: 'carlosedu@gmail.com',
    veiculoMarca: 'Toyota',
    veiculoModelo: 'Corolla Altis',
    veiculoAno: '2021',
    veiculoPlaca: 'BRA2E19',
    cpfCnpj: '123.456.789-00',
    dataCadastro: '2026-01-15'
  },
  {
    id: 'c2',
    nome: 'Mariana Santos Costa',
    telefone: '(11) 97777-8888',
    email: 'mari.costa@hotmail.com',
    veiculoMarca: 'Honda',
    veiculoModelo: 'Civic LX',
    veiculoAno: '2019',
    veiculoPlaca: 'CYB5F54',
    cpfCnpj: '987.654.321-11',
    dataCadastro: '2026-02-10'
  },
  {
    id: 'c3',
    nome: 'Roberto Alves Oliveira',
    telefone: '(21) 96543-2109',
    email: 'roberto.alves@yahoo.com.br',
    veiculoMarca: 'Chevrolet',
    veiculoModelo: 'Onix Premier',
    veiculoAno: '2022',
    veiculoPlaca: 'TEC9G42',
    cpfCnpj: '456.789.123-22',
    dataCadastro: '2026-03-05'
  },
  {
    id: 'c4',
    nome: 'Beatriz Vasconcellos Melo',
    telefone: '(31) 98989-1234',
    email: 'bia.melo@gmail.com',
    veiculoMarca: 'Jeep',
    veiculoModelo: 'Compass Longitude',
    veiculoAno: '2020',
    veiculoPlaca: 'OFN7D33',
    cpfCnpj: '321.654.987-44',
    dataCadastro: '2026-04-22'
  }
];

export const PECAS_PADRAO: Peca[] = [
  {
    id: 'p1',
    nome: 'Pastilha de Freio Dianteira Bosch',
    codigoBarras: '7891234567890',
    quantidade: 14,
    precoCusto: 110.00,
    precoVenda: 189.90,
    categoria: 'Freio',
    localizacao: 'Prateleira A1'
  },
  {
    id: 'p2',
    nome: 'Filtro de Óleo Fram PH5317',
    codigoBarras: '7890123456789',
    quantidade: 32,
    precoCusto: 22.50,
    precoVenda: 45.00,
    categoria: 'Filtros',
    localizacao: 'Prateleira B3'
  },
  {
    id: 'p3',
    nome: 'Óleo de Motor Castrol Edge 5W30 (1L)',
    codigoBarras: '7893216549870',
    quantidade: 45,
    precoCusto: 38.00,
    precoVenda: 69.90,
    categoria: 'Lubrificantes',
    localizacao: 'Prateleira B1'
  },
  {
    id: 'p4',
    nome: 'Amortecedor Dianteiro Cofap Monotubo',
    codigoBarras: '7894561237895',
    quantidade: 8,
    precoCusto: 280.00,
    precoVenda: 499.00,
    categoria: 'Suspensão',
    localizacao: 'Gabinete C2'
  },
  {
    id: 'p5',
    nome: 'Correia Dentada Gates Super Force',
    codigoBarras: '7897894561230',
    quantidade: 5,
    precoCusto: 75.00,
    precoVenda: 145.00,
    categoria: 'Motor',
    localizacao: 'Prateleira D4'
  }
];

export const SERVICOS_PADRAO: Servico[] = [
  {
    id: 's1',
    descricao: 'Alinhamento 3D e Balanceamento Rodas',
    valorMaoDeObra: 150.00,
    tempoEstimado: '1h 00m'
  },
  {
    id: 's2',
    descricao: 'Revisão Básica (Troca de Óleo + Filtros + Checklist de 25 itens)',
    valorMaoDeObra: 120.00,
    tempoEstimado: '1h 30m'
  },
  {
    id: 's3',
    descricao: 'Substituição das Pastilhas de Freio e Discos',
    valorMaoDeObra: 180.00,
    tempoEstimado: '2h 00m'
  },
  {
    id: 's4',
    descricao: 'Diagnóstico Computadorizado via Scanner OBD2 + Laudo Técnico',
    valorMaoDeObra: 90.00,
    tempoEstimado: '45m'
  },
  {
    id: 's5',
    descricao: 'Instalação / Substituição de Kit de Amortecedores Dianteiros',
    valorMaoDeObra: 300.00,
    tempoEstimado: '3h 00m'
  }
];

export const ORCAMENTOS_PADRAO: Orcamento[] = [
  {
    id: 'o1',
    codigo: 'ORC-2601',
    clienteId: 'c1',
    pecas: [
      { pecaId: 'p3', quantidade: 4, precoUnitario: 69.90 }, // Oleo
      { pecaId: 'p2', quantidade: 1, precoUnitario: 45.00 }  // Filtro
    ],
    servicos: [
      { servicoId: 's2', valorUnitario: 120.00 } // Revisao Basica
    ],
    desconto: 20.00,
    valorTotal: 424.60,
    status: 'Concluido',
    dataCriacao: '2026-05-12',
    dataValidade: '2026-05-22',
    observacoes: 'Cliente realizou a revisão anual e troca preventiva do óleo e filtro.',
    custoTotalPecas: 174.50, // (4 * 38.00) + 22.50
    custoTotalMaoDeObra: 120.00,
    lucroEstimado: 130.10 // 424.60 - 174.50 (custo pecas) - 120.00 (custo mao de obra que é 100% lucro se for proprio, ou podemos calcular lucro total = precoVendaTotal - precoCustoTotal = (424.60) - 174.50 = 250.10)
  },
  {
    id: 'o2',
    codigo: 'ORC-2602',
    clienteId: 'c2',
    pecas: [
      { pecaId: 'p1', quantidade: 1, precoUnitario: 189.90 } // Pastilha
    ],
    servicos: [
      { servicoId: 's3', valorUnitario: 180.00 } // Substituicao freio
    ],
    desconto: 10.00,
    valorTotal: 359.90,
    status: 'Aprovado',
    dataCriacao: '2026-06-01',
    dataValidade: '2026-06-11',
    observacoes: 'Barulho na frenagem identificado. Necessário fazer a troca recomendada.',
    custoTotalPecas: 110.00,
    custoTotalMaoDeObra: 180.00,
    lucroEstimado: 249.90 // 359.90 - 110.00 = 249.90
  },
  {
    id: 'o3',
    codigo: 'ORC-2603',
    clienteId: 'c3',
    pecas: [
      { pecaId: 'p4', quantidade: 2, precoUnitario: 499.00 } // Amortecedores
    ],
    servicos: [
      { servicoId: 's5', valorUnitario: 300.00 }, // Troca amortecedor
      { servicoId: 's1', valorUnitario: 150.00 }  // Alinhamento
    ],
    desconto: 50.00,
    valorTotal: 1398.00,
    status: 'Pendente',
    dataCriacao: '2026-06-05',
    dataValidade: '2026-06-15',
    observacoes: 'Amortecedores dianteiros estourados. Necessário alinhar na troca.',
    custoTotalPecas: 560.00, // 2 * 280
    custoTotalMaoDeObra: 450.00,
    lucroEstimado: 838.00 // 1398.00 - 560.00 = 838.00
  }
];

export const TRANSCOES_PADRAO: Transacao[] = [
  {
    id: 't1',
    tipo: 'receita',
    categoria: 'Serviço Executado',
    valor: 424.60,
    descricao: 'Pagamento referente ao Orçamento ORC-2601 - Carlos Eduardo Souza',
    data: '2026-05-12',
    orcamentoId: 'o1'
  },
  {
    id: 't2',
    tipo: 'despesa',
    categoria: 'Peças Reposição',
    valor: 400.00,
    descricao: 'Compra de lote extra de óleo de motor Castrol Edge 10 unidades',
    data: '2026-05-15'
  },
  {
    id: 't3',
    tipo: 'despesa',
    categoria: 'Aluguel',
    valor: 1500.00,
    descricao: 'Aluguel do galpão principal - Junho/2026',
    data: '2026-06-01'
  },
  {
    id: 't4',
    tipo: 'receita',
    categoria: 'Serviço Executado',
    valor: 359.90,
    descricao: 'Adiantamento de Orçamento ORC-2602 - Mariana Santos',
    data: '2026-06-02',
    orcamentoId: 'o2'
  },
  {
    id: 't5',
    tipo: 'despesa',
    categoria: 'Ferramentas',
    valor: 320.00,
    descricao: 'Compra de Jogo de Chaves Allen e Torx Profissionais',
    data: '2026-06-03'
  }
];

export const PLANOS_PADRAO: PlanoSaaS[] = [
  {
    id: 'p_starter',
    nome: 'Plano Mensal Oficina',
    preco: 69.00,
    periodo: 'mensal',
    desc: 'Ideal para oficinas compactas e independentes que buscam controle total de clientes, estoque e finanças.',
    recursos: [
      'Clientes & Veículos Ilimitados',
      'Controle de Estoque Inteligente',
      'Leitor de Código de Barras básico',
      'Gerenciador de Orçamentos ilimitados com WhatsApp',
      'Check-in e Check-out Digital de Entrada',
      'Financeiro Simplificado (Receitas e Despesas)'
    ],
    recomendado: false
  },
  {
    id: 'p_pro',
    nome: 'Plano Anual Oficina',
    preco: 599.00,
    periodo: 'anual',
    desc: 'O melhor custo-benefício para oficinas modernas. Garanta acesso ininterrupto o ano inteiro por menos de R$ 50/mês!',
    recursos: [
      'Tudo do Plano Mensal com desconto de R$ 229,00',
      'Estoque Inteligente (Gavetas/Prateleiras)',
      'Motor Barcode Instantâneo Integrado',
      'Relatório de Margem de Lucro Avançado & Gráficos',
      'Criação de Orçamentos em PDF com um clique para WhatsApp',
      'Suporte Prioritário Via WhatsApp',
      'Permissão para funcionários/usuários simultâneos'
    ],
    recomendado: true
  },
  {
    id: 'p_enterprise',
    nome: 'Cyber Workshop Enterprise',
    preco: 99.00,
    periodo: 'mensal',
    desc: 'Máxima potência, automatização administrativa avançada e suporte prioritário dedicado.',
    recursos: [
      'Tudo do plano Anual em cobrança mensal premium',
      'Previsibilidade de faturamento com Inteligência Artificial',
      'Controle de Fluxo de Caixa Avançado Integrado',
      'Níveis de acesso personalizáveis para múltiplos mecânicos',
      'Painéis executivos para donos e franqueados',
      'Suporte Premium Dedicado 24/7 com gerente de conta'
    ],
    recomendado: false
  }
];

export const ASSINATURA_PADRAO: AssinaturaSaaS = {
  planoAtivoId: 'p_pro',
  status: 'trial',
  dataVencimento: '2026-06-22',
  nomeOficina: 'Oficina Ultra Car Motors Sp'
};

export const CHECKINS_PADRAO: CheckInItem[] = [
  {
    id: 'ck_1',
    clienteId: 'c1',
    tipo: 'entrada',
    data: '2026-06-05',
    hora: '09:30',
    km: 48500,
    nivelCombustivel: '1/2',
    checklist: {
      arranhaMassa: true, // risco encontrado na lateral esquerda
      faroisLanternas: true, // lanternas OK
      estepeMacaco: true, // estepe presente
      objetosInternos: false // pertences do cliente recolhidos na entrada
    },
    observacoes: 'Leve risco na porta traseira do motorista. Lanternas traseiras e dianteiras em perfeitas condições operacionais. Chave de roda e ferramentas prontas na mala.',
    operador: 'Mecânico Chefe'
  },
  {
    id: 'ck_2',
    clienteId: 'c2',
    tipo: 'entrada',
    data: '2026-06-06',
    hora: '14:15',
    km: 32120,
    nivelCombustivel: '3/4',
    checklist: {
      arranhaMassa: false,
      faroisLanternas: true,
      estepeMacaco: true,
      objetosInternos: true
    },
    observacoes: 'Pintura impecável, sem avarias. Som de fábrica cadastrado e presente. Entrega limpa solicitada pelo cliente Mariana Santos.',
    operador: 'Mecânico Chefe'
  }
];
