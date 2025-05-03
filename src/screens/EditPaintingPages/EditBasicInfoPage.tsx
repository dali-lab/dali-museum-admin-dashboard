import { useParams } from "react-router-dom";
import "./styles.scss";

const EditBasicInfoPage: React.FC = () => {
  const { paintingId } = useParams();
  return <p>{paintingId}</p>;
};

export default EditBasicInfoPage;
