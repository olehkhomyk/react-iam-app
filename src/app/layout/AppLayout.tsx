import type React from 'react';
import { AppHeader } from "@/widget/header/AppHeader.tsx";
import { Outlet } from "react-router-dom";

type LayoutProps = {
	header?: React.ReactNode;
};

export function AppLayout({ header }: LayoutProps) {
	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground">
			{header ?? <AppHeader />}
			<main className="flex-1">
				<div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-6">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
