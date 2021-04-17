import React, { FunctionComponent, useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import {
  Body,
  Button,
  Container,
  Content,
  Form,
  Icon,
  Input,
  Item,
  Label,
  List,
  ListItem,
  Right,
  Text,
  Thumbnail,
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useInjection } from '../ioc';
import { BrewService } from '../services';
import { formatDate } from '../utils';
import Brew from '../types/brew';
import { BrewsParamList } from '../types/screens';
import { cornerButton } from '../constants/Styles';

type Screen = 'BrewScreen';

type BrewScreenProps = {
  navigation: StackNavigationProp<BrewsParamList, Screen>;
  route: RouteProp<BrewsParamList, Screen>;
};

const BrewScreen: FunctionComponent<BrewScreenProps> = ({
  navigation,
  route,
}) => {
  // destructure route param(s)
  const { id } = route.params;

  // get photos dir
  const photosDir = FileSystem.documentDirectory;

  // inject brew service
  const brewService = useInjection<BrewService>('BrewService');

  // declare state variables
  const [brew, setBrew] = useState<Brew>(route.params.brew);
  const [showCreationDatePicker, setShowCreationDatePicker] = useState(false);

  // destructure brew properties
  const { creation, name, photos, racking } = brew;

  // convert unit timestamp to Date
  const fermentationStartDate = new Date(creation);

  // update brew whenever it changes
  useEffect(() => {
    brewService.updateBrew(id, brew);
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
    brewService.deleteBrew(id);
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

  function addPhoto() {
    navigation.navigate('CameraScreen', {
      addPhoto: (newPhoto) => {
        fieldUpdater('photos')([...brew.photos, newPhoto]);
      },
    });
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

          {/* Racking Date(s) */}
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

          {/* Photos */}
          <Item fixedLabel style={styles.nonStandardFormItem}>
            <Label>Photos</Label>
          </Item>

          <Item style={styles.nonStandardFormItem}>
            {photos.map((photo) => (
              <Thumbnail
                square
                large
                source={{ uri: `${photosDir}${photo}` }}
                key={photo}
              />
            ))}
          </Item>

          <Item style={styles.nonStandardFormItem}>
            <Button onPress={addPhoto}>
              <Text>Add Photo</Text>
            </Button>
          </Item>
        </Form>
      </Content>

      <Button
        danger
        rounded
        style={styles.cornerButton}
        onPress={() =>
          Alert.alert(
            'Are you sure?',
            'This action cannot be undone.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete Brew',
                onPress: deleteBrew,
              },
            ],
            { cancelable: true }
          )
        }
      >
        <Icon name="trash" type="Entypo" style={{ color: 'white' }} />
      </Button>
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
        <Button icon danger transparent onPress={onDelete}>
          <Icon name="trash" type="Entypo" />
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
  cornerButton,
});
