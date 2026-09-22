let accessToken: string | null = null;

export const authSession = {
  getAccessToken: (): string | null => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
  isAuthenticated: (): boolean => Boolean(accessToken),
};
