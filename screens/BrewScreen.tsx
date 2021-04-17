import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Container,
  Content,
  Fab,
  Form,
  Icon,
  Input,
  Item,
  Text,
} from 'native-base';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useInjection } from '../ioc';
import { BrewService } from '../services';
import { formatDate } from '../utils';
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
  const [showCreationDatePicker, setShowCreationDatePicker] = useState(false);

  function fieldUpdater<T>(fieldName: keyof Brew): (newValue: T) => void {
    return (newValue) => {
      setBrew({
        ...brew,
        [fieldName]: newValue,
      });
    };
  }

  // update brew
  useEffect(() => {
    brewService.updateBrew(uuid, brew);
  }, [brew]);

  const { creation, name } = brew;

  const fermentationStartDate = new Date(creation);

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

          <Item>
            <Text>Fermenation Start Date: </Text>

            <Button onPress={() => setShowCreationDatePicker(true)}>
              <Text>{formatDate(fermentationStartDate)}</Text>
            </Button>

            {showCreationDatePicker && (
              <DateTimePicker
                value={fermentationStartDate}
                onChange={(e, date) => {
                  setShowCreationDatePicker(false);
                  if (date) fieldUpdater('creation')(date.getTime());
                }}
              />
            )}
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
