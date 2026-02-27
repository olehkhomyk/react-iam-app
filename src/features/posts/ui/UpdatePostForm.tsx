import type { RefObject } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Post } from "@/features/posts/model/Post";

const postFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(200, { message: "Title must not exceed 200 characters." }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters." })
    .max(1000, { message: "Content must not exceed 1000 characters." }),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface UpdatePostFormProps {
  post?: Post;
  onSubmit: (values: PostFormValues) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  renderInDialog?: boolean;
  formRef?: RefObject<HTMLFormElement | null>;
}

export function UpdatePostForm({
  post,
  onSubmit,
  onCancel,
  isLoading = false,
  renderInDialog = false,
  formRef,
}: UpdatePostFormProps) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
    },
  });

  const handleSubmit = async (values: PostFormValues) => {
    await onSubmit(values);
  };

  const formContent = (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
        <div className="flex-1 space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Post Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a compelling title..."
                      className="text-base"
                      disabled={isLoading}
                      autoFocus={false}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear and descriptive title for your post (3-200 characters).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                const currentLength = field.value?.length || 0;
                const maxLength = 1000;
                const isNearLimit = currentLength > maxLength * 0.8;
                const isOverLimit = currentLength > maxLength;

                return (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Post Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts, ideas, or story..."
                        className="min-h-[200px] text-base resize-none"
                        disabled={isLoading}
                        maxLength={maxLength}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormDescription>
                        Write your post content here (10-1000 characters).
                      </FormDescription>
                      <span
                        className={`text-sm font-medium ${
                          isOverLimit
                            ? "text-red-600"
                            : isNearLimit
                            ? "text-orange-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {currentLength} / {maxLength}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {post && (
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Created by:</span>
                  <span className="font-semibold">{post.createdBy}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Likes:</span>
                  <span className="font-semibold">{post.likes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Created:</span>
                  <span className="font-semibold">
                    {new Date(post.created).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Last Updated:</span>
                  <span className="font-semibold">
                    {new Date(post.updated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
        </div>

        {!renderInDialog && (
          <>
            <Separator className="my-6" />
            <div className="flex justify-between pt-6">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Saving...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : post ? (
                  "Update Post"
                ) : (
                  "Create Post"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );

  if (renderInDialog) {
    return formContent;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {post ? "Update Post" : "Create New Post"}
        </CardTitle>
        <CardDescription>
          {post
            ? "Edit your post details below and save your changes."
            : "Fill in the details below to create a new post."}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        {formContent}
      </CardContent>
    </Card>
  );
}
