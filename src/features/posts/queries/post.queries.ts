import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/api/queryClient";
import { toast } from "sonner";
import type { RequestPagination } from "@/shared/model/Pagination";
import type { PostSearchRequest } from "@/features/posts/model/postSearch.types.ts";
import { createPost, searchPosts, updatePost } from "@/features/posts/api/posts.api.ts";
import { postQueryKeys } from "./postQuery.keys";
import type { WithExtra } from "@/shared/type/with-extra.type.ts";

export function usePostsQuery(
  { page, limit, ...otherParams }: WithExtra<RequestPagination>,
  searchParams: PostSearchRequest,
) {
  return useQuery({
    queryKey: postQueryKeys.list(page, limit, searchParams),
    queryFn: () =>
      searchPosts({
        page: page - 1,
        limit,
        searchParams,
        params: otherParams,
      }),
  });
}

export function useCreatePostMutation() {
  return useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
      toast.success("PostTypes successfully created");
    },
  });
}

export function useUpdatePostMutation() {
  return useMutation({
    mutationFn: ({ postId, formData }: { postId: number; formData: FormData }) => updatePost(postId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all() });
      toast.success("PostTypes successfully updated");
    },
  });
}

export function preparePostPayload(values: { title: string; content: string; image?: File }) {
  const formData = new FormData();

  formData.append(
    "post",
    new Blob(
      [
        JSON.stringify({
          title: values.title,
          content: values.content,
        }),
      ],
      { type: "application/json" },
    ),
  );

  if (values.image) {
    formData.append("image", values.image);
  }

  return formData;
}
