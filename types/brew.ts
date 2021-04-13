export default interface Brew {
  name: string;
  creation: number; // unix timestamp
}

export const BREWS_KEY = '@brews';

export type BrewsMap = Map<string, Brew>;
