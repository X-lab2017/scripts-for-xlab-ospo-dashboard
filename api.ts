import {
  REPO_OPENRANK_BY_MONTH,
  ENDPOINT_OPENDIGGER,
  OPENDIGGER_METRICS_FOR_REPO,
} from "./const";

async function request(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return await res.json();
}

type Month = string; // yyyy-mm
type RepoName = string; // org/repo

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

type MetricName = string;
interface MetricContent {
  [key: Month]: number;
}

export async function getRepoMetrics(
  repo: RepoName
): Promise<Map<MetricName, MetricContent>> {
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
