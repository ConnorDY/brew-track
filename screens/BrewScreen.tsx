import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { Container, Content, Fab, Icon, Text } from 'native-base';
import React, { FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';

import { BrewsParamList } from '../types';

type SCREEN = 'BrewScreen';

type BrewScreenProps = {
  navigation: StackNavigationProp<BrewsParamList, SCREEN>;
  route: RouteProp<BrewsParamList, SCREEN>;
};

const BrewScreen: FunctionComponent<BrewScreenProps> = ({ route }) => {
  const { uuid } = route.params;

  return (
    <Container>
      <Content>
        <Text>{uuid}</Text>
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
