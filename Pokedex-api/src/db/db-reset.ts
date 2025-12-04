import "dotenv/config";
import { resetData } from "./reset-data.js";

resetData()
  .then(() => {
    process.stdout.write("Database reset and seeded successfully.\n");
    process.exit(0);
  })
  .catch((error) => {
    process.stderr.write(`Reset failed: ${error}\n`);
    process.exit(1);
  });
