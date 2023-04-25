import * as XLSX from "xlsx";

import papers from "./x-lab-open-source-papers.json";
import { DIRNAME_SHEETS, FILENAME_SHEET_OS_PAPERS } from "./const";

interface Paper {
  title: string;
  fisrt_author: string;
  year: number;
  venue: string;
  url: string;
}

export default class OSPapers {
  private papers: Paper[];

  async init() {
    this.papers = papers.data.map((paper) => {
      const { title, authors, year, venue, url } = paper;
      return { title, fisrt_author: authors[0], year, venue, url };
    });
  }

  print() {
    console.table(this.papers);
  }

  dump2xlsx() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.papers);
    XLSX.utils.book_append_sheet(wb, ws, "papers");
    XLSX.writeFile(wb, `${DIRNAME_SHEETS}/${FILENAME_SHEET_OS_PAPERS}`);
  }
}
