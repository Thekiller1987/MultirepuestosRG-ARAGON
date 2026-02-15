// RUTA: src/pages/pos/components/calculateClientCreditStatus.js

/**
 * Calcula el saldo pendiente de un cliente basándose en su historial completo de transacciones.
 * @param {string | number} clientId - El ID del cliente.
 * @param {Array<Object>} allTransactions - Todas las transacciones.
 * @returns {{currentBalance: number}} - Un objeto con el saldo pendiente final.
 */
export function calculateClientCreditStatus(clientId, allTransactions) {
  // Si no hay cliente o transacciones, no hay nada que calcular.
  if (!clientId || !Array.isArray(allTransactions)) {
    return { currentBalance: 0 };
  }

  // 1. Filtramos solo las transacciones que pertenecen al cliente y NO están canceladas.
  const clientTransactions = allTransactions
    .filter(tx => (tx.clientId === clientId || tx.idCliente === clientId) && tx.estado !== 'CANCELADA')
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // 2. Ordenamos de la más vieja a la más nueva.

  // 3. Empezamos la cuenta del cliente en CERO.
  let saldoActual = 0;

  // 4. Recorremos cada transacción en orden para construir el saldo.
  for (const tx of clientTransactions) {
    // --- PARSEO ROBUSTO (BANK LEVEL) ---
    let pd = tx.pagoDetalles || {};
    if (typeof pd === 'string') {
      try { pd = JSON.parse(pd); } catch (e) { pd = {}; }
    }

    // --- REGLA #1: VENTA A CRÉDITO (AUMENTA LA DEUDA) ---
    // Si la transacción es una venta COMPLETADA y tiene un monto a crédito,
    // ese monto se SUMA al saldo del cliente.
    // Usamos 'pd' que ya está parseado y validado.
    if (tx.estado === 'COMPLETADA' && pd.credito > 0) {
      saldoActual += Number(pd.credito);
    }

    // --- REGLA #2: PAGO O DEVOLUCIÓN (DISMINUYE LA DEUDA) ---
    // Si la transacción es un ABONO (pago) o una DEVOLUCIÓN,
    // el total de esa transacción se RESTA del saldo del cliente.
    else if (tx.estado === 'ABONO_CREDITO' || tx.estado === 'DEVOLUCION') {
      saldoActual -= Math.abs(Number(tx.totalVenta));
    }
  }

  // 5. El saldo final nunca puede ser menor que cero.
  const saldoFinal = Math.max(0, saldoActual);

  // 6. Devolvemos el resultado final.
  return {
    currentBalance: saldoFinal,
  };
}