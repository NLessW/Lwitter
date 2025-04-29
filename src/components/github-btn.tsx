import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { Button, Logo } from "./btn_css";
import { auth } from "../routes/firebase";
import { useNavigate } from "react-router-dom";

export default function GithubBtn() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);

      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-mark.svg" />
      Continue with Github
    </Button>
  );
}
