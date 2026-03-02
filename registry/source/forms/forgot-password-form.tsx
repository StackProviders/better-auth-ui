"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { BetterFetchOption } from "better-auth/react"
import { Loader2 } from "lucide-react"
import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useCaptcha } from "better-auth-ui"
import { useIsHydrated } from "better-auth-ui"
import { AuthUIContext } from "better-auth-ui"
import { cn, getLocalizedError } from "better-auth-ui"
import type { AuthLocalization } from "better-auth-ui"
import { Captcha } from "@/components/auth/captcha/captcha"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { AuthFormClassNames } from "../auth-form"

export interface ForgotPasswordFormProps {
    className?: string
    classNames?: AuthFormClassNames
    isSubmitting?: boolean
    localization: Partial<AuthLocalization>
    setIsSubmitting?: (value: boolean) => void
}

export function ForgotPasswordForm({
    className,
    classNames,
    isSubmitting,
    localization,
    setIsSubmitting
}: ForgotPasswordFormProps) {
    const isHydrated = useIsHydrated()
    const { captchaRef, getCaptchaHeaders, resetCaptcha } = useCaptcha({
        localization
    })

    const {
        authClient,
        basePath,
        baseURL,
        localization: contextLocalization,
        navigate,
        toast,
        viewPaths
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const formSchema = z.object({
        email: z
            .string()
            .email({
                message: `${localization.EMAIL} ${localization.IS_INVALID}`
            })
            .min(1, {
                message: `${localization.EMAIL} ${localization.IS_REQUIRED}`
            })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    isSubmitting = isSubmitting || form.formState.isSubmitting

    useEffect(() => {
        setIsSubmitting?.(form.formState.isSubmitting)
    }, [form.formState.isSubmitting, setIsSubmitting])

    async function forgotPassword({ email }: z.infer<typeof formSchema>) {
        try {
            const fetchOptions: BetterFetchOption = {
                throw: true,
                headers: await getCaptchaHeaders("/forget-password")
            }

            await authClient.requestPasswordReset({
                email,
                redirectTo: `${baseURL}${basePath}/${viewPaths.RESET_PASSWORD}`,
                fetchOptions
            })

            toast({
                variant: "success",
                message: localization.FORGOT_PASSWORD_EMAIL
            })

            navigate(
                `${basePath}/${viewPaths.SIGN_IN}${window.location.search}`
            )
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })
            resetCaptcha()
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(forgotPassword)}
                noValidate={isHydrated}
                className={cn("grid w-full gap-6", className, classNames?.base)}
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className={classNames?.label}>
                                {localization.EMAIL}
                            </FormLabel>

                            <FormControl>
                                <Input
                                    className={classNames?.input}
                                    type="email"
                                    placeholder={localization.EMAIL_PLACEHOLDER}
                                    disabled={isSubmitting}
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className={classNames?.error} />
                        </FormItem>
                    )}
                />

                <Captcha
                    ref={captchaRef}
                    localization={localization}
                    action="/forget-password"
                />

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                        "w-full",
                        classNames?.button,
                        classNames?.primaryButton
                    )}
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        localization.FORGOT_PASSWORD_ACTION
                    )}
                </Button>
            </form>
        </Form>
    )
}
