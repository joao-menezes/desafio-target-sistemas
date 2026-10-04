const fs = require('fs');
const path = require('path');

const { vendas } = JSON.parse(fs.readFileSync(path.join(__dirname, 'vendas.json')));

function calcularComissao(valor) {
  if (valor < 100) return 0;
  if (valor < 500) return valor * 0.01;
  return valor * 0.05;
}

const comissoes = {};
for (const { vendedor, valor } of vendas) {
  comissoes[vendedor] = (comissoes[vendedor] || 0) + calcularComissao(valor);
}

for (const [vendedor, total] of Object.entries(comissoes)) {
  console.log(`${vendedor}: R$ ${total.toFixed(2)}`);
}
