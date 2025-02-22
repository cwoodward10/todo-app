interface QueryOptions {
  parse: boolean;
}

interface DatabaseConfig {
  debug?: boolean;
}

interface SQLiteConfig extends DatabaseConfig {
  db: string | URL;
  sql: string | URL;
  tables: string | URL;
  views: string | URL;
  extensions?: string | URL | Array<string | URL>;
  adaptor: any;
}

interface TursoConfig extends DatabaseConfig {
  db: any;
  files: any;
}

interface D1Config extends DatabaseConfig {
  db: any;
  files: any;
}

interface FileSystem {
  readFile: (path: string, encoding: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  readdir: (path: string) => Promise<string[]>;
  join: (...paths: string[]) => string;
  readSql: (path: string) => Promise<string>;
}

interface Paths {
  tables: string;
  views: string;
  sql: string;
  types: string;
  migrations: string;
  wrangler?: string;
  files?: string;
}

declare class Database {
  constructor(options: DatabaseConfig);
  runMigration(sql: string): Promise<void>;
  makeTypes(fileSystem: FileSystem, paths: Paths): Promise<void>;
  getClient(): TypedDb; 
  getTables(): Promise<string>;
  createMigration(fileSystem: FileSystem, paths: Paths, name: string, reset?: boolean): Promise<string>;
  run(args: { query: any, params?: any }): Promise<number>;
  all<T>(args: { query: any, params?: any, options?: QueryOptions }): Promise<Array<T>>;
  exec(query: string): Promise<void>;
}

declare class SQLiteDatabase extends Database {
  constructor(options: SQLiteConfig);
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  close(): Promise<void>;
}

declare class TursoDatabase extends Database {
  constructor(options: TursoConfig);
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  batch(handler: (batcher: any) => any[]): Promise<any[]>;
}

declare class D1Database extends Database {
  constructor(options: D1Config);
  batch(handler: (batcher: any) => any[]): Promise<any[]>;
}



interface Keywords<T> {
  orderBy?: Array<keyof T> | keyof T;
  desc?: boolean;
  limit?: number;
  offset?: number;
  distinct?: boolean;
}

interface VirtualKeywords<T> {
  rank?: true;
  bm25?: Record<keyof Omit<T, "rowid">, number>;
  limit?: number;
  offset?: number;
}

interface Highlight<T> extends VirtualKeywords<T> {
  highlight: { column: keyof T, tags: [string, string] };
}

interface Snippet<T> extends VirtualKeywords<T> {
  snippet: { column: keyof T, tags: [string, string], trailing: string, tokens: number };
}

interface HighlightQuery<W, T> extends Highlight<T> {
  where?: W;
}

interface SnippetQuery<W, T> extends Snippet<T> {
  where?: W;
}

interface VirtualQuery<W, T> extends VirtualKeywords<T> {
  where?: W;
}

interface VirtualQueryObject<W, A, K, T, N> extends VirtualQuery<W, T> {
  select: (Alias<T, A, N> | K)[] | (keyof T)[];
}

interface VirtualQueryValue<W, K, T> extends VirtualQuery<W, T> {
  select: K;
}

interface VirtualQuerySelector<W, T, N> extends VirtualQuery<W, T> {
  select: (selector: TableObject<T>) => N;
}

interface CountQuery<W> {
  where?: W;
  distinct?: boolean;
}

interface ComplexQuery<W, T> extends Keywords<T> {
  where?: W;
  select: undefined;
}

interface ComplexQueryObject<W, A, K, T, N> extends Keywords<T & Record<A, null>> {
  where?: W;
  select: (Alias<T, A, N> | K)[] | (keyof T)[];
}

interface ComplexQueryValue<W, K, T> extends Keywords<T> {
  where?: W;
  select: K;
}

interface ComplexQuerySelector<W, T> extends Keywords<T> {
  where?: W;
  select: (selector: TableObject<T>) => JsonValue;
}

interface VirtualQueries<T, W> {
  [key: string]: any;
  get(params?: W | null): Promise<T | undefined>;
  get<K extends keyof T, A extends string, N>(params: W | null, columns: (Alias<T, A, N> | K)[] | (keyof T)[]): Promise<(Pick<T, K> & Record<A, (N extends JsonObject ? JsonValue : N)>) | undefined>;
  get<K extends keyof T>(params: W | null, column: K): Promise<T[K] | undefined>;
  get<N>(params: W | null, column: (selector: TableObject<T>) => N): Promise<(N extends JsonObject ? JsonValue : N) | undefined>;
  get(query: HighlightQuery<W, T>): Promise<{ id: number, highlight: string } | undefined>;
  get(query: SnippetQuery<W, T>): Promise<{ id: number, snippet: string } | undefined>;
  many(params?: W | null): Promise<Array<T>>;
  many<K extends keyof T, A extends string, N>(params: W | null, columns: (Alias<T, A, N> | K)[] | (keyof T)[]): Promise<Array<(Pick<T, K> & Record<A, (N extends JsonObject ? JsonValue : N)>)>>;
  many<K extends keyof T>(params: W | null, column: K): Promise<Array<T[K]>>;
  many<N>(params: W | null, column: (selector: TableObject<T>) => N): Promise<Array<(N extends JsonObject ? JsonValue : N)>>;
  query<K extends keyof T, A extends string, N>(query: VirtualQueryObject<W, A, K, T, N>): Promise<Array<(Pick<T, K> & Record<A, (N extends JsonObject ? JsonValue : N)>)>>;
  query<K extends keyof T>(query: VirtualQueryValue<W, K, T>): Promise<Array<T[K]>>;
  query(query: VirtualQuery<W, T>): Promise<Array<T>>; 
  query<N>(query: VirtualQuerySelector<W, T, N>): Promise<Array<(N extends JsonObject ? JsonValue : N)>>;
  query(query: HighlightQuery<W, T>): Promise<Array<{ id: number, highlight: string }>>;
  query(query: SnippetQuery<W, T>): Promise<Array<{ id: number, snippet: string }>>;
}

interface Queries<T, I, W, R> {
  [key: string]: any;
  insert(params: I): Promise<R>;
  insertMany(params: Array<I>): Promise<void>;
  update(query: W | null, params: Partial<T>): Promise<number>;
  get(params?: W | null): Promise<T | undefined>;
  get<K extends keyof T, A extends string, N>(params: W | null, columns: (Alias<T, A, N> | K)[] | (keyof T)[]): Promise<(Pick<T, K> & Record<A, (N extends JsonObject ? JsonValue : N)>) | undefined>;
  get<K extends keyof T>(params: W | null, column: K): Promise<T[K] | undefined>;
  get<N>(params: W | null, column: (selector: TableObject<T>) => N): Promise<(N extends JsonObject ? JsonValue : N) | undefined>;
  many(params?: W): Promise<Array<T>>;
  many<K extends keyof T, A extends string, N>(params: W | null, columns: (Alias<K, A, N> | K)[] | (keyof T)[]): Promise<Array<(Pick<T, K> & Pick<{ [key: string]: (N extends JsonObject ? JsonValue : N) }, A>)>>;
  many<K extends keyof T>(params: W | null, column: K): Promise<Array<T[K]>>;
  many<N>(params: W | null, column: (selector: TableObject<T>) => N): Promise<Array<N extends JsonObject ? JsonValue : N>>;
  query<K extends keyof T, A extends string, N>(query: ComplexQueryObject<W, A, K, T, N>): Promise<Array<(Pick<T, K> & Pick<{ [key: string]: (N extends JsonObject ? JsonValue : N) }, A>)>>;
  query<K extends keyof T>(query: ComplexQueryValue<W, K, T>): Promise<Array<T[K]>>;
  query(query: ComplexQuery<W, T>): Promise<Array<T>>;
  query(query: ComplexQuerySelector<W, T>): Promise<Array<JsonValue>>;
  count(query: CountQuery<W>): Promise<number>;
  count(params: W | null): Promise<number>;
  exists(params: W | null): Promise<boolean>;
  remove(params?: W): Promise<number>;
}

interface Range<T> {
	gt?: T;
	gte?: T;
	lt?: T;
	lte?: T;
}

interface WhereMethods<T> {
	not: (value: T | Array<T> | null) => [];
	gt: (value: T) => [];
	lt: (value: T) => [];
	lte: (value: T) => [];
	like: (pattern: string) => [];
	match: (pattern: string) => [];
	glob: (pattern: string) => [];
	range: (limits: Range<T>) => [];
	eq: (value: T) => [];
}

type WhereBuilder<T> = WhereMethods<T> & {
	[key in Exclude<string, keyof WhereMethods<T>>]: WhereBuilder<T>;
}

type JsonWhereFunction = (builder: WhereBuilder<string | number | boolean>) => [];
type WhereFunction<T> = (builder: WhereMethods<T>) => [];

type JsonValue = string | number | boolean | null;

type JsonArray = Array<Json>;

type JsonObject = {
  [key: string]: JsonObject;
}

type Json = JsonValue | JsonObject | JsonArray;

type TableObject<T> = {
  [key in keyof T]: JsonObject;
}

type Alias<T, R, N> = {
  select: (selector: TableObject<T>) => N,
  as: R
}


interface Repeatable_todo {
  id: number;
  type: string;
  start: string;
  interval: number;
  active: number;
  content: string;
}

interface InsertRepeatable_todo {
  id?: number;
  type: string;
  start: string;
  interval: number;
  active?: number;
  content: string;
}

interface WhereRepeatable_todo {
  id?: number | Array<number> | WhereFunction<number>;
  type?: string | Array<string> | WhereFunction<string>;
  start?: string | Array<string> | WhereFunction<string>;
  interval?: number | Array<number> | WhereFunction<number>;
  active?: number | Array<number> | WhereFunction<number>;
  content?: string | Array<string> | WhereFunction<string>;
}

interface Todo {
  id: number;
  content: string;
  category: string;
  created: Date;
  completed: Date | null;
  repeatable: number | null;
}

interface InsertTodo {
  id?: number;
  content: string;
  category: string;
  created?: Date;
  completed?: Date;
  repeatable?: number;
}

interface WhereTodo {
  id?: number | Array<number> | WhereFunction<number>;
  content?: string | Array<string> | WhereFunction<string>;
  category?: string | Array<string> | WhereFunction<string>;
  created?: Date | Array<Date> | WhereFunction<Date>;
  completed?: Date | Array<Date> | WhereFunction<Date> | null;
  repeatable?: number | Array<number> | WhereFunction<number> | null;
}

interface Completed_todo {
  id: number;
  content: string;
  category: string;
  created: Date;
  completed: Date;
  repeatable: number | null;
}

interface InsertCompleted_todo {
  id?: number;
  content: string;
  category: string;
  created: Date;
  completed: Date;
  repeatable?: number;
}

interface WhereCompleted_todo {
  id?: number | Array<number> | WhereFunction<number>;
  content?: string | Array<string> | WhereFunction<string>;
  category?: string | Array<string> | WhereFunction<string>;
  created?: Date | Array<Date> | WhereFunction<Date>;
  completed?: Date | Array<Date> | WhereFunction<Date>;
  repeatable?: number | Array<number> | WhereFunction<number> | null;
}

interface Open_todo {
  id: number;
  content: string;
  category: string;
  created: Date;
  completed: Date | null;
  repeatable: number | null;
}

interface InsertOpen_todo {
  id?: number;
  content: string;
  category: string;
  created: Date;
  completed?: Date;
  repeatable?: number;
}

interface WhereOpen_todo {
  id?: number | Array<number> | WhereFunction<number>;
  content?: string | Array<string> | WhereFunction<string>;
  category?: string | Array<string> | WhereFunction<string>;
  created?: Date | Array<Date> | WhereFunction<Date>;
  completed?: Date | Array<Date> | WhereFunction<Date> | null;
  repeatable?: number | Array<number> | WhereFunction<number> | null;
}

type Unwrap<T extends any[]> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K];
};

interface TypedDb {
  [key: string]: any,
  repeatable_todos: Queries<Repeatable_todo, InsertRepeatable_todo, WhereRepeatable_todo, number>,
  todos: Queries<Todo, InsertTodo, WhereTodo, number>,
  completed_todos: Pick<Queries<Completed_todo, InsertCompleted_todo, WhereCompleted_todo, undefined>, 'get' | 'many' | 'query'>,
  open_todos: Pick<Queries<Open_todo, InsertOpen_todo, WhereOpen_todo, undefined>, 'get' | 'many' | 'query'>,
  begin(): Promise<void>,
  commit(): Promise<void>,
  rollback(): Promise<void>,
  getTransaction(): Promise<TypedDb>,
  batch:<T extends any[]> (batcher: (bx: TypedDb) => T) => Promise<Unwrap<T>>
}

declare const database: any;
declare const db: TypedDb;

export {
  database,
  db
}
