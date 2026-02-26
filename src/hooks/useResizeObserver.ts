import { useState, useLayoutEffect, useRef } from 'react';

export const useResizeObserver = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const targetRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = targetRef.current;
        if (!el) return;

        // 1. 创建观察者
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                // 获取最新的高度（浮点数，更精确）
                setSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });

        // 2. 开始监听
        observer.observe(el);

        // 3. 销毁时停止监听，防止内存泄漏
        return () => observer.disconnect();
    }, []);

    return [targetRef, size] as const;
};
