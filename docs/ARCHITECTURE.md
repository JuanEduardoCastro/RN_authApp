# RN_authApp — Architecture

React Native 0.82.0 · TypeScript · Redux Toolkit · React Navigation 7

---

## 1. Navigation Hierarchy

```mermaid
flowchart TD
    App["App.tsx\nNotificationBanner · SplashScreen\nDeep linking · SSL pinning"]
    Root["RootNavigation\nwatches auth.isAuthorized"]

    App --> Root
    Root -->|"isAuthorized = false"| Auth
    Root -->|"isAuthorized = true"| Home

    subgraph Auth["AuthNavigator — Stack"]
        W["WelcomeScreen\nOAuth + biometric re-login"]
        L["LoginScreen\nEmail / password"]
        C["CheckEmailScreen\nSend reset link"]
        N["NewPasswordScreen\nDeep link: new-password/:emailToken"]
    end

    W --> L
    L --> W
    W --> C
    C --> N

    subgraph Home["HomeNavigator — Bottom Tabs"]
        HS["HomeScreen\nUser info · logout · biometric opt-in"]
        IS["InboxScreen\nbadge = unreadCount"]
        SN["SettingsNavigator — Stack"]
    end

    subgraph SettingsStack["SettingsNavigator — Stack"]
        SS["SettingsScreen\nTheme · language · biometric toggle"]
        PS["ProfileScreen\nEdit user data"]
        AS["AdminScreen\nSend push / in-app messages"]
    end

    SN --> SettingsStack
    SS --> PS
    SS --> AS
```

---

## 2. Redux State and Data Flow

```mermaid
flowchart TD
    subgraph Slices["Redux Store"]
        authSlice["authSlice\n---\ntoken\nuser\nisAuthorized\nloader\npendingBiometricOffer\nnotificationMessage\nmessageType"]
        adminSlice["adminSlice\n---\nmessages\nunreadCount\nusers\nusersPage\nusersHasMore\nloader"]
    end

    subgraph AuthThunks["Auth Thunks"]
        T1["validateRefreshToken"]
        T2["loginUser"]
        T3["createUser"]
        T4["editUser"]
        T5["logoutUser"]
        T6["updatePassword"]
        T7["googleLogin"]
        T8["githubLogin"]
        T9["appleLogin"]
    end

    subgraph AdminThunks["Admin Thunks"]
        A1["fetchUsers"]
        A2["sendAdminMessage"]
        A3["fetchMessages"]
        A4["fetchUnreadCount"]
        A5["markMessageRead"]
        A6["deleteMessage"]
    end

    subgraph Screens["Screens"]
        WS["WelcomeScreen"]
        LS["LoginScreen"]
        HoS["HomeScreen"]
        InS["InboxScreen"]
        SeS["SettingsScreen"]
        PrS["ProfileScreen"]
        AdS["AdminScreen"]
        HN["HomeNavigation"]
    end

    WS --> T7
    WS --> T8
    WS --> T9
    WS --> T1
    LS --> T2
    HoS --> A4
    HoS --> T5
    InS --> A3
    InS --> A5
    InS --> A6
    SeS --> T5
    PrS --> T4
    AdS --> A1
    AdS --> A2
    HN --> A3
    HN --> A4

    AuthThunks -->|"fulfilled / rejected"| authSlice
    AdminThunks -->|"fulfilled / rejected"| adminSlice

    authSlice -->|"auth.token"| Interceptor["apiInterceptor\n---\nRequest: proactive refresh if token expires in 5min\nResponse: 401 reactive refresh\nDeduplication via refreshTokenPromise"]
    Interceptor -->|"refreshed token"| authSlice
```

---

## 3. Authentication Flow

