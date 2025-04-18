// AllChallenges.js
// import React from 'react';
// import { FlatList, View } from 'react-native';
// import ChallengeCard from './ChallengeCard';

// const AllChallenges = ({ challenges, onJoin }) => {
//     console.log("challengeschallengeschallenges", challenges
//     );

//     return (
//         <View style={{ flex: 1 }}>
//             <FlatList
//                 data={challenges}
//                 keyExtractor={(item) => item?._id?.toString() || index.toString()}
//                 renderItem={({ item }) => (
//                     <ChallengeCard challenge={item} onJoin={onJoin} btnType={"Join"} />
//                 )}
//             />
//         </View>
//     );
// };

// export default AllChallenges;


import React from 'react';
import { View, StyleSheet, Dimensions, Animated, Text, FlatList, ScrollView } from 'react-native';
import { SwiperFlatList, Pagination } from 'react-native-swiper-flatlist';
import ChallengeCardBanner from '../../../Components/ChallengeCardBanner';
import { scale } from 'react-native-size-matters';
import { Font } from '../../../assets/styles/Fonts';
import ChallengeCard from './ChallengeCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.92;
const SPACING = (width - CARD_WIDTH) / 2;

const CustomPagination = ({ paginationIndex, data }) => {
    return (
        <View style={styles.pagination}>
            {data.map((_, index) => {
                const isActive = index === paginationIndex;
                return (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            isActive ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                );
            })}
        </View>
    );
};
const AllChallenges = ({ challenges, onJoin }) => {

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.containerText}>
                    <Text style={styles.text}>All Challenges</Text>
                </View>
                <SwiperFlatList
                    data={challenges}
                    renderItem={({ item }) => (
                        <View style={{ width: CARD_WIDTH, marginHorizontal: SPACING / 2 }}>
                            <ChallengeCardBanner challenge={item} onJoin={onJoin} />
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                    showPagination
                    PaginationComponent={(props) => (
                        <CustomPagination {...props} data={challenges} />
                    )}
                    snapToAlignment="center"
                />

                {/* Static Category Cards */}
                <View style={styles.categoriesContainer}>
                    <View style={styles.categoryCard}>
                        <View style={styles.iconWrapper}>
                            <Text style={styles.iconText}>🏃‍♂️</Text>
                        </View>
                        <Text style={styles.categoryTitle}>Cardio</Text>
                        <Text style={styles.categoryCount}>8 challenges</Text>
                    </View>

                    <View style={styles.categoryCard}>
                        <View style={styles.iconWrapper}>
                            <Text style={styles.iconText}>🥗</Text>
                        </View>
                        <Text style={styles.categoryTitle}>Nutrition</Text>
                        <Text style={styles.categoryCount}>5 challenges</Text>
                    </View>
                </View>
                <View style={[styles.containerText, { paddingVertical: 20, marginBottom: scale(-10) }]}>
                    <Text style={styles.text}>Popular Challenges</Text>
                </View>
                <FlatList
                    data={challenges}
                    keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
                    renderItem={({ item }) => (
                        <ChallengeCard challenge={item} onJoin={onJoin} />
                    )}
                />
            </ScrollView>
        </View>
    );
};

export default AllChallenges;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    containerText: {
        backgroundColor: 'white',
        padding: 15,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#696666",
        fontFamily: Font?.Poppins
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 20,
        backgroundColor: '#21972B',
    },
    inactiveDot: {
        width: 8,
        backgroundColor: '#C4C4C4',
    },
    //vategorCArd Style
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(10),
        marginTop: 24,
    },

    categoryCard: {
        // flex: 1,
        backgroundColor: '#AEF5B4',
        borderRadius: 12,
        paddingVertical: 20,
        alignItems: 'center',
        width: scale(148)
        // marginHorizontal: 8,
    },

    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#CEF9D1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },

    iconText: {
        fontSize: 20,
    },

    categoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A3E1A',
        fontFamily: Font?.Poppins
    },

    categoryCount: {
        fontSize: 12,
        color: '#1A3E1A',
        marginTop: 4,
        fontFamily: Font?.Poppins
    },
});
