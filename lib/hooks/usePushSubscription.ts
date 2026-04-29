'use client';

import { useState, useCallback } from 'react';

function toUint8Array(base64: string) {
    const pad = "=".repeat((4 - (base64.length % 4)) % 4);
    const b64 = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export function usePushSubscription(membershipId: string | null | undefined) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');

    const subscribe = useCallback(async () => {
        if (!membershipId) return;
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

        setStatus('loading');

        const reg = await navigator.serviceWorker.register("/sw.js");
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            setStatus('denied');
            return;
        }

        const existing = await reg.pushManager.getSubscription();
        const sub = existing ?? await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: toUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
        });

        await fetch("/api/internal/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...sub.toJSON(), membershipId }),
        });

        setStatus('granted');
    }, [membershipId]);

    return { subscribe, status };
}