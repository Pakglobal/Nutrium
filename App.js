// import { ScrollView, StyleSheet, Text } from 'react-native';
// import React, { useState } from 'react';
// import RootNavigation from './src/Navigation/RootNavigation';
// import axios from 'axios';

// interface posts {
//   body: string,
//   id: number,
//   userId: number,
//   title: string,
// }
// const App = () => {
//   const [data, setData] = useState([])

//   const callAPI = async () => {
//     const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
//     const response = res.data

//     setData(response)

//   }
//   callAPI();

//   return (
//     // <RootNavigation />
//     <ScrollView showsVerticalScrollIndicator={false}>
//       {
//         data.map((post :posts) => (
//           <>
//             <Text>{post.id}</Text>
//             <Text>{post.title}</Text>
//             <Text>{post.userId}</Text>
//             <Text>{post.body}</Text>
//           </>
//         ))
//       }
//     </ScrollView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({});

import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RootNavigation from './src/Navigation/RootNavigation';

const App = () => {
  return <RootNavigation />;
};

export default App;

const styles = StyleSheet.create({});