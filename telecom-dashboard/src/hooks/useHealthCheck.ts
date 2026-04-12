import { useEffect, useState } from 'react';
import { checkHealth } from '../api/eventsApi';

export function useHealthCheck(intervalMs = 5000) {
    const [online, setOnline] = useState<boolean | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function poll() {
            const result = await checkHealth();
            if (!cancelled) setOnline(result);
        }

        poll();
        const id = setInterval(poll, intervalMs);

        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [intervalMs]);

    return { online };
}