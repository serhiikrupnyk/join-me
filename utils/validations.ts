import { object, string } from "yup";

export const RegisterSchema = object({
  firstName: string().required().label("First Name").min(2).max(50),
  lastName: string().required().label("Last Name").min(2).max(50),
  email: string().required().label("Email").email(),
  password: string().required().label("Password").min(6).max(50),
});

export const LoginSchema = object({
  email: string().required().label("Email").email(),
  password: string().required().label("Password").min(6).max(50),
});

export const ForgotPasswordSchema = object({
  email: string().required().label("Email").email(),
});
