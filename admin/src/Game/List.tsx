import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  ArrayField,
} from "react-admin";

export const GameList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <NumberField source="currentPlayer" label="Curent id player" />
      <ArrayField source="players">
        <Datagrid>
          <NumberField source="playerNumber" label="Id player" />
          <NumberField source="marblesWon.length" label="Marbles won" />
        </Datagrid>
      </ArrayField>
      <BooleanField source="hasWinner" />
      <BooleanField source="started" />
    </Datagrid>
  </List>
);
