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
          email: (email) => `${email}`,
        },
      },
    },
  },
};

export default linking;