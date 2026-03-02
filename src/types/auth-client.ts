import {
    anonymousClient,
    apiKeyClient,
    emailOTPClient,
    genericOAuthClient,
    magicLinkClient,
    multiSessionClient,
    oneTapClient,
    organizationClient,
    twoFactorClient,
    usernameClient
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
    plugins: [
        apiKeyClient(),
        multiSessionClient(),
        oneTapClient({
            clientId: ""
        }),
        genericOAuthClient(),
        anonymousClient(),
        usernameClient(),
        magicLinkClient(),
        emailOTPClient(),
        twoFactorClient(),
        organizationClient()
    ]
})

export type AuthClient = typeof authClient & {
    passkey: {
        addPasskey: (opts?: any) => Promise<any>;
        deletePasskey: (opts?: any) => Promise<any>;
    };
    useListPasskeys: () => { data?: any[]; isPending?: boolean; refetch?: () => void };
}

export type Session = AuthClient["$Infer"]["Session"]["session"]
export type User = AuthClient["$Infer"]["Session"]["user"]
