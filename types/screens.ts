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
  BrewScreen: { uuid: string; brew: Brew };
};

export type IngredientsParamList = {
  IngredientsScreen: undefined;
};
