export function AppFooter() {
	return (
		<footer className="border-t border-border bg-background">
			<div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
				<div className="py-10 grid grid-cols-1 gap-8 md:grid-cols-12">
					<div className="md:col-span-5 space-y-3">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
								IAM
							</div>
							<div className="flex flex-col leading-tight">
								<span className="text-sm font-semibold text-foreground">iam-app</span>
								<span className="text-xs text-muted-foreground">Identity & Access</span>
							</div>
						</div>
						<p className="text-sm text-muted-foreground max-w-sm">
							Secure identity and access management for modern apps.
						</p>
					</div>

					<div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-foreground">Product</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
										Features
									</a>
								</li>
								<li>
									<a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
										Security
									</a>
								</li>
							</ul>
						</div>

						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-foreground">Resources</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
										Docs
									</a>
								</li>
								<li>
									<a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
										API
									</a>
								</li>
							</ul>
						</div>

						<div className="space-y-3">
							<h3 className="text-sm font-semibold text-foreground">Company</h3>
							<ul className="space-y-2">
								<li>
									<a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
										About
									</a>
								</li>
								<li>
									<a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
										Contact
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="border-t border-border py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} iam-app. All rights reserved.
					</p>
					<div className="flex items-center gap-4">
						<a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
							Privacy
						</a>
						<a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
							Terms
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
