import { useState, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEY, NOTIFICATION_SENT_KEY } from '@/constant/enum';

interface PriceNotificationState {
  targetPrice: number | null;
  isMonitoring: boolean;
  hasNotified: boolean;
}

export const usePriceNotification = (currentGoldPrice: number | null) => {
  const [state, setState] = useState<PriceNotificationState>(() => {
    const savedTarget = localStorage.getItem(STORAGE_KEY);
    const savedNotified = localStorage.getItem(NOTIFICATION_SENT_KEY);

    return {
      targetPrice: savedTarget ? parseFloat(savedTarget) : null,
      isMonitoring: savedTarget !== null,
      hasNotified: savedNotified === 'true',
    };
  });

  const hasNotifiedRef = useRef(state.hasNotified);

  useEffect(() => {
    hasNotifiedRef.current = state.hasNotified;
  }, [state.hasNotified]);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('此浏览器不支持桌面通知');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const sendNotification = useCallback((price: number) => {
    if (Notification.permission === 'granted') {
      new Notification('补仓提醒', {
        body: `当前金价已低于您的目标价格 ¥${price.toFixed(2)}/克，请关注！`,
        icon: '/finance.svg',
        tag: 'gold-price-alert',
        requireInteraction: true,
      });
    }
  }, []);

  const setTargetPrice = useCallback(async (price: number): Promise<{ success: boolean; message: string }> => {
    if (isNaN(price) || price <= 0) {
      return { success: false, message: '请输入有效的价格' };
    }

    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return { success: false, message: '请允许浏览器通知权限以接收价格提醒' };
    }

    localStorage.setItem(STORAGE_KEY, price.toString());
    localStorage.removeItem(NOTIFICATION_SENT_KEY);

    setState({
      targetPrice: price,
      isMonitoring: true,
      hasNotified: false,
    });

    return { success: true, message: '价格监控已设置' };
  }, [requestNotificationPermission]);

  const clearNotification = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NOTIFICATION_SENT_KEY);

    setState({
      targetPrice: null,
      isMonitoring: false,
      hasNotified: false,
    });
  }, []);

  useEffect(() => {
    if (
      state.isMonitoring &&
      !hasNotifiedRef.current &&
      state.targetPrice !== null &&
      currentGoldPrice !== null
    ) {
      if (currentGoldPrice < state.targetPrice) {
        sendNotification(state.targetPrice);

        localStorage.setItem(NOTIFICATION_SENT_KEY, 'true');

        setState(prev => ({
          ...prev,
          hasNotified: true,
          isMonitoring: false,
        }));
      }
    }
  }, [currentGoldPrice, state.isMonitoring, state.targetPrice, sendNotification]);

  return {
    targetPrice: state.targetPrice,
    isMonitoring: state.isMonitoring,
    hasNotified: state.hasNotified,
    setTargetPrice,
    clearNotification,
  };
};
