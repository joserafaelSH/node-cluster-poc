//INSERT INTO logs (cpu, gpu, disk, ram, temperature)

import { notification } from "./notification.js";
import { resilience } from "./resilience.js";
import { saveData } from "./save-data.js";

process.on("message", async (items) => {
  const pid = process.pid;
  for (const item of items) {
    try {
      const data = item;
      if (
        data.cpu < 0 ||
        data.gpu < 0 ||
        data.ram < 0 ||
        data.disk < 0 ||
        data.temperature < 0
      ) {
        await notification(
          JSON.stringify({ pid, message: "invalid data", ...data })
        );
      } else if (data.disk > 85) {
        await notification(
          JSON.stringify({ pid, message: "use of disk > 85%", ...data })
        );
      } else if (data.ram > 80) {
        await notification(
          JSON.stringify({ pid, message: "use of ram > 80%", ...data })
        );
      } else if (data.temperature > 80) {
        await notification(
          JSON.stringify({ pid, message: "temp > 80C", ...data })
        );
      } else if (data.cpu > 70 && data.ram > 70) {
        await notification(
          JSON.stringify({ pid, message: "use of cpu and ram > 70", ...data })
        );
      } else {
        await notification(
          JSON.stringify({ pid, message: "all right", ...data })
        );
      }

      await saveData(JSON.stringify({ ...data }));
      process.send("ok");
    } catch (err) {
      await resilience(
        JSON.stringify({ pid, message: "internal error", err, ...item })
      );
    }
  }
});
