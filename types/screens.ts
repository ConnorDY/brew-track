import Brew from './brew';

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Brews: undefined;
  Ingredients: undefined;
};

export type BrewsParamList = {
  BrewsScreen: undefined;
  BrewScreen: { id: string; brew: Brew };
  CameraScreen: { brewId: string; addPhoto: (newPhoto: string) => void };
};

export type IngredientsParamList = {
  IngredientsScreen: undefined;
};
