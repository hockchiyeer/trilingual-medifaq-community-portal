import assert from 'node:assert/strict';
import { TestGuardian } from './test-guardian.ts';

export async function runResilienceTests(baseUrl: string): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  const testCase = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ ${name}`);
      console.error(`    Error: ${err.message}`);
      failed++;
    }
  };

  console.log(`\n--- Running Teardown & Interruption Resilience Tests ---`);

  await testCase('Guardian Teardown cleans up multiple inserted mock entities on early exit/abort', async () => {
    const isolatedGuardian = new TestGuardian();
    await isolatedGuardian.setup();

    // Inject diverse mock entities under this isolated guardian's prefix
    const mockCatId = `${isolatedGuardian.prefix}abort_cat`;
    const mockUserId = `${isolatedGuardian.prefix}abort_user`;
    const mockFaqId = `${isolatedGuardian.prefix}abort_faq`;

    await fetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mockCatId,
        name: { EN: "Temp Cat", ZH: "临时分类", BM: "Kategori Sementara" },
      }),
    });

    await fetch(`${baseUrl}/api/members/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: mockUserId,
        password: "temp_password",
        email: `${mockUserId}@example.com`,
      }),
    });

    await fetch(`${baseUrl}/api/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: mockFaqId,
        mainId: mockCatId,
        subId: "temp_sub",
        q: { EN: "Temp Q", ZH: "临时问题", BM: "Soalan Sementara" },
        a: { EN: "Temp A", ZH: "临时回答", BM: "Jawapan Sementara" },
      }),
    });

    // Verify they exist in DB prior to teardown
    const midCatRes = await fetch(`${baseUrl}/api/categories`);
    const midCats = await midCatRes.json();
    assert.ok(midCats.some((c: any) => c.id === mockCatId), 'Mock category must exist prior to teardown');

    // Simulate premature abort / termination teardown trigger
    await isolatedGuardian.teardown();

    // Verify all mock records are purged
    const postCatRes = await fetch(`${baseUrl}/api/categories`);
    const postCats = await postCatRes.json();
    assert.ok(!postCats.some((c: any) => c.id === mockCatId), 'Mock category must be purged after teardown');

    const postMemRes = await fetch(`${baseUrl}/api/members`);
    const postMems = await postMemRes.json();
    assert.ok(!postMems.some((m: any) => m.username === mockUserId), 'Mock user must be purged after teardown');

    const postFaqRes = await fetch(`${baseUrl}/api/faqs`);
    const postFaqs = await postFaqRes.json();
    assert.ok(!postFaqs.some((f: any) => f.id === mockFaqId), 'Mock FAQ must be purged after teardown');

    // Verify production integrity remains 100% matched
    const isIntegrityIntact = await isolatedGuardian.verifyProductionIntegrity();
    assert.equal(isIntegrityIntact, true, 'Production data must remain completely intact');
  });

  return { passed, failed };
}
