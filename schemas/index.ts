import * as z from "zod";

/**
 * 신규 가입은 길이 제한을 해도 되지만
 * 로그인 때는 pw에 길이 제한을 하지 않는 것 추천
 * 규칙이 어떻게 바뀔지 모르고, 
 * 제한을 하는 목적성이 없기에 굳이 필요하진 않음
 */
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(1, {
    message: "Password is required"
  })
})

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required"
  }),
  name: z.string().min(1, {
    message: "Name is required"
  })
})