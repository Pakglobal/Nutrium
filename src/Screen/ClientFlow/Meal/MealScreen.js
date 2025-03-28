import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FetchMealPlanApi} from '../../../Apis/ClientApis/MealApi';
import Header from '../../../Components/Header';
import {scale, verticalScale} from 'react-native-size-matters';
import Color from '../../../assets/colors/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useSelector} from 'react-redux';
import Cook from '../../../assets/Images/cooking.svg';

const MealScreen = () => {
  const [mealPlan, setMealPlan] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [open, setOpen] = useState(false);
  const bottomSheetRef = useRef(null);
  
const isGuest = useSelector(state => state.user?.guestMode);

  const tokenId = useSelector(state => state?.user?.token);
  const id = tokenId?.id;

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
        setLoading(false);
      } else {
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meal plan:', error);
      setLoading(false);
    }
  };

  const getMealsForSelectedDays = () => {
    // const selectedTemplate = mealPlan?.find(template =>
    //   selectedDays?.some(day => template?.days?.includes(day)),
    // );

    const selectedTemplate = mealPlan?.days;
    return selectedTemplate ? selectedTemplate?.mealSchedule || [] : [];
  };

  const handleOpen = id => {
    setOpen(open === id ? null : id);
  };

  const handleOpenBottomSheet = item => {
    setSelectedMeal(item);
    bottomSheetRef.current?.open();
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

  const bottomSheetData = [
    {
      id: 0,
      title: 'Energy',
      value: '902 kcal',
    },
    {
      id: 1,
      title: 'Proteins',
      value: '32 g',
    },
    {
      id: 2,
      title: 'Carbohydrates',
      value: '18 g',
    },
    {
      id: 3,
      title: 'Fats',
      value: '82 g',
    },
  ];

  const handleSelectDay = template => {
    if (template?.days) {
      setSelectedDays(template.days);
      setOpen(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showIcon={true} headerText="Meal plan" />

      {mealPlan && mealPlan?.length > 0 && (
        <View
          style={{
            backgroundColor: Color.common,
          }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{paddingVertical: verticalScale(10)}}
            contentContainerStyle={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              minWidth: '100%',
            }}>
            {mealPlan.map((template, index) => (
              <TouchableOpacity
                key={`day-${index}`}
                onPress={() => handleSelectDay(template)}
                style={[
                  styles.dayContainer,
                  {
                    borderBottomWidth:
                      Array.isArray(selectedDays) &&
                      Array.isArray(template?.days) &&
                      JSON.stringify(selectedDays) ===
                        JSON.stringify(template.days)
                        ? 2
                        : 0,
                  },
                ]}>
                <Text
                  style={[
                    styles.day,
                    {
                      color:
                        Array.isArray(selectedDays) &&
                        Array.isArray(template?.days) &&
                        JSON.stringify(selectedDays) ===
                          JSON.stringify(template.days)
                          ? Color.primaryGreen
                          : Color.black,
                    },
                  ]}>
                  {formatDays(template?.days)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color={Color.primaryGreen} />
        </View>
      ) : mealPlan ? (
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          {getMealsForSelectedDays()?.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => `meal-${index}`}
              data={getMealsForSelectedDays()}
              renderItem={({item, index}) => {
                const hasMealWithDisplayName = item?.meal?.some(
                  meal => meal?.displayName,
                );

                if (!hasMealWithDisplayName) {
                  return null;
                }

                return (
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.mealType}>
                          {item?.mealType || 'Meal'}
                        </Text>
                        <View style={styles.timeContainer}>
                          <AntDesign
                            name="clockcircleo"
                            color={Color.black}
                            size={scale(16)}
                          />
                          <Text style={styles.timeText}>
                            {item?.time || 'No time specified'}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => handleOpen(index)}>
                        <AntDesign
                          name={open === index ? 'up' : 'down'}
                          size={verticalScale(12)}
                          color={Color.gray}
                        />
                      </TouchableOpacity>
                    </View>
                    {open === index && (
                      <View style={styles.detailsContainer}>
                        {item?.meal && Array.isArray(item.meal) && (
                          <FlatList
                            keyExtractor={(mealItem, mealIndex) =>
                              `meal-item-${mealIndex}`
                            }
                            data={item.meal.filter(meal => meal?.displayName)}
                            renderItem={({item: mealItem}) => (
                              <View style={styles.detailItem}>
                                <Text style={styles.detailText}>
                                  {mealItem?.displayName}
                                </Text>
                              </View>
                            )}
                          />
                        )}
                        <TouchableOpacity
                          style={styles.infoContainer}
                          onPress={() => handleOpenBottomSheet(item)}>
                          <AntDesign
                            name="infocirlce"
                            size={verticalScale(12)}
                            color={Color.secondary}
                          />
                          <Text style={styles.infoText}>Nutritional info</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              }}
            />
          ) : (
            <View style={{padding: verticalScale(16)}}>
              <Text style={{textAlign: 'center'}}>
                There are no records of meal plan
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.contentContainer}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-around',
              marginTop: verticalScale(80),
              marginBottom: verticalScale(30),
              height: scale(160),
              width: scale(160),
              backgroundColor: 'rgba(232,150,106,0.3)',
              alignSelf: 'center',
              borderRadius: scale(150),
            }}>
            <Cook height={scale(120)} width={scale(120)} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Cooking up your meal plan...</Text>
            <Text style={styles.description}>
              This is where you'll find your new meal plan once it's ready.
            </Text>
            <Text style={styles.description}>
              Your professional can create a meal plan for you during your
              appointment. If you've already had an appointment, your
              professional might be taking a bit to wrap up some details.
            </Text>
          </View>
        </View>
      )}

      <RBSheet
        ref={bottomSheetRef}
        closeOnPressMask={true}
        closeOnPressBack={true}
        height={500}
        customStyles={{
          wrapper: styles.wrapper,
          draggableIcon: styles.draggableIcon,
        }}>
        <View style={styles.bottomContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              {selectedMeal?.mealType || 'Meal'}
            </Text>
            <Text style={styles.headerText}>
              {selectedMeal?.time || 'No time specified'}
            </Text>
          </View>

          <View style={styles.bottomContentContainer}>
            <FlatList
              keyExtractor={(item, index) => `bottomSheet-${index}`}
              data={bottomSheetData}
              renderItem={({item}) => (
                <View style={styles.listItemContainer}>
                  <View style={styles.listItemBoxLeft}>
                    <Text style={styles.listItemText}>{item?.title}</Text>
                  </View>
                  <View style={styles.listItemBoxRight}>
                    <Text style={styles.listItemText}>{item?.value}</Text>
                  </View>
                </View>
              )}
            />

            <View style={styles.divider}></View>
            <Text style={styles.recipesText}>Recipes</Text>

            <View style={styles.recipeContainer}>
              <View>
                <Text>Keto 90....</Text>
                <View style={styles.recipeRow}>
                  <AntDesign name="tool" color={Color.black} size={scale(14)} />
                  <Text>1</Text>
                </View>
              </View>
              <AntDesign name="right" color={Color.black} size={scale(14)} />
            </View>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default MealScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  contentContainer: {
    marginHorizontal: scale(16),
  },
  bottomContentContainer: {
    marginHorizontal: scale(16),
    marginVertical: verticalScale(5),
  },
  card: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: scale(10),
    backgroundColor: Color.primary,
  },
  cardHeader: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(10),
    backgroundColor: Color.common,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: scale(10),
  },
  mealType: {
    color: Color.black,
    fontSize: scale(14),
    fontWeight: '500',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.primary,
    marginTop: verticalScale(5),
    padding: scale(5),
    borderRadius: scale(10),
  },
  timeText: {
    marginLeft: scale(8),
    color: Color.black,
  },
  detailsContainer: {
    borderRadius: scale(10),
    backgroundColor: Color.primary,
    paddingVertical: scale(20),
  },
  detailItem: {
    paddingHorizontal: scale(10),
  },
  detailText: {
    paddingVertical: verticalScale(5),
    color: Color.black,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(16),
    marginTop: verticalScale(15),
    alignSelf: 'flex-end',
  },
  infoText: {
    color: Color.secondary,
    fontWeight: '600',
    marginStart: scale(5),
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: scale(18),
    fontWeight: '700',
    color: Color.black,
  },
  description: {
    marginVertical: verticalScale(20),
    textAlign: 'center',
    fontSize: scale(14),
    fontWeight: '500',
    color: Color.gray,
  },
  noDetailText: {
    color: Color.gray,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(5),
  },
  dayContainer: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(30),
    borderBottomColor: Color.primaryGreen,
  },
  day: {
    fontSize: scale(13),
    fontWeight: '500',
    color: '#000',
  },
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  draggableIcon: {
    backgroundColor: 'transparent',
  },
  bottomContainer: {
    backgroundColor: Color.common,
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Color.primaryGreen,
    paddingVertical: verticalScale(15),
    justifyContent: 'center',
  },
  headerText: {
    color: Color.primary,
    marginHorizontal: scale(16),
    fontWeight: '500',
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(5),
    justifyContent: 'space-between',
  },
  listItemBoxLeft: {
    padding: scale(10),
    backgroundColor: '#EEE',
    width: '49%',
  },
  listItemBoxRight: {
    padding: scale(10),
    backgroundColor: Color.primary,
    width: '49%',
  },
  listItemText: {
    color: Color.black,
    fontSize: scale(11),
  },
  divider: {
    width: scale(50),
    backgroundColor: Color.primaryGreen,
    height: verticalScale(2),
    alignSelf: 'center',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(8),
  },
  recipesText: {
    textAlign: 'center',
    fontSize: scale(12),
  },
  recipeContainer: {
    backgroundColor: Color.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderRadius: scale(6),
    paddingHorizontal: scale(8),
    marginTop: verticalScale(15),
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
