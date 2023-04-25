import {
  REPO_OPENRANK_BY_MONTH,
  ENDPOINT_OPENDIGGER,
  OPENDIGGER_METRICS_FOR_REPO,
  YUQUE_OVERALL_STATISTICS,
  YUQUE_TOP20_MEMBER_STATISTICS,
} from "./const";

async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    console.error(`Failed to fetch ${url}`);
    return null;
  }
  return await res.json();
}

export type Month = string; // yyyy-mm
export type RepoName = string; // org/repo

interface RepoOpenRankByMonthItem {
  full_name: string;
  org_name: string;
  repo_name: string;
  month: Month;
  openrank: number;
}

export async function getXSOSIReposInEachMonth(): Promise<
  Map<Month, RepoName[]>
> {
  const repoOpenRankByMonth: RepoOpenRankByMonthItem[] = await request(
    REPO_OPENRANK_BY_MONTH
  );
  const result: Map<Month, RepoName[]> = new Map();
  let currentMonth = "";
  let reposInEachMonth: RepoName[] = [];
  for (const item of repoOpenRankByMonth) {
    if (item.month !== currentMonth) {
      if (currentMonth !== "") {
        result.set(currentMonth, reposInEachMonth);
      }
      currentMonth = item.month;
      reposInEachMonth = [item.full_name];
    } else {
      reposInEachMonth.push(item.full_name);
    }
  }
  result.set(currentMonth, reposInEachMonth);
  return result;
}

export type MetricName = string;
type MetricContent = {
  [key: Month]: number;
} | null;
export type AllMetrics = Map<MetricName, MetricContent>;

export async function getAllMetrics(repo: RepoName): Promise<AllMetrics> {
  const result: Map<MetricName, MetricContent> = new Map();
  const metrics = await Promise.all(
    OPENDIGGER_METRICS_FOR_REPO.map((metric) =>
      request(`${ENDPOINT_OPENDIGGER}/${repo}/${metric}.json`)
    )
  );
  OPENDIGGER_METRICS_FOR_REPO.map((metric, index) => {
    result.set(metric, metrics[index]);
  });
  return result;
}

export interface RawOpenRankDetail {
  links: {
    s: string; // source node id
    t: string; // target node id
    w: number; // link weight
  }[];
  nodes: {
    id: string; // node id
    n: RepoName;
    c: "r" | "i" | "p" | "u"; // node category, repo | issue | pr | user
    r: number; // ratio
    i: number; // inheritance value
    v: number; // value
  }[];
}

export async function getOpenRankDetail(
  repo: RepoName,
  month: Month
): Promise<RawOpenRankDetail> {
  return await request(
    `${ENDPOINT_OPENDIGGER}/${repo}/project_openrank_detail/${month}.json`
  );
}

export async function getYuqueOverallStatistics(_yuque_session: string) {
  return await request(YUQUE_OVERALL_STATISTICS, {
    headers: {
      Cookie: `_yuque_session=${_yuque_session}`,
    },
  });
}

export async function getYuqueTop20MemberStatistics(_yuque_session: string) {
  return await request(YUQUE_TOP20_MEMBER_STATISTICS, {
    headers: {
      Cookie: `_yuque_session=${_yuque_session}`,
    },
  });
}
