
const { StockDetective } = require('./src/lib/detective/index.ts');

async function runTest() {
    console.log("Starting Stock Detective performance test...");
    const start = Date.now();
    const detective = new StockDetective();

    try {
        const results = await detective.getWatchlistAnalysis();
        const duration = Date.now() - start;

        console.log(`\nAnalysis completed in ${duration}ms`);
        console.log(`Total stocks analyzed: ${results.length}`);

        results.forEach(stock => {
            console.log(`\nSymbol: ${stock.symbol}`);
            console.log(`Risk Score: ${stock.riskScore}`);
            if (stock.riskReasons.length > 0) {
                console.log('Reasons:', stock.riskReasons);
            }
        });

    } catch (error) {
        console.error("Test failed:", error);
    }
}

// Mocking yahoo-finance2 for strictly running the logic part if needed, 
// but here we want to test the actual fetch time if possible.
// However, 'src/lib/detective/index.ts' uses ES modules (import/export) which might fail in plain node script without ts-node.
// I will check if I can run this with existing project tools or if I need to rely on next.js runtime.
// Since I can't easily invoke ts-node, I will try to convert this checks to a proper Next.js API route or similar to running it inside the environment.
// For now, let's just inspect the code thoroughly and apply optimizations I know are needed.

console.log("Use a Next.js route for actual testing due to TS/ESM constraints.");
