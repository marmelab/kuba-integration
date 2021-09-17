import { Grid, Typography } from "@material-ui/core";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DeleteButton,
  TopToolbar,
} from "react-admin";
import { Board } from "./Board";
import { GameUser } from "./User";

const GameShowActions = ({ basePath, data, resource }: any) => (
  <TopToolbar>
    <DeleteButton basePath={basePath} record={data} />
  </TopToolbar>
);

export const GameShow = (props: any) => {
  return (
    <Show actions={<GameShowActions />} {...props}>
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
              <GameUser />
            </Grid>
          </Grid>
        </Grid>
      </SimpleShowLayout>
    </Show>
  );
};
