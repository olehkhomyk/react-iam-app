import { useTheme } from "@/shared/theme/ThemeContext.tsx";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700"
		>
			{theme === "light" ? "🌙 Dark" : "☀ Light"}
		</button>
	);
}
