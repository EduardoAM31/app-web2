import * as SQLite from 'expo-sqlite';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('cinemagyn.db');
  }
  return dbPromise;
}

export interface IngressoLocal {
  id: number;
  pedido_id: number | null;
  dados_json: string;
  sincronizado: number;
  user_id: number | null;
}

export async function initDb(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ingressos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER,
      dados_json TEXT NOT NULL,
      sincronizado INTEGER NOT NULL DEFAULT 0,
      user_id INTEGER
    );
  `);

  // Migração para bancos criados antes da coluna user_id.
  const cols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(ingressos)');
  if (!cols.some((c) => c.name === 'user_id')) {
    await db.execAsync('ALTER TABLE ingressos ADD COLUMN user_id INTEGER');
  }
}

/** Salva a compra localmente (passo 1), associada ao usuário logado. Retorna o id local. */
export async function inserirIngresso(
  dadosJson: string,
  pedidoId: number | null,
  sincronizado: number,
  userId: number,
): Promise<number> {
  const db = await getDb();
  const res = await db.runAsync(
    'INSERT INTO ingressos (pedido_id, dados_json, sincronizado, user_id) VALUES (?, ?, ?, ?)',
    pedidoId,
    dadosJson,
    sincronizado,
    userId,
  );
  return res.lastInsertRowId;
}

/** Marca um ingresso local como sincronizado, gravando o id do pedido remoto. */
export async function atualizarSincronizado(
  localId: number,
  pedidoId: number,
  dadosJson: string,
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE ingressos SET pedido_id = ?, sincronizado = 1, dados_json = ? WHERE id = ?',
    pedidoId,
    dadosJson,
    localId,
  );
}

/** Ingressos do usuário informado (separados por conta). */
export async function listarIngressos(userId: number): Promise<IngressoLocal[]> {
  const db = await getDb();
  return db.getAllAsync<IngressoLocal>(
    'SELECT * FROM ingressos WHERE user_id = ? ORDER BY id DESC',
    userId,
  );
}

/** Compras ainda não sincronizadas do usuário informado. */
export async function listarNaoSincronizados(userId: number): Promise<IngressoLocal[]> {
  const db = await getDb();
  return db.getAllAsync<IngressoLocal>(
    'SELECT * FROM ingressos WHERE sincronizado = 0 AND user_id = ? ORDER BY id ASC',
    userId,
  );
}

export async function obterIngresso(id: number): Promise<IngressoLocal | null> {
  const db = await getDb();
  return db.getFirstAsync<IngressoLocal>('SELECT * FROM ingressos WHERE id = ?', id);
}
