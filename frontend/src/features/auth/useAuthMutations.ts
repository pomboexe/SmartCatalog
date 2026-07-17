import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  type LoginInput,
  type RegisterInput,
} from "../../services/authService";

export function useLoginMutation() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: () => {
      navigate("/dashboard");
    },
  });
}

export function useRegisterMutation() {
  const { register } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: () => {
      navigate("/dashboard");
    },
  });
}
