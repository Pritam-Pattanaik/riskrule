
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model NewsRawItem
 * 
 */
export type NewsRawItem = $Result.DefaultSelection<Prisma.$NewsRawItemPayload>
/**
 * Model NewsTriage
 * 
 */
export type NewsTriage = $Result.DefaultSelection<Prisma.$NewsTriagePayload>
/**
 * Model NewsImpact
 * 
 */
export type NewsImpact = $Result.DefaultSelection<Prisma.$NewsImpactPayload>
/**
 * Model NewsAuditLog
 * 
 */
export type NewsAuditLog = $Result.DefaultSelection<Prisma.$NewsAuditLogPayload>
/**
 * Model NewsBacktest
 * 
 */
export type NewsBacktest = $Result.DefaultSelection<Prisma.$NewsBacktestPayload>
/**
 * Model NewsDigest
 * 
 */
export type NewsDigest = $Result.DefaultSelection<Prisma.$NewsDigestPayload>
/**
 * Model PipelineMetric
 * 
 */
export type PipelineMetric = $Result.DefaultSelection<Prisma.$PipelineMetricPayload>
/**
 * Model EnrichedNews
 * 
 */
export type EnrichedNews = $Result.DefaultSelection<Prisma.$EnrichedNewsPayload>
/**
 * Model NewsBookmark
 * 
 */
export type NewsBookmark = $Result.DefaultSelection<Prisma.$NewsBookmarkPayload>
/**
 * Model TradeNewsLink
 * 
 */
export type TradeNewsLink = $Result.DefaultSelection<Prisma.$TradeNewsLinkPayload>
/**
 * Model UserWatchlist
 * 
 */
export type UserWatchlist = $Result.DefaultSelection<Prisma.$UserWatchlistPayload>
/**
 * Model OiHistory
 * 
 */
export type OiHistory = $Result.DefaultSelection<Prisma.$OiHistoryPayload>
/**
 * Model IvHistory
 * 
 */
export type IvHistory = $Result.DefaultSelection<Prisma.$IvHistoryPayload>
/**
 * Model PcrHistory
 * 
 */
export type PcrHistory = $Result.DefaultSelection<Prisma.$PcrHistoryPayload>
/**
 * Model FlowAiBrief
 * 
 */
export type FlowAiBrief = $Result.DefaultSelection<Prisma.$FlowAiBriefPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more NewsRawItems
 * const newsRawItems = await prisma.newsRawItem.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more NewsRawItems
   * const newsRawItems = await prisma.newsRawItem.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.newsRawItem`: Exposes CRUD operations for the **NewsRawItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsRawItems
    * const newsRawItems = await prisma.newsRawItem.findMany()
    * ```
    */
  get newsRawItem(): Prisma.NewsRawItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsTriage`: Exposes CRUD operations for the **NewsTriage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsTriages
    * const newsTriages = await prisma.newsTriage.findMany()
    * ```
    */
  get newsTriage(): Prisma.NewsTriageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsImpact`: Exposes CRUD operations for the **NewsImpact** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsImpacts
    * const newsImpacts = await prisma.newsImpact.findMany()
    * ```
    */
  get newsImpact(): Prisma.NewsImpactDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsAuditLog`: Exposes CRUD operations for the **NewsAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsAuditLogs
    * const newsAuditLogs = await prisma.newsAuditLog.findMany()
    * ```
    */
  get newsAuditLog(): Prisma.NewsAuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsBacktest`: Exposes CRUD operations for the **NewsBacktest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsBacktests
    * const newsBacktests = await prisma.newsBacktest.findMany()
    * ```
    */
  get newsBacktest(): Prisma.NewsBacktestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsDigest`: Exposes CRUD operations for the **NewsDigest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsDigests
    * const newsDigests = await prisma.newsDigest.findMany()
    * ```
    */
  get newsDigest(): Prisma.NewsDigestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pipelineMetric`: Exposes CRUD operations for the **PipelineMetric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PipelineMetrics
    * const pipelineMetrics = await prisma.pipelineMetric.findMany()
    * ```
    */
  get pipelineMetric(): Prisma.PipelineMetricDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.enrichedNews`: Exposes CRUD operations for the **EnrichedNews** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EnrichedNews
    * const enrichedNews = await prisma.enrichedNews.findMany()
    * ```
    */
  get enrichedNews(): Prisma.EnrichedNewsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.newsBookmark`: Exposes CRUD operations for the **NewsBookmark** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NewsBookmarks
    * const newsBookmarks = await prisma.newsBookmark.findMany()
    * ```
    */
  get newsBookmark(): Prisma.NewsBookmarkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradeNewsLink`: Exposes CRUD operations for the **TradeNewsLink** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradeNewsLinks
    * const tradeNewsLinks = await prisma.tradeNewsLink.findMany()
    * ```
    */
  get tradeNewsLink(): Prisma.TradeNewsLinkDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userWatchlist`: Exposes CRUD operations for the **UserWatchlist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserWatchlists
    * const userWatchlists = await prisma.userWatchlist.findMany()
    * ```
    */
  get userWatchlist(): Prisma.UserWatchlistDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.oiHistory`: Exposes CRUD operations for the **OiHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OiHistories
    * const oiHistories = await prisma.oiHistory.findMany()
    * ```
    */
  get oiHistory(): Prisma.OiHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ivHistory`: Exposes CRUD operations for the **IvHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IvHistories
    * const ivHistories = await prisma.ivHistory.findMany()
    * ```
    */
  get ivHistory(): Prisma.IvHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pcrHistory`: Exposes CRUD operations for the **PcrHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PcrHistories
    * const pcrHistories = await prisma.pcrHistory.findMany()
    * ```
    */
  get pcrHistory(): Prisma.PcrHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.flowAiBrief`: Exposes CRUD operations for the **FlowAiBrief** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FlowAiBriefs
    * const flowAiBriefs = await prisma.flowAiBrief.findMany()
    * ```
    */
  get flowAiBrief(): Prisma.FlowAiBriefDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    NewsRawItem: 'NewsRawItem',
    NewsTriage: 'NewsTriage',
    NewsImpact: 'NewsImpact',
    NewsAuditLog: 'NewsAuditLog',
    NewsBacktest: 'NewsBacktest',
    NewsDigest: 'NewsDigest',
    PipelineMetric: 'PipelineMetric',
    EnrichedNews: 'EnrichedNews',
    NewsBookmark: 'NewsBookmark',
    TradeNewsLink: 'TradeNewsLink',
    UserWatchlist: 'UserWatchlist',
    OiHistory: 'OiHistory',
    IvHistory: 'IvHistory',
    PcrHistory: 'PcrHistory',
    FlowAiBrief: 'FlowAiBrief'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "newsRawItem" | "newsTriage" | "newsImpact" | "newsAuditLog" | "newsBacktest" | "newsDigest" | "pipelineMetric" | "enrichedNews" | "newsBookmark" | "tradeNewsLink" | "userWatchlist" | "oiHistory" | "ivHistory" | "pcrHistory" | "flowAiBrief"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      NewsRawItem: {
        payload: Prisma.$NewsRawItemPayload<ExtArgs>
        fields: Prisma.NewsRawItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsRawItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsRawItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload>
          }
          findFirst: {
            args: Prisma.NewsRawItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsRawItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload>
          }
          findMany: {
            args: Prisma.NewsRawItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload>[]
          }
          create: {
            args: Prisma.NewsRawItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload>
          }
          createMany: {
            args: Prisma.NewsRawItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsRawItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload>[]
          }
          delete: {
            args: Prisma.NewsRawItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload>
          }
          update: {
            args: Prisma.NewsRawItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload>
          }
          deleteMany: {
            args: Prisma.NewsRawItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsRawItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsRawItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload>[]
          }
          upsert: {
            args: Prisma.NewsRawItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsRawItemPayload>
          }
          aggregate: {
            args: Prisma.NewsRawItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsRawItem>
          }
          groupBy: {
            args: Prisma.NewsRawItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsRawItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsRawItemCountArgs<ExtArgs>
            result: $Utils.Optional<NewsRawItemCountAggregateOutputType> | number
          }
        }
      }
      NewsTriage: {
        payload: Prisma.$NewsTriagePayload<ExtArgs>
        fields: Prisma.NewsTriageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsTriageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsTriageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload>
          }
          findFirst: {
            args: Prisma.NewsTriageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsTriageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload>
          }
          findMany: {
            args: Prisma.NewsTriageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload>[]
          }
          create: {
            args: Prisma.NewsTriageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload>
          }
          createMany: {
            args: Prisma.NewsTriageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsTriageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload>[]
          }
          delete: {
            args: Prisma.NewsTriageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload>
          }
          update: {
            args: Prisma.NewsTriageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload>
          }
          deleteMany: {
            args: Prisma.NewsTriageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsTriageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsTriageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload>[]
          }
          upsert: {
            args: Prisma.NewsTriageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsTriagePayload>
          }
          aggregate: {
            args: Prisma.NewsTriageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsTriage>
          }
          groupBy: {
            args: Prisma.NewsTriageGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsTriageGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsTriageCountArgs<ExtArgs>
            result: $Utils.Optional<NewsTriageCountAggregateOutputType> | number
          }
        }
      }
      NewsImpact: {
        payload: Prisma.$NewsImpactPayload<ExtArgs>
        fields: Prisma.NewsImpactFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsImpactFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsImpactFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload>
          }
          findFirst: {
            args: Prisma.NewsImpactFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsImpactFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload>
          }
          findMany: {
            args: Prisma.NewsImpactFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload>[]
          }
          create: {
            args: Prisma.NewsImpactCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload>
          }
          createMany: {
            args: Prisma.NewsImpactCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsImpactCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload>[]
          }
          delete: {
            args: Prisma.NewsImpactDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload>
          }
          update: {
            args: Prisma.NewsImpactUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload>
          }
          deleteMany: {
            args: Prisma.NewsImpactDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsImpactUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsImpactUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload>[]
          }
          upsert: {
            args: Prisma.NewsImpactUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsImpactPayload>
          }
          aggregate: {
            args: Prisma.NewsImpactAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsImpact>
          }
          groupBy: {
            args: Prisma.NewsImpactGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsImpactGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsImpactCountArgs<ExtArgs>
            result: $Utils.Optional<NewsImpactCountAggregateOutputType> | number
          }
        }
      }
      NewsAuditLog: {
        payload: Prisma.$NewsAuditLogPayload<ExtArgs>
        fields: Prisma.NewsAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload>
          }
          findFirst: {
            args: Prisma.NewsAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload>
          }
          findMany: {
            args: Prisma.NewsAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload>[]
          }
          create: {
            args: Prisma.NewsAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload>
          }
          createMany: {
            args: Prisma.NewsAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload>[]
          }
          delete: {
            args: Prisma.NewsAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload>
          }
          update: {
            args: Prisma.NewsAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.NewsAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsAuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload>[]
          }
          upsert: {
            args: Prisma.NewsAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsAuditLogPayload>
          }
          aggregate: {
            args: Prisma.NewsAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsAuditLog>
          }
          groupBy: {
            args: Prisma.NewsAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<NewsAuditLogCountAggregateOutputType> | number
          }
        }
      }
      NewsBacktest: {
        payload: Prisma.$NewsBacktestPayload<ExtArgs>
        fields: Prisma.NewsBacktestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsBacktestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsBacktestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload>
          }
          findFirst: {
            args: Prisma.NewsBacktestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsBacktestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload>
          }
          findMany: {
            args: Prisma.NewsBacktestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload>[]
          }
          create: {
            args: Prisma.NewsBacktestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload>
          }
          createMany: {
            args: Prisma.NewsBacktestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsBacktestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload>[]
          }
          delete: {
            args: Prisma.NewsBacktestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload>
          }
          update: {
            args: Prisma.NewsBacktestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload>
          }
          deleteMany: {
            args: Prisma.NewsBacktestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsBacktestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsBacktestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload>[]
          }
          upsert: {
            args: Prisma.NewsBacktestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBacktestPayload>
          }
          aggregate: {
            args: Prisma.NewsBacktestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsBacktest>
          }
          groupBy: {
            args: Prisma.NewsBacktestGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsBacktestGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsBacktestCountArgs<ExtArgs>
            result: $Utils.Optional<NewsBacktestCountAggregateOutputType> | number
          }
        }
      }
      NewsDigest: {
        payload: Prisma.$NewsDigestPayload<ExtArgs>
        fields: Prisma.NewsDigestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsDigestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsDigestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload>
          }
          findFirst: {
            args: Prisma.NewsDigestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsDigestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload>
          }
          findMany: {
            args: Prisma.NewsDigestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload>[]
          }
          create: {
            args: Prisma.NewsDigestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload>
          }
          createMany: {
            args: Prisma.NewsDigestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsDigestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload>[]
          }
          delete: {
            args: Prisma.NewsDigestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload>
          }
          update: {
            args: Prisma.NewsDigestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload>
          }
          deleteMany: {
            args: Prisma.NewsDigestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsDigestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsDigestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload>[]
          }
          upsert: {
            args: Prisma.NewsDigestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsDigestPayload>
          }
          aggregate: {
            args: Prisma.NewsDigestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsDigest>
          }
          groupBy: {
            args: Prisma.NewsDigestGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsDigestGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsDigestCountArgs<ExtArgs>
            result: $Utils.Optional<NewsDigestCountAggregateOutputType> | number
          }
        }
      }
      PipelineMetric: {
        payload: Prisma.$PipelineMetricPayload<ExtArgs>
        fields: Prisma.PipelineMetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PipelineMetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PipelineMetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload>
          }
          findFirst: {
            args: Prisma.PipelineMetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PipelineMetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload>
          }
          findMany: {
            args: Prisma.PipelineMetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload>[]
          }
          create: {
            args: Prisma.PipelineMetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload>
          }
          createMany: {
            args: Prisma.PipelineMetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PipelineMetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload>[]
          }
          delete: {
            args: Prisma.PipelineMetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload>
          }
          update: {
            args: Prisma.PipelineMetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload>
          }
          deleteMany: {
            args: Prisma.PipelineMetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PipelineMetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PipelineMetricUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload>[]
          }
          upsert: {
            args: Prisma.PipelineMetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PipelineMetricPayload>
          }
          aggregate: {
            args: Prisma.PipelineMetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePipelineMetric>
          }
          groupBy: {
            args: Prisma.PipelineMetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<PipelineMetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.PipelineMetricCountArgs<ExtArgs>
            result: $Utils.Optional<PipelineMetricCountAggregateOutputType> | number
          }
        }
      }
      EnrichedNews: {
        payload: Prisma.$EnrichedNewsPayload<ExtArgs>
        fields: Prisma.EnrichedNewsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnrichedNewsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnrichedNewsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload>
          }
          findFirst: {
            args: Prisma.EnrichedNewsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnrichedNewsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload>
          }
          findMany: {
            args: Prisma.EnrichedNewsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload>[]
          }
          create: {
            args: Prisma.EnrichedNewsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload>
          }
          createMany: {
            args: Prisma.EnrichedNewsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnrichedNewsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload>[]
          }
          delete: {
            args: Prisma.EnrichedNewsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload>
          }
          update: {
            args: Prisma.EnrichedNewsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload>
          }
          deleteMany: {
            args: Prisma.EnrichedNewsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnrichedNewsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EnrichedNewsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload>[]
          }
          upsert: {
            args: Prisma.EnrichedNewsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnrichedNewsPayload>
          }
          aggregate: {
            args: Prisma.EnrichedNewsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnrichedNews>
          }
          groupBy: {
            args: Prisma.EnrichedNewsGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnrichedNewsGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnrichedNewsCountArgs<ExtArgs>
            result: $Utils.Optional<EnrichedNewsCountAggregateOutputType> | number
          }
        }
      }
      NewsBookmark: {
        payload: Prisma.$NewsBookmarkPayload<ExtArgs>
        fields: Prisma.NewsBookmarkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NewsBookmarkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NewsBookmarkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload>
          }
          findFirst: {
            args: Prisma.NewsBookmarkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NewsBookmarkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload>
          }
          findMany: {
            args: Prisma.NewsBookmarkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload>[]
          }
          create: {
            args: Prisma.NewsBookmarkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload>
          }
          createMany: {
            args: Prisma.NewsBookmarkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NewsBookmarkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload>[]
          }
          delete: {
            args: Prisma.NewsBookmarkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload>
          }
          update: {
            args: Prisma.NewsBookmarkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload>
          }
          deleteMany: {
            args: Prisma.NewsBookmarkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NewsBookmarkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NewsBookmarkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload>[]
          }
          upsert: {
            args: Prisma.NewsBookmarkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NewsBookmarkPayload>
          }
          aggregate: {
            args: Prisma.NewsBookmarkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNewsBookmark>
          }
          groupBy: {
            args: Prisma.NewsBookmarkGroupByArgs<ExtArgs>
            result: $Utils.Optional<NewsBookmarkGroupByOutputType>[]
          }
          count: {
            args: Prisma.NewsBookmarkCountArgs<ExtArgs>
            result: $Utils.Optional<NewsBookmarkCountAggregateOutputType> | number
          }
        }
      }
      TradeNewsLink: {
        payload: Prisma.$TradeNewsLinkPayload<ExtArgs>
        fields: Prisma.TradeNewsLinkFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradeNewsLinkFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradeNewsLinkFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload>
          }
          findFirst: {
            args: Prisma.TradeNewsLinkFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradeNewsLinkFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload>
          }
          findMany: {
            args: Prisma.TradeNewsLinkFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload>[]
          }
          create: {
            args: Prisma.TradeNewsLinkCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload>
          }
          createMany: {
            args: Prisma.TradeNewsLinkCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradeNewsLinkCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload>[]
          }
          delete: {
            args: Prisma.TradeNewsLinkDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload>
          }
          update: {
            args: Prisma.TradeNewsLinkUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload>
          }
          deleteMany: {
            args: Prisma.TradeNewsLinkDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradeNewsLinkUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradeNewsLinkUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload>[]
          }
          upsert: {
            args: Prisma.TradeNewsLinkUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeNewsLinkPayload>
          }
          aggregate: {
            args: Prisma.TradeNewsLinkAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradeNewsLink>
          }
          groupBy: {
            args: Prisma.TradeNewsLinkGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradeNewsLinkGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradeNewsLinkCountArgs<ExtArgs>
            result: $Utils.Optional<TradeNewsLinkCountAggregateOutputType> | number
          }
        }
      }
      UserWatchlist: {
        payload: Prisma.$UserWatchlistPayload<ExtArgs>
        fields: Prisma.UserWatchlistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserWatchlistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserWatchlistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload>
          }
          findFirst: {
            args: Prisma.UserWatchlistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserWatchlistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload>
          }
          findMany: {
            args: Prisma.UserWatchlistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload>[]
          }
          create: {
            args: Prisma.UserWatchlistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload>
          }
          createMany: {
            args: Prisma.UserWatchlistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserWatchlistCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload>[]
          }
          delete: {
            args: Prisma.UserWatchlistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload>
          }
          update: {
            args: Prisma.UserWatchlistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload>
          }
          deleteMany: {
            args: Prisma.UserWatchlistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserWatchlistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserWatchlistUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload>[]
          }
          upsert: {
            args: Prisma.UserWatchlistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserWatchlistPayload>
          }
          aggregate: {
            args: Prisma.UserWatchlistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserWatchlist>
          }
          groupBy: {
            args: Prisma.UserWatchlistGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserWatchlistGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserWatchlistCountArgs<ExtArgs>
            result: $Utils.Optional<UserWatchlistCountAggregateOutputType> | number
          }
        }
      }
      OiHistory: {
        payload: Prisma.$OiHistoryPayload<ExtArgs>
        fields: Prisma.OiHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OiHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OiHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload>
          }
          findFirst: {
            args: Prisma.OiHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OiHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload>
          }
          findMany: {
            args: Prisma.OiHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload>[]
          }
          create: {
            args: Prisma.OiHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload>
          }
          createMany: {
            args: Prisma.OiHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OiHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload>[]
          }
          delete: {
            args: Prisma.OiHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload>
          }
          update: {
            args: Prisma.OiHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload>
          }
          deleteMany: {
            args: Prisma.OiHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OiHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OiHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload>[]
          }
          upsert: {
            args: Prisma.OiHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OiHistoryPayload>
          }
          aggregate: {
            args: Prisma.OiHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOiHistory>
          }
          groupBy: {
            args: Prisma.OiHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<OiHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.OiHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<OiHistoryCountAggregateOutputType> | number
          }
        }
      }
      IvHistory: {
        payload: Prisma.$IvHistoryPayload<ExtArgs>
        fields: Prisma.IvHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IvHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IvHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload>
          }
          findFirst: {
            args: Prisma.IvHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IvHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload>
          }
          findMany: {
            args: Prisma.IvHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload>[]
          }
          create: {
            args: Prisma.IvHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload>
          }
          createMany: {
            args: Prisma.IvHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IvHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload>[]
          }
          delete: {
            args: Prisma.IvHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload>
          }
          update: {
            args: Prisma.IvHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload>
          }
          deleteMany: {
            args: Prisma.IvHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IvHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IvHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload>[]
          }
          upsert: {
            args: Prisma.IvHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IvHistoryPayload>
          }
          aggregate: {
            args: Prisma.IvHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIvHistory>
          }
          groupBy: {
            args: Prisma.IvHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<IvHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.IvHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<IvHistoryCountAggregateOutputType> | number
          }
        }
      }
      PcrHistory: {
        payload: Prisma.$PcrHistoryPayload<ExtArgs>
        fields: Prisma.PcrHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PcrHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PcrHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload>
          }
          findFirst: {
            args: Prisma.PcrHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PcrHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload>
          }
          findMany: {
            args: Prisma.PcrHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload>[]
          }
          create: {
            args: Prisma.PcrHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload>
          }
          createMany: {
            args: Prisma.PcrHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PcrHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload>[]
          }
          delete: {
            args: Prisma.PcrHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload>
          }
          update: {
            args: Prisma.PcrHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload>
          }
          deleteMany: {
            args: Prisma.PcrHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PcrHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PcrHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload>[]
          }
          upsert: {
            args: Prisma.PcrHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PcrHistoryPayload>
          }
          aggregate: {
            args: Prisma.PcrHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePcrHistory>
          }
          groupBy: {
            args: Prisma.PcrHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PcrHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.PcrHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<PcrHistoryCountAggregateOutputType> | number
          }
        }
      }
      FlowAiBrief: {
        payload: Prisma.$FlowAiBriefPayload<ExtArgs>
        fields: Prisma.FlowAiBriefFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlowAiBriefFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlowAiBriefFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload>
          }
          findFirst: {
            args: Prisma.FlowAiBriefFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlowAiBriefFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload>
          }
          findMany: {
            args: Prisma.FlowAiBriefFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload>[]
          }
          create: {
            args: Prisma.FlowAiBriefCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload>
          }
          createMany: {
            args: Prisma.FlowAiBriefCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlowAiBriefCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload>[]
          }
          delete: {
            args: Prisma.FlowAiBriefDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload>
          }
          update: {
            args: Prisma.FlowAiBriefUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload>
          }
          deleteMany: {
            args: Prisma.FlowAiBriefDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlowAiBriefUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlowAiBriefUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload>[]
          }
          upsert: {
            args: Prisma.FlowAiBriefUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlowAiBriefPayload>
          }
          aggregate: {
            args: Prisma.FlowAiBriefAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlowAiBrief>
          }
          groupBy: {
            args: Prisma.FlowAiBriefGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlowAiBriefGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlowAiBriefCountArgs<ExtArgs>
            result: $Utils.Optional<FlowAiBriefCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    newsRawItem?: NewsRawItemOmit
    newsTriage?: NewsTriageOmit
    newsImpact?: NewsImpactOmit
    newsAuditLog?: NewsAuditLogOmit
    newsBacktest?: NewsBacktestOmit
    newsDigest?: NewsDigestOmit
    pipelineMetric?: PipelineMetricOmit
    enrichedNews?: EnrichedNewsOmit
    newsBookmark?: NewsBookmarkOmit
    tradeNewsLink?: TradeNewsLinkOmit
    userWatchlist?: UserWatchlistOmit
    oiHistory?: OiHistoryOmit
    ivHistory?: IvHistoryOmit
    pcrHistory?: PcrHistoryOmit
    flowAiBrief?: FlowAiBriefOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type NewsImpactCountOutputType
   */

  export type NewsImpactCountOutputType = {
    backtests: number
  }

  export type NewsImpactCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    backtests?: boolean | NewsImpactCountOutputTypeCountBacktestsArgs
  }

  // Custom InputTypes
  /**
   * NewsImpactCountOutputType without action
   */
  export type NewsImpactCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpactCountOutputType
     */
    select?: NewsImpactCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NewsImpactCountOutputType without action
   */
  export type NewsImpactCountOutputTypeCountBacktestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsBacktestWhereInput
  }


  /**
   * Count Type EnrichedNewsCountOutputType
   */

  export type EnrichedNewsCountOutputType = {
    bookmarks: number
    tradeLinks: number
  }

  export type EnrichedNewsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookmarks?: boolean | EnrichedNewsCountOutputTypeCountBookmarksArgs
    tradeLinks?: boolean | EnrichedNewsCountOutputTypeCountTradeLinksArgs
  }

  // Custom InputTypes
  /**
   * EnrichedNewsCountOutputType without action
   */
  export type EnrichedNewsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNewsCountOutputType
     */
    select?: EnrichedNewsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EnrichedNewsCountOutputType without action
   */
  export type EnrichedNewsCountOutputTypeCountBookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsBookmarkWhereInput
  }

  /**
   * EnrichedNewsCountOutputType without action
   */
  export type EnrichedNewsCountOutputTypeCountTradeLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeNewsLinkWhereInput
  }


  /**
   * Models
   */

  /**
   * Model NewsRawItem
   */

  export type AggregateNewsRawItem = {
    _count: NewsRawItemCountAggregateOutputType | null
    _min: NewsRawItemMinAggregateOutputType | null
    _max: NewsRawItemMaxAggregateOutputType | null
  }

  export type NewsRawItemMinAggregateOutputType = {
    id: string | null
    source: string | null
    externalId: string | null
    dedupeHash: string | null
    headline: string | null
    body: string | null
    url: string | null
    publishedAt: Date | null
    status: string | null
    failureReason: string | null
    createdAt: Date | null
  }

  export type NewsRawItemMaxAggregateOutputType = {
    id: string | null
    source: string | null
    externalId: string | null
    dedupeHash: string | null
    headline: string | null
    body: string | null
    url: string | null
    publishedAt: Date | null
    status: string | null
    failureReason: string | null
    createdAt: Date | null
  }

  export type NewsRawItemCountAggregateOutputType = {
    id: number
    source: number
    externalId: number
    dedupeHash: number
    headline: number
    body: number
    url: number
    publishedAt: number
    rawPayload: number
    status: number
    failureReason: number
    createdAt: number
    _all: number
  }


  export type NewsRawItemMinAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    dedupeHash?: true
    headline?: true
    body?: true
    url?: true
    publishedAt?: true
    status?: true
    failureReason?: true
    createdAt?: true
  }

  export type NewsRawItemMaxAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    dedupeHash?: true
    headline?: true
    body?: true
    url?: true
    publishedAt?: true
    status?: true
    failureReason?: true
    createdAt?: true
  }

  export type NewsRawItemCountAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    dedupeHash?: true
    headline?: true
    body?: true
    url?: true
    publishedAt?: true
    rawPayload?: true
    status?: true
    failureReason?: true
    createdAt?: true
    _all?: true
  }

  export type NewsRawItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsRawItem to aggregate.
     */
    where?: NewsRawItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsRawItems to fetch.
     */
    orderBy?: NewsRawItemOrderByWithRelationInput | NewsRawItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsRawItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsRawItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsRawItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsRawItems
    **/
    _count?: true | NewsRawItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsRawItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsRawItemMaxAggregateInputType
  }

  export type GetNewsRawItemAggregateType<T extends NewsRawItemAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsRawItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsRawItem[P]>
      : GetScalarType<T[P], AggregateNewsRawItem[P]>
  }




  export type NewsRawItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsRawItemWhereInput
    orderBy?: NewsRawItemOrderByWithAggregationInput | NewsRawItemOrderByWithAggregationInput[]
    by: NewsRawItemScalarFieldEnum[] | NewsRawItemScalarFieldEnum
    having?: NewsRawItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsRawItemCountAggregateInputType | true
    _min?: NewsRawItemMinAggregateInputType
    _max?: NewsRawItemMaxAggregateInputType
  }

  export type NewsRawItemGroupByOutputType = {
    id: string
    source: string
    externalId: string | null
    dedupeHash: string
    headline: string
    body: string | null
    url: string | null
    publishedAt: Date
    rawPayload: JsonValue
    status: string
    failureReason: string | null
    createdAt: Date
    _count: NewsRawItemCountAggregateOutputType | null
    _min: NewsRawItemMinAggregateOutputType | null
    _max: NewsRawItemMaxAggregateOutputType | null
  }

  type GetNewsRawItemGroupByPayload<T extends NewsRawItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsRawItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsRawItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsRawItemGroupByOutputType[P]>
            : GetScalarType<T[P], NewsRawItemGroupByOutputType[P]>
        }
      >
    >


  export type NewsRawItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    dedupeHash?: boolean
    headline?: boolean
    body?: boolean
    url?: boolean
    publishedAt?: boolean
    rawPayload?: boolean
    status?: boolean
    failureReason?: boolean
    createdAt?: boolean
    triage?: boolean | NewsRawItem$triageArgs<ExtArgs>
    impact?: boolean | NewsRawItem$impactArgs<ExtArgs>
  }, ExtArgs["result"]["newsRawItem"]>

  export type NewsRawItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    dedupeHash?: boolean
    headline?: boolean
    body?: boolean
    url?: boolean
    publishedAt?: boolean
    rawPayload?: boolean
    status?: boolean
    failureReason?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["newsRawItem"]>

  export type NewsRawItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    dedupeHash?: boolean
    headline?: boolean
    body?: boolean
    url?: boolean
    publishedAt?: boolean
    rawPayload?: boolean
    status?: boolean
    failureReason?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["newsRawItem"]>

  export type NewsRawItemSelectScalar = {
    id?: boolean
    source?: boolean
    externalId?: boolean
    dedupeHash?: boolean
    headline?: boolean
    body?: boolean
    url?: boolean
    publishedAt?: boolean
    rawPayload?: boolean
    status?: boolean
    failureReason?: boolean
    createdAt?: boolean
  }

  export type NewsRawItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "source" | "externalId" | "dedupeHash" | "headline" | "body" | "url" | "publishedAt" | "rawPayload" | "status" | "failureReason" | "createdAt", ExtArgs["result"]["newsRawItem"]>
  export type NewsRawItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    triage?: boolean | NewsRawItem$triageArgs<ExtArgs>
    impact?: boolean | NewsRawItem$impactArgs<ExtArgs>
  }
  export type NewsRawItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type NewsRawItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NewsRawItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsRawItem"
    objects: {
      triage: Prisma.$NewsTriagePayload<ExtArgs> | null
      impact: Prisma.$NewsImpactPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      source: string
      externalId: string | null
      dedupeHash: string
      headline: string
      body: string | null
      url: string | null
      publishedAt: Date
      rawPayload: Prisma.JsonValue
      status: string
      failureReason: string | null
      createdAt: Date
    }, ExtArgs["result"]["newsRawItem"]>
    composites: {}
  }

  type NewsRawItemGetPayload<S extends boolean | null | undefined | NewsRawItemDefaultArgs> = $Result.GetResult<Prisma.$NewsRawItemPayload, S>

  type NewsRawItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsRawItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsRawItemCountAggregateInputType | true
    }

  export interface NewsRawItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsRawItem'], meta: { name: 'NewsRawItem' } }
    /**
     * Find zero or one NewsRawItem that matches the filter.
     * @param {NewsRawItemFindUniqueArgs} args - Arguments to find a NewsRawItem
     * @example
     * // Get one NewsRawItem
     * const newsRawItem = await prisma.newsRawItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsRawItemFindUniqueArgs>(args: SelectSubset<T, NewsRawItemFindUniqueArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsRawItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsRawItemFindUniqueOrThrowArgs} args - Arguments to find a NewsRawItem
     * @example
     * // Get one NewsRawItem
     * const newsRawItem = await prisma.newsRawItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsRawItemFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsRawItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsRawItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsRawItemFindFirstArgs} args - Arguments to find a NewsRawItem
     * @example
     * // Get one NewsRawItem
     * const newsRawItem = await prisma.newsRawItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsRawItemFindFirstArgs>(args?: SelectSubset<T, NewsRawItemFindFirstArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsRawItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsRawItemFindFirstOrThrowArgs} args - Arguments to find a NewsRawItem
     * @example
     * // Get one NewsRawItem
     * const newsRawItem = await prisma.newsRawItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsRawItemFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsRawItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsRawItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsRawItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsRawItems
     * const newsRawItems = await prisma.newsRawItem.findMany()
     * 
     * // Get first 10 NewsRawItems
     * const newsRawItems = await prisma.newsRawItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsRawItemWithIdOnly = await prisma.newsRawItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsRawItemFindManyArgs>(args?: SelectSubset<T, NewsRawItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsRawItem.
     * @param {NewsRawItemCreateArgs} args - Arguments to create a NewsRawItem.
     * @example
     * // Create one NewsRawItem
     * const NewsRawItem = await prisma.newsRawItem.create({
     *   data: {
     *     // ... data to create a NewsRawItem
     *   }
     * })
     * 
     */
    create<T extends NewsRawItemCreateArgs>(args: SelectSubset<T, NewsRawItemCreateArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsRawItems.
     * @param {NewsRawItemCreateManyArgs} args - Arguments to create many NewsRawItems.
     * @example
     * // Create many NewsRawItems
     * const newsRawItem = await prisma.newsRawItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsRawItemCreateManyArgs>(args?: SelectSubset<T, NewsRawItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsRawItems and returns the data saved in the database.
     * @param {NewsRawItemCreateManyAndReturnArgs} args - Arguments to create many NewsRawItems.
     * @example
     * // Create many NewsRawItems
     * const newsRawItem = await prisma.newsRawItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsRawItems and only return the `id`
     * const newsRawItemWithIdOnly = await prisma.newsRawItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsRawItemCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsRawItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NewsRawItem.
     * @param {NewsRawItemDeleteArgs} args - Arguments to delete one NewsRawItem.
     * @example
     * // Delete one NewsRawItem
     * const NewsRawItem = await prisma.newsRawItem.delete({
     *   where: {
     *     // ... filter to delete one NewsRawItem
     *   }
     * })
     * 
     */
    delete<T extends NewsRawItemDeleteArgs>(args: SelectSubset<T, NewsRawItemDeleteArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsRawItem.
     * @param {NewsRawItemUpdateArgs} args - Arguments to update one NewsRawItem.
     * @example
     * // Update one NewsRawItem
     * const newsRawItem = await prisma.newsRawItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsRawItemUpdateArgs>(args: SelectSubset<T, NewsRawItemUpdateArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsRawItems.
     * @param {NewsRawItemDeleteManyArgs} args - Arguments to filter NewsRawItems to delete.
     * @example
     * // Delete a few NewsRawItems
     * const { count } = await prisma.newsRawItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsRawItemDeleteManyArgs>(args?: SelectSubset<T, NewsRawItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsRawItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsRawItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsRawItems
     * const newsRawItem = await prisma.newsRawItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsRawItemUpdateManyArgs>(args: SelectSubset<T, NewsRawItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsRawItems and returns the data updated in the database.
     * @param {NewsRawItemUpdateManyAndReturnArgs} args - Arguments to update many NewsRawItems.
     * @example
     * // Update many NewsRawItems
     * const newsRawItem = await prisma.newsRawItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NewsRawItems and only return the `id`
     * const newsRawItemWithIdOnly = await prisma.newsRawItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NewsRawItemUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsRawItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NewsRawItem.
     * @param {NewsRawItemUpsertArgs} args - Arguments to update or create a NewsRawItem.
     * @example
     * // Update or create a NewsRawItem
     * const newsRawItem = await prisma.newsRawItem.upsert({
     *   create: {
     *     // ... data to create a NewsRawItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsRawItem we want to update
     *   }
     * })
     */
    upsert<T extends NewsRawItemUpsertArgs>(args: SelectSubset<T, NewsRawItemUpsertArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsRawItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsRawItemCountArgs} args - Arguments to filter NewsRawItems to count.
     * @example
     * // Count the number of NewsRawItems
     * const count = await prisma.newsRawItem.count({
     *   where: {
     *     // ... the filter for the NewsRawItems we want to count
     *   }
     * })
    **/
    count<T extends NewsRawItemCountArgs>(
      args?: Subset<T, NewsRawItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsRawItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsRawItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsRawItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsRawItemAggregateArgs>(args: Subset<T, NewsRawItemAggregateArgs>): Prisma.PrismaPromise<GetNewsRawItemAggregateType<T>>

    /**
     * Group by NewsRawItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsRawItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsRawItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsRawItemGroupByArgs['orderBy'] }
        : { orderBy?: NewsRawItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsRawItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsRawItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsRawItem model
   */
  readonly fields: NewsRawItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsRawItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsRawItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    triage<T extends NewsRawItem$triageArgs<ExtArgs> = {}>(args?: Subset<T, NewsRawItem$triageArgs<ExtArgs>>): Prisma__NewsTriageClient<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    impact<T extends NewsRawItem$impactArgs<ExtArgs> = {}>(args?: Subset<T, NewsRawItem$impactArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsRawItem model
   */
  interface NewsRawItemFieldRefs {
    readonly id: FieldRef<"NewsRawItem", 'String'>
    readonly source: FieldRef<"NewsRawItem", 'String'>
    readonly externalId: FieldRef<"NewsRawItem", 'String'>
    readonly dedupeHash: FieldRef<"NewsRawItem", 'String'>
    readonly headline: FieldRef<"NewsRawItem", 'String'>
    readonly body: FieldRef<"NewsRawItem", 'String'>
    readonly url: FieldRef<"NewsRawItem", 'String'>
    readonly publishedAt: FieldRef<"NewsRawItem", 'DateTime'>
    readonly rawPayload: FieldRef<"NewsRawItem", 'Json'>
    readonly status: FieldRef<"NewsRawItem", 'String'>
    readonly failureReason: FieldRef<"NewsRawItem", 'String'>
    readonly createdAt: FieldRef<"NewsRawItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsRawItem findUnique
   */
  export type NewsRawItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsRawItem to fetch.
     */
    where: NewsRawItemWhereUniqueInput
  }

  /**
   * NewsRawItem findUniqueOrThrow
   */
  export type NewsRawItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsRawItem to fetch.
     */
    where: NewsRawItemWhereUniqueInput
  }

  /**
   * NewsRawItem findFirst
   */
  export type NewsRawItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsRawItem to fetch.
     */
    where?: NewsRawItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsRawItems to fetch.
     */
    orderBy?: NewsRawItemOrderByWithRelationInput | NewsRawItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsRawItems.
     */
    cursor?: NewsRawItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsRawItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsRawItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsRawItems.
     */
    distinct?: NewsRawItemScalarFieldEnum | NewsRawItemScalarFieldEnum[]
  }

  /**
   * NewsRawItem findFirstOrThrow
   */
  export type NewsRawItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsRawItem to fetch.
     */
    where?: NewsRawItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsRawItems to fetch.
     */
    orderBy?: NewsRawItemOrderByWithRelationInput | NewsRawItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsRawItems.
     */
    cursor?: NewsRawItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsRawItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsRawItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsRawItems.
     */
    distinct?: NewsRawItemScalarFieldEnum | NewsRawItemScalarFieldEnum[]
  }

  /**
   * NewsRawItem findMany
   */
  export type NewsRawItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
    /**
     * Filter, which NewsRawItems to fetch.
     */
    where?: NewsRawItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsRawItems to fetch.
     */
    orderBy?: NewsRawItemOrderByWithRelationInput | NewsRawItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsRawItems.
     */
    cursor?: NewsRawItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsRawItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsRawItems.
     */
    skip?: number
    distinct?: NewsRawItemScalarFieldEnum | NewsRawItemScalarFieldEnum[]
  }

  /**
   * NewsRawItem create
   */
  export type NewsRawItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsRawItem.
     */
    data: XOR<NewsRawItemCreateInput, NewsRawItemUncheckedCreateInput>
  }

  /**
   * NewsRawItem createMany
   */
  export type NewsRawItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsRawItems.
     */
    data: NewsRawItemCreateManyInput | NewsRawItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsRawItem createManyAndReturn
   */
  export type NewsRawItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * The data used to create many NewsRawItems.
     */
    data: NewsRawItemCreateManyInput | NewsRawItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsRawItem update
   */
  export type NewsRawItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsRawItem.
     */
    data: XOR<NewsRawItemUpdateInput, NewsRawItemUncheckedUpdateInput>
    /**
     * Choose, which NewsRawItem to update.
     */
    where: NewsRawItemWhereUniqueInput
  }

  /**
   * NewsRawItem updateMany
   */
  export type NewsRawItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsRawItems.
     */
    data: XOR<NewsRawItemUpdateManyMutationInput, NewsRawItemUncheckedUpdateManyInput>
    /**
     * Filter which NewsRawItems to update
     */
    where?: NewsRawItemWhereInput
    /**
     * Limit how many NewsRawItems to update.
     */
    limit?: number
  }

  /**
   * NewsRawItem updateManyAndReturn
   */
  export type NewsRawItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * The data used to update NewsRawItems.
     */
    data: XOR<NewsRawItemUpdateManyMutationInput, NewsRawItemUncheckedUpdateManyInput>
    /**
     * Filter which NewsRawItems to update
     */
    where?: NewsRawItemWhereInput
    /**
     * Limit how many NewsRawItems to update.
     */
    limit?: number
  }

  /**
   * NewsRawItem upsert
   */
  export type NewsRawItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsRawItem to update in case it exists.
     */
    where: NewsRawItemWhereUniqueInput
    /**
     * In case the NewsRawItem found by the `where` argument doesn't exist, create a new NewsRawItem with this data.
     */
    create: XOR<NewsRawItemCreateInput, NewsRawItemUncheckedCreateInput>
    /**
     * In case the NewsRawItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsRawItemUpdateInput, NewsRawItemUncheckedUpdateInput>
  }

  /**
   * NewsRawItem delete
   */
  export type NewsRawItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
    /**
     * Filter which NewsRawItem to delete.
     */
    where: NewsRawItemWhereUniqueInput
  }

  /**
   * NewsRawItem deleteMany
   */
  export type NewsRawItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsRawItems to delete
     */
    where?: NewsRawItemWhereInput
    /**
     * Limit how many NewsRawItems to delete.
     */
    limit?: number
  }

  /**
   * NewsRawItem.triage
   */
  export type NewsRawItem$triageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    where?: NewsTriageWhereInput
  }

  /**
   * NewsRawItem.impact
   */
  export type NewsRawItem$impactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    where?: NewsImpactWhereInput
  }

  /**
   * NewsRawItem without action
   */
  export type NewsRawItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsRawItem
     */
    select?: NewsRawItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsRawItem
     */
    omit?: NewsRawItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsRawItemInclude<ExtArgs> | null
  }


  /**
   * Model NewsTriage
   */

  export type AggregateNewsTriage = {
    _count: NewsTriageCountAggregateOutputType | null
    _avg: NewsTriageAvgAggregateOutputType | null
    _sum: NewsTriageSumAggregateOutputType | null
    _min: NewsTriageMinAggregateOutputType | null
    _max: NewsTriageMaxAggregateOutputType | null
  }

  export type NewsTriageAvgAggregateOutputType = {
    latencyMs: number | null
    tokensIn: number | null
    tokensOut: number | null
  }

  export type NewsTriageSumAggregateOutputType = {
    latencyMs: number | null
    tokensIn: number | null
    tokensOut: number | null
  }

  export type NewsTriageMinAggregateOutputType = {
    id: string | null
    rawItemId: string | null
    relevant: boolean | null
    category: string | null
    urgency: string | null
    modelVersion: string | null
    latencyMs: number | null
    tokensIn: number | null
    tokensOut: number | null
    createdAt: Date | null
  }

  export type NewsTriageMaxAggregateOutputType = {
    id: string | null
    rawItemId: string | null
    relevant: boolean | null
    category: string | null
    urgency: string | null
    modelVersion: string | null
    latencyMs: number | null
    tokensIn: number | null
    tokensOut: number | null
    createdAt: Date | null
  }

  export type NewsTriageCountAggregateOutputType = {
    id: number
    rawItemId: number
    relevant: number
    category: number
    urgency: number
    modelVersion: number
    latencyMs: number
    tokensIn: number
    tokensOut: number
    createdAt: number
    _all: number
  }


  export type NewsTriageAvgAggregateInputType = {
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
  }

  export type NewsTriageSumAggregateInputType = {
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
  }

  export type NewsTriageMinAggregateInputType = {
    id?: true
    rawItemId?: true
    relevant?: true
    category?: true
    urgency?: true
    modelVersion?: true
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
    createdAt?: true
  }

  export type NewsTriageMaxAggregateInputType = {
    id?: true
    rawItemId?: true
    relevant?: true
    category?: true
    urgency?: true
    modelVersion?: true
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
    createdAt?: true
  }

  export type NewsTriageCountAggregateInputType = {
    id?: true
    rawItemId?: true
    relevant?: true
    category?: true
    urgency?: true
    modelVersion?: true
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
    createdAt?: true
    _all?: true
  }

  export type NewsTriageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsTriage to aggregate.
     */
    where?: NewsTriageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsTriages to fetch.
     */
    orderBy?: NewsTriageOrderByWithRelationInput | NewsTriageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsTriageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsTriages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsTriages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsTriages
    **/
    _count?: true | NewsTriageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewsTriageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewsTriageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsTriageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsTriageMaxAggregateInputType
  }

  export type GetNewsTriageAggregateType<T extends NewsTriageAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsTriage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsTriage[P]>
      : GetScalarType<T[P], AggregateNewsTriage[P]>
  }




  export type NewsTriageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsTriageWhereInput
    orderBy?: NewsTriageOrderByWithAggregationInput | NewsTriageOrderByWithAggregationInput[]
    by: NewsTriageScalarFieldEnum[] | NewsTriageScalarFieldEnum
    having?: NewsTriageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsTriageCountAggregateInputType | true
    _avg?: NewsTriageAvgAggregateInputType
    _sum?: NewsTriageSumAggregateInputType
    _min?: NewsTriageMinAggregateInputType
    _max?: NewsTriageMaxAggregateInputType
  }

  export type NewsTriageGroupByOutputType = {
    id: string
    rawItemId: string
    relevant: boolean
    category: string
    urgency: string
    modelVersion: string
    latencyMs: number
    tokensIn: number | null
    tokensOut: number | null
    createdAt: Date
    _count: NewsTriageCountAggregateOutputType | null
    _avg: NewsTriageAvgAggregateOutputType | null
    _sum: NewsTriageSumAggregateOutputType | null
    _min: NewsTriageMinAggregateOutputType | null
    _max: NewsTriageMaxAggregateOutputType | null
  }

  type GetNewsTriageGroupByPayload<T extends NewsTriageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsTriageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsTriageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsTriageGroupByOutputType[P]>
            : GetScalarType<T[P], NewsTriageGroupByOutputType[P]>
        }
      >
    >


  export type NewsTriageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rawItemId?: boolean
    relevant?: boolean
    category?: boolean
    urgency?: boolean
    modelVersion?: boolean
    latencyMs?: boolean
    tokensIn?: boolean
    tokensOut?: boolean
    createdAt?: boolean
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsTriage"]>

  export type NewsTriageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rawItemId?: boolean
    relevant?: boolean
    category?: boolean
    urgency?: boolean
    modelVersion?: boolean
    latencyMs?: boolean
    tokensIn?: boolean
    tokensOut?: boolean
    createdAt?: boolean
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsTriage"]>

  export type NewsTriageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rawItemId?: boolean
    relevant?: boolean
    category?: boolean
    urgency?: boolean
    modelVersion?: boolean
    latencyMs?: boolean
    tokensIn?: boolean
    tokensOut?: boolean
    createdAt?: boolean
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsTriage"]>

  export type NewsTriageSelectScalar = {
    id?: boolean
    rawItemId?: boolean
    relevant?: boolean
    category?: boolean
    urgency?: boolean
    modelVersion?: boolean
    latencyMs?: boolean
    tokensIn?: boolean
    tokensOut?: boolean
    createdAt?: boolean
  }

  export type NewsTriageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rawItemId" | "relevant" | "category" | "urgency" | "modelVersion" | "latencyMs" | "tokensIn" | "tokensOut" | "createdAt", ExtArgs["result"]["newsTriage"]>
  export type NewsTriageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
  }
  export type NewsTriageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
  }
  export type NewsTriageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
  }

  export type $NewsTriagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsTriage"
    objects: {
      rawItem: Prisma.$NewsRawItemPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rawItemId: string
      relevant: boolean
      category: string
      urgency: string
      modelVersion: string
      latencyMs: number
      tokensIn: number | null
      tokensOut: number | null
      createdAt: Date
    }, ExtArgs["result"]["newsTriage"]>
    composites: {}
  }

  type NewsTriageGetPayload<S extends boolean | null | undefined | NewsTriageDefaultArgs> = $Result.GetResult<Prisma.$NewsTriagePayload, S>

  type NewsTriageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsTriageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsTriageCountAggregateInputType | true
    }

  export interface NewsTriageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsTriage'], meta: { name: 'NewsTriage' } }
    /**
     * Find zero or one NewsTriage that matches the filter.
     * @param {NewsTriageFindUniqueArgs} args - Arguments to find a NewsTriage
     * @example
     * // Get one NewsTriage
     * const newsTriage = await prisma.newsTriage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsTriageFindUniqueArgs>(args: SelectSubset<T, NewsTriageFindUniqueArgs<ExtArgs>>): Prisma__NewsTriageClient<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsTriage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsTriageFindUniqueOrThrowArgs} args - Arguments to find a NewsTriage
     * @example
     * // Get one NewsTriage
     * const newsTriage = await prisma.newsTriage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsTriageFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsTriageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsTriageClient<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsTriage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsTriageFindFirstArgs} args - Arguments to find a NewsTriage
     * @example
     * // Get one NewsTriage
     * const newsTriage = await prisma.newsTriage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsTriageFindFirstArgs>(args?: SelectSubset<T, NewsTriageFindFirstArgs<ExtArgs>>): Prisma__NewsTriageClient<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsTriage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsTriageFindFirstOrThrowArgs} args - Arguments to find a NewsTriage
     * @example
     * // Get one NewsTriage
     * const newsTriage = await prisma.newsTriage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsTriageFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsTriageFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsTriageClient<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsTriages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsTriageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsTriages
     * const newsTriages = await prisma.newsTriage.findMany()
     * 
     * // Get first 10 NewsTriages
     * const newsTriages = await prisma.newsTriage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsTriageWithIdOnly = await prisma.newsTriage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsTriageFindManyArgs>(args?: SelectSubset<T, NewsTriageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsTriage.
     * @param {NewsTriageCreateArgs} args - Arguments to create a NewsTriage.
     * @example
     * // Create one NewsTriage
     * const NewsTriage = await prisma.newsTriage.create({
     *   data: {
     *     // ... data to create a NewsTriage
     *   }
     * })
     * 
     */
    create<T extends NewsTriageCreateArgs>(args: SelectSubset<T, NewsTriageCreateArgs<ExtArgs>>): Prisma__NewsTriageClient<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsTriages.
     * @param {NewsTriageCreateManyArgs} args - Arguments to create many NewsTriages.
     * @example
     * // Create many NewsTriages
     * const newsTriage = await prisma.newsTriage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsTriageCreateManyArgs>(args?: SelectSubset<T, NewsTriageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsTriages and returns the data saved in the database.
     * @param {NewsTriageCreateManyAndReturnArgs} args - Arguments to create many NewsTriages.
     * @example
     * // Create many NewsTriages
     * const newsTriage = await prisma.newsTriage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsTriages and only return the `id`
     * const newsTriageWithIdOnly = await prisma.newsTriage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsTriageCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsTriageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NewsTriage.
     * @param {NewsTriageDeleteArgs} args - Arguments to delete one NewsTriage.
     * @example
     * // Delete one NewsTriage
     * const NewsTriage = await prisma.newsTriage.delete({
     *   where: {
     *     // ... filter to delete one NewsTriage
     *   }
     * })
     * 
     */
    delete<T extends NewsTriageDeleteArgs>(args: SelectSubset<T, NewsTriageDeleteArgs<ExtArgs>>): Prisma__NewsTriageClient<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsTriage.
     * @param {NewsTriageUpdateArgs} args - Arguments to update one NewsTriage.
     * @example
     * // Update one NewsTriage
     * const newsTriage = await prisma.newsTriage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsTriageUpdateArgs>(args: SelectSubset<T, NewsTriageUpdateArgs<ExtArgs>>): Prisma__NewsTriageClient<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsTriages.
     * @param {NewsTriageDeleteManyArgs} args - Arguments to filter NewsTriages to delete.
     * @example
     * // Delete a few NewsTriages
     * const { count } = await prisma.newsTriage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsTriageDeleteManyArgs>(args?: SelectSubset<T, NewsTriageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsTriages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsTriageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsTriages
     * const newsTriage = await prisma.newsTriage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsTriageUpdateManyArgs>(args: SelectSubset<T, NewsTriageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsTriages and returns the data updated in the database.
     * @param {NewsTriageUpdateManyAndReturnArgs} args - Arguments to update many NewsTriages.
     * @example
     * // Update many NewsTriages
     * const newsTriage = await prisma.newsTriage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NewsTriages and only return the `id`
     * const newsTriageWithIdOnly = await prisma.newsTriage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NewsTriageUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsTriageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NewsTriage.
     * @param {NewsTriageUpsertArgs} args - Arguments to update or create a NewsTriage.
     * @example
     * // Update or create a NewsTriage
     * const newsTriage = await prisma.newsTriage.upsert({
     *   create: {
     *     // ... data to create a NewsTriage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsTriage we want to update
     *   }
     * })
     */
    upsert<T extends NewsTriageUpsertArgs>(args: SelectSubset<T, NewsTriageUpsertArgs<ExtArgs>>): Prisma__NewsTriageClient<$Result.GetResult<Prisma.$NewsTriagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsTriages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsTriageCountArgs} args - Arguments to filter NewsTriages to count.
     * @example
     * // Count the number of NewsTriages
     * const count = await prisma.newsTriage.count({
     *   where: {
     *     // ... the filter for the NewsTriages we want to count
     *   }
     * })
    **/
    count<T extends NewsTriageCountArgs>(
      args?: Subset<T, NewsTriageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsTriageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsTriage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsTriageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsTriageAggregateArgs>(args: Subset<T, NewsTriageAggregateArgs>): Prisma.PrismaPromise<GetNewsTriageAggregateType<T>>

    /**
     * Group by NewsTriage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsTriageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsTriageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsTriageGroupByArgs['orderBy'] }
        : { orderBy?: NewsTriageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsTriageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsTriageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsTriage model
   */
  readonly fields: NewsTriageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsTriage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsTriageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rawItem<T extends NewsRawItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NewsRawItemDefaultArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsTriage model
   */
  interface NewsTriageFieldRefs {
    readonly id: FieldRef<"NewsTriage", 'String'>
    readonly rawItemId: FieldRef<"NewsTriage", 'String'>
    readonly relevant: FieldRef<"NewsTriage", 'Boolean'>
    readonly category: FieldRef<"NewsTriage", 'String'>
    readonly urgency: FieldRef<"NewsTriage", 'String'>
    readonly modelVersion: FieldRef<"NewsTriage", 'String'>
    readonly latencyMs: FieldRef<"NewsTriage", 'Int'>
    readonly tokensIn: FieldRef<"NewsTriage", 'Int'>
    readonly tokensOut: FieldRef<"NewsTriage", 'Int'>
    readonly createdAt: FieldRef<"NewsTriage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsTriage findUnique
   */
  export type NewsTriageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    /**
     * Filter, which NewsTriage to fetch.
     */
    where: NewsTriageWhereUniqueInput
  }

  /**
   * NewsTriage findUniqueOrThrow
   */
  export type NewsTriageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    /**
     * Filter, which NewsTriage to fetch.
     */
    where: NewsTriageWhereUniqueInput
  }

  /**
   * NewsTriage findFirst
   */
  export type NewsTriageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    /**
     * Filter, which NewsTriage to fetch.
     */
    where?: NewsTriageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsTriages to fetch.
     */
    orderBy?: NewsTriageOrderByWithRelationInput | NewsTriageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsTriages.
     */
    cursor?: NewsTriageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsTriages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsTriages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsTriages.
     */
    distinct?: NewsTriageScalarFieldEnum | NewsTriageScalarFieldEnum[]
  }

  /**
   * NewsTriage findFirstOrThrow
   */
  export type NewsTriageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    /**
     * Filter, which NewsTriage to fetch.
     */
    where?: NewsTriageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsTriages to fetch.
     */
    orderBy?: NewsTriageOrderByWithRelationInput | NewsTriageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsTriages.
     */
    cursor?: NewsTriageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsTriages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsTriages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsTriages.
     */
    distinct?: NewsTriageScalarFieldEnum | NewsTriageScalarFieldEnum[]
  }

  /**
   * NewsTriage findMany
   */
  export type NewsTriageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    /**
     * Filter, which NewsTriages to fetch.
     */
    where?: NewsTriageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsTriages to fetch.
     */
    orderBy?: NewsTriageOrderByWithRelationInput | NewsTriageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsTriages.
     */
    cursor?: NewsTriageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsTriages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsTriages.
     */
    skip?: number
    distinct?: NewsTriageScalarFieldEnum | NewsTriageScalarFieldEnum[]
  }

  /**
   * NewsTriage create
   */
  export type NewsTriageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsTriage.
     */
    data: XOR<NewsTriageCreateInput, NewsTriageUncheckedCreateInput>
  }

  /**
   * NewsTriage createMany
   */
  export type NewsTriageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsTriages.
     */
    data: NewsTriageCreateManyInput | NewsTriageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsTriage createManyAndReturn
   */
  export type NewsTriageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * The data used to create many NewsTriages.
     */
    data: NewsTriageCreateManyInput | NewsTriageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsTriage update
   */
  export type NewsTriageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsTriage.
     */
    data: XOR<NewsTriageUpdateInput, NewsTriageUncheckedUpdateInput>
    /**
     * Choose, which NewsTriage to update.
     */
    where: NewsTriageWhereUniqueInput
  }

  /**
   * NewsTriage updateMany
   */
  export type NewsTriageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsTriages.
     */
    data: XOR<NewsTriageUpdateManyMutationInput, NewsTriageUncheckedUpdateManyInput>
    /**
     * Filter which NewsTriages to update
     */
    where?: NewsTriageWhereInput
    /**
     * Limit how many NewsTriages to update.
     */
    limit?: number
  }

  /**
   * NewsTriage updateManyAndReturn
   */
  export type NewsTriageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * The data used to update NewsTriages.
     */
    data: XOR<NewsTriageUpdateManyMutationInput, NewsTriageUncheckedUpdateManyInput>
    /**
     * Filter which NewsTriages to update
     */
    where?: NewsTriageWhereInput
    /**
     * Limit how many NewsTriages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsTriage upsert
   */
  export type NewsTriageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsTriage to update in case it exists.
     */
    where: NewsTriageWhereUniqueInput
    /**
     * In case the NewsTriage found by the `where` argument doesn't exist, create a new NewsTriage with this data.
     */
    create: XOR<NewsTriageCreateInput, NewsTriageUncheckedCreateInput>
    /**
     * In case the NewsTriage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsTriageUpdateInput, NewsTriageUncheckedUpdateInput>
  }

  /**
   * NewsTriage delete
   */
  export type NewsTriageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
    /**
     * Filter which NewsTriage to delete.
     */
    where: NewsTriageWhereUniqueInput
  }

  /**
   * NewsTriage deleteMany
   */
  export type NewsTriageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsTriages to delete
     */
    where?: NewsTriageWhereInput
    /**
     * Limit how many NewsTriages to delete.
     */
    limit?: number
  }

  /**
   * NewsTriage without action
   */
  export type NewsTriageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsTriage
     */
    select?: NewsTriageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsTriage
     */
    omit?: NewsTriageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsTriageInclude<ExtArgs> | null
  }


  /**
   * Model NewsImpact
   */

  export type AggregateNewsImpact = {
    _count: NewsImpactCountAggregateOutputType | null
    _avg: NewsImpactAvgAggregateOutputType | null
    _sum: NewsImpactSumAggregateOutputType | null
    _min: NewsImpactMinAggregateOutputType | null
    _max: NewsImpactMaxAggregateOutputType | null
  }

  export type NewsImpactAvgAggregateOutputType = {
    latencyMs: number | null
    tokensIn: number | null
    tokensOut: number | null
  }

  export type NewsImpactSumAggregateOutputType = {
    latencyMs: number | null
    tokensIn: number | null
    tokensOut: number | null
  }

  export type NewsImpactMinAggregateOutputType = {
    id: string | null
    rawItemId: string | null
    direction: string | null
    confidence: string | null
    rationale: string | null
    mode: string | null
    disclaimer: string | null
    modelVersion: string | null
    latencyMs: number | null
    tokensIn: number | null
    tokensOut: number | null
    humanReviewRequired: boolean | null
    humanApproved: boolean | null
    humanNotes: string | null
    complianceAuditId: string | null
    createdAt: Date | null
  }

  export type NewsImpactMaxAggregateOutputType = {
    id: string | null
    rawItemId: string | null
    direction: string | null
    confidence: string | null
    rationale: string | null
    mode: string | null
    disclaimer: string | null
    modelVersion: string | null
    latencyMs: number | null
    tokensIn: number | null
    tokensOut: number | null
    humanReviewRequired: boolean | null
    humanApproved: boolean | null
    humanNotes: string | null
    complianceAuditId: string | null
    createdAt: Date | null
  }

  export type NewsImpactCountAggregateOutputType = {
    id: number
    rawItemId: number
    sectorImpact: number
    direction: number
    confidence: number
    rationale: number
    historicalAnalogues: number
    mode: number
    disclaimer: number
    modelVersion: number
    latencyMs: number
    tokensIn: number
    tokensOut: number
    humanReviewRequired: number
    humanApproved: number
    humanNotes: number
    complianceAuditId: number
    createdAt: number
    _all: number
  }


  export type NewsImpactAvgAggregateInputType = {
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
  }

  export type NewsImpactSumAggregateInputType = {
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
  }

  export type NewsImpactMinAggregateInputType = {
    id?: true
    rawItemId?: true
    direction?: true
    confidence?: true
    rationale?: true
    mode?: true
    disclaimer?: true
    modelVersion?: true
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
    humanReviewRequired?: true
    humanApproved?: true
    humanNotes?: true
    complianceAuditId?: true
    createdAt?: true
  }

  export type NewsImpactMaxAggregateInputType = {
    id?: true
    rawItemId?: true
    direction?: true
    confidence?: true
    rationale?: true
    mode?: true
    disclaimer?: true
    modelVersion?: true
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
    humanReviewRequired?: true
    humanApproved?: true
    humanNotes?: true
    complianceAuditId?: true
    createdAt?: true
  }

  export type NewsImpactCountAggregateInputType = {
    id?: true
    rawItemId?: true
    sectorImpact?: true
    direction?: true
    confidence?: true
    rationale?: true
    historicalAnalogues?: true
    mode?: true
    disclaimer?: true
    modelVersion?: true
    latencyMs?: true
    tokensIn?: true
    tokensOut?: true
    humanReviewRequired?: true
    humanApproved?: true
    humanNotes?: true
    complianceAuditId?: true
    createdAt?: true
    _all?: true
  }

  export type NewsImpactAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsImpact to aggregate.
     */
    where?: NewsImpactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsImpacts to fetch.
     */
    orderBy?: NewsImpactOrderByWithRelationInput | NewsImpactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsImpactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsImpacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsImpacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsImpacts
    **/
    _count?: true | NewsImpactCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewsImpactAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewsImpactSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsImpactMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsImpactMaxAggregateInputType
  }

  export type GetNewsImpactAggregateType<T extends NewsImpactAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsImpact]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsImpact[P]>
      : GetScalarType<T[P], AggregateNewsImpact[P]>
  }




  export type NewsImpactGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsImpactWhereInput
    orderBy?: NewsImpactOrderByWithAggregationInput | NewsImpactOrderByWithAggregationInput[]
    by: NewsImpactScalarFieldEnum[] | NewsImpactScalarFieldEnum
    having?: NewsImpactScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsImpactCountAggregateInputType | true
    _avg?: NewsImpactAvgAggregateInputType
    _sum?: NewsImpactSumAggregateInputType
    _min?: NewsImpactMinAggregateInputType
    _max?: NewsImpactMaxAggregateInputType
  }

  export type NewsImpactGroupByOutputType = {
    id: string
    rawItemId: string
    sectorImpact: string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonValue
    mode: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn: number | null
    tokensOut: number | null
    humanReviewRequired: boolean
    humanApproved: boolean | null
    humanNotes: string | null
    complianceAuditId: string
    createdAt: Date
    _count: NewsImpactCountAggregateOutputType | null
    _avg: NewsImpactAvgAggregateOutputType | null
    _sum: NewsImpactSumAggregateOutputType | null
    _min: NewsImpactMinAggregateOutputType | null
    _max: NewsImpactMaxAggregateOutputType | null
  }

  type GetNewsImpactGroupByPayload<T extends NewsImpactGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsImpactGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsImpactGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsImpactGroupByOutputType[P]>
            : GetScalarType<T[P], NewsImpactGroupByOutputType[P]>
        }
      >
    >


  export type NewsImpactSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rawItemId?: boolean
    sectorImpact?: boolean
    direction?: boolean
    confidence?: boolean
    rationale?: boolean
    historicalAnalogues?: boolean
    mode?: boolean
    disclaimer?: boolean
    modelVersion?: boolean
    latencyMs?: boolean
    tokensIn?: boolean
    tokensOut?: boolean
    humanReviewRequired?: boolean
    humanApproved?: boolean
    humanNotes?: boolean
    complianceAuditId?: boolean
    createdAt?: boolean
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
    auditLog?: boolean | NewsAuditLogDefaultArgs<ExtArgs>
    backtests?: boolean | NewsImpact$backtestsArgs<ExtArgs>
    _count?: boolean | NewsImpactCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsImpact"]>

  export type NewsImpactSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rawItemId?: boolean
    sectorImpact?: boolean
    direction?: boolean
    confidence?: boolean
    rationale?: boolean
    historicalAnalogues?: boolean
    mode?: boolean
    disclaimer?: boolean
    modelVersion?: boolean
    latencyMs?: boolean
    tokensIn?: boolean
    tokensOut?: boolean
    humanReviewRequired?: boolean
    humanApproved?: boolean
    humanNotes?: boolean
    complianceAuditId?: boolean
    createdAt?: boolean
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
    auditLog?: boolean | NewsAuditLogDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsImpact"]>

  export type NewsImpactSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rawItemId?: boolean
    sectorImpact?: boolean
    direction?: boolean
    confidence?: boolean
    rationale?: boolean
    historicalAnalogues?: boolean
    mode?: boolean
    disclaimer?: boolean
    modelVersion?: boolean
    latencyMs?: boolean
    tokensIn?: boolean
    tokensOut?: boolean
    humanReviewRequired?: boolean
    humanApproved?: boolean
    humanNotes?: boolean
    complianceAuditId?: boolean
    createdAt?: boolean
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
    auditLog?: boolean | NewsAuditLogDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsImpact"]>

  export type NewsImpactSelectScalar = {
    id?: boolean
    rawItemId?: boolean
    sectorImpact?: boolean
    direction?: boolean
    confidence?: boolean
    rationale?: boolean
    historicalAnalogues?: boolean
    mode?: boolean
    disclaimer?: boolean
    modelVersion?: boolean
    latencyMs?: boolean
    tokensIn?: boolean
    tokensOut?: boolean
    humanReviewRequired?: boolean
    humanApproved?: boolean
    humanNotes?: boolean
    complianceAuditId?: boolean
    createdAt?: boolean
  }

  export type NewsImpactOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rawItemId" | "sectorImpact" | "direction" | "confidence" | "rationale" | "historicalAnalogues" | "mode" | "disclaimer" | "modelVersion" | "latencyMs" | "tokensIn" | "tokensOut" | "humanReviewRequired" | "humanApproved" | "humanNotes" | "complianceAuditId" | "createdAt", ExtArgs["result"]["newsImpact"]>
  export type NewsImpactInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
    auditLog?: boolean | NewsAuditLogDefaultArgs<ExtArgs>
    backtests?: boolean | NewsImpact$backtestsArgs<ExtArgs>
    _count?: boolean | NewsImpactCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NewsImpactIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
    auditLog?: boolean | NewsAuditLogDefaultArgs<ExtArgs>
  }
  export type NewsImpactIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rawItem?: boolean | NewsRawItemDefaultArgs<ExtArgs>
    auditLog?: boolean | NewsAuditLogDefaultArgs<ExtArgs>
  }

  export type $NewsImpactPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsImpact"
    objects: {
      rawItem: Prisma.$NewsRawItemPayload<ExtArgs>
      auditLog: Prisma.$NewsAuditLogPayload<ExtArgs>
      backtests: Prisma.$NewsBacktestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rawItemId: string
      sectorImpact: string[]
      direction: string
      confidence: string
      rationale: string
      historicalAnalogues: Prisma.JsonValue
      mode: string
      disclaimer: string
      modelVersion: string
      latencyMs: number
      tokensIn: number | null
      tokensOut: number | null
      humanReviewRequired: boolean
      humanApproved: boolean | null
      humanNotes: string | null
      complianceAuditId: string
      createdAt: Date
    }, ExtArgs["result"]["newsImpact"]>
    composites: {}
  }

  type NewsImpactGetPayload<S extends boolean | null | undefined | NewsImpactDefaultArgs> = $Result.GetResult<Prisma.$NewsImpactPayload, S>

  type NewsImpactCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsImpactFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsImpactCountAggregateInputType | true
    }

  export interface NewsImpactDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsImpact'], meta: { name: 'NewsImpact' } }
    /**
     * Find zero or one NewsImpact that matches the filter.
     * @param {NewsImpactFindUniqueArgs} args - Arguments to find a NewsImpact
     * @example
     * // Get one NewsImpact
     * const newsImpact = await prisma.newsImpact.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsImpactFindUniqueArgs>(args: SelectSubset<T, NewsImpactFindUniqueArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsImpact that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsImpactFindUniqueOrThrowArgs} args - Arguments to find a NewsImpact
     * @example
     * // Get one NewsImpact
     * const newsImpact = await prisma.newsImpact.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsImpactFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsImpactFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsImpact that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsImpactFindFirstArgs} args - Arguments to find a NewsImpact
     * @example
     * // Get one NewsImpact
     * const newsImpact = await prisma.newsImpact.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsImpactFindFirstArgs>(args?: SelectSubset<T, NewsImpactFindFirstArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsImpact that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsImpactFindFirstOrThrowArgs} args - Arguments to find a NewsImpact
     * @example
     * // Get one NewsImpact
     * const newsImpact = await prisma.newsImpact.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsImpactFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsImpactFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsImpacts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsImpactFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsImpacts
     * const newsImpacts = await prisma.newsImpact.findMany()
     * 
     * // Get first 10 NewsImpacts
     * const newsImpacts = await prisma.newsImpact.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsImpactWithIdOnly = await prisma.newsImpact.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsImpactFindManyArgs>(args?: SelectSubset<T, NewsImpactFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsImpact.
     * @param {NewsImpactCreateArgs} args - Arguments to create a NewsImpact.
     * @example
     * // Create one NewsImpact
     * const NewsImpact = await prisma.newsImpact.create({
     *   data: {
     *     // ... data to create a NewsImpact
     *   }
     * })
     * 
     */
    create<T extends NewsImpactCreateArgs>(args: SelectSubset<T, NewsImpactCreateArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsImpacts.
     * @param {NewsImpactCreateManyArgs} args - Arguments to create many NewsImpacts.
     * @example
     * // Create many NewsImpacts
     * const newsImpact = await prisma.newsImpact.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsImpactCreateManyArgs>(args?: SelectSubset<T, NewsImpactCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsImpacts and returns the data saved in the database.
     * @param {NewsImpactCreateManyAndReturnArgs} args - Arguments to create many NewsImpacts.
     * @example
     * // Create many NewsImpacts
     * const newsImpact = await prisma.newsImpact.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsImpacts and only return the `id`
     * const newsImpactWithIdOnly = await prisma.newsImpact.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsImpactCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsImpactCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NewsImpact.
     * @param {NewsImpactDeleteArgs} args - Arguments to delete one NewsImpact.
     * @example
     * // Delete one NewsImpact
     * const NewsImpact = await prisma.newsImpact.delete({
     *   where: {
     *     // ... filter to delete one NewsImpact
     *   }
     * })
     * 
     */
    delete<T extends NewsImpactDeleteArgs>(args: SelectSubset<T, NewsImpactDeleteArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsImpact.
     * @param {NewsImpactUpdateArgs} args - Arguments to update one NewsImpact.
     * @example
     * // Update one NewsImpact
     * const newsImpact = await prisma.newsImpact.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsImpactUpdateArgs>(args: SelectSubset<T, NewsImpactUpdateArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsImpacts.
     * @param {NewsImpactDeleteManyArgs} args - Arguments to filter NewsImpacts to delete.
     * @example
     * // Delete a few NewsImpacts
     * const { count } = await prisma.newsImpact.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsImpactDeleteManyArgs>(args?: SelectSubset<T, NewsImpactDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsImpacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsImpactUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsImpacts
     * const newsImpact = await prisma.newsImpact.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsImpactUpdateManyArgs>(args: SelectSubset<T, NewsImpactUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsImpacts and returns the data updated in the database.
     * @param {NewsImpactUpdateManyAndReturnArgs} args - Arguments to update many NewsImpacts.
     * @example
     * // Update many NewsImpacts
     * const newsImpact = await prisma.newsImpact.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NewsImpacts and only return the `id`
     * const newsImpactWithIdOnly = await prisma.newsImpact.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NewsImpactUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsImpactUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NewsImpact.
     * @param {NewsImpactUpsertArgs} args - Arguments to update or create a NewsImpact.
     * @example
     * // Update or create a NewsImpact
     * const newsImpact = await prisma.newsImpact.upsert({
     *   create: {
     *     // ... data to create a NewsImpact
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsImpact we want to update
     *   }
     * })
     */
    upsert<T extends NewsImpactUpsertArgs>(args: SelectSubset<T, NewsImpactUpsertArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsImpacts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsImpactCountArgs} args - Arguments to filter NewsImpacts to count.
     * @example
     * // Count the number of NewsImpacts
     * const count = await prisma.newsImpact.count({
     *   where: {
     *     // ... the filter for the NewsImpacts we want to count
     *   }
     * })
    **/
    count<T extends NewsImpactCountArgs>(
      args?: Subset<T, NewsImpactCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsImpactCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsImpact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsImpactAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsImpactAggregateArgs>(args: Subset<T, NewsImpactAggregateArgs>): Prisma.PrismaPromise<GetNewsImpactAggregateType<T>>

    /**
     * Group by NewsImpact.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsImpactGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsImpactGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsImpactGroupByArgs['orderBy'] }
        : { orderBy?: NewsImpactGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsImpactGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsImpactGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsImpact model
   */
  readonly fields: NewsImpactFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsImpact.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsImpactClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rawItem<T extends NewsRawItemDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NewsRawItemDefaultArgs<ExtArgs>>): Prisma__NewsRawItemClient<$Result.GetResult<Prisma.$NewsRawItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    auditLog<T extends NewsAuditLogDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NewsAuditLogDefaultArgs<ExtArgs>>): Prisma__NewsAuditLogClient<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    backtests<T extends NewsImpact$backtestsArgs<ExtArgs> = {}>(args?: Subset<T, NewsImpact$backtestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsImpact model
   */
  interface NewsImpactFieldRefs {
    readonly id: FieldRef<"NewsImpact", 'String'>
    readonly rawItemId: FieldRef<"NewsImpact", 'String'>
    readonly sectorImpact: FieldRef<"NewsImpact", 'String[]'>
    readonly direction: FieldRef<"NewsImpact", 'String'>
    readonly confidence: FieldRef<"NewsImpact", 'String'>
    readonly rationale: FieldRef<"NewsImpact", 'String'>
    readonly historicalAnalogues: FieldRef<"NewsImpact", 'Json'>
    readonly mode: FieldRef<"NewsImpact", 'String'>
    readonly disclaimer: FieldRef<"NewsImpact", 'String'>
    readonly modelVersion: FieldRef<"NewsImpact", 'String'>
    readonly latencyMs: FieldRef<"NewsImpact", 'Int'>
    readonly tokensIn: FieldRef<"NewsImpact", 'Int'>
    readonly tokensOut: FieldRef<"NewsImpact", 'Int'>
    readonly humanReviewRequired: FieldRef<"NewsImpact", 'Boolean'>
    readonly humanApproved: FieldRef<"NewsImpact", 'Boolean'>
    readonly humanNotes: FieldRef<"NewsImpact", 'String'>
    readonly complianceAuditId: FieldRef<"NewsImpact", 'String'>
    readonly createdAt: FieldRef<"NewsImpact", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsImpact findUnique
   */
  export type NewsImpactFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    /**
     * Filter, which NewsImpact to fetch.
     */
    where: NewsImpactWhereUniqueInput
  }

  /**
   * NewsImpact findUniqueOrThrow
   */
  export type NewsImpactFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    /**
     * Filter, which NewsImpact to fetch.
     */
    where: NewsImpactWhereUniqueInput
  }

  /**
   * NewsImpact findFirst
   */
  export type NewsImpactFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    /**
     * Filter, which NewsImpact to fetch.
     */
    where?: NewsImpactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsImpacts to fetch.
     */
    orderBy?: NewsImpactOrderByWithRelationInput | NewsImpactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsImpacts.
     */
    cursor?: NewsImpactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsImpacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsImpacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsImpacts.
     */
    distinct?: NewsImpactScalarFieldEnum | NewsImpactScalarFieldEnum[]
  }

  /**
   * NewsImpact findFirstOrThrow
   */
  export type NewsImpactFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    /**
     * Filter, which NewsImpact to fetch.
     */
    where?: NewsImpactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsImpacts to fetch.
     */
    orderBy?: NewsImpactOrderByWithRelationInput | NewsImpactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsImpacts.
     */
    cursor?: NewsImpactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsImpacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsImpacts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsImpacts.
     */
    distinct?: NewsImpactScalarFieldEnum | NewsImpactScalarFieldEnum[]
  }

  /**
   * NewsImpact findMany
   */
  export type NewsImpactFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    /**
     * Filter, which NewsImpacts to fetch.
     */
    where?: NewsImpactWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsImpacts to fetch.
     */
    orderBy?: NewsImpactOrderByWithRelationInput | NewsImpactOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsImpacts.
     */
    cursor?: NewsImpactWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsImpacts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsImpacts.
     */
    skip?: number
    distinct?: NewsImpactScalarFieldEnum | NewsImpactScalarFieldEnum[]
  }

  /**
   * NewsImpact create
   */
  export type NewsImpactCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsImpact.
     */
    data: XOR<NewsImpactCreateInput, NewsImpactUncheckedCreateInput>
  }

  /**
   * NewsImpact createMany
   */
  export type NewsImpactCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsImpacts.
     */
    data: NewsImpactCreateManyInput | NewsImpactCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsImpact createManyAndReturn
   */
  export type NewsImpactCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * The data used to create many NewsImpacts.
     */
    data: NewsImpactCreateManyInput | NewsImpactCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsImpact update
   */
  export type NewsImpactUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsImpact.
     */
    data: XOR<NewsImpactUpdateInput, NewsImpactUncheckedUpdateInput>
    /**
     * Choose, which NewsImpact to update.
     */
    where: NewsImpactWhereUniqueInput
  }

  /**
   * NewsImpact updateMany
   */
  export type NewsImpactUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsImpacts.
     */
    data: XOR<NewsImpactUpdateManyMutationInput, NewsImpactUncheckedUpdateManyInput>
    /**
     * Filter which NewsImpacts to update
     */
    where?: NewsImpactWhereInput
    /**
     * Limit how many NewsImpacts to update.
     */
    limit?: number
  }

  /**
   * NewsImpact updateManyAndReturn
   */
  export type NewsImpactUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * The data used to update NewsImpacts.
     */
    data: XOR<NewsImpactUpdateManyMutationInput, NewsImpactUncheckedUpdateManyInput>
    /**
     * Filter which NewsImpacts to update
     */
    where?: NewsImpactWhereInput
    /**
     * Limit how many NewsImpacts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsImpact upsert
   */
  export type NewsImpactUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsImpact to update in case it exists.
     */
    where: NewsImpactWhereUniqueInput
    /**
     * In case the NewsImpact found by the `where` argument doesn't exist, create a new NewsImpact with this data.
     */
    create: XOR<NewsImpactCreateInput, NewsImpactUncheckedCreateInput>
    /**
     * In case the NewsImpact was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsImpactUpdateInput, NewsImpactUncheckedUpdateInput>
  }

  /**
   * NewsImpact delete
   */
  export type NewsImpactDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    /**
     * Filter which NewsImpact to delete.
     */
    where: NewsImpactWhereUniqueInput
  }

  /**
   * NewsImpact deleteMany
   */
  export type NewsImpactDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsImpacts to delete
     */
    where?: NewsImpactWhereInput
    /**
     * Limit how many NewsImpacts to delete.
     */
    limit?: number
  }

  /**
   * NewsImpact.backtests
   */
  export type NewsImpact$backtestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    where?: NewsBacktestWhereInput
    orderBy?: NewsBacktestOrderByWithRelationInput | NewsBacktestOrderByWithRelationInput[]
    cursor?: NewsBacktestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NewsBacktestScalarFieldEnum | NewsBacktestScalarFieldEnum[]
  }

  /**
   * NewsImpact without action
   */
  export type NewsImpactDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
  }


  /**
   * Model NewsAuditLog
   */

  export type AggregateNewsAuditLog = {
    _count: NewsAuditLogCountAggregateOutputType | null
    _min: NewsAuditLogMinAggregateOutputType | null
    _max: NewsAuditLogMaxAggregateOutputType | null
  }

  export type NewsAuditLogMinAggregateOutputType = {
    id: string | null
    rawItemId: string | null
    modelId: string | null
    promptVersion: string | null
    mode: string | null
    compliancePassed: boolean | null
    complianceNotes: string | null
    disclaimer: string | null
    timestamp: Date | null
  }

  export type NewsAuditLogMaxAggregateOutputType = {
    id: string | null
    rawItemId: string | null
    modelId: string | null
    promptVersion: string | null
    mode: string | null
    compliancePassed: boolean | null
    complianceNotes: string | null
    disclaimer: string | null
    timestamp: Date | null
  }

  export type NewsAuditLogCountAggregateOutputType = {
    id: number
    rawItemId: number
    inputSnapshot: number
    outputSnapshot: number
    modelId: number
    promptVersion: number
    mode: number
    compliancePassed: number
    complianceNotes: number
    disclaimer: number
    timestamp: number
    _all: number
  }


  export type NewsAuditLogMinAggregateInputType = {
    id?: true
    rawItemId?: true
    modelId?: true
    promptVersion?: true
    mode?: true
    compliancePassed?: true
    complianceNotes?: true
    disclaimer?: true
    timestamp?: true
  }

  export type NewsAuditLogMaxAggregateInputType = {
    id?: true
    rawItemId?: true
    modelId?: true
    promptVersion?: true
    mode?: true
    compliancePassed?: true
    complianceNotes?: true
    disclaimer?: true
    timestamp?: true
  }

  export type NewsAuditLogCountAggregateInputType = {
    id?: true
    rawItemId?: true
    inputSnapshot?: true
    outputSnapshot?: true
    modelId?: true
    promptVersion?: true
    mode?: true
    compliancePassed?: true
    complianceNotes?: true
    disclaimer?: true
    timestamp?: true
    _all?: true
  }

  export type NewsAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsAuditLog to aggregate.
     */
    where?: NewsAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsAuditLogs to fetch.
     */
    orderBy?: NewsAuditLogOrderByWithRelationInput | NewsAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsAuditLogs
    **/
    _count?: true | NewsAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsAuditLogMaxAggregateInputType
  }

  export type GetNewsAuditLogAggregateType<T extends NewsAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsAuditLog[P]>
      : GetScalarType<T[P], AggregateNewsAuditLog[P]>
  }




  export type NewsAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsAuditLogWhereInput
    orderBy?: NewsAuditLogOrderByWithAggregationInput | NewsAuditLogOrderByWithAggregationInput[]
    by: NewsAuditLogScalarFieldEnum[] | NewsAuditLogScalarFieldEnum
    having?: NewsAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsAuditLogCountAggregateInputType | true
    _min?: NewsAuditLogMinAggregateInputType
    _max?: NewsAuditLogMaxAggregateInputType
  }

  export type NewsAuditLogGroupByOutputType = {
    id: string
    rawItemId: string
    inputSnapshot: JsonValue
    outputSnapshot: JsonValue
    modelId: string
    promptVersion: string
    mode: string
    compliancePassed: boolean
    complianceNotes: string | null
    disclaimer: string
    timestamp: Date
    _count: NewsAuditLogCountAggregateOutputType | null
    _min: NewsAuditLogMinAggregateOutputType | null
    _max: NewsAuditLogMaxAggregateOutputType | null
  }

  type GetNewsAuditLogGroupByPayload<T extends NewsAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], NewsAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type NewsAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rawItemId?: boolean
    inputSnapshot?: boolean
    outputSnapshot?: boolean
    modelId?: boolean
    promptVersion?: boolean
    mode?: boolean
    compliancePassed?: boolean
    complianceNotes?: boolean
    disclaimer?: boolean
    timestamp?: boolean
    impact?: boolean | NewsAuditLog$impactArgs<ExtArgs>
  }, ExtArgs["result"]["newsAuditLog"]>

  export type NewsAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rawItemId?: boolean
    inputSnapshot?: boolean
    outputSnapshot?: boolean
    modelId?: boolean
    promptVersion?: boolean
    mode?: boolean
    compliancePassed?: boolean
    complianceNotes?: boolean
    disclaimer?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["newsAuditLog"]>

  export type NewsAuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rawItemId?: boolean
    inputSnapshot?: boolean
    outputSnapshot?: boolean
    modelId?: boolean
    promptVersion?: boolean
    mode?: boolean
    compliancePassed?: boolean
    complianceNotes?: boolean
    disclaimer?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["newsAuditLog"]>

  export type NewsAuditLogSelectScalar = {
    id?: boolean
    rawItemId?: boolean
    inputSnapshot?: boolean
    outputSnapshot?: boolean
    modelId?: boolean
    promptVersion?: boolean
    mode?: boolean
    compliancePassed?: boolean
    complianceNotes?: boolean
    disclaimer?: boolean
    timestamp?: boolean
  }

  export type NewsAuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "rawItemId" | "inputSnapshot" | "outputSnapshot" | "modelId" | "promptVersion" | "mode" | "compliancePassed" | "complianceNotes" | "disclaimer" | "timestamp", ExtArgs["result"]["newsAuditLog"]>
  export type NewsAuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    impact?: boolean | NewsAuditLog$impactArgs<ExtArgs>
  }
  export type NewsAuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type NewsAuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NewsAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsAuditLog"
    objects: {
      impact: Prisma.$NewsImpactPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rawItemId: string
      inputSnapshot: Prisma.JsonValue
      outputSnapshot: Prisma.JsonValue
      modelId: string
      promptVersion: string
      mode: string
      compliancePassed: boolean
      complianceNotes: string | null
      disclaimer: string
      timestamp: Date
    }, ExtArgs["result"]["newsAuditLog"]>
    composites: {}
  }

  type NewsAuditLogGetPayload<S extends boolean | null | undefined | NewsAuditLogDefaultArgs> = $Result.GetResult<Prisma.$NewsAuditLogPayload, S>

  type NewsAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsAuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsAuditLogCountAggregateInputType | true
    }

  export interface NewsAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsAuditLog'], meta: { name: 'NewsAuditLog' } }
    /**
     * Find zero or one NewsAuditLog that matches the filter.
     * @param {NewsAuditLogFindUniqueArgs} args - Arguments to find a NewsAuditLog
     * @example
     * // Get one NewsAuditLog
     * const newsAuditLog = await prisma.newsAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsAuditLogFindUniqueArgs>(args: SelectSubset<T, NewsAuditLogFindUniqueArgs<ExtArgs>>): Prisma__NewsAuditLogClient<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsAuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsAuditLogFindUniqueOrThrowArgs} args - Arguments to find a NewsAuditLog
     * @example
     * // Get one NewsAuditLog
     * const newsAuditLog = await prisma.newsAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsAuditLogClient<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsAuditLogFindFirstArgs} args - Arguments to find a NewsAuditLog
     * @example
     * // Get one NewsAuditLog
     * const newsAuditLog = await prisma.newsAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsAuditLogFindFirstArgs>(args?: SelectSubset<T, NewsAuditLogFindFirstArgs<ExtArgs>>): Prisma__NewsAuditLogClient<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsAuditLogFindFirstOrThrowArgs} args - Arguments to find a NewsAuditLog
     * @example
     * // Get one NewsAuditLog
     * const newsAuditLog = await prisma.newsAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsAuditLogClient<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsAuditLogs
     * const newsAuditLogs = await prisma.newsAuditLog.findMany()
     * 
     * // Get first 10 NewsAuditLogs
     * const newsAuditLogs = await prisma.newsAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsAuditLogWithIdOnly = await prisma.newsAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsAuditLogFindManyArgs>(args?: SelectSubset<T, NewsAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsAuditLog.
     * @param {NewsAuditLogCreateArgs} args - Arguments to create a NewsAuditLog.
     * @example
     * // Create one NewsAuditLog
     * const NewsAuditLog = await prisma.newsAuditLog.create({
     *   data: {
     *     // ... data to create a NewsAuditLog
     *   }
     * })
     * 
     */
    create<T extends NewsAuditLogCreateArgs>(args: SelectSubset<T, NewsAuditLogCreateArgs<ExtArgs>>): Prisma__NewsAuditLogClient<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsAuditLogs.
     * @param {NewsAuditLogCreateManyArgs} args - Arguments to create many NewsAuditLogs.
     * @example
     * // Create many NewsAuditLogs
     * const newsAuditLog = await prisma.newsAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsAuditLogCreateManyArgs>(args?: SelectSubset<T, NewsAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsAuditLogs and returns the data saved in the database.
     * @param {NewsAuditLogCreateManyAndReturnArgs} args - Arguments to create many NewsAuditLogs.
     * @example
     * // Create many NewsAuditLogs
     * const newsAuditLog = await prisma.newsAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsAuditLogs and only return the `id`
     * const newsAuditLogWithIdOnly = await prisma.newsAuditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NewsAuditLog.
     * @param {NewsAuditLogDeleteArgs} args - Arguments to delete one NewsAuditLog.
     * @example
     * // Delete one NewsAuditLog
     * const NewsAuditLog = await prisma.newsAuditLog.delete({
     *   where: {
     *     // ... filter to delete one NewsAuditLog
     *   }
     * })
     * 
     */
    delete<T extends NewsAuditLogDeleteArgs>(args: SelectSubset<T, NewsAuditLogDeleteArgs<ExtArgs>>): Prisma__NewsAuditLogClient<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsAuditLog.
     * @param {NewsAuditLogUpdateArgs} args - Arguments to update one NewsAuditLog.
     * @example
     * // Update one NewsAuditLog
     * const newsAuditLog = await prisma.newsAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsAuditLogUpdateArgs>(args: SelectSubset<T, NewsAuditLogUpdateArgs<ExtArgs>>): Prisma__NewsAuditLogClient<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsAuditLogs.
     * @param {NewsAuditLogDeleteManyArgs} args - Arguments to filter NewsAuditLogs to delete.
     * @example
     * // Delete a few NewsAuditLogs
     * const { count } = await prisma.newsAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsAuditLogDeleteManyArgs>(args?: SelectSubset<T, NewsAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsAuditLogs
     * const newsAuditLog = await prisma.newsAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsAuditLogUpdateManyArgs>(args: SelectSubset<T, NewsAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsAuditLogs and returns the data updated in the database.
     * @param {NewsAuditLogUpdateManyAndReturnArgs} args - Arguments to update many NewsAuditLogs.
     * @example
     * // Update many NewsAuditLogs
     * const newsAuditLog = await prisma.newsAuditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NewsAuditLogs and only return the `id`
     * const newsAuditLogWithIdOnly = await prisma.newsAuditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NewsAuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsAuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NewsAuditLog.
     * @param {NewsAuditLogUpsertArgs} args - Arguments to update or create a NewsAuditLog.
     * @example
     * // Update or create a NewsAuditLog
     * const newsAuditLog = await prisma.newsAuditLog.upsert({
     *   create: {
     *     // ... data to create a NewsAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends NewsAuditLogUpsertArgs>(args: SelectSubset<T, NewsAuditLogUpsertArgs<ExtArgs>>): Prisma__NewsAuditLogClient<$Result.GetResult<Prisma.$NewsAuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsAuditLogCountArgs} args - Arguments to filter NewsAuditLogs to count.
     * @example
     * // Count the number of NewsAuditLogs
     * const count = await prisma.newsAuditLog.count({
     *   where: {
     *     // ... the filter for the NewsAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends NewsAuditLogCountArgs>(
      args?: Subset<T, NewsAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsAuditLogAggregateArgs>(args: Subset<T, NewsAuditLogAggregateArgs>): Prisma.PrismaPromise<GetNewsAuditLogAggregateType<T>>

    /**
     * Group by NewsAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: NewsAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsAuditLog model
   */
  readonly fields: NewsAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    impact<T extends NewsAuditLog$impactArgs<ExtArgs> = {}>(args?: Subset<T, NewsAuditLog$impactArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsAuditLog model
   */
  interface NewsAuditLogFieldRefs {
    readonly id: FieldRef<"NewsAuditLog", 'String'>
    readonly rawItemId: FieldRef<"NewsAuditLog", 'String'>
    readonly inputSnapshot: FieldRef<"NewsAuditLog", 'Json'>
    readonly outputSnapshot: FieldRef<"NewsAuditLog", 'Json'>
    readonly modelId: FieldRef<"NewsAuditLog", 'String'>
    readonly promptVersion: FieldRef<"NewsAuditLog", 'String'>
    readonly mode: FieldRef<"NewsAuditLog", 'String'>
    readonly compliancePassed: FieldRef<"NewsAuditLog", 'Boolean'>
    readonly complianceNotes: FieldRef<"NewsAuditLog", 'String'>
    readonly disclaimer: FieldRef<"NewsAuditLog", 'String'>
    readonly timestamp: FieldRef<"NewsAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsAuditLog findUnique
   */
  export type NewsAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which NewsAuditLog to fetch.
     */
    where: NewsAuditLogWhereUniqueInput
  }

  /**
   * NewsAuditLog findUniqueOrThrow
   */
  export type NewsAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which NewsAuditLog to fetch.
     */
    where: NewsAuditLogWhereUniqueInput
  }

  /**
   * NewsAuditLog findFirst
   */
  export type NewsAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which NewsAuditLog to fetch.
     */
    where?: NewsAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsAuditLogs to fetch.
     */
    orderBy?: NewsAuditLogOrderByWithRelationInput | NewsAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsAuditLogs.
     */
    cursor?: NewsAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsAuditLogs.
     */
    distinct?: NewsAuditLogScalarFieldEnum | NewsAuditLogScalarFieldEnum[]
  }

  /**
   * NewsAuditLog findFirstOrThrow
   */
  export type NewsAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which NewsAuditLog to fetch.
     */
    where?: NewsAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsAuditLogs to fetch.
     */
    orderBy?: NewsAuditLogOrderByWithRelationInput | NewsAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsAuditLogs.
     */
    cursor?: NewsAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsAuditLogs.
     */
    distinct?: NewsAuditLogScalarFieldEnum | NewsAuditLogScalarFieldEnum[]
  }

  /**
   * NewsAuditLog findMany
   */
  export type NewsAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which NewsAuditLogs to fetch.
     */
    where?: NewsAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsAuditLogs to fetch.
     */
    orderBy?: NewsAuditLogOrderByWithRelationInput | NewsAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsAuditLogs.
     */
    cursor?: NewsAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsAuditLogs.
     */
    skip?: number
    distinct?: NewsAuditLogScalarFieldEnum | NewsAuditLogScalarFieldEnum[]
  }

  /**
   * NewsAuditLog create
   */
  export type NewsAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsAuditLog.
     */
    data: XOR<NewsAuditLogCreateInput, NewsAuditLogUncheckedCreateInput>
  }

  /**
   * NewsAuditLog createMany
   */
  export type NewsAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsAuditLogs.
     */
    data: NewsAuditLogCreateManyInput | NewsAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsAuditLog createManyAndReturn
   */
  export type NewsAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many NewsAuditLogs.
     */
    data: NewsAuditLogCreateManyInput | NewsAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsAuditLog update
   */
  export type NewsAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsAuditLog.
     */
    data: XOR<NewsAuditLogUpdateInput, NewsAuditLogUncheckedUpdateInput>
    /**
     * Choose, which NewsAuditLog to update.
     */
    where: NewsAuditLogWhereUniqueInput
  }

  /**
   * NewsAuditLog updateMany
   */
  export type NewsAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsAuditLogs.
     */
    data: XOR<NewsAuditLogUpdateManyMutationInput, NewsAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which NewsAuditLogs to update
     */
    where?: NewsAuditLogWhereInput
    /**
     * Limit how many NewsAuditLogs to update.
     */
    limit?: number
  }

  /**
   * NewsAuditLog updateManyAndReturn
   */
  export type NewsAuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * The data used to update NewsAuditLogs.
     */
    data: XOR<NewsAuditLogUpdateManyMutationInput, NewsAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which NewsAuditLogs to update
     */
    where?: NewsAuditLogWhereInput
    /**
     * Limit how many NewsAuditLogs to update.
     */
    limit?: number
  }

  /**
   * NewsAuditLog upsert
   */
  export type NewsAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsAuditLog to update in case it exists.
     */
    where: NewsAuditLogWhereUniqueInput
    /**
     * In case the NewsAuditLog found by the `where` argument doesn't exist, create a new NewsAuditLog with this data.
     */
    create: XOR<NewsAuditLogCreateInput, NewsAuditLogUncheckedCreateInput>
    /**
     * In case the NewsAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsAuditLogUpdateInput, NewsAuditLogUncheckedUpdateInput>
  }

  /**
   * NewsAuditLog delete
   */
  export type NewsAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
    /**
     * Filter which NewsAuditLog to delete.
     */
    where: NewsAuditLogWhereUniqueInput
  }

  /**
   * NewsAuditLog deleteMany
   */
  export type NewsAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsAuditLogs to delete
     */
    where?: NewsAuditLogWhereInput
    /**
     * Limit how many NewsAuditLogs to delete.
     */
    limit?: number
  }

  /**
   * NewsAuditLog.impact
   */
  export type NewsAuditLog$impactArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsImpact
     */
    select?: NewsImpactSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsImpact
     */
    omit?: NewsImpactOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsImpactInclude<ExtArgs> | null
    where?: NewsImpactWhereInput
  }

  /**
   * NewsAuditLog without action
   */
  export type NewsAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsAuditLog
     */
    select?: NewsAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsAuditLog
     */
    omit?: NewsAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsAuditLogInclude<ExtArgs> | null
  }


  /**
   * Model NewsBacktest
   */

  export type AggregateNewsBacktest = {
    _count: NewsBacktestCountAggregateOutputType | null
    _avg: NewsBacktestAvgAggregateOutputType | null
    _sum: NewsBacktestSumAggregateOutputType | null
    _min: NewsBacktestMinAggregateOutputType | null
    _max: NewsBacktestMaxAggregateOutputType | null
  }

  export type NewsBacktestAvgAggregateOutputType = {
    session1Return: number | null
    session3Return: number | null
    session5Return: number | null
  }

  export type NewsBacktestSumAggregateOutputType = {
    session1Return: number | null
    session3Return: number | null
    session5Return: number | null
  }

  export type NewsBacktestMinAggregateOutputType = {
    id: string | null
    impactId: string | null
    sector: string | null
    taggedDirection: string | null
    session1Return: number | null
    session3Return: number | null
    session5Return: number | null
    directionMatch1: boolean | null
    directionMatch3: boolean | null
    directionMatch5: boolean | null
    measuredAt: Date | null
    createdAt: Date | null
  }

  export type NewsBacktestMaxAggregateOutputType = {
    id: string | null
    impactId: string | null
    sector: string | null
    taggedDirection: string | null
    session1Return: number | null
    session3Return: number | null
    session5Return: number | null
    directionMatch1: boolean | null
    directionMatch3: boolean | null
    directionMatch5: boolean | null
    measuredAt: Date | null
    createdAt: Date | null
  }

  export type NewsBacktestCountAggregateOutputType = {
    id: number
    impactId: number
    sector: number
    taggedDirection: number
    session1Return: number
    session3Return: number
    session5Return: number
    directionMatch1: number
    directionMatch3: number
    directionMatch5: number
    measuredAt: number
    createdAt: number
    _all: number
  }


  export type NewsBacktestAvgAggregateInputType = {
    session1Return?: true
    session3Return?: true
    session5Return?: true
  }

  export type NewsBacktestSumAggregateInputType = {
    session1Return?: true
    session3Return?: true
    session5Return?: true
  }

  export type NewsBacktestMinAggregateInputType = {
    id?: true
    impactId?: true
    sector?: true
    taggedDirection?: true
    session1Return?: true
    session3Return?: true
    session5Return?: true
    directionMatch1?: true
    directionMatch3?: true
    directionMatch5?: true
    measuredAt?: true
    createdAt?: true
  }

  export type NewsBacktestMaxAggregateInputType = {
    id?: true
    impactId?: true
    sector?: true
    taggedDirection?: true
    session1Return?: true
    session3Return?: true
    session5Return?: true
    directionMatch1?: true
    directionMatch3?: true
    directionMatch5?: true
    measuredAt?: true
    createdAt?: true
  }

  export type NewsBacktestCountAggregateInputType = {
    id?: true
    impactId?: true
    sector?: true
    taggedDirection?: true
    session1Return?: true
    session3Return?: true
    session5Return?: true
    directionMatch1?: true
    directionMatch3?: true
    directionMatch5?: true
    measuredAt?: true
    createdAt?: true
    _all?: true
  }

  export type NewsBacktestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsBacktest to aggregate.
     */
    where?: NewsBacktestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsBacktests to fetch.
     */
    orderBy?: NewsBacktestOrderByWithRelationInput | NewsBacktestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsBacktestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsBacktests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsBacktests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsBacktests
    **/
    _count?: true | NewsBacktestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewsBacktestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewsBacktestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsBacktestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsBacktestMaxAggregateInputType
  }

  export type GetNewsBacktestAggregateType<T extends NewsBacktestAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsBacktest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsBacktest[P]>
      : GetScalarType<T[P], AggregateNewsBacktest[P]>
  }




  export type NewsBacktestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsBacktestWhereInput
    orderBy?: NewsBacktestOrderByWithAggregationInput | NewsBacktestOrderByWithAggregationInput[]
    by: NewsBacktestScalarFieldEnum[] | NewsBacktestScalarFieldEnum
    having?: NewsBacktestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsBacktestCountAggregateInputType | true
    _avg?: NewsBacktestAvgAggregateInputType
    _sum?: NewsBacktestSumAggregateInputType
    _min?: NewsBacktestMinAggregateInputType
    _max?: NewsBacktestMaxAggregateInputType
  }

  export type NewsBacktestGroupByOutputType = {
    id: string
    impactId: string
    sector: string
    taggedDirection: string
    session1Return: number | null
    session3Return: number | null
    session5Return: number | null
    directionMatch1: boolean | null
    directionMatch3: boolean | null
    directionMatch5: boolean | null
    measuredAt: Date | null
    createdAt: Date
    _count: NewsBacktestCountAggregateOutputType | null
    _avg: NewsBacktestAvgAggregateOutputType | null
    _sum: NewsBacktestSumAggregateOutputType | null
    _min: NewsBacktestMinAggregateOutputType | null
    _max: NewsBacktestMaxAggregateOutputType | null
  }

  type GetNewsBacktestGroupByPayload<T extends NewsBacktestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsBacktestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsBacktestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsBacktestGroupByOutputType[P]>
            : GetScalarType<T[P], NewsBacktestGroupByOutputType[P]>
        }
      >
    >


  export type NewsBacktestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    impactId?: boolean
    sector?: boolean
    taggedDirection?: boolean
    session1Return?: boolean
    session3Return?: boolean
    session5Return?: boolean
    directionMatch1?: boolean
    directionMatch3?: boolean
    directionMatch5?: boolean
    measuredAt?: boolean
    createdAt?: boolean
    impact?: boolean | NewsImpactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsBacktest"]>

  export type NewsBacktestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    impactId?: boolean
    sector?: boolean
    taggedDirection?: boolean
    session1Return?: boolean
    session3Return?: boolean
    session5Return?: boolean
    directionMatch1?: boolean
    directionMatch3?: boolean
    directionMatch5?: boolean
    measuredAt?: boolean
    createdAt?: boolean
    impact?: boolean | NewsImpactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsBacktest"]>

  export type NewsBacktestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    impactId?: boolean
    sector?: boolean
    taggedDirection?: boolean
    session1Return?: boolean
    session3Return?: boolean
    session5Return?: boolean
    directionMatch1?: boolean
    directionMatch3?: boolean
    directionMatch5?: boolean
    measuredAt?: boolean
    createdAt?: boolean
    impact?: boolean | NewsImpactDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsBacktest"]>

  export type NewsBacktestSelectScalar = {
    id?: boolean
    impactId?: boolean
    sector?: boolean
    taggedDirection?: boolean
    session1Return?: boolean
    session3Return?: boolean
    session5Return?: boolean
    directionMatch1?: boolean
    directionMatch3?: boolean
    directionMatch5?: boolean
    measuredAt?: boolean
    createdAt?: boolean
  }

  export type NewsBacktestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "impactId" | "sector" | "taggedDirection" | "session1Return" | "session3Return" | "session5Return" | "directionMatch1" | "directionMatch3" | "directionMatch5" | "measuredAt" | "createdAt", ExtArgs["result"]["newsBacktest"]>
  export type NewsBacktestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    impact?: boolean | NewsImpactDefaultArgs<ExtArgs>
  }
  export type NewsBacktestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    impact?: boolean | NewsImpactDefaultArgs<ExtArgs>
  }
  export type NewsBacktestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    impact?: boolean | NewsImpactDefaultArgs<ExtArgs>
  }

  export type $NewsBacktestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsBacktest"
    objects: {
      impact: Prisma.$NewsImpactPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      impactId: string
      sector: string
      taggedDirection: string
      session1Return: number | null
      session3Return: number | null
      session5Return: number | null
      directionMatch1: boolean | null
      directionMatch3: boolean | null
      directionMatch5: boolean | null
      measuredAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["newsBacktest"]>
    composites: {}
  }

  type NewsBacktestGetPayload<S extends boolean | null | undefined | NewsBacktestDefaultArgs> = $Result.GetResult<Prisma.$NewsBacktestPayload, S>

  type NewsBacktestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsBacktestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsBacktestCountAggregateInputType | true
    }

  export interface NewsBacktestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsBacktest'], meta: { name: 'NewsBacktest' } }
    /**
     * Find zero or one NewsBacktest that matches the filter.
     * @param {NewsBacktestFindUniqueArgs} args - Arguments to find a NewsBacktest
     * @example
     * // Get one NewsBacktest
     * const newsBacktest = await prisma.newsBacktest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsBacktestFindUniqueArgs>(args: SelectSubset<T, NewsBacktestFindUniqueArgs<ExtArgs>>): Prisma__NewsBacktestClient<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsBacktest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsBacktestFindUniqueOrThrowArgs} args - Arguments to find a NewsBacktest
     * @example
     * // Get one NewsBacktest
     * const newsBacktest = await prisma.newsBacktest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsBacktestFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsBacktestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsBacktestClient<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsBacktest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBacktestFindFirstArgs} args - Arguments to find a NewsBacktest
     * @example
     * // Get one NewsBacktest
     * const newsBacktest = await prisma.newsBacktest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsBacktestFindFirstArgs>(args?: SelectSubset<T, NewsBacktestFindFirstArgs<ExtArgs>>): Prisma__NewsBacktestClient<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsBacktest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBacktestFindFirstOrThrowArgs} args - Arguments to find a NewsBacktest
     * @example
     * // Get one NewsBacktest
     * const newsBacktest = await prisma.newsBacktest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsBacktestFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsBacktestFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsBacktestClient<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsBacktests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBacktestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsBacktests
     * const newsBacktests = await prisma.newsBacktest.findMany()
     * 
     * // Get first 10 NewsBacktests
     * const newsBacktests = await prisma.newsBacktest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsBacktestWithIdOnly = await prisma.newsBacktest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsBacktestFindManyArgs>(args?: SelectSubset<T, NewsBacktestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsBacktest.
     * @param {NewsBacktestCreateArgs} args - Arguments to create a NewsBacktest.
     * @example
     * // Create one NewsBacktest
     * const NewsBacktest = await prisma.newsBacktest.create({
     *   data: {
     *     // ... data to create a NewsBacktest
     *   }
     * })
     * 
     */
    create<T extends NewsBacktestCreateArgs>(args: SelectSubset<T, NewsBacktestCreateArgs<ExtArgs>>): Prisma__NewsBacktestClient<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsBacktests.
     * @param {NewsBacktestCreateManyArgs} args - Arguments to create many NewsBacktests.
     * @example
     * // Create many NewsBacktests
     * const newsBacktest = await prisma.newsBacktest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsBacktestCreateManyArgs>(args?: SelectSubset<T, NewsBacktestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsBacktests and returns the data saved in the database.
     * @param {NewsBacktestCreateManyAndReturnArgs} args - Arguments to create many NewsBacktests.
     * @example
     * // Create many NewsBacktests
     * const newsBacktest = await prisma.newsBacktest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsBacktests and only return the `id`
     * const newsBacktestWithIdOnly = await prisma.newsBacktest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsBacktestCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsBacktestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NewsBacktest.
     * @param {NewsBacktestDeleteArgs} args - Arguments to delete one NewsBacktest.
     * @example
     * // Delete one NewsBacktest
     * const NewsBacktest = await prisma.newsBacktest.delete({
     *   where: {
     *     // ... filter to delete one NewsBacktest
     *   }
     * })
     * 
     */
    delete<T extends NewsBacktestDeleteArgs>(args: SelectSubset<T, NewsBacktestDeleteArgs<ExtArgs>>): Prisma__NewsBacktestClient<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsBacktest.
     * @param {NewsBacktestUpdateArgs} args - Arguments to update one NewsBacktest.
     * @example
     * // Update one NewsBacktest
     * const newsBacktest = await prisma.newsBacktest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsBacktestUpdateArgs>(args: SelectSubset<T, NewsBacktestUpdateArgs<ExtArgs>>): Prisma__NewsBacktestClient<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsBacktests.
     * @param {NewsBacktestDeleteManyArgs} args - Arguments to filter NewsBacktests to delete.
     * @example
     * // Delete a few NewsBacktests
     * const { count } = await prisma.newsBacktest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsBacktestDeleteManyArgs>(args?: SelectSubset<T, NewsBacktestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsBacktests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBacktestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsBacktests
     * const newsBacktest = await prisma.newsBacktest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsBacktestUpdateManyArgs>(args: SelectSubset<T, NewsBacktestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsBacktests and returns the data updated in the database.
     * @param {NewsBacktestUpdateManyAndReturnArgs} args - Arguments to update many NewsBacktests.
     * @example
     * // Update many NewsBacktests
     * const newsBacktest = await prisma.newsBacktest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NewsBacktests and only return the `id`
     * const newsBacktestWithIdOnly = await prisma.newsBacktest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NewsBacktestUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsBacktestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NewsBacktest.
     * @param {NewsBacktestUpsertArgs} args - Arguments to update or create a NewsBacktest.
     * @example
     * // Update or create a NewsBacktest
     * const newsBacktest = await prisma.newsBacktest.upsert({
     *   create: {
     *     // ... data to create a NewsBacktest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsBacktest we want to update
     *   }
     * })
     */
    upsert<T extends NewsBacktestUpsertArgs>(args: SelectSubset<T, NewsBacktestUpsertArgs<ExtArgs>>): Prisma__NewsBacktestClient<$Result.GetResult<Prisma.$NewsBacktestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsBacktests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBacktestCountArgs} args - Arguments to filter NewsBacktests to count.
     * @example
     * // Count the number of NewsBacktests
     * const count = await prisma.newsBacktest.count({
     *   where: {
     *     // ... the filter for the NewsBacktests we want to count
     *   }
     * })
    **/
    count<T extends NewsBacktestCountArgs>(
      args?: Subset<T, NewsBacktestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsBacktestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsBacktest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBacktestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsBacktestAggregateArgs>(args: Subset<T, NewsBacktestAggregateArgs>): Prisma.PrismaPromise<GetNewsBacktestAggregateType<T>>

    /**
     * Group by NewsBacktest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBacktestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsBacktestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsBacktestGroupByArgs['orderBy'] }
        : { orderBy?: NewsBacktestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsBacktestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsBacktestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsBacktest model
   */
  readonly fields: NewsBacktestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsBacktest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsBacktestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    impact<T extends NewsImpactDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NewsImpactDefaultArgs<ExtArgs>>): Prisma__NewsImpactClient<$Result.GetResult<Prisma.$NewsImpactPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsBacktest model
   */
  interface NewsBacktestFieldRefs {
    readonly id: FieldRef<"NewsBacktest", 'String'>
    readonly impactId: FieldRef<"NewsBacktest", 'String'>
    readonly sector: FieldRef<"NewsBacktest", 'String'>
    readonly taggedDirection: FieldRef<"NewsBacktest", 'String'>
    readonly session1Return: FieldRef<"NewsBacktest", 'Float'>
    readonly session3Return: FieldRef<"NewsBacktest", 'Float'>
    readonly session5Return: FieldRef<"NewsBacktest", 'Float'>
    readonly directionMatch1: FieldRef<"NewsBacktest", 'Boolean'>
    readonly directionMatch3: FieldRef<"NewsBacktest", 'Boolean'>
    readonly directionMatch5: FieldRef<"NewsBacktest", 'Boolean'>
    readonly measuredAt: FieldRef<"NewsBacktest", 'DateTime'>
    readonly createdAt: FieldRef<"NewsBacktest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsBacktest findUnique
   */
  export type NewsBacktestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    /**
     * Filter, which NewsBacktest to fetch.
     */
    where: NewsBacktestWhereUniqueInput
  }

  /**
   * NewsBacktest findUniqueOrThrow
   */
  export type NewsBacktestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    /**
     * Filter, which NewsBacktest to fetch.
     */
    where: NewsBacktestWhereUniqueInput
  }

  /**
   * NewsBacktest findFirst
   */
  export type NewsBacktestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    /**
     * Filter, which NewsBacktest to fetch.
     */
    where?: NewsBacktestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsBacktests to fetch.
     */
    orderBy?: NewsBacktestOrderByWithRelationInput | NewsBacktestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsBacktests.
     */
    cursor?: NewsBacktestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsBacktests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsBacktests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsBacktests.
     */
    distinct?: NewsBacktestScalarFieldEnum | NewsBacktestScalarFieldEnum[]
  }

  /**
   * NewsBacktest findFirstOrThrow
   */
  export type NewsBacktestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    /**
     * Filter, which NewsBacktest to fetch.
     */
    where?: NewsBacktestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsBacktests to fetch.
     */
    orderBy?: NewsBacktestOrderByWithRelationInput | NewsBacktestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsBacktests.
     */
    cursor?: NewsBacktestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsBacktests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsBacktests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsBacktests.
     */
    distinct?: NewsBacktestScalarFieldEnum | NewsBacktestScalarFieldEnum[]
  }

  /**
   * NewsBacktest findMany
   */
  export type NewsBacktestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    /**
     * Filter, which NewsBacktests to fetch.
     */
    where?: NewsBacktestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsBacktests to fetch.
     */
    orderBy?: NewsBacktestOrderByWithRelationInput | NewsBacktestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsBacktests.
     */
    cursor?: NewsBacktestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsBacktests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsBacktests.
     */
    skip?: number
    distinct?: NewsBacktestScalarFieldEnum | NewsBacktestScalarFieldEnum[]
  }

  /**
   * NewsBacktest create
   */
  export type NewsBacktestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsBacktest.
     */
    data: XOR<NewsBacktestCreateInput, NewsBacktestUncheckedCreateInput>
  }

  /**
   * NewsBacktest createMany
   */
  export type NewsBacktestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsBacktests.
     */
    data: NewsBacktestCreateManyInput | NewsBacktestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsBacktest createManyAndReturn
   */
  export type NewsBacktestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * The data used to create many NewsBacktests.
     */
    data: NewsBacktestCreateManyInput | NewsBacktestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsBacktest update
   */
  export type NewsBacktestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsBacktest.
     */
    data: XOR<NewsBacktestUpdateInput, NewsBacktestUncheckedUpdateInput>
    /**
     * Choose, which NewsBacktest to update.
     */
    where: NewsBacktestWhereUniqueInput
  }

  /**
   * NewsBacktest updateMany
   */
  export type NewsBacktestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsBacktests.
     */
    data: XOR<NewsBacktestUpdateManyMutationInput, NewsBacktestUncheckedUpdateManyInput>
    /**
     * Filter which NewsBacktests to update
     */
    where?: NewsBacktestWhereInput
    /**
     * Limit how many NewsBacktests to update.
     */
    limit?: number
  }

  /**
   * NewsBacktest updateManyAndReturn
   */
  export type NewsBacktestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * The data used to update NewsBacktests.
     */
    data: XOR<NewsBacktestUpdateManyMutationInput, NewsBacktestUncheckedUpdateManyInput>
    /**
     * Filter which NewsBacktests to update
     */
    where?: NewsBacktestWhereInput
    /**
     * Limit how many NewsBacktests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsBacktest upsert
   */
  export type NewsBacktestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsBacktest to update in case it exists.
     */
    where: NewsBacktestWhereUniqueInput
    /**
     * In case the NewsBacktest found by the `where` argument doesn't exist, create a new NewsBacktest with this data.
     */
    create: XOR<NewsBacktestCreateInput, NewsBacktestUncheckedCreateInput>
    /**
     * In case the NewsBacktest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsBacktestUpdateInput, NewsBacktestUncheckedUpdateInput>
  }

  /**
   * NewsBacktest delete
   */
  export type NewsBacktestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
    /**
     * Filter which NewsBacktest to delete.
     */
    where: NewsBacktestWhereUniqueInput
  }

  /**
   * NewsBacktest deleteMany
   */
  export type NewsBacktestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsBacktests to delete
     */
    where?: NewsBacktestWhereInput
    /**
     * Limit how many NewsBacktests to delete.
     */
    limit?: number
  }

  /**
   * NewsBacktest without action
   */
  export type NewsBacktestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBacktest
     */
    select?: NewsBacktestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBacktest
     */
    omit?: NewsBacktestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBacktestInclude<ExtArgs> | null
  }


  /**
   * Model NewsDigest
   */

  export type AggregateNewsDigest = {
    _count: NewsDigestCountAggregateOutputType | null
    _avg: NewsDigestAvgAggregateOutputType | null
    _sum: NewsDigestSumAggregateOutputType | null
    _min: NewsDigestMinAggregateOutputType | null
    _max: NewsDigestMaxAggregateOutputType | null
  }

  export type NewsDigestAvgAggregateOutputType = {
    itemCount: number | null
  }

  export type NewsDigestSumAggregateOutputType = {
    itemCount: number | null
  }

  export type NewsDigestMinAggregateOutputType = {
    id: string | null
    type: string | null
    date: Date | null
    itemCount: number | null
    createdAt: Date | null
  }

  export type NewsDigestMaxAggregateOutputType = {
    id: string | null
    type: string | null
    date: Date | null
    itemCount: number | null
    createdAt: Date | null
  }

  export type NewsDigestCountAggregateOutputType = {
    id: number
    type: number
    date: number
    content: number
    itemCount: number
    createdAt: number
    _all: number
  }


  export type NewsDigestAvgAggregateInputType = {
    itemCount?: true
  }

  export type NewsDigestSumAggregateInputType = {
    itemCount?: true
  }

  export type NewsDigestMinAggregateInputType = {
    id?: true
    type?: true
    date?: true
    itemCount?: true
    createdAt?: true
  }

  export type NewsDigestMaxAggregateInputType = {
    id?: true
    type?: true
    date?: true
    itemCount?: true
    createdAt?: true
  }

  export type NewsDigestCountAggregateInputType = {
    id?: true
    type?: true
    date?: true
    content?: true
    itemCount?: true
    createdAt?: true
    _all?: true
  }

  export type NewsDigestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsDigest to aggregate.
     */
    where?: NewsDigestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsDigests to fetch.
     */
    orderBy?: NewsDigestOrderByWithRelationInput | NewsDigestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsDigestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsDigests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsDigests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsDigests
    **/
    _count?: true | NewsDigestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NewsDigestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NewsDigestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsDigestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsDigestMaxAggregateInputType
  }

  export type GetNewsDigestAggregateType<T extends NewsDigestAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsDigest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsDigest[P]>
      : GetScalarType<T[P], AggregateNewsDigest[P]>
  }




  export type NewsDigestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsDigestWhereInput
    orderBy?: NewsDigestOrderByWithAggregationInput | NewsDigestOrderByWithAggregationInput[]
    by: NewsDigestScalarFieldEnum[] | NewsDigestScalarFieldEnum
    having?: NewsDigestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsDigestCountAggregateInputType | true
    _avg?: NewsDigestAvgAggregateInputType
    _sum?: NewsDigestSumAggregateInputType
    _min?: NewsDigestMinAggregateInputType
    _max?: NewsDigestMaxAggregateInputType
  }

  export type NewsDigestGroupByOutputType = {
    id: string
    type: string
    date: Date
    content: JsonValue
    itemCount: number
    createdAt: Date
    _count: NewsDigestCountAggregateOutputType | null
    _avg: NewsDigestAvgAggregateOutputType | null
    _sum: NewsDigestSumAggregateOutputType | null
    _min: NewsDigestMinAggregateOutputType | null
    _max: NewsDigestMaxAggregateOutputType | null
  }

  type GetNewsDigestGroupByPayload<T extends NewsDigestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsDigestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsDigestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsDigestGroupByOutputType[P]>
            : GetScalarType<T[P], NewsDigestGroupByOutputType[P]>
        }
      >
    >


  export type NewsDigestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    date?: boolean
    content?: boolean
    itemCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["newsDigest"]>

  export type NewsDigestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    date?: boolean
    content?: boolean
    itemCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["newsDigest"]>

  export type NewsDigestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    date?: boolean
    content?: boolean
    itemCount?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["newsDigest"]>

  export type NewsDigestSelectScalar = {
    id?: boolean
    type?: boolean
    date?: boolean
    content?: boolean
    itemCount?: boolean
    createdAt?: boolean
  }

  export type NewsDigestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "date" | "content" | "itemCount" | "createdAt", ExtArgs["result"]["newsDigest"]>

  export type $NewsDigestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsDigest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      date: Date
      content: Prisma.JsonValue
      itemCount: number
      createdAt: Date
    }, ExtArgs["result"]["newsDigest"]>
    composites: {}
  }

  type NewsDigestGetPayload<S extends boolean | null | undefined | NewsDigestDefaultArgs> = $Result.GetResult<Prisma.$NewsDigestPayload, S>

  type NewsDigestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsDigestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsDigestCountAggregateInputType | true
    }

  export interface NewsDigestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsDigest'], meta: { name: 'NewsDigest' } }
    /**
     * Find zero or one NewsDigest that matches the filter.
     * @param {NewsDigestFindUniqueArgs} args - Arguments to find a NewsDigest
     * @example
     * // Get one NewsDigest
     * const newsDigest = await prisma.newsDigest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsDigestFindUniqueArgs>(args: SelectSubset<T, NewsDigestFindUniqueArgs<ExtArgs>>): Prisma__NewsDigestClient<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsDigest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsDigestFindUniqueOrThrowArgs} args - Arguments to find a NewsDigest
     * @example
     * // Get one NewsDigest
     * const newsDigest = await prisma.newsDigest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsDigestFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsDigestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsDigestClient<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsDigest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsDigestFindFirstArgs} args - Arguments to find a NewsDigest
     * @example
     * // Get one NewsDigest
     * const newsDigest = await prisma.newsDigest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsDigestFindFirstArgs>(args?: SelectSubset<T, NewsDigestFindFirstArgs<ExtArgs>>): Prisma__NewsDigestClient<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsDigest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsDigestFindFirstOrThrowArgs} args - Arguments to find a NewsDigest
     * @example
     * // Get one NewsDigest
     * const newsDigest = await prisma.newsDigest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsDigestFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsDigestFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsDigestClient<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsDigests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsDigestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsDigests
     * const newsDigests = await prisma.newsDigest.findMany()
     * 
     * // Get first 10 NewsDigests
     * const newsDigests = await prisma.newsDigest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsDigestWithIdOnly = await prisma.newsDigest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsDigestFindManyArgs>(args?: SelectSubset<T, NewsDigestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsDigest.
     * @param {NewsDigestCreateArgs} args - Arguments to create a NewsDigest.
     * @example
     * // Create one NewsDigest
     * const NewsDigest = await prisma.newsDigest.create({
     *   data: {
     *     // ... data to create a NewsDigest
     *   }
     * })
     * 
     */
    create<T extends NewsDigestCreateArgs>(args: SelectSubset<T, NewsDigestCreateArgs<ExtArgs>>): Prisma__NewsDigestClient<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsDigests.
     * @param {NewsDigestCreateManyArgs} args - Arguments to create many NewsDigests.
     * @example
     * // Create many NewsDigests
     * const newsDigest = await prisma.newsDigest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsDigestCreateManyArgs>(args?: SelectSubset<T, NewsDigestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsDigests and returns the data saved in the database.
     * @param {NewsDigestCreateManyAndReturnArgs} args - Arguments to create many NewsDigests.
     * @example
     * // Create many NewsDigests
     * const newsDigest = await prisma.newsDigest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsDigests and only return the `id`
     * const newsDigestWithIdOnly = await prisma.newsDigest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsDigestCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsDigestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NewsDigest.
     * @param {NewsDigestDeleteArgs} args - Arguments to delete one NewsDigest.
     * @example
     * // Delete one NewsDigest
     * const NewsDigest = await prisma.newsDigest.delete({
     *   where: {
     *     // ... filter to delete one NewsDigest
     *   }
     * })
     * 
     */
    delete<T extends NewsDigestDeleteArgs>(args: SelectSubset<T, NewsDigestDeleteArgs<ExtArgs>>): Prisma__NewsDigestClient<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsDigest.
     * @param {NewsDigestUpdateArgs} args - Arguments to update one NewsDigest.
     * @example
     * // Update one NewsDigest
     * const newsDigest = await prisma.newsDigest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsDigestUpdateArgs>(args: SelectSubset<T, NewsDigestUpdateArgs<ExtArgs>>): Prisma__NewsDigestClient<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsDigests.
     * @param {NewsDigestDeleteManyArgs} args - Arguments to filter NewsDigests to delete.
     * @example
     * // Delete a few NewsDigests
     * const { count } = await prisma.newsDigest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsDigestDeleteManyArgs>(args?: SelectSubset<T, NewsDigestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsDigests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsDigestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsDigests
     * const newsDigest = await prisma.newsDigest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsDigestUpdateManyArgs>(args: SelectSubset<T, NewsDigestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsDigests and returns the data updated in the database.
     * @param {NewsDigestUpdateManyAndReturnArgs} args - Arguments to update many NewsDigests.
     * @example
     * // Update many NewsDigests
     * const newsDigest = await prisma.newsDigest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NewsDigests and only return the `id`
     * const newsDigestWithIdOnly = await prisma.newsDigest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NewsDigestUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsDigestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NewsDigest.
     * @param {NewsDigestUpsertArgs} args - Arguments to update or create a NewsDigest.
     * @example
     * // Update or create a NewsDigest
     * const newsDigest = await prisma.newsDigest.upsert({
     *   create: {
     *     // ... data to create a NewsDigest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsDigest we want to update
     *   }
     * })
     */
    upsert<T extends NewsDigestUpsertArgs>(args: SelectSubset<T, NewsDigestUpsertArgs<ExtArgs>>): Prisma__NewsDigestClient<$Result.GetResult<Prisma.$NewsDigestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsDigests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsDigestCountArgs} args - Arguments to filter NewsDigests to count.
     * @example
     * // Count the number of NewsDigests
     * const count = await prisma.newsDigest.count({
     *   where: {
     *     // ... the filter for the NewsDigests we want to count
     *   }
     * })
    **/
    count<T extends NewsDigestCountArgs>(
      args?: Subset<T, NewsDigestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsDigestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsDigest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsDigestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsDigestAggregateArgs>(args: Subset<T, NewsDigestAggregateArgs>): Prisma.PrismaPromise<GetNewsDigestAggregateType<T>>

    /**
     * Group by NewsDigest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsDigestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsDigestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsDigestGroupByArgs['orderBy'] }
        : { orderBy?: NewsDigestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsDigestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsDigestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsDigest model
   */
  readonly fields: NewsDigestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsDigest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsDigestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsDigest model
   */
  interface NewsDigestFieldRefs {
    readonly id: FieldRef<"NewsDigest", 'String'>
    readonly type: FieldRef<"NewsDigest", 'String'>
    readonly date: FieldRef<"NewsDigest", 'DateTime'>
    readonly content: FieldRef<"NewsDigest", 'Json'>
    readonly itemCount: FieldRef<"NewsDigest", 'Int'>
    readonly createdAt: FieldRef<"NewsDigest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsDigest findUnique
   */
  export type NewsDigestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * Filter, which NewsDigest to fetch.
     */
    where: NewsDigestWhereUniqueInput
  }

  /**
   * NewsDigest findUniqueOrThrow
   */
  export type NewsDigestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * Filter, which NewsDigest to fetch.
     */
    where: NewsDigestWhereUniqueInput
  }

  /**
   * NewsDigest findFirst
   */
  export type NewsDigestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * Filter, which NewsDigest to fetch.
     */
    where?: NewsDigestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsDigests to fetch.
     */
    orderBy?: NewsDigestOrderByWithRelationInput | NewsDigestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsDigests.
     */
    cursor?: NewsDigestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsDigests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsDigests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsDigests.
     */
    distinct?: NewsDigestScalarFieldEnum | NewsDigestScalarFieldEnum[]
  }

  /**
   * NewsDigest findFirstOrThrow
   */
  export type NewsDigestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * Filter, which NewsDigest to fetch.
     */
    where?: NewsDigestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsDigests to fetch.
     */
    orderBy?: NewsDigestOrderByWithRelationInput | NewsDigestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsDigests.
     */
    cursor?: NewsDigestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsDigests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsDigests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsDigests.
     */
    distinct?: NewsDigestScalarFieldEnum | NewsDigestScalarFieldEnum[]
  }

  /**
   * NewsDigest findMany
   */
  export type NewsDigestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * Filter, which NewsDigests to fetch.
     */
    where?: NewsDigestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsDigests to fetch.
     */
    orderBy?: NewsDigestOrderByWithRelationInput | NewsDigestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsDigests.
     */
    cursor?: NewsDigestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsDigests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsDigests.
     */
    skip?: number
    distinct?: NewsDigestScalarFieldEnum | NewsDigestScalarFieldEnum[]
  }

  /**
   * NewsDigest create
   */
  export type NewsDigestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * The data needed to create a NewsDigest.
     */
    data: XOR<NewsDigestCreateInput, NewsDigestUncheckedCreateInput>
  }

  /**
   * NewsDigest createMany
   */
  export type NewsDigestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsDigests.
     */
    data: NewsDigestCreateManyInput | NewsDigestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsDigest createManyAndReturn
   */
  export type NewsDigestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * The data used to create many NewsDigests.
     */
    data: NewsDigestCreateManyInput | NewsDigestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsDigest update
   */
  export type NewsDigestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * The data needed to update a NewsDigest.
     */
    data: XOR<NewsDigestUpdateInput, NewsDigestUncheckedUpdateInput>
    /**
     * Choose, which NewsDigest to update.
     */
    where: NewsDigestWhereUniqueInput
  }

  /**
   * NewsDigest updateMany
   */
  export type NewsDigestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsDigests.
     */
    data: XOR<NewsDigestUpdateManyMutationInput, NewsDigestUncheckedUpdateManyInput>
    /**
     * Filter which NewsDigests to update
     */
    where?: NewsDigestWhereInput
    /**
     * Limit how many NewsDigests to update.
     */
    limit?: number
  }

  /**
   * NewsDigest updateManyAndReturn
   */
  export type NewsDigestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * The data used to update NewsDigests.
     */
    data: XOR<NewsDigestUpdateManyMutationInput, NewsDigestUncheckedUpdateManyInput>
    /**
     * Filter which NewsDigests to update
     */
    where?: NewsDigestWhereInput
    /**
     * Limit how many NewsDigests to update.
     */
    limit?: number
  }

  /**
   * NewsDigest upsert
   */
  export type NewsDigestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * The filter to search for the NewsDigest to update in case it exists.
     */
    where: NewsDigestWhereUniqueInput
    /**
     * In case the NewsDigest found by the `where` argument doesn't exist, create a new NewsDigest with this data.
     */
    create: XOR<NewsDigestCreateInput, NewsDigestUncheckedCreateInput>
    /**
     * In case the NewsDigest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsDigestUpdateInput, NewsDigestUncheckedUpdateInput>
  }

  /**
   * NewsDigest delete
   */
  export type NewsDigestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
    /**
     * Filter which NewsDigest to delete.
     */
    where: NewsDigestWhereUniqueInput
  }

  /**
   * NewsDigest deleteMany
   */
  export type NewsDigestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsDigests to delete
     */
    where?: NewsDigestWhereInput
    /**
     * Limit how many NewsDigests to delete.
     */
    limit?: number
  }

  /**
   * NewsDigest without action
   */
  export type NewsDigestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsDigest
     */
    select?: NewsDigestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsDigest
     */
    omit?: NewsDigestOmit<ExtArgs> | null
  }


  /**
   * Model PipelineMetric
   */

  export type AggregatePipelineMetric = {
    _count: PipelineMetricCountAggregateOutputType | null
    _avg: PipelineMetricAvgAggregateOutputType | null
    _sum: PipelineMetricSumAggregateOutputType | null
    _min: PipelineMetricMinAggregateOutputType | null
    _max: PipelineMetricMaxAggregateOutputType | null
  }

  export type PipelineMetricAvgAggregateOutputType = {
    value: number | null
  }

  export type PipelineMetricSumAggregateOutputType = {
    value: number | null
  }

  export type PipelineMetricMinAggregateOutputType = {
    id: string | null
    metricName: string | null
    value: number | null
    source: string | null
    recordedAt: Date | null
  }

  export type PipelineMetricMaxAggregateOutputType = {
    id: string | null
    metricName: string | null
    value: number | null
    source: string | null
    recordedAt: Date | null
  }

  export type PipelineMetricCountAggregateOutputType = {
    id: number
    metricName: number
    value: number
    source: number
    tags: number
    recordedAt: number
    _all: number
  }


  export type PipelineMetricAvgAggregateInputType = {
    value?: true
  }

  export type PipelineMetricSumAggregateInputType = {
    value?: true
  }

  export type PipelineMetricMinAggregateInputType = {
    id?: true
    metricName?: true
    value?: true
    source?: true
    recordedAt?: true
  }

  export type PipelineMetricMaxAggregateInputType = {
    id?: true
    metricName?: true
    value?: true
    source?: true
    recordedAt?: true
  }

  export type PipelineMetricCountAggregateInputType = {
    id?: true
    metricName?: true
    value?: true
    source?: true
    tags?: true
    recordedAt?: true
    _all?: true
  }

  export type PipelineMetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PipelineMetric to aggregate.
     */
    where?: PipelineMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PipelineMetrics to fetch.
     */
    orderBy?: PipelineMetricOrderByWithRelationInput | PipelineMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PipelineMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PipelineMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PipelineMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PipelineMetrics
    **/
    _count?: true | PipelineMetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PipelineMetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PipelineMetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PipelineMetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PipelineMetricMaxAggregateInputType
  }

  export type GetPipelineMetricAggregateType<T extends PipelineMetricAggregateArgs> = {
        [P in keyof T & keyof AggregatePipelineMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePipelineMetric[P]>
      : GetScalarType<T[P], AggregatePipelineMetric[P]>
  }




  export type PipelineMetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PipelineMetricWhereInput
    orderBy?: PipelineMetricOrderByWithAggregationInput | PipelineMetricOrderByWithAggregationInput[]
    by: PipelineMetricScalarFieldEnum[] | PipelineMetricScalarFieldEnum
    having?: PipelineMetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PipelineMetricCountAggregateInputType | true
    _avg?: PipelineMetricAvgAggregateInputType
    _sum?: PipelineMetricSumAggregateInputType
    _min?: PipelineMetricMinAggregateInputType
    _max?: PipelineMetricMaxAggregateInputType
  }

  export type PipelineMetricGroupByOutputType = {
    id: string
    metricName: string
    value: number
    source: string | null
    tags: JsonValue | null
    recordedAt: Date
    _count: PipelineMetricCountAggregateOutputType | null
    _avg: PipelineMetricAvgAggregateOutputType | null
    _sum: PipelineMetricSumAggregateOutputType | null
    _min: PipelineMetricMinAggregateOutputType | null
    _max: PipelineMetricMaxAggregateOutputType | null
  }

  type GetPipelineMetricGroupByPayload<T extends PipelineMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PipelineMetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PipelineMetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PipelineMetricGroupByOutputType[P]>
            : GetScalarType<T[P], PipelineMetricGroupByOutputType[P]>
        }
      >
    >


  export type PipelineMetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    metricName?: boolean
    value?: boolean
    source?: boolean
    tags?: boolean
    recordedAt?: boolean
  }, ExtArgs["result"]["pipelineMetric"]>

  export type PipelineMetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    metricName?: boolean
    value?: boolean
    source?: boolean
    tags?: boolean
    recordedAt?: boolean
  }, ExtArgs["result"]["pipelineMetric"]>

  export type PipelineMetricSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    metricName?: boolean
    value?: boolean
    source?: boolean
    tags?: boolean
    recordedAt?: boolean
  }, ExtArgs["result"]["pipelineMetric"]>

  export type PipelineMetricSelectScalar = {
    id?: boolean
    metricName?: boolean
    value?: boolean
    source?: boolean
    tags?: boolean
    recordedAt?: boolean
  }

  export type PipelineMetricOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "metricName" | "value" | "source" | "tags" | "recordedAt", ExtArgs["result"]["pipelineMetric"]>

  export type $PipelineMetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PipelineMetric"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      metricName: string
      value: number
      source: string | null
      tags: Prisma.JsonValue | null
      recordedAt: Date
    }, ExtArgs["result"]["pipelineMetric"]>
    composites: {}
  }

  type PipelineMetricGetPayload<S extends boolean | null | undefined | PipelineMetricDefaultArgs> = $Result.GetResult<Prisma.$PipelineMetricPayload, S>

  type PipelineMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PipelineMetricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PipelineMetricCountAggregateInputType | true
    }

  export interface PipelineMetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PipelineMetric'], meta: { name: 'PipelineMetric' } }
    /**
     * Find zero or one PipelineMetric that matches the filter.
     * @param {PipelineMetricFindUniqueArgs} args - Arguments to find a PipelineMetric
     * @example
     * // Get one PipelineMetric
     * const pipelineMetric = await prisma.pipelineMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PipelineMetricFindUniqueArgs>(args: SelectSubset<T, PipelineMetricFindUniqueArgs<ExtArgs>>): Prisma__PipelineMetricClient<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PipelineMetric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PipelineMetricFindUniqueOrThrowArgs} args - Arguments to find a PipelineMetric
     * @example
     * // Get one PipelineMetric
     * const pipelineMetric = await prisma.pipelineMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PipelineMetricFindUniqueOrThrowArgs>(args: SelectSubset<T, PipelineMetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PipelineMetricClient<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PipelineMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineMetricFindFirstArgs} args - Arguments to find a PipelineMetric
     * @example
     * // Get one PipelineMetric
     * const pipelineMetric = await prisma.pipelineMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PipelineMetricFindFirstArgs>(args?: SelectSubset<T, PipelineMetricFindFirstArgs<ExtArgs>>): Prisma__PipelineMetricClient<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PipelineMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineMetricFindFirstOrThrowArgs} args - Arguments to find a PipelineMetric
     * @example
     * // Get one PipelineMetric
     * const pipelineMetric = await prisma.pipelineMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PipelineMetricFindFirstOrThrowArgs>(args?: SelectSubset<T, PipelineMetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__PipelineMetricClient<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PipelineMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PipelineMetrics
     * const pipelineMetrics = await prisma.pipelineMetric.findMany()
     * 
     * // Get first 10 PipelineMetrics
     * const pipelineMetrics = await prisma.pipelineMetric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pipelineMetricWithIdOnly = await prisma.pipelineMetric.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PipelineMetricFindManyArgs>(args?: SelectSubset<T, PipelineMetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PipelineMetric.
     * @param {PipelineMetricCreateArgs} args - Arguments to create a PipelineMetric.
     * @example
     * // Create one PipelineMetric
     * const PipelineMetric = await prisma.pipelineMetric.create({
     *   data: {
     *     // ... data to create a PipelineMetric
     *   }
     * })
     * 
     */
    create<T extends PipelineMetricCreateArgs>(args: SelectSubset<T, PipelineMetricCreateArgs<ExtArgs>>): Prisma__PipelineMetricClient<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PipelineMetrics.
     * @param {PipelineMetricCreateManyArgs} args - Arguments to create many PipelineMetrics.
     * @example
     * // Create many PipelineMetrics
     * const pipelineMetric = await prisma.pipelineMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PipelineMetricCreateManyArgs>(args?: SelectSubset<T, PipelineMetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PipelineMetrics and returns the data saved in the database.
     * @param {PipelineMetricCreateManyAndReturnArgs} args - Arguments to create many PipelineMetrics.
     * @example
     * // Create many PipelineMetrics
     * const pipelineMetric = await prisma.pipelineMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PipelineMetrics and only return the `id`
     * const pipelineMetricWithIdOnly = await prisma.pipelineMetric.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PipelineMetricCreateManyAndReturnArgs>(args?: SelectSubset<T, PipelineMetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PipelineMetric.
     * @param {PipelineMetricDeleteArgs} args - Arguments to delete one PipelineMetric.
     * @example
     * // Delete one PipelineMetric
     * const PipelineMetric = await prisma.pipelineMetric.delete({
     *   where: {
     *     // ... filter to delete one PipelineMetric
     *   }
     * })
     * 
     */
    delete<T extends PipelineMetricDeleteArgs>(args: SelectSubset<T, PipelineMetricDeleteArgs<ExtArgs>>): Prisma__PipelineMetricClient<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PipelineMetric.
     * @param {PipelineMetricUpdateArgs} args - Arguments to update one PipelineMetric.
     * @example
     * // Update one PipelineMetric
     * const pipelineMetric = await prisma.pipelineMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PipelineMetricUpdateArgs>(args: SelectSubset<T, PipelineMetricUpdateArgs<ExtArgs>>): Prisma__PipelineMetricClient<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PipelineMetrics.
     * @param {PipelineMetricDeleteManyArgs} args - Arguments to filter PipelineMetrics to delete.
     * @example
     * // Delete a few PipelineMetrics
     * const { count } = await prisma.pipelineMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PipelineMetricDeleteManyArgs>(args?: SelectSubset<T, PipelineMetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PipelineMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PipelineMetrics
     * const pipelineMetric = await prisma.pipelineMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PipelineMetricUpdateManyArgs>(args: SelectSubset<T, PipelineMetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PipelineMetrics and returns the data updated in the database.
     * @param {PipelineMetricUpdateManyAndReturnArgs} args - Arguments to update many PipelineMetrics.
     * @example
     * // Update many PipelineMetrics
     * const pipelineMetric = await prisma.pipelineMetric.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PipelineMetrics and only return the `id`
     * const pipelineMetricWithIdOnly = await prisma.pipelineMetric.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PipelineMetricUpdateManyAndReturnArgs>(args: SelectSubset<T, PipelineMetricUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PipelineMetric.
     * @param {PipelineMetricUpsertArgs} args - Arguments to update or create a PipelineMetric.
     * @example
     * // Update or create a PipelineMetric
     * const pipelineMetric = await prisma.pipelineMetric.upsert({
     *   create: {
     *     // ... data to create a PipelineMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PipelineMetric we want to update
     *   }
     * })
     */
    upsert<T extends PipelineMetricUpsertArgs>(args: SelectSubset<T, PipelineMetricUpsertArgs<ExtArgs>>): Prisma__PipelineMetricClient<$Result.GetResult<Prisma.$PipelineMetricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PipelineMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineMetricCountArgs} args - Arguments to filter PipelineMetrics to count.
     * @example
     * // Count the number of PipelineMetrics
     * const count = await prisma.pipelineMetric.count({
     *   where: {
     *     // ... the filter for the PipelineMetrics we want to count
     *   }
     * })
    **/
    count<T extends PipelineMetricCountArgs>(
      args?: Subset<T, PipelineMetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PipelineMetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PipelineMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PipelineMetricAggregateArgs>(args: Subset<T, PipelineMetricAggregateArgs>): Prisma.PrismaPromise<GetPipelineMetricAggregateType<T>>

    /**
     * Group by PipelineMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PipelineMetricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PipelineMetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PipelineMetricGroupByArgs['orderBy'] }
        : { orderBy?: PipelineMetricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PipelineMetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPipelineMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PipelineMetric model
   */
  readonly fields: PipelineMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PipelineMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PipelineMetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PipelineMetric model
   */
  interface PipelineMetricFieldRefs {
    readonly id: FieldRef<"PipelineMetric", 'String'>
    readonly metricName: FieldRef<"PipelineMetric", 'String'>
    readonly value: FieldRef<"PipelineMetric", 'Float'>
    readonly source: FieldRef<"PipelineMetric", 'String'>
    readonly tags: FieldRef<"PipelineMetric", 'Json'>
    readonly recordedAt: FieldRef<"PipelineMetric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PipelineMetric findUnique
   */
  export type PipelineMetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * Filter, which PipelineMetric to fetch.
     */
    where: PipelineMetricWhereUniqueInput
  }

  /**
   * PipelineMetric findUniqueOrThrow
   */
  export type PipelineMetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * Filter, which PipelineMetric to fetch.
     */
    where: PipelineMetricWhereUniqueInput
  }

  /**
   * PipelineMetric findFirst
   */
  export type PipelineMetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * Filter, which PipelineMetric to fetch.
     */
    where?: PipelineMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PipelineMetrics to fetch.
     */
    orderBy?: PipelineMetricOrderByWithRelationInput | PipelineMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PipelineMetrics.
     */
    cursor?: PipelineMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PipelineMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PipelineMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PipelineMetrics.
     */
    distinct?: PipelineMetricScalarFieldEnum | PipelineMetricScalarFieldEnum[]
  }

  /**
   * PipelineMetric findFirstOrThrow
   */
  export type PipelineMetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * Filter, which PipelineMetric to fetch.
     */
    where?: PipelineMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PipelineMetrics to fetch.
     */
    orderBy?: PipelineMetricOrderByWithRelationInput | PipelineMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PipelineMetrics.
     */
    cursor?: PipelineMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PipelineMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PipelineMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PipelineMetrics.
     */
    distinct?: PipelineMetricScalarFieldEnum | PipelineMetricScalarFieldEnum[]
  }

  /**
   * PipelineMetric findMany
   */
  export type PipelineMetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * Filter, which PipelineMetrics to fetch.
     */
    where?: PipelineMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PipelineMetrics to fetch.
     */
    orderBy?: PipelineMetricOrderByWithRelationInput | PipelineMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PipelineMetrics.
     */
    cursor?: PipelineMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PipelineMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PipelineMetrics.
     */
    skip?: number
    distinct?: PipelineMetricScalarFieldEnum | PipelineMetricScalarFieldEnum[]
  }

  /**
   * PipelineMetric create
   */
  export type PipelineMetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * The data needed to create a PipelineMetric.
     */
    data: XOR<PipelineMetricCreateInput, PipelineMetricUncheckedCreateInput>
  }

  /**
   * PipelineMetric createMany
   */
  export type PipelineMetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PipelineMetrics.
     */
    data: PipelineMetricCreateManyInput | PipelineMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PipelineMetric createManyAndReturn
   */
  export type PipelineMetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * The data used to create many PipelineMetrics.
     */
    data: PipelineMetricCreateManyInput | PipelineMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PipelineMetric update
   */
  export type PipelineMetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * The data needed to update a PipelineMetric.
     */
    data: XOR<PipelineMetricUpdateInput, PipelineMetricUncheckedUpdateInput>
    /**
     * Choose, which PipelineMetric to update.
     */
    where: PipelineMetricWhereUniqueInput
  }

  /**
   * PipelineMetric updateMany
   */
  export type PipelineMetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PipelineMetrics.
     */
    data: XOR<PipelineMetricUpdateManyMutationInput, PipelineMetricUncheckedUpdateManyInput>
    /**
     * Filter which PipelineMetrics to update
     */
    where?: PipelineMetricWhereInput
    /**
     * Limit how many PipelineMetrics to update.
     */
    limit?: number
  }

  /**
   * PipelineMetric updateManyAndReturn
   */
  export type PipelineMetricUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * The data used to update PipelineMetrics.
     */
    data: XOR<PipelineMetricUpdateManyMutationInput, PipelineMetricUncheckedUpdateManyInput>
    /**
     * Filter which PipelineMetrics to update
     */
    where?: PipelineMetricWhereInput
    /**
     * Limit how many PipelineMetrics to update.
     */
    limit?: number
  }

  /**
   * PipelineMetric upsert
   */
  export type PipelineMetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * The filter to search for the PipelineMetric to update in case it exists.
     */
    where: PipelineMetricWhereUniqueInput
    /**
     * In case the PipelineMetric found by the `where` argument doesn't exist, create a new PipelineMetric with this data.
     */
    create: XOR<PipelineMetricCreateInput, PipelineMetricUncheckedCreateInput>
    /**
     * In case the PipelineMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PipelineMetricUpdateInput, PipelineMetricUncheckedUpdateInput>
  }

  /**
   * PipelineMetric delete
   */
  export type PipelineMetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
    /**
     * Filter which PipelineMetric to delete.
     */
    where: PipelineMetricWhereUniqueInput
  }

  /**
   * PipelineMetric deleteMany
   */
  export type PipelineMetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PipelineMetrics to delete
     */
    where?: PipelineMetricWhereInput
    /**
     * Limit how many PipelineMetrics to delete.
     */
    limit?: number
  }

  /**
   * PipelineMetric without action
   */
  export type PipelineMetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PipelineMetric
     */
    select?: PipelineMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PipelineMetric
     */
    omit?: PipelineMetricOmit<ExtArgs> | null
  }


  /**
   * Model EnrichedNews
   */

  export type AggregateEnrichedNews = {
    _count: EnrichedNewsCountAggregateOutputType | null
    _avg: EnrichedNewsAvgAggregateOutputType | null
    _sum: EnrichedNewsSumAggregateOutputType | null
    _min: EnrichedNewsMinAggregateOutputType | null
    _max: EnrichedNewsMaxAggregateOutputType | null
  }

  export type EnrichedNewsAvgAggregateOutputType = {
    publishedAt: number | null
    probability: number | null
    confidence: number | null
  }

  export type EnrichedNewsSumAggregateOutputType = {
    publishedAt: number | null
    probability: number | null
    confidence: number | null
  }

  export type EnrichedNewsMinAggregateOutputType = {
    id: string | null
    headline: string | null
    url: string | null
    publishedAt: number | null
    source: string | null
    image: string | null
    originalSummary: string | null
    aiSummary: string | null
    tldr: string | null
    whyItMatters: string | null
    historicalContext: string | null
    shortTermImpact: string | null
    longTermImpact: string | null
    whatToWatchNext: string | null
    riskFactors: string | null
    probability: number | null
    confidence: number | null
    createdAt: Date | null
  }

  export type EnrichedNewsMaxAggregateOutputType = {
    id: string | null
    headline: string | null
    url: string | null
    publishedAt: number | null
    source: string | null
    image: string | null
    originalSummary: string | null
    aiSummary: string | null
    tldr: string | null
    whyItMatters: string | null
    historicalContext: string | null
    shortTermImpact: string | null
    longTermImpact: string | null
    whatToWatchNext: string | null
    riskFactors: string | null
    probability: number | null
    confidence: number | null
    createdAt: Date | null
  }

  export type EnrichedNewsCountAggregateOutputType = {
    id: number
    headline: number
    url: number
    publishedAt: number
    source: number
    image: number
    originalSummary: number
    aiSummary: number
    tldr: number
    whyItMatters: number
    categories: number
    sectors: number
    companies: number
    financialTerms: number
    historicalContext: number
    shortTermImpact: number
    longTermImpact: number
    whatToWatchNext: number
    riskFactors: number
    probability: number
    confidence: number
    marketImpact: number
    relatedArticles: number
    createdAt: number
    _all: number
  }


  export type EnrichedNewsAvgAggregateInputType = {
    publishedAt?: true
    probability?: true
    confidence?: true
  }

  export type EnrichedNewsSumAggregateInputType = {
    publishedAt?: true
    probability?: true
    confidence?: true
  }

  export type EnrichedNewsMinAggregateInputType = {
    id?: true
    headline?: true
    url?: true
    publishedAt?: true
    source?: true
    image?: true
    originalSummary?: true
    aiSummary?: true
    tldr?: true
    whyItMatters?: true
    historicalContext?: true
    shortTermImpact?: true
    longTermImpact?: true
    whatToWatchNext?: true
    riskFactors?: true
    probability?: true
    confidence?: true
    createdAt?: true
  }

  export type EnrichedNewsMaxAggregateInputType = {
    id?: true
    headline?: true
    url?: true
    publishedAt?: true
    source?: true
    image?: true
    originalSummary?: true
    aiSummary?: true
    tldr?: true
    whyItMatters?: true
    historicalContext?: true
    shortTermImpact?: true
    longTermImpact?: true
    whatToWatchNext?: true
    riskFactors?: true
    probability?: true
    confidence?: true
    createdAt?: true
  }

  export type EnrichedNewsCountAggregateInputType = {
    id?: true
    headline?: true
    url?: true
    publishedAt?: true
    source?: true
    image?: true
    originalSummary?: true
    aiSummary?: true
    tldr?: true
    whyItMatters?: true
    categories?: true
    sectors?: true
    companies?: true
    financialTerms?: true
    historicalContext?: true
    shortTermImpact?: true
    longTermImpact?: true
    whatToWatchNext?: true
    riskFactors?: true
    probability?: true
    confidence?: true
    marketImpact?: true
    relatedArticles?: true
    createdAt?: true
    _all?: true
  }

  export type EnrichedNewsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnrichedNews to aggregate.
     */
    where?: EnrichedNewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnrichedNews to fetch.
     */
    orderBy?: EnrichedNewsOrderByWithRelationInput | EnrichedNewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnrichedNewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnrichedNews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnrichedNews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EnrichedNews
    **/
    _count?: true | EnrichedNewsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EnrichedNewsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EnrichedNewsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnrichedNewsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnrichedNewsMaxAggregateInputType
  }

  export type GetEnrichedNewsAggregateType<T extends EnrichedNewsAggregateArgs> = {
        [P in keyof T & keyof AggregateEnrichedNews]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnrichedNews[P]>
      : GetScalarType<T[P], AggregateEnrichedNews[P]>
  }




  export type EnrichedNewsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnrichedNewsWhereInput
    orderBy?: EnrichedNewsOrderByWithAggregationInput | EnrichedNewsOrderByWithAggregationInput[]
    by: EnrichedNewsScalarFieldEnum[] | EnrichedNewsScalarFieldEnum
    having?: EnrichedNewsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnrichedNewsCountAggregateInputType | true
    _avg?: EnrichedNewsAvgAggregateInputType
    _sum?: EnrichedNewsSumAggregateInputType
    _min?: EnrichedNewsMinAggregateInputType
    _max?: EnrichedNewsMaxAggregateInputType
  }

  export type EnrichedNewsGroupByOutputType = {
    id: string
    headline: string
    url: string
    publishedAt: number
    source: string
    image: string | null
    originalSummary: string | null
    aiSummary: string | null
    tldr: string | null
    whyItMatters: string | null
    categories: string[]
    sectors: string[]
    companies: string[]
    financialTerms: JsonValue | null
    historicalContext: string | null
    shortTermImpact: string | null
    longTermImpact: string | null
    whatToWatchNext: string | null
    riskFactors: string | null
    probability: number | null
    confidence: number | null
    marketImpact: JsonValue | null
    relatedArticles: JsonValue | null
    createdAt: Date
    _count: EnrichedNewsCountAggregateOutputType | null
    _avg: EnrichedNewsAvgAggregateOutputType | null
    _sum: EnrichedNewsSumAggregateOutputType | null
    _min: EnrichedNewsMinAggregateOutputType | null
    _max: EnrichedNewsMaxAggregateOutputType | null
  }

  type GetEnrichedNewsGroupByPayload<T extends EnrichedNewsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnrichedNewsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnrichedNewsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnrichedNewsGroupByOutputType[P]>
            : GetScalarType<T[P], EnrichedNewsGroupByOutputType[P]>
        }
      >
    >


  export type EnrichedNewsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    headline?: boolean
    url?: boolean
    publishedAt?: boolean
    source?: boolean
    image?: boolean
    originalSummary?: boolean
    aiSummary?: boolean
    tldr?: boolean
    whyItMatters?: boolean
    categories?: boolean
    sectors?: boolean
    companies?: boolean
    financialTerms?: boolean
    historicalContext?: boolean
    shortTermImpact?: boolean
    longTermImpact?: boolean
    whatToWatchNext?: boolean
    riskFactors?: boolean
    probability?: boolean
    confidence?: boolean
    marketImpact?: boolean
    relatedArticles?: boolean
    createdAt?: boolean
    bookmarks?: boolean | EnrichedNews$bookmarksArgs<ExtArgs>
    tradeLinks?: boolean | EnrichedNews$tradeLinksArgs<ExtArgs>
    _count?: boolean | EnrichedNewsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["enrichedNews"]>

  export type EnrichedNewsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    headline?: boolean
    url?: boolean
    publishedAt?: boolean
    source?: boolean
    image?: boolean
    originalSummary?: boolean
    aiSummary?: boolean
    tldr?: boolean
    whyItMatters?: boolean
    categories?: boolean
    sectors?: boolean
    companies?: boolean
    financialTerms?: boolean
    historicalContext?: boolean
    shortTermImpact?: boolean
    longTermImpact?: boolean
    whatToWatchNext?: boolean
    riskFactors?: boolean
    probability?: boolean
    confidence?: boolean
    marketImpact?: boolean
    relatedArticles?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["enrichedNews"]>

  export type EnrichedNewsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    headline?: boolean
    url?: boolean
    publishedAt?: boolean
    source?: boolean
    image?: boolean
    originalSummary?: boolean
    aiSummary?: boolean
    tldr?: boolean
    whyItMatters?: boolean
    categories?: boolean
    sectors?: boolean
    companies?: boolean
    financialTerms?: boolean
    historicalContext?: boolean
    shortTermImpact?: boolean
    longTermImpact?: boolean
    whatToWatchNext?: boolean
    riskFactors?: boolean
    probability?: boolean
    confidence?: boolean
    marketImpact?: boolean
    relatedArticles?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["enrichedNews"]>

  export type EnrichedNewsSelectScalar = {
    id?: boolean
    headline?: boolean
    url?: boolean
    publishedAt?: boolean
    source?: boolean
    image?: boolean
    originalSummary?: boolean
    aiSummary?: boolean
    tldr?: boolean
    whyItMatters?: boolean
    categories?: boolean
    sectors?: boolean
    companies?: boolean
    financialTerms?: boolean
    historicalContext?: boolean
    shortTermImpact?: boolean
    longTermImpact?: boolean
    whatToWatchNext?: boolean
    riskFactors?: boolean
    probability?: boolean
    confidence?: boolean
    marketImpact?: boolean
    relatedArticles?: boolean
    createdAt?: boolean
  }

  export type EnrichedNewsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "headline" | "url" | "publishedAt" | "source" | "image" | "originalSummary" | "aiSummary" | "tldr" | "whyItMatters" | "categories" | "sectors" | "companies" | "financialTerms" | "historicalContext" | "shortTermImpact" | "longTermImpact" | "whatToWatchNext" | "riskFactors" | "probability" | "confidence" | "marketImpact" | "relatedArticles" | "createdAt", ExtArgs["result"]["enrichedNews"]>
  export type EnrichedNewsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookmarks?: boolean | EnrichedNews$bookmarksArgs<ExtArgs>
    tradeLinks?: boolean | EnrichedNews$tradeLinksArgs<ExtArgs>
    _count?: boolean | EnrichedNewsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EnrichedNewsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EnrichedNewsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EnrichedNewsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EnrichedNews"
    objects: {
      bookmarks: Prisma.$NewsBookmarkPayload<ExtArgs>[]
      tradeLinks: Prisma.$TradeNewsLinkPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      headline: string
      url: string
      publishedAt: number
      source: string
      image: string | null
      originalSummary: string | null
      aiSummary: string | null
      tldr: string | null
      whyItMatters: string | null
      categories: string[]
      sectors: string[]
      companies: string[]
      financialTerms: Prisma.JsonValue | null
      historicalContext: string | null
      shortTermImpact: string | null
      longTermImpact: string | null
      whatToWatchNext: string | null
      riskFactors: string | null
      probability: number | null
      confidence: number | null
      marketImpact: Prisma.JsonValue | null
      relatedArticles: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["enrichedNews"]>
    composites: {}
  }

  type EnrichedNewsGetPayload<S extends boolean | null | undefined | EnrichedNewsDefaultArgs> = $Result.GetResult<Prisma.$EnrichedNewsPayload, S>

  type EnrichedNewsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EnrichedNewsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EnrichedNewsCountAggregateInputType | true
    }

  export interface EnrichedNewsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EnrichedNews'], meta: { name: 'EnrichedNews' } }
    /**
     * Find zero or one EnrichedNews that matches the filter.
     * @param {EnrichedNewsFindUniqueArgs} args - Arguments to find a EnrichedNews
     * @example
     * // Get one EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnrichedNewsFindUniqueArgs>(args: SelectSubset<T, EnrichedNewsFindUniqueArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EnrichedNews that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EnrichedNewsFindUniqueOrThrowArgs} args - Arguments to find a EnrichedNews
     * @example
     * // Get one EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnrichedNewsFindUniqueOrThrowArgs>(args: SelectSubset<T, EnrichedNewsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EnrichedNews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrichedNewsFindFirstArgs} args - Arguments to find a EnrichedNews
     * @example
     * // Get one EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnrichedNewsFindFirstArgs>(args?: SelectSubset<T, EnrichedNewsFindFirstArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EnrichedNews that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrichedNewsFindFirstOrThrowArgs} args - Arguments to find a EnrichedNews
     * @example
     * // Get one EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnrichedNewsFindFirstOrThrowArgs>(args?: SelectSubset<T, EnrichedNewsFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EnrichedNews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrichedNewsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.findMany()
     * 
     * // Get first 10 EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const enrichedNewsWithIdOnly = await prisma.enrichedNews.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnrichedNewsFindManyArgs>(args?: SelectSubset<T, EnrichedNewsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EnrichedNews.
     * @param {EnrichedNewsCreateArgs} args - Arguments to create a EnrichedNews.
     * @example
     * // Create one EnrichedNews
     * const EnrichedNews = await prisma.enrichedNews.create({
     *   data: {
     *     // ... data to create a EnrichedNews
     *   }
     * })
     * 
     */
    create<T extends EnrichedNewsCreateArgs>(args: SelectSubset<T, EnrichedNewsCreateArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EnrichedNews.
     * @param {EnrichedNewsCreateManyArgs} args - Arguments to create many EnrichedNews.
     * @example
     * // Create many EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnrichedNewsCreateManyArgs>(args?: SelectSubset<T, EnrichedNewsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EnrichedNews and returns the data saved in the database.
     * @param {EnrichedNewsCreateManyAndReturnArgs} args - Arguments to create many EnrichedNews.
     * @example
     * // Create many EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EnrichedNews and only return the `id`
     * const enrichedNewsWithIdOnly = await prisma.enrichedNews.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnrichedNewsCreateManyAndReturnArgs>(args?: SelectSubset<T, EnrichedNewsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EnrichedNews.
     * @param {EnrichedNewsDeleteArgs} args - Arguments to delete one EnrichedNews.
     * @example
     * // Delete one EnrichedNews
     * const EnrichedNews = await prisma.enrichedNews.delete({
     *   where: {
     *     // ... filter to delete one EnrichedNews
     *   }
     * })
     * 
     */
    delete<T extends EnrichedNewsDeleteArgs>(args: SelectSubset<T, EnrichedNewsDeleteArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EnrichedNews.
     * @param {EnrichedNewsUpdateArgs} args - Arguments to update one EnrichedNews.
     * @example
     * // Update one EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnrichedNewsUpdateArgs>(args: SelectSubset<T, EnrichedNewsUpdateArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EnrichedNews.
     * @param {EnrichedNewsDeleteManyArgs} args - Arguments to filter EnrichedNews to delete.
     * @example
     * // Delete a few EnrichedNews
     * const { count } = await prisma.enrichedNews.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnrichedNewsDeleteManyArgs>(args?: SelectSubset<T, EnrichedNewsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EnrichedNews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrichedNewsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnrichedNewsUpdateManyArgs>(args: SelectSubset<T, EnrichedNewsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EnrichedNews and returns the data updated in the database.
     * @param {EnrichedNewsUpdateManyAndReturnArgs} args - Arguments to update many EnrichedNews.
     * @example
     * // Update many EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EnrichedNews and only return the `id`
     * const enrichedNewsWithIdOnly = await prisma.enrichedNews.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EnrichedNewsUpdateManyAndReturnArgs>(args: SelectSubset<T, EnrichedNewsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EnrichedNews.
     * @param {EnrichedNewsUpsertArgs} args - Arguments to update or create a EnrichedNews.
     * @example
     * // Update or create a EnrichedNews
     * const enrichedNews = await prisma.enrichedNews.upsert({
     *   create: {
     *     // ... data to create a EnrichedNews
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EnrichedNews we want to update
     *   }
     * })
     */
    upsert<T extends EnrichedNewsUpsertArgs>(args: SelectSubset<T, EnrichedNewsUpsertArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EnrichedNews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrichedNewsCountArgs} args - Arguments to filter EnrichedNews to count.
     * @example
     * // Count the number of EnrichedNews
     * const count = await prisma.enrichedNews.count({
     *   where: {
     *     // ... the filter for the EnrichedNews we want to count
     *   }
     * })
    **/
    count<T extends EnrichedNewsCountArgs>(
      args?: Subset<T, EnrichedNewsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnrichedNewsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EnrichedNews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrichedNewsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EnrichedNewsAggregateArgs>(args: Subset<T, EnrichedNewsAggregateArgs>): Prisma.PrismaPromise<GetEnrichedNewsAggregateType<T>>

    /**
     * Group by EnrichedNews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnrichedNewsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EnrichedNewsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnrichedNewsGroupByArgs['orderBy'] }
        : { orderBy?: EnrichedNewsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EnrichedNewsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnrichedNewsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EnrichedNews model
   */
  readonly fields: EnrichedNewsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EnrichedNews.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnrichedNewsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bookmarks<T extends EnrichedNews$bookmarksArgs<ExtArgs> = {}>(args?: Subset<T, EnrichedNews$bookmarksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tradeLinks<T extends EnrichedNews$tradeLinksArgs<ExtArgs> = {}>(args?: Subset<T, EnrichedNews$tradeLinksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EnrichedNews model
   */
  interface EnrichedNewsFieldRefs {
    readonly id: FieldRef<"EnrichedNews", 'String'>
    readonly headline: FieldRef<"EnrichedNews", 'String'>
    readonly url: FieldRef<"EnrichedNews", 'String'>
    readonly publishedAt: FieldRef<"EnrichedNews", 'Int'>
    readonly source: FieldRef<"EnrichedNews", 'String'>
    readonly image: FieldRef<"EnrichedNews", 'String'>
    readonly originalSummary: FieldRef<"EnrichedNews", 'String'>
    readonly aiSummary: FieldRef<"EnrichedNews", 'String'>
    readonly tldr: FieldRef<"EnrichedNews", 'String'>
    readonly whyItMatters: FieldRef<"EnrichedNews", 'String'>
    readonly categories: FieldRef<"EnrichedNews", 'String[]'>
    readonly sectors: FieldRef<"EnrichedNews", 'String[]'>
    readonly companies: FieldRef<"EnrichedNews", 'String[]'>
    readonly financialTerms: FieldRef<"EnrichedNews", 'Json'>
    readonly historicalContext: FieldRef<"EnrichedNews", 'String'>
    readonly shortTermImpact: FieldRef<"EnrichedNews", 'String'>
    readonly longTermImpact: FieldRef<"EnrichedNews", 'String'>
    readonly whatToWatchNext: FieldRef<"EnrichedNews", 'String'>
    readonly riskFactors: FieldRef<"EnrichedNews", 'String'>
    readonly probability: FieldRef<"EnrichedNews", 'Int'>
    readonly confidence: FieldRef<"EnrichedNews", 'Int'>
    readonly marketImpact: FieldRef<"EnrichedNews", 'Json'>
    readonly relatedArticles: FieldRef<"EnrichedNews", 'Json'>
    readonly createdAt: FieldRef<"EnrichedNews", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EnrichedNews findUnique
   */
  export type EnrichedNewsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
    /**
     * Filter, which EnrichedNews to fetch.
     */
    where: EnrichedNewsWhereUniqueInput
  }

  /**
   * EnrichedNews findUniqueOrThrow
   */
  export type EnrichedNewsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
    /**
     * Filter, which EnrichedNews to fetch.
     */
    where: EnrichedNewsWhereUniqueInput
  }

  /**
   * EnrichedNews findFirst
   */
  export type EnrichedNewsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
    /**
     * Filter, which EnrichedNews to fetch.
     */
    where?: EnrichedNewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnrichedNews to fetch.
     */
    orderBy?: EnrichedNewsOrderByWithRelationInput | EnrichedNewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnrichedNews.
     */
    cursor?: EnrichedNewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnrichedNews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnrichedNews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnrichedNews.
     */
    distinct?: EnrichedNewsScalarFieldEnum | EnrichedNewsScalarFieldEnum[]
  }

  /**
   * EnrichedNews findFirstOrThrow
   */
  export type EnrichedNewsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
    /**
     * Filter, which EnrichedNews to fetch.
     */
    where?: EnrichedNewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnrichedNews to fetch.
     */
    orderBy?: EnrichedNewsOrderByWithRelationInput | EnrichedNewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnrichedNews.
     */
    cursor?: EnrichedNewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnrichedNews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnrichedNews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnrichedNews.
     */
    distinct?: EnrichedNewsScalarFieldEnum | EnrichedNewsScalarFieldEnum[]
  }

  /**
   * EnrichedNews findMany
   */
  export type EnrichedNewsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
    /**
     * Filter, which EnrichedNews to fetch.
     */
    where?: EnrichedNewsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnrichedNews to fetch.
     */
    orderBy?: EnrichedNewsOrderByWithRelationInput | EnrichedNewsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EnrichedNews.
     */
    cursor?: EnrichedNewsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnrichedNews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnrichedNews.
     */
    skip?: number
    distinct?: EnrichedNewsScalarFieldEnum | EnrichedNewsScalarFieldEnum[]
  }

  /**
   * EnrichedNews create
   */
  export type EnrichedNewsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
    /**
     * The data needed to create a EnrichedNews.
     */
    data: XOR<EnrichedNewsCreateInput, EnrichedNewsUncheckedCreateInput>
  }

  /**
   * EnrichedNews createMany
   */
  export type EnrichedNewsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EnrichedNews.
     */
    data: EnrichedNewsCreateManyInput | EnrichedNewsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EnrichedNews createManyAndReturn
   */
  export type EnrichedNewsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * The data used to create many EnrichedNews.
     */
    data: EnrichedNewsCreateManyInput | EnrichedNewsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EnrichedNews update
   */
  export type EnrichedNewsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
    /**
     * The data needed to update a EnrichedNews.
     */
    data: XOR<EnrichedNewsUpdateInput, EnrichedNewsUncheckedUpdateInput>
    /**
     * Choose, which EnrichedNews to update.
     */
    where: EnrichedNewsWhereUniqueInput
  }

  /**
   * EnrichedNews updateMany
   */
  export type EnrichedNewsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EnrichedNews.
     */
    data: XOR<EnrichedNewsUpdateManyMutationInput, EnrichedNewsUncheckedUpdateManyInput>
    /**
     * Filter which EnrichedNews to update
     */
    where?: EnrichedNewsWhereInput
    /**
     * Limit how many EnrichedNews to update.
     */
    limit?: number
  }

  /**
   * EnrichedNews updateManyAndReturn
   */
  export type EnrichedNewsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * The data used to update EnrichedNews.
     */
    data: XOR<EnrichedNewsUpdateManyMutationInput, EnrichedNewsUncheckedUpdateManyInput>
    /**
     * Filter which EnrichedNews to update
     */
    where?: EnrichedNewsWhereInput
    /**
     * Limit how many EnrichedNews to update.
     */
    limit?: number
  }

  /**
   * EnrichedNews upsert
   */
  export type EnrichedNewsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
    /**
     * The filter to search for the EnrichedNews to update in case it exists.
     */
    where: EnrichedNewsWhereUniqueInput
    /**
     * In case the EnrichedNews found by the `where` argument doesn't exist, create a new EnrichedNews with this data.
     */
    create: XOR<EnrichedNewsCreateInput, EnrichedNewsUncheckedCreateInput>
    /**
     * In case the EnrichedNews was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnrichedNewsUpdateInput, EnrichedNewsUncheckedUpdateInput>
  }

  /**
   * EnrichedNews delete
   */
  export type EnrichedNewsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
    /**
     * Filter which EnrichedNews to delete.
     */
    where: EnrichedNewsWhereUniqueInput
  }

  /**
   * EnrichedNews deleteMany
   */
  export type EnrichedNewsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnrichedNews to delete
     */
    where?: EnrichedNewsWhereInput
    /**
     * Limit how many EnrichedNews to delete.
     */
    limit?: number
  }

  /**
   * EnrichedNews.bookmarks
   */
  export type EnrichedNews$bookmarksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    where?: NewsBookmarkWhereInput
    orderBy?: NewsBookmarkOrderByWithRelationInput | NewsBookmarkOrderByWithRelationInput[]
    cursor?: NewsBookmarkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NewsBookmarkScalarFieldEnum | NewsBookmarkScalarFieldEnum[]
  }

  /**
   * EnrichedNews.tradeLinks
   */
  export type EnrichedNews$tradeLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    where?: TradeNewsLinkWhereInput
    orderBy?: TradeNewsLinkOrderByWithRelationInput | TradeNewsLinkOrderByWithRelationInput[]
    cursor?: TradeNewsLinkWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeNewsLinkScalarFieldEnum | TradeNewsLinkScalarFieldEnum[]
  }

  /**
   * EnrichedNews without action
   */
  export type EnrichedNewsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnrichedNews
     */
    select?: EnrichedNewsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnrichedNews
     */
    omit?: EnrichedNewsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnrichedNewsInclude<ExtArgs> | null
  }


  /**
   * Model NewsBookmark
   */

  export type AggregateNewsBookmark = {
    _count: NewsBookmarkCountAggregateOutputType | null
    _min: NewsBookmarkMinAggregateOutputType | null
    _max: NewsBookmarkMaxAggregateOutputType | null
  }

  export type NewsBookmarkMinAggregateOutputType = {
    id: string | null
    userId: string | null
    newsId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type NewsBookmarkMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    newsId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type NewsBookmarkCountAggregateOutputType = {
    id: number
    userId: number
    newsId: number
    notes: number
    createdAt: number
    _all: number
  }


  export type NewsBookmarkMinAggregateInputType = {
    id?: true
    userId?: true
    newsId?: true
    notes?: true
    createdAt?: true
  }

  export type NewsBookmarkMaxAggregateInputType = {
    id?: true
    userId?: true
    newsId?: true
    notes?: true
    createdAt?: true
  }

  export type NewsBookmarkCountAggregateInputType = {
    id?: true
    userId?: true
    newsId?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type NewsBookmarkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsBookmark to aggregate.
     */
    where?: NewsBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsBookmarks to fetch.
     */
    orderBy?: NewsBookmarkOrderByWithRelationInput | NewsBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NewsBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NewsBookmarks
    **/
    _count?: true | NewsBookmarkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NewsBookmarkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NewsBookmarkMaxAggregateInputType
  }

  export type GetNewsBookmarkAggregateType<T extends NewsBookmarkAggregateArgs> = {
        [P in keyof T & keyof AggregateNewsBookmark]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNewsBookmark[P]>
      : GetScalarType<T[P], AggregateNewsBookmark[P]>
  }




  export type NewsBookmarkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NewsBookmarkWhereInput
    orderBy?: NewsBookmarkOrderByWithAggregationInput | NewsBookmarkOrderByWithAggregationInput[]
    by: NewsBookmarkScalarFieldEnum[] | NewsBookmarkScalarFieldEnum
    having?: NewsBookmarkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NewsBookmarkCountAggregateInputType | true
    _min?: NewsBookmarkMinAggregateInputType
    _max?: NewsBookmarkMaxAggregateInputType
  }

  export type NewsBookmarkGroupByOutputType = {
    id: string
    userId: string
    newsId: string
    notes: string | null
    createdAt: Date
    _count: NewsBookmarkCountAggregateOutputType | null
    _min: NewsBookmarkMinAggregateOutputType | null
    _max: NewsBookmarkMaxAggregateOutputType | null
  }

  type GetNewsBookmarkGroupByPayload<T extends NewsBookmarkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NewsBookmarkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NewsBookmarkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NewsBookmarkGroupByOutputType[P]>
            : GetScalarType<T[P], NewsBookmarkGroupByOutputType[P]>
        }
      >
    >


  export type NewsBookmarkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    newsId?: boolean
    notes?: boolean
    createdAt?: boolean
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsBookmark"]>

  export type NewsBookmarkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    newsId?: boolean
    notes?: boolean
    createdAt?: boolean
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsBookmark"]>

  export type NewsBookmarkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    newsId?: boolean
    notes?: boolean
    createdAt?: boolean
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["newsBookmark"]>

  export type NewsBookmarkSelectScalar = {
    id?: boolean
    userId?: boolean
    newsId?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type NewsBookmarkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "newsId" | "notes" | "createdAt", ExtArgs["result"]["newsBookmark"]>
  export type NewsBookmarkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }
  export type NewsBookmarkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }
  export type NewsBookmarkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }

  export type $NewsBookmarkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NewsBookmark"
    objects: {
      news: Prisma.$EnrichedNewsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      newsId: string
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["newsBookmark"]>
    composites: {}
  }

  type NewsBookmarkGetPayload<S extends boolean | null | undefined | NewsBookmarkDefaultArgs> = $Result.GetResult<Prisma.$NewsBookmarkPayload, S>

  type NewsBookmarkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NewsBookmarkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NewsBookmarkCountAggregateInputType | true
    }

  export interface NewsBookmarkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NewsBookmark'], meta: { name: 'NewsBookmark' } }
    /**
     * Find zero or one NewsBookmark that matches the filter.
     * @param {NewsBookmarkFindUniqueArgs} args - Arguments to find a NewsBookmark
     * @example
     * // Get one NewsBookmark
     * const newsBookmark = await prisma.newsBookmark.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NewsBookmarkFindUniqueArgs>(args: SelectSubset<T, NewsBookmarkFindUniqueArgs<ExtArgs>>): Prisma__NewsBookmarkClient<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NewsBookmark that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NewsBookmarkFindUniqueOrThrowArgs} args - Arguments to find a NewsBookmark
     * @example
     * // Get one NewsBookmark
     * const newsBookmark = await prisma.newsBookmark.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NewsBookmarkFindUniqueOrThrowArgs>(args: SelectSubset<T, NewsBookmarkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NewsBookmarkClient<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsBookmark that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBookmarkFindFirstArgs} args - Arguments to find a NewsBookmark
     * @example
     * // Get one NewsBookmark
     * const newsBookmark = await prisma.newsBookmark.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NewsBookmarkFindFirstArgs>(args?: SelectSubset<T, NewsBookmarkFindFirstArgs<ExtArgs>>): Prisma__NewsBookmarkClient<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NewsBookmark that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBookmarkFindFirstOrThrowArgs} args - Arguments to find a NewsBookmark
     * @example
     * // Get one NewsBookmark
     * const newsBookmark = await prisma.newsBookmark.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NewsBookmarkFindFirstOrThrowArgs>(args?: SelectSubset<T, NewsBookmarkFindFirstOrThrowArgs<ExtArgs>>): Prisma__NewsBookmarkClient<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NewsBookmarks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBookmarkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NewsBookmarks
     * const newsBookmarks = await prisma.newsBookmark.findMany()
     * 
     * // Get first 10 NewsBookmarks
     * const newsBookmarks = await prisma.newsBookmark.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const newsBookmarkWithIdOnly = await prisma.newsBookmark.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NewsBookmarkFindManyArgs>(args?: SelectSubset<T, NewsBookmarkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NewsBookmark.
     * @param {NewsBookmarkCreateArgs} args - Arguments to create a NewsBookmark.
     * @example
     * // Create one NewsBookmark
     * const NewsBookmark = await prisma.newsBookmark.create({
     *   data: {
     *     // ... data to create a NewsBookmark
     *   }
     * })
     * 
     */
    create<T extends NewsBookmarkCreateArgs>(args: SelectSubset<T, NewsBookmarkCreateArgs<ExtArgs>>): Prisma__NewsBookmarkClient<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NewsBookmarks.
     * @param {NewsBookmarkCreateManyArgs} args - Arguments to create many NewsBookmarks.
     * @example
     * // Create many NewsBookmarks
     * const newsBookmark = await prisma.newsBookmark.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NewsBookmarkCreateManyArgs>(args?: SelectSubset<T, NewsBookmarkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NewsBookmarks and returns the data saved in the database.
     * @param {NewsBookmarkCreateManyAndReturnArgs} args - Arguments to create many NewsBookmarks.
     * @example
     * // Create many NewsBookmarks
     * const newsBookmark = await prisma.newsBookmark.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NewsBookmarks and only return the `id`
     * const newsBookmarkWithIdOnly = await prisma.newsBookmark.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NewsBookmarkCreateManyAndReturnArgs>(args?: SelectSubset<T, NewsBookmarkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NewsBookmark.
     * @param {NewsBookmarkDeleteArgs} args - Arguments to delete one NewsBookmark.
     * @example
     * // Delete one NewsBookmark
     * const NewsBookmark = await prisma.newsBookmark.delete({
     *   where: {
     *     // ... filter to delete one NewsBookmark
     *   }
     * })
     * 
     */
    delete<T extends NewsBookmarkDeleteArgs>(args: SelectSubset<T, NewsBookmarkDeleteArgs<ExtArgs>>): Prisma__NewsBookmarkClient<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NewsBookmark.
     * @param {NewsBookmarkUpdateArgs} args - Arguments to update one NewsBookmark.
     * @example
     * // Update one NewsBookmark
     * const newsBookmark = await prisma.newsBookmark.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NewsBookmarkUpdateArgs>(args: SelectSubset<T, NewsBookmarkUpdateArgs<ExtArgs>>): Prisma__NewsBookmarkClient<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NewsBookmarks.
     * @param {NewsBookmarkDeleteManyArgs} args - Arguments to filter NewsBookmarks to delete.
     * @example
     * // Delete a few NewsBookmarks
     * const { count } = await prisma.newsBookmark.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NewsBookmarkDeleteManyArgs>(args?: SelectSubset<T, NewsBookmarkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBookmarkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NewsBookmarks
     * const newsBookmark = await prisma.newsBookmark.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NewsBookmarkUpdateManyArgs>(args: SelectSubset<T, NewsBookmarkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NewsBookmarks and returns the data updated in the database.
     * @param {NewsBookmarkUpdateManyAndReturnArgs} args - Arguments to update many NewsBookmarks.
     * @example
     * // Update many NewsBookmarks
     * const newsBookmark = await prisma.newsBookmark.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NewsBookmarks and only return the `id`
     * const newsBookmarkWithIdOnly = await prisma.newsBookmark.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NewsBookmarkUpdateManyAndReturnArgs>(args: SelectSubset<T, NewsBookmarkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NewsBookmark.
     * @param {NewsBookmarkUpsertArgs} args - Arguments to update or create a NewsBookmark.
     * @example
     * // Update or create a NewsBookmark
     * const newsBookmark = await prisma.newsBookmark.upsert({
     *   create: {
     *     // ... data to create a NewsBookmark
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NewsBookmark we want to update
     *   }
     * })
     */
    upsert<T extends NewsBookmarkUpsertArgs>(args: SelectSubset<T, NewsBookmarkUpsertArgs<ExtArgs>>): Prisma__NewsBookmarkClient<$Result.GetResult<Prisma.$NewsBookmarkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NewsBookmarks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBookmarkCountArgs} args - Arguments to filter NewsBookmarks to count.
     * @example
     * // Count the number of NewsBookmarks
     * const count = await prisma.newsBookmark.count({
     *   where: {
     *     // ... the filter for the NewsBookmarks we want to count
     *   }
     * })
    **/
    count<T extends NewsBookmarkCountArgs>(
      args?: Subset<T, NewsBookmarkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NewsBookmarkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NewsBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBookmarkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NewsBookmarkAggregateArgs>(args: Subset<T, NewsBookmarkAggregateArgs>): Prisma.PrismaPromise<GetNewsBookmarkAggregateType<T>>

    /**
     * Group by NewsBookmark.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NewsBookmarkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NewsBookmarkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NewsBookmarkGroupByArgs['orderBy'] }
        : { orderBy?: NewsBookmarkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NewsBookmarkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNewsBookmarkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NewsBookmark model
   */
  readonly fields: NewsBookmarkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NewsBookmark.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NewsBookmarkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    news<T extends EnrichedNewsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnrichedNewsDefaultArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NewsBookmark model
   */
  interface NewsBookmarkFieldRefs {
    readonly id: FieldRef<"NewsBookmark", 'String'>
    readonly userId: FieldRef<"NewsBookmark", 'String'>
    readonly newsId: FieldRef<"NewsBookmark", 'String'>
    readonly notes: FieldRef<"NewsBookmark", 'String'>
    readonly createdAt: FieldRef<"NewsBookmark", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NewsBookmark findUnique
   */
  export type NewsBookmarkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which NewsBookmark to fetch.
     */
    where: NewsBookmarkWhereUniqueInput
  }

  /**
   * NewsBookmark findUniqueOrThrow
   */
  export type NewsBookmarkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which NewsBookmark to fetch.
     */
    where: NewsBookmarkWhereUniqueInput
  }

  /**
   * NewsBookmark findFirst
   */
  export type NewsBookmarkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which NewsBookmark to fetch.
     */
    where?: NewsBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsBookmarks to fetch.
     */
    orderBy?: NewsBookmarkOrderByWithRelationInput | NewsBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsBookmarks.
     */
    cursor?: NewsBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsBookmarks.
     */
    distinct?: NewsBookmarkScalarFieldEnum | NewsBookmarkScalarFieldEnum[]
  }

  /**
   * NewsBookmark findFirstOrThrow
   */
  export type NewsBookmarkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which NewsBookmark to fetch.
     */
    where?: NewsBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsBookmarks to fetch.
     */
    orderBy?: NewsBookmarkOrderByWithRelationInput | NewsBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NewsBookmarks.
     */
    cursor?: NewsBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsBookmarks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NewsBookmarks.
     */
    distinct?: NewsBookmarkScalarFieldEnum | NewsBookmarkScalarFieldEnum[]
  }

  /**
   * NewsBookmark findMany
   */
  export type NewsBookmarkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    /**
     * Filter, which NewsBookmarks to fetch.
     */
    where?: NewsBookmarkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NewsBookmarks to fetch.
     */
    orderBy?: NewsBookmarkOrderByWithRelationInput | NewsBookmarkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NewsBookmarks.
     */
    cursor?: NewsBookmarkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NewsBookmarks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NewsBookmarks.
     */
    skip?: number
    distinct?: NewsBookmarkScalarFieldEnum | NewsBookmarkScalarFieldEnum[]
  }

  /**
   * NewsBookmark create
   */
  export type NewsBookmarkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    /**
     * The data needed to create a NewsBookmark.
     */
    data: XOR<NewsBookmarkCreateInput, NewsBookmarkUncheckedCreateInput>
  }

  /**
   * NewsBookmark createMany
   */
  export type NewsBookmarkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NewsBookmarks.
     */
    data: NewsBookmarkCreateManyInput | NewsBookmarkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NewsBookmark createManyAndReturn
   */
  export type NewsBookmarkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * The data used to create many NewsBookmarks.
     */
    data: NewsBookmarkCreateManyInput | NewsBookmarkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsBookmark update
   */
  export type NewsBookmarkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    /**
     * The data needed to update a NewsBookmark.
     */
    data: XOR<NewsBookmarkUpdateInput, NewsBookmarkUncheckedUpdateInput>
    /**
     * Choose, which NewsBookmark to update.
     */
    where: NewsBookmarkWhereUniqueInput
  }

  /**
   * NewsBookmark updateMany
   */
  export type NewsBookmarkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NewsBookmarks.
     */
    data: XOR<NewsBookmarkUpdateManyMutationInput, NewsBookmarkUncheckedUpdateManyInput>
    /**
     * Filter which NewsBookmarks to update
     */
    where?: NewsBookmarkWhereInput
    /**
     * Limit how many NewsBookmarks to update.
     */
    limit?: number
  }

  /**
   * NewsBookmark updateManyAndReturn
   */
  export type NewsBookmarkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * The data used to update NewsBookmarks.
     */
    data: XOR<NewsBookmarkUpdateManyMutationInput, NewsBookmarkUncheckedUpdateManyInput>
    /**
     * Filter which NewsBookmarks to update
     */
    where?: NewsBookmarkWhereInput
    /**
     * Limit how many NewsBookmarks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NewsBookmark upsert
   */
  export type NewsBookmarkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    /**
     * The filter to search for the NewsBookmark to update in case it exists.
     */
    where: NewsBookmarkWhereUniqueInput
    /**
     * In case the NewsBookmark found by the `where` argument doesn't exist, create a new NewsBookmark with this data.
     */
    create: XOR<NewsBookmarkCreateInput, NewsBookmarkUncheckedCreateInput>
    /**
     * In case the NewsBookmark was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NewsBookmarkUpdateInput, NewsBookmarkUncheckedUpdateInput>
  }

  /**
   * NewsBookmark delete
   */
  export type NewsBookmarkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
    /**
     * Filter which NewsBookmark to delete.
     */
    where: NewsBookmarkWhereUniqueInput
  }

  /**
   * NewsBookmark deleteMany
   */
  export type NewsBookmarkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NewsBookmarks to delete
     */
    where?: NewsBookmarkWhereInput
    /**
     * Limit how many NewsBookmarks to delete.
     */
    limit?: number
  }

  /**
   * NewsBookmark without action
   */
  export type NewsBookmarkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NewsBookmark
     */
    select?: NewsBookmarkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NewsBookmark
     */
    omit?: NewsBookmarkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NewsBookmarkInclude<ExtArgs> | null
  }


  /**
   * Model TradeNewsLink
   */

  export type AggregateTradeNewsLink = {
    _count: TradeNewsLinkCountAggregateOutputType | null
    _min: TradeNewsLinkMinAggregateOutputType | null
    _max: TradeNewsLinkMaxAggregateOutputType | null
  }

  export type TradeNewsLinkMinAggregateOutputType = {
    id: string | null
    tradeId: string | null
    newsId: string | null
    reason: string | null
  }

  export type TradeNewsLinkMaxAggregateOutputType = {
    id: string | null
    tradeId: string | null
    newsId: string | null
    reason: string | null
  }

  export type TradeNewsLinkCountAggregateOutputType = {
    id: number
    tradeId: number
    newsId: number
    reason: number
    _all: number
  }


  export type TradeNewsLinkMinAggregateInputType = {
    id?: true
    tradeId?: true
    newsId?: true
    reason?: true
  }

  export type TradeNewsLinkMaxAggregateInputType = {
    id?: true
    tradeId?: true
    newsId?: true
    reason?: true
  }

  export type TradeNewsLinkCountAggregateInputType = {
    id?: true
    tradeId?: true
    newsId?: true
    reason?: true
    _all?: true
  }

  export type TradeNewsLinkAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeNewsLink to aggregate.
     */
    where?: TradeNewsLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeNewsLinks to fetch.
     */
    orderBy?: TradeNewsLinkOrderByWithRelationInput | TradeNewsLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradeNewsLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeNewsLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeNewsLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradeNewsLinks
    **/
    _count?: true | TradeNewsLinkCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradeNewsLinkMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradeNewsLinkMaxAggregateInputType
  }

  export type GetTradeNewsLinkAggregateType<T extends TradeNewsLinkAggregateArgs> = {
        [P in keyof T & keyof AggregateTradeNewsLink]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradeNewsLink[P]>
      : GetScalarType<T[P], AggregateTradeNewsLink[P]>
  }




  export type TradeNewsLinkGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeNewsLinkWhereInput
    orderBy?: TradeNewsLinkOrderByWithAggregationInput | TradeNewsLinkOrderByWithAggregationInput[]
    by: TradeNewsLinkScalarFieldEnum[] | TradeNewsLinkScalarFieldEnum
    having?: TradeNewsLinkScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradeNewsLinkCountAggregateInputType | true
    _min?: TradeNewsLinkMinAggregateInputType
    _max?: TradeNewsLinkMaxAggregateInputType
  }

  export type TradeNewsLinkGroupByOutputType = {
    id: string
    tradeId: string
    newsId: string
    reason: string | null
    _count: TradeNewsLinkCountAggregateOutputType | null
    _min: TradeNewsLinkMinAggregateOutputType | null
    _max: TradeNewsLinkMaxAggregateOutputType | null
  }

  type GetTradeNewsLinkGroupByPayload<T extends TradeNewsLinkGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeNewsLinkGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradeNewsLinkGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradeNewsLinkGroupByOutputType[P]>
            : GetScalarType<T[P], TradeNewsLinkGroupByOutputType[P]>
        }
      >
    >


  export type TradeNewsLinkSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tradeId?: boolean
    newsId?: boolean
    reason?: boolean
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeNewsLink"]>

  export type TradeNewsLinkSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tradeId?: boolean
    newsId?: boolean
    reason?: boolean
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeNewsLink"]>

  export type TradeNewsLinkSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tradeId?: boolean
    newsId?: boolean
    reason?: boolean
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeNewsLink"]>

  export type TradeNewsLinkSelectScalar = {
    id?: boolean
    tradeId?: boolean
    newsId?: boolean
    reason?: boolean
  }

  export type TradeNewsLinkOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tradeId" | "newsId" | "reason", ExtArgs["result"]["tradeNewsLink"]>
  export type TradeNewsLinkInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }
  export type TradeNewsLinkIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }
  export type TradeNewsLinkIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    news?: boolean | EnrichedNewsDefaultArgs<ExtArgs>
  }

  export type $TradeNewsLinkPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradeNewsLink"
    objects: {
      news: Prisma.$EnrichedNewsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tradeId: string
      newsId: string
      reason: string | null
    }, ExtArgs["result"]["tradeNewsLink"]>
    composites: {}
  }

  type TradeNewsLinkGetPayload<S extends boolean | null | undefined | TradeNewsLinkDefaultArgs> = $Result.GetResult<Prisma.$TradeNewsLinkPayload, S>

  type TradeNewsLinkCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradeNewsLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradeNewsLinkCountAggregateInputType | true
    }

  export interface TradeNewsLinkDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradeNewsLink'], meta: { name: 'TradeNewsLink' } }
    /**
     * Find zero or one TradeNewsLink that matches the filter.
     * @param {TradeNewsLinkFindUniqueArgs} args - Arguments to find a TradeNewsLink
     * @example
     * // Get one TradeNewsLink
     * const tradeNewsLink = await prisma.tradeNewsLink.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradeNewsLinkFindUniqueArgs>(args: SelectSubset<T, TradeNewsLinkFindUniqueArgs<ExtArgs>>): Prisma__TradeNewsLinkClient<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradeNewsLink that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradeNewsLinkFindUniqueOrThrowArgs} args - Arguments to find a TradeNewsLink
     * @example
     * // Get one TradeNewsLink
     * const tradeNewsLink = await prisma.tradeNewsLink.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradeNewsLinkFindUniqueOrThrowArgs>(args: SelectSubset<T, TradeNewsLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradeNewsLinkClient<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeNewsLink that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeNewsLinkFindFirstArgs} args - Arguments to find a TradeNewsLink
     * @example
     * // Get one TradeNewsLink
     * const tradeNewsLink = await prisma.tradeNewsLink.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradeNewsLinkFindFirstArgs>(args?: SelectSubset<T, TradeNewsLinkFindFirstArgs<ExtArgs>>): Prisma__TradeNewsLinkClient<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeNewsLink that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeNewsLinkFindFirstOrThrowArgs} args - Arguments to find a TradeNewsLink
     * @example
     * // Get one TradeNewsLink
     * const tradeNewsLink = await prisma.tradeNewsLink.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradeNewsLinkFindFirstOrThrowArgs>(args?: SelectSubset<T, TradeNewsLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradeNewsLinkClient<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradeNewsLinks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeNewsLinkFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradeNewsLinks
     * const tradeNewsLinks = await prisma.tradeNewsLink.findMany()
     * 
     * // Get first 10 TradeNewsLinks
     * const tradeNewsLinks = await prisma.tradeNewsLink.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradeNewsLinkWithIdOnly = await prisma.tradeNewsLink.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradeNewsLinkFindManyArgs>(args?: SelectSubset<T, TradeNewsLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradeNewsLink.
     * @param {TradeNewsLinkCreateArgs} args - Arguments to create a TradeNewsLink.
     * @example
     * // Create one TradeNewsLink
     * const TradeNewsLink = await prisma.tradeNewsLink.create({
     *   data: {
     *     // ... data to create a TradeNewsLink
     *   }
     * })
     * 
     */
    create<T extends TradeNewsLinkCreateArgs>(args: SelectSubset<T, TradeNewsLinkCreateArgs<ExtArgs>>): Prisma__TradeNewsLinkClient<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradeNewsLinks.
     * @param {TradeNewsLinkCreateManyArgs} args - Arguments to create many TradeNewsLinks.
     * @example
     * // Create many TradeNewsLinks
     * const tradeNewsLink = await prisma.tradeNewsLink.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradeNewsLinkCreateManyArgs>(args?: SelectSubset<T, TradeNewsLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradeNewsLinks and returns the data saved in the database.
     * @param {TradeNewsLinkCreateManyAndReturnArgs} args - Arguments to create many TradeNewsLinks.
     * @example
     * // Create many TradeNewsLinks
     * const tradeNewsLink = await prisma.tradeNewsLink.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradeNewsLinks and only return the `id`
     * const tradeNewsLinkWithIdOnly = await prisma.tradeNewsLink.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradeNewsLinkCreateManyAndReturnArgs>(args?: SelectSubset<T, TradeNewsLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradeNewsLink.
     * @param {TradeNewsLinkDeleteArgs} args - Arguments to delete one TradeNewsLink.
     * @example
     * // Delete one TradeNewsLink
     * const TradeNewsLink = await prisma.tradeNewsLink.delete({
     *   where: {
     *     // ... filter to delete one TradeNewsLink
     *   }
     * })
     * 
     */
    delete<T extends TradeNewsLinkDeleteArgs>(args: SelectSubset<T, TradeNewsLinkDeleteArgs<ExtArgs>>): Prisma__TradeNewsLinkClient<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradeNewsLink.
     * @param {TradeNewsLinkUpdateArgs} args - Arguments to update one TradeNewsLink.
     * @example
     * // Update one TradeNewsLink
     * const tradeNewsLink = await prisma.tradeNewsLink.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradeNewsLinkUpdateArgs>(args: SelectSubset<T, TradeNewsLinkUpdateArgs<ExtArgs>>): Prisma__TradeNewsLinkClient<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradeNewsLinks.
     * @param {TradeNewsLinkDeleteManyArgs} args - Arguments to filter TradeNewsLinks to delete.
     * @example
     * // Delete a few TradeNewsLinks
     * const { count } = await prisma.tradeNewsLink.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradeNewsLinkDeleteManyArgs>(args?: SelectSubset<T, TradeNewsLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeNewsLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeNewsLinkUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradeNewsLinks
     * const tradeNewsLink = await prisma.tradeNewsLink.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradeNewsLinkUpdateManyArgs>(args: SelectSubset<T, TradeNewsLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeNewsLinks and returns the data updated in the database.
     * @param {TradeNewsLinkUpdateManyAndReturnArgs} args - Arguments to update many TradeNewsLinks.
     * @example
     * // Update many TradeNewsLinks
     * const tradeNewsLink = await prisma.tradeNewsLink.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradeNewsLinks and only return the `id`
     * const tradeNewsLinkWithIdOnly = await prisma.tradeNewsLink.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TradeNewsLinkUpdateManyAndReturnArgs>(args: SelectSubset<T, TradeNewsLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradeNewsLink.
     * @param {TradeNewsLinkUpsertArgs} args - Arguments to update or create a TradeNewsLink.
     * @example
     * // Update or create a TradeNewsLink
     * const tradeNewsLink = await prisma.tradeNewsLink.upsert({
     *   create: {
     *     // ... data to create a TradeNewsLink
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradeNewsLink we want to update
     *   }
     * })
     */
    upsert<T extends TradeNewsLinkUpsertArgs>(args: SelectSubset<T, TradeNewsLinkUpsertArgs<ExtArgs>>): Prisma__TradeNewsLinkClient<$Result.GetResult<Prisma.$TradeNewsLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradeNewsLinks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeNewsLinkCountArgs} args - Arguments to filter TradeNewsLinks to count.
     * @example
     * // Count the number of TradeNewsLinks
     * const count = await prisma.tradeNewsLink.count({
     *   where: {
     *     // ... the filter for the TradeNewsLinks we want to count
     *   }
     * })
    **/
    count<T extends TradeNewsLinkCountArgs>(
      args?: Subset<T, TradeNewsLinkCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeNewsLinkCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradeNewsLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeNewsLinkAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TradeNewsLinkAggregateArgs>(args: Subset<T, TradeNewsLinkAggregateArgs>): Prisma.PrismaPromise<GetTradeNewsLinkAggregateType<T>>

    /**
     * Group by TradeNewsLink.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeNewsLinkGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TradeNewsLinkGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeNewsLinkGroupByArgs['orderBy'] }
        : { orderBy?: TradeNewsLinkGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradeNewsLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradeNewsLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradeNewsLink model
   */
  readonly fields: TradeNewsLinkFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradeNewsLink.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeNewsLinkClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    news<T extends EnrichedNewsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnrichedNewsDefaultArgs<ExtArgs>>): Prisma__EnrichedNewsClient<$Result.GetResult<Prisma.$EnrichedNewsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TradeNewsLink model
   */
  interface TradeNewsLinkFieldRefs {
    readonly id: FieldRef<"TradeNewsLink", 'String'>
    readonly tradeId: FieldRef<"TradeNewsLink", 'String'>
    readonly newsId: FieldRef<"TradeNewsLink", 'String'>
    readonly reason: FieldRef<"TradeNewsLink", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TradeNewsLink findUnique
   */
  export type TradeNewsLinkFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    /**
     * Filter, which TradeNewsLink to fetch.
     */
    where: TradeNewsLinkWhereUniqueInput
  }

  /**
   * TradeNewsLink findUniqueOrThrow
   */
  export type TradeNewsLinkFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    /**
     * Filter, which TradeNewsLink to fetch.
     */
    where: TradeNewsLinkWhereUniqueInput
  }

  /**
   * TradeNewsLink findFirst
   */
  export type TradeNewsLinkFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    /**
     * Filter, which TradeNewsLink to fetch.
     */
    where?: TradeNewsLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeNewsLinks to fetch.
     */
    orderBy?: TradeNewsLinkOrderByWithRelationInput | TradeNewsLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeNewsLinks.
     */
    cursor?: TradeNewsLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeNewsLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeNewsLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeNewsLinks.
     */
    distinct?: TradeNewsLinkScalarFieldEnum | TradeNewsLinkScalarFieldEnum[]
  }

  /**
   * TradeNewsLink findFirstOrThrow
   */
  export type TradeNewsLinkFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    /**
     * Filter, which TradeNewsLink to fetch.
     */
    where?: TradeNewsLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeNewsLinks to fetch.
     */
    orderBy?: TradeNewsLinkOrderByWithRelationInput | TradeNewsLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeNewsLinks.
     */
    cursor?: TradeNewsLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeNewsLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeNewsLinks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeNewsLinks.
     */
    distinct?: TradeNewsLinkScalarFieldEnum | TradeNewsLinkScalarFieldEnum[]
  }

  /**
   * TradeNewsLink findMany
   */
  export type TradeNewsLinkFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    /**
     * Filter, which TradeNewsLinks to fetch.
     */
    where?: TradeNewsLinkWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeNewsLinks to fetch.
     */
    orderBy?: TradeNewsLinkOrderByWithRelationInput | TradeNewsLinkOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradeNewsLinks.
     */
    cursor?: TradeNewsLinkWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeNewsLinks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeNewsLinks.
     */
    skip?: number
    distinct?: TradeNewsLinkScalarFieldEnum | TradeNewsLinkScalarFieldEnum[]
  }

  /**
   * TradeNewsLink create
   */
  export type TradeNewsLinkCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    /**
     * The data needed to create a TradeNewsLink.
     */
    data: XOR<TradeNewsLinkCreateInput, TradeNewsLinkUncheckedCreateInput>
  }

  /**
   * TradeNewsLink createMany
   */
  export type TradeNewsLinkCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradeNewsLinks.
     */
    data: TradeNewsLinkCreateManyInput | TradeNewsLinkCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradeNewsLink createManyAndReturn
   */
  export type TradeNewsLinkCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * The data used to create many TradeNewsLinks.
     */
    data: TradeNewsLinkCreateManyInput | TradeNewsLinkCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeNewsLink update
   */
  export type TradeNewsLinkUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    /**
     * The data needed to update a TradeNewsLink.
     */
    data: XOR<TradeNewsLinkUpdateInput, TradeNewsLinkUncheckedUpdateInput>
    /**
     * Choose, which TradeNewsLink to update.
     */
    where: TradeNewsLinkWhereUniqueInput
  }

  /**
   * TradeNewsLink updateMany
   */
  export type TradeNewsLinkUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradeNewsLinks.
     */
    data: XOR<TradeNewsLinkUpdateManyMutationInput, TradeNewsLinkUncheckedUpdateManyInput>
    /**
     * Filter which TradeNewsLinks to update
     */
    where?: TradeNewsLinkWhereInput
    /**
     * Limit how many TradeNewsLinks to update.
     */
    limit?: number
  }

  /**
   * TradeNewsLink updateManyAndReturn
   */
  export type TradeNewsLinkUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * The data used to update TradeNewsLinks.
     */
    data: XOR<TradeNewsLinkUpdateManyMutationInput, TradeNewsLinkUncheckedUpdateManyInput>
    /**
     * Filter which TradeNewsLinks to update
     */
    where?: TradeNewsLinkWhereInput
    /**
     * Limit how many TradeNewsLinks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeNewsLink upsert
   */
  export type TradeNewsLinkUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    /**
     * The filter to search for the TradeNewsLink to update in case it exists.
     */
    where: TradeNewsLinkWhereUniqueInput
    /**
     * In case the TradeNewsLink found by the `where` argument doesn't exist, create a new TradeNewsLink with this data.
     */
    create: XOR<TradeNewsLinkCreateInput, TradeNewsLinkUncheckedCreateInput>
    /**
     * In case the TradeNewsLink was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradeNewsLinkUpdateInput, TradeNewsLinkUncheckedUpdateInput>
  }

  /**
   * TradeNewsLink delete
   */
  export type TradeNewsLinkDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
    /**
     * Filter which TradeNewsLink to delete.
     */
    where: TradeNewsLinkWhereUniqueInput
  }

  /**
   * TradeNewsLink deleteMany
   */
  export type TradeNewsLinkDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeNewsLinks to delete
     */
    where?: TradeNewsLinkWhereInput
    /**
     * Limit how many TradeNewsLinks to delete.
     */
    limit?: number
  }

  /**
   * TradeNewsLink without action
   */
  export type TradeNewsLinkDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeNewsLink
     */
    select?: TradeNewsLinkSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeNewsLink
     */
    omit?: TradeNewsLinkOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeNewsLinkInclude<ExtArgs> | null
  }


  /**
   * Model UserWatchlist
   */

  export type AggregateUserWatchlist = {
    _count: UserWatchlistCountAggregateOutputType | null
    _min: UserWatchlistMinAggregateOutputType | null
    _max: UserWatchlistMaxAggregateOutputType | null
  }

  export type UserWatchlistMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    value: string | null
    createdAt: Date | null
  }

  export type UserWatchlistMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    value: string | null
    createdAt: Date | null
  }

  export type UserWatchlistCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    value: number
    createdAt: number
    _all: number
  }


  export type UserWatchlistMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    value?: true
    createdAt?: true
  }

  export type UserWatchlistMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    value?: true
    createdAt?: true
  }

  export type UserWatchlistCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    value?: true
    createdAt?: true
    _all?: true
  }

  export type UserWatchlistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserWatchlist to aggregate.
     */
    where?: UserWatchlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserWatchlists to fetch.
     */
    orderBy?: UserWatchlistOrderByWithRelationInput | UserWatchlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWatchlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserWatchlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserWatchlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserWatchlists
    **/
    _count?: true | UserWatchlistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserWatchlistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserWatchlistMaxAggregateInputType
  }

  export type GetUserWatchlistAggregateType<T extends UserWatchlistAggregateArgs> = {
        [P in keyof T & keyof AggregateUserWatchlist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserWatchlist[P]>
      : GetScalarType<T[P], AggregateUserWatchlist[P]>
  }




  export type UserWatchlistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWatchlistWhereInput
    orderBy?: UserWatchlistOrderByWithAggregationInput | UserWatchlistOrderByWithAggregationInput[]
    by: UserWatchlistScalarFieldEnum[] | UserWatchlistScalarFieldEnum
    having?: UserWatchlistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserWatchlistCountAggregateInputType | true
    _min?: UserWatchlistMinAggregateInputType
    _max?: UserWatchlistMaxAggregateInputType
  }

  export type UserWatchlistGroupByOutputType = {
    id: string
    userId: string
    type: string
    value: string
    createdAt: Date
    _count: UserWatchlistCountAggregateOutputType | null
    _min: UserWatchlistMinAggregateOutputType | null
    _max: UserWatchlistMaxAggregateOutputType | null
  }

  type GetUserWatchlistGroupByPayload<T extends UserWatchlistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserWatchlistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserWatchlistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserWatchlistGroupByOutputType[P]>
            : GetScalarType<T[P], UserWatchlistGroupByOutputType[P]>
        }
      >
    >


  export type UserWatchlistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    value?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userWatchlist"]>

  export type UserWatchlistSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    value?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userWatchlist"]>

  export type UserWatchlistSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    value?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userWatchlist"]>

  export type UserWatchlistSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    value?: boolean
    createdAt?: boolean
  }

  export type UserWatchlistOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "value" | "createdAt", ExtArgs["result"]["userWatchlist"]>

  export type $UserWatchlistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserWatchlist"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      value: string
      createdAt: Date
    }, ExtArgs["result"]["userWatchlist"]>
    composites: {}
  }

  type UserWatchlistGetPayload<S extends boolean | null | undefined | UserWatchlistDefaultArgs> = $Result.GetResult<Prisma.$UserWatchlistPayload, S>

  type UserWatchlistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserWatchlistFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserWatchlistCountAggregateInputType | true
    }

  export interface UserWatchlistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserWatchlist'], meta: { name: 'UserWatchlist' } }
    /**
     * Find zero or one UserWatchlist that matches the filter.
     * @param {UserWatchlistFindUniqueArgs} args - Arguments to find a UserWatchlist
     * @example
     * // Get one UserWatchlist
     * const userWatchlist = await prisma.userWatchlist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserWatchlistFindUniqueArgs>(args: SelectSubset<T, UserWatchlistFindUniqueArgs<ExtArgs>>): Prisma__UserWatchlistClient<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserWatchlist that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserWatchlistFindUniqueOrThrowArgs} args - Arguments to find a UserWatchlist
     * @example
     * // Get one UserWatchlist
     * const userWatchlist = await prisma.userWatchlist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserWatchlistFindUniqueOrThrowArgs>(args: SelectSubset<T, UserWatchlistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserWatchlistClient<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserWatchlist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatchlistFindFirstArgs} args - Arguments to find a UserWatchlist
     * @example
     * // Get one UserWatchlist
     * const userWatchlist = await prisma.userWatchlist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserWatchlistFindFirstArgs>(args?: SelectSubset<T, UserWatchlistFindFirstArgs<ExtArgs>>): Prisma__UserWatchlistClient<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserWatchlist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatchlistFindFirstOrThrowArgs} args - Arguments to find a UserWatchlist
     * @example
     * // Get one UserWatchlist
     * const userWatchlist = await prisma.userWatchlist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserWatchlistFindFirstOrThrowArgs>(args?: SelectSubset<T, UserWatchlistFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserWatchlistClient<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserWatchlists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatchlistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserWatchlists
     * const userWatchlists = await prisma.userWatchlist.findMany()
     * 
     * // Get first 10 UserWatchlists
     * const userWatchlists = await prisma.userWatchlist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWatchlistWithIdOnly = await prisma.userWatchlist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserWatchlistFindManyArgs>(args?: SelectSubset<T, UserWatchlistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserWatchlist.
     * @param {UserWatchlistCreateArgs} args - Arguments to create a UserWatchlist.
     * @example
     * // Create one UserWatchlist
     * const UserWatchlist = await prisma.userWatchlist.create({
     *   data: {
     *     // ... data to create a UserWatchlist
     *   }
     * })
     * 
     */
    create<T extends UserWatchlistCreateArgs>(args: SelectSubset<T, UserWatchlistCreateArgs<ExtArgs>>): Prisma__UserWatchlistClient<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserWatchlists.
     * @param {UserWatchlistCreateManyArgs} args - Arguments to create many UserWatchlists.
     * @example
     * // Create many UserWatchlists
     * const userWatchlist = await prisma.userWatchlist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserWatchlistCreateManyArgs>(args?: SelectSubset<T, UserWatchlistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserWatchlists and returns the data saved in the database.
     * @param {UserWatchlistCreateManyAndReturnArgs} args - Arguments to create many UserWatchlists.
     * @example
     * // Create many UserWatchlists
     * const userWatchlist = await prisma.userWatchlist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserWatchlists and only return the `id`
     * const userWatchlistWithIdOnly = await prisma.userWatchlist.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserWatchlistCreateManyAndReturnArgs>(args?: SelectSubset<T, UserWatchlistCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserWatchlist.
     * @param {UserWatchlistDeleteArgs} args - Arguments to delete one UserWatchlist.
     * @example
     * // Delete one UserWatchlist
     * const UserWatchlist = await prisma.userWatchlist.delete({
     *   where: {
     *     // ... filter to delete one UserWatchlist
     *   }
     * })
     * 
     */
    delete<T extends UserWatchlistDeleteArgs>(args: SelectSubset<T, UserWatchlistDeleteArgs<ExtArgs>>): Prisma__UserWatchlistClient<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserWatchlist.
     * @param {UserWatchlistUpdateArgs} args - Arguments to update one UserWatchlist.
     * @example
     * // Update one UserWatchlist
     * const userWatchlist = await prisma.userWatchlist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserWatchlistUpdateArgs>(args: SelectSubset<T, UserWatchlistUpdateArgs<ExtArgs>>): Prisma__UserWatchlistClient<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserWatchlists.
     * @param {UserWatchlistDeleteManyArgs} args - Arguments to filter UserWatchlists to delete.
     * @example
     * // Delete a few UserWatchlists
     * const { count } = await prisma.userWatchlist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserWatchlistDeleteManyArgs>(args?: SelectSubset<T, UserWatchlistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserWatchlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatchlistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserWatchlists
     * const userWatchlist = await prisma.userWatchlist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserWatchlistUpdateManyArgs>(args: SelectSubset<T, UserWatchlistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserWatchlists and returns the data updated in the database.
     * @param {UserWatchlistUpdateManyAndReturnArgs} args - Arguments to update many UserWatchlists.
     * @example
     * // Update many UserWatchlists
     * const userWatchlist = await prisma.userWatchlist.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserWatchlists and only return the `id`
     * const userWatchlistWithIdOnly = await prisma.userWatchlist.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserWatchlistUpdateManyAndReturnArgs>(args: SelectSubset<T, UserWatchlistUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserWatchlist.
     * @param {UserWatchlistUpsertArgs} args - Arguments to update or create a UserWatchlist.
     * @example
     * // Update or create a UserWatchlist
     * const userWatchlist = await prisma.userWatchlist.upsert({
     *   create: {
     *     // ... data to create a UserWatchlist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserWatchlist we want to update
     *   }
     * })
     */
    upsert<T extends UserWatchlistUpsertArgs>(args: SelectSubset<T, UserWatchlistUpsertArgs<ExtArgs>>): Prisma__UserWatchlistClient<$Result.GetResult<Prisma.$UserWatchlistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserWatchlists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatchlistCountArgs} args - Arguments to filter UserWatchlists to count.
     * @example
     * // Count the number of UserWatchlists
     * const count = await prisma.userWatchlist.count({
     *   where: {
     *     // ... the filter for the UserWatchlists we want to count
     *   }
     * })
    **/
    count<T extends UserWatchlistCountArgs>(
      args?: Subset<T, UserWatchlistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserWatchlistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserWatchlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatchlistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserWatchlistAggregateArgs>(args: Subset<T, UserWatchlistAggregateArgs>): Prisma.PrismaPromise<GetUserWatchlistAggregateType<T>>

    /**
     * Group by UserWatchlist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserWatchlistGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserWatchlistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserWatchlistGroupByArgs['orderBy'] }
        : { orderBy?: UserWatchlistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserWatchlistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserWatchlistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserWatchlist model
   */
  readonly fields: UserWatchlistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserWatchlist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserWatchlistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserWatchlist model
   */
  interface UserWatchlistFieldRefs {
    readonly id: FieldRef<"UserWatchlist", 'String'>
    readonly userId: FieldRef<"UserWatchlist", 'String'>
    readonly type: FieldRef<"UserWatchlist", 'String'>
    readonly value: FieldRef<"UserWatchlist", 'String'>
    readonly createdAt: FieldRef<"UserWatchlist", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserWatchlist findUnique
   */
  export type UserWatchlistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * Filter, which UserWatchlist to fetch.
     */
    where: UserWatchlistWhereUniqueInput
  }

  /**
   * UserWatchlist findUniqueOrThrow
   */
  export type UserWatchlistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * Filter, which UserWatchlist to fetch.
     */
    where: UserWatchlistWhereUniqueInput
  }

  /**
   * UserWatchlist findFirst
   */
  export type UserWatchlistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * Filter, which UserWatchlist to fetch.
     */
    where?: UserWatchlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserWatchlists to fetch.
     */
    orderBy?: UserWatchlistOrderByWithRelationInput | UserWatchlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserWatchlists.
     */
    cursor?: UserWatchlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserWatchlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserWatchlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserWatchlists.
     */
    distinct?: UserWatchlistScalarFieldEnum | UserWatchlistScalarFieldEnum[]
  }

  /**
   * UserWatchlist findFirstOrThrow
   */
  export type UserWatchlistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * Filter, which UserWatchlist to fetch.
     */
    where?: UserWatchlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserWatchlists to fetch.
     */
    orderBy?: UserWatchlistOrderByWithRelationInput | UserWatchlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserWatchlists.
     */
    cursor?: UserWatchlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserWatchlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserWatchlists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserWatchlists.
     */
    distinct?: UserWatchlistScalarFieldEnum | UserWatchlistScalarFieldEnum[]
  }

  /**
   * UserWatchlist findMany
   */
  export type UserWatchlistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * Filter, which UserWatchlists to fetch.
     */
    where?: UserWatchlistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserWatchlists to fetch.
     */
    orderBy?: UserWatchlistOrderByWithRelationInput | UserWatchlistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserWatchlists.
     */
    cursor?: UserWatchlistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserWatchlists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserWatchlists.
     */
    skip?: number
    distinct?: UserWatchlistScalarFieldEnum | UserWatchlistScalarFieldEnum[]
  }

  /**
   * UserWatchlist create
   */
  export type UserWatchlistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * The data needed to create a UserWatchlist.
     */
    data: XOR<UserWatchlistCreateInput, UserWatchlistUncheckedCreateInput>
  }

  /**
   * UserWatchlist createMany
   */
  export type UserWatchlistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserWatchlists.
     */
    data: UserWatchlistCreateManyInput | UserWatchlistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserWatchlist createManyAndReturn
   */
  export type UserWatchlistCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * The data used to create many UserWatchlists.
     */
    data: UserWatchlistCreateManyInput | UserWatchlistCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserWatchlist update
   */
  export type UserWatchlistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * The data needed to update a UserWatchlist.
     */
    data: XOR<UserWatchlistUpdateInput, UserWatchlistUncheckedUpdateInput>
    /**
     * Choose, which UserWatchlist to update.
     */
    where: UserWatchlistWhereUniqueInput
  }

  /**
   * UserWatchlist updateMany
   */
  export type UserWatchlistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserWatchlists.
     */
    data: XOR<UserWatchlistUpdateManyMutationInput, UserWatchlistUncheckedUpdateManyInput>
    /**
     * Filter which UserWatchlists to update
     */
    where?: UserWatchlistWhereInput
    /**
     * Limit how many UserWatchlists to update.
     */
    limit?: number
  }

  /**
   * UserWatchlist updateManyAndReturn
   */
  export type UserWatchlistUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * The data used to update UserWatchlists.
     */
    data: XOR<UserWatchlistUpdateManyMutationInput, UserWatchlistUncheckedUpdateManyInput>
    /**
     * Filter which UserWatchlists to update
     */
    where?: UserWatchlistWhereInput
    /**
     * Limit how many UserWatchlists to update.
     */
    limit?: number
  }

  /**
   * UserWatchlist upsert
   */
  export type UserWatchlistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * The filter to search for the UserWatchlist to update in case it exists.
     */
    where: UserWatchlistWhereUniqueInput
    /**
     * In case the UserWatchlist found by the `where` argument doesn't exist, create a new UserWatchlist with this data.
     */
    create: XOR<UserWatchlistCreateInput, UserWatchlistUncheckedCreateInput>
    /**
     * In case the UserWatchlist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserWatchlistUpdateInput, UserWatchlistUncheckedUpdateInput>
  }

  /**
   * UserWatchlist delete
   */
  export type UserWatchlistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
    /**
     * Filter which UserWatchlist to delete.
     */
    where: UserWatchlistWhereUniqueInput
  }

  /**
   * UserWatchlist deleteMany
   */
  export type UserWatchlistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserWatchlists to delete
     */
    where?: UserWatchlistWhereInput
    /**
     * Limit how many UserWatchlists to delete.
     */
    limit?: number
  }

  /**
   * UserWatchlist without action
   */
  export type UserWatchlistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserWatchlist
     */
    select?: UserWatchlistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserWatchlist
     */
    omit?: UserWatchlistOmit<ExtArgs> | null
  }


  /**
   * Model OiHistory
   */

  export type AggregateOiHistory = {
    _count: OiHistoryCountAggregateOutputType | null
    _avg: OiHistoryAvgAggregateOutputType | null
    _sum: OiHistorySumAggregateOutputType | null
    _min: OiHistoryMinAggregateOutputType | null
    _max: OiHistoryMaxAggregateOutputType | null
  }

  export type OiHistoryAvgAggregateOutputType = {
    strikePrice: number | null
    openInterest: number | null
    oiChange: number | null
    volume: number | null
    ltp: Decimal | null
    impliedVolatility: Decimal | null
    delta: Decimal | null
    gamma: Decimal | null
    theta: Decimal | null
    vega: Decimal | null
  }

  export type OiHistorySumAggregateOutputType = {
    strikePrice: number | null
    openInterest: bigint | null
    oiChange: number | null
    volume: bigint | null
    ltp: Decimal | null
    impliedVolatility: Decimal | null
    delta: Decimal | null
    gamma: Decimal | null
    theta: Decimal | null
    vega: Decimal | null
  }

  export type OiHistoryMinAggregateOutputType = {
    time: Date | null
    symbol: string | null
    expiryDate: Date | null
    strikePrice: number | null
    optionType: string | null
    openInterest: bigint | null
    oiChange: number | null
    volume: bigint | null
    ltp: Decimal | null
    impliedVolatility: Decimal | null
    delta: Decimal | null
    gamma: Decimal | null
    theta: Decimal | null
    vega: Decimal | null
  }

  export type OiHistoryMaxAggregateOutputType = {
    time: Date | null
    symbol: string | null
    expiryDate: Date | null
    strikePrice: number | null
    optionType: string | null
    openInterest: bigint | null
    oiChange: number | null
    volume: bigint | null
    ltp: Decimal | null
    impliedVolatility: Decimal | null
    delta: Decimal | null
    gamma: Decimal | null
    theta: Decimal | null
    vega: Decimal | null
  }

  export type OiHistoryCountAggregateOutputType = {
    time: number
    symbol: number
    expiryDate: number
    strikePrice: number
    optionType: number
    openInterest: number
    oiChange: number
    volume: number
    ltp: number
    impliedVolatility: number
    delta: number
    gamma: number
    theta: number
    vega: number
    _all: number
  }


  export type OiHistoryAvgAggregateInputType = {
    strikePrice?: true
    openInterest?: true
    oiChange?: true
    volume?: true
    ltp?: true
    impliedVolatility?: true
    delta?: true
    gamma?: true
    theta?: true
    vega?: true
  }

  export type OiHistorySumAggregateInputType = {
    strikePrice?: true
    openInterest?: true
    oiChange?: true
    volume?: true
    ltp?: true
    impliedVolatility?: true
    delta?: true
    gamma?: true
    theta?: true
    vega?: true
  }

  export type OiHistoryMinAggregateInputType = {
    time?: true
    symbol?: true
    expiryDate?: true
    strikePrice?: true
    optionType?: true
    openInterest?: true
    oiChange?: true
    volume?: true
    ltp?: true
    impliedVolatility?: true
    delta?: true
    gamma?: true
    theta?: true
    vega?: true
  }

  export type OiHistoryMaxAggregateInputType = {
    time?: true
    symbol?: true
    expiryDate?: true
    strikePrice?: true
    optionType?: true
    openInterest?: true
    oiChange?: true
    volume?: true
    ltp?: true
    impliedVolatility?: true
    delta?: true
    gamma?: true
    theta?: true
    vega?: true
  }

  export type OiHistoryCountAggregateInputType = {
    time?: true
    symbol?: true
    expiryDate?: true
    strikePrice?: true
    optionType?: true
    openInterest?: true
    oiChange?: true
    volume?: true
    ltp?: true
    impliedVolatility?: true
    delta?: true
    gamma?: true
    theta?: true
    vega?: true
    _all?: true
  }

  export type OiHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OiHistory to aggregate.
     */
    where?: OiHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OiHistories to fetch.
     */
    orderBy?: OiHistoryOrderByWithRelationInput | OiHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OiHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OiHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OiHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OiHistories
    **/
    _count?: true | OiHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OiHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OiHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OiHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OiHistoryMaxAggregateInputType
  }

  export type GetOiHistoryAggregateType<T extends OiHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateOiHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOiHistory[P]>
      : GetScalarType<T[P], AggregateOiHistory[P]>
  }




  export type OiHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OiHistoryWhereInput
    orderBy?: OiHistoryOrderByWithAggregationInput | OiHistoryOrderByWithAggregationInput[]
    by: OiHistoryScalarFieldEnum[] | OiHistoryScalarFieldEnum
    having?: OiHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OiHistoryCountAggregateInputType | true
    _avg?: OiHistoryAvgAggregateInputType
    _sum?: OiHistorySumAggregateInputType
    _min?: OiHistoryMinAggregateInputType
    _max?: OiHistoryMaxAggregateInputType
  }

  export type OiHistoryGroupByOutputType = {
    time: Date
    symbol: string
    expiryDate: Date
    strikePrice: number
    optionType: string
    openInterest: bigint
    oiChange: number | null
    volume: bigint
    ltp: Decimal
    impliedVolatility: Decimal | null
    delta: Decimal | null
    gamma: Decimal | null
    theta: Decimal | null
    vega: Decimal | null
    _count: OiHistoryCountAggregateOutputType | null
    _avg: OiHistoryAvgAggregateOutputType | null
    _sum: OiHistorySumAggregateOutputType | null
    _min: OiHistoryMinAggregateOutputType | null
    _max: OiHistoryMaxAggregateOutputType | null
  }

  type GetOiHistoryGroupByPayload<T extends OiHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OiHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OiHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OiHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], OiHistoryGroupByOutputType[P]>
        }
      >
    >


  export type OiHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    symbol?: boolean
    expiryDate?: boolean
    strikePrice?: boolean
    optionType?: boolean
    openInterest?: boolean
    oiChange?: boolean
    volume?: boolean
    ltp?: boolean
    impliedVolatility?: boolean
    delta?: boolean
    gamma?: boolean
    theta?: boolean
    vega?: boolean
  }, ExtArgs["result"]["oiHistory"]>

  export type OiHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    symbol?: boolean
    expiryDate?: boolean
    strikePrice?: boolean
    optionType?: boolean
    openInterest?: boolean
    oiChange?: boolean
    volume?: boolean
    ltp?: boolean
    impliedVolatility?: boolean
    delta?: boolean
    gamma?: boolean
    theta?: boolean
    vega?: boolean
  }, ExtArgs["result"]["oiHistory"]>

  export type OiHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    symbol?: boolean
    expiryDate?: boolean
    strikePrice?: boolean
    optionType?: boolean
    openInterest?: boolean
    oiChange?: boolean
    volume?: boolean
    ltp?: boolean
    impliedVolatility?: boolean
    delta?: boolean
    gamma?: boolean
    theta?: boolean
    vega?: boolean
  }, ExtArgs["result"]["oiHistory"]>

  export type OiHistorySelectScalar = {
    time?: boolean
    symbol?: boolean
    expiryDate?: boolean
    strikePrice?: boolean
    optionType?: boolean
    openInterest?: boolean
    oiChange?: boolean
    volume?: boolean
    ltp?: boolean
    impliedVolatility?: boolean
    delta?: boolean
    gamma?: boolean
    theta?: boolean
    vega?: boolean
  }

  export type OiHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"time" | "symbol" | "expiryDate" | "strikePrice" | "optionType" | "openInterest" | "oiChange" | "volume" | "ltp" | "impliedVolatility" | "delta" | "gamma" | "theta" | "vega", ExtArgs["result"]["oiHistory"]>

  export type $OiHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OiHistory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      time: Date
      symbol: string
      expiryDate: Date
      strikePrice: number
      optionType: string
      openInterest: bigint
      oiChange: number | null
      volume: bigint
      ltp: Prisma.Decimal
      impliedVolatility: Prisma.Decimal | null
      delta: Prisma.Decimal | null
      gamma: Prisma.Decimal | null
      theta: Prisma.Decimal | null
      vega: Prisma.Decimal | null
    }, ExtArgs["result"]["oiHistory"]>
    composites: {}
  }

  type OiHistoryGetPayload<S extends boolean | null | undefined | OiHistoryDefaultArgs> = $Result.GetResult<Prisma.$OiHistoryPayload, S>

  type OiHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OiHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OiHistoryCountAggregateInputType | true
    }

  export interface OiHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OiHistory'], meta: { name: 'OiHistory' } }
    /**
     * Find zero or one OiHistory that matches the filter.
     * @param {OiHistoryFindUniqueArgs} args - Arguments to find a OiHistory
     * @example
     * // Get one OiHistory
     * const oiHistory = await prisma.oiHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OiHistoryFindUniqueArgs>(args: SelectSubset<T, OiHistoryFindUniqueArgs<ExtArgs>>): Prisma__OiHistoryClient<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OiHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OiHistoryFindUniqueOrThrowArgs} args - Arguments to find a OiHistory
     * @example
     * // Get one OiHistory
     * const oiHistory = await prisma.oiHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OiHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, OiHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OiHistoryClient<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OiHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OiHistoryFindFirstArgs} args - Arguments to find a OiHistory
     * @example
     * // Get one OiHistory
     * const oiHistory = await prisma.oiHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OiHistoryFindFirstArgs>(args?: SelectSubset<T, OiHistoryFindFirstArgs<ExtArgs>>): Prisma__OiHistoryClient<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OiHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OiHistoryFindFirstOrThrowArgs} args - Arguments to find a OiHistory
     * @example
     * // Get one OiHistory
     * const oiHistory = await prisma.oiHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OiHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, OiHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__OiHistoryClient<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OiHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OiHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OiHistories
     * const oiHistories = await prisma.oiHistory.findMany()
     * 
     * // Get first 10 OiHistories
     * const oiHistories = await prisma.oiHistory.findMany({ take: 10 })
     * 
     * // Only select the `time`
     * const oiHistoryWithTimeOnly = await prisma.oiHistory.findMany({ select: { time: true } })
     * 
     */
    findMany<T extends OiHistoryFindManyArgs>(args?: SelectSubset<T, OiHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OiHistory.
     * @param {OiHistoryCreateArgs} args - Arguments to create a OiHistory.
     * @example
     * // Create one OiHistory
     * const OiHistory = await prisma.oiHistory.create({
     *   data: {
     *     // ... data to create a OiHistory
     *   }
     * })
     * 
     */
    create<T extends OiHistoryCreateArgs>(args: SelectSubset<T, OiHistoryCreateArgs<ExtArgs>>): Prisma__OiHistoryClient<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OiHistories.
     * @param {OiHistoryCreateManyArgs} args - Arguments to create many OiHistories.
     * @example
     * // Create many OiHistories
     * const oiHistory = await prisma.oiHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OiHistoryCreateManyArgs>(args?: SelectSubset<T, OiHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OiHistories and returns the data saved in the database.
     * @param {OiHistoryCreateManyAndReturnArgs} args - Arguments to create many OiHistories.
     * @example
     * // Create many OiHistories
     * const oiHistory = await prisma.oiHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OiHistories and only return the `time`
     * const oiHistoryWithTimeOnly = await prisma.oiHistory.createManyAndReturn({
     *   select: { time: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OiHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, OiHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OiHistory.
     * @param {OiHistoryDeleteArgs} args - Arguments to delete one OiHistory.
     * @example
     * // Delete one OiHistory
     * const OiHistory = await prisma.oiHistory.delete({
     *   where: {
     *     // ... filter to delete one OiHistory
     *   }
     * })
     * 
     */
    delete<T extends OiHistoryDeleteArgs>(args: SelectSubset<T, OiHistoryDeleteArgs<ExtArgs>>): Prisma__OiHistoryClient<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OiHistory.
     * @param {OiHistoryUpdateArgs} args - Arguments to update one OiHistory.
     * @example
     * // Update one OiHistory
     * const oiHistory = await prisma.oiHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OiHistoryUpdateArgs>(args: SelectSubset<T, OiHistoryUpdateArgs<ExtArgs>>): Prisma__OiHistoryClient<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OiHistories.
     * @param {OiHistoryDeleteManyArgs} args - Arguments to filter OiHistories to delete.
     * @example
     * // Delete a few OiHistories
     * const { count } = await prisma.oiHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OiHistoryDeleteManyArgs>(args?: SelectSubset<T, OiHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OiHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OiHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OiHistories
     * const oiHistory = await prisma.oiHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OiHistoryUpdateManyArgs>(args: SelectSubset<T, OiHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OiHistories and returns the data updated in the database.
     * @param {OiHistoryUpdateManyAndReturnArgs} args - Arguments to update many OiHistories.
     * @example
     * // Update many OiHistories
     * const oiHistory = await prisma.oiHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OiHistories and only return the `time`
     * const oiHistoryWithTimeOnly = await prisma.oiHistory.updateManyAndReturn({
     *   select: { time: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OiHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, OiHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OiHistory.
     * @param {OiHistoryUpsertArgs} args - Arguments to update or create a OiHistory.
     * @example
     * // Update or create a OiHistory
     * const oiHistory = await prisma.oiHistory.upsert({
     *   create: {
     *     // ... data to create a OiHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OiHistory we want to update
     *   }
     * })
     */
    upsert<T extends OiHistoryUpsertArgs>(args: SelectSubset<T, OiHistoryUpsertArgs<ExtArgs>>): Prisma__OiHistoryClient<$Result.GetResult<Prisma.$OiHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OiHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OiHistoryCountArgs} args - Arguments to filter OiHistories to count.
     * @example
     * // Count the number of OiHistories
     * const count = await prisma.oiHistory.count({
     *   where: {
     *     // ... the filter for the OiHistories we want to count
     *   }
     * })
    **/
    count<T extends OiHistoryCountArgs>(
      args?: Subset<T, OiHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OiHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OiHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OiHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OiHistoryAggregateArgs>(args: Subset<T, OiHistoryAggregateArgs>): Prisma.PrismaPromise<GetOiHistoryAggregateType<T>>

    /**
     * Group by OiHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OiHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OiHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OiHistoryGroupByArgs['orderBy'] }
        : { orderBy?: OiHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OiHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOiHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OiHistory model
   */
  readonly fields: OiHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OiHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OiHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OiHistory model
   */
  interface OiHistoryFieldRefs {
    readonly time: FieldRef<"OiHistory", 'DateTime'>
    readonly symbol: FieldRef<"OiHistory", 'String'>
    readonly expiryDate: FieldRef<"OiHistory", 'DateTime'>
    readonly strikePrice: FieldRef<"OiHistory", 'Int'>
    readonly optionType: FieldRef<"OiHistory", 'String'>
    readonly openInterest: FieldRef<"OiHistory", 'BigInt'>
    readonly oiChange: FieldRef<"OiHistory", 'Int'>
    readonly volume: FieldRef<"OiHistory", 'BigInt'>
    readonly ltp: FieldRef<"OiHistory", 'Decimal'>
    readonly impliedVolatility: FieldRef<"OiHistory", 'Decimal'>
    readonly delta: FieldRef<"OiHistory", 'Decimal'>
    readonly gamma: FieldRef<"OiHistory", 'Decimal'>
    readonly theta: FieldRef<"OiHistory", 'Decimal'>
    readonly vega: FieldRef<"OiHistory", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * OiHistory findUnique
   */
  export type OiHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * Filter, which OiHistory to fetch.
     */
    where: OiHistoryWhereUniqueInput
  }

  /**
   * OiHistory findUniqueOrThrow
   */
  export type OiHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * Filter, which OiHistory to fetch.
     */
    where: OiHistoryWhereUniqueInput
  }

  /**
   * OiHistory findFirst
   */
  export type OiHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * Filter, which OiHistory to fetch.
     */
    where?: OiHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OiHistories to fetch.
     */
    orderBy?: OiHistoryOrderByWithRelationInput | OiHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OiHistories.
     */
    cursor?: OiHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OiHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OiHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OiHistories.
     */
    distinct?: OiHistoryScalarFieldEnum | OiHistoryScalarFieldEnum[]
  }

  /**
   * OiHistory findFirstOrThrow
   */
  export type OiHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * Filter, which OiHistory to fetch.
     */
    where?: OiHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OiHistories to fetch.
     */
    orderBy?: OiHistoryOrderByWithRelationInput | OiHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OiHistories.
     */
    cursor?: OiHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OiHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OiHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OiHistories.
     */
    distinct?: OiHistoryScalarFieldEnum | OiHistoryScalarFieldEnum[]
  }

  /**
   * OiHistory findMany
   */
  export type OiHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * Filter, which OiHistories to fetch.
     */
    where?: OiHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OiHistories to fetch.
     */
    orderBy?: OiHistoryOrderByWithRelationInput | OiHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OiHistories.
     */
    cursor?: OiHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OiHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OiHistories.
     */
    skip?: number
    distinct?: OiHistoryScalarFieldEnum | OiHistoryScalarFieldEnum[]
  }

  /**
   * OiHistory create
   */
  export type OiHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * The data needed to create a OiHistory.
     */
    data: XOR<OiHistoryCreateInput, OiHistoryUncheckedCreateInput>
  }

  /**
   * OiHistory createMany
   */
  export type OiHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OiHistories.
     */
    data: OiHistoryCreateManyInput | OiHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OiHistory createManyAndReturn
   */
  export type OiHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many OiHistories.
     */
    data: OiHistoryCreateManyInput | OiHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OiHistory update
   */
  export type OiHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * The data needed to update a OiHistory.
     */
    data: XOR<OiHistoryUpdateInput, OiHistoryUncheckedUpdateInput>
    /**
     * Choose, which OiHistory to update.
     */
    where: OiHistoryWhereUniqueInput
  }

  /**
   * OiHistory updateMany
   */
  export type OiHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OiHistories.
     */
    data: XOR<OiHistoryUpdateManyMutationInput, OiHistoryUncheckedUpdateManyInput>
    /**
     * Filter which OiHistories to update
     */
    where?: OiHistoryWhereInput
    /**
     * Limit how many OiHistories to update.
     */
    limit?: number
  }

  /**
   * OiHistory updateManyAndReturn
   */
  export type OiHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * The data used to update OiHistories.
     */
    data: XOR<OiHistoryUpdateManyMutationInput, OiHistoryUncheckedUpdateManyInput>
    /**
     * Filter which OiHistories to update
     */
    where?: OiHistoryWhereInput
    /**
     * Limit how many OiHistories to update.
     */
    limit?: number
  }

  /**
   * OiHistory upsert
   */
  export type OiHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * The filter to search for the OiHistory to update in case it exists.
     */
    where: OiHistoryWhereUniqueInput
    /**
     * In case the OiHistory found by the `where` argument doesn't exist, create a new OiHistory with this data.
     */
    create: XOR<OiHistoryCreateInput, OiHistoryUncheckedCreateInput>
    /**
     * In case the OiHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OiHistoryUpdateInput, OiHistoryUncheckedUpdateInput>
  }

  /**
   * OiHistory delete
   */
  export type OiHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
    /**
     * Filter which OiHistory to delete.
     */
    where: OiHistoryWhereUniqueInput
  }

  /**
   * OiHistory deleteMany
   */
  export type OiHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OiHistories to delete
     */
    where?: OiHistoryWhereInput
    /**
     * Limit how many OiHistories to delete.
     */
    limit?: number
  }

  /**
   * OiHistory without action
   */
  export type OiHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OiHistory
     */
    select?: OiHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the OiHistory
     */
    omit?: OiHistoryOmit<ExtArgs> | null
  }


  /**
   * Model IvHistory
   */

  export type AggregateIvHistory = {
    _count: IvHistoryCountAggregateOutputType | null
    _avg: IvHistoryAvgAggregateOutputType | null
    _sum: IvHistorySumAggregateOutputType | null
    _min: IvHistoryMinAggregateOutputType | null
    _max: IvHistoryMaxAggregateOutputType | null
  }

  export type IvHistoryAvgAggregateOutputType = {
    indiaVix: Decimal | null
    atmIv: Decimal | null
    ivPercentile: Decimal | null
  }

  export type IvHistorySumAggregateOutputType = {
    indiaVix: Decimal | null
    atmIv: Decimal | null
    ivPercentile: Decimal | null
  }

  export type IvHistoryMinAggregateOutputType = {
    time: Date | null
    symbol: string | null
    indiaVix: Decimal | null
    atmIv: Decimal | null
    ivPercentile: Decimal | null
  }

  export type IvHistoryMaxAggregateOutputType = {
    time: Date | null
    symbol: string | null
    indiaVix: Decimal | null
    atmIv: Decimal | null
    ivPercentile: Decimal | null
  }

  export type IvHistoryCountAggregateOutputType = {
    time: number
    symbol: number
    indiaVix: number
    atmIv: number
    ivPercentile: number
    _all: number
  }


  export type IvHistoryAvgAggregateInputType = {
    indiaVix?: true
    atmIv?: true
    ivPercentile?: true
  }

  export type IvHistorySumAggregateInputType = {
    indiaVix?: true
    atmIv?: true
    ivPercentile?: true
  }

  export type IvHistoryMinAggregateInputType = {
    time?: true
    symbol?: true
    indiaVix?: true
    atmIv?: true
    ivPercentile?: true
  }

  export type IvHistoryMaxAggregateInputType = {
    time?: true
    symbol?: true
    indiaVix?: true
    atmIv?: true
    ivPercentile?: true
  }

  export type IvHistoryCountAggregateInputType = {
    time?: true
    symbol?: true
    indiaVix?: true
    atmIv?: true
    ivPercentile?: true
    _all?: true
  }

  export type IvHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IvHistory to aggregate.
     */
    where?: IvHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IvHistories to fetch.
     */
    orderBy?: IvHistoryOrderByWithRelationInput | IvHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IvHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IvHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IvHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IvHistories
    **/
    _count?: true | IvHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IvHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IvHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IvHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IvHistoryMaxAggregateInputType
  }

  export type GetIvHistoryAggregateType<T extends IvHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateIvHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIvHistory[P]>
      : GetScalarType<T[P], AggregateIvHistory[P]>
  }




  export type IvHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IvHistoryWhereInput
    orderBy?: IvHistoryOrderByWithAggregationInput | IvHistoryOrderByWithAggregationInput[]
    by: IvHistoryScalarFieldEnum[] | IvHistoryScalarFieldEnum
    having?: IvHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IvHistoryCountAggregateInputType | true
    _avg?: IvHistoryAvgAggregateInputType
    _sum?: IvHistorySumAggregateInputType
    _min?: IvHistoryMinAggregateInputType
    _max?: IvHistoryMaxAggregateInputType
  }

  export type IvHistoryGroupByOutputType = {
    time: Date
    symbol: string
    indiaVix: Decimal
    atmIv: Decimal | null
    ivPercentile: Decimal | null
    _count: IvHistoryCountAggregateOutputType | null
    _avg: IvHistoryAvgAggregateOutputType | null
    _sum: IvHistorySumAggregateOutputType | null
    _min: IvHistoryMinAggregateOutputType | null
    _max: IvHistoryMaxAggregateOutputType | null
  }

  type GetIvHistoryGroupByPayload<T extends IvHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IvHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IvHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IvHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], IvHistoryGroupByOutputType[P]>
        }
      >
    >


  export type IvHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    symbol?: boolean
    indiaVix?: boolean
    atmIv?: boolean
    ivPercentile?: boolean
  }, ExtArgs["result"]["ivHistory"]>

  export type IvHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    symbol?: boolean
    indiaVix?: boolean
    atmIv?: boolean
    ivPercentile?: boolean
  }, ExtArgs["result"]["ivHistory"]>

  export type IvHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    symbol?: boolean
    indiaVix?: boolean
    atmIv?: boolean
    ivPercentile?: boolean
  }, ExtArgs["result"]["ivHistory"]>

  export type IvHistorySelectScalar = {
    time?: boolean
    symbol?: boolean
    indiaVix?: boolean
    atmIv?: boolean
    ivPercentile?: boolean
  }

  export type IvHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"time" | "symbol" | "indiaVix" | "atmIv" | "ivPercentile", ExtArgs["result"]["ivHistory"]>

  export type $IvHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IvHistory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      time: Date
      symbol: string
      indiaVix: Prisma.Decimal
      atmIv: Prisma.Decimal | null
      ivPercentile: Prisma.Decimal | null
    }, ExtArgs["result"]["ivHistory"]>
    composites: {}
  }

  type IvHistoryGetPayload<S extends boolean | null | undefined | IvHistoryDefaultArgs> = $Result.GetResult<Prisma.$IvHistoryPayload, S>

  type IvHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IvHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IvHistoryCountAggregateInputType | true
    }

  export interface IvHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IvHistory'], meta: { name: 'IvHistory' } }
    /**
     * Find zero or one IvHistory that matches the filter.
     * @param {IvHistoryFindUniqueArgs} args - Arguments to find a IvHistory
     * @example
     * // Get one IvHistory
     * const ivHistory = await prisma.ivHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IvHistoryFindUniqueArgs>(args: SelectSubset<T, IvHistoryFindUniqueArgs<ExtArgs>>): Prisma__IvHistoryClient<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IvHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IvHistoryFindUniqueOrThrowArgs} args - Arguments to find a IvHistory
     * @example
     * // Get one IvHistory
     * const ivHistory = await prisma.ivHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IvHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, IvHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IvHistoryClient<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IvHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IvHistoryFindFirstArgs} args - Arguments to find a IvHistory
     * @example
     * // Get one IvHistory
     * const ivHistory = await prisma.ivHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IvHistoryFindFirstArgs>(args?: SelectSubset<T, IvHistoryFindFirstArgs<ExtArgs>>): Prisma__IvHistoryClient<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IvHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IvHistoryFindFirstOrThrowArgs} args - Arguments to find a IvHistory
     * @example
     * // Get one IvHistory
     * const ivHistory = await prisma.ivHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IvHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, IvHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__IvHistoryClient<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IvHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IvHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IvHistories
     * const ivHistories = await prisma.ivHistory.findMany()
     * 
     * // Get first 10 IvHistories
     * const ivHistories = await prisma.ivHistory.findMany({ take: 10 })
     * 
     * // Only select the `time`
     * const ivHistoryWithTimeOnly = await prisma.ivHistory.findMany({ select: { time: true } })
     * 
     */
    findMany<T extends IvHistoryFindManyArgs>(args?: SelectSubset<T, IvHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IvHistory.
     * @param {IvHistoryCreateArgs} args - Arguments to create a IvHistory.
     * @example
     * // Create one IvHistory
     * const IvHistory = await prisma.ivHistory.create({
     *   data: {
     *     // ... data to create a IvHistory
     *   }
     * })
     * 
     */
    create<T extends IvHistoryCreateArgs>(args: SelectSubset<T, IvHistoryCreateArgs<ExtArgs>>): Prisma__IvHistoryClient<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IvHistories.
     * @param {IvHistoryCreateManyArgs} args - Arguments to create many IvHistories.
     * @example
     * // Create many IvHistories
     * const ivHistory = await prisma.ivHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IvHistoryCreateManyArgs>(args?: SelectSubset<T, IvHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IvHistories and returns the data saved in the database.
     * @param {IvHistoryCreateManyAndReturnArgs} args - Arguments to create many IvHistories.
     * @example
     * // Create many IvHistories
     * const ivHistory = await prisma.ivHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IvHistories and only return the `time`
     * const ivHistoryWithTimeOnly = await prisma.ivHistory.createManyAndReturn({
     *   select: { time: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IvHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, IvHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IvHistory.
     * @param {IvHistoryDeleteArgs} args - Arguments to delete one IvHistory.
     * @example
     * // Delete one IvHistory
     * const IvHistory = await prisma.ivHistory.delete({
     *   where: {
     *     // ... filter to delete one IvHistory
     *   }
     * })
     * 
     */
    delete<T extends IvHistoryDeleteArgs>(args: SelectSubset<T, IvHistoryDeleteArgs<ExtArgs>>): Prisma__IvHistoryClient<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IvHistory.
     * @param {IvHistoryUpdateArgs} args - Arguments to update one IvHistory.
     * @example
     * // Update one IvHistory
     * const ivHistory = await prisma.ivHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IvHistoryUpdateArgs>(args: SelectSubset<T, IvHistoryUpdateArgs<ExtArgs>>): Prisma__IvHistoryClient<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IvHistories.
     * @param {IvHistoryDeleteManyArgs} args - Arguments to filter IvHistories to delete.
     * @example
     * // Delete a few IvHistories
     * const { count } = await prisma.ivHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IvHistoryDeleteManyArgs>(args?: SelectSubset<T, IvHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IvHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IvHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IvHistories
     * const ivHistory = await prisma.ivHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IvHistoryUpdateManyArgs>(args: SelectSubset<T, IvHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IvHistories and returns the data updated in the database.
     * @param {IvHistoryUpdateManyAndReturnArgs} args - Arguments to update many IvHistories.
     * @example
     * // Update many IvHistories
     * const ivHistory = await prisma.ivHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IvHistories and only return the `time`
     * const ivHistoryWithTimeOnly = await prisma.ivHistory.updateManyAndReturn({
     *   select: { time: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IvHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, IvHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IvHistory.
     * @param {IvHistoryUpsertArgs} args - Arguments to update or create a IvHistory.
     * @example
     * // Update or create a IvHistory
     * const ivHistory = await prisma.ivHistory.upsert({
     *   create: {
     *     // ... data to create a IvHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IvHistory we want to update
     *   }
     * })
     */
    upsert<T extends IvHistoryUpsertArgs>(args: SelectSubset<T, IvHistoryUpsertArgs<ExtArgs>>): Prisma__IvHistoryClient<$Result.GetResult<Prisma.$IvHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IvHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IvHistoryCountArgs} args - Arguments to filter IvHistories to count.
     * @example
     * // Count the number of IvHistories
     * const count = await prisma.ivHistory.count({
     *   where: {
     *     // ... the filter for the IvHistories we want to count
     *   }
     * })
    **/
    count<T extends IvHistoryCountArgs>(
      args?: Subset<T, IvHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IvHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IvHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IvHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IvHistoryAggregateArgs>(args: Subset<T, IvHistoryAggregateArgs>): Prisma.PrismaPromise<GetIvHistoryAggregateType<T>>

    /**
     * Group by IvHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IvHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IvHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IvHistoryGroupByArgs['orderBy'] }
        : { orderBy?: IvHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IvHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIvHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IvHistory model
   */
  readonly fields: IvHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IvHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IvHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IvHistory model
   */
  interface IvHistoryFieldRefs {
    readonly time: FieldRef<"IvHistory", 'DateTime'>
    readonly symbol: FieldRef<"IvHistory", 'String'>
    readonly indiaVix: FieldRef<"IvHistory", 'Decimal'>
    readonly atmIv: FieldRef<"IvHistory", 'Decimal'>
    readonly ivPercentile: FieldRef<"IvHistory", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * IvHistory findUnique
   */
  export type IvHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * Filter, which IvHistory to fetch.
     */
    where: IvHistoryWhereUniqueInput
  }

  /**
   * IvHistory findUniqueOrThrow
   */
  export type IvHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * Filter, which IvHistory to fetch.
     */
    where: IvHistoryWhereUniqueInput
  }

  /**
   * IvHistory findFirst
   */
  export type IvHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * Filter, which IvHistory to fetch.
     */
    where?: IvHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IvHistories to fetch.
     */
    orderBy?: IvHistoryOrderByWithRelationInput | IvHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IvHistories.
     */
    cursor?: IvHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IvHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IvHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IvHistories.
     */
    distinct?: IvHistoryScalarFieldEnum | IvHistoryScalarFieldEnum[]
  }

  /**
   * IvHistory findFirstOrThrow
   */
  export type IvHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * Filter, which IvHistory to fetch.
     */
    where?: IvHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IvHistories to fetch.
     */
    orderBy?: IvHistoryOrderByWithRelationInput | IvHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IvHistories.
     */
    cursor?: IvHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IvHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IvHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IvHistories.
     */
    distinct?: IvHistoryScalarFieldEnum | IvHistoryScalarFieldEnum[]
  }

  /**
   * IvHistory findMany
   */
  export type IvHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * Filter, which IvHistories to fetch.
     */
    where?: IvHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IvHistories to fetch.
     */
    orderBy?: IvHistoryOrderByWithRelationInput | IvHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IvHistories.
     */
    cursor?: IvHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IvHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IvHistories.
     */
    skip?: number
    distinct?: IvHistoryScalarFieldEnum | IvHistoryScalarFieldEnum[]
  }

  /**
   * IvHistory create
   */
  export type IvHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * The data needed to create a IvHistory.
     */
    data: XOR<IvHistoryCreateInput, IvHistoryUncheckedCreateInput>
  }

  /**
   * IvHistory createMany
   */
  export type IvHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IvHistories.
     */
    data: IvHistoryCreateManyInput | IvHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IvHistory createManyAndReturn
   */
  export type IvHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many IvHistories.
     */
    data: IvHistoryCreateManyInput | IvHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IvHistory update
   */
  export type IvHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * The data needed to update a IvHistory.
     */
    data: XOR<IvHistoryUpdateInput, IvHistoryUncheckedUpdateInput>
    /**
     * Choose, which IvHistory to update.
     */
    where: IvHistoryWhereUniqueInput
  }

  /**
   * IvHistory updateMany
   */
  export type IvHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IvHistories.
     */
    data: XOR<IvHistoryUpdateManyMutationInput, IvHistoryUncheckedUpdateManyInput>
    /**
     * Filter which IvHistories to update
     */
    where?: IvHistoryWhereInput
    /**
     * Limit how many IvHistories to update.
     */
    limit?: number
  }

  /**
   * IvHistory updateManyAndReturn
   */
  export type IvHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * The data used to update IvHistories.
     */
    data: XOR<IvHistoryUpdateManyMutationInput, IvHistoryUncheckedUpdateManyInput>
    /**
     * Filter which IvHistories to update
     */
    where?: IvHistoryWhereInput
    /**
     * Limit how many IvHistories to update.
     */
    limit?: number
  }

  /**
   * IvHistory upsert
   */
  export type IvHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * The filter to search for the IvHistory to update in case it exists.
     */
    where: IvHistoryWhereUniqueInput
    /**
     * In case the IvHistory found by the `where` argument doesn't exist, create a new IvHistory with this data.
     */
    create: XOR<IvHistoryCreateInput, IvHistoryUncheckedCreateInput>
    /**
     * In case the IvHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IvHistoryUpdateInput, IvHistoryUncheckedUpdateInput>
  }

  /**
   * IvHistory delete
   */
  export type IvHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
    /**
     * Filter which IvHistory to delete.
     */
    where: IvHistoryWhereUniqueInput
  }

  /**
   * IvHistory deleteMany
   */
  export type IvHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IvHistories to delete
     */
    where?: IvHistoryWhereInput
    /**
     * Limit how many IvHistories to delete.
     */
    limit?: number
  }

  /**
   * IvHistory without action
   */
  export type IvHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IvHistory
     */
    select?: IvHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IvHistory
     */
    omit?: IvHistoryOmit<ExtArgs> | null
  }


  /**
   * Model PcrHistory
   */

  export type AggregatePcrHistory = {
    _count: PcrHistoryCountAggregateOutputType | null
    _avg: PcrHistoryAvgAggregateOutputType | null
    _sum: PcrHistorySumAggregateOutputType | null
    _min: PcrHistoryMinAggregateOutputType | null
    _max: PcrHistoryMaxAggregateOutputType | null
  }

  export type PcrHistoryAvgAggregateOutputType = {
    pcrOi: Decimal | null
    pcrVolume: Decimal | null
    callOiTotal: number | null
    putOiTotal: number | null
  }

  export type PcrHistorySumAggregateOutputType = {
    pcrOi: Decimal | null
    pcrVolume: Decimal | null
    callOiTotal: bigint | null
    putOiTotal: bigint | null
  }

  export type PcrHistoryMinAggregateOutputType = {
    time: Date | null
    symbol: string | null
    expiryDate: Date | null
    pcrOi: Decimal | null
    pcrVolume: Decimal | null
    callOiTotal: bigint | null
    putOiTotal: bigint | null
  }

  export type PcrHistoryMaxAggregateOutputType = {
    time: Date | null
    symbol: string | null
    expiryDate: Date | null
    pcrOi: Decimal | null
    pcrVolume: Decimal | null
    callOiTotal: bigint | null
    putOiTotal: bigint | null
  }

  export type PcrHistoryCountAggregateOutputType = {
    time: number
    symbol: number
    expiryDate: number
    pcrOi: number
    pcrVolume: number
    callOiTotal: number
    putOiTotal: number
    _all: number
  }


  export type PcrHistoryAvgAggregateInputType = {
    pcrOi?: true
    pcrVolume?: true
    callOiTotal?: true
    putOiTotal?: true
  }

  export type PcrHistorySumAggregateInputType = {
    pcrOi?: true
    pcrVolume?: true
    callOiTotal?: true
    putOiTotal?: true
  }

  export type PcrHistoryMinAggregateInputType = {
    time?: true
    symbol?: true
    expiryDate?: true
    pcrOi?: true
    pcrVolume?: true
    callOiTotal?: true
    putOiTotal?: true
  }

  export type PcrHistoryMaxAggregateInputType = {
    time?: true
    symbol?: true
    expiryDate?: true
    pcrOi?: true
    pcrVolume?: true
    callOiTotal?: true
    putOiTotal?: true
  }

  export type PcrHistoryCountAggregateInputType = {
    time?: true
    symbol?: true
    expiryDate?: true
    pcrOi?: true
    pcrVolume?: true
    callOiTotal?: true
    putOiTotal?: true
    _all?: true
  }

  export type PcrHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PcrHistory to aggregate.
     */
    where?: PcrHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PcrHistories to fetch.
     */
    orderBy?: PcrHistoryOrderByWithRelationInput | PcrHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PcrHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PcrHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PcrHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PcrHistories
    **/
    _count?: true | PcrHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PcrHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PcrHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PcrHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PcrHistoryMaxAggregateInputType
  }

  export type GetPcrHistoryAggregateType<T extends PcrHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregatePcrHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePcrHistory[P]>
      : GetScalarType<T[P], AggregatePcrHistory[P]>
  }




  export type PcrHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PcrHistoryWhereInput
    orderBy?: PcrHistoryOrderByWithAggregationInput | PcrHistoryOrderByWithAggregationInput[]
    by: PcrHistoryScalarFieldEnum[] | PcrHistoryScalarFieldEnum
    having?: PcrHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PcrHistoryCountAggregateInputType | true
    _avg?: PcrHistoryAvgAggregateInputType
    _sum?: PcrHistorySumAggregateInputType
    _min?: PcrHistoryMinAggregateInputType
    _max?: PcrHistoryMaxAggregateInputType
  }

  export type PcrHistoryGroupByOutputType = {
    time: Date
    symbol: string
    expiryDate: Date
    pcrOi: Decimal
    pcrVolume: Decimal
    callOiTotal: bigint | null
    putOiTotal: bigint | null
    _count: PcrHistoryCountAggregateOutputType | null
    _avg: PcrHistoryAvgAggregateOutputType | null
    _sum: PcrHistorySumAggregateOutputType | null
    _min: PcrHistoryMinAggregateOutputType | null
    _max: PcrHistoryMaxAggregateOutputType | null
  }

  type GetPcrHistoryGroupByPayload<T extends PcrHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PcrHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PcrHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PcrHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], PcrHistoryGroupByOutputType[P]>
        }
      >
    >


  export type PcrHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    symbol?: boolean
    expiryDate?: boolean
    pcrOi?: boolean
    pcrVolume?: boolean
    callOiTotal?: boolean
    putOiTotal?: boolean
  }, ExtArgs["result"]["pcrHistory"]>

  export type PcrHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    symbol?: boolean
    expiryDate?: boolean
    pcrOi?: boolean
    pcrVolume?: boolean
    callOiTotal?: boolean
    putOiTotal?: boolean
  }, ExtArgs["result"]["pcrHistory"]>

  export type PcrHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    symbol?: boolean
    expiryDate?: boolean
    pcrOi?: boolean
    pcrVolume?: boolean
    callOiTotal?: boolean
    putOiTotal?: boolean
  }, ExtArgs["result"]["pcrHistory"]>

  export type PcrHistorySelectScalar = {
    time?: boolean
    symbol?: boolean
    expiryDate?: boolean
    pcrOi?: boolean
    pcrVolume?: boolean
    callOiTotal?: boolean
    putOiTotal?: boolean
  }

  export type PcrHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"time" | "symbol" | "expiryDate" | "pcrOi" | "pcrVolume" | "callOiTotal" | "putOiTotal", ExtArgs["result"]["pcrHistory"]>

  export type $PcrHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PcrHistory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      time: Date
      symbol: string
      expiryDate: Date
      pcrOi: Prisma.Decimal
      pcrVolume: Prisma.Decimal
      callOiTotal: bigint | null
      putOiTotal: bigint | null
    }, ExtArgs["result"]["pcrHistory"]>
    composites: {}
  }

  type PcrHistoryGetPayload<S extends boolean | null | undefined | PcrHistoryDefaultArgs> = $Result.GetResult<Prisma.$PcrHistoryPayload, S>

  type PcrHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PcrHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PcrHistoryCountAggregateInputType | true
    }

  export interface PcrHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PcrHistory'], meta: { name: 'PcrHistory' } }
    /**
     * Find zero or one PcrHistory that matches the filter.
     * @param {PcrHistoryFindUniqueArgs} args - Arguments to find a PcrHistory
     * @example
     * // Get one PcrHistory
     * const pcrHistory = await prisma.pcrHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PcrHistoryFindUniqueArgs>(args: SelectSubset<T, PcrHistoryFindUniqueArgs<ExtArgs>>): Prisma__PcrHistoryClient<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PcrHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PcrHistoryFindUniqueOrThrowArgs} args - Arguments to find a PcrHistory
     * @example
     * // Get one PcrHistory
     * const pcrHistory = await prisma.pcrHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PcrHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, PcrHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PcrHistoryClient<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PcrHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PcrHistoryFindFirstArgs} args - Arguments to find a PcrHistory
     * @example
     * // Get one PcrHistory
     * const pcrHistory = await prisma.pcrHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PcrHistoryFindFirstArgs>(args?: SelectSubset<T, PcrHistoryFindFirstArgs<ExtArgs>>): Prisma__PcrHistoryClient<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PcrHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PcrHistoryFindFirstOrThrowArgs} args - Arguments to find a PcrHistory
     * @example
     * // Get one PcrHistory
     * const pcrHistory = await prisma.pcrHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PcrHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, PcrHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PcrHistoryClient<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PcrHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PcrHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PcrHistories
     * const pcrHistories = await prisma.pcrHistory.findMany()
     * 
     * // Get first 10 PcrHistories
     * const pcrHistories = await prisma.pcrHistory.findMany({ take: 10 })
     * 
     * // Only select the `time`
     * const pcrHistoryWithTimeOnly = await prisma.pcrHistory.findMany({ select: { time: true } })
     * 
     */
    findMany<T extends PcrHistoryFindManyArgs>(args?: SelectSubset<T, PcrHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PcrHistory.
     * @param {PcrHistoryCreateArgs} args - Arguments to create a PcrHistory.
     * @example
     * // Create one PcrHistory
     * const PcrHistory = await prisma.pcrHistory.create({
     *   data: {
     *     // ... data to create a PcrHistory
     *   }
     * })
     * 
     */
    create<T extends PcrHistoryCreateArgs>(args: SelectSubset<T, PcrHistoryCreateArgs<ExtArgs>>): Prisma__PcrHistoryClient<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PcrHistories.
     * @param {PcrHistoryCreateManyArgs} args - Arguments to create many PcrHistories.
     * @example
     * // Create many PcrHistories
     * const pcrHistory = await prisma.pcrHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PcrHistoryCreateManyArgs>(args?: SelectSubset<T, PcrHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PcrHistories and returns the data saved in the database.
     * @param {PcrHistoryCreateManyAndReturnArgs} args - Arguments to create many PcrHistories.
     * @example
     * // Create many PcrHistories
     * const pcrHistory = await prisma.pcrHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PcrHistories and only return the `time`
     * const pcrHistoryWithTimeOnly = await prisma.pcrHistory.createManyAndReturn({
     *   select: { time: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PcrHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, PcrHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PcrHistory.
     * @param {PcrHistoryDeleteArgs} args - Arguments to delete one PcrHistory.
     * @example
     * // Delete one PcrHistory
     * const PcrHistory = await prisma.pcrHistory.delete({
     *   where: {
     *     // ... filter to delete one PcrHistory
     *   }
     * })
     * 
     */
    delete<T extends PcrHistoryDeleteArgs>(args: SelectSubset<T, PcrHistoryDeleteArgs<ExtArgs>>): Prisma__PcrHistoryClient<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PcrHistory.
     * @param {PcrHistoryUpdateArgs} args - Arguments to update one PcrHistory.
     * @example
     * // Update one PcrHistory
     * const pcrHistory = await prisma.pcrHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PcrHistoryUpdateArgs>(args: SelectSubset<T, PcrHistoryUpdateArgs<ExtArgs>>): Prisma__PcrHistoryClient<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PcrHistories.
     * @param {PcrHistoryDeleteManyArgs} args - Arguments to filter PcrHistories to delete.
     * @example
     * // Delete a few PcrHistories
     * const { count } = await prisma.pcrHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PcrHistoryDeleteManyArgs>(args?: SelectSubset<T, PcrHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PcrHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PcrHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PcrHistories
     * const pcrHistory = await prisma.pcrHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PcrHistoryUpdateManyArgs>(args: SelectSubset<T, PcrHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PcrHistories and returns the data updated in the database.
     * @param {PcrHistoryUpdateManyAndReturnArgs} args - Arguments to update many PcrHistories.
     * @example
     * // Update many PcrHistories
     * const pcrHistory = await prisma.pcrHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PcrHistories and only return the `time`
     * const pcrHistoryWithTimeOnly = await prisma.pcrHistory.updateManyAndReturn({
     *   select: { time: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PcrHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, PcrHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PcrHistory.
     * @param {PcrHistoryUpsertArgs} args - Arguments to update or create a PcrHistory.
     * @example
     * // Update or create a PcrHistory
     * const pcrHistory = await prisma.pcrHistory.upsert({
     *   create: {
     *     // ... data to create a PcrHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PcrHistory we want to update
     *   }
     * })
     */
    upsert<T extends PcrHistoryUpsertArgs>(args: SelectSubset<T, PcrHistoryUpsertArgs<ExtArgs>>): Prisma__PcrHistoryClient<$Result.GetResult<Prisma.$PcrHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PcrHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PcrHistoryCountArgs} args - Arguments to filter PcrHistories to count.
     * @example
     * // Count the number of PcrHistories
     * const count = await prisma.pcrHistory.count({
     *   where: {
     *     // ... the filter for the PcrHistories we want to count
     *   }
     * })
    **/
    count<T extends PcrHistoryCountArgs>(
      args?: Subset<T, PcrHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PcrHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PcrHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PcrHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PcrHistoryAggregateArgs>(args: Subset<T, PcrHistoryAggregateArgs>): Prisma.PrismaPromise<GetPcrHistoryAggregateType<T>>

    /**
     * Group by PcrHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PcrHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PcrHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PcrHistoryGroupByArgs['orderBy'] }
        : { orderBy?: PcrHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PcrHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPcrHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PcrHistory model
   */
  readonly fields: PcrHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PcrHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PcrHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PcrHistory model
   */
  interface PcrHistoryFieldRefs {
    readonly time: FieldRef<"PcrHistory", 'DateTime'>
    readonly symbol: FieldRef<"PcrHistory", 'String'>
    readonly expiryDate: FieldRef<"PcrHistory", 'DateTime'>
    readonly pcrOi: FieldRef<"PcrHistory", 'Decimal'>
    readonly pcrVolume: FieldRef<"PcrHistory", 'Decimal'>
    readonly callOiTotal: FieldRef<"PcrHistory", 'BigInt'>
    readonly putOiTotal: FieldRef<"PcrHistory", 'BigInt'>
  }
    

  // Custom InputTypes
  /**
   * PcrHistory findUnique
   */
  export type PcrHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * Filter, which PcrHistory to fetch.
     */
    where: PcrHistoryWhereUniqueInput
  }

  /**
   * PcrHistory findUniqueOrThrow
   */
  export type PcrHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * Filter, which PcrHistory to fetch.
     */
    where: PcrHistoryWhereUniqueInput
  }

  /**
   * PcrHistory findFirst
   */
  export type PcrHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * Filter, which PcrHistory to fetch.
     */
    where?: PcrHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PcrHistories to fetch.
     */
    orderBy?: PcrHistoryOrderByWithRelationInput | PcrHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PcrHistories.
     */
    cursor?: PcrHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PcrHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PcrHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PcrHistories.
     */
    distinct?: PcrHistoryScalarFieldEnum | PcrHistoryScalarFieldEnum[]
  }

  /**
   * PcrHistory findFirstOrThrow
   */
  export type PcrHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * Filter, which PcrHistory to fetch.
     */
    where?: PcrHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PcrHistories to fetch.
     */
    orderBy?: PcrHistoryOrderByWithRelationInput | PcrHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PcrHistories.
     */
    cursor?: PcrHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PcrHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PcrHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PcrHistories.
     */
    distinct?: PcrHistoryScalarFieldEnum | PcrHistoryScalarFieldEnum[]
  }

  /**
   * PcrHistory findMany
   */
  export type PcrHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * Filter, which PcrHistories to fetch.
     */
    where?: PcrHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PcrHistories to fetch.
     */
    orderBy?: PcrHistoryOrderByWithRelationInput | PcrHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PcrHistories.
     */
    cursor?: PcrHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PcrHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PcrHistories.
     */
    skip?: number
    distinct?: PcrHistoryScalarFieldEnum | PcrHistoryScalarFieldEnum[]
  }

  /**
   * PcrHistory create
   */
  export type PcrHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * The data needed to create a PcrHistory.
     */
    data: XOR<PcrHistoryCreateInput, PcrHistoryUncheckedCreateInput>
  }

  /**
   * PcrHistory createMany
   */
  export type PcrHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PcrHistories.
     */
    data: PcrHistoryCreateManyInput | PcrHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PcrHistory createManyAndReturn
   */
  export type PcrHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many PcrHistories.
     */
    data: PcrHistoryCreateManyInput | PcrHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PcrHistory update
   */
  export type PcrHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * The data needed to update a PcrHistory.
     */
    data: XOR<PcrHistoryUpdateInput, PcrHistoryUncheckedUpdateInput>
    /**
     * Choose, which PcrHistory to update.
     */
    where: PcrHistoryWhereUniqueInput
  }

  /**
   * PcrHistory updateMany
   */
  export type PcrHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PcrHistories.
     */
    data: XOR<PcrHistoryUpdateManyMutationInput, PcrHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PcrHistories to update
     */
    where?: PcrHistoryWhereInput
    /**
     * Limit how many PcrHistories to update.
     */
    limit?: number
  }

  /**
   * PcrHistory updateManyAndReturn
   */
  export type PcrHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * The data used to update PcrHistories.
     */
    data: XOR<PcrHistoryUpdateManyMutationInput, PcrHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PcrHistories to update
     */
    where?: PcrHistoryWhereInput
    /**
     * Limit how many PcrHistories to update.
     */
    limit?: number
  }

  /**
   * PcrHistory upsert
   */
  export type PcrHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * The filter to search for the PcrHistory to update in case it exists.
     */
    where: PcrHistoryWhereUniqueInput
    /**
     * In case the PcrHistory found by the `where` argument doesn't exist, create a new PcrHistory with this data.
     */
    create: XOR<PcrHistoryCreateInput, PcrHistoryUncheckedCreateInput>
    /**
     * In case the PcrHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PcrHistoryUpdateInput, PcrHistoryUncheckedUpdateInput>
  }

  /**
   * PcrHistory delete
   */
  export type PcrHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
    /**
     * Filter which PcrHistory to delete.
     */
    where: PcrHistoryWhereUniqueInput
  }

  /**
   * PcrHistory deleteMany
   */
  export type PcrHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PcrHistories to delete
     */
    where?: PcrHistoryWhereInput
    /**
     * Limit how many PcrHistories to delete.
     */
    limit?: number
  }

  /**
   * PcrHistory without action
   */
  export type PcrHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PcrHistory
     */
    select?: PcrHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PcrHistory
     */
    omit?: PcrHistoryOmit<ExtArgs> | null
  }


  /**
   * Model FlowAiBrief
   */

  export type AggregateFlowAiBrief = {
    _count: FlowAiBriefCountAggregateOutputType | null
    _avg: FlowAiBriefAvgAggregateOutputType | null
    _sum: FlowAiBriefSumAggregateOutputType | null
    _min: FlowAiBriefMinAggregateOutputType | null
    _max: FlowAiBriefMaxAggregateOutputType | null
  }

  export type FlowAiBriefAvgAggregateOutputType = {
    confidence: number | null
    tokensUsed: number | null
  }

  export type FlowAiBriefSumAggregateOutputType = {
    confidence: number | null
    tokensUsed: number | null
  }

  export type FlowAiBriefMinAggregateOutputType = {
    id: string | null
    symbol: string | null
    expiryDate: Date | null
    briefType: string | null
    headline: string | null
    action: string | null
    confidence: number | null
    modelUsed: string | null
    tokensUsed: number | null
    generatedAt: Date | null
    expiresAt: Date | null
    isValid: boolean | null
  }

  export type FlowAiBriefMaxAggregateOutputType = {
    id: string | null
    symbol: string | null
    expiryDate: Date | null
    briefType: string | null
    headline: string | null
    action: string | null
    confidence: number | null
    modelUsed: string | null
    tokensUsed: number | null
    generatedAt: Date | null
    expiresAt: Date | null
    isValid: boolean | null
  }

  export type FlowAiBriefCountAggregateOutputType = {
    id: number
    symbol: number
    expiryDate: number
    briefType: number
    headline: number
    observations: number
    action: number
    confidence: number
    marketContext: number
    modelUsed: number
    tokensUsed: number
    generatedAt: number
    expiresAt: number
    isValid: number
    _all: number
  }


  export type FlowAiBriefAvgAggregateInputType = {
    confidence?: true
    tokensUsed?: true
  }

  export type FlowAiBriefSumAggregateInputType = {
    confidence?: true
    tokensUsed?: true
  }

  export type FlowAiBriefMinAggregateInputType = {
    id?: true
    symbol?: true
    expiryDate?: true
    briefType?: true
    headline?: true
    action?: true
    confidence?: true
    modelUsed?: true
    tokensUsed?: true
    generatedAt?: true
    expiresAt?: true
    isValid?: true
  }

  export type FlowAiBriefMaxAggregateInputType = {
    id?: true
    symbol?: true
    expiryDate?: true
    briefType?: true
    headline?: true
    action?: true
    confidence?: true
    modelUsed?: true
    tokensUsed?: true
    generatedAt?: true
    expiresAt?: true
    isValid?: true
  }

  export type FlowAiBriefCountAggregateInputType = {
    id?: true
    symbol?: true
    expiryDate?: true
    briefType?: true
    headline?: true
    observations?: true
    action?: true
    confidence?: true
    marketContext?: true
    modelUsed?: true
    tokensUsed?: true
    generatedAt?: true
    expiresAt?: true
    isValid?: true
    _all?: true
  }

  export type FlowAiBriefAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlowAiBrief to aggregate.
     */
    where?: FlowAiBriefWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowAiBriefs to fetch.
     */
    orderBy?: FlowAiBriefOrderByWithRelationInput | FlowAiBriefOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlowAiBriefWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowAiBriefs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowAiBriefs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FlowAiBriefs
    **/
    _count?: true | FlowAiBriefCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FlowAiBriefAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FlowAiBriefSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlowAiBriefMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlowAiBriefMaxAggregateInputType
  }

  export type GetFlowAiBriefAggregateType<T extends FlowAiBriefAggregateArgs> = {
        [P in keyof T & keyof AggregateFlowAiBrief]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlowAiBrief[P]>
      : GetScalarType<T[P], AggregateFlowAiBrief[P]>
  }




  export type FlowAiBriefGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlowAiBriefWhereInput
    orderBy?: FlowAiBriefOrderByWithAggregationInput | FlowAiBriefOrderByWithAggregationInput[]
    by: FlowAiBriefScalarFieldEnum[] | FlowAiBriefScalarFieldEnum
    having?: FlowAiBriefScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlowAiBriefCountAggregateInputType | true
    _avg?: FlowAiBriefAvgAggregateInputType
    _sum?: FlowAiBriefSumAggregateInputType
    _min?: FlowAiBriefMinAggregateInputType
    _max?: FlowAiBriefMaxAggregateInputType
  }

  export type FlowAiBriefGroupByOutputType = {
    id: string
    symbol: string
    expiryDate: Date | null
    briefType: string
    headline: string
    observations: JsonValue
    action: string
    confidence: number
    marketContext: JsonValue | null
    modelUsed: string | null
    tokensUsed: number | null
    generatedAt: Date
    expiresAt: Date
    isValid: boolean
    _count: FlowAiBriefCountAggregateOutputType | null
    _avg: FlowAiBriefAvgAggregateOutputType | null
    _sum: FlowAiBriefSumAggregateOutputType | null
    _min: FlowAiBriefMinAggregateOutputType | null
    _max: FlowAiBriefMaxAggregateOutputType | null
  }

  type GetFlowAiBriefGroupByPayload<T extends FlowAiBriefGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlowAiBriefGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlowAiBriefGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlowAiBriefGroupByOutputType[P]>
            : GetScalarType<T[P], FlowAiBriefGroupByOutputType[P]>
        }
      >
    >


  export type FlowAiBriefSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbol?: boolean
    expiryDate?: boolean
    briefType?: boolean
    headline?: boolean
    observations?: boolean
    action?: boolean
    confidence?: boolean
    marketContext?: boolean
    modelUsed?: boolean
    tokensUsed?: boolean
    generatedAt?: boolean
    expiresAt?: boolean
    isValid?: boolean
  }, ExtArgs["result"]["flowAiBrief"]>

  export type FlowAiBriefSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbol?: boolean
    expiryDate?: boolean
    briefType?: boolean
    headline?: boolean
    observations?: boolean
    action?: boolean
    confidence?: boolean
    marketContext?: boolean
    modelUsed?: boolean
    tokensUsed?: boolean
    generatedAt?: boolean
    expiresAt?: boolean
    isValid?: boolean
  }, ExtArgs["result"]["flowAiBrief"]>

  export type FlowAiBriefSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    symbol?: boolean
    expiryDate?: boolean
    briefType?: boolean
    headline?: boolean
    observations?: boolean
    action?: boolean
    confidence?: boolean
    marketContext?: boolean
    modelUsed?: boolean
    tokensUsed?: boolean
    generatedAt?: boolean
    expiresAt?: boolean
    isValid?: boolean
  }, ExtArgs["result"]["flowAiBrief"]>

  export type FlowAiBriefSelectScalar = {
    id?: boolean
    symbol?: boolean
    expiryDate?: boolean
    briefType?: boolean
    headline?: boolean
    observations?: boolean
    action?: boolean
    confidence?: boolean
    marketContext?: boolean
    modelUsed?: boolean
    tokensUsed?: boolean
    generatedAt?: boolean
    expiresAt?: boolean
    isValid?: boolean
  }

  export type FlowAiBriefOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "symbol" | "expiryDate" | "briefType" | "headline" | "observations" | "action" | "confidence" | "marketContext" | "modelUsed" | "tokensUsed" | "generatedAt" | "expiresAt" | "isValid", ExtArgs["result"]["flowAiBrief"]>

  export type $FlowAiBriefPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FlowAiBrief"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      symbol: string
      expiryDate: Date | null
      briefType: string
      headline: string
      observations: Prisma.JsonValue
      action: string
      confidence: number
      marketContext: Prisma.JsonValue | null
      modelUsed: string | null
      tokensUsed: number | null
      generatedAt: Date
      expiresAt: Date
      isValid: boolean
    }, ExtArgs["result"]["flowAiBrief"]>
    composites: {}
  }

  type FlowAiBriefGetPayload<S extends boolean | null | undefined | FlowAiBriefDefaultArgs> = $Result.GetResult<Prisma.$FlowAiBriefPayload, S>

  type FlowAiBriefCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlowAiBriefFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlowAiBriefCountAggregateInputType | true
    }

  export interface FlowAiBriefDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FlowAiBrief'], meta: { name: 'FlowAiBrief' } }
    /**
     * Find zero or one FlowAiBrief that matches the filter.
     * @param {FlowAiBriefFindUniqueArgs} args - Arguments to find a FlowAiBrief
     * @example
     * // Get one FlowAiBrief
     * const flowAiBrief = await prisma.flowAiBrief.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlowAiBriefFindUniqueArgs>(args: SelectSubset<T, FlowAiBriefFindUniqueArgs<ExtArgs>>): Prisma__FlowAiBriefClient<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FlowAiBrief that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlowAiBriefFindUniqueOrThrowArgs} args - Arguments to find a FlowAiBrief
     * @example
     * // Get one FlowAiBrief
     * const flowAiBrief = await prisma.flowAiBrief.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlowAiBriefFindUniqueOrThrowArgs>(args: SelectSubset<T, FlowAiBriefFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlowAiBriefClient<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlowAiBrief that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowAiBriefFindFirstArgs} args - Arguments to find a FlowAiBrief
     * @example
     * // Get one FlowAiBrief
     * const flowAiBrief = await prisma.flowAiBrief.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlowAiBriefFindFirstArgs>(args?: SelectSubset<T, FlowAiBriefFindFirstArgs<ExtArgs>>): Prisma__FlowAiBriefClient<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlowAiBrief that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowAiBriefFindFirstOrThrowArgs} args - Arguments to find a FlowAiBrief
     * @example
     * // Get one FlowAiBrief
     * const flowAiBrief = await prisma.flowAiBrief.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlowAiBriefFindFirstOrThrowArgs>(args?: SelectSubset<T, FlowAiBriefFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlowAiBriefClient<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FlowAiBriefs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowAiBriefFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FlowAiBriefs
     * const flowAiBriefs = await prisma.flowAiBrief.findMany()
     * 
     * // Get first 10 FlowAiBriefs
     * const flowAiBriefs = await prisma.flowAiBrief.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flowAiBriefWithIdOnly = await prisma.flowAiBrief.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlowAiBriefFindManyArgs>(args?: SelectSubset<T, FlowAiBriefFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FlowAiBrief.
     * @param {FlowAiBriefCreateArgs} args - Arguments to create a FlowAiBrief.
     * @example
     * // Create one FlowAiBrief
     * const FlowAiBrief = await prisma.flowAiBrief.create({
     *   data: {
     *     // ... data to create a FlowAiBrief
     *   }
     * })
     * 
     */
    create<T extends FlowAiBriefCreateArgs>(args: SelectSubset<T, FlowAiBriefCreateArgs<ExtArgs>>): Prisma__FlowAiBriefClient<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FlowAiBriefs.
     * @param {FlowAiBriefCreateManyArgs} args - Arguments to create many FlowAiBriefs.
     * @example
     * // Create many FlowAiBriefs
     * const flowAiBrief = await prisma.flowAiBrief.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlowAiBriefCreateManyArgs>(args?: SelectSubset<T, FlowAiBriefCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FlowAiBriefs and returns the data saved in the database.
     * @param {FlowAiBriefCreateManyAndReturnArgs} args - Arguments to create many FlowAiBriefs.
     * @example
     * // Create many FlowAiBriefs
     * const flowAiBrief = await prisma.flowAiBrief.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FlowAiBriefs and only return the `id`
     * const flowAiBriefWithIdOnly = await prisma.flowAiBrief.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlowAiBriefCreateManyAndReturnArgs>(args?: SelectSubset<T, FlowAiBriefCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FlowAiBrief.
     * @param {FlowAiBriefDeleteArgs} args - Arguments to delete one FlowAiBrief.
     * @example
     * // Delete one FlowAiBrief
     * const FlowAiBrief = await prisma.flowAiBrief.delete({
     *   where: {
     *     // ... filter to delete one FlowAiBrief
     *   }
     * })
     * 
     */
    delete<T extends FlowAiBriefDeleteArgs>(args: SelectSubset<T, FlowAiBriefDeleteArgs<ExtArgs>>): Prisma__FlowAiBriefClient<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FlowAiBrief.
     * @param {FlowAiBriefUpdateArgs} args - Arguments to update one FlowAiBrief.
     * @example
     * // Update one FlowAiBrief
     * const flowAiBrief = await prisma.flowAiBrief.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlowAiBriefUpdateArgs>(args: SelectSubset<T, FlowAiBriefUpdateArgs<ExtArgs>>): Prisma__FlowAiBriefClient<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FlowAiBriefs.
     * @param {FlowAiBriefDeleteManyArgs} args - Arguments to filter FlowAiBriefs to delete.
     * @example
     * // Delete a few FlowAiBriefs
     * const { count } = await prisma.flowAiBrief.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlowAiBriefDeleteManyArgs>(args?: SelectSubset<T, FlowAiBriefDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlowAiBriefs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowAiBriefUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FlowAiBriefs
     * const flowAiBrief = await prisma.flowAiBrief.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlowAiBriefUpdateManyArgs>(args: SelectSubset<T, FlowAiBriefUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlowAiBriefs and returns the data updated in the database.
     * @param {FlowAiBriefUpdateManyAndReturnArgs} args - Arguments to update many FlowAiBriefs.
     * @example
     * // Update many FlowAiBriefs
     * const flowAiBrief = await prisma.flowAiBrief.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FlowAiBriefs and only return the `id`
     * const flowAiBriefWithIdOnly = await prisma.flowAiBrief.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FlowAiBriefUpdateManyAndReturnArgs>(args: SelectSubset<T, FlowAiBriefUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FlowAiBrief.
     * @param {FlowAiBriefUpsertArgs} args - Arguments to update or create a FlowAiBrief.
     * @example
     * // Update or create a FlowAiBrief
     * const flowAiBrief = await prisma.flowAiBrief.upsert({
     *   create: {
     *     // ... data to create a FlowAiBrief
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FlowAiBrief we want to update
     *   }
     * })
     */
    upsert<T extends FlowAiBriefUpsertArgs>(args: SelectSubset<T, FlowAiBriefUpsertArgs<ExtArgs>>): Prisma__FlowAiBriefClient<$Result.GetResult<Prisma.$FlowAiBriefPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FlowAiBriefs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowAiBriefCountArgs} args - Arguments to filter FlowAiBriefs to count.
     * @example
     * // Count the number of FlowAiBriefs
     * const count = await prisma.flowAiBrief.count({
     *   where: {
     *     // ... the filter for the FlowAiBriefs we want to count
     *   }
     * })
    **/
    count<T extends FlowAiBriefCountArgs>(
      args?: Subset<T, FlowAiBriefCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlowAiBriefCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FlowAiBrief.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowAiBriefAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FlowAiBriefAggregateArgs>(args: Subset<T, FlowAiBriefAggregateArgs>): Prisma.PrismaPromise<GetFlowAiBriefAggregateType<T>>

    /**
     * Group by FlowAiBrief.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlowAiBriefGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FlowAiBriefGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlowAiBriefGroupByArgs['orderBy'] }
        : { orderBy?: FlowAiBriefGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FlowAiBriefGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlowAiBriefGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FlowAiBrief model
   */
  readonly fields: FlowAiBriefFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FlowAiBrief.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlowAiBriefClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FlowAiBrief model
   */
  interface FlowAiBriefFieldRefs {
    readonly id: FieldRef<"FlowAiBrief", 'String'>
    readonly symbol: FieldRef<"FlowAiBrief", 'String'>
    readonly expiryDate: FieldRef<"FlowAiBrief", 'DateTime'>
    readonly briefType: FieldRef<"FlowAiBrief", 'String'>
    readonly headline: FieldRef<"FlowAiBrief", 'String'>
    readonly observations: FieldRef<"FlowAiBrief", 'Json'>
    readonly action: FieldRef<"FlowAiBrief", 'String'>
    readonly confidence: FieldRef<"FlowAiBrief", 'Int'>
    readonly marketContext: FieldRef<"FlowAiBrief", 'Json'>
    readonly modelUsed: FieldRef<"FlowAiBrief", 'String'>
    readonly tokensUsed: FieldRef<"FlowAiBrief", 'Int'>
    readonly generatedAt: FieldRef<"FlowAiBrief", 'DateTime'>
    readonly expiresAt: FieldRef<"FlowAiBrief", 'DateTime'>
    readonly isValid: FieldRef<"FlowAiBrief", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * FlowAiBrief findUnique
   */
  export type FlowAiBriefFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * Filter, which FlowAiBrief to fetch.
     */
    where: FlowAiBriefWhereUniqueInput
  }

  /**
   * FlowAiBrief findUniqueOrThrow
   */
  export type FlowAiBriefFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * Filter, which FlowAiBrief to fetch.
     */
    where: FlowAiBriefWhereUniqueInput
  }

  /**
   * FlowAiBrief findFirst
   */
  export type FlowAiBriefFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * Filter, which FlowAiBrief to fetch.
     */
    where?: FlowAiBriefWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowAiBriefs to fetch.
     */
    orderBy?: FlowAiBriefOrderByWithRelationInput | FlowAiBriefOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlowAiBriefs.
     */
    cursor?: FlowAiBriefWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowAiBriefs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowAiBriefs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlowAiBriefs.
     */
    distinct?: FlowAiBriefScalarFieldEnum | FlowAiBriefScalarFieldEnum[]
  }

  /**
   * FlowAiBrief findFirstOrThrow
   */
  export type FlowAiBriefFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * Filter, which FlowAiBrief to fetch.
     */
    where?: FlowAiBriefWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowAiBriefs to fetch.
     */
    orderBy?: FlowAiBriefOrderByWithRelationInput | FlowAiBriefOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlowAiBriefs.
     */
    cursor?: FlowAiBriefWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowAiBriefs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowAiBriefs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlowAiBriefs.
     */
    distinct?: FlowAiBriefScalarFieldEnum | FlowAiBriefScalarFieldEnum[]
  }

  /**
   * FlowAiBrief findMany
   */
  export type FlowAiBriefFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * Filter, which FlowAiBriefs to fetch.
     */
    where?: FlowAiBriefWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlowAiBriefs to fetch.
     */
    orderBy?: FlowAiBriefOrderByWithRelationInput | FlowAiBriefOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FlowAiBriefs.
     */
    cursor?: FlowAiBriefWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlowAiBriefs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlowAiBriefs.
     */
    skip?: number
    distinct?: FlowAiBriefScalarFieldEnum | FlowAiBriefScalarFieldEnum[]
  }

  /**
   * FlowAiBrief create
   */
  export type FlowAiBriefCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * The data needed to create a FlowAiBrief.
     */
    data: XOR<FlowAiBriefCreateInput, FlowAiBriefUncheckedCreateInput>
  }

  /**
   * FlowAiBrief createMany
   */
  export type FlowAiBriefCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FlowAiBriefs.
     */
    data: FlowAiBriefCreateManyInput | FlowAiBriefCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FlowAiBrief createManyAndReturn
   */
  export type FlowAiBriefCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * The data used to create many FlowAiBriefs.
     */
    data: FlowAiBriefCreateManyInput | FlowAiBriefCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FlowAiBrief update
   */
  export type FlowAiBriefUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * The data needed to update a FlowAiBrief.
     */
    data: XOR<FlowAiBriefUpdateInput, FlowAiBriefUncheckedUpdateInput>
    /**
     * Choose, which FlowAiBrief to update.
     */
    where: FlowAiBriefWhereUniqueInput
  }

  /**
   * FlowAiBrief updateMany
   */
  export type FlowAiBriefUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FlowAiBriefs.
     */
    data: XOR<FlowAiBriefUpdateManyMutationInput, FlowAiBriefUncheckedUpdateManyInput>
    /**
     * Filter which FlowAiBriefs to update
     */
    where?: FlowAiBriefWhereInput
    /**
     * Limit how many FlowAiBriefs to update.
     */
    limit?: number
  }

  /**
   * FlowAiBrief updateManyAndReturn
   */
  export type FlowAiBriefUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * The data used to update FlowAiBriefs.
     */
    data: XOR<FlowAiBriefUpdateManyMutationInput, FlowAiBriefUncheckedUpdateManyInput>
    /**
     * Filter which FlowAiBriefs to update
     */
    where?: FlowAiBriefWhereInput
    /**
     * Limit how many FlowAiBriefs to update.
     */
    limit?: number
  }

  /**
   * FlowAiBrief upsert
   */
  export type FlowAiBriefUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * The filter to search for the FlowAiBrief to update in case it exists.
     */
    where: FlowAiBriefWhereUniqueInput
    /**
     * In case the FlowAiBrief found by the `where` argument doesn't exist, create a new FlowAiBrief with this data.
     */
    create: XOR<FlowAiBriefCreateInput, FlowAiBriefUncheckedCreateInput>
    /**
     * In case the FlowAiBrief was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlowAiBriefUpdateInput, FlowAiBriefUncheckedUpdateInput>
  }

  /**
   * FlowAiBrief delete
   */
  export type FlowAiBriefDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
    /**
     * Filter which FlowAiBrief to delete.
     */
    where: FlowAiBriefWhereUniqueInput
  }

  /**
   * FlowAiBrief deleteMany
   */
  export type FlowAiBriefDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlowAiBriefs to delete
     */
    where?: FlowAiBriefWhereInput
    /**
     * Limit how many FlowAiBriefs to delete.
     */
    limit?: number
  }

  /**
   * FlowAiBrief without action
   */
  export type FlowAiBriefDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlowAiBrief
     */
    select?: FlowAiBriefSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlowAiBrief
     */
    omit?: FlowAiBriefOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const NewsRawItemScalarFieldEnum: {
    id: 'id',
    source: 'source',
    externalId: 'externalId',
    dedupeHash: 'dedupeHash',
    headline: 'headline',
    body: 'body',
    url: 'url',
    publishedAt: 'publishedAt',
    rawPayload: 'rawPayload',
    status: 'status',
    failureReason: 'failureReason',
    createdAt: 'createdAt'
  };

  export type NewsRawItemScalarFieldEnum = (typeof NewsRawItemScalarFieldEnum)[keyof typeof NewsRawItemScalarFieldEnum]


  export const NewsTriageScalarFieldEnum: {
    id: 'id',
    rawItemId: 'rawItemId',
    relevant: 'relevant',
    category: 'category',
    urgency: 'urgency',
    modelVersion: 'modelVersion',
    latencyMs: 'latencyMs',
    tokensIn: 'tokensIn',
    tokensOut: 'tokensOut',
    createdAt: 'createdAt'
  };

  export type NewsTriageScalarFieldEnum = (typeof NewsTriageScalarFieldEnum)[keyof typeof NewsTriageScalarFieldEnum]


  export const NewsImpactScalarFieldEnum: {
    id: 'id',
    rawItemId: 'rawItemId',
    sectorImpact: 'sectorImpact',
    direction: 'direction',
    confidence: 'confidence',
    rationale: 'rationale',
    historicalAnalogues: 'historicalAnalogues',
    mode: 'mode',
    disclaimer: 'disclaimer',
    modelVersion: 'modelVersion',
    latencyMs: 'latencyMs',
    tokensIn: 'tokensIn',
    tokensOut: 'tokensOut',
    humanReviewRequired: 'humanReviewRequired',
    humanApproved: 'humanApproved',
    humanNotes: 'humanNotes',
    complianceAuditId: 'complianceAuditId',
    createdAt: 'createdAt'
  };

  export type NewsImpactScalarFieldEnum = (typeof NewsImpactScalarFieldEnum)[keyof typeof NewsImpactScalarFieldEnum]


  export const NewsAuditLogScalarFieldEnum: {
    id: 'id',
    rawItemId: 'rawItemId',
    inputSnapshot: 'inputSnapshot',
    outputSnapshot: 'outputSnapshot',
    modelId: 'modelId',
    promptVersion: 'promptVersion',
    mode: 'mode',
    compliancePassed: 'compliancePassed',
    complianceNotes: 'complianceNotes',
    disclaimer: 'disclaimer',
    timestamp: 'timestamp'
  };

  export type NewsAuditLogScalarFieldEnum = (typeof NewsAuditLogScalarFieldEnum)[keyof typeof NewsAuditLogScalarFieldEnum]


  export const NewsBacktestScalarFieldEnum: {
    id: 'id',
    impactId: 'impactId',
    sector: 'sector',
    taggedDirection: 'taggedDirection',
    session1Return: 'session1Return',
    session3Return: 'session3Return',
    session5Return: 'session5Return',
    directionMatch1: 'directionMatch1',
    directionMatch3: 'directionMatch3',
    directionMatch5: 'directionMatch5',
    measuredAt: 'measuredAt',
    createdAt: 'createdAt'
  };

  export type NewsBacktestScalarFieldEnum = (typeof NewsBacktestScalarFieldEnum)[keyof typeof NewsBacktestScalarFieldEnum]


  export const NewsDigestScalarFieldEnum: {
    id: 'id',
    type: 'type',
    date: 'date',
    content: 'content',
    itemCount: 'itemCount',
    createdAt: 'createdAt'
  };

  export type NewsDigestScalarFieldEnum = (typeof NewsDigestScalarFieldEnum)[keyof typeof NewsDigestScalarFieldEnum]


  export const PipelineMetricScalarFieldEnum: {
    id: 'id',
    metricName: 'metricName',
    value: 'value',
    source: 'source',
    tags: 'tags',
    recordedAt: 'recordedAt'
  };

  export type PipelineMetricScalarFieldEnum = (typeof PipelineMetricScalarFieldEnum)[keyof typeof PipelineMetricScalarFieldEnum]


  export const EnrichedNewsScalarFieldEnum: {
    id: 'id',
    headline: 'headline',
    url: 'url',
    publishedAt: 'publishedAt',
    source: 'source',
    image: 'image',
    originalSummary: 'originalSummary',
    aiSummary: 'aiSummary',
    tldr: 'tldr',
    whyItMatters: 'whyItMatters',
    categories: 'categories',
    sectors: 'sectors',
    companies: 'companies',
    financialTerms: 'financialTerms',
    historicalContext: 'historicalContext',
    shortTermImpact: 'shortTermImpact',
    longTermImpact: 'longTermImpact',
    whatToWatchNext: 'whatToWatchNext',
    riskFactors: 'riskFactors',
    probability: 'probability',
    confidence: 'confidence',
    marketImpact: 'marketImpact',
    relatedArticles: 'relatedArticles',
    createdAt: 'createdAt'
  };

  export type EnrichedNewsScalarFieldEnum = (typeof EnrichedNewsScalarFieldEnum)[keyof typeof EnrichedNewsScalarFieldEnum]


  export const NewsBookmarkScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    newsId: 'newsId',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type NewsBookmarkScalarFieldEnum = (typeof NewsBookmarkScalarFieldEnum)[keyof typeof NewsBookmarkScalarFieldEnum]


  export const TradeNewsLinkScalarFieldEnum: {
    id: 'id',
    tradeId: 'tradeId',
    newsId: 'newsId',
    reason: 'reason'
  };

  export type TradeNewsLinkScalarFieldEnum = (typeof TradeNewsLinkScalarFieldEnum)[keyof typeof TradeNewsLinkScalarFieldEnum]


  export const UserWatchlistScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    value: 'value',
    createdAt: 'createdAt'
  };

  export type UserWatchlistScalarFieldEnum = (typeof UserWatchlistScalarFieldEnum)[keyof typeof UserWatchlistScalarFieldEnum]


  export const OiHistoryScalarFieldEnum: {
    time: 'time',
    symbol: 'symbol',
    expiryDate: 'expiryDate',
    strikePrice: 'strikePrice',
    optionType: 'optionType',
    openInterest: 'openInterest',
    oiChange: 'oiChange',
    volume: 'volume',
    ltp: 'ltp',
    impliedVolatility: 'impliedVolatility',
    delta: 'delta',
    gamma: 'gamma',
    theta: 'theta',
    vega: 'vega'
  };

  export type OiHistoryScalarFieldEnum = (typeof OiHistoryScalarFieldEnum)[keyof typeof OiHistoryScalarFieldEnum]


  export const IvHistoryScalarFieldEnum: {
    time: 'time',
    symbol: 'symbol',
    indiaVix: 'indiaVix',
    atmIv: 'atmIv',
    ivPercentile: 'ivPercentile'
  };

  export type IvHistoryScalarFieldEnum = (typeof IvHistoryScalarFieldEnum)[keyof typeof IvHistoryScalarFieldEnum]


  export const PcrHistoryScalarFieldEnum: {
    time: 'time',
    symbol: 'symbol',
    expiryDate: 'expiryDate',
    pcrOi: 'pcrOi',
    pcrVolume: 'pcrVolume',
    callOiTotal: 'callOiTotal',
    putOiTotal: 'putOiTotal'
  };

  export type PcrHistoryScalarFieldEnum = (typeof PcrHistoryScalarFieldEnum)[keyof typeof PcrHistoryScalarFieldEnum]


  export const FlowAiBriefScalarFieldEnum: {
    id: 'id',
    symbol: 'symbol',
    expiryDate: 'expiryDate',
    briefType: 'briefType',
    headline: 'headline',
    observations: 'observations',
    action: 'action',
    confidence: 'confidence',
    marketContext: 'marketContext',
    modelUsed: 'modelUsed',
    tokensUsed: 'tokensUsed',
    generatedAt: 'generatedAt',
    expiresAt: 'expiresAt',
    isValid: 'isValid'
  };

  export type FlowAiBriefScalarFieldEnum = (typeof FlowAiBriefScalarFieldEnum)[keyof typeof FlowAiBriefScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    
  /**
   * Deep Input Types
   */


  export type NewsRawItemWhereInput = {
    AND?: NewsRawItemWhereInput | NewsRawItemWhereInput[]
    OR?: NewsRawItemWhereInput[]
    NOT?: NewsRawItemWhereInput | NewsRawItemWhereInput[]
    id?: UuidFilter<"NewsRawItem"> | string
    source?: StringFilter<"NewsRawItem"> | string
    externalId?: StringNullableFilter<"NewsRawItem"> | string | null
    dedupeHash?: StringFilter<"NewsRawItem"> | string
    headline?: StringFilter<"NewsRawItem"> | string
    body?: StringNullableFilter<"NewsRawItem"> | string | null
    url?: StringNullableFilter<"NewsRawItem"> | string | null
    publishedAt?: DateTimeFilter<"NewsRawItem"> | Date | string
    rawPayload?: JsonFilter<"NewsRawItem">
    status?: StringFilter<"NewsRawItem"> | string
    failureReason?: StringNullableFilter<"NewsRawItem"> | string | null
    createdAt?: DateTimeFilter<"NewsRawItem"> | Date | string
    triage?: XOR<NewsTriageNullableScalarRelationFilter, NewsTriageWhereInput> | null
    impact?: XOR<NewsImpactNullableScalarRelationFilter, NewsImpactWhereInput> | null
  }

  export type NewsRawItemOrderByWithRelationInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrderInput | SortOrder
    dedupeHash?: SortOrder
    headline?: SortOrder
    body?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    publishedAt?: SortOrder
    rawPayload?: SortOrder
    status?: SortOrder
    failureReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    triage?: NewsTriageOrderByWithRelationInput
    impact?: NewsImpactOrderByWithRelationInput
  }

  export type NewsRawItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    dedupeHash?: string
    AND?: NewsRawItemWhereInput | NewsRawItemWhereInput[]
    OR?: NewsRawItemWhereInput[]
    NOT?: NewsRawItemWhereInput | NewsRawItemWhereInput[]
    source?: StringFilter<"NewsRawItem"> | string
    externalId?: StringNullableFilter<"NewsRawItem"> | string | null
    headline?: StringFilter<"NewsRawItem"> | string
    body?: StringNullableFilter<"NewsRawItem"> | string | null
    url?: StringNullableFilter<"NewsRawItem"> | string | null
    publishedAt?: DateTimeFilter<"NewsRawItem"> | Date | string
    rawPayload?: JsonFilter<"NewsRawItem">
    status?: StringFilter<"NewsRawItem"> | string
    failureReason?: StringNullableFilter<"NewsRawItem"> | string | null
    createdAt?: DateTimeFilter<"NewsRawItem"> | Date | string
    triage?: XOR<NewsTriageNullableScalarRelationFilter, NewsTriageWhereInput> | null
    impact?: XOR<NewsImpactNullableScalarRelationFilter, NewsImpactWhereInput> | null
  }, "id" | "dedupeHash">

  export type NewsRawItemOrderByWithAggregationInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrderInput | SortOrder
    dedupeHash?: SortOrder
    headline?: SortOrder
    body?: SortOrderInput | SortOrder
    url?: SortOrderInput | SortOrder
    publishedAt?: SortOrder
    rawPayload?: SortOrder
    status?: SortOrder
    failureReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NewsRawItemCountOrderByAggregateInput
    _max?: NewsRawItemMaxOrderByAggregateInput
    _min?: NewsRawItemMinOrderByAggregateInput
  }

  export type NewsRawItemScalarWhereWithAggregatesInput = {
    AND?: NewsRawItemScalarWhereWithAggregatesInput | NewsRawItemScalarWhereWithAggregatesInput[]
    OR?: NewsRawItemScalarWhereWithAggregatesInput[]
    NOT?: NewsRawItemScalarWhereWithAggregatesInput | NewsRawItemScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NewsRawItem"> | string
    source?: StringWithAggregatesFilter<"NewsRawItem"> | string
    externalId?: StringNullableWithAggregatesFilter<"NewsRawItem"> | string | null
    dedupeHash?: StringWithAggregatesFilter<"NewsRawItem"> | string
    headline?: StringWithAggregatesFilter<"NewsRawItem"> | string
    body?: StringNullableWithAggregatesFilter<"NewsRawItem"> | string | null
    url?: StringNullableWithAggregatesFilter<"NewsRawItem"> | string | null
    publishedAt?: DateTimeWithAggregatesFilter<"NewsRawItem"> | Date | string
    rawPayload?: JsonWithAggregatesFilter<"NewsRawItem">
    status?: StringWithAggregatesFilter<"NewsRawItem"> | string
    failureReason?: StringNullableWithAggregatesFilter<"NewsRawItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"NewsRawItem"> | Date | string
  }

  export type NewsTriageWhereInput = {
    AND?: NewsTriageWhereInput | NewsTriageWhereInput[]
    OR?: NewsTriageWhereInput[]
    NOT?: NewsTriageWhereInput | NewsTriageWhereInput[]
    id?: UuidFilter<"NewsTriage"> | string
    rawItemId?: UuidFilter<"NewsTriage"> | string
    relevant?: BoolFilter<"NewsTriage"> | boolean
    category?: StringFilter<"NewsTriage"> | string
    urgency?: StringFilter<"NewsTriage"> | string
    modelVersion?: StringFilter<"NewsTriage"> | string
    latencyMs?: IntFilter<"NewsTriage"> | number
    tokensIn?: IntNullableFilter<"NewsTriage"> | number | null
    tokensOut?: IntNullableFilter<"NewsTriage"> | number | null
    createdAt?: DateTimeFilter<"NewsTriage"> | Date | string
    rawItem?: XOR<NewsRawItemScalarRelationFilter, NewsRawItemWhereInput>
  }

  export type NewsTriageOrderByWithRelationInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    relevant?: SortOrder
    category?: SortOrder
    urgency?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrderInput | SortOrder
    tokensOut?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    rawItem?: NewsRawItemOrderByWithRelationInput
  }

  export type NewsTriageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    rawItemId?: string
    AND?: NewsTriageWhereInput | NewsTriageWhereInput[]
    OR?: NewsTriageWhereInput[]
    NOT?: NewsTriageWhereInput | NewsTriageWhereInput[]
    relevant?: BoolFilter<"NewsTriage"> | boolean
    category?: StringFilter<"NewsTriage"> | string
    urgency?: StringFilter<"NewsTriage"> | string
    modelVersion?: StringFilter<"NewsTriage"> | string
    latencyMs?: IntFilter<"NewsTriage"> | number
    tokensIn?: IntNullableFilter<"NewsTriage"> | number | null
    tokensOut?: IntNullableFilter<"NewsTriage"> | number | null
    createdAt?: DateTimeFilter<"NewsTriage"> | Date | string
    rawItem?: XOR<NewsRawItemScalarRelationFilter, NewsRawItemWhereInput>
  }, "id" | "rawItemId">

  export type NewsTriageOrderByWithAggregationInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    relevant?: SortOrder
    category?: SortOrder
    urgency?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrderInput | SortOrder
    tokensOut?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NewsTriageCountOrderByAggregateInput
    _avg?: NewsTriageAvgOrderByAggregateInput
    _max?: NewsTriageMaxOrderByAggregateInput
    _min?: NewsTriageMinOrderByAggregateInput
    _sum?: NewsTriageSumOrderByAggregateInput
  }

  export type NewsTriageScalarWhereWithAggregatesInput = {
    AND?: NewsTriageScalarWhereWithAggregatesInput | NewsTriageScalarWhereWithAggregatesInput[]
    OR?: NewsTriageScalarWhereWithAggregatesInput[]
    NOT?: NewsTriageScalarWhereWithAggregatesInput | NewsTriageScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NewsTriage"> | string
    rawItemId?: UuidWithAggregatesFilter<"NewsTriage"> | string
    relevant?: BoolWithAggregatesFilter<"NewsTriage"> | boolean
    category?: StringWithAggregatesFilter<"NewsTriage"> | string
    urgency?: StringWithAggregatesFilter<"NewsTriage"> | string
    modelVersion?: StringWithAggregatesFilter<"NewsTriage"> | string
    latencyMs?: IntWithAggregatesFilter<"NewsTriage"> | number
    tokensIn?: IntNullableWithAggregatesFilter<"NewsTriage"> | number | null
    tokensOut?: IntNullableWithAggregatesFilter<"NewsTriage"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"NewsTriage"> | Date | string
  }

  export type NewsImpactWhereInput = {
    AND?: NewsImpactWhereInput | NewsImpactWhereInput[]
    OR?: NewsImpactWhereInput[]
    NOT?: NewsImpactWhereInput | NewsImpactWhereInput[]
    id?: UuidFilter<"NewsImpact"> | string
    rawItemId?: UuidFilter<"NewsImpact"> | string
    sectorImpact?: StringNullableListFilter<"NewsImpact">
    direction?: StringFilter<"NewsImpact"> | string
    confidence?: StringFilter<"NewsImpact"> | string
    rationale?: StringFilter<"NewsImpact"> | string
    historicalAnalogues?: JsonFilter<"NewsImpact">
    mode?: StringFilter<"NewsImpact"> | string
    disclaimer?: StringFilter<"NewsImpact"> | string
    modelVersion?: StringFilter<"NewsImpact"> | string
    latencyMs?: IntFilter<"NewsImpact"> | number
    tokensIn?: IntNullableFilter<"NewsImpact"> | number | null
    tokensOut?: IntNullableFilter<"NewsImpact"> | number | null
    humanReviewRequired?: BoolFilter<"NewsImpact"> | boolean
    humanApproved?: BoolNullableFilter<"NewsImpact"> | boolean | null
    humanNotes?: StringNullableFilter<"NewsImpact"> | string | null
    complianceAuditId?: UuidFilter<"NewsImpact"> | string
    createdAt?: DateTimeFilter<"NewsImpact"> | Date | string
    rawItem?: XOR<NewsRawItemScalarRelationFilter, NewsRawItemWhereInput>
    auditLog?: XOR<NewsAuditLogScalarRelationFilter, NewsAuditLogWhereInput>
    backtests?: NewsBacktestListRelationFilter
  }

  export type NewsImpactOrderByWithRelationInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    sectorImpact?: SortOrder
    direction?: SortOrder
    confidence?: SortOrder
    rationale?: SortOrder
    historicalAnalogues?: SortOrder
    mode?: SortOrder
    disclaimer?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrderInput | SortOrder
    tokensOut?: SortOrderInput | SortOrder
    humanReviewRequired?: SortOrder
    humanApproved?: SortOrderInput | SortOrder
    humanNotes?: SortOrderInput | SortOrder
    complianceAuditId?: SortOrder
    createdAt?: SortOrder
    rawItem?: NewsRawItemOrderByWithRelationInput
    auditLog?: NewsAuditLogOrderByWithRelationInput
    backtests?: NewsBacktestOrderByRelationAggregateInput
  }

  export type NewsImpactWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    rawItemId?: string
    complianceAuditId?: string
    AND?: NewsImpactWhereInput | NewsImpactWhereInput[]
    OR?: NewsImpactWhereInput[]
    NOT?: NewsImpactWhereInput | NewsImpactWhereInput[]
    sectorImpact?: StringNullableListFilter<"NewsImpact">
    direction?: StringFilter<"NewsImpact"> | string
    confidence?: StringFilter<"NewsImpact"> | string
    rationale?: StringFilter<"NewsImpact"> | string
    historicalAnalogues?: JsonFilter<"NewsImpact">
    mode?: StringFilter<"NewsImpact"> | string
    disclaimer?: StringFilter<"NewsImpact"> | string
    modelVersion?: StringFilter<"NewsImpact"> | string
    latencyMs?: IntFilter<"NewsImpact"> | number
    tokensIn?: IntNullableFilter<"NewsImpact"> | number | null
    tokensOut?: IntNullableFilter<"NewsImpact"> | number | null
    humanReviewRequired?: BoolFilter<"NewsImpact"> | boolean
    humanApproved?: BoolNullableFilter<"NewsImpact"> | boolean | null
    humanNotes?: StringNullableFilter<"NewsImpact"> | string | null
    createdAt?: DateTimeFilter<"NewsImpact"> | Date | string
    rawItem?: XOR<NewsRawItemScalarRelationFilter, NewsRawItemWhereInput>
    auditLog?: XOR<NewsAuditLogScalarRelationFilter, NewsAuditLogWhereInput>
    backtests?: NewsBacktestListRelationFilter
  }, "id" | "rawItemId" | "complianceAuditId">

  export type NewsImpactOrderByWithAggregationInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    sectorImpact?: SortOrder
    direction?: SortOrder
    confidence?: SortOrder
    rationale?: SortOrder
    historicalAnalogues?: SortOrder
    mode?: SortOrder
    disclaimer?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrderInput | SortOrder
    tokensOut?: SortOrderInput | SortOrder
    humanReviewRequired?: SortOrder
    humanApproved?: SortOrderInput | SortOrder
    humanNotes?: SortOrderInput | SortOrder
    complianceAuditId?: SortOrder
    createdAt?: SortOrder
    _count?: NewsImpactCountOrderByAggregateInput
    _avg?: NewsImpactAvgOrderByAggregateInput
    _max?: NewsImpactMaxOrderByAggregateInput
    _min?: NewsImpactMinOrderByAggregateInput
    _sum?: NewsImpactSumOrderByAggregateInput
  }

  export type NewsImpactScalarWhereWithAggregatesInput = {
    AND?: NewsImpactScalarWhereWithAggregatesInput | NewsImpactScalarWhereWithAggregatesInput[]
    OR?: NewsImpactScalarWhereWithAggregatesInput[]
    NOT?: NewsImpactScalarWhereWithAggregatesInput | NewsImpactScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NewsImpact"> | string
    rawItemId?: UuidWithAggregatesFilter<"NewsImpact"> | string
    sectorImpact?: StringNullableListFilter<"NewsImpact">
    direction?: StringWithAggregatesFilter<"NewsImpact"> | string
    confidence?: StringWithAggregatesFilter<"NewsImpact"> | string
    rationale?: StringWithAggregatesFilter<"NewsImpact"> | string
    historicalAnalogues?: JsonWithAggregatesFilter<"NewsImpact">
    mode?: StringWithAggregatesFilter<"NewsImpact"> | string
    disclaimer?: StringWithAggregatesFilter<"NewsImpact"> | string
    modelVersion?: StringWithAggregatesFilter<"NewsImpact"> | string
    latencyMs?: IntWithAggregatesFilter<"NewsImpact"> | number
    tokensIn?: IntNullableWithAggregatesFilter<"NewsImpact"> | number | null
    tokensOut?: IntNullableWithAggregatesFilter<"NewsImpact"> | number | null
    humanReviewRequired?: BoolWithAggregatesFilter<"NewsImpact"> | boolean
    humanApproved?: BoolNullableWithAggregatesFilter<"NewsImpact"> | boolean | null
    humanNotes?: StringNullableWithAggregatesFilter<"NewsImpact"> | string | null
    complianceAuditId?: UuidWithAggregatesFilter<"NewsImpact"> | string
    createdAt?: DateTimeWithAggregatesFilter<"NewsImpact"> | Date | string
  }

  export type NewsAuditLogWhereInput = {
    AND?: NewsAuditLogWhereInput | NewsAuditLogWhereInput[]
    OR?: NewsAuditLogWhereInput[]
    NOT?: NewsAuditLogWhereInput | NewsAuditLogWhereInput[]
    id?: UuidFilter<"NewsAuditLog"> | string
    rawItemId?: UuidFilter<"NewsAuditLog"> | string
    inputSnapshot?: JsonFilter<"NewsAuditLog">
    outputSnapshot?: JsonFilter<"NewsAuditLog">
    modelId?: StringFilter<"NewsAuditLog"> | string
    promptVersion?: StringFilter<"NewsAuditLog"> | string
    mode?: StringFilter<"NewsAuditLog"> | string
    compliancePassed?: BoolFilter<"NewsAuditLog"> | boolean
    complianceNotes?: StringNullableFilter<"NewsAuditLog"> | string | null
    disclaimer?: StringFilter<"NewsAuditLog"> | string
    timestamp?: DateTimeFilter<"NewsAuditLog"> | Date | string
    impact?: XOR<NewsImpactNullableScalarRelationFilter, NewsImpactWhereInput> | null
  }

  export type NewsAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    inputSnapshot?: SortOrder
    outputSnapshot?: SortOrder
    modelId?: SortOrder
    promptVersion?: SortOrder
    mode?: SortOrder
    compliancePassed?: SortOrder
    complianceNotes?: SortOrderInput | SortOrder
    disclaimer?: SortOrder
    timestamp?: SortOrder
    impact?: NewsImpactOrderByWithRelationInput
  }

  export type NewsAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NewsAuditLogWhereInput | NewsAuditLogWhereInput[]
    OR?: NewsAuditLogWhereInput[]
    NOT?: NewsAuditLogWhereInput | NewsAuditLogWhereInput[]
    rawItemId?: UuidFilter<"NewsAuditLog"> | string
    inputSnapshot?: JsonFilter<"NewsAuditLog">
    outputSnapshot?: JsonFilter<"NewsAuditLog">
    modelId?: StringFilter<"NewsAuditLog"> | string
    promptVersion?: StringFilter<"NewsAuditLog"> | string
    mode?: StringFilter<"NewsAuditLog"> | string
    compliancePassed?: BoolFilter<"NewsAuditLog"> | boolean
    complianceNotes?: StringNullableFilter<"NewsAuditLog"> | string | null
    disclaimer?: StringFilter<"NewsAuditLog"> | string
    timestamp?: DateTimeFilter<"NewsAuditLog"> | Date | string
    impact?: XOR<NewsImpactNullableScalarRelationFilter, NewsImpactWhereInput> | null
  }, "id">

  export type NewsAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    inputSnapshot?: SortOrder
    outputSnapshot?: SortOrder
    modelId?: SortOrder
    promptVersion?: SortOrder
    mode?: SortOrder
    compliancePassed?: SortOrder
    complianceNotes?: SortOrderInput | SortOrder
    disclaimer?: SortOrder
    timestamp?: SortOrder
    _count?: NewsAuditLogCountOrderByAggregateInput
    _max?: NewsAuditLogMaxOrderByAggregateInput
    _min?: NewsAuditLogMinOrderByAggregateInput
  }

  export type NewsAuditLogScalarWhereWithAggregatesInput = {
    AND?: NewsAuditLogScalarWhereWithAggregatesInput | NewsAuditLogScalarWhereWithAggregatesInput[]
    OR?: NewsAuditLogScalarWhereWithAggregatesInput[]
    NOT?: NewsAuditLogScalarWhereWithAggregatesInput | NewsAuditLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NewsAuditLog"> | string
    rawItemId?: UuidWithAggregatesFilter<"NewsAuditLog"> | string
    inputSnapshot?: JsonWithAggregatesFilter<"NewsAuditLog">
    outputSnapshot?: JsonWithAggregatesFilter<"NewsAuditLog">
    modelId?: StringWithAggregatesFilter<"NewsAuditLog"> | string
    promptVersion?: StringWithAggregatesFilter<"NewsAuditLog"> | string
    mode?: StringWithAggregatesFilter<"NewsAuditLog"> | string
    compliancePassed?: BoolWithAggregatesFilter<"NewsAuditLog"> | boolean
    complianceNotes?: StringNullableWithAggregatesFilter<"NewsAuditLog"> | string | null
    disclaimer?: StringWithAggregatesFilter<"NewsAuditLog"> | string
    timestamp?: DateTimeWithAggregatesFilter<"NewsAuditLog"> | Date | string
  }

  export type NewsBacktestWhereInput = {
    AND?: NewsBacktestWhereInput | NewsBacktestWhereInput[]
    OR?: NewsBacktestWhereInput[]
    NOT?: NewsBacktestWhereInput | NewsBacktestWhereInput[]
    id?: UuidFilter<"NewsBacktest"> | string
    impactId?: UuidFilter<"NewsBacktest"> | string
    sector?: StringFilter<"NewsBacktest"> | string
    taggedDirection?: StringFilter<"NewsBacktest"> | string
    session1Return?: FloatNullableFilter<"NewsBacktest"> | number | null
    session3Return?: FloatNullableFilter<"NewsBacktest"> | number | null
    session5Return?: FloatNullableFilter<"NewsBacktest"> | number | null
    directionMatch1?: BoolNullableFilter<"NewsBacktest"> | boolean | null
    directionMatch3?: BoolNullableFilter<"NewsBacktest"> | boolean | null
    directionMatch5?: BoolNullableFilter<"NewsBacktest"> | boolean | null
    measuredAt?: DateTimeNullableFilter<"NewsBacktest"> | Date | string | null
    createdAt?: DateTimeFilter<"NewsBacktest"> | Date | string
    impact?: XOR<NewsImpactScalarRelationFilter, NewsImpactWhereInput>
  }

  export type NewsBacktestOrderByWithRelationInput = {
    id?: SortOrder
    impactId?: SortOrder
    sector?: SortOrder
    taggedDirection?: SortOrder
    session1Return?: SortOrderInput | SortOrder
    session3Return?: SortOrderInput | SortOrder
    session5Return?: SortOrderInput | SortOrder
    directionMatch1?: SortOrderInput | SortOrder
    directionMatch3?: SortOrderInput | SortOrder
    directionMatch5?: SortOrderInput | SortOrder
    measuredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    impact?: NewsImpactOrderByWithRelationInput
  }

  export type NewsBacktestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NewsBacktestWhereInput | NewsBacktestWhereInput[]
    OR?: NewsBacktestWhereInput[]
    NOT?: NewsBacktestWhereInput | NewsBacktestWhereInput[]
    impactId?: UuidFilter<"NewsBacktest"> | string
    sector?: StringFilter<"NewsBacktest"> | string
    taggedDirection?: StringFilter<"NewsBacktest"> | string
    session1Return?: FloatNullableFilter<"NewsBacktest"> | number | null
    session3Return?: FloatNullableFilter<"NewsBacktest"> | number | null
    session5Return?: FloatNullableFilter<"NewsBacktest"> | number | null
    directionMatch1?: BoolNullableFilter<"NewsBacktest"> | boolean | null
    directionMatch3?: BoolNullableFilter<"NewsBacktest"> | boolean | null
    directionMatch5?: BoolNullableFilter<"NewsBacktest"> | boolean | null
    measuredAt?: DateTimeNullableFilter<"NewsBacktest"> | Date | string | null
    createdAt?: DateTimeFilter<"NewsBacktest"> | Date | string
    impact?: XOR<NewsImpactScalarRelationFilter, NewsImpactWhereInput>
  }, "id">

  export type NewsBacktestOrderByWithAggregationInput = {
    id?: SortOrder
    impactId?: SortOrder
    sector?: SortOrder
    taggedDirection?: SortOrder
    session1Return?: SortOrderInput | SortOrder
    session3Return?: SortOrderInput | SortOrder
    session5Return?: SortOrderInput | SortOrder
    directionMatch1?: SortOrderInput | SortOrder
    directionMatch3?: SortOrderInput | SortOrder
    directionMatch5?: SortOrderInput | SortOrder
    measuredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NewsBacktestCountOrderByAggregateInput
    _avg?: NewsBacktestAvgOrderByAggregateInput
    _max?: NewsBacktestMaxOrderByAggregateInput
    _min?: NewsBacktestMinOrderByAggregateInput
    _sum?: NewsBacktestSumOrderByAggregateInput
  }

  export type NewsBacktestScalarWhereWithAggregatesInput = {
    AND?: NewsBacktestScalarWhereWithAggregatesInput | NewsBacktestScalarWhereWithAggregatesInput[]
    OR?: NewsBacktestScalarWhereWithAggregatesInput[]
    NOT?: NewsBacktestScalarWhereWithAggregatesInput | NewsBacktestScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NewsBacktest"> | string
    impactId?: UuidWithAggregatesFilter<"NewsBacktest"> | string
    sector?: StringWithAggregatesFilter<"NewsBacktest"> | string
    taggedDirection?: StringWithAggregatesFilter<"NewsBacktest"> | string
    session1Return?: FloatNullableWithAggregatesFilter<"NewsBacktest"> | number | null
    session3Return?: FloatNullableWithAggregatesFilter<"NewsBacktest"> | number | null
    session5Return?: FloatNullableWithAggregatesFilter<"NewsBacktest"> | number | null
    directionMatch1?: BoolNullableWithAggregatesFilter<"NewsBacktest"> | boolean | null
    directionMatch3?: BoolNullableWithAggregatesFilter<"NewsBacktest"> | boolean | null
    directionMatch5?: BoolNullableWithAggregatesFilter<"NewsBacktest"> | boolean | null
    measuredAt?: DateTimeNullableWithAggregatesFilter<"NewsBacktest"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"NewsBacktest"> | Date | string
  }

  export type NewsDigestWhereInput = {
    AND?: NewsDigestWhereInput | NewsDigestWhereInput[]
    OR?: NewsDigestWhereInput[]
    NOT?: NewsDigestWhereInput | NewsDigestWhereInput[]
    id?: UuidFilter<"NewsDigest"> | string
    type?: StringFilter<"NewsDigest"> | string
    date?: DateTimeFilter<"NewsDigest"> | Date | string
    content?: JsonFilter<"NewsDigest">
    itemCount?: IntFilter<"NewsDigest"> | number
    createdAt?: DateTimeFilter<"NewsDigest"> | Date | string
  }

  export type NewsDigestOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    date?: SortOrder
    content?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsDigestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    type_date?: NewsDigestTypeDateCompoundUniqueInput
    AND?: NewsDigestWhereInput | NewsDigestWhereInput[]
    OR?: NewsDigestWhereInput[]
    NOT?: NewsDigestWhereInput | NewsDigestWhereInput[]
    type?: StringFilter<"NewsDigest"> | string
    date?: DateTimeFilter<"NewsDigest"> | Date | string
    content?: JsonFilter<"NewsDigest">
    itemCount?: IntFilter<"NewsDigest"> | number
    createdAt?: DateTimeFilter<"NewsDigest"> | Date | string
  }, "id" | "type_date">

  export type NewsDigestOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    date?: SortOrder
    content?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
    _count?: NewsDigestCountOrderByAggregateInput
    _avg?: NewsDigestAvgOrderByAggregateInput
    _max?: NewsDigestMaxOrderByAggregateInput
    _min?: NewsDigestMinOrderByAggregateInput
    _sum?: NewsDigestSumOrderByAggregateInput
  }

  export type NewsDigestScalarWhereWithAggregatesInput = {
    AND?: NewsDigestScalarWhereWithAggregatesInput | NewsDigestScalarWhereWithAggregatesInput[]
    OR?: NewsDigestScalarWhereWithAggregatesInput[]
    NOT?: NewsDigestScalarWhereWithAggregatesInput | NewsDigestScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NewsDigest"> | string
    type?: StringWithAggregatesFilter<"NewsDigest"> | string
    date?: DateTimeWithAggregatesFilter<"NewsDigest"> | Date | string
    content?: JsonWithAggregatesFilter<"NewsDigest">
    itemCount?: IntWithAggregatesFilter<"NewsDigest"> | number
    createdAt?: DateTimeWithAggregatesFilter<"NewsDigest"> | Date | string
  }

  export type PipelineMetricWhereInput = {
    AND?: PipelineMetricWhereInput | PipelineMetricWhereInput[]
    OR?: PipelineMetricWhereInput[]
    NOT?: PipelineMetricWhereInput | PipelineMetricWhereInput[]
    id?: UuidFilter<"PipelineMetric"> | string
    metricName?: StringFilter<"PipelineMetric"> | string
    value?: FloatFilter<"PipelineMetric"> | number
    source?: StringNullableFilter<"PipelineMetric"> | string | null
    tags?: JsonNullableFilter<"PipelineMetric">
    recordedAt?: DateTimeFilter<"PipelineMetric"> | Date | string
  }

  export type PipelineMetricOrderByWithRelationInput = {
    id?: SortOrder
    metricName?: SortOrder
    value?: SortOrder
    source?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
  }

  export type PipelineMetricWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PipelineMetricWhereInput | PipelineMetricWhereInput[]
    OR?: PipelineMetricWhereInput[]
    NOT?: PipelineMetricWhereInput | PipelineMetricWhereInput[]
    metricName?: StringFilter<"PipelineMetric"> | string
    value?: FloatFilter<"PipelineMetric"> | number
    source?: StringNullableFilter<"PipelineMetric"> | string | null
    tags?: JsonNullableFilter<"PipelineMetric">
    recordedAt?: DateTimeFilter<"PipelineMetric"> | Date | string
  }, "id">

  export type PipelineMetricOrderByWithAggregationInput = {
    id?: SortOrder
    metricName?: SortOrder
    value?: SortOrder
    source?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    _count?: PipelineMetricCountOrderByAggregateInput
    _avg?: PipelineMetricAvgOrderByAggregateInput
    _max?: PipelineMetricMaxOrderByAggregateInput
    _min?: PipelineMetricMinOrderByAggregateInput
    _sum?: PipelineMetricSumOrderByAggregateInput
  }

  export type PipelineMetricScalarWhereWithAggregatesInput = {
    AND?: PipelineMetricScalarWhereWithAggregatesInput | PipelineMetricScalarWhereWithAggregatesInput[]
    OR?: PipelineMetricScalarWhereWithAggregatesInput[]
    NOT?: PipelineMetricScalarWhereWithAggregatesInput | PipelineMetricScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PipelineMetric"> | string
    metricName?: StringWithAggregatesFilter<"PipelineMetric"> | string
    value?: FloatWithAggregatesFilter<"PipelineMetric"> | number
    source?: StringNullableWithAggregatesFilter<"PipelineMetric"> | string | null
    tags?: JsonNullableWithAggregatesFilter<"PipelineMetric">
    recordedAt?: DateTimeWithAggregatesFilter<"PipelineMetric"> | Date | string
  }

  export type EnrichedNewsWhereInput = {
    AND?: EnrichedNewsWhereInput | EnrichedNewsWhereInput[]
    OR?: EnrichedNewsWhereInput[]
    NOT?: EnrichedNewsWhereInput | EnrichedNewsWhereInput[]
    id?: StringFilter<"EnrichedNews"> | string
    headline?: StringFilter<"EnrichedNews"> | string
    url?: StringFilter<"EnrichedNews"> | string
    publishedAt?: IntFilter<"EnrichedNews"> | number
    source?: StringFilter<"EnrichedNews"> | string
    image?: StringNullableFilter<"EnrichedNews"> | string | null
    originalSummary?: StringNullableFilter<"EnrichedNews"> | string | null
    aiSummary?: StringNullableFilter<"EnrichedNews"> | string | null
    tldr?: StringNullableFilter<"EnrichedNews"> | string | null
    whyItMatters?: StringNullableFilter<"EnrichedNews"> | string | null
    categories?: StringNullableListFilter<"EnrichedNews">
    sectors?: StringNullableListFilter<"EnrichedNews">
    companies?: StringNullableListFilter<"EnrichedNews">
    financialTerms?: JsonNullableFilter<"EnrichedNews">
    historicalContext?: StringNullableFilter<"EnrichedNews"> | string | null
    shortTermImpact?: StringNullableFilter<"EnrichedNews"> | string | null
    longTermImpact?: StringNullableFilter<"EnrichedNews"> | string | null
    whatToWatchNext?: StringNullableFilter<"EnrichedNews"> | string | null
    riskFactors?: StringNullableFilter<"EnrichedNews"> | string | null
    probability?: IntNullableFilter<"EnrichedNews"> | number | null
    confidence?: IntNullableFilter<"EnrichedNews"> | number | null
    marketImpact?: JsonNullableFilter<"EnrichedNews">
    relatedArticles?: JsonNullableFilter<"EnrichedNews">
    createdAt?: DateTimeFilter<"EnrichedNews"> | Date | string
    bookmarks?: NewsBookmarkListRelationFilter
    tradeLinks?: TradeNewsLinkListRelationFilter
  }

  export type EnrichedNewsOrderByWithRelationInput = {
    id?: SortOrder
    headline?: SortOrder
    url?: SortOrder
    publishedAt?: SortOrder
    source?: SortOrder
    image?: SortOrderInput | SortOrder
    originalSummary?: SortOrderInput | SortOrder
    aiSummary?: SortOrderInput | SortOrder
    tldr?: SortOrderInput | SortOrder
    whyItMatters?: SortOrderInput | SortOrder
    categories?: SortOrder
    sectors?: SortOrder
    companies?: SortOrder
    financialTerms?: SortOrderInput | SortOrder
    historicalContext?: SortOrderInput | SortOrder
    shortTermImpact?: SortOrderInput | SortOrder
    longTermImpact?: SortOrderInput | SortOrder
    whatToWatchNext?: SortOrderInput | SortOrder
    riskFactors?: SortOrderInput | SortOrder
    probability?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    marketImpact?: SortOrderInput | SortOrder
    relatedArticles?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    bookmarks?: NewsBookmarkOrderByRelationAggregateInput
    tradeLinks?: TradeNewsLinkOrderByRelationAggregateInput
  }

  export type EnrichedNewsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EnrichedNewsWhereInput | EnrichedNewsWhereInput[]
    OR?: EnrichedNewsWhereInput[]
    NOT?: EnrichedNewsWhereInput | EnrichedNewsWhereInput[]
    headline?: StringFilter<"EnrichedNews"> | string
    url?: StringFilter<"EnrichedNews"> | string
    publishedAt?: IntFilter<"EnrichedNews"> | number
    source?: StringFilter<"EnrichedNews"> | string
    image?: StringNullableFilter<"EnrichedNews"> | string | null
    originalSummary?: StringNullableFilter<"EnrichedNews"> | string | null
    aiSummary?: StringNullableFilter<"EnrichedNews"> | string | null
    tldr?: StringNullableFilter<"EnrichedNews"> | string | null
    whyItMatters?: StringNullableFilter<"EnrichedNews"> | string | null
    categories?: StringNullableListFilter<"EnrichedNews">
    sectors?: StringNullableListFilter<"EnrichedNews">
    companies?: StringNullableListFilter<"EnrichedNews">
    financialTerms?: JsonNullableFilter<"EnrichedNews">
    historicalContext?: StringNullableFilter<"EnrichedNews"> | string | null
    shortTermImpact?: StringNullableFilter<"EnrichedNews"> | string | null
    longTermImpact?: StringNullableFilter<"EnrichedNews"> | string | null
    whatToWatchNext?: StringNullableFilter<"EnrichedNews"> | string | null
    riskFactors?: StringNullableFilter<"EnrichedNews"> | string | null
    probability?: IntNullableFilter<"EnrichedNews"> | number | null
    confidence?: IntNullableFilter<"EnrichedNews"> | number | null
    marketImpact?: JsonNullableFilter<"EnrichedNews">
    relatedArticles?: JsonNullableFilter<"EnrichedNews">
    createdAt?: DateTimeFilter<"EnrichedNews"> | Date | string
    bookmarks?: NewsBookmarkListRelationFilter
    tradeLinks?: TradeNewsLinkListRelationFilter
  }, "id">

  export type EnrichedNewsOrderByWithAggregationInput = {
    id?: SortOrder
    headline?: SortOrder
    url?: SortOrder
    publishedAt?: SortOrder
    source?: SortOrder
    image?: SortOrderInput | SortOrder
    originalSummary?: SortOrderInput | SortOrder
    aiSummary?: SortOrderInput | SortOrder
    tldr?: SortOrderInput | SortOrder
    whyItMatters?: SortOrderInput | SortOrder
    categories?: SortOrder
    sectors?: SortOrder
    companies?: SortOrder
    financialTerms?: SortOrderInput | SortOrder
    historicalContext?: SortOrderInput | SortOrder
    shortTermImpact?: SortOrderInput | SortOrder
    longTermImpact?: SortOrderInput | SortOrder
    whatToWatchNext?: SortOrderInput | SortOrder
    riskFactors?: SortOrderInput | SortOrder
    probability?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    marketImpact?: SortOrderInput | SortOrder
    relatedArticles?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: EnrichedNewsCountOrderByAggregateInput
    _avg?: EnrichedNewsAvgOrderByAggregateInput
    _max?: EnrichedNewsMaxOrderByAggregateInput
    _min?: EnrichedNewsMinOrderByAggregateInput
    _sum?: EnrichedNewsSumOrderByAggregateInput
  }

  export type EnrichedNewsScalarWhereWithAggregatesInput = {
    AND?: EnrichedNewsScalarWhereWithAggregatesInput | EnrichedNewsScalarWhereWithAggregatesInput[]
    OR?: EnrichedNewsScalarWhereWithAggregatesInput[]
    NOT?: EnrichedNewsScalarWhereWithAggregatesInput | EnrichedNewsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EnrichedNews"> | string
    headline?: StringWithAggregatesFilter<"EnrichedNews"> | string
    url?: StringWithAggregatesFilter<"EnrichedNews"> | string
    publishedAt?: IntWithAggregatesFilter<"EnrichedNews"> | number
    source?: StringWithAggregatesFilter<"EnrichedNews"> | string
    image?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    originalSummary?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    aiSummary?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    tldr?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    whyItMatters?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    categories?: StringNullableListFilter<"EnrichedNews">
    sectors?: StringNullableListFilter<"EnrichedNews">
    companies?: StringNullableListFilter<"EnrichedNews">
    financialTerms?: JsonNullableWithAggregatesFilter<"EnrichedNews">
    historicalContext?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    shortTermImpact?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    longTermImpact?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    whatToWatchNext?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    riskFactors?: StringNullableWithAggregatesFilter<"EnrichedNews"> | string | null
    probability?: IntNullableWithAggregatesFilter<"EnrichedNews"> | number | null
    confidence?: IntNullableWithAggregatesFilter<"EnrichedNews"> | number | null
    marketImpact?: JsonNullableWithAggregatesFilter<"EnrichedNews">
    relatedArticles?: JsonNullableWithAggregatesFilter<"EnrichedNews">
    createdAt?: DateTimeWithAggregatesFilter<"EnrichedNews"> | Date | string
  }

  export type NewsBookmarkWhereInput = {
    AND?: NewsBookmarkWhereInput | NewsBookmarkWhereInput[]
    OR?: NewsBookmarkWhereInput[]
    NOT?: NewsBookmarkWhereInput | NewsBookmarkWhereInput[]
    id?: UuidFilter<"NewsBookmark"> | string
    userId?: UuidFilter<"NewsBookmark"> | string
    newsId?: StringFilter<"NewsBookmark"> | string
    notes?: StringNullableFilter<"NewsBookmark"> | string | null
    createdAt?: DateTimeFilter<"NewsBookmark"> | Date | string
    news?: XOR<EnrichedNewsScalarRelationFilter, EnrichedNewsWhereInput>
  }

  export type NewsBookmarkOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    newsId?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    news?: EnrichedNewsOrderByWithRelationInput
  }

  export type NewsBookmarkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_newsId?: NewsBookmarkUserIdNewsIdCompoundUniqueInput
    AND?: NewsBookmarkWhereInput | NewsBookmarkWhereInput[]
    OR?: NewsBookmarkWhereInput[]
    NOT?: NewsBookmarkWhereInput | NewsBookmarkWhereInput[]
    userId?: UuidFilter<"NewsBookmark"> | string
    newsId?: StringFilter<"NewsBookmark"> | string
    notes?: StringNullableFilter<"NewsBookmark"> | string | null
    createdAt?: DateTimeFilter<"NewsBookmark"> | Date | string
    news?: XOR<EnrichedNewsScalarRelationFilter, EnrichedNewsWhereInput>
  }, "id" | "userId_newsId">

  export type NewsBookmarkOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    newsId?: SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: NewsBookmarkCountOrderByAggregateInput
    _max?: NewsBookmarkMaxOrderByAggregateInput
    _min?: NewsBookmarkMinOrderByAggregateInput
  }

  export type NewsBookmarkScalarWhereWithAggregatesInput = {
    AND?: NewsBookmarkScalarWhereWithAggregatesInput | NewsBookmarkScalarWhereWithAggregatesInput[]
    OR?: NewsBookmarkScalarWhereWithAggregatesInput[]
    NOT?: NewsBookmarkScalarWhereWithAggregatesInput | NewsBookmarkScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NewsBookmark"> | string
    userId?: UuidWithAggregatesFilter<"NewsBookmark"> | string
    newsId?: StringWithAggregatesFilter<"NewsBookmark"> | string
    notes?: StringNullableWithAggregatesFilter<"NewsBookmark"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"NewsBookmark"> | Date | string
  }

  export type TradeNewsLinkWhereInput = {
    AND?: TradeNewsLinkWhereInput | TradeNewsLinkWhereInput[]
    OR?: TradeNewsLinkWhereInput[]
    NOT?: TradeNewsLinkWhereInput | TradeNewsLinkWhereInput[]
    id?: UuidFilter<"TradeNewsLink"> | string
    tradeId?: UuidFilter<"TradeNewsLink"> | string
    newsId?: StringFilter<"TradeNewsLink"> | string
    reason?: StringNullableFilter<"TradeNewsLink"> | string | null
    news?: XOR<EnrichedNewsScalarRelationFilter, EnrichedNewsWhereInput>
  }

  export type TradeNewsLinkOrderByWithRelationInput = {
    id?: SortOrder
    tradeId?: SortOrder
    newsId?: SortOrder
    reason?: SortOrderInput | SortOrder
    news?: EnrichedNewsOrderByWithRelationInput
  }

  export type TradeNewsLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tradeId_newsId?: TradeNewsLinkTradeIdNewsIdCompoundUniqueInput
    AND?: TradeNewsLinkWhereInput | TradeNewsLinkWhereInput[]
    OR?: TradeNewsLinkWhereInput[]
    NOT?: TradeNewsLinkWhereInput | TradeNewsLinkWhereInput[]
    tradeId?: UuidFilter<"TradeNewsLink"> | string
    newsId?: StringFilter<"TradeNewsLink"> | string
    reason?: StringNullableFilter<"TradeNewsLink"> | string | null
    news?: XOR<EnrichedNewsScalarRelationFilter, EnrichedNewsWhereInput>
  }, "id" | "tradeId_newsId">

  export type TradeNewsLinkOrderByWithAggregationInput = {
    id?: SortOrder
    tradeId?: SortOrder
    newsId?: SortOrder
    reason?: SortOrderInput | SortOrder
    _count?: TradeNewsLinkCountOrderByAggregateInput
    _max?: TradeNewsLinkMaxOrderByAggregateInput
    _min?: TradeNewsLinkMinOrderByAggregateInput
  }

  export type TradeNewsLinkScalarWhereWithAggregatesInput = {
    AND?: TradeNewsLinkScalarWhereWithAggregatesInput | TradeNewsLinkScalarWhereWithAggregatesInput[]
    OR?: TradeNewsLinkScalarWhereWithAggregatesInput[]
    NOT?: TradeNewsLinkScalarWhereWithAggregatesInput | TradeNewsLinkScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"TradeNewsLink"> | string
    tradeId?: UuidWithAggregatesFilter<"TradeNewsLink"> | string
    newsId?: StringWithAggregatesFilter<"TradeNewsLink"> | string
    reason?: StringNullableWithAggregatesFilter<"TradeNewsLink"> | string | null
  }

  export type UserWatchlistWhereInput = {
    AND?: UserWatchlistWhereInput | UserWatchlistWhereInput[]
    OR?: UserWatchlistWhereInput[]
    NOT?: UserWatchlistWhereInput | UserWatchlistWhereInput[]
    id?: UuidFilter<"UserWatchlist"> | string
    userId?: UuidFilter<"UserWatchlist"> | string
    type?: StringFilter<"UserWatchlist"> | string
    value?: StringFilter<"UserWatchlist"> | string
    createdAt?: DateTimeFilter<"UserWatchlist"> | Date | string
  }

  export type UserWatchlistOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type UserWatchlistWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_type_value?: UserWatchlistUserIdTypeValueCompoundUniqueInput
    AND?: UserWatchlistWhereInput | UserWatchlistWhereInput[]
    OR?: UserWatchlistWhereInput[]
    NOT?: UserWatchlistWhereInput | UserWatchlistWhereInput[]
    userId?: UuidFilter<"UserWatchlist"> | string
    type?: StringFilter<"UserWatchlist"> | string
    value?: StringFilter<"UserWatchlist"> | string
    createdAt?: DateTimeFilter<"UserWatchlist"> | Date | string
  }, "id" | "userId_type_value">

  export type UserWatchlistOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    _count?: UserWatchlistCountOrderByAggregateInput
    _max?: UserWatchlistMaxOrderByAggregateInput
    _min?: UserWatchlistMinOrderByAggregateInput
  }

  export type UserWatchlistScalarWhereWithAggregatesInput = {
    AND?: UserWatchlistScalarWhereWithAggregatesInput | UserWatchlistScalarWhereWithAggregatesInput[]
    OR?: UserWatchlistScalarWhereWithAggregatesInput[]
    NOT?: UserWatchlistScalarWhereWithAggregatesInput | UserWatchlistScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserWatchlist"> | string
    userId?: UuidWithAggregatesFilter<"UserWatchlist"> | string
    type?: StringWithAggregatesFilter<"UserWatchlist"> | string
    value?: StringWithAggregatesFilter<"UserWatchlist"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UserWatchlist"> | Date | string
  }

  export type OiHistoryWhereInput = {
    AND?: OiHistoryWhereInput | OiHistoryWhereInput[]
    OR?: OiHistoryWhereInput[]
    NOT?: OiHistoryWhereInput | OiHistoryWhereInput[]
    time?: DateTimeFilter<"OiHistory"> | Date | string
    symbol?: StringFilter<"OiHistory"> | string
    expiryDate?: DateTimeFilter<"OiHistory"> | Date | string
    strikePrice?: IntFilter<"OiHistory"> | number
    optionType?: StringFilter<"OiHistory"> | string
    openInterest?: BigIntFilter<"OiHistory"> | bigint | number
    oiChange?: IntNullableFilter<"OiHistory"> | number | null
    volume?: BigIntFilter<"OiHistory"> | bigint | number
    ltp?: DecimalFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string
    impliedVolatility?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    delta?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    gamma?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    theta?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    vega?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
  }

  export type OiHistoryOrderByWithRelationInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    strikePrice?: SortOrder
    optionType?: SortOrder
    openInterest?: SortOrder
    oiChange?: SortOrderInput | SortOrder
    volume?: SortOrder
    ltp?: SortOrder
    impliedVolatility?: SortOrderInput | SortOrder
    delta?: SortOrderInput | SortOrder
    gamma?: SortOrderInput | SortOrder
    theta?: SortOrderInput | SortOrder
    vega?: SortOrderInput | SortOrder
  }

  export type OiHistoryWhereUniqueInput = Prisma.AtLeast<{
    time_symbol_expiryDate_strikePrice_optionType?: OiHistoryTimeSymbolExpiryDateStrikePriceOptionTypeCompoundUniqueInput
    AND?: OiHistoryWhereInput | OiHistoryWhereInput[]
    OR?: OiHistoryWhereInput[]
    NOT?: OiHistoryWhereInput | OiHistoryWhereInput[]
    time?: DateTimeFilter<"OiHistory"> | Date | string
    symbol?: StringFilter<"OiHistory"> | string
    expiryDate?: DateTimeFilter<"OiHistory"> | Date | string
    strikePrice?: IntFilter<"OiHistory"> | number
    optionType?: StringFilter<"OiHistory"> | string
    openInterest?: BigIntFilter<"OiHistory"> | bigint | number
    oiChange?: IntNullableFilter<"OiHistory"> | number | null
    volume?: BigIntFilter<"OiHistory"> | bigint | number
    ltp?: DecimalFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string
    impliedVolatility?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    delta?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    gamma?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    theta?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    vega?: DecimalNullableFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
  }, "time_symbol_expiryDate_strikePrice_optionType">

  export type OiHistoryOrderByWithAggregationInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    strikePrice?: SortOrder
    optionType?: SortOrder
    openInterest?: SortOrder
    oiChange?: SortOrderInput | SortOrder
    volume?: SortOrder
    ltp?: SortOrder
    impliedVolatility?: SortOrderInput | SortOrder
    delta?: SortOrderInput | SortOrder
    gamma?: SortOrderInput | SortOrder
    theta?: SortOrderInput | SortOrder
    vega?: SortOrderInput | SortOrder
    _count?: OiHistoryCountOrderByAggregateInput
    _avg?: OiHistoryAvgOrderByAggregateInput
    _max?: OiHistoryMaxOrderByAggregateInput
    _min?: OiHistoryMinOrderByAggregateInput
    _sum?: OiHistorySumOrderByAggregateInput
  }

  export type OiHistoryScalarWhereWithAggregatesInput = {
    AND?: OiHistoryScalarWhereWithAggregatesInput | OiHistoryScalarWhereWithAggregatesInput[]
    OR?: OiHistoryScalarWhereWithAggregatesInput[]
    NOT?: OiHistoryScalarWhereWithAggregatesInput | OiHistoryScalarWhereWithAggregatesInput[]
    time?: DateTimeWithAggregatesFilter<"OiHistory"> | Date | string
    symbol?: StringWithAggregatesFilter<"OiHistory"> | string
    expiryDate?: DateTimeWithAggregatesFilter<"OiHistory"> | Date | string
    strikePrice?: IntWithAggregatesFilter<"OiHistory"> | number
    optionType?: StringWithAggregatesFilter<"OiHistory"> | string
    openInterest?: BigIntWithAggregatesFilter<"OiHistory"> | bigint | number
    oiChange?: IntNullableWithAggregatesFilter<"OiHistory"> | number | null
    volume?: BigIntWithAggregatesFilter<"OiHistory"> | bigint | number
    ltp?: DecimalWithAggregatesFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string
    impliedVolatility?: DecimalNullableWithAggregatesFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    delta?: DecimalNullableWithAggregatesFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    gamma?: DecimalNullableWithAggregatesFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    theta?: DecimalNullableWithAggregatesFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
    vega?: DecimalNullableWithAggregatesFilter<"OiHistory"> | Decimal | DecimalJsLike | number | string | null
  }

  export type IvHistoryWhereInput = {
    AND?: IvHistoryWhereInput | IvHistoryWhereInput[]
    OR?: IvHistoryWhereInput[]
    NOT?: IvHistoryWhereInput | IvHistoryWhereInput[]
    time?: DateTimeFilter<"IvHistory"> | Date | string
    symbol?: StringFilter<"IvHistory"> | string
    indiaVix?: DecimalFilter<"IvHistory"> | Decimal | DecimalJsLike | number | string
    atmIv?: DecimalNullableFilter<"IvHistory"> | Decimal | DecimalJsLike | number | string | null
    ivPercentile?: DecimalNullableFilter<"IvHistory"> | Decimal | DecimalJsLike | number | string | null
  }

  export type IvHistoryOrderByWithRelationInput = {
    time?: SortOrder
    symbol?: SortOrder
    indiaVix?: SortOrder
    atmIv?: SortOrderInput | SortOrder
    ivPercentile?: SortOrderInput | SortOrder
  }

  export type IvHistoryWhereUniqueInput = Prisma.AtLeast<{
    time_symbol?: IvHistoryTimeSymbolCompoundUniqueInput
    AND?: IvHistoryWhereInput | IvHistoryWhereInput[]
    OR?: IvHistoryWhereInput[]
    NOT?: IvHistoryWhereInput | IvHistoryWhereInput[]
    time?: DateTimeFilter<"IvHistory"> | Date | string
    symbol?: StringFilter<"IvHistory"> | string
    indiaVix?: DecimalFilter<"IvHistory"> | Decimal | DecimalJsLike | number | string
    atmIv?: DecimalNullableFilter<"IvHistory"> | Decimal | DecimalJsLike | number | string | null
    ivPercentile?: DecimalNullableFilter<"IvHistory"> | Decimal | DecimalJsLike | number | string | null
  }, "time_symbol">

  export type IvHistoryOrderByWithAggregationInput = {
    time?: SortOrder
    symbol?: SortOrder
    indiaVix?: SortOrder
    atmIv?: SortOrderInput | SortOrder
    ivPercentile?: SortOrderInput | SortOrder
    _count?: IvHistoryCountOrderByAggregateInput
    _avg?: IvHistoryAvgOrderByAggregateInput
    _max?: IvHistoryMaxOrderByAggregateInput
    _min?: IvHistoryMinOrderByAggregateInput
    _sum?: IvHistorySumOrderByAggregateInput
  }

  export type IvHistoryScalarWhereWithAggregatesInput = {
    AND?: IvHistoryScalarWhereWithAggregatesInput | IvHistoryScalarWhereWithAggregatesInput[]
    OR?: IvHistoryScalarWhereWithAggregatesInput[]
    NOT?: IvHistoryScalarWhereWithAggregatesInput | IvHistoryScalarWhereWithAggregatesInput[]
    time?: DateTimeWithAggregatesFilter<"IvHistory"> | Date | string
    symbol?: StringWithAggregatesFilter<"IvHistory"> | string
    indiaVix?: DecimalWithAggregatesFilter<"IvHistory"> | Decimal | DecimalJsLike | number | string
    atmIv?: DecimalNullableWithAggregatesFilter<"IvHistory"> | Decimal | DecimalJsLike | number | string | null
    ivPercentile?: DecimalNullableWithAggregatesFilter<"IvHistory"> | Decimal | DecimalJsLike | number | string | null
  }

  export type PcrHistoryWhereInput = {
    AND?: PcrHistoryWhereInput | PcrHistoryWhereInput[]
    OR?: PcrHistoryWhereInput[]
    NOT?: PcrHistoryWhereInput | PcrHistoryWhereInput[]
    time?: DateTimeFilter<"PcrHistory"> | Date | string
    symbol?: StringFilter<"PcrHistory"> | string
    expiryDate?: DateTimeFilter<"PcrHistory"> | Date | string
    pcrOi?: DecimalFilter<"PcrHistory"> | Decimal | DecimalJsLike | number | string
    pcrVolume?: DecimalFilter<"PcrHistory"> | Decimal | DecimalJsLike | number | string
    callOiTotal?: BigIntNullableFilter<"PcrHistory"> | bigint | number | null
    putOiTotal?: BigIntNullableFilter<"PcrHistory"> | bigint | number | null
  }

  export type PcrHistoryOrderByWithRelationInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    pcrOi?: SortOrder
    pcrVolume?: SortOrder
    callOiTotal?: SortOrderInput | SortOrder
    putOiTotal?: SortOrderInput | SortOrder
  }

  export type PcrHistoryWhereUniqueInput = Prisma.AtLeast<{
    time_symbol_expiryDate?: PcrHistoryTimeSymbolExpiryDateCompoundUniqueInput
    AND?: PcrHistoryWhereInput | PcrHistoryWhereInput[]
    OR?: PcrHistoryWhereInput[]
    NOT?: PcrHistoryWhereInput | PcrHistoryWhereInput[]
    time?: DateTimeFilter<"PcrHistory"> | Date | string
    symbol?: StringFilter<"PcrHistory"> | string
    expiryDate?: DateTimeFilter<"PcrHistory"> | Date | string
    pcrOi?: DecimalFilter<"PcrHistory"> | Decimal | DecimalJsLike | number | string
    pcrVolume?: DecimalFilter<"PcrHistory"> | Decimal | DecimalJsLike | number | string
    callOiTotal?: BigIntNullableFilter<"PcrHistory"> | bigint | number | null
    putOiTotal?: BigIntNullableFilter<"PcrHistory"> | bigint | number | null
  }, "time_symbol_expiryDate">

  export type PcrHistoryOrderByWithAggregationInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    pcrOi?: SortOrder
    pcrVolume?: SortOrder
    callOiTotal?: SortOrderInput | SortOrder
    putOiTotal?: SortOrderInput | SortOrder
    _count?: PcrHistoryCountOrderByAggregateInput
    _avg?: PcrHistoryAvgOrderByAggregateInput
    _max?: PcrHistoryMaxOrderByAggregateInput
    _min?: PcrHistoryMinOrderByAggregateInput
    _sum?: PcrHistorySumOrderByAggregateInput
  }

  export type PcrHistoryScalarWhereWithAggregatesInput = {
    AND?: PcrHistoryScalarWhereWithAggregatesInput | PcrHistoryScalarWhereWithAggregatesInput[]
    OR?: PcrHistoryScalarWhereWithAggregatesInput[]
    NOT?: PcrHistoryScalarWhereWithAggregatesInput | PcrHistoryScalarWhereWithAggregatesInput[]
    time?: DateTimeWithAggregatesFilter<"PcrHistory"> | Date | string
    symbol?: StringWithAggregatesFilter<"PcrHistory"> | string
    expiryDate?: DateTimeWithAggregatesFilter<"PcrHistory"> | Date | string
    pcrOi?: DecimalWithAggregatesFilter<"PcrHistory"> | Decimal | DecimalJsLike | number | string
    pcrVolume?: DecimalWithAggregatesFilter<"PcrHistory"> | Decimal | DecimalJsLike | number | string
    callOiTotal?: BigIntNullableWithAggregatesFilter<"PcrHistory"> | bigint | number | null
    putOiTotal?: BigIntNullableWithAggregatesFilter<"PcrHistory"> | bigint | number | null
  }

  export type FlowAiBriefWhereInput = {
    AND?: FlowAiBriefWhereInput | FlowAiBriefWhereInput[]
    OR?: FlowAiBriefWhereInput[]
    NOT?: FlowAiBriefWhereInput | FlowAiBriefWhereInput[]
    id?: UuidFilter<"FlowAiBrief"> | string
    symbol?: StringFilter<"FlowAiBrief"> | string
    expiryDate?: DateTimeNullableFilter<"FlowAiBrief"> | Date | string | null
    briefType?: StringFilter<"FlowAiBrief"> | string
    headline?: StringFilter<"FlowAiBrief"> | string
    observations?: JsonFilter<"FlowAiBrief">
    action?: StringFilter<"FlowAiBrief"> | string
    confidence?: IntFilter<"FlowAiBrief"> | number
    marketContext?: JsonNullableFilter<"FlowAiBrief">
    modelUsed?: StringNullableFilter<"FlowAiBrief"> | string | null
    tokensUsed?: IntNullableFilter<"FlowAiBrief"> | number | null
    generatedAt?: DateTimeFilter<"FlowAiBrief"> | Date | string
    expiresAt?: DateTimeFilter<"FlowAiBrief"> | Date | string
    isValid?: BoolFilter<"FlowAiBrief"> | boolean
  }

  export type FlowAiBriefOrderByWithRelationInput = {
    id?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrderInput | SortOrder
    briefType?: SortOrder
    headline?: SortOrder
    observations?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    marketContext?: SortOrderInput | SortOrder
    modelUsed?: SortOrderInput | SortOrder
    tokensUsed?: SortOrderInput | SortOrder
    generatedAt?: SortOrder
    expiresAt?: SortOrder
    isValid?: SortOrder
  }

  export type FlowAiBriefWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FlowAiBriefWhereInput | FlowAiBriefWhereInput[]
    OR?: FlowAiBriefWhereInput[]
    NOT?: FlowAiBriefWhereInput | FlowAiBriefWhereInput[]
    symbol?: StringFilter<"FlowAiBrief"> | string
    expiryDate?: DateTimeNullableFilter<"FlowAiBrief"> | Date | string | null
    briefType?: StringFilter<"FlowAiBrief"> | string
    headline?: StringFilter<"FlowAiBrief"> | string
    observations?: JsonFilter<"FlowAiBrief">
    action?: StringFilter<"FlowAiBrief"> | string
    confidence?: IntFilter<"FlowAiBrief"> | number
    marketContext?: JsonNullableFilter<"FlowAiBrief">
    modelUsed?: StringNullableFilter<"FlowAiBrief"> | string | null
    tokensUsed?: IntNullableFilter<"FlowAiBrief"> | number | null
    generatedAt?: DateTimeFilter<"FlowAiBrief"> | Date | string
    expiresAt?: DateTimeFilter<"FlowAiBrief"> | Date | string
    isValid?: BoolFilter<"FlowAiBrief"> | boolean
  }, "id">

  export type FlowAiBriefOrderByWithAggregationInput = {
    id?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrderInput | SortOrder
    briefType?: SortOrder
    headline?: SortOrder
    observations?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    marketContext?: SortOrderInput | SortOrder
    modelUsed?: SortOrderInput | SortOrder
    tokensUsed?: SortOrderInput | SortOrder
    generatedAt?: SortOrder
    expiresAt?: SortOrder
    isValid?: SortOrder
    _count?: FlowAiBriefCountOrderByAggregateInput
    _avg?: FlowAiBriefAvgOrderByAggregateInput
    _max?: FlowAiBriefMaxOrderByAggregateInput
    _min?: FlowAiBriefMinOrderByAggregateInput
    _sum?: FlowAiBriefSumOrderByAggregateInput
  }

  export type FlowAiBriefScalarWhereWithAggregatesInput = {
    AND?: FlowAiBriefScalarWhereWithAggregatesInput | FlowAiBriefScalarWhereWithAggregatesInput[]
    OR?: FlowAiBriefScalarWhereWithAggregatesInput[]
    NOT?: FlowAiBriefScalarWhereWithAggregatesInput | FlowAiBriefScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"FlowAiBrief"> | string
    symbol?: StringWithAggregatesFilter<"FlowAiBrief"> | string
    expiryDate?: DateTimeNullableWithAggregatesFilter<"FlowAiBrief"> | Date | string | null
    briefType?: StringWithAggregatesFilter<"FlowAiBrief"> | string
    headline?: StringWithAggregatesFilter<"FlowAiBrief"> | string
    observations?: JsonWithAggregatesFilter<"FlowAiBrief">
    action?: StringWithAggregatesFilter<"FlowAiBrief"> | string
    confidence?: IntWithAggregatesFilter<"FlowAiBrief"> | number
    marketContext?: JsonNullableWithAggregatesFilter<"FlowAiBrief">
    modelUsed?: StringNullableWithAggregatesFilter<"FlowAiBrief"> | string | null
    tokensUsed?: IntNullableWithAggregatesFilter<"FlowAiBrief"> | number | null
    generatedAt?: DateTimeWithAggregatesFilter<"FlowAiBrief"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"FlowAiBrief"> | Date | string
    isValid?: BoolWithAggregatesFilter<"FlowAiBrief"> | boolean
  }

  export type NewsRawItemCreateInput = {
    id?: string
    source: string
    externalId?: string | null
    dedupeHash: string
    headline: string
    body?: string | null
    url?: string | null
    publishedAt: Date | string
    rawPayload: JsonNullValueInput | InputJsonValue
    status?: string
    failureReason?: string | null
    createdAt?: Date | string
    triage?: NewsTriageCreateNestedOneWithoutRawItemInput
    impact?: NewsImpactCreateNestedOneWithoutRawItemInput
  }

  export type NewsRawItemUncheckedCreateInput = {
    id?: string
    source: string
    externalId?: string | null
    dedupeHash: string
    headline: string
    body?: string | null
    url?: string | null
    publishedAt: Date | string
    rawPayload: JsonNullValueInput | InputJsonValue
    status?: string
    failureReason?: string | null
    createdAt?: Date | string
    triage?: NewsTriageUncheckedCreateNestedOneWithoutRawItemInput
    impact?: NewsImpactUncheckedCreateNestedOneWithoutRawItemInput
  }

  export type NewsRawItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeHash?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawPayload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triage?: NewsTriageUpdateOneWithoutRawItemNestedInput
    impact?: NewsImpactUpdateOneWithoutRawItemNestedInput
  }

  export type NewsRawItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeHash?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawPayload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triage?: NewsTriageUncheckedUpdateOneWithoutRawItemNestedInput
    impact?: NewsImpactUncheckedUpdateOneWithoutRawItemNestedInput
  }

  export type NewsRawItemCreateManyInput = {
    id?: string
    source: string
    externalId?: string | null
    dedupeHash: string
    headline: string
    body?: string | null
    url?: string | null
    publishedAt: Date | string
    rawPayload: JsonNullValueInput | InputJsonValue
    status?: string
    failureReason?: string | null
    createdAt?: Date | string
  }

  export type NewsRawItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeHash?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawPayload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsRawItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeHash?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawPayload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsTriageCreateInput = {
    id?: string
    relevant: boolean
    category: string
    urgency: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    createdAt?: Date | string
    rawItem: NewsRawItemCreateNestedOneWithoutTriageInput
  }

  export type NewsTriageUncheckedCreateInput = {
    id?: string
    rawItemId: string
    relevant: boolean
    category: string
    urgency: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    createdAt?: Date | string
  }

  export type NewsTriageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    relevant?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    urgency?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawItem?: NewsRawItemUpdateOneRequiredWithoutTriageNestedInput
  }

  export type NewsTriageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    relevant?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    urgency?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsTriageCreateManyInput = {
    id?: string
    rawItemId: string
    relevant: boolean
    category: string
    urgency: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    createdAt?: Date | string
  }

  export type NewsTriageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    relevant?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    urgency?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsTriageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    relevant?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    urgency?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsImpactCreateInput = {
    id?: string
    sectorImpact?: NewsImpactCreatesectorImpactInput | string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonNullValueInput | InputJsonValue
    mode?: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    humanReviewRequired?: boolean
    humanApproved?: boolean | null
    humanNotes?: string | null
    createdAt?: Date | string
    rawItem: NewsRawItemCreateNestedOneWithoutImpactInput
    auditLog: NewsAuditLogCreateNestedOneWithoutImpactInput
    backtests?: NewsBacktestCreateNestedManyWithoutImpactInput
  }

  export type NewsImpactUncheckedCreateInput = {
    id?: string
    rawItemId: string
    sectorImpact?: NewsImpactCreatesectorImpactInput | string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonNullValueInput | InputJsonValue
    mode?: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    humanReviewRequired?: boolean
    humanApproved?: boolean | null
    humanNotes?: string | null
    complianceAuditId: string
    createdAt?: Date | string
    backtests?: NewsBacktestUncheckedCreateNestedManyWithoutImpactInput
  }

  export type NewsImpactUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawItem?: NewsRawItemUpdateOneRequiredWithoutImpactNestedInput
    auditLog?: NewsAuditLogUpdateOneRequiredWithoutImpactNestedInput
    backtests?: NewsBacktestUpdateManyWithoutImpactNestedInput
  }

  export type NewsImpactUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    complianceAuditId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    backtests?: NewsBacktestUncheckedUpdateManyWithoutImpactNestedInput
  }

  export type NewsImpactCreateManyInput = {
    id?: string
    rawItemId: string
    sectorImpact?: NewsImpactCreatesectorImpactInput | string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonNullValueInput | InputJsonValue
    mode?: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    humanReviewRequired?: boolean
    humanApproved?: boolean | null
    humanNotes?: string | null
    complianceAuditId: string
    createdAt?: Date | string
  }

  export type NewsImpactUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsImpactUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    complianceAuditId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsAuditLogCreateInput = {
    id?: string
    rawItemId: string
    inputSnapshot: JsonNullValueInput | InputJsonValue
    outputSnapshot: JsonNullValueInput | InputJsonValue
    modelId: string
    promptVersion: string
    mode?: string
    compliancePassed: boolean
    complianceNotes?: string | null
    disclaimer: string
    timestamp?: Date | string
    impact?: NewsImpactCreateNestedOneWithoutAuditLogInput
  }

  export type NewsAuditLogUncheckedCreateInput = {
    id?: string
    rawItemId: string
    inputSnapshot: JsonNullValueInput | InputJsonValue
    outputSnapshot: JsonNullValueInput | InputJsonValue
    modelId: string
    promptVersion: string
    mode?: string
    compliancePassed: boolean
    complianceNotes?: string | null
    disclaimer: string
    timestamp?: Date | string
    impact?: NewsImpactUncheckedCreateNestedOneWithoutAuditLogInput
  }

  export type NewsAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    inputSnapshot?: JsonNullValueInput | InputJsonValue
    outputSnapshot?: JsonNullValueInput | InputJsonValue
    modelId?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    compliancePassed?: BoolFieldUpdateOperationsInput | boolean
    complianceNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disclaimer?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: NewsImpactUpdateOneWithoutAuditLogNestedInput
  }

  export type NewsAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    inputSnapshot?: JsonNullValueInput | InputJsonValue
    outputSnapshot?: JsonNullValueInput | InputJsonValue
    modelId?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    compliancePassed?: BoolFieldUpdateOperationsInput | boolean
    complianceNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disclaimer?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: NewsImpactUncheckedUpdateOneWithoutAuditLogNestedInput
  }

  export type NewsAuditLogCreateManyInput = {
    id?: string
    rawItemId: string
    inputSnapshot: JsonNullValueInput | InputJsonValue
    outputSnapshot: JsonNullValueInput | InputJsonValue
    modelId: string
    promptVersion: string
    mode?: string
    compliancePassed: boolean
    complianceNotes?: string | null
    disclaimer: string
    timestamp?: Date | string
  }

  export type NewsAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    inputSnapshot?: JsonNullValueInput | InputJsonValue
    outputSnapshot?: JsonNullValueInput | InputJsonValue
    modelId?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    compliancePassed?: BoolFieldUpdateOperationsInput | boolean
    complianceNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disclaimer?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    inputSnapshot?: JsonNullValueInput | InputJsonValue
    outputSnapshot?: JsonNullValueInput | InputJsonValue
    modelId?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    compliancePassed?: BoolFieldUpdateOperationsInput | boolean
    complianceNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disclaimer?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBacktestCreateInput = {
    id?: string
    sector: string
    taggedDirection: string
    session1Return?: number | null
    session3Return?: number | null
    session5Return?: number | null
    directionMatch1?: boolean | null
    directionMatch3?: boolean | null
    directionMatch5?: boolean | null
    measuredAt?: Date | string | null
    createdAt?: Date | string
    impact: NewsImpactCreateNestedOneWithoutBacktestsInput
  }

  export type NewsBacktestUncheckedCreateInput = {
    id?: string
    impactId: string
    sector: string
    taggedDirection: string
    session1Return?: number | null
    session3Return?: number | null
    session5Return?: number | null
    directionMatch1?: boolean | null
    directionMatch3?: boolean | null
    directionMatch5?: boolean | null
    measuredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NewsBacktestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    taggedDirection?: StringFieldUpdateOperationsInput | string
    session1Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session3Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session5Return?: NullableFloatFieldUpdateOperationsInput | number | null
    directionMatch1?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch3?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch5?: NullableBoolFieldUpdateOperationsInput | boolean | null
    measuredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: NewsImpactUpdateOneRequiredWithoutBacktestsNestedInput
  }

  export type NewsBacktestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    impactId?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    taggedDirection?: StringFieldUpdateOperationsInput | string
    session1Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session3Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session5Return?: NullableFloatFieldUpdateOperationsInput | number | null
    directionMatch1?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch3?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch5?: NullableBoolFieldUpdateOperationsInput | boolean | null
    measuredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBacktestCreateManyInput = {
    id?: string
    impactId: string
    sector: string
    taggedDirection: string
    session1Return?: number | null
    session3Return?: number | null
    session5Return?: number | null
    directionMatch1?: boolean | null
    directionMatch3?: boolean | null
    directionMatch5?: boolean | null
    measuredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NewsBacktestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    taggedDirection?: StringFieldUpdateOperationsInput | string
    session1Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session3Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session5Return?: NullableFloatFieldUpdateOperationsInput | number | null
    directionMatch1?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch3?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch5?: NullableBoolFieldUpdateOperationsInput | boolean | null
    measuredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBacktestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    impactId?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    taggedDirection?: StringFieldUpdateOperationsInput | string
    session1Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session3Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session5Return?: NullableFloatFieldUpdateOperationsInput | number | null
    directionMatch1?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch3?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch5?: NullableBoolFieldUpdateOperationsInput | boolean | null
    measuredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsDigestCreateInput = {
    id?: string
    type: string
    date: Date | string
    content: JsonNullValueInput | InputJsonValue
    itemCount?: number
    createdAt?: Date | string
  }

  export type NewsDigestUncheckedCreateInput = {
    id?: string
    type: string
    date: Date | string
    content: JsonNullValueInput | InputJsonValue
    itemCount?: number
    createdAt?: Date | string
  }

  export type NewsDigestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: JsonNullValueInput | InputJsonValue
    itemCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsDigestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: JsonNullValueInput | InputJsonValue
    itemCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsDigestCreateManyInput = {
    id?: string
    type: string
    date: Date | string
    content: JsonNullValueInput | InputJsonValue
    itemCount?: number
    createdAt?: Date | string
  }

  export type NewsDigestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: JsonNullValueInput | InputJsonValue
    itemCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsDigestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    content?: JsonNullValueInput | InputJsonValue
    itemCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PipelineMetricCreateInput = {
    id?: string
    metricName: string
    value: number
    source?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: Date | string
  }

  export type PipelineMetricUncheckedCreateInput = {
    id?: string
    metricName: string
    value: number
    source?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: Date | string
  }

  export type PipelineMetricUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PipelineMetricUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PipelineMetricCreateManyInput = {
    id?: string
    metricName: string
    value: number
    source?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: Date | string
  }

  export type PipelineMetricUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PipelineMetricUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    metricName?: StringFieldUpdateOperationsInput | string
    value?: FloatFieldUpdateOperationsInput | number
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrichedNewsCreateInput = {
    id: string
    headline: string
    url: string
    publishedAt: number
    source: string
    image?: string | null
    originalSummary?: string | null
    aiSummary?: string | null
    tldr?: string | null
    whyItMatters?: string | null
    categories?: EnrichedNewsCreatecategoriesInput | string[]
    sectors?: EnrichedNewsCreatesectorsInput | string[]
    companies?: EnrichedNewsCreatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: string | null
    shortTermImpact?: string | null
    longTermImpact?: string | null
    whatToWatchNext?: string | null
    riskFactors?: string | null
    probability?: number | null
    confidence?: number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    bookmarks?: NewsBookmarkCreateNestedManyWithoutNewsInput
    tradeLinks?: TradeNewsLinkCreateNestedManyWithoutNewsInput
  }

  export type EnrichedNewsUncheckedCreateInput = {
    id: string
    headline: string
    url: string
    publishedAt: number
    source: string
    image?: string | null
    originalSummary?: string | null
    aiSummary?: string | null
    tldr?: string | null
    whyItMatters?: string | null
    categories?: EnrichedNewsCreatecategoriesInput | string[]
    sectors?: EnrichedNewsCreatesectorsInput | string[]
    companies?: EnrichedNewsCreatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: string | null
    shortTermImpact?: string | null
    longTermImpact?: string | null
    whatToWatchNext?: string | null
    riskFactors?: string | null
    probability?: number | null
    confidence?: number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    bookmarks?: NewsBookmarkUncheckedCreateNestedManyWithoutNewsInput
    tradeLinks?: TradeNewsLinkUncheckedCreateNestedManyWithoutNewsInput
  }

  export type EnrichedNewsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publishedAt?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    originalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    tldr?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    categories?: EnrichedNewsUpdatecategoriesInput | string[]
    sectors?: EnrichedNewsUpdatesectorsInput | string[]
    companies?: EnrichedNewsUpdatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: NullableStringFieldUpdateOperationsInput | string | null
    shortTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    longTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    whatToWatchNext?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    probability?: NullableIntFieldUpdateOperationsInput | number | null
    confidence?: NullableIntFieldUpdateOperationsInput | number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookmarks?: NewsBookmarkUpdateManyWithoutNewsNestedInput
    tradeLinks?: TradeNewsLinkUpdateManyWithoutNewsNestedInput
  }

  export type EnrichedNewsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publishedAt?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    originalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    tldr?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    categories?: EnrichedNewsUpdatecategoriesInput | string[]
    sectors?: EnrichedNewsUpdatesectorsInput | string[]
    companies?: EnrichedNewsUpdatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: NullableStringFieldUpdateOperationsInput | string | null
    shortTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    longTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    whatToWatchNext?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    probability?: NullableIntFieldUpdateOperationsInput | number | null
    confidence?: NullableIntFieldUpdateOperationsInput | number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookmarks?: NewsBookmarkUncheckedUpdateManyWithoutNewsNestedInput
    tradeLinks?: TradeNewsLinkUncheckedUpdateManyWithoutNewsNestedInput
  }

  export type EnrichedNewsCreateManyInput = {
    id: string
    headline: string
    url: string
    publishedAt: number
    source: string
    image?: string | null
    originalSummary?: string | null
    aiSummary?: string | null
    tldr?: string | null
    whyItMatters?: string | null
    categories?: EnrichedNewsCreatecategoriesInput | string[]
    sectors?: EnrichedNewsCreatesectorsInput | string[]
    companies?: EnrichedNewsCreatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: string | null
    shortTermImpact?: string | null
    longTermImpact?: string | null
    whatToWatchNext?: string | null
    riskFactors?: string | null
    probability?: number | null
    confidence?: number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type EnrichedNewsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publishedAt?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    originalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    tldr?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    categories?: EnrichedNewsUpdatecategoriesInput | string[]
    sectors?: EnrichedNewsUpdatesectorsInput | string[]
    companies?: EnrichedNewsUpdatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: NullableStringFieldUpdateOperationsInput | string | null
    shortTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    longTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    whatToWatchNext?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    probability?: NullableIntFieldUpdateOperationsInput | number | null
    confidence?: NullableIntFieldUpdateOperationsInput | number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EnrichedNewsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publishedAt?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    originalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    tldr?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    categories?: EnrichedNewsUpdatecategoriesInput | string[]
    sectors?: EnrichedNewsUpdatesectorsInput | string[]
    companies?: EnrichedNewsUpdatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: NullableStringFieldUpdateOperationsInput | string | null
    shortTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    longTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    whatToWatchNext?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    probability?: NullableIntFieldUpdateOperationsInput | number | null
    confidence?: NullableIntFieldUpdateOperationsInput | number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBookmarkCreateInput = {
    id?: string
    userId: string
    notes?: string | null
    createdAt?: Date | string
    news: EnrichedNewsCreateNestedOneWithoutBookmarksInput
  }

  export type NewsBookmarkUncheckedCreateInput = {
    id?: string
    userId: string
    newsId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type NewsBookmarkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    news?: EnrichedNewsUpdateOneRequiredWithoutBookmarksNestedInput
  }

  export type NewsBookmarkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    newsId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBookmarkCreateManyInput = {
    id?: string
    userId: string
    newsId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type NewsBookmarkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBookmarkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    newsId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeNewsLinkCreateInput = {
    id?: string
    tradeId: string
    reason?: string | null
    news: EnrichedNewsCreateNestedOneWithoutTradeLinksInput
  }

  export type TradeNewsLinkUncheckedCreateInput = {
    id?: string
    tradeId: string
    newsId: string
    reason?: string | null
  }

  export type TradeNewsLinkUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    news?: EnrichedNewsUpdateOneRequiredWithoutTradeLinksNestedInput
  }

  export type TradeNewsLinkUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeId?: StringFieldUpdateOperationsInput | string
    newsId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TradeNewsLinkCreateManyInput = {
    id?: string
    tradeId: string
    newsId: string
    reason?: string | null
  }

  export type TradeNewsLinkUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TradeNewsLinkUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeId?: StringFieldUpdateOperationsInput | string
    newsId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserWatchlistCreateInput = {
    id?: string
    userId: string
    type: string
    value: string
    createdAt?: Date | string
  }

  export type UserWatchlistUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    value: string
    createdAt?: Date | string
  }

  export type UserWatchlistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserWatchlistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserWatchlistCreateManyInput = {
    id?: string
    userId: string
    type: string
    value: string
    createdAt?: Date | string
  }

  export type UserWatchlistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserWatchlistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OiHistoryCreateInput = {
    time: Date | string
    symbol: string
    expiryDate: Date | string
    strikePrice: number
    optionType: string
    openInterest: bigint | number
    oiChange?: number | null
    volume: bigint | number
    ltp: Decimal | DecimalJsLike | number | string
    impliedVolatility?: Decimal | DecimalJsLike | number | string | null
    delta?: Decimal | DecimalJsLike | number | string | null
    gamma?: Decimal | DecimalJsLike | number | string | null
    theta?: Decimal | DecimalJsLike | number | string | null
    vega?: Decimal | DecimalJsLike | number | string | null
  }

  export type OiHistoryUncheckedCreateInput = {
    time: Date | string
    symbol: string
    expiryDate: Date | string
    strikePrice: number
    optionType: string
    openInterest: bigint | number
    oiChange?: number | null
    volume: bigint | number
    ltp: Decimal | DecimalJsLike | number | string
    impliedVolatility?: Decimal | DecimalJsLike | number | string | null
    delta?: Decimal | DecimalJsLike | number | string | null
    gamma?: Decimal | DecimalJsLike | number | string | null
    theta?: Decimal | DecimalJsLike | number | string | null
    vega?: Decimal | DecimalJsLike | number | string | null
  }

  export type OiHistoryUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    strikePrice?: IntFieldUpdateOperationsInput | number
    optionType?: StringFieldUpdateOperationsInput | string
    openInterest?: BigIntFieldUpdateOperationsInput | bigint | number
    oiChange?: NullableIntFieldUpdateOperationsInput | number | null
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    ltp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    impliedVolatility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    delta?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    gamma?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    theta?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    vega?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type OiHistoryUncheckedUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    strikePrice?: IntFieldUpdateOperationsInput | number
    optionType?: StringFieldUpdateOperationsInput | string
    openInterest?: BigIntFieldUpdateOperationsInput | bigint | number
    oiChange?: NullableIntFieldUpdateOperationsInput | number | null
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    ltp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    impliedVolatility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    delta?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    gamma?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    theta?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    vega?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type OiHistoryCreateManyInput = {
    time: Date | string
    symbol: string
    expiryDate: Date | string
    strikePrice: number
    optionType: string
    openInterest: bigint | number
    oiChange?: number | null
    volume: bigint | number
    ltp: Decimal | DecimalJsLike | number | string
    impliedVolatility?: Decimal | DecimalJsLike | number | string | null
    delta?: Decimal | DecimalJsLike | number | string | null
    gamma?: Decimal | DecimalJsLike | number | string | null
    theta?: Decimal | DecimalJsLike | number | string | null
    vega?: Decimal | DecimalJsLike | number | string | null
  }

  export type OiHistoryUpdateManyMutationInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    strikePrice?: IntFieldUpdateOperationsInput | number
    optionType?: StringFieldUpdateOperationsInput | string
    openInterest?: BigIntFieldUpdateOperationsInput | bigint | number
    oiChange?: NullableIntFieldUpdateOperationsInput | number | null
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    ltp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    impliedVolatility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    delta?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    gamma?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    theta?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    vega?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type OiHistoryUncheckedUpdateManyInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    strikePrice?: IntFieldUpdateOperationsInput | number
    optionType?: StringFieldUpdateOperationsInput | string
    openInterest?: BigIntFieldUpdateOperationsInput | bigint | number
    oiChange?: NullableIntFieldUpdateOperationsInput | number | null
    volume?: BigIntFieldUpdateOperationsInput | bigint | number
    ltp?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    impliedVolatility?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    delta?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    gamma?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    theta?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    vega?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type IvHistoryCreateInput = {
    time: Date | string
    symbol: string
    indiaVix: Decimal | DecimalJsLike | number | string
    atmIv?: Decimal | DecimalJsLike | number | string | null
    ivPercentile?: Decimal | DecimalJsLike | number | string | null
  }

  export type IvHistoryUncheckedCreateInput = {
    time: Date | string
    symbol: string
    indiaVix: Decimal | DecimalJsLike | number | string
    atmIv?: Decimal | DecimalJsLike | number | string | null
    ivPercentile?: Decimal | DecimalJsLike | number | string | null
  }

  export type IvHistoryUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    indiaVix?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    atmIv?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ivPercentile?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type IvHistoryUncheckedUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    indiaVix?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    atmIv?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ivPercentile?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type IvHistoryCreateManyInput = {
    time: Date | string
    symbol: string
    indiaVix: Decimal | DecimalJsLike | number | string
    atmIv?: Decimal | DecimalJsLike | number | string | null
    ivPercentile?: Decimal | DecimalJsLike | number | string | null
  }

  export type IvHistoryUpdateManyMutationInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    indiaVix?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    atmIv?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ivPercentile?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type IvHistoryUncheckedUpdateManyInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    indiaVix?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    atmIv?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    ivPercentile?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
  }

  export type PcrHistoryCreateInput = {
    time: Date | string
    symbol: string
    expiryDate: Date | string
    pcrOi: Decimal | DecimalJsLike | number | string
    pcrVolume: Decimal | DecimalJsLike | number | string
    callOiTotal?: bigint | number | null
    putOiTotal?: bigint | number | null
  }

  export type PcrHistoryUncheckedCreateInput = {
    time: Date | string
    symbol: string
    expiryDate: Date | string
    pcrOi: Decimal | DecimalJsLike | number | string
    pcrVolume: Decimal | DecimalJsLike | number | string
    callOiTotal?: bigint | number | null
    putOiTotal?: bigint | number | null
  }

  export type PcrHistoryUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    pcrOi?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pcrVolume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    callOiTotal?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    putOiTotal?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type PcrHistoryUncheckedUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    pcrOi?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pcrVolume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    callOiTotal?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    putOiTotal?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type PcrHistoryCreateManyInput = {
    time: Date | string
    symbol: string
    expiryDate: Date | string
    pcrOi: Decimal | DecimalJsLike | number | string
    pcrVolume: Decimal | DecimalJsLike | number | string
    callOiTotal?: bigint | number | null
    putOiTotal?: bigint | number | null
  }

  export type PcrHistoryUpdateManyMutationInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    pcrOi?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pcrVolume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    callOiTotal?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    putOiTotal?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type PcrHistoryUncheckedUpdateManyInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: DateTimeFieldUpdateOperationsInput | Date | string
    pcrOi?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    pcrVolume?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    callOiTotal?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    putOiTotal?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
  }

  export type FlowAiBriefCreateInput = {
    id?: string
    symbol: string
    expiryDate?: Date | string | null
    briefType: string
    headline: string
    observations: JsonNullValueInput | InputJsonValue
    action: string
    confidence: number
    marketContext?: NullableJsonNullValueInput | InputJsonValue
    modelUsed?: string | null
    tokensUsed?: number | null
    generatedAt?: Date | string
    expiresAt: Date | string
    isValid?: boolean
  }

  export type FlowAiBriefUncheckedCreateInput = {
    id?: string
    symbol: string
    expiryDate?: Date | string | null
    briefType: string
    headline: string
    observations: JsonNullValueInput | InputJsonValue
    action: string
    confidence: number
    marketContext?: NullableJsonNullValueInput | InputJsonValue
    modelUsed?: string | null
    tokensUsed?: number | null
    generatedAt?: Date | string
    expiresAt: Date | string
    isValid?: boolean
  }

  export type FlowAiBriefUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    briefType?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    observations?: JsonNullValueInput | InputJsonValue
    action?: StringFieldUpdateOperationsInput | string
    confidence?: IntFieldUpdateOperationsInput | number
    marketContext?: NullableJsonNullValueInput | InputJsonValue
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
  }

  export type FlowAiBriefUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    briefType?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    observations?: JsonNullValueInput | InputJsonValue
    action?: StringFieldUpdateOperationsInput | string
    confidence?: IntFieldUpdateOperationsInput | number
    marketContext?: NullableJsonNullValueInput | InputJsonValue
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
  }

  export type FlowAiBriefCreateManyInput = {
    id?: string
    symbol: string
    expiryDate?: Date | string | null
    briefType: string
    headline: string
    observations: JsonNullValueInput | InputJsonValue
    action: string
    confidence: number
    marketContext?: NullableJsonNullValueInput | InputJsonValue
    modelUsed?: string | null
    tokensUsed?: number | null
    generatedAt?: Date | string
    expiresAt: Date | string
    isValid?: boolean
  }

  export type FlowAiBriefUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    briefType?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    observations?: JsonNullValueInput | InputJsonValue
    action?: StringFieldUpdateOperationsInput | string
    confidence?: IntFieldUpdateOperationsInput | number
    marketContext?: NullableJsonNullValueInput | InputJsonValue
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
  }

  export type FlowAiBriefUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    symbol?: StringFieldUpdateOperationsInput | string
    expiryDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    briefType?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    observations?: JsonNullValueInput | InputJsonValue
    action?: StringFieldUpdateOperationsInput | string
    confidence?: IntFieldUpdateOperationsInput | number
    marketContext?: NullableJsonNullValueInput | InputJsonValue
    modelUsed?: NullableStringFieldUpdateOperationsInput | string | null
    tokensUsed?: NullableIntFieldUpdateOperationsInput | number | null
    generatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isValid?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NewsTriageNullableScalarRelationFilter = {
    is?: NewsTriageWhereInput | null
    isNot?: NewsTriageWhereInput | null
  }

  export type NewsImpactNullableScalarRelationFilter = {
    is?: NewsImpactWhereInput | null
    isNot?: NewsImpactWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type NewsRawItemCountOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    dedupeHash?: SortOrder
    headline?: SortOrder
    body?: SortOrder
    url?: SortOrder
    publishedAt?: SortOrder
    rawPayload?: SortOrder
    status?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsRawItemMaxOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    dedupeHash?: SortOrder
    headline?: SortOrder
    body?: SortOrder
    url?: SortOrder
    publishedAt?: SortOrder
    status?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsRawItemMinOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    dedupeHash?: SortOrder
    headline?: SortOrder
    body?: SortOrder
    url?: SortOrder
    publishedAt?: SortOrder
    status?: SortOrder
    failureReason?: SortOrder
    createdAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NewsRawItemScalarRelationFilter = {
    is?: NewsRawItemWhereInput
    isNot?: NewsRawItemWhereInput
  }

  export type NewsTriageCountOrderByAggregateInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    relevant?: SortOrder
    category?: SortOrder
    urgency?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsTriageAvgOrderByAggregateInput = {
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
  }

  export type NewsTriageMaxOrderByAggregateInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    relevant?: SortOrder
    category?: SortOrder
    urgency?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsTriageMinOrderByAggregateInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    relevant?: SortOrder
    category?: SortOrder
    urgency?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsTriageSumOrderByAggregateInput = {
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NewsAuditLogScalarRelationFilter = {
    is?: NewsAuditLogWhereInput
    isNot?: NewsAuditLogWhereInput
  }

  export type NewsBacktestListRelationFilter = {
    every?: NewsBacktestWhereInput
    some?: NewsBacktestWhereInput
    none?: NewsBacktestWhereInput
  }

  export type NewsBacktestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NewsImpactCountOrderByAggregateInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    sectorImpact?: SortOrder
    direction?: SortOrder
    confidence?: SortOrder
    rationale?: SortOrder
    historicalAnalogues?: SortOrder
    mode?: SortOrder
    disclaimer?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
    humanReviewRequired?: SortOrder
    humanApproved?: SortOrder
    humanNotes?: SortOrder
    complianceAuditId?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsImpactAvgOrderByAggregateInput = {
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
  }

  export type NewsImpactMaxOrderByAggregateInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    direction?: SortOrder
    confidence?: SortOrder
    rationale?: SortOrder
    mode?: SortOrder
    disclaimer?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
    humanReviewRequired?: SortOrder
    humanApproved?: SortOrder
    humanNotes?: SortOrder
    complianceAuditId?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsImpactMinOrderByAggregateInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    direction?: SortOrder
    confidence?: SortOrder
    rationale?: SortOrder
    mode?: SortOrder
    disclaimer?: SortOrder
    modelVersion?: SortOrder
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
    humanReviewRequired?: SortOrder
    humanApproved?: SortOrder
    humanNotes?: SortOrder
    complianceAuditId?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsImpactSumOrderByAggregateInput = {
    latencyMs?: SortOrder
    tokensIn?: SortOrder
    tokensOut?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NewsAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    inputSnapshot?: SortOrder
    outputSnapshot?: SortOrder
    modelId?: SortOrder
    promptVersion?: SortOrder
    mode?: SortOrder
    compliancePassed?: SortOrder
    complianceNotes?: SortOrder
    disclaimer?: SortOrder
    timestamp?: SortOrder
  }

  export type NewsAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    modelId?: SortOrder
    promptVersion?: SortOrder
    mode?: SortOrder
    compliancePassed?: SortOrder
    complianceNotes?: SortOrder
    disclaimer?: SortOrder
    timestamp?: SortOrder
  }

  export type NewsAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    rawItemId?: SortOrder
    modelId?: SortOrder
    promptVersion?: SortOrder
    mode?: SortOrder
    compliancePassed?: SortOrder
    complianceNotes?: SortOrder
    disclaimer?: SortOrder
    timestamp?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NewsImpactScalarRelationFilter = {
    is?: NewsImpactWhereInput
    isNot?: NewsImpactWhereInput
  }

  export type NewsBacktestCountOrderByAggregateInput = {
    id?: SortOrder
    impactId?: SortOrder
    sector?: SortOrder
    taggedDirection?: SortOrder
    session1Return?: SortOrder
    session3Return?: SortOrder
    session5Return?: SortOrder
    directionMatch1?: SortOrder
    directionMatch3?: SortOrder
    directionMatch5?: SortOrder
    measuredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsBacktestAvgOrderByAggregateInput = {
    session1Return?: SortOrder
    session3Return?: SortOrder
    session5Return?: SortOrder
  }

  export type NewsBacktestMaxOrderByAggregateInput = {
    id?: SortOrder
    impactId?: SortOrder
    sector?: SortOrder
    taggedDirection?: SortOrder
    session1Return?: SortOrder
    session3Return?: SortOrder
    session5Return?: SortOrder
    directionMatch1?: SortOrder
    directionMatch3?: SortOrder
    directionMatch5?: SortOrder
    measuredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsBacktestMinOrderByAggregateInput = {
    id?: SortOrder
    impactId?: SortOrder
    sector?: SortOrder
    taggedDirection?: SortOrder
    session1Return?: SortOrder
    session3Return?: SortOrder
    session5Return?: SortOrder
    directionMatch1?: SortOrder
    directionMatch3?: SortOrder
    directionMatch5?: SortOrder
    measuredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsBacktestSumOrderByAggregateInput = {
    session1Return?: SortOrder
    session3Return?: SortOrder
    session5Return?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NewsDigestTypeDateCompoundUniqueInput = {
    type: string
    date: Date | string
  }

  export type NewsDigestCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    date?: SortOrder
    content?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsDigestAvgOrderByAggregateInput = {
    itemCount?: SortOrder
  }

  export type NewsDigestMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    date?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsDigestMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    date?: SortOrder
    itemCount?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsDigestSumOrderByAggregateInput = {
    itemCount?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PipelineMetricCountOrderByAggregateInput = {
    id?: SortOrder
    metricName?: SortOrder
    value?: SortOrder
    source?: SortOrder
    tags?: SortOrder
    recordedAt?: SortOrder
  }

  export type PipelineMetricAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type PipelineMetricMaxOrderByAggregateInput = {
    id?: SortOrder
    metricName?: SortOrder
    value?: SortOrder
    source?: SortOrder
    recordedAt?: SortOrder
  }

  export type PipelineMetricMinOrderByAggregateInput = {
    id?: SortOrder
    metricName?: SortOrder
    value?: SortOrder
    source?: SortOrder
    recordedAt?: SortOrder
  }

  export type PipelineMetricSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type NewsBookmarkListRelationFilter = {
    every?: NewsBookmarkWhereInput
    some?: NewsBookmarkWhereInput
    none?: NewsBookmarkWhereInput
  }

  export type TradeNewsLinkListRelationFilter = {
    every?: TradeNewsLinkWhereInput
    some?: TradeNewsLinkWhereInput
    none?: TradeNewsLinkWhereInput
  }

  export type NewsBookmarkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TradeNewsLinkOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EnrichedNewsCountOrderByAggregateInput = {
    id?: SortOrder
    headline?: SortOrder
    url?: SortOrder
    publishedAt?: SortOrder
    source?: SortOrder
    image?: SortOrder
    originalSummary?: SortOrder
    aiSummary?: SortOrder
    tldr?: SortOrder
    whyItMatters?: SortOrder
    categories?: SortOrder
    sectors?: SortOrder
    companies?: SortOrder
    financialTerms?: SortOrder
    historicalContext?: SortOrder
    shortTermImpact?: SortOrder
    longTermImpact?: SortOrder
    whatToWatchNext?: SortOrder
    riskFactors?: SortOrder
    probability?: SortOrder
    confidence?: SortOrder
    marketImpact?: SortOrder
    relatedArticles?: SortOrder
    createdAt?: SortOrder
  }

  export type EnrichedNewsAvgOrderByAggregateInput = {
    publishedAt?: SortOrder
    probability?: SortOrder
    confidence?: SortOrder
  }

  export type EnrichedNewsMaxOrderByAggregateInput = {
    id?: SortOrder
    headline?: SortOrder
    url?: SortOrder
    publishedAt?: SortOrder
    source?: SortOrder
    image?: SortOrder
    originalSummary?: SortOrder
    aiSummary?: SortOrder
    tldr?: SortOrder
    whyItMatters?: SortOrder
    historicalContext?: SortOrder
    shortTermImpact?: SortOrder
    longTermImpact?: SortOrder
    whatToWatchNext?: SortOrder
    riskFactors?: SortOrder
    probability?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
  }

  export type EnrichedNewsMinOrderByAggregateInput = {
    id?: SortOrder
    headline?: SortOrder
    url?: SortOrder
    publishedAt?: SortOrder
    source?: SortOrder
    image?: SortOrder
    originalSummary?: SortOrder
    aiSummary?: SortOrder
    tldr?: SortOrder
    whyItMatters?: SortOrder
    historicalContext?: SortOrder
    shortTermImpact?: SortOrder
    longTermImpact?: SortOrder
    whatToWatchNext?: SortOrder
    riskFactors?: SortOrder
    probability?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
  }

  export type EnrichedNewsSumOrderByAggregateInput = {
    publishedAt?: SortOrder
    probability?: SortOrder
    confidence?: SortOrder
  }

  export type EnrichedNewsScalarRelationFilter = {
    is?: EnrichedNewsWhereInput
    isNot?: EnrichedNewsWhereInput
  }

  export type NewsBookmarkUserIdNewsIdCompoundUniqueInput = {
    userId: string
    newsId: string
  }

  export type NewsBookmarkCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    newsId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsBookmarkMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    newsId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type NewsBookmarkMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    newsId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeNewsLinkTradeIdNewsIdCompoundUniqueInput = {
    tradeId: string
    newsId: string
  }

  export type TradeNewsLinkCountOrderByAggregateInput = {
    id?: SortOrder
    tradeId?: SortOrder
    newsId?: SortOrder
    reason?: SortOrder
  }

  export type TradeNewsLinkMaxOrderByAggregateInput = {
    id?: SortOrder
    tradeId?: SortOrder
    newsId?: SortOrder
    reason?: SortOrder
  }

  export type TradeNewsLinkMinOrderByAggregateInput = {
    id?: SortOrder
    tradeId?: SortOrder
    newsId?: SortOrder
    reason?: SortOrder
  }

  export type UserWatchlistUserIdTypeValueCompoundUniqueInput = {
    userId: string
    type: string
    value: string
  }

  export type UserWatchlistCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type UserWatchlistMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type UserWatchlistMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type OiHistoryTimeSymbolExpiryDateStrikePriceOptionTypeCompoundUniqueInput = {
    time: Date | string
    symbol: string
    expiryDate: Date | string
    strikePrice: number
    optionType: string
  }

  export type OiHistoryCountOrderByAggregateInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    strikePrice?: SortOrder
    optionType?: SortOrder
    openInterest?: SortOrder
    oiChange?: SortOrder
    volume?: SortOrder
    ltp?: SortOrder
    impliedVolatility?: SortOrder
    delta?: SortOrder
    gamma?: SortOrder
    theta?: SortOrder
    vega?: SortOrder
  }

  export type OiHistoryAvgOrderByAggregateInput = {
    strikePrice?: SortOrder
    openInterest?: SortOrder
    oiChange?: SortOrder
    volume?: SortOrder
    ltp?: SortOrder
    impliedVolatility?: SortOrder
    delta?: SortOrder
    gamma?: SortOrder
    theta?: SortOrder
    vega?: SortOrder
  }

  export type OiHistoryMaxOrderByAggregateInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    strikePrice?: SortOrder
    optionType?: SortOrder
    openInterest?: SortOrder
    oiChange?: SortOrder
    volume?: SortOrder
    ltp?: SortOrder
    impliedVolatility?: SortOrder
    delta?: SortOrder
    gamma?: SortOrder
    theta?: SortOrder
    vega?: SortOrder
  }

  export type OiHistoryMinOrderByAggregateInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    strikePrice?: SortOrder
    optionType?: SortOrder
    openInterest?: SortOrder
    oiChange?: SortOrder
    volume?: SortOrder
    ltp?: SortOrder
    impliedVolatility?: SortOrder
    delta?: SortOrder
    gamma?: SortOrder
    theta?: SortOrder
    vega?: SortOrder
  }

  export type OiHistorySumOrderByAggregateInput = {
    strikePrice?: SortOrder
    openInterest?: SortOrder
    oiChange?: SortOrder
    volume?: SortOrder
    ltp?: SortOrder
    impliedVolatility?: SortOrder
    delta?: SortOrder
    gamma?: SortOrder
    theta?: SortOrder
    vega?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type IvHistoryTimeSymbolCompoundUniqueInput = {
    time: Date | string
    symbol: string
  }

  export type IvHistoryCountOrderByAggregateInput = {
    time?: SortOrder
    symbol?: SortOrder
    indiaVix?: SortOrder
    atmIv?: SortOrder
    ivPercentile?: SortOrder
  }

  export type IvHistoryAvgOrderByAggregateInput = {
    indiaVix?: SortOrder
    atmIv?: SortOrder
    ivPercentile?: SortOrder
  }

  export type IvHistoryMaxOrderByAggregateInput = {
    time?: SortOrder
    symbol?: SortOrder
    indiaVix?: SortOrder
    atmIv?: SortOrder
    ivPercentile?: SortOrder
  }

  export type IvHistoryMinOrderByAggregateInput = {
    time?: SortOrder
    symbol?: SortOrder
    indiaVix?: SortOrder
    atmIv?: SortOrder
    ivPercentile?: SortOrder
  }

  export type IvHistorySumOrderByAggregateInput = {
    indiaVix?: SortOrder
    atmIv?: SortOrder
    ivPercentile?: SortOrder
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type PcrHistoryTimeSymbolExpiryDateCompoundUniqueInput = {
    time: Date | string
    symbol: string
    expiryDate: Date | string
  }

  export type PcrHistoryCountOrderByAggregateInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    pcrOi?: SortOrder
    pcrVolume?: SortOrder
    callOiTotal?: SortOrder
    putOiTotal?: SortOrder
  }

  export type PcrHistoryAvgOrderByAggregateInput = {
    pcrOi?: SortOrder
    pcrVolume?: SortOrder
    callOiTotal?: SortOrder
    putOiTotal?: SortOrder
  }

  export type PcrHistoryMaxOrderByAggregateInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    pcrOi?: SortOrder
    pcrVolume?: SortOrder
    callOiTotal?: SortOrder
    putOiTotal?: SortOrder
  }

  export type PcrHistoryMinOrderByAggregateInput = {
    time?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    pcrOi?: SortOrder
    pcrVolume?: SortOrder
    callOiTotal?: SortOrder
    putOiTotal?: SortOrder
  }

  export type PcrHistorySumOrderByAggregateInput = {
    pcrOi?: SortOrder
    pcrVolume?: SortOrder
    callOiTotal?: SortOrder
    putOiTotal?: SortOrder
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type FlowAiBriefCountOrderByAggregateInput = {
    id?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    briefType?: SortOrder
    headline?: SortOrder
    observations?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    marketContext?: SortOrder
    modelUsed?: SortOrder
    tokensUsed?: SortOrder
    generatedAt?: SortOrder
    expiresAt?: SortOrder
    isValid?: SortOrder
  }

  export type FlowAiBriefAvgOrderByAggregateInput = {
    confidence?: SortOrder
    tokensUsed?: SortOrder
  }

  export type FlowAiBriefMaxOrderByAggregateInput = {
    id?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    briefType?: SortOrder
    headline?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    modelUsed?: SortOrder
    tokensUsed?: SortOrder
    generatedAt?: SortOrder
    expiresAt?: SortOrder
    isValid?: SortOrder
  }

  export type FlowAiBriefMinOrderByAggregateInput = {
    id?: SortOrder
    symbol?: SortOrder
    expiryDate?: SortOrder
    briefType?: SortOrder
    headline?: SortOrder
    action?: SortOrder
    confidence?: SortOrder
    modelUsed?: SortOrder
    tokensUsed?: SortOrder
    generatedAt?: SortOrder
    expiresAt?: SortOrder
    isValid?: SortOrder
  }

  export type FlowAiBriefSumOrderByAggregateInput = {
    confidence?: SortOrder
    tokensUsed?: SortOrder
  }

  export type NewsTriageCreateNestedOneWithoutRawItemInput = {
    create?: XOR<NewsTriageCreateWithoutRawItemInput, NewsTriageUncheckedCreateWithoutRawItemInput>
    connectOrCreate?: NewsTriageCreateOrConnectWithoutRawItemInput
    connect?: NewsTriageWhereUniqueInput
  }

  export type NewsImpactCreateNestedOneWithoutRawItemInput = {
    create?: XOR<NewsImpactCreateWithoutRawItemInput, NewsImpactUncheckedCreateWithoutRawItemInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutRawItemInput
    connect?: NewsImpactWhereUniqueInput
  }

  export type NewsTriageUncheckedCreateNestedOneWithoutRawItemInput = {
    create?: XOR<NewsTriageCreateWithoutRawItemInput, NewsTriageUncheckedCreateWithoutRawItemInput>
    connectOrCreate?: NewsTriageCreateOrConnectWithoutRawItemInput
    connect?: NewsTriageWhereUniqueInput
  }

  export type NewsImpactUncheckedCreateNestedOneWithoutRawItemInput = {
    create?: XOR<NewsImpactCreateWithoutRawItemInput, NewsImpactUncheckedCreateWithoutRawItemInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutRawItemInput
    connect?: NewsImpactWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NewsTriageUpdateOneWithoutRawItemNestedInput = {
    create?: XOR<NewsTriageCreateWithoutRawItemInput, NewsTriageUncheckedCreateWithoutRawItemInput>
    connectOrCreate?: NewsTriageCreateOrConnectWithoutRawItemInput
    upsert?: NewsTriageUpsertWithoutRawItemInput
    disconnect?: NewsTriageWhereInput | boolean
    delete?: NewsTriageWhereInput | boolean
    connect?: NewsTriageWhereUniqueInput
    update?: XOR<XOR<NewsTriageUpdateToOneWithWhereWithoutRawItemInput, NewsTriageUpdateWithoutRawItemInput>, NewsTriageUncheckedUpdateWithoutRawItemInput>
  }

  export type NewsImpactUpdateOneWithoutRawItemNestedInput = {
    create?: XOR<NewsImpactCreateWithoutRawItemInput, NewsImpactUncheckedCreateWithoutRawItemInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutRawItemInput
    upsert?: NewsImpactUpsertWithoutRawItemInput
    disconnect?: NewsImpactWhereInput | boolean
    delete?: NewsImpactWhereInput | boolean
    connect?: NewsImpactWhereUniqueInput
    update?: XOR<XOR<NewsImpactUpdateToOneWithWhereWithoutRawItemInput, NewsImpactUpdateWithoutRawItemInput>, NewsImpactUncheckedUpdateWithoutRawItemInput>
  }

  export type NewsTriageUncheckedUpdateOneWithoutRawItemNestedInput = {
    create?: XOR<NewsTriageCreateWithoutRawItemInput, NewsTriageUncheckedCreateWithoutRawItemInput>
    connectOrCreate?: NewsTriageCreateOrConnectWithoutRawItemInput
    upsert?: NewsTriageUpsertWithoutRawItemInput
    disconnect?: NewsTriageWhereInput | boolean
    delete?: NewsTriageWhereInput | boolean
    connect?: NewsTriageWhereUniqueInput
    update?: XOR<XOR<NewsTriageUpdateToOneWithWhereWithoutRawItemInput, NewsTriageUpdateWithoutRawItemInput>, NewsTriageUncheckedUpdateWithoutRawItemInput>
  }

  export type NewsImpactUncheckedUpdateOneWithoutRawItemNestedInput = {
    create?: XOR<NewsImpactCreateWithoutRawItemInput, NewsImpactUncheckedCreateWithoutRawItemInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutRawItemInput
    upsert?: NewsImpactUpsertWithoutRawItemInput
    disconnect?: NewsImpactWhereInput | boolean
    delete?: NewsImpactWhereInput | boolean
    connect?: NewsImpactWhereUniqueInput
    update?: XOR<XOR<NewsImpactUpdateToOneWithWhereWithoutRawItemInput, NewsImpactUpdateWithoutRawItemInput>, NewsImpactUncheckedUpdateWithoutRawItemInput>
  }

  export type NewsRawItemCreateNestedOneWithoutTriageInput = {
    create?: XOR<NewsRawItemCreateWithoutTriageInput, NewsRawItemUncheckedCreateWithoutTriageInput>
    connectOrCreate?: NewsRawItemCreateOrConnectWithoutTriageInput
    connect?: NewsRawItemWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NewsRawItemUpdateOneRequiredWithoutTriageNestedInput = {
    create?: XOR<NewsRawItemCreateWithoutTriageInput, NewsRawItemUncheckedCreateWithoutTriageInput>
    connectOrCreate?: NewsRawItemCreateOrConnectWithoutTriageInput
    upsert?: NewsRawItemUpsertWithoutTriageInput
    connect?: NewsRawItemWhereUniqueInput
    update?: XOR<XOR<NewsRawItemUpdateToOneWithWhereWithoutTriageInput, NewsRawItemUpdateWithoutTriageInput>, NewsRawItemUncheckedUpdateWithoutTriageInput>
  }

  export type NewsImpactCreatesectorImpactInput = {
    set: string[]
  }

  export type NewsRawItemCreateNestedOneWithoutImpactInput = {
    create?: XOR<NewsRawItemCreateWithoutImpactInput, NewsRawItemUncheckedCreateWithoutImpactInput>
    connectOrCreate?: NewsRawItemCreateOrConnectWithoutImpactInput
    connect?: NewsRawItemWhereUniqueInput
  }

  export type NewsAuditLogCreateNestedOneWithoutImpactInput = {
    create?: XOR<NewsAuditLogCreateWithoutImpactInput, NewsAuditLogUncheckedCreateWithoutImpactInput>
    connectOrCreate?: NewsAuditLogCreateOrConnectWithoutImpactInput
    connect?: NewsAuditLogWhereUniqueInput
  }

  export type NewsBacktestCreateNestedManyWithoutImpactInput = {
    create?: XOR<NewsBacktestCreateWithoutImpactInput, NewsBacktestUncheckedCreateWithoutImpactInput> | NewsBacktestCreateWithoutImpactInput[] | NewsBacktestUncheckedCreateWithoutImpactInput[]
    connectOrCreate?: NewsBacktestCreateOrConnectWithoutImpactInput | NewsBacktestCreateOrConnectWithoutImpactInput[]
    createMany?: NewsBacktestCreateManyImpactInputEnvelope
    connect?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
  }

  export type NewsBacktestUncheckedCreateNestedManyWithoutImpactInput = {
    create?: XOR<NewsBacktestCreateWithoutImpactInput, NewsBacktestUncheckedCreateWithoutImpactInput> | NewsBacktestCreateWithoutImpactInput[] | NewsBacktestUncheckedCreateWithoutImpactInput[]
    connectOrCreate?: NewsBacktestCreateOrConnectWithoutImpactInput | NewsBacktestCreateOrConnectWithoutImpactInput[]
    createMany?: NewsBacktestCreateManyImpactInputEnvelope
    connect?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
  }

  export type NewsImpactUpdatesectorImpactInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NewsRawItemUpdateOneRequiredWithoutImpactNestedInput = {
    create?: XOR<NewsRawItemCreateWithoutImpactInput, NewsRawItemUncheckedCreateWithoutImpactInput>
    connectOrCreate?: NewsRawItemCreateOrConnectWithoutImpactInput
    upsert?: NewsRawItemUpsertWithoutImpactInput
    connect?: NewsRawItemWhereUniqueInput
    update?: XOR<XOR<NewsRawItemUpdateToOneWithWhereWithoutImpactInput, NewsRawItemUpdateWithoutImpactInput>, NewsRawItemUncheckedUpdateWithoutImpactInput>
  }

  export type NewsAuditLogUpdateOneRequiredWithoutImpactNestedInput = {
    create?: XOR<NewsAuditLogCreateWithoutImpactInput, NewsAuditLogUncheckedCreateWithoutImpactInput>
    connectOrCreate?: NewsAuditLogCreateOrConnectWithoutImpactInput
    upsert?: NewsAuditLogUpsertWithoutImpactInput
    connect?: NewsAuditLogWhereUniqueInput
    update?: XOR<XOR<NewsAuditLogUpdateToOneWithWhereWithoutImpactInput, NewsAuditLogUpdateWithoutImpactInput>, NewsAuditLogUncheckedUpdateWithoutImpactInput>
  }

  export type NewsBacktestUpdateManyWithoutImpactNestedInput = {
    create?: XOR<NewsBacktestCreateWithoutImpactInput, NewsBacktestUncheckedCreateWithoutImpactInput> | NewsBacktestCreateWithoutImpactInput[] | NewsBacktestUncheckedCreateWithoutImpactInput[]
    connectOrCreate?: NewsBacktestCreateOrConnectWithoutImpactInput | NewsBacktestCreateOrConnectWithoutImpactInput[]
    upsert?: NewsBacktestUpsertWithWhereUniqueWithoutImpactInput | NewsBacktestUpsertWithWhereUniqueWithoutImpactInput[]
    createMany?: NewsBacktestCreateManyImpactInputEnvelope
    set?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
    disconnect?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
    delete?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
    connect?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
    update?: NewsBacktestUpdateWithWhereUniqueWithoutImpactInput | NewsBacktestUpdateWithWhereUniqueWithoutImpactInput[]
    updateMany?: NewsBacktestUpdateManyWithWhereWithoutImpactInput | NewsBacktestUpdateManyWithWhereWithoutImpactInput[]
    deleteMany?: NewsBacktestScalarWhereInput | NewsBacktestScalarWhereInput[]
  }

  export type NewsBacktestUncheckedUpdateManyWithoutImpactNestedInput = {
    create?: XOR<NewsBacktestCreateWithoutImpactInput, NewsBacktestUncheckedCreateWithoutImpactInput> | NewsBacktestCreateWithoutImpactInput[] | NewsBacktestUncheckedCreateWithoutImpactInput[]
    connectOrCreate?: NewsBacktestCreateOrConnectWithoutImpactInput | NewsBacktestCreateOrConnectWithoutImpactInput[]
    upsert?: NewsBacktestUpsertWithWhereUniqueWithoutImpactInput | NewsBacktestUpsertWithWhereUniqueWithoutImpactInput[]
    createMany?: NewsBacktestCreateManyImpactInputEnvelope
    set?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
    disconnect?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
    delete?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
    connect?: NewsBacktestWhereUniqueInput | NewsBacktestWhereUniqueInput[]
    update?: NewsBacktestUpdateWithWhereUniqueWithoutImpactInput | NewsBacktestUpdateWithWhereUniqueWithoutImpactInput[]
    updateMany?: NewsBacktestUpdateManyWithWhereWithoutImpactInput | NewsBacktestUpdateManyWithWhereWithoutImpactInput[]
    deleteMany?: NewsBacktestScalarWhereInput | NewsBacktestScalarWhereInput[]
  }

  export type NewsImpactCreateNestedOneWithoutAuditLogInput = {
    create?: XOR<NewsImpactCreateWithoutAuditLogInput, NewsImpactUncheckedCreateWithoutAuditLogInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutAuditLogInput
    connect?: NewsImpactWhereUniqueInput
  }

  export type NewsImpactUncheckedCreateNestedOneWithoutAuditLogInput = {
    create?: XOR<NewsImpactCreateWithoutAuditLogInput, NewsImpactUncheckedCreateWithoutAuditLogInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutAuditLogInput
    connect?: NewsImpactWhereUniqueInput
  }

  export type NewsImpactUpdateOneWithoutAuditLogNestedInput = {
    create?: XOR<NewsImpactCreateWithoutAuditLogInput, NewsImpactUncheckedCreateWithoutAuditLogInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutAuditLogInput
    upsert?: NewsImpactUpsertWithoutAuditLogInput
    disconnect?: NewsImpactWhereInput | boolean
    delete?: NewsImpactWhereInput | boolean
    connect?: NewsImpactWhereUniqueInput
    update?: XOR<XOR<NewsImpactUpdateToOneWithWhereWithoutAuditLogInput, NewsImpactUpdateWithoutAuditLogInput>, NewsImpactUncheckedUpdateWithoutAuditLogInput>
  }

  export type NewsImpactUncheckedUpdateOneWithoutAuditLogNestedInput = {
    create?: XOR<NewsImpactCreateWithoutAuditLogInput, NewsImpactUncheckedCreateWithoutAuditLogInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutAuditLogInput
    upsert?: NewsImpactUpsertWithoutAuditLogInput
    disconnect?: NewsImpactWhereInput | boolean
    delete?: NewsImpactWhereInput | boolean
    connect?: NewsImpactWhereUniqueInput
    update?: XOR<XOR<NewsImpactUpdateToOneWithWhereWithoutAuditLogInput, NewsImpactUpdateWithoutAuditLogInput>, NewsImpactUncheckedUpdateWithoutAuditLogInput>
  }

  export type NewsImpactCreateNestedOneWithoutBacktestsInput = {
    create?: XOR<NewsImpactCreateWithoutBacktestsInput, NewsImpactUncheckedCreateWithoutBacktestsInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutBacktestsInput
    connect?: NewsImpactWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NewsImpactUpdateOneRequiredWithoutBacktestsNestedInput = {
    create?: XOR<NewsImpactCreateWithoutBacktestsInput, NewsImpactUncheckedCreateWithoutBacktestsInput>
    connectOrCreate?: NewsImpactCreateOrConnectWithoutBacktestsInput
    upsert?: NewsImpactUpsertWithoutBacktestsInput
    connect?: NewsImpactWhereUniqueInput
    update?: XOR<XOR<NewsImpactUpdateToOneWithWhereWithoutBacktestsInput, NewsImpactUpdateWithoutBacktestsInput>, NewsImpactUncheckedUpdateWithoutBacktestsInput>
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnrichedNewsCreatecategoriesInput = {
    set: string[]
  }

  export type EnrichedNewsCreatesectorsInput = {
    set: string[]
  }

  export type EnrichedNewsCreatecompaniesInput = {
    set: string[]
  }

  export type NewsBookmarkCreateNestedManyWithoutNewsInput = {
    create?: XOR<NewsBookmarkCreateWithoutNewsInput, NewsBookmarkUncheckedCreateWithoutNewsInput> | NewsBookmarkCreateWithoutNewsInput[] | NewsBookmarkUncheckedCreateWithoutNewsInput[]
    connectOrCreate?: NewsBookmarkCreateOrConnectWithoutNewsInput | NewsBookmarkCreateOrConnectWithoutNewsInput[]
    createMany?: NewsBookmarkCreateManyNewsInputEnvelope
    connect?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
  }

  export type TradeNewsLinkCreateNestedManyWithoutNewsInput = {
    create?: XOR<TradeNewsLinkCreateWithoutNewsInput, TradeNewsLinkUncheckedCreateWithoutNewsInput> | TradeNewsLinkCreateWithoutNewsInput[] | TradeNewsLinkUncheckedCreateWithoutNewsInput[]
    connectOrCreate?: TradeNewsLinkCreateOrConnectWithoutNewsInput | TradeNewsLinkCreateOrConnectWithoutNewsInput[]
    createMany?: TradeNewsLinkCreateManyNewsInputEnvelope
    connect?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
  }

  export type NewsBookmarkUncheckedCreateNestedManyWithoutNewsInput = {
    create?: XOR<NewsBookmarkCreateWithoutNewsInput, NewsBookmarkUncheckedCreateWithoutNewsInput> | NewsBookmarkCreateWithoutNewsInput[] | NewsBookmarkUncheckedCreateWithoutNewsInput[]
    connectOrCreate?: NewsBookmarkCreateOrConnectWithoutNewsInput | NewsBookmarkCreateOrConnectWithoutNewsInput[]
    createMany?: NewsBookmarkCreateManyNewsInputEnvelope
    connect?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
  }

  export type TradeNewsLinkUncheckedCreateNestedManyWithoutNewsInput = {
    create?: XOR<TradeNewsLinkCreateWithoutNewsInput, TradeNewsLinkUncheckedCreateWithoutNewsInput> | TradeNewsLinkCreateWithoutNewsInput[] | TradeNewsLinkUncheckedCreateWithoutNewsInput[]
    connectOrCreate?: TradeNewsLinkCreateOrConnectWithoutNewsInput | TradeNewsLinkCreateOrConnectWithoutNewsInput[]
    createMany?: TradeNewsLinkCreateManyNewsInputEnvelope
    connect?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
  }

  export type EnrichedNewsUpdatecategoriesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnrichedNewsUpdatesectorsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnrichedNewsUpdatecompaniesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NewsBookmarkUpdateManyWithoutNewsNestedInput = {
    create?: XOR<NewsBookmarkCreateWithoutNewsInput, NewsBookmarkUncheckedCreateWithoutNewsInput> | NewsBookmarkCreateWithoutNewsInput[] | NewsBookmarkUncheckedCreateWithoutNewsInput[]
    connectOrCreate?: NewsBookmarkCreateOrConnectWithoutNewsInput | NewsBookmarkCreateOrConnectWithoutNewsInput[]
    upsert?: NewsBookmarkUpsertWithWhereUniqueWithoutNewsInput | NewsBookmarkUpsertWithWhereUniqueWithoutNewsInput[]
    createMany?: NewsBookmarkCreateManyNewsInputEnvelope
    set?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
    disconnect?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
    delete?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
    connect?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
    update?: NewsBookmarkUpdateWithWhereUniqueWithoutNewsInput | NewsBookmarkUpdateWithWhereUniqueWithoutNewsInput[]
    updateMany?: NewsBookmarkUpdateManyWithWhereWithoutNewsInput | NewsBookmarkUpdateManyWithWhereWithoutNewsInput[]
    deleteMany?: NewsBookmarkScalarWhereInput | NewsBookmarkScalarWhereInput[]
  }

  export type TradeNewsLinkUpdateManyWithoutNewsNestedInput = {
    create?: XOR<TradeNewsLinkCreateWithoutNewsInput, TradeNewsLinkUncheckedCreateWithoutNewsInput> | TradeNewsLinkCreateWithoutNewsInput[] | TradeNewsLinkUncheckedCreateWithoutNewsInput[]
    connectOrCreate?: TradeNewsLinkCreateOrConnectWithoutNewsInput | TradeNewsLinkCreateOrConnectWithoutNewsInput[]
    upsert?: TradeNewsLinkUpsertWithWhereUniqueWithoutNewsInput | TradeNewsLinkUpsertWithWhereUniqueWithoutNewsInput[]
    createMany?: TradeNewsLinkCreateManyNewsInputEnvelope
    set?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
    disconnect?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
    delete?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
    connect?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
    update?: TradeNewsLinkUpdateWithWhereUniqueWithoutNewsInput | TradeNewsLinkUpdateWithWhereUniqueWithoutNewsInput[]
    updateMany?: TradeNewsLinkUpdateManyWithWhereWithoutNewsInput | TradeNewsLinkUpdateManyWithWhereWithoutNewsInput[]
    deleteMany?: TradeNewsLinkScalarWhereInput | TradeNewsLinkScalarWhereInput[]
  }

  export type NewsBookmarkUncheckedUpdateManyWithoutNewsNestedInput = {
    create?: XOR<NewsBookmarkCreateWithoutNewsInput, NewsBookmarkUncheckedCreateWithoutNewsInput> | NewsBookmarkCreateWithoutNewsInput[] | NewsBookmarkUncheckedCreateWithoutNewsInput[]
    connectOrCreate?: NewsBookmarkCreateOrConnectWithoutNewsInput | NewsBookmarkCreateOrConnectWithoutNewsInput[]
    upsert?: NewsBookmarkUpsertWithWhereUniqueWithoutNewsInput | NewsBookmarkUpsertWithWhereUniqueWithoutNewsInput[]
    createMany?: NewsBookmarkCreateManyNewsInputEnvelope
    set?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
    disconnect?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
    delete?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
    connect?: NewsBookmarkWhereUniqueInput | NewsBookmarkWhereUniqueInput[]
    update?: NewsBookmarkUpdateWithWhereUniqueWithoutNewsInput | NewsBookmarkUpdateWithWhereUniqueWithoutNewsInput[]
    updateMany?: NewsBookmarkUpdateManyWithWhereWithoutNewsInput | NewsBookmarkUpdateManyWithWhereWithoutNewsInput[]
    deleteMany?: NewsBookmarkScalarWhereInput | NewsBookmarkScalarWhereInput[]
  }

  export type TradeNewsLinkUncheckedUpdateManyWithoutNewsNestedInput = {
    create?: XOR<TradeNewsLinkCreateWithoutNewsInput, TradeNewsLinkUncheckedCreateWithoutNewsInput> | TradeNewsLinkCreateWithoutNewsInput[] | TradeNewsLinkUncheckedCreateWithoutNewsInput[]
    connectOrCreate?: TradeNewsLinkCreateOrConnectWithoutNewsInput | TradeNewsLinkCreateOrConnectWithoutNewsInput[]
    upsert?: TradeNewsLinkUpsertWithWhereUniqueWithoutNewsInput | TradeNewsLinkUpsertWithWhereUniqueWithoutNewsInput[]
    createMany?: TradeNewsLinkCreateManyNewsInputEnvelope
    set?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
    disconnect?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
    delete?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
    connect?: TradeNewsLinkWhereUniqueInput | TradeNewsLinkWhereUniqueInput[]
    update?: TradeNewsLinkUpdateWithWhereUniqueWithoutNewsInput | TradeNewsLinkUpdateWithWhereUniqueWithoutNewsInput[]
    updateMany?: TradeNewsLinkUpdateManyWithWhereWithoutNewsInput | TradeNewsLinkUpdateManyWithWhereWithoutNewsInput[]
    deleteMany?: TradeNewsLinkScalarWhereInput | TradeNewsLinkScalarWhereInput[]
  }

  export type EnrichedNewsCreateNestedOneWithoutBookmarksInput = {
    create?: XOR<EnrichedNewsCreateWithoutBookmarksInput, EnrichedNewsUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: EnrichedNewsCreateOrConnectWithoutBookmarksInput
    connect?: EnrichedNewsWhereUniqueInput
  }

  export type EnrichedNewsUpdateOneRequiredWithoutBookmarksNestedInput = {
    create?: XOR<EnrichedNewsCreateWithoutBookmarksInput, EnrichedNewsUncheckedCreateWithoutBookmarksInput>
    connectOrCreate?: EnrichedNewsCreateOrConnectWithoutBookmarksInput
    upsert?: EnrichedNewsUpsertWithoutBookmarksInput
    connect?: EnrichedNewsWhereUniqueInput
    update?: XOR<XOR<EnrichedNewsUpdateToOneWithWhereWithoutBookmarksInput, EnrichedNewsUpdateWithoutBookmarksInput>, EnrichedNewsUncheckedUpdateWithoutBookmarksInput>
  }

  export type EnrichedNewsCreateNestedOneWithoutTradeLinksInput = {
    create?: XOR<EnrichedNewsCreateWithoutTradeLinksInput, EnrichedNewsUncheckedCreateWithoutTradeLinksInput>
    connectOrCreate?: EnrichedNewsCreateOrConnectWithoutTradeLinksInput
    connect?: EnrichedNewsWhereUniqueInput
  }

  export type EnrichedNewsUpdateOneRequiredWithoutTradeLinksNestedInput = {
    create?: XOR<EnrichedNewsCreateWithoutTradeLinksInput, EnrichedNewsUncheckedCreateWithoutTradeLinksInput>
    connectOrCreate?: EnrichedNewsCreateOrConnectWithoutTradeLinksInput
    upsert?: EnrichedNewsUpsertWithoutTradeLinksInput
    connect?: EnrichedNewsWhereUniqueInput
    update?: XOR<XOR<EnrichedNewsUpdateToOneWithWhereWithoutTradeLinksInput, EnrichedNewsUpdateWithoutTradeLinksInput>, EnrichedNewsUncheckedUpdateWithoutTradeLinksInput>
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NewsTriageCreateWithoutRawItemInput = {
    id?: string
    relevant: boolean
    category: string
    urgency: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    createdAt?: Date | string
  }

  export type NewsTriageUncheckedCreateWithoutRawItemInput = {
    id?: string
    relevant: boolean
    category: string
    urgency: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    createdAt?: Date | string
  }

  export type NewsTriageCreateOrConnectWithoutRawItemInput = {
    where: NewsTriageWhereUniqueInput
    create: XOR<NewsTriageCreateWithoutRawItemInput, NewsTriageUncheckedCreateWithoutRawItemInput>
  }

  export type NewsImpactCreateWithoutRawItemInput = {
    id?: string
    sectorImpact?: NewsImpactCreatesectorImpactInput | string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonNullValueInput | InputJsonValue
    mode?: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    humanReviewRequired?: boolean
    humanApproved?: boolean | null
    humanNotes?: string | null
    createdAt?: Date | string
    auditLog: NewsAuditLogCreateNestedOneWithoutImpactInput
    backtests?: NewsBacktestCreateNestedManyWithoutImpactInput
  }

  export type NewsImpactUncheckedCreateWithoutRawItemInput = {
    id?: string
    sectorImpact?: NewsImpactCreatesectorImpactInput | string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonNullValueInput | InputJsonValue
    mode?: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    humanReviewRequired?: boolean
    humanApproved?: boolean | null
    humanNotes?: string | null
    complianceAuditId: string
    createdAt?: Date | string
    backtests?: NewsBacktestUncheckedCreateNestedManyWithoutImpactInput
  }

  export type NewsImpactCreateOrConnectWithoutRawItemInput = {
    where: NewsImpactWhereUniqueInput
    create: XOR<NewsImpactCreateWithoutRawItemInput, NewsImpactUncheckedCreateWithoutRawItemInput>
  }

  export type NewsTriageUpsertWithoutRawItemInput = {
    update: XOR<NewsTriageUpdateWithoutRawItemInput, NewsTriageUncheckedUpdateWithoutRawItemInput>
    create: XOR<NewsTriageCreateWithoutRawItemInput, NewsTriageUncheckedCreateWithoutRawItemInput>
    where?: NewsTriageWhereInput
  }

  export type NewsTriageUpdateToOneWithWhereWithoutRawItemInput = {
    where?: NewsTriageWhereInput
    data: XOR<NewsTriageUpdateWithoutRawItemInput, NewsTriageUncheckedUpdateWithoutRawItemInput>
  }

  export type NewsTriageUpdateWithoutRawItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    relevant?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    urgency?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsTriageUncheckedUpdateWithoutRawItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    relevant?: BoolFieldUpdateOperationsInput | boolean
    category?: StringFieldUpdateOperationsInput | string
    urgency?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsImpactUpsertWithoutRawItemInput = {
    update: XOR<NewsImpactUpdateWithoutRawItemInput, NewsImpactUncheckedUpdateWithoutRawItemInput>
    create: XOR<NewsImpactCreateWithoutRawItemInput, NewsImpactUncheckedCreateWithoutRawItemInput>
    where?: NewsImpactWhereInput
  }

  export type NewsImpactUpdateToOneWithWhereWithoutRawItemInput = {
    where?: NewsImpactWhereInput
    data: XOR<NewsImpactUpdateWithoutRawItemInput, NewsImpactUncheckedUpdateWithoutRawItemInput>
  }

  export type NewsImpactUpdateWithoutRawItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLog?: NewsAuditLogUpdateOneRequiredWithoutImpactNestedInput
    backtests?: NewsBacktestUpdateManyWithoutImpactNestedInput
  }

  export type NewsImpactUncheckedUpdateWithoutRawItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    complianceAuditId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    backtests?: NewsBacktestUncheckedUpdateManyWithoutImpactNestedInput
  }

  export type NewsRawItemCreateWithoutTriageInput = {
    id?: string
    source: string
    externalId?: string | null
    dedupeHash: string
    headline: string
    body?: string | null
    url?: string | null
    publishedAt: Date | string
    rawPayload: JsonNullValueInput | InputJsonValue
    status?: string
    failureReason?: string | null
    createdAt?: Date | string
    impact?: NewsImpactCreateNestedOneWithoutRawItemInput
  }

  export type NewsRawItemUncheckedCreateWithoutTriageInput = {
    id?: string
    source: string
    externalId?: string | null
    dedupeHash: string
    headline: string
    body?: string | null
    url?: string | null
    publishedAt: Date | string
    rawPayload: JsonNullValueInput | InputJsonValue
    status?: string
    failureReason?: string | null
    createdAt?: Date | string
    impact?: NewsImpactUncheckedCreateNestedOneWithoutRawItemInput
  }

  export type NewsRawItemCreateOrConnectWithoutTriageInput = {
    where: NewsRawItemWhereUniqueInput
    create: XOR<NewsRawItemCreateWithoutTriageInput, NewsRawItemUncheckedCreateWithoutTriageInput>
  }

  export type NewsRawItemUpsertWithoutTriageInput = {
    update: XOR<NewsRawItemUpdateWithoutTriageInput, NewsRawItemUncheckedUpdateWithoutTriageInput>
    create: XOR<NewsRawItemCreateWithoutTriageInput, NewsRawItemUncheckedCreateWithoutTriageInput>
    where?: NewsRawItemWhereInput
  }

  export type NewsRawItemUpdateToOneWithWhereWithoutTriageInput = {
    where?: NewsRawItemWhereInput
    data: XOR<NewsRawItemUpdateWithoutTriageInput, NewsRawItemUncheckedUpdateWithoutTriageInput>
  }

  export type NewsRawItemUpdateWithoutTriageInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeHash?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawPayload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: NewsImpactUpdateOneWithoutRawItemNestedInput
  }

  export type NewsRawItemUncheckedUpdateWithoutTriageInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeHash?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawPayload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: NewsImpactUncheckedUpdateOneWithoutRawItemNestedInput
  }

  export type NewsRawItemCreateWithoutImpactInput = {
    id?: string
    source: string
    externalId?: string | null
    dedupeHash: string
    headline: string
    body?: string | null
    url?: string | null
    publishedAt: Date | string
    rawPayload: JsonNullValueInput | InputJsonValue
    status?: string
    failureReason?: string | null
    createdAt?: Date | string
    triage?: NewsTriageCreateNestedOneWithoutRawItemInput
  }

  export type NewsRawItemUncheckedCreateWithoutImpactInput = {
    id?: string
    source: string
    externalId?: string | null
    dedupeHash: string
    headline: string
    body?: string | null
    url?: string | null
    publishedAt: Date | string
    rawPayload: JsonNullValueInput | InputJsonValue
    status?: string
    failureReason?: string | null
    createdAt?: Date | string
    triage?: NewsTriageUncheckedCreateNestedOneWithoutRawItemInput
  }

  export type NewsRawItemCreateOrConnectWithoutImpactInput = {
    where: NewsRawItemWhereUniqueInput
    create: XOR<NewsRawItemCreateWithoutImpactInput, NewsRawItemUncheckedCreateWithoutImpactInput>
  }

  export type NewsAuditLogCreateWithoutImpactInput = {
    id?: string
    rawItemId: string
    inputSnapshot: JsonNullValueInput | InputJsonValue
    outputSnapshot: JsonNullValueInput | InputJsonValue
    modelId: string
    promptVersion: string
    mode?: string
    compliancePassed: boolean
    complianceNotes?: string | null
    disclaimer: string
    timestamp?: Date | string
  }

  export type NewsAuditLogUncheckedCreateWithoutImpactInput = {
    id?: string
    rawItemId: string
    inputSnapshot: JsonNullValueInput | InputJsonValue
    outputSnapshot: JsonNullValueInput | InputJsonValue
    modelId: string
    promptVersion: string
    mode?: string
    compliancePassed: boolean
    complianceNotes?: string | null
    disclaimer: string
    timestamp?: Date | string
  }

  export type NewsAuditLogCreateOrConnectWithoutImpactInput = {
    where: NewsAuditLogWhereUniqueInput
    create: XOR<NewsAuditLogCreateWithoutImpactInput, NewsAuditLogUncheckedCreateWithoutImpactInput>
  }

  export type NewsBacktestCreateWithoutImpactInput = {
    id?: string
    sector: string
    taggedDirection: string
    session1Return?: number | null
    session3Return?: number | null
    session5Return?: number | null
    directionMatch1?: boolean | null
    directionMatch3?: boolean | null
    directionMatch5?: boolean | null
    measuredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NewsBacktestUncheckedCreateWithoutImpactInput = {
    id?: string
    sector: string
    taggedDirection: string
    session1Return?: number | null
    session3Return?: number | null
    session5Return?: number | null
    directionMatch1?: boolean | null
    directionMatch3?: boolean | null
    directionMatch5?: boolean | null
    measuredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NewsBacktestCreateOrConnectWithoutImpactInput = {
    where: NewsBacktestWhereUniqueInput
    create: XOR<NewsBacktestCreateWithoutImpactInput, NewsBacktestUncheckedCreateWithoutImpactInput>
  }

  export type NewsBacktestCreateManyImpactInputEnvelope = {
    data: NewsBacktestCreateManyImpactInput | NewsBacktestCreateManyImpactInput[]
    skipDuplicates?: boolean
  }

  export type NewsRawItemUpsertWithoutImpactInput = {
    update: XOR<NewsRawItemUpdateWithoutImpactInput, NewsRawItemUncheckedUpdateWithoutImpactInput>
    create: XOR<NewsRawItemCreateWithoutImpactInput, NewsRawItemUncheckedCreateWithoutImpactInput>
    where?: NewsRawItemWhereInput
  }

  export type NewsRawItemUpdateToOneWithWhereWithoutImpactInput = {
    where?: NewsRawItemWhereInput
    data: XOR<NewsRawItemUpdateWithoutImpactInput, NewsRawItemUncheckedUpdateWithoutImpactInput>
  }

  export type NewsRawItemUpdateWithoutImpactInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeHash?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawPayload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triage?: NewsTriageUpdateOneWithoutRawItemNestedInput
  }

  export type NewsRawItemUncheckedUpdateWithoutImpactInput = {
    id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    dedupeHash?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    body?: NullableStringFieldUpdateOperationsInput | string | null
    url?: NullableStringFieldUpdateOperationsInput | string | null
    publishedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawPayload?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    failureReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triage?: NewsTriageUncheckedUpdateOneWithoutRawItemNestedInput
  }

  export type NewsAuditLogUpsertWithoutImpactInput = {
    update: XOR<NewsAuditLogUpdateWithoutImpactInput, NewsAuditLogUncheckedUpdateWithoutImpactInput>
    create: XOR<NewsAuditLogCreateWithoutImpactInput, NewsAuditLogUncheckedCreateWithoutImpactInput>
    where?: NewsAuditLogWhereInput
  }

  export type NewsAuditLogUpdateToOneWithWhereWithoutImpactInput = {
    where?: NewsAuditLogWhereInput
    data: XOR<NewsAuditLogUpdateWithoutImpactInput, NewsAuditLogUncheckedUpdateWithoutImpactInput>
  }

  export type NewsAuditLogUpdateWithoutImpactInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    inputSnapshot?: JsonNullValueInput | InputJsonValue
    outputSnapshot?: JsonNullValueInput | InputJsonValue
    modelId?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    compliancePassed?: BoolFieldUpdateOperationsInput | boolean
    complianceNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disclaimer?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsAuditLogUncheckedUpdateWithoutImpactInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    inputSnapshot?: JsonNullValueInput | InputJsonValue
    outputSnapshot?: JsonNullValueInput | InputJsonValue
    modelId?: StringFieldUpdateOperationsInput | string
    promptVersion?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    compliancePassed?: BoolFieldUpdateOperationsInput | boolean
    complianceNotes?: NullableStringFieldUpdateOperationsInput | string | null
    disclaimer?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBacktestUpsertWithWhereUniqueWithoutImpactInput = {
    where: NewsBacktestWhereUniqueInput
    update: XOR<NewsBacktestUpdateWithoutImpactInput, NewsBacktestUncheckedUpdateWithoutImpactInput>
    create: XOR<NewsBacktestCreateWithoutImpactInput, NewsBacktestUncheckedCreateWithoutImpactInput>
  }

  export type NewsBacktestUpdateWithWhereUniqueWithoutImpactInput = {
    where: NewsBacktestWhereUniqueInput
    data: XOR<NewsBacktestUpdateWithoutImpactInput, NewsBacktestUncheckedUpdateWithoutImpactInput>
  }

  export type NewsBacktestUpdateManyWithWhereWithoutImpactInput = {
    where: NewsBacktestScalarWhereInput
    data: XOR<NewsBacktestUpdateManyMutationInput, NewsBacktestUncheckedUpdateManyWithoutImpactInput>
  }

  export type NewsBacktestScalarWhereInput = {
    AND?: NewsBacktestScalarWhereInput | NewsBacktestScalarWhereInput[]
    OR?: NewsBacktestScalarWhereInput[]
    NOT?: NewsBacktestScalarWhereInput | NewsBacktestScalarWhereInput[]
    id?: UuidFilter<"NewsBacktest"> | string
    impactId?: UuidFilter<"NewsBacktest"> | string
    sector?: StringFilter<"NewsBacktest"> | string
    taggedDirection?: StringFilter<"NewsBacktest"> | string
    session1Return?: FloatNullableFilter<"NewsBacktest"> | number | null
    session3Return?: FloatNullableFilter<"NewsBacktest"> | number | null
    session5Return?: FloatNullableFilter<"NewsBacktest"> | number | null
    directionMatch1?: BoolNullableFilter<"NewsBacktest"> | boolean | null
    directionMatch3?: BoolNullableFilter<"NewsBacktest"> | boolean | null
    directionMatch5?: BoolNullableFilter<"NewsBacktest"> | boolean | null
    measuredAt?: DateTimeNullableFilter<"NewsBacktest"> | Date | string | null
    createdAt?: DateTimeFilter<"NewsBacktest"> | Date | string
  }

  export type NewsImpactCreateWithoutAuditLogInput = {
    id?: string
    sectorImpact?: NewsImpactCreatesectorImpactInput | string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonNullValueInput | InputJsonValue
    mode?: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    humanReviewRequired?: boolean
    humanApproved?: boolean | null
    humanNotes?: string | null
    createdAt?: Date | string
    rawItem: NewsRawItemCreateNestedOneWithoutImpactInput
    backtests?: NewsBacktestCreateNestedManyWithoutImpactInput
  }

  export type NewsImpactUncheckedCreateWithoutAuditLogInput = {
    id?: string
    rawItemId: string
    sectorImpact?: NewsImpactCreatesectorImpactInput | string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonNullValueInput | InputJsonValue
    mode?: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    humanReviewRequired?: boolean
    humanApproved?: boolean | null
    humanNotes?: string | null
    createdAt?: Date | string
    backtests?: NewsBacktestUncheckedCreateNestedManyWithoutImpactInput
  }

  export type NewsImpactCreateOrConnectWithoutAuditLogInput = {
    where: NewsImpactWhereUniqueInput
    create: XOR<NewsImpactCreateWithoutAuditLogInput, NewsImpactUncheckedCreateWithoutAuditLogInput>
  }

  export type NewsImpactUpsertWithoutAuditLogInput = {
    update: XOR<NewsImpactUpdateWithoutAuditLogInput, NewsImpactUncheckedUpdateWithoutAuditLogInput>
    create: XOR<NewsImpactCreateWithoutAuditLogInput, NewsImpactUncheckedCreateWithoutAuditLogInput>
    where?: NewsImpactWhereInput
  }

  export type NewsImpactUpdateToOneWithWhereWithoutAuditLogInput = {
    where?: NewsImpactWhereInput
    data: XOR<NewsImpactUpdateWithoutAuditLogInput, NewsImpactUncheckedUpdateWithoutAuditLogInput>
  }

  export type NewsImpactUpdateWithoutAuditLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawItem?: NewsRawItemUpdateOneRequiredWithoutImpactNestedInput
    backtests?: NewsBacktestUpdateManyWithoutImpactNestedInput
  }

  export type NewsImpactUncheckedUpdateWithoutAuditLogInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    backtests?: NewsBacktestUncheckedUpdateManyWithoutImpactNestedInput
  }

  export type NewsImpactCreateWithoutBacktestsInput = {
    id?: string
    sectorImpact?: NewsImpactCreatesectorImpactInput | string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonNullValueInput | InputJsonValue
    mode?: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    humanReviewRequired?: boolean
    humanApproved?: boolean | null
    humanNotes?: string | null
    createdAt?: Date | string
    rawItem: NewsRawItemCreateNestedOneWithoutImpactInput
    auditLog: NewsAuditLogCreateNestedOneWithoutImpactInput
  }

  export type NewsImpactUncheckedCreateWithoutBacktestsInput = {
    id?: string
    rawItemId: string
    sectorImpact?: NewsImpactCreatesectorImpactInput | string[]
    direction: string
    confidence: string
    rationale: string
    historicalAnalogues: JsonNullValueInput | InputJsonValue
    mode?: string
    disclaimer: string
    modelVersion: string
    latencyMs: number
    tokensIn?: number | null
    tokensOut?: number | null
    humanReviewRequired?: boolean
    humanApproved?: boolean | null
    humanNotes?: string | null
    complianceAuditId: string
    createdAt?: Date | string
  }

  export type NewsImpactCreateOrConnectWithoutBacktestsInput = {
    where: NewsImpactWhereUniqueInput
    create: XOR<NewsImpactCreateWithoutBacktestsInput, NewsImpactUncheckedCreateWithoutBacktestsInput>
  }

  export type NewsImpactUpsertWithoutBacktestsInput = {
    update: XOR<NewsImpactUpdateWithoutBacktestsInput, NewsImpactUncheckedUpdateWithoutBacktestsInput>
    create: XOR<NewsImpactCreateWithoutBacktestsInput, NewsImpactUncheckedCreateWithoutBacktestsInput>
    where?: NewsImpactWhereInput
  }

  export type NewsImpactUpdateToOneWithWhereWithoutBacktestsInput = {
    where?: NewsImpactWhereInput
    data: XOR<NewsImpactUpdateWithoutBacktestsInput, NewsImpactUncheckedUpdateWithoutBacktestsInput>
  }

  export type NewsImpactUpdateWithoutBacktestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rawItem?: NewsRawItemUpdateOneRequiredWithoutImpactNestedInput
    auditLog?: NewsAuditLogUpdateOneRequiredWithoutImpactNestedInput
  }

  export type NewsImpactUncheckedUpdateWithoutBacktestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    rawItemId?: StringFieldUpdateOperationsInput | string
    sectorImpact?: NewsImpactUpdatesectorImpactInput | string[]
    direction?: StringFieldUpdateOperationsInput | string
    confidence?: StringFieldUpdateOperationsInput | string
    rationale?: StringFieldUpdateOperationsInput | string
    historicalAnalogues?: JsonNullValueInput | InputJsonValue
    mode?: StringFieldUpdateOperationsInput | string
    disclaimer?: StringFieldUpdateOperationsInput | string
    modelVersion?: StringFieldUpdateOperationsInput | string
    latencyMs?: IntFieldUpdateOperationsInput | number
    tokensIn?: NullableIntFieldUpdateOperationsInput | number | null
    tokensOut?: NullableIntFieldUpdateOperationsInput | number | null
    humanReviewRequired?: BoolFieldUpdateOperationsInput | boolean
    humanApproved?: NullableBoolFieldUpdateOperationsInput | boolean | null
    humanNotes?: NullableStringFieldUpdateOperationsInput | string | null
    complianceAuditId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBookmarkCreateWithoutNewsInput = {
    id?: string
    userId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type NewsBookmarkUncheckedCreateWithoutNewsInput = {
    id?: string
    userId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type NewsBookmarkCreateOrConnectWithoutNewsInput = {
    where: NewsBookmarkWhereUniqueInput
    create: XOR<NewsBookmarkCreateWithoutNewsInput, NewsBookmarkUncheckedCreateWithoutNewsInput>
  }

  export type NewsBookmarkCreateManyNewsInputEnvelope = {
    data: NewsBookmarkCreateManyNewsInput | NewsBookmarkCreateManyNewsInput[]
    skipDuplicates?: boolean
  }

  export type TradeNewsLinkCreateWithoutNewsInput = {
    id?: string
    tradeId: string
    reason?: string | null
  }

  export type TradeNewsLinkUncheckedCreateWithoutNewsInput = {
    id?: string
    tradeId: string
    reason?: string | null
  }

  export type TradeNewsLinkCreateOrConnectWithoutNewsInput = {
    where: TradeNewsLinkWhereUniqueInput
    create: XOR<TradeNewsLinkCreateWithoutNewsInput, TradeNewsLinkUncheckedCreateWithoutNewsInput>
  }

  export type TradeNewsLinkCreateManyNewsInputEnvelope = {
    data: TradeNewsLinkCreateManyNewsInput | TradeNewsLinkCreateManyNewsInput[]
    skipDuplicates?: boolean
  }

  export type NewsBookmarkUpsertWithWhereUniqueWithoutNewsInput = {
    where: NewsBookmarkWhereUniqueInput
    update: XOR<NewsBookmarkUpdateWithoutNewsInput, NewsBookmarkUncheckedUpdateWithoutNewsInput>
    create: XOR<NewsBookmarkCreateWithoutNewsInput, NewsBookmarkUncheckedCreateWithoutNewsInput>
  }

  export type NewsBookmarkUpdateWithWhereUniqueWithoutNewsInput = {
    where: NewsBookmarkWhereUniqueInput
    data: XOR<NewsBookmarkUpdateWithoutNewsInput, NewsBookmarkUncheckedUpdateWithoutNewsInput>
  }

  export type NewsBookmarkUpdateManyWithWhereWithoutNewsInput = {
    where: NewsBookmarkScalarWhereInput
    data: XOR<NewsBookmarkUpdateManyMutationInput, NewsBookmarkUncheckedUpdateManyWithoutNewsInput>
  }

  export type NewsBookmarkScalarWhereInput = {
    AND?: NewsBookmarkScalarWhereInput | NewsBookmarkScalarWhereInput[]
    OR?: NewsBookmarkScalarWhereInput[]
    NOT?: NewsBookmarkScalarWhereInput | NewsBookmarkScalarWhereInput[]
    id?: UuidFilter<"NewsBookmark"> | string
    userId?: UuidFilter<"NewsBookmark"> | string
    newsId?: StringFilter<"NewsBookmark"> | string
    notes?: StringNullableFilter<"NewsBookmark"> | string | null
    createdAt?: DateTimeFilter<"NewsBookmark"> | Date | string
  }

  export type TradeNewsLinkUpsertWithWhereUniqueWithoutNewsInput = {
    where: TradeNewsLinkWhereUniqueInput
    update: XOR<TradeNewsLinkUpdateWithoutNewsInput, TradeNewsLinkUncheckedUpdateWithoutNewsInput>
    create: XOR<TradeNewsLinkCreateWithoutNewsInput, TradeNewsLinkUncheckedCreateWithoutNewsInput>
  }

  export type TradeNewsLinkUpdateWithWhereUniqueWithoutNewsInput = {
    where: TradeNewsLinkWhereUniqueInput
    data: XOR<TradeNewsLinkUpdateWithoutNewsInput, TradeNewsLinkUncheckedUpdateWithoutNewsInput>
  }

  export type TradeNewsLinkUpdateManyWithWhereWithoutNewsInput = {
    where: TradeNewsLinkScalarWhereInput
    data: XOR<TradeNewsLinkUpdateManyMutationInput, TradeNewsLinkUncheckedUpdateManyWithoutNewsInput>
  }

  export type TradeNewsLinkScalarWhereInput = {
    AND?: TradeNewsLinkScalarWhereInput | TradeNewsLinkScalarWhereInput[]
    OR?: TradeNewsLinkScalarWhereInput[]
    NOT?: TradeNewsLinkScalarWhereInput | TradeNewsLinkScalarWhereInput[]
    id?: UuidFilter<"TradeNewsLink"> | string
    tradeId?: UuidFilter<"TradeNewsLink"> | string
    newsId?: StringFilter<"TradeNewsLink"> | string
    reason?: StringNullableFilter<"TradeNewsLink"> | string | null
  }

  export type EnrichedNewsCreateWithoutBookmarksInput = {
    id: string
    headline: string
    url: string
    publishedAt: number
    source: string
    image?: string | null
    originalSummary?: string | null
    aiSummary?: string | null
    tldr?: string | null
    whyItMatters?: string | null
    categories?: EnrichedNewsCreatecategoriesInput | string[]
    sectors?: EnrichedNewsCreatesectorsInput | string[]
    companies?: EnrichedNewsCreatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: string | null
    shortTermImpact?: string | null
    longTermImpact?: string | null
    whatToWatchNext?: string | null
    riskFactors?: string | null
    probability?: number | null
    confidence?: number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    tradeLinks?: TradeNewsLinkCreateNestedManyWithoutNewsInput
  }

  export type EnrichedNewsUncheckedCreateWithoutBookmarksInput = {
    id: string
    headline: string
    url: string
    publishedAt: number
    source: string
    image?: string | null
    originalSummary?: string | null
    aiSummary?: string | null
    tldr?: string | null
    whyItMatters?: string | null
    categories?: EnrichedNewsCreatecategoriesInput | string[]
    sectors?: EnrichedNewsCreatesectorsInput | string[]
    companies?: EnrichedNewsCreatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: string | null
    shortTermImpact?: string | null
    longTermImpact?: string | null
    whatToWatchNext?: string | null
    riskFactors?: string | null
    probability?: number | null
    confidence?: number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    tradeLinks?: TradeNewsLinkUncheckedCreateNestedManyWithoutNewsInput
  }

  export type EnrichedNewsCreateOrConnectWithoutBookmarksInput = {
    where: EnrichedNewsWhereUniqueInput
    create: XOR<EnrichedNewsCreateWithoutBookmarksInput, EnrichedNewsUncheckedCreateWithoutBookmarksInput>
  }

  export type EnrichedNewsUpsertWithoutBookmarksInput = {
    update: XOR<EnrichedNewsUpdateWithoutBookmarksInput, EnrichedNewsUncheckedUpdateWithoutBookmarksInput>
    create: XOR<EnrichedNewsCreateWithoutBookmarksInput, EnrichedNewsUncheckedCreateWithoutBookmarksInput>
    where?: EnrichedNewsWhereInput
  }

  export type EnrichedNewsUpdateToOneWithWhereWithoutBookmarksInput = {
    where?: EnrichedNewsWhereInput
    data: XOR<EnrichedNewsUpdateWithoutBookmarksInput, EnrichedNewsUncheckedUpdateWithoutBookmarksInput>
  }

  export type EnrichedNewsUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publishedAt?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    originalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    tldr?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    categories?: EnrichedNewsUpdatecategoriesInput | string[]
    sectors?: EnrichedNewsUpdatesectorsInput | string[]
    companies?: EnrichedNewsUpdatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: NullableStringFieldUpdateOperationsInput | string | null
    shortTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    longTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    whatToWatchNext?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    probability?: NullableIntFieldUpdateOperationsInput | number | null
    confidence?: NullableIntFieldUpdateOperationsInput | number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradeLinks?: TradeNewsLinkUpdateManyWithoutNewsNestedInput
  }

  export type EnrichedNewsUncheckedUpdateWithoutBookmarksInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publishedAt?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    originalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    tldr?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    categories?: EnrichedNewsUpdatecategoriesInput | string[]
    sectors?: EnrichedNewsUpdatesectorsInput | string[]
    companies?: EnrichedNewsUpdatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: NullableStringFieldUpdateOperationsInput | string | null
    shortTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    longTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    whatToWatchNext?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    probability?: NullableIntFieldUpdateOperationsInput | number | null
    confidence?: NullableIntFieldUpdateOperationsInput | number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradeLinks?: TradeNewsLinkUncheckedUpdateManyWithoutNewsNestedInput
  }

  export type EnrichedNewsCreateWithoutTradeLinksInput = {
    id: string
    headline: string
    url: string
    publishedAt: number
    source: string
    image?: string | null
    originalSummary?: string | null
    aiSummary?: string | null
    tldr?: string | null
    whyItMatters?: string | null
    categories?: EnrichedNewsCreatecategoriesInput | string[]
    sectors?: EnrichedNewsCreatesectorsInput | string[]
    companies?: EnrichedNewsCreatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: string | null
    shortTermImpact?: string | null
    longTermImpact?: string | null
    whatToWatchNext?: string | null
    riskFactors?: string | null
    probability?: number | null
    confidence?: number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    bookmarks?: NewsBookmarkCreateNestedManyWithoutNewsInput
  }

  export type EnrichedNewsUncheckedCreateWithoutTradeLinksInput = {
    id: string
    headline: string
    url: string
    publishedAt: number
    source: string
    image?: string | null
    originalSummary?: string | null
    aiSummary?: string | null
    tldr?: string | null
    whyItMatters?: string | null
    categories?: EnrichedNewsCreatecategoriesInput | string[]
    sectors?: EnrichedNewsCreatesectorsInput | string[]
    companies?: EnrichedNewsCreatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: string | null
    shortTermImpact?: string | null
    longTermImpact?: string | null
    whatToWatchNext?: string | null
    riskFactors?: string | null
    probability?: number | null
    confidence?: number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    bookmarks?: NewsBookmarkUncheckedCreateNestedManyWithoutNewsInput
  }

  export type EnrichedNewsCreateOrConnectWithoutTradeLinksInput = {
    where: EnrichedNewsWhereUniqueInput
    create: XOR<EnrichedNewsCreateWithoutTradeLinksInput, EnrichedNewsUncheckedCreateWithoutTradeLinksInput>
  }

  export type EnrichedNewsUpsertWithoutTradeLinksInput = {
    update: XOR<EnrichedNewsUpdateWithoutTradeLinksInput, EnrichedNewsUncheckedUpdateWithoutTradeLinksInput>
    create: XOR<EnrichedNewsCreateWithoutTradeLinksInput, EnrichedNewsUncheckedCreateWithoutTradeLinksInput>
    where?: EnrichedNewsWhereInput
  }

  export type EnrichedNewsUpdateToOneWithWhereWithoutTradeLinksInput = {
    where?: EnrichedNewsWhereInput
    data: XOR<EnrichedNewsUpdateWithoutTradeLinksInput, EnrichedNewsUncheckedUpdateWithoutTradeLinksInput>
  }

  export type EnrichedNewsUpdateWithoutTradeLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publishedAt?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    originalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    tldr?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    categories?: EnrichedNewsUpdatecategoriesInput | string[]
    sectors?: EnrichedNewsUpdatesectorsInput | string[]
    companies?: EnrichedNewsUpdatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: NullableStringFieldUpdateOperationsInput | string | null
    shortTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    longTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    whatToWatchNext?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    probability?: NullableIntFieldUpdateOperationsInput | number | null
    confidence?: NullableIntFieldUpdateOperationsInput | number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookmarks?: NewsBookmarkUpdateManyWithoutNewsNestedInput
  }

  export type EnrichedNewsUncheckedUpdateWithoutTradeLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    headline?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    publishedAt?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    image?: NullableStringFieldUpdateOperationsInput | string | null
    originalSummary?: NullableStringFieldUpdateOperationsInput | string | null
    aiSummary?: NullableStringFieldUpdateOperationsInput | string | null
    tldr?: NullableStringFieldUpdateOperationsInput | string | null
    whyItMatters?: NullableStringFieldUpdateOperationsInput | string | null
    categories?: EnrichedNewsUpdatecategoriesInput | string[]
    sectors?: EnrichedNewsUpdatesectorsInput | string[]
    companies?: EnrichedNewsUpdatecompaniesInput | string[]
    financialTerms?: NullableJsonNullValueInput | InputJsonValue
    historicalContext?: NullableStringFieldUpdateOperationsInput | string | null
    shortTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    longTermImpact?: NullableStringFieldUpdateOperationsInput | string | null
    whatToWatchNext?: NullableStringFieldUpdateOperationsInput | string | null
    riskFactors?: NullableStringFieldUpdateOperationsInput | string | null
    probability?: NullableIntFieldUpdateOperationsInput | number | null
    confidence?: NullableIntFieldUpdateOperationsInput | number | null
    marketImpact?: NullableJsonNullValueInput | InputJsonValue
    relatedArticles?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bookmarks?: NewsBookmarkUncheckedUpdateManyWithoutNewsNestedInput
  }

  export type NewsBacktestCreateManyImpactInput = {
    id?: string
    sector: string
    taggedDirection: string
    session1Return?: number | null
    session3Return?: number | null
    session5Return?: number | null
    directionMatch1?: boolean | null
    directionMatch3?: boolean | null
    directionMatch5?: boolean | null
    measuredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type NewsBacktestUpdateWithoutImpactInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    taggedDirection?: StringFieldUpdateOperationsInput | string
    session1Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session3Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session5Return?: NullableFloatFieldUpdateOperationsInput | number | null
    directionMatch1?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch3?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch5?: NullableBoolFieldUpdateOperationsInput | boolean | null
    measuredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBacktestUncheckedUpdateWithoutImpactInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    taggedDirection?: StringFieldUpdateOperationsInput | string
    session1Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session3Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session5Return?: NullableFloatFieldUpdateOperationsInput | number | null
    directionMatch1?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch3?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch5?: NullableBoolFieldUpdateOperationsInput | boolean | null
    measuredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBacktestUncheckedUpdateManyWithoutImpactInput = {
    id?: StringFieldUpdateOperationsInput | string
    sector?: StringFieldUpdateOperationsInput | string
    taggedDirection?: StringFieldUpdateOperationsInput | string
    session1Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session3Return?: NullableFloatFieldUpdateOperationsInput | number | null
    session5Return?: NullableFloatFieldUpdateOperationsInput | number | null
    directionMatch1?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch3?: NullableBoolFieldUpdateOperationsInput | boolean | null
    directionMatch5?: NullableBoolFieldUpdateOperationsInput | boolean | null
    measuredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBookmarkCreateManyNewsInput = {
    id?: string
    userId: string
    notes?: string | null
    createdAt?: Date | string
  }

  export type TradeNewsLinkCreateManyNewsInput = {
    id?: string
    tradeId: string
    reason?: string | null
  }

  export type NewsBookmarkUpdateWithoutNewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBookmarkUncheckedUpdateWithoutNewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NewsBookmarkUncheckedUpdateManyWithoutNewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeNewsLinkUpdateWithoutNewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TradeNewsLinkUncheckedUpdateWithoutNewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TradeNewsLinkUncheckedUpdateManyWithoutNewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeId?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}