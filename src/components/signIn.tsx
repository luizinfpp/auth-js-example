'use client'

import { signInAction } from '@/actions/auth'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { loginSchema } from '@/schemas/login'
import { DEFAULT_REDIRECT_PATH } from '@@/routes'

export function SignIn() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    const validatedData = loginSchema.safeParse(values)
    if (validatedData.success) signInAction(validatedData.data)
  }

  // using client login
  function onClickGoogle() {
    signIn('google', {
      callbackUrl: DEFAULT_REDIRECT_PATH,
    })
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
          <Button type="submit" variant="outline">
            Signin
          </Button>
        </div>
        <Button type="submit" variant="outline" onClick={onClickGoogle}>
          Signin with Google
        </Button>
      </form>
    </Form>
  )
}
