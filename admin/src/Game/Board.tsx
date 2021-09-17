import { useRecordContext } from "react-admin";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
} from "@material-ui/core";

export const Board = (props: any) => {
  const record = useRecordContext(props);
  const board = record.board;

  return (
    <Container>
      <Typography>Board</Typography>
      <Table>
        <TableBody>
          {board.map((row: [], rowIndex: number) => (
            <tr>
              {" "}
              {row.map((cell, cellIndex) => (
                <Cell key={rowIndex + cellIndex} value={cell} />
              ))}{" "}
            </tr>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export const Cell = (props: any) => {
  const marble = '&#x2022;'
  return (
    <TableCell
      style={{
        width: "3em",
        height: "3em",
        border: "2px solid #ddd",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "3rem", color: getMarbleColor(props.value) }} dangerouslySetInnerHTML={{ __html: `${marble}` }} >
      </span>
    </TableCell>
  );
};

const getMarbleColor = (value: number): string => {
  const marbleColor = ["white", "red", "blue", "grey"];
  return marbleColor[value];
};
