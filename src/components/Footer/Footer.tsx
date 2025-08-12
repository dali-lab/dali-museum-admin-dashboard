import "./Footer.scss";
import daliLogo from "@/assets/dali_light.png";
import hdilLogo from "@/assets/hdil-logo.png";

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <img src={daliLogo} alt="DALI Lab" className="logo" />
      <img src={hdilLogo} alt="how do i look?" className="logo" />
    </div>
  );
};

export default Footer;
