import { ReactNode } from "react";

/**
 * 这个文件时定义通用组件属性接口，对应components/common/
 */
export interface BodyComProps {
    children?: ReactNode | string | number | null;
    otherChildren?: ReactNode | string | number | null;
    footer?: ReactNode | string | number | null;
};

export interface ErrorAlertProps {
    error: string | null;
};

export interface SecondaryCardProps {
    isAutoRefreshEnabled: boolean;
    lastUpdate: string | null;
    length?: number;
    rate?: number | string | null;
};

export interface SettingDialogProps {
    isSettingsOpen: boolean;
    setIsSettingsOpen: (isOpen: boolean) => void;
    autoRefresh: boolean;
    handleAutoRefreshToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
    refreshInterval: number;
    handleRefreshIntervalChange: (interval: number) => void;
    tips?: string;
};

export interface NavbarProps {
    setNavbarHeight: (height: number) => void;
};

export type NavItem = {
    label: string;
    path: string;
    icon: React.ReactNode;
    isPreciousMetal?: boolean;
};

export interface NavbarHeightContextType {
    navbarHeight: number;
    setNavbarHeight: (height: number) => void;
};

