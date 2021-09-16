import { useRecordContext } from "react-admin";

export const Board = (props: any) => {
  const record = useRecordContext(props);
  const board = record.board;

  let rows = [];
  for (let y = 0; y < board.length; y++) {
    const cells = [];
    for (let x = 0; x < board[0].length; x++) {
      cells.push(<Cell value={board[x][y]} />);
    }
    rows.push(<tr>{cells}</tr>);
  }
  return (
    <div>
      <h3>Board</h3>
      <table>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export const Cell = (props: any) => {
  return (
    <td
      style={{
        width: "3em",
        height: "3em",
        border: "2px solid #ddd",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "3rem", color: getMarbleColor(props.value) }}>
        &#x2022;
      </span>
    </td>
  );
};

const getMarbleColor = (value: number): string => {
  const marbleColor = ["white", "red", "blue", "grey"];
  return marbleColor[value];
};
