import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Body,
  Button,
  Container,
  Content,
  Fab,
  Form,
  Icon,
  Input,
  Item,
  Label,
  List,
  ListItem,
  Right,
  Text,
} from 'native-base';
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

const BrewScreen: FunctionComponent<BrewScreenProps> = ({
  navigation,
  route,
}) => {
  // get brew uuid
  const { uuid } = route.params;

  // inject brew service
  const brewService = useInjection<BrewService>('BrewService');

  // declare state variables
  const [brew, setBrew] = useState<Brew>(route.params.brew);
  const [showCreationDatePicker, setShowCreationDatePicker] = useState(false);

  // destructure brew properties
  const { creation, name, racking } = brew;

  // convert unit timestamp to Date
  const fermentationStartDate = new Date(creation);

  // update brew whenever it changes
  useEffect(() => {
    brewService.updateBrew(uuid, brew);
  }, [brew]);

  // functions
  function fieldUpdater<T>(fieldName: keyof Brew): (newValue: T) => void {
    return (newValue) => {
      if (fieldName === 'name') {
        navigation.setOptions({
          headerTitle: (newValue as unknown) as string,
        });
      }

      setBrew({
        ...brew,
        [fieldName]: newValue,
      });
    };
  }

  function deleteBrew() {
    brewService.deleteBrew(uuid);
    navigation.goBack();
  }

  function addRacking() {
    racking.push(new Date().getTime());
    fieldUpdater('racking')(racking);
  }

  function updateRacking(index: number, newDate: number) {
    racking.splice(index, 1, newDate);
    racking.sort();
    fieldUpdater('racking')(racking);
  }

  function deleteRacking(index: number) {
    racking.splice(index, 1);
    fieldUpdater('racking')(racking);
  }

  return (
    <Container>
      <Content>
        <Form>
          <Item fixedLabel>
            <Label>Brew Name:</Label>
            <Input value={name} onChangeText={fieldUpdater('name')} />
          </Item>

          <Item>
            <Label>Fermenation Start Date:</Label>

            <Button transparent onPress={() => setShowCreationDatePicker(true)}>
              <Text>{formatDate(fermentationStartDate)}</Text>
            </Button>

            {showCreationDatePicker && (
              <DateTimePicker
                value={fermentationStartDate}
                onChange={(e, d) => {
                  setShowCreationDatePicker(false);
                  if (d) fieldUpdater('creation')(d.getTime());
                }}
              />
            )}
          </Item>

          <Item fixedLabel style={styles.nonStandardFormItem}>
            <Label>Racking</Label>
          </Item>

          <List>
            {racking.map((date, index) => (
              <Racking
                index={index}
                date={date}
                onChange={(newDate) => updateRacking(index, newDate)}
                onDelete={() => deleteRacking(index)}
                key={index}
              />
            ))}
          </List>

          <Item style={styles.nonStandardFormItem}>
            <Button onPress={addRacking}>
              <Text>Add Racking Date</Text>
            </Button>
          </Item>
        </Form>
      </Content>

      <Fab position="bottomRight" onPress={deleteBrew}>
        <Icon name="trash" type="Entypo" />
      </Fab>
    </Container>
  );
};

export default BrewScreen;

const Racking = ({
  index,
  date,
  onChange,
  onDelete,
}: {
  index: number;
  date: number;
  onChange: (newDate: number) => void;
  onDelete: () => void;
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const _date = new Date(date);

  return (
    <ListItem icon>
      <Body>
        <Button transparent onPress={() => setShowDatePicker(true)}>
          <Text>
            {index + 1}. {formatDate(_date)}
          </Text>
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={_date}
            onChange={(e, d) => {
              setShowDatePicker(false);
              if (d) onChange(d.getTime());
            }}
          />
        )}
      </Body>

      <Right>
        <Button icon transparent onPress={onDelete}>
          <Icon active name="trash" type="Entypo" />
        </Button>
      </Right>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  nonStandardFormItem: {
    paddingTop: 12,
    paddingBottom: 12,
  },
});
