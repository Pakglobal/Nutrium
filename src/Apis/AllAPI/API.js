export const BASE_URL = `https://nutrium-back-end-1.onrender.com/api/v1/`;

//Login Flow
export const LOGIN = `${BASE_URL}sign_in`;
export const GOOGLE_LOGIN = `${BASE_URL}verify-google`;
export const GUEST_LOGIN = `${BASE_URL}demo-auth`;
export const FORGOT_PASSWORD = `${BASE_URL}forget-password`;

// admin flow
export const GET_APPOINTMENT_DATA = `${BASE_URL}scheduleApointment`;
export const GET_ALL_CLIENT_DATA = `${BASE_URL}client`;
export const GET_CLIENT_DATA = `${BASE_URL}client`;
export const GET_PROFILE_DATA = `${BASE_URL}professionals`;

// client flow

//CHALLENGE FLOW
export const GET_ALL_CHALLENGE = `${BASE_URL}challenge/public`;
export const GET_CHALLENGE_DATA_WITHID = `${BASE_URL}challenge/accepted-challenges`;
export const GET_CHALLENGE_PENDING_REQUEST = `${BASE_URL}challenge/private`;
export const CHALLENGE_ACCEPT_REJECT = `${BASE_URL}challenge/respond`;
export const LEADERBOARD_DATA = `${BASE_URL}leaderboard`;
export const JOIN_PUBLIC_CHALLENGE = `${BASE_URL}challenge/public/join`;
export const CREATE_CHALLENGE = `${BASE_URL}challenge/create`;
export const GET_CHALLENGE_TYPE = `${BASE_URL}challenge-master`;
export const GET_CHALLENGE_RANGE = `${BASE_URL}challenge-master/reward-ranges-dropdown`;
export const GET_ALL_USER = `${BASE_URL}clients`;

// APPOINTMENT
export const GET_APPOINTMENT = `${BASE_URL}getAppointmentsByClientId`;
export const UPDATE_APPOINTMENT = `${BASE_URL}updateAppointmentStatus`;

// FOOD DIARY
export const GET_FOOD_DIARY = `${BASE_URL}food-diary/12123`;
export const ADD_MEAL_IN_FOOD = `${BASE_URL}food-diary-add-meal/12123`;
export const SEARCH_FOOD = `${BASE_URL}search-foods`;
export const DELETE_MEAL_IN_FOOD = `${BASE_URL}food-diary/12123/delete-meal-schedule`;
export const DELETE_SPECIFIC_MEAL_IN_FOOD = `${BASE_URL}food-diary/12123/delete-food`;

// MEAL
export const GET_MEAL_PLAN = `${BASE_URL}meal-plan`;

// measurements
export const GET_MEASUREMENT_DATA = `${BASE_URL}client/measurements`;

// PHYSICALACTIVITY
export const SET_PHYSICAL_ACTIVITY_DETAILS = `${BASE_URL}clientSidePhysicalActivity`;
export const GET_PHYSICAL_ACTIVITY_DETAILS = `${BASE_URL}client-physical-activity`;
export const DELETE_PHYSICAL_ACTIVITY = `${BASE_URL}delete-physical-activity`;
export const UPDATE_PHYSICAL_ACTIVITY = `${BASE_URL}update-physical-activity`;
export const GET_PHYSICAL_ACTIVITY_LIST = `${BASE_URL}activities`;
export const GET_QUICK_ACCESS_DATA = `${BASE_URL}get-quick-access-activity`;
export const SET_QUICK_ACCESS_DATA = `${BASE_URL}recommendations`;

// CLIENT PROFILE
export const GET_USER = `${BASE_URL}getUser`;
export const UPDATE_PROFILE_IMAGE = `${BASE_URL}client`;
export const GET_PROFILE_IMAGE = `${BASE_URL}client`;

// RECOMMENDATION
export const GET_RECOMMENDATION_DATA = `${BASE_URL}get-other-recommendation`;
export const GET_FOOD_AVOID_DATA = `${BASE_URL}get-food-avoid`;
export const GET_GOALS = `${BASE_URL}client/allGoals`;

// WATER INTAKE
export const GET_WATER_INTAKE_DETAILS = `${BASE_URL}getWaterIntake`;
export const SET_WATER_INTAKE_DETAILS = `${BASE_URL}setwaterintake`;
export const DELETE_WATER_INTAKE = `${BASE_URL}deletewaterintake`;
export const UPDATE_WATER_INTAKE = `${BASE_URL}updatewaterintake`;
export const GET_WATER_INTAKE_LIMIT = `${BASE_URL}getWaterIntakeLimit`;
