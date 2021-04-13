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

import { BrewsParamList } from '../types/screens';

interface Brew {
  uuid: string;
  name: string;
  creation: number; // unix timestamp
}

const DAY_SECONDS = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

const BREWS_KEY = '@brews';

type BrewsScreenProps = {
  navigation: StackNavigationProp<BrewsParamList, 'BrewsScreen'>;
};

const BrewsScreen: FunctionComponent<BrewsScreenProps> = ({ navigation }) => {
  const debug = true;

  const [brews, setBrews] = useState<Brew[]>([]);

  function createBrew() {
    const _brews = [...brews];

    _brews.push({
      uuid: uuid(),
      name: 'New Brew',
      creation: new Date().getTime(),
    });

    setBrews(_brews);
  }

  function clearBrews() {
    setBrews([]);
  }

  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(BREWS_KEY);
      if (json) {
        const _brews = JSON.parse(json);
        setBrews(_brews);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await AsyncStorage.setItem(BREWS_KEY, JSON.stringify(brews));
    })();
  }, [brews]);

  const now = new Date().getTime();

  return (
    <Container>
      <Content>
        <List>
          {brews.map(({ uuid, name, creation }) => (
            <ListItem
              button
              onPress={() => navigation.navigate('BrewScreen', { uuid })}
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
          ))}
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
