# Saudi P2P Platform — Deployment & Auto Receiver Guide

## Part 1: Project Files Setup

### Step 1: ZIP Extract Karna (HAAN, extract karna hai!)
1. `saudi-p2p-platform.zip` download karein
2. Right click → "Extract Here" ya `Extract to saudi-p2p-platform/`
3. **Important:** ZIP ke andar wala folder upload karna hai, khud ZIP nahi!

### Step 2: GitHub Pe Upload Karna (Correct Tarika)
1. GitHub pe jayein → New Repository → `saudi-p2p-platform` naam dein
2. **Do NOT** README initialize karein (blank repo chahiye)
3. Apne computer pe extracted folder kholein
4. `.gitignore`, `package.json`, `src/`, `index.html` — yeh sab files directly dikhnay chahiye
5. Saari files select karein → drag & drop GitHub web interface pe
   - Ya: GitHub Desktop app use karein
   - Ya: VS Code se push karein

### Step 3: Vercel Pe Deploy Karna
1. [vercel.com](https://vercel.com) pe jayein → Sign up with GitHub
2. "Add New Project" → `saudi-p2p-platform` repo select karein
3. Framework: **Vite**
4. Build Command: `npm run build` (default hota hai)
5. Output Directory: `dist` (default hota hai)
6. Environment Variables add karein:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
7. Deploy button click karein

---

## Part 2: Auto Receiver Kaise Banayein

Auto Receiver ek standalone PWA page hai jo orders ko automatically receive karta hai.

### File 1: `/src/pages/AutoReceiverApp.tsx` (Main Component)

```tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/db/supabase";
import { toast } from "sonner";

// Types
interface AutoReceiverSession {
  username: string;
  password: string;
  token: string;
}

interface Order {
  id: string;
  order_number: string;
  amount_sar: number;
  status: string;
  created_at: string;
  buyer_id: string;
  advertisement_id: string;
}

export default function AutoReceiverApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check for existing session in localStorage
  useEffect(() => {
    const session = localStorage.getItem("auto_receiver_session");
    if (session) {
      try {
        const parsed = JSON.parse(session) as AutoReceiverSession;
        setUsername(parsed.username);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem("auto_receiver_session");
      }
    }

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username,
        password: password,
      });

      if (error) throw error;

      if (data.session) {
        const session: AutoReceiverSession = {
          username,
          password,
          token: data.session.access_token,
        };
        localStorage.setItem("auto_receiver_session", JSON.stringify(session));
        setIsLoggedIn(true);
        toast.success("Login successful");
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("auto_receiver_session");
    setIsLoggedIn(false);
    setOrders([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    supabase.auth.signOut();
  };

  // Fetch orders function
  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setOrders(data || []);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error("Fetch error:", err);
    }
  }, []);

  // Polling for orders (every 3 seconds)
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      intervalRef.current = setInterval(fetchOrders, 3000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoggedIn, fetchOrders]);

  // Accept order handler
  const acceptOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "processing" })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Order accepted!");
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Failed to accept order");
    }
  };

  // If not logged in, show login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Auto Receiver
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              P2P Order Auto Receiving System
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard (logged in)
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Auto Receiver</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Last update: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No pending orders found
              </p>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Order #{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          Amount: {order.amount_sar} SAR
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => acceptOrder(order.id)}
                      >
                        Accept
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### File 2: `/public/manifest.json` (PWA Manifest)

```json
{
  "name": "Auto Receiver",
  "short_name": "Receiver",
  "description": "P2P Order Auto Receiving System",
  "start_url": "/receiver",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0f172a",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/favicon.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/favicon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### File 3: `/public/sw.js` (Service Worker)

```javascript
const CACHE_NAME = "auto-receiver-v1";
const STATIC_ASSETS = ["/", "/receiver", "/favicon.png"];

// Install: cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cached) => {
          return cached || new Response("Offline", { status: 503 });
        });
      })
  );
});
```

### File 4: Route Add Karna (`/src/routes.tsx`)

Apne `routes.tsx` mein yeh line add karein (other routes ke saath):

```tsx
import AutoReceiverApp from "./pages/AutoReceiverApp";

// Routes array mein add karein:
{
  path: "/receiver",
  element: <AutoReceiverApp />,
}
```

### File 5: Service Worker Register Karna (`/src/main.tsx`)

`main.tsx` ke end mein yeh add karein:

```tsx
// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered:", registration.scope);
      })
      .catch((error) => {
        console.log("SW registration failed:", error);
      });
  });
}
```

---

## Part 3: Common Mistakes Se Bachain

1. **ZIP upload nahi, extracted files upload karein**
2. **Repo blank hone chahiye** — initialize with README mat karein agar files upload kar rahe hain
3. **Supabase credentials** — `.env` file ya Vercel environment variables mein zaroor add karein
4. **Auto Receiver** — `/receiver` URL pe access hoga
5. **PWA install** — Chrome/Edge mein address bar mein "Install" icon dikhega

## Part 4: File Extract Karna Hai Ya Nahi?

**HAAN, extract karna hai!** ZIP file ko extract karein bina:
- Windows: Right click → "Extract All"
- Mac: Double click (automatic extract hoti hai)
- Uske baad extracted folder ki saari files GitHub pe upload karein
