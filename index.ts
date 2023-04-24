import {
  getXSOSIReposInEachMonth,
  getAllMetrics,
  Month,
  RepoName,
  AllMetrics,
} from "./api";
import { OPENDIGGER_METRICS_FOR_REPO } from "./const";

class DataCenter {
  private reposInEachMonth: Map<Month, RepoName[]>;
  private repoMetrics: Map<RepoName, AllMetrics>;

  constructor() {
    this.reposInEachMonth = new Map();
    this.repoMetrics = new Map();
  }

  async init() {
    this.reposInEachMonth = await getXSOSIReposInEachMonth();
    for (const [month, repos] of this.reposInEachMonth) {
      for (const repo of repos) {
        if (!this.repoMetrics.has(repo)) {
          this.repoMetrics.set(repo, await getAllMetrics(repo));
        }
      }
    }
  }

  getRepoMetricInMonth(repo: RepoName, metric: string, month: Month) {
    return this.repoMetrics.get(repo).get(metric)?.[month] ?? 0;
  }

  print() {
    const records = [];
    for (const [month, repos] of this.reposInEachMonth) {
      for (const repo of repos) {
        const record = {
          month,
          repo,
        };
        OPENDIGGER_METRICS_FOR_REPO.forEach((metric) => {
          record[metric] = this.getRepoMetricInMonth(repo, metric, month);
        });
        records.push(record);
      }
    }
    console.table(records);
  }
}

async function main() {
  const dataCenter = new DataCenter();
  await dataCenter.init();
  dataCenter.print();
}

main();
