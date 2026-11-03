import { HttpClient } from '../utils';

export interface PinnedRepository {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
}

export interface GithubActivityData {
  pinned: PinnedRepository[];
  contributions: {
    total: number;
    days: { date: string; count: number }[];
  };
}

export class GithubActivityService {
  private httpClient = new HttpClient();

  /**
   * キャッシュは github-activity Worker 側（Upstash）が担当する。取得できなければ undefined を返す。
   * 上流が失敗したときは Worker が空の活動を返す（短い TTL でのみキャッシュ）ので、空も「取得できなかった」扱いにする。
   */
  public async fetchActivity(): Promise<GithubActivityData | undefined> {
    const baseUrl = new URL(process.env.REACT_APP_GITHUB_ACTIVITY_BASE_URL);
    baseUrl.pathname = '/github-activity';
    const response = await this.httpClient.get<GithubActivityData>(baseUrl.toString());
    if (!response || response.pinned.length === 0) {
      return undefined;
    }
    return response;
  }
}
