import * as XLSX from "xlsx";

import {
  getXSOSIReposInEachMonth,
  getAllMetrics,
  Month,
  RepoName,
  AllMetrics,
  MetricName,
} from "./api";
import {
  OPENDIGGER_METRICS_FOR_REPO,
  DIRNAME_SHEETS,
  FILENAME_SHEET_OD_METRICS,
} from "./const";

interface Record {
  month: Month;
  repo: string; // only repo name, no owner name
  [metric: MetricName]: number | string; // https://stackoverflow.com/a/38262343/10369621
}

export default class ODMetricsCenter {
  private reposInEachMonth: Map<Month, RepoName[]>;
  private repoMetrics: Map<RepoName, AllMetrics>;
  private records: Record[];

  constructor() {
    this.reposInEachMonth = new Map();
    this.repoMetrics = new Map();
    this.records = [];
  }

  async init() {
    await this.loadReposInEachMonth();
    await this.loadRepoMetrics();
    this.generateRecords();
  }

  private async loadReposInEachMonth() {
    this.reposInEachMonth = await getXSOSIReposInEachMonth();
  }

  private async loadRepoMetrics() {
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

  private generateRecords() {
    for (const [month, repos] of this.reposInEachMonth) {
      for (const repo of repos) {
        const record: Record = {
          month,
          repo: repo.split("/")[1], // drop owner name
        };
        OPENDIGGER_METRICS_FOR_REPO.forEach((metric) => {
          record[metric] = this.getRepoMetricInMonth(repo, metric, month);
        });
        this.records.push(record);
      }
    }
  }

  printRecords() {
    console.table(this.records);
  }

  dump2xlsx() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.records);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${DIRNAME_SHEETS}/${FILENAME_SHEET_OD_METRICS}`);
  }
}
