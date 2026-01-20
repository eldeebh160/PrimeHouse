type Options = {
    uniqueTokenPerInterval?: number;
    interval?: number;
};

export default function rateLimit(options?: Options) {
    const tokenCache = new Map();
    let lastCleanup = Date.now();

    return {
        check: (limit: number, token: string) =>
            new Promise<void>((resolve, reject) => {
                const now = Date.now();

                // Cleanup every interval
                if (now - lastCleanup > (options?.interval || 60000)) {
                    tokenCache.clear();
                    lastCleanup = now;
                }

                const tokenCount = tokenCache.get(token) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount);
                }
                tokenCount[0] += 1;

                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage >= limit;

                if (isRateLimited) {
                    reject();
                } else {
                    resolve();
                }
            }),
    };
}
