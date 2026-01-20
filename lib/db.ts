import 'server-only';
import { createClient } from "@libsql/client";

const isDev = process.env.NODE_ENV === 'development';
const useRemote = !!process.env.TURSO_DATABASE_URL;

const db = createClient({
    url: useRemote ? process.env.TURSO_DATABASE_URL! : `file:${process.cwd()}/inventory.db`,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;
