import * as React from 'react';
export interface SidebarItem { value: string; label: string; icon?: string; count?: number }
export interface SidebarSection { label?: string; items: SidebarItem[] }
export interface SidebarNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange'> {
  sections: SidebarSection[];
  value?: string;
  onChange?: (value: string) => void;
}
export declare function SidebarNav(props: SidebarNavProps): JSX.Element;
