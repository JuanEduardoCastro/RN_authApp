import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '@env';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

export function buildGithubAuthUrl(state: string): string {
  const params = [
    `client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}`,
    `redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}`,
    `scope=${encodeURIComponent('user:email')}`,
    `state=${encodeURIComponent(state)}`,
  ].join('&');

  return `${GITHUB_AUTHORIZE_URL}?${params}`;
}
