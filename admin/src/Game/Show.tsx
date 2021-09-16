import { Grid, Typography } from "@material-ui/core";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ArrayField,
  NumberField,
  Datagrid,
} from "react-admin";
import { Board } from "./Board";

export const GameShow = (props: any) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <Grid container spacing={2}>
          <Grid item>
            <Board />
          </Grid>
          <Grid item>
            <Grid
              container
              direction="column"
              style={{ paddingBottom: "20px" }}
            >
              <Typography variant="caption">Curent player: </Typography>
              <TextField source="currentPlayer" />
            </Grid>
            <Grid
              container
              direction="column"
              style={{ paddingBottom: "20px" }}
            >
              <Typography variant="caption">Has a winner:</Typography>
              <TextField source="hasWinner" />
            </Grid>
            <Grid
              container
              direction="column"
              style={{ paddingBottom: "20px" }}
            >
              <Typography variant="caption">Last marble cliked:</Typography>
              <TextField source="marbleClicked" />
            </Grid>
            <Grid
              container
              direction="column"
              style={{ paddingBottom: "20px" }}
            >
              <ArrayField source="players">
                <Datagrid>
                  <NumberField source="playerNumber" label="Id player" />
                  <NumberField source="marblesWon.length" label="Marbles won" />
                  <NumberField source="marbleColor" label="Marbles Color" />
                </Datagrid>
              </ArrayField>
            </Grid>
          </Grid>
        </Grid>
      </SimpleShowLayout>
    </Show>
  );
};
