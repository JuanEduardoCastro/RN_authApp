import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from '@env';

export const githubAuthConfig = {
  clientId: GITHUB_CLIENT_ID,
  redirectUrl: GITHUB_REDIRECT_URI,
  scopes: ['user:email'],
  additionalHeaders: { Accept: 'application/json' },
  usePKCE: true,
  serviceConfiguration: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: 'https://github.com/logout',
  },
};
