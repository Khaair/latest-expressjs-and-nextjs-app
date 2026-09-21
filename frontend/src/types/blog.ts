export interface BlogListItem {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    published: boolean;
    authorId: string;
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
  }