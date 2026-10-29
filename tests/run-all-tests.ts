import http from 'http';
import { app } from '../server.ts';
import { TestGuardian } from './test-guardian.ts';
import { runApiTests } from './api.test.ts';
import { runResilienceTests } from './resilience.test.ts';

async function findOrStartServer(): Promise<{ baseUrl: string; stopServer: () => Promise<void> }> {
  // 1. Check if server is already running on candidate ports
  const candidatePorts = Array.from(new Set([process.env.PORT, '3000', '8080'].filter(Boolean)));
  for (const p of candidatePorts) {
    const candidateUrl = `http://127.0.0.1:${p}`;
    try {
      const res = await fetch(`${candidateUrl}/api/categories`, { signal: AbortSignal.timeout(1200) });
      if (res.ok) {
        console.log(`[TestRunner] Using active server at ${candidateUrl}`);
        return {
          baseUrl: candidateUrl,
          stopServer: async () => {},
        };
      }
    } catch {
      // Continue to next port
    }
  }

  // 2. Spawn ephemeral HTTP server on dynamic port (0)
  console.log(`[TestRunner] Starting ephemeral test server on random free port...`);
  const server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve());
  });

  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;
  console.log(`[TestRunner] Ephemeral test server active at ${baseUrl}`);

  return {
    baseUrl,
    stopServer: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      }),
  };
}

async function main() {
  const startTime = Date.now();
  console.log('================================================================');
  console.log('   MediFAQ Comprehensive Automated Test Suite & Data Guardian   ');
  console.log('================================================================');

  let serverHandle: { baseUrl: string; stopServer: () => Promise<void> } | null = null;
  const guardian = new TestGuardian();

  try {
    // 1. Initialize server
    serverHandle = await findOrStartServer();

    // 2. Setup Guardian (traps signals, removes stale test rows, records baseline snapshot)
    await guardian.setup();

    // 3. Run API integration tests
    const apiResults = await runApiTests(serverHandle.baseUrl, guardian);

    // 4. Run resilience and teardown tests
    const resilienceResults = await runResilienceTests(serverHandle.baseUrl);

    // 5. Normal teardown
    await guardian.teardown();

    // 6. Assert production data integrity
    const integrityPassed = await guardian.verifyProductionIntegrity();

    // 7. Calculate totals
    const totalPassed = apiResults.passed + resilienceResults.passed + (integrityPassed ? 1 : 0);
    const totalFailed = apiResults.failed + resilienceResults.failed + (integrityPassed ? 0 : 1);
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n================================================================');
    console.log('                         TEST SUMMARY                           ');
    console.log('================================================================');
    console.log(`  Total Tests Executed   : ${totalPassed + totalFailed}`);
    console.log(`  Passed                 : ${totalPassed}`);
    console.log(`  Failed                 : ${totalFailed}`);
    console.log(`  Production Data Safe   : ${integrityPassed ? 'YES (100% UNTOUCHED)' : 'NO (VIOLATION)'}`);
    console.log(`  Duration               : ${elapsedSeconds}s`);
    console.log('================================================================\n');

    if (totalFailed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('[TestRunner] Unhandled failure during test execution:', err);
    try {
      await guardian.teardown();
    } catch {}
    process.exit(1);
  } finally {
    if (serverHandle) {
      await serverHandle.stopServer().catch(() => {});
    }
  }
}

main();
