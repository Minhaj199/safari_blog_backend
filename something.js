
type article=
{_id: string;
title: string;
description: string;
content: string;
author: {
  id: string;
  name: string;
  avatar: string;
};
publishedAt: string;
image: string;
categories: ArticleCategory[];
likes: [];
dislikes: [];
blocked:[]
readTime: number;}