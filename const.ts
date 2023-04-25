// 志成提供给XSOSI大屏的接口的ENDPOINT
export const ENDPOINT_XSOSI = "https://oss.x-lab.info/zhicheng-ning/xsosi/xlab";
// 该文件包含了每个月参加XSOSI仓库的OPENRANK值，这里只用它来得到每个月参与XSOSI的REPO列表
export const REPO_OPENRANK_BY_MONTH = `${ENDPOINT_XSOSI}/repo_openrank_by_month.json`;
// OpenDigger每个月导出的和仓库相关的指标文件
export const ENDPOINT_OPENDIGGER = "https://oss.x-lab.info/open_digger/github";
// 文件内容格式不是{"yyyy-mm": value, ...}的先注释掉不包括进来
export const OPENDIGGER_METRICS_FOR_REPO = [
  "openrank",
  "activity",
  "attention",
  // "active_dates_and_times",
  "stars",
  "technical_fork",
  "participants",
  "new_contributors",
  // "new_contributors_detail",
  "inactive_contributors",
  "bus_factor",
  // "bus_factor_detail",
  "issues_new",
  "issues_closed",
  "issue_comments",
  // "issue_response_time",
  // "issue_resolution_duration",
  // "issue_age",
  "code_change_lines_add",
  "code_change_lines_remove",
  "code_change_lines_sum",
  "change_requests",
  "change_requests_accepted",
  "change_requests_reviews",
  // "change_request_response_time",
  // "change_request_resolution_duration",
  // "change_request_age",
];
// 语雀空间统计相关
export const ENDPOINT_YUQUE_STATICS =
  "https://xlab2017.yuque.com/api/organization/14356259/statistics";
// 论文发表情况
export const ENDPOINT_STATIC = "./static"; // read from local static files
// 导出的xlsx文件路径
export const DIRNAME_SHEETS = 'sheets';
export const FILENAME_SHEET_OD_METRICS = '1_OD_metrics.xlsx';
export const FILENAME_SHEET_OPENRANK_DETAILS = '2_openrank_details.xlsx';
