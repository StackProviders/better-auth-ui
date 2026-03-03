import {
    anonymousClient,
    emailOTPClient,
    genericOAuthClient,
    magicLinkClient,
    multiSessionClient,
    oneTapClient,
    organizationClient,
    twoFactorClient,
    usernameClient
} from "better-auth/client/plugins"
import { apiKeyClient } from "@better-auth/api-key/client"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
    plugins: [
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
    apiKey: {
        create: (opts?: any) => Promise<any>;
        delete: (opts?: any) => Promise<any>;
        list: (opts?: any) => Promise<any>;
    };
    passkey: {
        addPasskey: (opts?: any) => Promise<any>;
        deletePasskey: (opts?: any) => Promise<any>;
    };
    useListPasskeys: () => { data?: any[]; isPending?: boolean; refetch?: () => void };
    signIn: typeof authClient.signIn & {
        passkey: (opts?: any) => Promise<any>;
    };
}

export type Session = AuthClient["$Infer"]["Session"]["session"]
export type User = AuthClient["$Infer"]["Session"]["user"]
