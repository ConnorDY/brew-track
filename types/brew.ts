export default interface Brew {
  // brew name
  name: string;
  // fermentation start date (unix timestamp)
  creation: number;
}

export const BREWS_KEY = '@brews';

export type BrewsMap = Map<string, Brew>;
