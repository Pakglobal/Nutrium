// linking.js
const linking = {
    prefixes: ['myapp://', 'https://myapp.com'],
    config: {
      screens: {
        // Top-level stacks
        UserFlow: {
          screens: {
            shoppingLists: 'shoppingLists', // matches Stack.Screen name
            newShoppingLists: 'newShoppingLists',
            myLists: 'myLists',
          },
        },
        AuthStack: {
          screens: {
            loginScreen: 'login',
          },
        },
        AdminFlow: {
          screens: {
            Messages: 'messages',
          },
        },
      },
    },
  };
  
  export default linking;
  