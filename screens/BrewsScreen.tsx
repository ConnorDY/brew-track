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
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { v4 as uuid } from 'uuid';

interface Brew {
  uuid: string;
  name: string;
  creation: number; // unix timestamp
}

const DAY_SECONDS = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

export default function BrewsScreen() {
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

  const now = new Date().getTime();

  return (
    <Container>
      <Content>
        <List>
          {brews.map(({ uuid, name, creation }) => (
            <ListItem button key={uuid}>
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
}

const styles = StyleSheet.create({
  //
});
