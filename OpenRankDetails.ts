import * as XLSX from "xlsx";

import {
  getXSOSIReposInEachMonth,
  Month,
  RepoName,
  RawOpenRankDetail,
  getOpenRankDetail,
} from "./api";
import { DIRNAME_SHEETS, FILENAME_SHEET_OPENRANK_DETAILS } from "./const";

interface Record {
  month: Month;
  repo: string; // only repo name, no owner name
  user: string;
  from: string; // a "from" can be an issue, pr, or user
  value: number; // the value that the "from" contributes to the user openrank
}

export default class OpenRankDetails {
  private reposInEachMonth: Map<Month, RepoName[]>;
  private rawDetails: Map<Month, Map<RepoName, RawOpenRankDetail>>;
  private records: Record[];

  constructor() {
    this.reposInEachMonth = new Map();
    this.rawDetails = new Map();
    this.records = [];
  }

  async init() {
    await this.loadReposInEachMonth();
    await this.loadRawDetails();
    this.generateRecords();
  }

  private async loadReposInEachMonth() {
    this.reposInEachMonth = await getXSOSIReposInEachMonth();
  }

  private async loadRawDetails() {
    for (const [month, repos] of this.reposInEachMonth) {
      for (const repo of repos) {
        if (!this.rawDetails.has(month)) {
          this.rawDetails.set(
            month,
            new Map([[repo, await getOpenRankDetail(repo, month)]])
          );
        } else {
          this.rawDetails
            .get(month)
            .set(repo, await getOpenRankDetail(repo, month));
        }
      }
    }
  }

  private formatFromName(fromNode: any) {
    if (fromNode.c === "i" || fromNode.c === "p") {
      return `#${fromNode.n}`;
    }
    return fromNode.n;
  }

  private generateRecords() {
    for (const [month, details] of this.rawDetails) {
      for (const [repo, detail] of details) {
        const nodes = detail.nodes;
        const links = detail.links;
        nodes
          .filter((node) => node.c === "u")
          .forEach((userNode) => {
            // the "Self" record
            this.records.push({
              month,
              repo: repo.split("/")[1], // drop owner name
              user: userNode.n,
              from: "Self",
              value: userNode.i * userNode.r,
            });
            // other rocords
            links
              .filter((link) => link.t === userNode.id)
              .forEach((link) => {
                const fromNode = nodes.find((node) => node.id === link.s);
                this.records.push({
                  month,
                  repo: repo.split("/")[1], // drop owner name
                  user: userNode.n,
                  from: this.formatFromName(fromNode),
                  value: (1 - userNode.r) * link.w * fromNode.v,
                });
              });
          });
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
    XLSX.writeFile(wb, `${DIRNAME_SHEETS}/${FILENAME_SHEET_OPENRANK_DETAILS}`);
  }
}
