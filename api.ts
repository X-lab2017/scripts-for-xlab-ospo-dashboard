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

interface RepoOpenRankByMonthItem {
  full_name: string;
  org_name: string;
  repo_name: string;
  month: string; // yyyy-mm
  openrank: number;
}

export async function getXSOSIReposInEachMonth(): Promise<
  [string, string[]][]
> {
  const repoOpenRankByMonth: RepoOpenRankByMonthItem[] = await request(
    REPO_OPENRANK_BY_MONTH
  );
  const result: [string, string[]][] = [];
  let currentMonth = "";
  let reposInEachMonth: string[] = [];
  for (const item of repoOpenRankByMonth) {
    if (item.month !== currentMonth) {
      if (currentMonth !== "") {
        result.push([currentMonth, reposInEachMonth]);
      }
      currentMonth = item.month;
      reposInEachMonth = [item.full_name];
    } else {
      reposInEachMonth.push(item.full_name);
    }
  }
  result.push([currentMonth, reposInEachMonth]);
  return result;
}

type RepoMetric = [
  string,
  {
    [key: string]: number;
  }
];

export async function getRepoMetrics(repo: string): Promise<RepoMetric[]> {
  const metrics = await Promise.all(
    OPENDIGGER_METRICS_FOR_REPO.map((metric) =>
      request(`${ENDPOINT_OPENDIGGER}/${repo}/${metric}.json`)
    )
  );
  return OPENDIGGER_METRICS_FOR_REPO.map((metric, index) => [
    metric,
    metrics[index],
  ]);
}
