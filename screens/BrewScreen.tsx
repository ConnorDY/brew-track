import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Container, Content, Fab, Form, Icon, Input, Item } from 'native-base';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { useInjection } from '../ioc';
import { BrewService } from '../services';
import Brew from '../types/brew';
import { BrewsParamList } from '../types/screens';

type Screen = 'BrewScreen';

type BrewScreenProps = {
  navigation: StackNavigationProp<BrewsParamList, Screen>;
  route: RouteProp<BrewsParamList, Screen>;
};

const BrewScreen: FunctionComponent<BrewScreenProps> = ({ route }) => {
  const { uuid } = route.params;

  const brewService = useInjection<BrewService>('BrewService');

  const [brew, setBrew] = useState<Brew>(route.params.brew);

  const { name } = brew;

  function fieldUpdater(fieldName: keyof Brew): (newValue: string) => void {
    return (newValue) => {
      setBrew({ ...brew, [fieldName]: newValue });
    };
  }

  // update brew
  useEffect(() => {
    brewService.updateBrew(uuid, brew);
  }, [brew]);

  return (
    <Container>
      <Content>
        <Form>
          <Item>
            <Input
              placeholder="Brew name or title"
              value={name}
              onChangeText={fieldUpdater('name')}
            />
          </Item>
        </Form>
      </Content>

      <Fab position="bottomRight">
        <Icon name="trash" type="Entypo" />
      </Fab>
    </Container>
  );
};

export default BrewScreen;

const styles = StyleSheet.create({
  //
});
