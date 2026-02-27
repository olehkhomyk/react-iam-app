import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/context/useAuth";
import { Link, useNavigate } from "react-router-dom";

export function AppHeader() {
	return (
		<header
			className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
				<div className="flex items-center gap-3">
					<div
						className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
						IAM
					</div>
					<div className="flex flex-col leading-tight">
						<span className="text-sm font-semibold text-foreground">iam-app</span>
						<span className="text-xs text-muted-foreground">Identity & Access</span>
					</div>
				</div>

				<nav className="hidden md:flex items-center gap-6">
					<a href="#"
						className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
						Dashboard
					</a>
					<a href="#"
						className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
						Feeds
					</a>
				</nav>

				<div className="flex items-center gap-2">
					<UserMenu/>
				</div>
			</div>
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
		// navigate("/login");
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="h-9 w-9 rounded-full bg-transparent hover:bg-accent focus:bg-accent data-[state=open]:bg-accent/60 inline-flex items-center justify-center"
					aria-label="User menu"
				>
					<Avatar size="sm">
						<AvatarImage alt={label}/>
						<AvatarFallback>{initials || "U"}</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" sideOffset={8} className="w-64">
				<DropdownMenuLabel className="p-0">
					<div className="px-3 py-2">
						<div className="text-sm font-medium text-foreground">{label}</div>
						<div className="text-xs text-muted-foreground">Signed in</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator/>

				<DropdownMenuItem asChild>
					<Link to="/profile">View my profile</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to="/settings">Settings</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to="/followers">Followers</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to="/followings">Followings</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator/>
				<DropdownMenuItem onSelect={handleLogout}>Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
