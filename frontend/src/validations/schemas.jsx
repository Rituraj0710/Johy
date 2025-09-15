import * as Yup from "yup";
export const registerSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.number().required("Password is required"),
  email: Yup.string().required("Email is required").email("Invalid email formate"),
  password: Yup.string().required("Password is required"),
  password_confirmation: Yup.string().required("Confirm password is required").oneOf([Yup.ref("password"), null], "Password and Confirm Password doesn't match"),

})

export const loginSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Invalid email formate"),
  password: Yup.string().required("Password is required"),

})

export const resetPasswordLinkSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Invalid email formate"),
})

export const resetPasswordSchema = Yup.object({
  password: Yup.string().required("New password is required"),
  password_confirmation: Yup.string().required("Confirm new password is required").oneOf([Yup.ref("password"), null], "New password and confirm new password doesn't match"),

})


export const verifyEmailSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Invalid email formate"),
  otp: Yup.string().required("OTP is required"),
})


export const changePasswordSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  password_confirmation: Yup.string().required("Confirm password is required").oneOf([Yup.ref("password"), null], "password and confirm password doesn't match"),

})

export const contactUsSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.number().required("Password is required"),
  email: Yup.string().required("Email is required").email("Invalid email formate"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Enter your message in message box."),
})