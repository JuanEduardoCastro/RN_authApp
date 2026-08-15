import { Linking } from 'react-native';

function generateState(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
}

function getQueryParam(url: string, key: string): string | null {
  const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function performGithubAuthorization(
  buildUrl: (state: string) => string,
  redirectPrefix: string,
  timeoutMs = 3 * 60 * 1000,
): Promise<{ code: string }> {
  return new Promise((resolve, reject) => {
    const state = generateState();
    let settled = false;

    const cleanup = () => {
      subscription.remove();
      clearTimeout(timeoutId);
    };

    const handleUrl = ({ url }: { url: string }) => {
      if (settled || !url.startsWith(redirectPrefix)) {
        return;
      }
      settled = true;
      cleanup();

      const error = getQueryParam(url, 'error');
      if (error) {
        reject(new Error(error));
        return;
      }

      const code = getQueryParam(url, 'code');
      const returnedState = getQueryParam(url, 'state');

      if (!code || returnedState !== state) {
        reject(new Error('github-oauth-state-mismatch'));
        return;
      }

      resolve({ code });
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    const timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('github-oauth-timeout'));
    }, timeoutMs);

    Linking.openURL(buildUrl(state)).catch(err => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err);
    });
  });
}
