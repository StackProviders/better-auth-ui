import { FingerprintIcon } from "lucide-react"
import { useContext } from "react"

import { useOnSuccessTransition } from "better-auth-ui"
import { AuthUIContext } from "better-auth-ui"
import { cn, getLocalizedError } from "better-auth-ui"
import type { AuthLocalization } from "better-auth-ui"
import { Button } from "@/components/ui/button"
import type { AuthViewClassNames } from "./auth-view"

interface PasskeyButtonProps {
    classNames?: AuthViewClassNames
    isSubmitting?: boolean
    localization: Partial<AuthLocalization>
    redirectTo?: string
    setIsSubmitting?: (isSubmitting: boolean) => void
}

export function PasskeyButton({
    classNames,
    isSubmitting,
    localization,
    redirectTo,
    setIsSubmitting
}: PasskeyButtonProps) {
    const {
        authClient,
        localization: contextLocalization,
        toast
    } = useContext(AuthUIContext)

    localization = { ...contextLocalization, ...localization }

    const { onSuccess } = useOnSuccessTransition({ redirectTo })

    const signInPassKey = async () => {
        setIsSubmitting?.(true)

        try {
            const response = await authClient.signIn.passkey({
                fetchOptions: { throw: true }
            })

            if (response?.error) {
                toast({
                    variant: "error",
                    message: getLocalizedError({
                        error: response.error,
                        localization
                    })
                })

                setIsSubmitting?.(false)
            } else {
                onSuccess()
            }
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({ error, localization })
            })

            setIsSubmitting?.(false)
        }
    }

    return (
        <Button
            className={cn(
                "w-full",
                classNames?.form?.button,
                classNames?.form?.secondaryButton
            )}
            disabled={isSubmitting}
            formNoValidate
            name="passkey"
            value="true"
            variant="secondary"
            onClick={signInPassKey}
        >
            <FingerprintIcon />
            {localization.SIGN_IN_WITH} {localization.PASSKEY}
        </Button>
    )
}
