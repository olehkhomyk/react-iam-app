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
        className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
      >
        <div className="space-y-3">
          {/* Search Input - Full Width */}
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Search</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search posts by keyword..."
                      className="pl-10"
                      disabled={isLoading}
                      onKeyDown={handleKeyDown}
                      {...field}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Sort and Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            {/* Sort Dropdown - Left */}
            <FormField
              control={form.control}
              name="sortField"
              render={({ field }) => (
                <FormItem className="w-full sm:w-64">
                  <FormLabel className="sr-only">Sort by</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={PostSortField.TITLE}>Title</SelectItem>
                      <SelectItem value={PostSortField.CONTENT}>Content</SelectItem>
                      <SelectItem value={PostSortField.LIKES}>Likes</SelectItem>
                      <SelectItem value={PostSortField.CREATED}>Created Date</SelectItem>
                      <SelectItem value={PostSortField.UPDATED}>Updated Date</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Buttons - Right */}
            <div className="flex gap-2">
              <Button 
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>

              <Button 
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
