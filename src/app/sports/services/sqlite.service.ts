import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { BehaviorSubject } from 'rxjs';
import { FavoriteSport } from '../interfaces/favorite-sport';

type FavoriteSportRow = {
  userUUID?: string;
  idEvent?: string;
};

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private readonly sqliteConnection = new SQLiteConnection(CapacitorSQLite);
  private readonly dbName = 'sportly';
  private db?: SQLiteDBConnection;
  private initPromise?: Promise<void>;

  readonly dbReady$ = new BehaviorSubject<boolean>(false);

  async init(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.initDatabase().catch((error) => {
        this.initPromise = undefined;
        this.dbReady$.next(false);
        throw error;
      });
    }

    return this.initPromise;
  }

  async getFavoriteSports(userUUID: string): Promise<FavoriteSport[]> {
    const db = await this.getDb();
    const result = await db.query(
      `SELECT userUUID, idEvent
       FROM partidas_favoritas
       WHERE userUUID = ?
       ORDER BY idEvent;`,
      [userUUID],
    );

    return (result.values ?? [])
      .filter((row): row is FavoriteSportRow => typeof row?.idEvent === 'string')
      .map((row) => ({
        idEvent: row.idEvent,
        userID: row.userUUID ?? userUUID,
      }));
  }

  async addFavoriteSport(userUUID: string, idEvent: string): Promise<void> {
    const db = await this.getDb();
    await db.run(
      `INSERT OR IGNORE INTO partidas_favoritas (userUUID, idEvent)
       VALUES (?, ?);`,
      [userUUID, idEvent],
    );
    await this.persistWebStore();
  }

  async deleteFavoriteSport(userUUID: string, idEvent: string): Promise<void> {
    const db = await this.getDb();
    await db.run(
      `DELETE FROM partidas_favoritas
       WHERE userUUID = ? AND idEvent = ?;`,
      [userUUID, idEvent],
    );
    await this.persistWebStore();
  }

  private async getDb(): Promise<SQLiteDBConnection> {
    await this.init();

    if (!this.db) {
      throw new Error('SQLite database sportly.db is not initialized.');
    }

    return this.db;
  }

  private async initDatabase(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.initWebPlatform();
    }

    await this.copyBundledDatabase();

    this.db = await this.openConnection();
    const isOpen = await this.db.isDBOpen().catch(() => ({ result: false }));
    if (!isOpen.result) {
      await this.db.open();
    }

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS partidas_favoritas (
        userUUID TEXT,
        idEvent TEXT,
        PRIMARY KEY (userUUID, idEvent)
      );
    `);

    this.dbReady$.next(true);
  }

  private async initWebPlatform(): Promise<void> {
    this.ensureJeepSqliteElement();
    await customElements.whenDefined('jeep-sqlite');
    await this.sqliteConnection.initWebStore();
  }

  private ensureJeepSqliteElement(): void {
    if (typeof document === 'undefined' || document.querySelector('jeep-sqlite')) {
      return;
    }

    const jeepSqlite = document.createElement('jeep-sqlite');
    jeepSqlite.setAttribute('autosave', 'true');
    jeepSqlite.setAttribute('wasmpath', '/assets');
    document.body.appendChild(jeepSqlite);
  }

  private async openConnection(): Promise<SQLiteDBConnection> {
    const hasConnection = await this.sqliteConnection.isConnection(this.dbName, false);
    if (hasConnection.result) {
      return this.sqliteConnection.retrieveConnection(this.dbName, false);
    }

    return this.sqliteConnection.createConnection(
      this.dbName,
      false,
      'no-encryption',
      1,
      false,
    );
  }

  private async copyBundledDatabase(): Promise<void> {
    const dbExists = await this.sqliteConnection
      .isDatabase(this.dbName)
      .catch(() => ({ result: false }));

    if (dbExists.result) {
      return;
    }

    await this.sqliteConnection.copyFromAssets(false).catch((error) => {
      console.warn('Could not copy bundled sportly.db, creating it at runtime instead:', error);
    });
  }

  private async persistWebStore(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqliteConnection.saveToStore(this.dbName);
    }
  }
}
