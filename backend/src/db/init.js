import dotenv from "dotenv";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js"; 
dotenv.config();
 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
    try {
        const sql = fs.readFileSync(
            path.join(__dirname, "schema.sql"),
            "utf8"
        );

        console.log("Applying schema...");

        await pool.query(sql);

        console.log("✅ Schema applied successfully.");
    } catch (err) {
        console.error("❌ Failed to apply schema:", err.message);
        console.error(err);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
})();