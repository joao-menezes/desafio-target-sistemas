const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');

const { estoque } = JSON.parse(fs.readFileSync(path.join(__dirname, 'estoque.json'), 'utf8'));
const movimentacoes = [];
let proximoId = 1;

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log('Produtos:');
  for (const p of estoque) {
    console.log(`  ${p.codigoProduto} - ${p.descricaoProduto} (estoque: ${p.estoque})`);
  }

  while (true) {
    const codigo = Number(await rl.question('\nCódigo do produto (0 para sair): '));
    if (codigo === 0) break;

    const produto = estoque.find((p) => p.codigoProduto === codigo);
    if (!produto) {
      console.log('Produto não encontrado.');
      continue;
    }

    const tipo = await rl.question('Tipo: 1 - Entrada | 2 - Saída: ');
    if (tipo !== '1' && tipo !== '2') {
      console.log('Tipo inválido.');
      continue;
    }

    const quantidade = Number(await rl.question('Quantidade: '));
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      console.log('Quantidade inválida.');
      continue;
    }

    const entrada = tipo === '1';
    if (!entrada && quantidade > produto.estoque) {
      console.log(`Estoque insuficiente (disponível: ${produto.estoque}).`);
      continue;
    }

    produto.estoque += entrada ? quantidade : -quantidade;

    const movimentacao = {
      id: proximoId++,
      descricao: entrada ? 'Entrada de mercadoria' : 'Saída de mercadoria',
      produto: produto.descricaoProduto,
      quantidade,
    };
    movimentacoes.push(movimentacao);

    console.log(
      `Movimentação #${movimentacao.id} - ${movimentacao.descricao}: ${quantidade} un. de ${produto.descricaoProduto}`
    );
    console.log(`Quantidade final em estoque: ${produto.estoque}`);
  }

  rl.close();
  console.log(`\n${movimentacoes.length} movimentações registradas.`);
}

main();