```mermaid
sequenceDiagram
    participant Splash as SplashScreen
    participant Hook as useCheckToken
    participant KC as Keychain
    participant Store as Redux Store
    participant API
    participant Nav as Navigator

    Splash->>Hook: mount

    Hook->>KC: isBiometricLoginEnabled()

    alt Biometric enabled
        Hook->>Splash: trigger Face ID / Touch ID
        alt Authenticated
            Hook->>KC: get REFRESH_TOKEN
            Hook->>Hook: jwtDecode — check exp
            alt Token valid
                Hook->>API: POST /token/refresh
                API-->>Store: setCredentials
                Store-->>Nav: isAuthorized=true — HomeNavigator
            else Token expired
                Hook->>KC: disableBiometricLogin()
                Hook-->>Nav: WelcomeScreen
            end
        else Cancelled or failed
            Hook-->>Nav: WelcomeScreen
        end

    else Biometric disabled
        Hook->>KC: get REMEMBER_ME flag
        alt Remember Me = true
            Hook->>KC: get REFRESH_TOKEN
            Hook->>Hook: jwtDecode — check exp
            alt Token valid
                Hook->>API: POST /token/refresh
                API-->>Store: setCredentials
                Store-->>Nav: isAuthorized=true — HomeNavigator
            else Expired or missing
                Hook->>KC: clear REFRESH_TOKEN + REMEMBER_ME
                Hook-->>Nav: WelcomeScreen
            end
        else Remember Me = false
            Hook->>KC: clear REFRESH_TOKEN + REMEMBER_ME
            Hook-->>Nav: WelcomeScreen
        end
    end

    Note over Splash,Nav: Manual login path
    Splash->>API: POST /users/login
    API-->>Store: setCredentials + pendingBiometricOffer=true
    Store-->>Nav: HomeNavigator
    Nav->>Store: HomeScreen reads pendingBiometricOffer
    Store-->>Nav: show BiometricOptInModal if eligible

    Note over Splash,Nav: OAuth path (Google / GitHub / Apple)
    Splash->>API: POST /users/[provider]-login
    API-->>Store: setCredentials + pendingBiometricOffer=true
    Store-->>Nav: HomeNavigator

    Note over Splash,Nav: Token refresh at runtime
    API-->>Splash: 401 Unauthorized
    Splash->>KC: get REFRESH_TOKEN
    Splash->>API: POST /token/refresh
    alt Refresh OK
        API-->>Store: setCredentials new token
        Splash->>API: retry original request
    else Refresh failed
        Store-->>Store: setResetCredentials
        KC->>KC: clear REFRESH_TOKEN + REMEMBER_ME
        Store-->>Nav: isAuthorized=false — WelcomeScreen
    end
```

---

## 4. Feature Map

```mermaid
flowchart TD
    subgraph AuthFeature["Auth Feature"]
        AF1["Screens\nWelcomeScreen · LoginScreen\nCheckEmailScreen · NewPasswordScreen"]
        AF2["Thunks — authThunks.ts\nvalidateRefreshToken · loginUser\ncreateUser · logoutUser · updatePassword"]
        AF3["Thunks — otherAuthHooks.ts\ngoogleLogin · githubLogin · appleLogin"]
        AF4["Hooks\nuseCheckToken · useBiometricAuth · useLogoutUser"]
        AF5["Utils\nbiometricAuth.ts · secureStorage.ts\nvalidationHelper.ts · persistentRateLimiter.ts"]
    end

    subgraph HomeFeature["Home Feature"]
        HF1["Screen\nHomeScreen"]
        HF2["Thunks\nfetchUnreadCount · clearBiometricOffer"]
        HF3["Hooks\nuseLogoutUser · useBadgeCount"]
    end

    subgraph InboxFeature["Inbox Feature"]
        IF1["Screen\nInboxScreen"]
        IF2["Thunks\nfetchMessages · markMessageRead · deleteMessage"]
        IF3["Components\nMessageCard · DeleteMessageModal"]
    end

    subgraph SettingsFeature["Settings Feature"]
        SF1["Screens\nSettingsScreen · ProfileScreen · AdminScreen"]
        SF2["Thunks\neditUser · fetchUsers · sendAdminMessage"]
        SF3["Hooks\nuseBiometricAuth · useStyles"]
    end

    subgraph Core["Core"]
        C1["API Layer\napiService.ts — Axios instance\napiInterceptor.ts — token refresh"]
        C2["State\nauthSlice.ts · adminSlice.ts · store.ts"]
        C3["Theme\nModeContext.tsx · colors.ts\nThemes: luxury · calm · gold · passion"]
        C4["Notifications\npushNotificationService.ts\nregisterFCMToken.ts · useBadgeCount"]
        C5["Security\nsslPinning.ts · cleanUserData.ts\nerrorHandler.ts"]
        C6["i18n\nlocale/en.json · locale/es.json"]
    end

    AuthFeature --> Core
    HomeFeature --> Core
    InboxFeature --> Core
    SettingsFeature --> Core
```

---

## Key Invariants

| Rule | Where enforced |
|---|---|
| Never use raw strings for Keychain service names | `KeychainService` enum in `secureStorage.ts` |
| No default `Authorization` header on Axios | Every authenticated thunk passes it manually |
| `BIOMETRIC_DECLINED` never cleared on logout | Excluded from `logoutUser` cleanup — respects permanent opt-out |
| 401 refresh calls deduplicated | `refreshTokenPromise` singleton in `apiInterceptor.ts` |
| Biometric opt-in shown only after `HomeScreen` mounts | `pendingBiometricOffer` Redux flag — set on login, consumed in `HomeScreen` |
| Token refresh skipped for public endpoints | `skipValidation` list in request interceptor |
| All `console.log` wrapped in `__DEV__ &&` | Never leave bare logs in production |
| Paginated responses shape: `{ data: [], pagination: {} }` | All list endpoints — `data` is the array directly |
