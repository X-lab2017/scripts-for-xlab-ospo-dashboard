import { existsSync, mkdirSync } from "fs";

import { DIRNAME_SHEETS } from "./const";
import ODMetricsCenter from "./ODMetricsCenter";
import OpenRankDetails from "./OpenRankDetails";
import YuqueStatistics from "./YuqueStatistics";
import OSPapers from "./OSPapers";

async function main() {
  if (!existsSync(DIRNAME_SHEETS)) {
    mkdirSync(DIRNAME_SHEETS);
  }

  const center = new ODMetricsCenter();
  await center.init();
  center.printRecords();
  center.dump2xlsx();

  const openRankDetails = new OpenRankDetails();
  await openRankDetails.init();
  openRankDetails.printRecords();
  openRankDetails.dump2xlsx();

  const yuqueStatistics = new YuqueStatistics(process.env.YUQUE_SESSION);
  await yuqueStatistics.init();
  yuqueStatistics.print();
  yuqueStatistics.dump2xlsx();

  const osPapers = new OSPapers();
  await osPapers.init();
  osPapers.print();
  osPapers.dump2xlsx();
}

main();
