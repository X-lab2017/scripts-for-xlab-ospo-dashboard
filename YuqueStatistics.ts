import * as XLSX from "xlsx";

import {
  getYuqueOverallStatistics,
  getYuqueTop20MemberStatistics,
} from "./api";
import { DIRNAME_SHEETS, FILENAME_SHEET_YUQUE_STATISTICS } from "./const";

interface OverallStatistics {
  crew_count: number; // 空间成员数
  doc_count: number; // 空间文档
  write_count: number; // 编辑次数
  read_count: number; // 阅读次数
  comment_count: number; // 评论次数
  like_count: number; // 点赞次数
  follow_count: number; // 关注数
  collect_count: number; // 收藏数
}

interface MemberStatistics {
  name: string; // 成员名
  write_count: number; // 编辑次数
  write_doc_count: number; // 编辑文档数
}

export default class YuqueStatistics {
  private _yuque_session: string;
  private rawOverallStatistics: any;
  private rawTop20MemberStatistics: any;
  private overallStatistics: OverallStatistics;
  private top20MemberStatistics: MemberStatistics[];

  constructor(_yuque_session: string) {
    this._yuque_session = _yuque_session;
  }

  async init() {
    this.rawOverallStatistics = await getYuqueOverallStatistics(
      this._yuque_session
    );
    this.rawTop20MemberStatistics = await getYuqueTop20MemberStatistics(
      this._yuque_session
    );
    this.generateOverallStatistics();
    this.generateTop20MemberStatistics();
  }

  private generateOverallStatistics() {
    const {
      crew_count,
      doc_count,
      write_count,
      read_count,
      comment_count,
      like_count,
      follow_count,
      collect_count,
    } = this.rawOverallStatistics.data[0];
    this.overallStatistics = {
      crew_count,
      doc_count,
      write_count,
      read_count,
      comment_count,
      like_count,
      follow_count,
      collect_count,
    };
  }

  private generateTop20MemberStatistics() {
    const { members } = this.rawTop20MemberStatistics.data;
    this.top20MemberStatistics = members.map((member: any) => {
      const { user, write_count, write_doc_count } = member;
      return {
        name: user.name,
        write_count,
        write_doc_count,
      };
    });
  }

  print() {
    console.table(this.overallStatistics);
    console.table(this.top20MemberStatistics);
  }

  dump2xlsx() {
    const wb = XLSX.utils.book_new();
    const ws_overall = XLSX.utils.json_to_sheet([this.overallStatistics]);
    const ws_top20 = XLSX.utils.json_to_sheet(this.top20MemberStatistics);
    XLSX.utils.book_append_sheet(wb, ws_overall, "overall");
    XLSX.utils.book_append_sheet(wb, ws_top20, "top20");
    XLSX.writeFile(wb, `${DIRNAME_SHEETS}/${FILENAME_SHEET_YUQUE_STATISTICS}`);
  }
}
