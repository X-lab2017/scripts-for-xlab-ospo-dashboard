import { existsSync, mkdirSync } from "fs";

import { DIRNAME_SHEETS } from "./const";
import ODMetricsCenter from "./ODMetricsCenter";

async function main() {
  if (!existsSync(DIRNAME_SHEETS)) {
    mkdirSync(DIRNAME_SHEETS);
  }
  const center = new ODMetricsCenter();
  await center.init();
  // dataCenter.printRecords();
  center.dump2xlsx();
}

main();
