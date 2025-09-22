// supabase-sqlite-sync.js
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Load env vars
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "sqlite_backups";
const DB_PATH = process.env.SQLITE_PATH
  ? path.resolve(process.env.SQLITE_PATH)
  : path.join(process.cwd(), "database.sqlite");

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Upload SQLite to Supabase ---
export async function uploadDb() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.error("❌ Database file not found:", DB_PATH);
      return;
    }

    const fileBuffer = fs.readFileSync(DB_PATH);
    const fileName = `backup-${Date.now()}.sqlite`;

    const { error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(fileName, fileBuffer, { contentType: "application/x-sqlite3" });

    if (error) throw error;

    console.log(`✅ Uploaded ${fileName} to Supabase`);
  } catch (err) {
    console.error("❌ Upload error:", err.message);
  }
}

// --- Download latest SQLite from Supabase ---
export async function downloadDb() {
  try {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .list("", { sortBy: { column: "created_at", order: "desc" }, limit: 1 });

    if (error) throw error;
    if (!data || data.length === 0) {
      console.log("ℹ️ No backups found in Supabase");
      return;
    }

    const latestFile = data[0].name;

    const { data: fileData, error: downloadError } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .download(latestFile);

    if (downloadError) throw downloadError;

    const buffer = Buffer.from(await fileData.arrayBuffer());
    fs.writeFileSync(DB_PATH, buffer);

    console.log(`✅ Downloaded ${latestFile} to ${DB_PATH}`);
  } catch (err) {
    console.error("❌ Download error:", err.message);
  }
}

// Run directly (example: node supabase-sqlite-sync.js upload)
const action = process.argv[2];
if (action === "upload") uploadDb();
if (action === "download") downloadDb();
