import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER: 'ascend:user',
  SCORES: 'ascend:scores',
  ONBOARDED: 'ascend:onboarded',
};

export async function saveUser(data: object): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(data));
}

export async function loadUser(): Promise<object | null> {
  const raw = await AsyncStorage.getItem(KEYS.USER);
  return raw ? JSON.parse(raw) : null;
}

export async function saveScores(data: object[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.SCORES, JSON.stringify(data));
}

export async function loadScores(): Promise<object[]> {
  const raw = await AsyncStorage.getItem(KEYS.SCORES);
  return raw ? JSON.parse(raw) : [];
}

export async function markOnboarded(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDED, '1');
}

export async function isOnboarded(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.ONBOARDED);
  return val === '1';
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
