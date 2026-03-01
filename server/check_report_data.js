const pool = require('./src/config/db');

(async () => {
    try {
        console.log("Conectando...");
        // Find the bad session
        const [rows] = await pool.query(`
            SELECT id, detalles_json 
            FROM caja_sesion 
            WHERE status = 'CERRADA'
            ORDER BY closed_at DESC 
            LIMIT 10
        `);

        for (const r of rows) {
            if (r.detalles_json) {
                let json = r.detalles_json;
                if (typeof json === 'string') {
                    json = JSON.parse(json);
                }
                const txs = json.transactions || [];
                const badTx = txs.find(t => {
                    if (!t) return false;
                    let pd = t.pagoDetalles || {};
                    if (typeof pd === 'string') pd = JSON.parse(pd);
                    return (pd.tarjeta <= -1000000 || pd.transferencia <= -1000000 || pd.efectivo <= -1000000 || t.amount <= -1000000);
                });
                if (badTx) {
                    console.log("FOUND BAD TX IN SESSION ID:", r.id);
                    console.log(JSON.stringify(badTx, null, 2));
                }
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("ERROR:", error.message);
        process.exit(1);
    }
})();
