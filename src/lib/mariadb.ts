import type { PoolConfig } from "mariadb";

export function mariadbPoolConfig(url?: string): PoolConfig {
  const connectionString = url ?? process.env.DATABASE_URL ?? "";
  const parsed = new URL(connectionString);
  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password ?? ""),
    database: parsed.pathname.replace(/^\//, "") || undefined,
    connectionLimit: 10,
  };
}