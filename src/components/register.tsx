"use client"


import { registerAction, signInAction } from "@/actions/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import FormErrorComponent from "./formError"
import { useState } from "react"
import FormSuccessComponent from "./formSuccess"
 
const signInSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(1, 'Password is required'),
})
 
export function RegisterFormField() {
  const [errorMessage, setErrorMessage] = useState<string|undefined>();
  const [successMessage, setSuccessMessage] = useState<string|undefined>();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  async function onSubmit(values: z.infer<typeof signInSchema>) {

    setErrorMessage(undefined)
    setSuccessMessage(undefined)

    const validatedData = signInSchema.safeParse(values)    
    /**TODO: Set the form action */
    const data = await registerAction(values)

    if(data.error) setErrorMessage(data.error)
    if(data.success) setSuccessMessage(data.success)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
        <div className="flex flex-col gap-2 w-72">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormErrorComponent message={errorMessage}/>
          <FormSuccessComponent message={successMessage}/>
          <Button type="submit" variant="outline">Register</Button>
        </div>
      </form>
    </Form>
    
  )
} 