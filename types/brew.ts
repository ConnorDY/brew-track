export default interface Brew {
  // brew name
  name: string;
  // fermentation start date (unix timestamp)
  creation: number;
  // racking dates (unix timestamps)
  racking: number[];
}

export const BREWS_KEY = '@brews';

export type BrewsMap = Map<string, Brew>;
