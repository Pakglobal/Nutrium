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
  const [openItemId, setOpenItemId] = useState(null);
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
      }
    } catch (error) {
      console.error('Error fetching meal plan:', error);
    } finally {
      setLoading(false);
    }
  };

  // const getMealsForSelectedDays = () => {
  //   if (!mealPlan || !selectedDays) return [];

  //   const selectedTemplate = mealPlan.find(template =>
  //     selectedDays.some(day => template?.days?.includes(day)),
  //   );

  //   return selectedTemplate?.mealSchedule || [];
  // };

  // console.log('mealPlan', mealPlan[0]?.mealSchedule)

  const getMealsForSelectedDays = () => {
    if (!mealPlan || !selectedDays || !Array.isArray(mealPlan)) return [];

    // Handle both string ("Everyday") and array (["Monday", "Tuesday"]) day formats
    const selectedTemplate = mealPlan.find(template => {
      const templateDays = template?.days;

      // If days is "Everyday", it matches all selected days
      if (templateDays === 'Everyday') return true;

      // Otherwise check if any selected day is in template days array
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
    }
  };

  // const isDaySelected = (templateDays) => {
  //   if (!Array.isArray(selectedDays)) return false;
  //   if (!Array.isArray(templateDays)) return false;
  //   return JSON.stringify(selectedDays) === JSON.stringify(templateDays);
  // };

  const isDaySelected = templateDays => {
    if (!Array.isArray(selectedDays)) return false;
    if (templateDays === 'Everyday') return true;
    if (!Array.isArray(templateDays)) return false;
    return JSON.stringify(selectedDays) === JSON.stringify(templateDays);
  };
  // const renderMealItem = ({ item, index }) => {
  //   const hasMealWithDisplayName = item?.meal?.some(
  //     meal => meal?.displayName,
  //   );

  //   if (!hasMealWithDisplayName) {
  //     return null;
  //   }

  //   return (
  //     <View style={styles.card}>
  //       <View style={styles.cardHeader}>
  //         <View>
  //           <Text style={styles.mealType}>
  //             {item?.mealType || 'Meal'}
  //           </Text>
  //           <View style={styles.timeContainer}>
  //             <AntDesign
  //               name="clockcircleo"
  //               color={Color.black}
  //               size={scale(16)}
  //             />
  //             <Text style={styles.timeText}>
  //               {item?.time || 'No time specified'}
  //             </Text>
  //           </View>
  //         </View>
  //         <TouchableOpacity onPress={() => toggleItem(index)}>
  //           <AntDesign
  //             name={openItemId === index ? 'up' : 'down'}
  //             size={verticalScale(12)}
  //             color={Color.gray}
  //           />
  //         </TouchableOpacity>
  //       </View>
  //       {openItemId === index && (
  //         <View style={styles.detailsContainer}>
  //           {item?.meal && Array.isArray(item.meal) && (
  //             <FlatList
  //               keyExtractor={(mealItem, mealIndex) => `meal-item-${mealIndex}`}
  //               data={item.meal.filter(meal => meal?.displayName)}
  //               renderItem={({ item: mealItem }) => (
  //                 <View style={styles.detailItem}>
  //                   <Text style={styles.detailText}>
  //                     {mealItem?.displayName}
  //                   </Text>
  //                 </View>
  //               )}
  //             />
  //           )}
  //           <TouchableOpacity
  //             style={styles.infoContainer}
  //             onPress={() => handleOpenBottomSheet(item)}>
  //             <AntDesign
  //               name="infocirlce"
  //               size={verticalScale(12)}
  //               color={Color.secondary}
  //             />
  //             <Text style={styles.infoText}>Nutritional info</Text>
  //           </TouchableOpacity>
  //         </View>
  //       )}
  //     </View>
  //   );
  // };

  const toggleItem = id => {
    setOpenItemId(openItemId === id ? null : id);
  };

  const renderMealItem = ({item, index}) => {
    // Check if there are any meal items in any of the possible properties
    const hasMealItems =
      (item.meal && item.meal.length > 0) ||
      (item.Appetizer && item.Appetizer.length > 0) ||
      (item.Beverage && item.Beverage.length > 0) ||
      (item.Dessert && item.Dessert.length > 0) ||
      (item.Dish && item.Dish.length > 0);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.mealType}>{item?.mealType || 'Meal'}</Text>
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
          {/* <TouchableOpacity onPress={() => toggleItem(index)}>
            <AntDesign
              name={openItemId === index ? 'up' : 'down'}
              size={verticalScale(12)}
              color={Color.gray}
            />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => toggleItem(index)}>
            <AntDesign
              name={openItemId === index ? 'up' : 'down'}
              size={verticalScale(12)}
              color={Color.gray}
            />
          </TouchableOpacity>
        </View>

        {openItemId === index && (
          <View style={styles.detailsContainer}>
            {/* Show empty state if no meal items */}
            {!hasMealItems ? (
              <Text style={{paddingLeft: 10, color: Color?.black}}>
                No items scheduled for this meal
              </Text>
            ) : (
              <>
                {/* Render meal items from all possible properties */}
                {item.meal?.map((mealItem, i) => (
                  <View key={`meal-${i}`} style={styles.detailItem}>
                    <Text style={styles.detailText}>
                      {mealItem?.displayName}
                    </Text>
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
              </>
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
  };

  const renderEmptyState = () => (
    <View style={[styles.contentContainer, {justifyContent: 'center'}]}>
      <View style={{alignItems: 'center'}}>
        <Cook height={scale(120)} width={scale(120)} />
      </View>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header logoHeader={true} />

      {mealPlan?.length > 0 && (
        <View style={styles.daysScrollContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScrollContent}>
            {/* {mealPlan.map((template, index) => (
              <TouchableOpacity
                key={`day-${index}`}
                onPress={() => handleSelectDay(template)}
                style={[
                  styles.dayContainer,
                  {
                    borderBottomWidth: isDaySelected(template?.days) ? 2 : 0,
                  },
                ]}>
                <Text
                  style={[
                    styles.day,
                    {
                      color: isDaySelected(template?.days)
                        ? Color.primaryColor
                        : Color.black,
                    },
                  ]}>
                  {formatDays(template?.days)}
                </Text>
              </TouchableOpacity>
            ))} */}
            {mealPlan.map((template, index) => {
              const daysText =
                template.days === 'Everyday'
                  ? 'Everyday'
                  : formatDays(template.days);

              const isSelected =
                template.days === 'Everyday' || isDaySelected(template.days);

              return (
                <TouchableOpacity
                  key={`day-${index}`}
                  onPress={() => handleSelectDay(template)}
                  style={[
                    styles.dayContainer,
                    {borderBottomWidth: isSelected ? 2 : 0},
                  ]}>
                  <Text
                    style={[
                      styles.day,
                      {color: isSelected ? Color.primaryColor : Color.black},
                    ]}>
                    {daysText}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color.primaryColor} />
        </View>
      ) : mealPlan?.length > 0 ? (
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          {getMealsForSelectedDays()?.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => `meal-${index}`}
              data={getMealsForSelectedDays()}
              renderItem={renderMealItem}
            />
          ) : (
            <View style={styles.noRecordsContainer}>
              <Text style={styles.noRecordsText}>
                There are no records of meal plan
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        renderEmptyState()
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
              keyExtractor={item => `bottomSheet-${item.id}`}
              data={bottomSheetData}
              renderItem={({item}) => (
                <View style={styles.listItemContainer}>
                  <View style={styles.listItemBoxLeft}>
                    <Text style={styles.listItemText}>{item.title}</Text>
                  </View>
                  <View style={styles.listItemBoxRight}>
                    <Text style={styles.listItemText}>{item.value}</Text>
                  </View>
                </View>
              )}
            />

            <View style={styles.divider}></View>
            <Text style={styles.recipesText}>Recipes</Text>

            <View style={styles.recipeContainer}>
              <View>
                <Text style={{color: Color?.black}}>Keto 90....</Text>
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
    backgroundColor: Color.white,
  },
  contentContainer: {
    marginHorizontal: scale(16),
    flex: 1,
    // justifyContent: 'center',
    // alignSelf:'center'
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
    backgroundColor: Color.white,
    // width:'100%'
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
    backgroundColor: Color.white,
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
    backgroundColor: Color.white,
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
    borderBottomColor: Color.primaryColor,
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
    backgroundColor: Color.primaryColor,
    paddingVertical: verticalScale(15),
    justifyContent: 'center',
  },
  headerText: {
    color: Color.white,
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
    backgroundColor: Color.white,
    width: '49%',
  },
  listItemText: {
    color: Color.black,
    fontSize: scale(11),
  },
  divider: {
    width: scale(50),
    backgroundColor: Color.primaryColor,
    height: verticalScale(2),
    alignSelf: 'center',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(8),
  },
  recipesText: {
    textAlign: 'center',
    fontSize: scale(12),
    color: Color?.black,
  },
  recipeContainer: {
    backgroundColor: Color.white,
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
