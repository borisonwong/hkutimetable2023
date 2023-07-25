// @ts-nocheck
interface Props {
  data_in;
  header_in: string[];
  onClick: (item: string) => void;
  showMax: int;
}

function getWidth(item) {
  switch (item) {
    case "Course Code":
      return "w-25";
    case "Course Title":
      return "w-75";
    default:
      return "";
  }
}

const Table = ({ data_in, header_in, onClick, showMax }: Props) => {
  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            {header_in.map((item) => (
              <th className={getWidth(item)} key={item}>
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-striped">
          {data_in
            .filter((item, index) => index < showMax && item)
            .map((item) => (
              <tr
                onClick={() => onClick(item["COURSE CODE"])}
                key={item["COURSE CODE"]}
              >
                <td>{item["COURSE CODE"]}</td>
                <td>{item["COURSE TITLE"]}</td>
              </tr>
            ))}
        </tbody>
        <tfoot></tfoot>
      </table>
    </>
  );
};

export default Table;
