/**
 * Auth Screen Block
 *
 * A complete authentication screen with email/password form.
 */

import { VStack } from "perry/ui"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export interface AuthScreenProps {
  title?: string
  subtitle?: string
  onSubmit?: (email: string, password: string) => void
  onForgotPassword?: () => void
  onSignUp?: () => void
}

export function AuthScreen(props: AuthScreenProps = {}) {
  const {
    title = "Welcome Back",
    subtitle = "Sign in to your account",
    onSubmit = (email, password) => console.log("Login:", email, password),
    onForgotPassword = () => console.log("Forgot password"),
    onSignUp = () => console.log("Sign up")
  } = props

  let email = ""
  let password = ""

  return VStack(24, [
    // Header
    VStack(8, [
      Label({
        children: title,
        variant: "heading"
      }),
      Label({
        children: subtitle,
        variant: "muted"
      })
    ]),

    Separator(),

    // Form
    VStack(16, [
      VStack(4, [
        Label({ children: "Email", variant: "label" }),
        Input({
          placeholder: "you@example.com",
          type: "email",
          onChange: (value) => { email = value }
        })
      ]),

      VStack(4, [
        Label({ children: "Password", variant: "label" }),
        Input({
          placeholder: "••••••••",
          type: "password",
          onChange: (value) => { password = value }
        })
      ]),

      Button({
        children: "Sign In",
        variant: "default",
        size: "md",
        onPress: () => onSubmit(email, password)
      })
    ]),

    Separator(),

    // Actions
    VStack(12, [
      Button({
        children: "Forgot password?",
        variant: "link",
        onPress: onForgotPassword
      }),
      Button({
        children: "Don't have an account? Sign up",
        variant: "ghost",
        onPress: onSignUp
      })
    ])
  ])
}
