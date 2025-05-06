import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    FlatList,
    ScrollView,
} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import ChallengeCardBanner from '../../../Components/ChallengeCardBanner';
import { scale } from 'react-native-size-matters';
import { Font } from '../../../assets/styles/Fonts';
import ChallengeCard from './ChallengeCard';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Color } from '../../../assets/styles/Colors';
import { useNavigation } from '@react-navigation/native';
import CustomLoader from '../../../Components/CustomLoader';

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
    const navigation = useNavigation();
    const [loader, setLoader] = useState(true); 

    useEffect(() => {
        if (challenges && challenges.length > 0) {
            setLoader(false);
        }
    }, [challenges]); 

    const topChallenges = challenges.slice(0, 4);
    const remainingChallenges = challenges.slice(4);

    return (
        <View style={styles.container}>
            {
                loader ?
                    <CustomLoader /> :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.containerText}>
                            <Text style={styles.text}>All Challenges</Text>
                        </View>

                        <SwiperFlatList
                            data={topChallenges}
                            renderItem={({ item }) => (
                                <View style={{ width: CARD_WIDTH, marginHorizontal: SPACING / 2 }}>
                                    <ChallengeCardBanner
                                        challenge={item}
                                        onJoin={onJoin}
                                        btnType="Join"
                                        onPress={() => navigation.navigate('StepChallengeScreen', { item })}
                                    />
                                </View>
                            )}
                            keyExtractor={(item) => item._id}
                            showPagination
                            PaginationComponent={(props) => (
                                <CustomPagination {...props} data={topChallenges} />
                            )}
                            snapToAlignment="center"
                        />

                        <View style={styles.categoriesContainer}>
                            <View style={styles.categoryCard}>
                                <View style={styles.iconWrapper}>
                                    <FontAwesome5 name="running" size={20} color={Color?.primaryColor} />
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

                        {remainingChallenges.length > 0 && (
                            <>
                                <View style={[styles.containerText, { paddingVertical: 20, marginBottom: scale(-10) }]}>
                                    <Text style={styles.text}>Popular Challenges</Text>
                                </View>
                                <FlatList
                                    data={remainingChallenges}
                                    keyExtractor={(item, index) => item?._id?.toString() || index.toString()}
                                    renderItem={({ item }) => (
                                        <ChallengeCard challenge={item} onJoin={onJoin} handleJoinNow={() => navigation.navigate('StepChallengeScreen', { item })} />
                                    )}
                                />
                            </>
                        )}
                    </ScrollView>
            }
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
        color: Color?.textColor,
        fontFamily: Font?.PoppinsMedium,
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
    categoriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(10),
        marginTop: 24,
    },
    categoryCard: {
        backgroundColor: '#AEF5B4',
        borderRadius: 12,
        paddingVertical: 20,
        alignItems: 'center',
        width: scale(148),
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
        fontFamily: Font?.Poppins,
    },
    categoryCount: {
        fontSize: 12,
        color: '#1A3E1A',
        marginTop: 4,
        fontFamily: Font?.Poppins,
    },
});


