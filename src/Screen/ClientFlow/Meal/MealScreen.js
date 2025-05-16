import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {scale, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector} from 'react-redux';
import Cook from '../../../assets/Images/cooking.svg';
import CustomLoader from '../../../Components/CustomLoader';
import {FetchMealPlanApi} from '../../../Apis/ClientApis/MealApi';
import Header from '../../../Components/Header';
import {Color} from '../../../assets/styles/Colors';
import CustomShadow from '../../../Components/CustomShadow';
import {Font} from '../../../assets/styles/Fonts';
import {shadowStyle} from '../../../assets/styles/Shadow';

const MealItem = ({
  item,
  index,
  openItemId,
  toggleItem,
  handleOpenBottomSheet,
}) => {
  const hasMealItems =
    (item.meal && item.meal.length > 0) ||
    (item.Appetizer && item.Appetizer.length > 0) ||
    (item.Beverage && item.Beverage.length > 0) ||
    (item.Dessert && item.Dessert.length > 0) ||
    (item.Dish && item.Dish.length > 0);

  const translateX = useSharedValue(-50);
  const scaleValue = useSharedValue(0.9);
  const detailsOpacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(0, {damping: 15, stiffness: 100});
    scaleValue.value = withSpring(1, {damping: 15, stiffness: 100});
  }, []);

  useEffect(() => {
    detailsOpacity.value = withTiming(openItemId === index ? 1 : 0, {
      duration: 300,
    });
  }, [openItemId]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {scale: scaleValue.value}],
  }));

  const detailsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: detailsOpacity.value,
    transform: [
      {translateY: withTiming(openItemId === index ? 0 : -10, {duration: 300})},
    ],
  }));

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.97, {stiffness: 200});
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, {stiffness: 200});
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300).delay(index * 100)}
      exiting={FadeOut.duration(300)}
      layout={Layout.springify()}
      style={[styles.card, animatedStyle]}>
      <CustomShadow>
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => toggleItem(index)}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.mealType}>{item?.mealType || 'Meal'}</Text>
              <CustomShadow color={Color.gray}>
                <View style={styles.timeContainer}>
                  <AntDesign
                    name="clockcircleo"
                    color={Color.textColor}
                    size={scale(16)}
                  />
                  <Text style={styles.timeText}>
                    {item?.time?.trim() || 'No time'}
                  </Text>
                </View>
              </CustomShadow>
            </View>
            <AntDesign
              name={openItemId === index ? 'up' : 'down'}
              size={verticalScale(14)}
              color={Color.primaryColor}
            />
          </View>
        </TouchableOpacity>
      </CustomShadow>

      {openItemId === index && (
        <Animated.View style={[styles.detailsContainer, detailsAnimatedStyle]}>
          {!hasMealItems ? (
            <Text style={styles.noItemsText}>
              No items scheduled for this meal
            </Text>
          ) : (
            <View>
              {item.meal?.map((mealItem, i) => (
                <View key={`meal-${i}`} style={styles.detailItem}>
                  <Text style={styles.detailText}>{mealItem?.displayName}</Text>
                </View>
              ))}
              {item.Appetizer?.map((item, i) => (
                <View key={`appetizer-${i}`} style={styles.detailItem}>
                  <Text style={styles.detailText}>{item?.displayName}</Text>
                </View>
              ))}
              {item.Beverage?.map((item, i) => (
                <View key={`beverage-${i}`} style={styles.detailItem}>
                  <Text style={styles.detailText}>{item?.displayName}</Text>
                </View>
              ))}
              {item.Dessert?.map((item, i) => (
                <View key={`dessert-${i}`} style={styles.detailItem}>
                  <Text style={styles.detailText}>{item?.displayName}</Text>
                </View>
              ))}
              {item.Dish?.map((item, i) => (
                <View key={`dish-${i}`} style={styles.detailItem}>
                  <Text style={styles.detailText}>{item?.displayName}</Text>
                </View>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.infoContainer}
            onPress={() => handleOpenBottomSheet(item)}>
            <AntDesign
              name="infocirlce"
              size={verticalScale(12)}
              color={Color.primaryColor}
            />
            <Text style={styles.infoText}>Nutritional info</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const formatDays = days => {
  if (!days || !Array.isArray(days)) return '';
  return days
    .map(day => {
      if (typeof day !== 'string') return '';
      return (
        day.substring(0, 3).charAt(0).toUpperCase() +
        day.substring(1, 3).toLowerCase()
      );
    })
    .filter(day => day)
    .join(', ');
};

const DayTab = ({template, index, isSelected, handleSelectDay}) => {
  const translateX = useSharedValue(50);
  const scaleValue = useSharedValue(0.9);

  useEffect(() => {
    translateX.value = withSpring(0, {damping: 15, stiffness: 100});
    scaleValue.value = withSpring(1, {damping: 15, stiffness: 100});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {scale: scaleValue.value}],
  }));

  const handlePressIn = () => {
    scaleValue.value = withSpring(0.97, {stiffness: 200});
  };

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, {stiffness: 200});
  };

  const daysText =
    template.days === 'Everyday' ? 'Everyday' : formatDays(template.days);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => handleSelectDay(template)}
        style={[
          styles.dayContainer,
          isSelected && styles.dayContainerSelected,
        ]}>
        <Text style={[styles.day, isSelected && styles.daySelected]}>
          {daysText}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MealScreen = () => {
  const [mealPlan, setMealPlan] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [openItemId, setOpenItemId] = useState(null);
  const bottomSheetRef = useRef(null);

  const tokenId = useSelector(state => state?.user?.token);
  const guestTokenId = useSelector(state => state?.user?.guestToken);
  const id = tokenId?.id || guestTokenId?.id;

  useEffect(() => {
    fetchMealPlanData();
  }, []);

  const fetchMealPlanData = async () => {
    setLoading(true);
    try {
      const response = await FetchMealPlanApi(id);
      if (response?.template?.length > 0) {
        setMealPlan(response.template[0].mealTemplate);
        const daysOfWeek = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        const today = new Date().getDay();
        const currentDay = daysOfWeek[today];
        const todayTemplate = response.template[0].mealTemplate.find(template =>
          template.days.includes(currentDay),
        );
        setSelectedDays(
          todayTemplate
            ? todayTemplate.days
            : response.template[0].mealTemplate[0]?.days || [],
        );
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMealsForSelectedDays = () => {
    if (!mealPlan || !selectedDays || !Array.isArray(mealPlan)) return [];
    const selectedTemplate = mealPlan.find(template => {
      const templateDays = template?.days;
      if (templateDays === 'Everyday') return true;
      return (
        Array.isArray(templateDays) &&
        selectedDays.some(day => templateDays.includes(day))
      );
    });
    return selectedTemplate?.mealSchedule || [];
  };

  const handleOpenBottomSheet = item => {
    setSelectedMeal(item);
    bottomSheetRef.current?.open();
  };

  const bottomSheetData = [
    {id: 0, title: 'Energy', value: '902 kcal'},
    {id: 1, title: 'Proteins', value: '32 g'},
    {id: 2, title: 'Carbohydrates', value: '18 g'},
    {id: 3, title: 'Fats', value: '82 g'},
  ];

  const handleSelectDay = template => {
    if (template?.days) {
      setSelectedDays(template.days);
    }
  };

  const isDaySelected = templateDays => {
    if (!Array.isArray(selectedDays)) return false;
    if (templateDays === 'Everyday') return true;
    if (!Array.isArray(templateDays)) return false;
    return JSON.stringify(selectedDays) === JSON.stringify(templateDays);
  };

  const toggleItem = id => {
    setOpenItemId(openItemId === id ? null : id);
  };

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeIn.duration(500)}
      style={styles.emptyStateContainer}>
      <Cook height={scale(120)} width={scale(120)} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Cooking up your meal plan...</Text>
        <Text style={styles.description}>
          This is where you'll find your new meal plan once it's ready.
        </Text>
        <Text style={styles.description}>
          Your professional can create a meal plan for you during your
          appointment. If you've already had an appointment, your professional
          might be taking a bit to wrap up some details.
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header logoHeader={true} />

      {mealPlan?.length > 0 && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={styles.daysScrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScrollContent}>
            {mealPlan.map((template, index) => (
              <DayTab
                key={`day-${index}`}
                template={template}
                index={index}
                isSelected={
                  template.days === 'Everyday' || isDaySelected(template.days)
                }
                handleSelectDay={handleSelectDay}
              />
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {loading ? (
        <CustomLoader style={{marginTop: verticalScale(25)}} />
      ) : mealPlan?.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {getMealsForSelectedDays()?.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => `meal-${index}`}
              data={getMealsForSelectedDays()}
              renderItem={({item, index}) => (
                <MealItem
                  item={item}
                  index={index}
                  openItemId={openItemId}
                  toggleItem={toggleItem}
                  handleOpenBottomSheet={handleOpenBottomSheet}
                />
              )}
              contentContainerStyle={styles.flatListContent}
            />
          ) : (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={styles.noRecordsContainer}>
              <Text style={styles.noRecordsText}>
                There are no records of meal plan
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      ) : (
        renderEmptyState()
      )}

      <RBSheet
        ref={bottomSheetRef}
        closeOnPressMask={true}
        closeOnPressBack={true}
        height={450}
        animationType="slide"
        customStyles={{
          container: styles.bottomContainer,
          draggableIcon: styles.draggableIcon,
        }}>
        <Animated.View entering={FadeIn.duration(300)}>
          <View style={styles.bottomHeaderContainer}>
            <Text style={styles.headerText}>
              {selectedMeal?.mealType || 'Meal'}
            </Text>
            <Text style={styles.headerText}>
              {selectedMeal?.time || 'No time specified'}
            </Text>
          </View>

          <ScrollView>
            {bottomSheetData.map((item, index) => (
              <Animated.View
                key={index}
                entering={FadeIn.duration(300)}
                style={styles.listItemContainer}>
                <View style={styles.listItemBoxLeft}>
                  <Text style={styles.listItemText}>{item.title}</Text>
                </View>
                <View style={styles.listItemBoxRight}>
                  <Text style={styles.listItemText}>{item.value}</Text>
                </View>
              </Animated.View>
            ))}

            <View style={styles.divider} />
          </ScrollView>
        </Animated.View>
      </RBSheet>
    </SafeAreaView>
  );
};
export default MealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.white,
  },
  card: {
    marginVertical: verticalScale(5),
    borderRadius: scale(16),
    backgroundColor: Color.white,
  },
  cardHeader: {
    padding: scale(10),
    backgroundColor: Color.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: scale(8),
    borderRadius: scale(8),
  },
  mealType: {
    color: Color.primaryColor,
    fontSize: scale(16),
    fontFamily: Font.PoppinsMedium,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.white,
    marginTop: verticalScale(4),
    padding: scale(4),
    borderRadius: scale(6),
    width: 100,
  },
  timeText: {
    marginLeft: scale(6),
    color: Color.textColor,
    fontSize: scale(12),
    fontFamily: Font.Poppins,
    marginTop: 2,
  },
  detailsContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(5),
    backgroundColor: Color.white,
    borderBottomLeftRadius: scale(16),
    borderBottomRightRadius: scale(16),
    marginTop: verticalScale(5),
    borderColor: Color.primaryColor,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    marginHorizontal: scale(5),
  },
  detailItem: {
    paddingVertical: verticalScale(2),
  },
  detailText: {
    color: Color.textColor,
    fontSize: scale(14),
    fontFamily: Font.Poppins,
  },
  noItemsText: {
    color: Color.txt,
    fontSize: scale(14),
    fontFamily: Font.Poppins,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(12),
    alignSelf: 'flex-end',
  },
  infoText: {
    color: Color.primaryColor,
    fontWeight: '600',
    marginLeft: scale(6),
    fontSize: scale(12),
    fontFamily: Font.Poppins,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(16),
  },
  textContainer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  title: {
    fontSize: scale(20),
    fontFamily: Font.PoppinsMedium,
    color: Color.textColor,
  },
  description: {
    marginVertical: verticalScale(12),
    textAlign: 'center',
    fontSize: scale(14),
    color: Color.txt,
    lineHeight: verticalScale(22),
    fontFamily: Font.Poppins,
  },
  daysScrollContainer: {
    marginVertical: verticalScale(12),
  },
  daysScrollContent: {
    paddingHorizontal: scale(16),
  },
  dayContainer: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    marginRight: scale(8),
    borderRadius: scale(12),
    backgroundColor: Color.white,
  },
  dayContainerSelected: {
    borderBottomWidth: 3,
    borderBottomColor: Color.primaryColor,
    backgroundColor: Color.primaryLight,
  },
  day: {
    fontSize: scale(14),
    fontFamily: Font.PoppinsMedium,
    color: Color.textColor,
  },
  daySelected: {
    color: Color.primaryColor,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecordsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  noRecordsText: {
    fontSize: scale(16),
    color: Color.txt,
    fontFamily: Font.Poppins,
  },
  flatListContent: {
    paddingBottom: verticalScale(100),
  },
  bottomContainer: {
    backgroundColor: Color.white,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  draggableIcon: {
    backgroundColor: 'red',
    width: scale(40),
    height: verticalScale(4),
  },
  bottomHeaderContainer: {
    backgroundColor: Color.primaryColor,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  headerText: {
    color: Color.white,
    fontSize: scale(16),
    fontFamily: Font.PoppinsMedium,
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: verticalScale(4),
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  listItemBoxLeft: {
    padding: scale(12),
    backgroundColor: Color.primaryLight,
    width: '48%',
  },
  listItemBoxRight: {
    padding: scale(12),
    backgroundColor: Color.white,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listItemText: {
    color: Color.textColor,
    fontSize: scale(12),
    fontFamily: Font.PoppinsMedium,
  },
  divider: {
    width: scale(60),
    backgroundColor: Color.primaryColor,
    height: verticalScale(3),
    alignSelf: 'center',
    marginVertical: verticalScale(12),
  },
  recipesText: {
    textAlign: 'center',
    fontSize: scale(14),
    color: Color.textColor,
    fontFamily: Font.PoppinsMedium,
  },
  recipeContainer: {
    backgroundColor: '#F5F7FA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(12),
    borderRadius: scale(12),
    marginTop: verticalScale(12),
  },
  recipeTitle: {
    color: Color.textColor,
    fontSize: scale(14),
    fontFamily: Font.PoppinsMedium,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  recipeCount: {
    marginLeft: scale(6),
    color: Color.textColor,
    fontSize: scale(12),
    fontFamily: Font.Poppins,
  },
});
