import { getXSOSIReposInEachMonth, getRepoMetrics } from "./api";

const main = async (): Promise<void> => {
  // const repos = await getXSOSIReposInEachMonth();
  // console.log(repos);
  const metrics = await getRepoMetrics('hypertrons/hypertrons-crx');
  console.log(metrics);
}

main();
