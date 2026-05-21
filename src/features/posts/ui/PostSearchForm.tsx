import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostSortField, type PostSearchFormValues } from "@/features/posts/model/postSearch.types.ts";

const searchFormSchema = z.object({
  keyword: z.string(),
  sortField: z.union([z.nativeEnum(PostSortField), z.literal("")]),
});

interface PostSearchFormProps {
  onSearch: (values: PostSearchFormValues) => void;
  isLoading?: boolean;
}

export function PostSearchForm({ onSearch, isLoading = false }: PostSearchFormProps) {
  const form = useForm<PostSearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      keyword: "",
      sortField: "",
    },
  });

  const handleSubmit = (values: PostSearchFormValues) => {
    onSearch(values);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  const handleClear = () => {
    form.reset({
      keyword: "",
      sortField: "",
    });
    onSearch({ keyword: "", sortField: "" });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="bg-card border border-border rounded-xl px-4 py-3 flex flex-col sm:flex-row gap-2"
      >
        {/* Search input */}
        <FormField
          control={form.control}
          name="keyword"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="sr-only">Search</FormLabel>
              <FormControl>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts…"
                    className="pl-9 rounded-lg bg-muted/50 border-border focus-visible:bg-card"
                    disabled={isLoading}
                    onKeyDown={handleKeyDown}
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Sort */}
        <FormField
          control={form.control}
          name="sortField"
          render={({ field }) => (
            <FormItem className="w-full sm:w-40">
              <FormLabel className="sr-only">Sort by</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger className="rounded-lg bg-muted/50 border-border">
                    <SelectValue placeholder="Sort by…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={PostSortField.TITLE}>Title</SelectItem>
                  <SelectItem value={PostSortField.CONTENT}>Content</SelectItem>
                  <SelectItem value={PostSortField.LIKES}>Likes</SelectItem>
                  <SelectItem value={PostSortField.CREATED}>Newest</SelectItem>
                  <SelectItem value={PostSortField.UPDATED}>Updated</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex gap-2 shrink-0">
          <Button type="submit" disabled={isLoading} size="sm" className="rounded-lg px-4">
            <Search className="h-3.5 w-3.5 mr-1.5" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={handleClear} disabled={isLoading} size="sm" className="rounded-lg px-3">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
