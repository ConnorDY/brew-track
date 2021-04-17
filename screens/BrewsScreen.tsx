import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Col,
  Container,
  Content,
  Grid,
  Icon,
  List,
  ListItem,
  Text,
} from 'native-base';

import { useInjection } from '../ioc';
import { BrewService } from '../services';
import Brew, { BrewsMap } from '../types/brew';
import { BrewsParamList } from '../types/screens';
import { cornerButton } from '../constants/Styles';

const DAY_SECONDS = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

type Screen = 'BrewsScreen';

type BrewsScreenProps = {
  navigation: StackNavigationProp<BrewsParamList, Screen>;
};

const BrewsScreen: FunctionComponent<BrewsScreenProps> = ({ navigation }) => {
  const brewService = useInjection<BrewService>('BrewService');

  const [brews, setBrews] = useState<BrewsMap>(new Map<string, Brew>());

  // on load
  useEffect(() => {
    const brewsSub = brewService.brews.subscribe({
      next: (b) => {
        setBrews(b);
      },
    });

    return () => {
      brewsSub.unsubscribe();
    };
  }, []);

  const now = new Date().getTime();

  return (
    <Container>
      <Content>
        <List>
          {Array.from(brews).map(([id, brew]) => {
            const { name, creation } = brew;

            return (
              <ListItem
                button
                onPress={() =>
                  navigation.navigate('BrewScreen', {
                    id,
                    brew,
                  })
                }
                key={id}
              >
                <Grid>
                  <Col>
                    <Text>{name}</Text>
                  </Col>

                  <Col>
                    <Text>
                      {((now - creation) / DAY_SECONDS).toFixed(0)} day(s)
                    </Text>
                  </Col>
                </Grid>
              </ListItem>
            );
          })}
        </List>
      </Content>

      <Button
        primary
        rounded
        style={styles.cornerButton}
        onPress={brewService.createBrew}
      >
        <Icon name="plus" type="Entypo" style={{ color: 'white' }} />
      </Button>
    </Container>
  );
};

export default BrewsScreen;

const styles = StyleSheet.create({
  cornerButton,
});
