import Brew from './brew';

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Brews: undefined;
  TabTwo: undefined;
};

export type BrewsParamList = {
  BrewsScreen: undefined;
  BrewScreen: { brew: Brew; updateBrew: (newBrew: Brew) => void };
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};
