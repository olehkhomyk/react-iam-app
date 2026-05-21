import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Menu, X, MessageCircle, Bell, Compass } from "lucide-react";

const NAV_LINKS = [
	{ to: "/feeds", label: "Home", icon: Home },
	{ to: "/explore", label: "Explore", icon: Compass },
	{ to: "/messages", label: "Messages", icon: MessageCircle },
];

export function AppHeader() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const location = useLocation();

	return (
		<header className="sticky top-0 z-40 w-full border-b border-border bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-sm">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
				{/* Brand */}
				<Link to="/feeds" className="flex items-center gap-2.5 shrink-0">
					<div className="gradient-brand flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold tracking-tight shadow-sm">
						IAM
					</div>
					<span className="text-sm font-semibold text-foreground hidden sm:block">iam-app</span>
				</Link>

				{/* Desktop Nav */}
				<nav className="hidden md:flex items-center gap-1">
					{NAV_LINKS.map(({ to, label, icon: Icon }) => {
						const active = location.pathname.startsWith(to);
						return (
							<Link
								key={to}
								to={to}
								className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
									active
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:text-foreground hover:bg-accent"
								}`}
							>
								<Icon className="w-4 h-4" />
								{label}
							</Link>
						);
					})}
				</nav>

				{/* Right: notifications + user */}
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="relative hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
						aria-label="Notifications"
					>
						<Bell className="w-4 h-4" />
					</button>
					<UserMenu />
					{/* Mobile menu toggle */}
					<button
						type="button"
						onClick={() => setMobileOpen((v) => !v)}
						className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
						aria-label="Toggle menu"
					>
						{mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
					</button>
				</div>
			</div>

			{/* Mobile Nav drawer */}
			{mobileOpen && (
				<div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
					{NAV_LINKS.map(({ to, label, icon: Icon }) => {
						const active = location.pathname.startsWith(to);
						return (
							<Link
								key={to}
								to={to}
								onClick={() => setMobileOpen(false)}
								className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
									active
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:text-foreground hover:bg-accent"
								}`}
							>
								<Icon className="w-4 h-4" />
								{label}
							</Link>
						);
					})}
				</div>
			)}
		</header>
	);
}

function UserMenu() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const label = user?.username ?? user?.email ?? "User";
	const initials = label
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join("");

	const handleLogout = () => {
		logout();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-2 rounded-full hover:bg-accent focus:bg-accent data-[state=open]:bg-accent/60 px-1.5 py-1 transition-colors"
					aria-label="User menu"
				>
					<Avatar size="sm" className="ring-2 ring-primary/20">
						<AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${label}`} alt={label} />
						<AvatarFallback className="gradient-brand text-white text-xs font-semibold">
							{initials || "U"}
						</AvatarFallback>
					</Avatar>
					<span className="text-sm font-medium text-foreground hidden sm:inline max-w-[120px] truncate">
						{label}
					</span>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" sideOffset={8} className="w-56">
				<DropdownMenuLabel className="p-0">
					<div className="px-3 py-2.5 flex items-center gap-2.5">
						<Avatar size="sm" className="ring-2 ring-primary/20 shrink-0">
							<AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${label}`} alt={label} />
							<AvatarFallback className="gradient-brand text-white text-xs font-semibold">
								{initials || "U"}
							</AvatarFallback>
						</Avatar>
						<div className="min-w-0">
							<p className="text-sm font-semibold text-foreground truncate">{label}</p>
							<p className="text-xs text-muted-foreground">Signed in</p>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link to="/profile">View profile</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to="/settings">Settings</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to="/followers">Followers</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to="/followings">Following</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
					Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
