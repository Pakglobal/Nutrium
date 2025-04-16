// JoinChallenges.js
import React from 'react';
import { FlatList, View } from 'react-native';
import ChallengeCard from './ChallengeCard';

const JoinChallenges = ({ challenges, onJoin }) => {
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={challenges}
                keyExtractor={(item) => item?._id?.toString() || index.toString()}
                renderItem={({ item }) => (
                    <ChallengeCard challenge={item} onJoin={onJoin} btnType={"View"} />
                )}
            />
        </View>
    );
};

export default JoinChallenges;
