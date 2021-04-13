import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Col,
  Container,
  Content,
  Fab,
  Grid,
  Icon,
  List,
  ListItem,
  Text,
} from 'native-base';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { v4 as uuid } from 'uuid';

import Brew, { BrewsMap, BREWS_KEY } from '../types/brew';
import { BrewsParamList } from '../types/screens';

const DAY_SECONDS = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

type Screen = 'BrewsScreen';

type BrewsScreenProps = {
  navigation: StackNavigationProp<BrewsParamList, Screen>;
};

const BrewsScreen: FunctionComponent<BrewsScreenProps> = ({ navigation }) => {
  const debug = true;

  const [brews, setBrews] = useState<BrewsMap>(new Map<string, Brew>());

  // create brew
  function createBrew() {
    const _brews = new Map<string, Brew>(
      brews.set(uuid(), {
        name: 'Untitled Brew',
        creation: new Date().getTime(),
      })
    );

    setBrews(_brews);
    saveBrews(_brews);
  }

  // clear brews
  function clearBrews() {
    const _brews = new Map<string, Brew>();

    setBrews(_brews);
    saveBrews(_brews);
  }

  // save brews
  function saveBrews(brews: BrewsMap) {
    console.info('Saving brews...');

    AsyncStorage.setItem(BREWS_KEY, JSON.stringify(Object.fromEntries(brews)));
  }

  // load brews
  async function loadBrews() {
    console.info('Loading brews...');

    const json = await AsyncStorage.getItem(BREWS_KEY);

    if (json) {
      setBrews(new Map<string, Brew>(Object.entries(JSON.parse(json))));
    }
  }

  // on load
  useEffect(() => {
    loadBrews();

    navigation.addListener('focus', () => {
      loadBrews();
    });
  }, []);

  // brew updater
  function brewUpdater(brewUuid: string) {
    return (newBrew: Brew) => {
      const _brews = brews.set(brewUuid, newBrew);

      console.log('Updating brew.', newBrew);

      saveBrews(_brews);
    };
  }

  const now = new Date().getTime();

  console.log(brews);

  return (
    <Container>
      <Content>
        <List>
          {Array.from(brews).map(([uuid, brew]) => {
            const { name, creation } = brew;

            return (
              <ListItem
                button
                onPress={() =>
                  navigation.navigate('BrewScreen', {
                    brew,
                    updateBrew: brewUpdater(uuid),
                  })
                }
                key={uuid}
              >
                <Grid>
                  <Col>
                    <Text>{name}</Text>
                  </Col>

                  <Col>
                    <Text>
                      {((now - creation) / DAY_SECONDS).toFixed(1)} day(s)
                    </Text>
                  </Col>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Content>

      <Fab position="bottomRight" onPress={createBrew}>
        <Icon name="plus" type="Entypo" />
      </Fab>

      <Fab position="bottomLeft" onPress={clearBrews}>
        <Icon name="trash" type="Entypo" />
      </Fab>
    </Container>
  );
};

export default BrewsScreen;

const styles = StyleSheet.create({
  //
});
