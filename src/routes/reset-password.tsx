import { useState } from "react";

import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Swithcher,
  Title,
  Wrapper,
} from "./auth-components";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (isLoading || email === "") return;

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      // Don't navigate away immediately so user can see success message
      setTimeout(() => navigate("/"), 3000);
    } catch (e) {
      //set Error
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Reset Password in 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />

        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Reset Password"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      {success ? (
        <p style={{ color: "green", textAlign: "center", marginTop: "10px" }}>
          Password reset email sent! Redirecting...
        </p>
      ) : null}
      <Swithcher>
        Already have an account? <Link to="/login">Log in &rarr;</Link>
        <br />
        <br />
        Don't have an account?{" "}
        <Link to="/create-account">Create one &rarr;</Link>
      </Swithcher>
    </Wrapper>
  );
}
