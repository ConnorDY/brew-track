import AsyncStorage from '@react-native-async-storage/async-storage';
import { injectable } from 'inversify';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuid } from 'uuid';

import Brew, { BrewsMap, BREWS_KEY } from '../types/brew';

@injectable()
export default class BrewService {
  private _brews = new Map<string, Brew>();

  private brewsSubject = new BehaviorSubject<BrewsMap>(this._brews);
  public brews = this.brewsSubject.asObservable();

  constructor() {
    this.loadBrews();
  }

  private broadcastBrews = () => {
    const brews = new Map<string, Brew>(this._brews);
    this.brewsSubject.next(brews);
  };

  public loadBrews = async () => {
    console.info('Loading brews...');

    const json = await AsyncStorage.getItem(BREWS_KEY);

    if (json) {
      this._brews = new Map<string, Brew>(Object.entries(JSON.parse(json)));
      this.broadcastBrews();
      console.info('Loaded brews.');
    } else {
      console.info('No brew data to load.');
    }
  };

  public saveBrews = () => {
    console.info('Saving brews...');

    AsyncStorage.setItem(
      BREWS_KEY,
      JSON.stringify(Object.fromEntries(this._brews))
    ).then(() => {
      console.info('Saved brews.');
    });
  };

  public clearBrews = () => {
    this._brews = new Map<string, Brew>();
    this.broadcastBrews();
  };

  public createBrew = () => {
    this._brews.set(uuid(), {
      name: 'Untitled Brew',
      creation: new Date().getTime(),
    });
    this.broadcastBrews();
  };

  public updateBrew = (uuid: string, brew: Brew) => {
    this._brews.set(uuid, brew);
    this.broadcastBrews();
  };
}
