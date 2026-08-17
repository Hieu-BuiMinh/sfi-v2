# API Usage Guidelines (Client & Server API)

This document outlines how to fetch APIs using `clientApi` and `createServerApi` in this Next.js 16 project and explains the security architecture designed to prevent token leaks and session hijacking.

---

## 1. Architecture Overview

This project implements a **Backend-for-Frontend (BFF)** pattern combined with **Request Isolation** on the Server:

```mermaid
graph TD
    subgraph Client [Client-Side (Browser)]
        RCC[Client Component] -- "1. Sends request without token to /api/proxy/*" --> clientApi
    end

    subgraph BFF [Next.js Server (BFF Proxy)]
        clientApi -- "2. Automatically attaches Cookie" --> Proxy[BFF Proxy Route Handler]
        Proxy -- "3. Decrypts Cookie to extract Access Token" --> Auth0[Auth0 SDK]
        Proxy -- "4. Forwards request with Bearer Token" --> Backend[(Backend API)]

        RSC[Server Component] -- "5. Extracts Access Token directly from Request" --> createServerApi
        createServerApi -- "6. Sends isolated request with Bearer Token" --> Backend
    end
```

---

## 2. Client-Side API (`clientApi`)

Specifically designed for **Client Components** (`'use client'`).

### How to Use

```typescript
import { clientApi } from '@/lib/api/client'

const fetchData = async () => {
	try {
		const response = await clientApi.get('/api/v1/users')
		console.log(response.data)
	} catch (error) {
		console.error(error)
	}
}
```

### Why is there no Authorization header / token attached manually?

- **Mechanism:** Requests are sent to the relative path `/api/proxy/*` (Next.js BFF). The browser **automatically attaches** the encrypted session cookie (`appSession`) managed by Auth0.
- **Security:** Access Tokens reside entirely on the server. Since Client-Side JavaScript cannot access the HTTP-only cookie, the risk of token theft via **XSS** (Cross-Site Scripting) is completely mitigated.

---

## 3. Server-Side API (`createServerApi`)

Specifically designed for **Server Components**, **Route Handlers**, or **Server Actions**.

### How to Use

You must pass the `NextRequest` object to the creator function to fetch the user session from the request cookies.

```typescript
import { createServerApi } from '@/lib/api/client'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
	// 1. Create a request-isolated API instance
	const serverApi = await createServerApi(request)

	// 2. Perform direct calls to the Backend API
	const response = await serverApi.get('/users')

	return Response.json(response.data)
}
```

### Why must we use a Function instead of a Global Shared Instance?

- **Token Leakage Risk:** Node.js servers process requests concurrently for different users. If we export a single global static instance (e.g., `export const serverApi = ...`), assigning User A's token to its headers will overwrite or leak the token to User B's request running in parallel.
- **Solution:** Calling `createServerApi(request)` generates a **new, request-isolated Axios instance**. This instance is garbage collected after the request ends, ensuring no cross-session token contamination.

---

## 4. Comparison Table (Pros & Cons)

| Feature            | Client-Side (`clientApi`)                                   | Server-Side (`createServerApi`)                          |
| :----------------- | :---------------------------------------------------------- | :------------------------------------------------------- |
| **Environment**    | Client Component (`'use client'`)                           | Server Component, Route Handler, Server Action           |
| **Base URL**       | `/api/proxy` (BFF)                                          | `NEXT_PUBLIC_BASE_API_URL` (Backend)                     |
| **Authentication** | Automatic via browser session cookies                       | Manual extraction from request cookies                   |
| **Pros**           | Maximum security (XSS-safe), zero token management overhead | Faster latency (direct call to backend), optimal for SSR |
| **Cons**           | Extra hop through the Next.js BFF proxy                     | Must pass the `request` parameter to the initializer     |

---

## 5. Strict Rules (Do NOT do this!)

- ❌ **DO NOT** store Access Tokens in `localStorage` or `sessionStorage` on the client.
- ❌ **DO NOT** export any global, shared Server API instance variables.
- ❌ **DO NOT** modify `clientApi` to append Authorization headers manually from the client.
