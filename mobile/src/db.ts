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
}

export async function initDb(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ingressos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER,
      dados_json TEXT NOT NULL,
      sincronizado INTEGER NOT NULL DEFAULT 0
    );
  `);
}

/** Salva a compra localmente (passo 1, antes de enviar à API). Retorna o id local. */
export async function inserirIngresso(
  dadosJson: string,
  pedidoId: number | null,
  sincronizado: number,
): Promise<number> {
  const db = await getDb();
  const res = await db.runAsync(
    'INSERT INTO ingressos (pedido_id, dados_json, sincronizado) VALUES (?, ?, ?)',
    pedidoId,
    dadosJson,
    sincronizado,
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

export async function listarIngressos(): Promise<IngressoLocal[]> {
  const db = await getDb();
  return db.getAllAsync<IngressoLocal>('SELECT * FROM ingressos ORDER BY id DESC');
}

export async function listarNaoSincronizados(): Promise<IngressoLocal[]> {
  const db = await getDb();
  return db.getAllAsync<IngressoLocal>(
    'SELECT * FROM ingressos WHERE sincronizado = 0 ORDER BY id ASC',
  );
}

export async function obterIngresso(id: number): Promise<IngressoLocal | null> {
  const db = await getDb();
  return db.getFirstAsync<IngressoLocal>('SELECT * FROM ingressos WHERE id = ?', id);
}
