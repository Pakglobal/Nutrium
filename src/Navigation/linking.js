const linking = {
  prefixes: [
    'myapp://',
    'https://nutrium-front-end-ci66-git-feature-val-rahulbodaras-projects.vercel.app',
  ],
  config: {
    screens: {
      resetPassword: {
        path: 'accounts/clientPassword/resetPassword',
        parse: {
          clientId: `67e236a84d6b05c36e97e2b5`,
        },
      },
    },
  },
};

export default linking;
