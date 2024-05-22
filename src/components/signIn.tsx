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
import { useState, useTransition } from 'react'
import FormErrorComponent from './formError'
import { useSearchParams } from 'next/navigation'
import FormSuccessComponent from './formSuccess'
import Link from 'next/link'

export function SignIn() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [successMessage, setSuccessMessage] = useState<string | undefined>()

  const [isPending, startTransition] = useTransition()

  const [showTwoFactor, setShowTwoFactor] = useState(false)

  const searchParams = useSearchParams()
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked' ? 'E-mail already in use for different provider.' : ''

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setErrorMessage(undefined)
    setSuccessMessage(undefined)

    startTransition(() => {
      signInAction(values)
        .then((data) => {
          if (!data) return

          if (data.error) {
            form.reset()
            setErrorMessage(data.error)
          }

          if (data.success) {
            form.reset()
            setSuccessMessage(data.success)
          }

          if (data.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch(() => setErrorMessage('Something went wrong!'))
    })
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
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="123456" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!showTwoFactor && (
            <>
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
                      <Input disabled={isPending} {...field} placeholder="Your Password..." type="password" />
                    </FormControl>
                    <Button size={'sm'} variant={'link'} asChild className="px-0 font-normal text-indigo-600">
                      <Link href={'/auth/reset'}>Forgot Password?</Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormErrorComponent message={errorMessage || urlError} />
          <FormSuccessComponent message={successMessage} />
          <Button type="submit" variant="outline">
            {showTwoFactor ? 'Confirm' : 'Signin'}
          </Button>
        </div>
        <Button type="submit" variant="outline" onClick={onClickGoogle}>
          Signin with Google
        </Button>
      </form>
    </Form>
  )
}
