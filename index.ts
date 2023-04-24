import ODMetricsCenter from "./ODMetricsCenter";

async function main() {
  const dataCenter = new ODMetricsCenter();
  await dataCenter.init();
  dataCenter.printRecords();
}

main();
