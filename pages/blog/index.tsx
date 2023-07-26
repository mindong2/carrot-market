// 목표 : posts 폴더 내 md 파일을 불러오고 싶다 (static한 페이지)

import Layout from "@/components/layout";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";

interface Ipost {
  title: string;
  date: string;
  category: string;
  slug: string;
}
const Blog: NextPage<{ posts: Ipost[] }> = ({ posts }) => {
  return (
    <Layout canGoBack hasTabBar title="blog" seoTitle="blog">
      <div className="py-4">
        <h1 className="text-2xl font-bold">blog posts</h1>
        <ul className="mt-8 space-y-2">
          {posts?.map((item, idx) => {
            return (
              <li key={idx} className="border border-gray-600">
                <Link href={`/blog/${item.slug}`}>
                  <h2>{posts.length - idx}</h2>
                  <div>{item.title}</div>
                  <div>{item.date}</div>
                  <div>{item.category}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    return matter(content).data;
  });

  return {
    props: {
      posts: blogPosts.reverse(),
    },
  };
};

export default Blog;

/*
  - getServerSideProps : 유저의 요청이 발생할 때마다 일어남
  - getStaticProps : 페이지가 빌드되고, nextjs가 해당 페이지를 export 한 후 일반 html로 될 때, 딱 한 번만 실행됨 (SSG)

  readdireSync()
  디렉토리(폴더)의 내용을 읽습니다.
  https://nodejs.org/api/fs.html#fsreaddirsyncpath-options

  readFileSync()
  path의 내용을 반환합니다.
  https://nodejs.org/api/fs.html#fsreadfilesyncpath-options

  gray-matter
  문자열 또는 파일에서 front-matter과 Content를 파싱합니다.
  npm i gray-matter
  https://github.com/jonschlinkert/gray-matter
  https://www.npmjs.com/package/gray-matter

*/
