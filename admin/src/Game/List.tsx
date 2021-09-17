import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
} from "react-admin";
import { GameUser } from "./User";

export const GameList = (props: any) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <NumberField source="currentPlayer" label="Curent id player" />
      <GameUser />
      <BooleanField source="hasWinner" />
      <BooleanField source="started" />
    </Datagrid>
  </List>
);
