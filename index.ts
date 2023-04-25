import { existsSync, mkdirSync } from "fs";

import { DIRNAME_SHEETS } from "./const";
import ODMetricsCenter from "./ODMetricsCenter";
import OpenRankDetails from "./OpenRankDetails";

async function main() {
  if (!existsSync(DIRNAME_SHEETS)) {
    mkdirSync(DIRNAME_SHEETS);
  }
  // const center = new ODMetricsCenter();
  // await center.init();
  // // dataCenter.printRecords();
  // center.dump2xlsx();
  const openRankDetails = new OpenRankDetails();
  await openRankDetails.init();
  openRankDetails.dump2xlsx();
}

main();
