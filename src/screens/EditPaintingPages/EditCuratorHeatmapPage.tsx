import { useParams } from "react-router-dom";
import "./styles.scss";

const EditCuratorHeatmapPage: React.FC = () => {
  const { paintingId } = useParams();
  return <p>{paintingId}</p>;
};

export default EditCuratorHeatmapPage;
