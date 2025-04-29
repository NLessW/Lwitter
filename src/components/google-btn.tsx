import { useNavigate } from "react-router-dom";
import { Button, Logo } from "./btn_css";
import { auth } from "../routes/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function GoogleBtn() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/google.svg" />
      Continue with Google
    </Button>
  );
}
