import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { getDb } from '@/lib/db/client';

type SqlParam = string | number | boolean | null;

interface SyncResult {
  table: string;
  inserted: number;
  skipped: number;
}

/**
 * Reads either a JSON-array file or a JSONL (newline-delimited JSON) file.
 * Bootstrap script writes plain JSON arrays; older CodeLedger output uses JSONL.
 * Tries the array form first, falls back to line-by-line parsing.
 */
function readJsonRecords(filePath: string): unknown[] {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, 'utf-8').trim();
  if (content.length === 0) return [];

  if (content.startsWith('[')) {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  }

  return content
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function readJsonFile(filePath: string): unknown {
  if (!existsSync(filePath)) return null;
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

function tryReadRecords(dataDir: string, basename: string): unknown[] {
  // Accept both `.json` (array form, written by bootstrap) and `.jsonl`
  // (line-delimited form, written by older CodeLedger output).
  const candidates = [
    join(dataDir, `${basename}.json`),
    join(dataDir, `${basename}.jsonl`),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return readJsonRecords(candidate);
    }
  }
  return [];
}

export async function syncCICHistory(dataDir: string): Promise<SyncResult> {
  const sql = getDb();
  const records = tryReadRecords(dataDir, 'cic-history') as Array<Record<string, unknown>>;

  let inserted = 0;
  let skipped = 0;

  for (const r of records) {
    try {
      await sql.unsafe(
        `INSERT INTO cic_history (id, checked_at, task, completion_state, claim_count, verified_claim_count, mismatch_count, drift_warning_count, persona, pr_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING`,
        [r.id, r.checkedAt, r.task, r.completionState, r.claimCount, r.verifiedClaimCount, r.mismatchCount, r.driftWarningCount, r.persona, r.prNumber] as SqlParam[]
      );
      inserted++;
    } catch {
      skipped++;
    }
  }

  return { table: 'cic_history', inserted, skipped };
}

export async function syncReleaseHistory(dataDir: string): Promise<SyncResult> {
  const sql = getDb();
  const records = tryReadRecords(dataDir, 'release-history') as Array<Record<string, unknown>>;

  let inserted = 0;
  let skipped = 0;

  for (const r of records) {
    try {
      await sql.unsafe(
        `INSERT INTO release_history (id, checked_at, release_state, confidence_score, finding_count, p0_count, p1_count, version_tag)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [r.id, r.checkedAt, r.releaseState, r.confidenceScore, r.findingCount, r.p0Count, r.p1Count, r.versionTag] as SqlParam[]
      );
      inserted++;
    } catch {
      skipped++;
    }
  }

  return { table: 'release_history', inserted, skipped };
}

export async function syncLessons(dataDir: string): Promise<SyncResult> {
  const sql = getDb();
  const filePath = join(dataDir, 'lessons.json');
  const data = readJsonFile(filePath);
  const records = Array.isArray(data) ? (data as Array<Record<string, unknown>>) : [];

  let inserted = 0;
  let skipped = 0;

  for (const r of records) {
    try {
      await sql.unsafe(
        `INSERT INTO lessons (id, title, summary, category, severity, trigger_count, first_seen, last_triggered, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET trigger_count = EXCLUDED.trigger_count, last_triggered = EXCLUDED.last_triggered, active = EXCLUDED.active`,
        [r.id, r.title, r.summary, r.category, r.severity, r.triggerCount, r.firstSeen, r.lastTriggered, r.active] as SqlParam[]
      );
      inserted++;
    } catch {
      skipped++;
    }
  }

  return { table: 'lessons', inserted, skipped };
}

export async function syncHealthSnapshots(dataDir: string): Promise<SyncResult> {
  const sql = getDb();
  const dir = join(dataDir, 'health-snapshots');
  if (!existsSync(dir)) return { table: 'health_snapshots', inserted: 0, skipped: 0 };

  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  let inserted = 0;
  let skipped = 0;

  for (const file of files) {
    const r = readJsonFile(join(dir, file)) as Record<string, unknown> | null;
    if (!r) { skipped++; continue; }

    try {
      await sql.unsafe(
        `INSERT INTO health_snapshots (id, snapshot_at, ahs_score, dri_score, eds_score, sts_score, ofs_score, dcs_score, grade)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [r.id, r.snapshotAt, r.ahsScore, r.driScore, r.edsScore, r.stsScore, r.ofsScore, r.dcsScore, r.grade] as SqlParam[]
      );
      inserted++;
    } catch {
      skipped++;
    }
  }

  return { table: 'health_snapshots', inserted, skipped };
}

export async function runFullSync(dataDir: string): Promise<SyncResult[]> {
  const results: SyncResult[] = [];
  results.push(await syncCICHistory(dataDir));
  results.push(await syncReleaseHistory(dataDir));
  results.push(await syncLessons(dataDir));
  results.push(await syncHealthSnapshots(dataDir));
  return results;
}

// CLI entry point — usable as `node dist/lib/sync/ecl-sync.js --data-dir <path>`
// or via tsx for dev: `tsx src/lib/sync/ecl-sync.ts --data-dir <path>`.
if (process.argv[1] && process.argv[1].includes('ecl-sync')) {
  const args = process.argv.slice(2);
  let dataDir = './data';
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--data-dir' && args[i + 1]) {
      dataDir = args[i + 1] as string;
      i++;
    } else if (arg && arg.startsWith('--data-dir=')) {
      dataDir = arg.slice('--data-dir='.length);
    }
  }

  console.log(`[ecl-sync] Reading from ${dataDir}`);
  runFullSync(dataDir)
    .then((results) => {
      let totalInserted = 0;
      let totalSkipped = 0;
      for (const r of results) {
        console.log(`  ${r.table}: ${String(r.inserted)} inserted, ${String(r.skipped)} skipped`);
        totalInserted += r.inserted;
        totalSkipped += r.skipped;
      }
      console.log(`[ecl-sync] Done: ${String(totalInserted)} inserted, ${String(totalSkipped)} skipped`);
      process.exit(0);
    })
    .catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[ecl-sync] FAILED:', message);
      process.exit(1);
    });
}
