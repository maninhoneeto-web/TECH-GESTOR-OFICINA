/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  veiculoModelo: string;
  veiculoMarca: string;
  veiculoAno: string;
  veiculoPlaca: string;
  cpfCnpj: string;
  dataCadastro: string;
}

export interface Peca {
  id: string;
  nome: string;
  codigoBarras: string;
  quantidade: number;
  precoCusto: number;
  precoVenda: number;
  categoria: string;
  localizacao: string; // Ex: Prateleira B3
}

export interface Servico {
  id: string;
  descricao: string;
  valorMaoDeObra: number;
  tempoEstimado: string; // Ex: 1h30
}

export interface ItemOrcamentoPeca {
  pecaId: string;
  quantidade: number;
  precoUnitario: number; // Salva o preço de venda da época
}

export interface ItemOrcamentoServico {
  servicoId: string;
  valorUnitario: number; // Salva o valor do serviço da época
}

export interface Orcamento {
  id: string;
  codigo: string; // Ex: ORC-1002
  clienteId: string;
  pecas: ItemOrcamentoPeca[];
  servicos: ItemOrcamentoServico[];
  desconto: number; // Em reais ou percentual (guardaremos em valor absoluto)
  valorTotal: number;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado' | 'Concluido';
  dataCriacao: string;
  dataValidade: string;
  observacoes: string;
  custoTotalPecas: number;
  custoTotalMaoDeObra: number;
  lucroEstimado: number;
}

export interface Transacao {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria: 'Venda de Peça' | 'Serviço Executado' | 'Peças Reposição' | 'Aluguel' | 'Salários' | 'Ferramentas' | 'SaaS Assinatura' | 'Outros';
  valor: number;
  descricao: string;
  data: string;
  orcamentoId?: string;
}

export interface PlanoSaaS {
  id: string;
  nome: string;
  preco: number;
  periodo: 'mensal' | 'anual';
  recursos: string[];
  recomendado: boolean;
  desc: string;
}

export interface CheckInItem {
  id: string;
  clienteId: string;
  tipo: 'entrada' | 'saida';
  data: string;
  hora: string;
  km: number;
  nivelCombustivel: 'Reserva' | '1/4' | '1/2' | '3/4' | 'Cheio';
  checklist: {
    arranhaMassa: boolean;
    faroisLanternas: boolean;
    estepeMacaco: boolean;
    objetosInternos: boolean;
  };
  observacoes: string;
  operador: string;
}

export interface AssinaturaSaaS {
  planoAtivoId: string;
  status: 'trial' | 'active' | 'expired' | 'bloqueado';
  dataVencimento: string;
  cartaoMascarado?: string;
  nomeOficina: string;
}
