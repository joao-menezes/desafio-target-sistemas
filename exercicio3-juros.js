const readline = require('readline/promises');

const JUROS_DIARIOS = 0.025;

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  let valor, vencimento;
  try {
    valor = Number((await rl.question('Valor (R$): ')).trim().replace(',', '.'));
    if (!Number.isFinite(valor) || valor <= 0) {
      console.log('Valor inválido');
      return;
    }

    const entrada = dataMask(await rl.question('Data de vencimento (dd/mm/aaaa): '));
    const match = entrada.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
      console.log('Data inválida');
      return;
    }

    const [, dia, mes, ano] = match.map(Number);
    vencimento = new Date(ano, mes - 1, dia);
    if (
      vencimento.getFullYear() !== ano ||
      vencimento.getMonth() !== mes - 1 ||
      vencimento.getDate() !== dia
    ) {
      console.log('Data inválida');
      return;
    }
  } finally {
    rl.close();
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diasAtraso = Math.max(0, Math.round((hoje - vencimento) / 86400000));
  const juros = valor * JUROS_DIARIOS * diasAtraso;

  console.log(`Vencimento: ${vencimento.toLocaleDateString('pt-BR')}`);
  console.log(`Dias em atraso: ${diasAtraso}`);
  console.log(`Juros até hoje: R$ ${juros.toFixed(2)}`);
  console.log(`Total a pagar: R$ ${(valor + juros).toFixed(2)}`);
}

function dataMask(data) {
  const digitos = String(data).replace(/\D/g, '').slice(0, 8);

  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

main();