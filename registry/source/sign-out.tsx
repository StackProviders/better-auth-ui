"use client"

import { Loader2 } from "lucide-react"
import { useContext, useEffect, useRef } from "react"

import { useOnSuccessTransition } from "better-auth-ui"
import { AuthUIContext } from "better-auth-ui"

export function SignOut() {
    const signingOut = useRef(false)

    const { authClient, basePath, viewPaths } = useContext(AuthUIContext)
    const { onSuccess } = useOnSuccessTransition({
        redirectTo: `${basePath}/${viewPaths.SIGN_IN}`
    })

    useEffect(() => {
        if (signingOut.current) return
        signingOut.current = true

        authClient.signOut().finally(onSuccess)
    }, [authClient, onSuccess])

    return <Loader2 className="animate-spin" />
}
