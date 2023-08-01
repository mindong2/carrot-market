import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { unified } from "unified";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import Layout from "@/components/layout";

interface Idata {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Post: NextPage<{ post: string; data: Idata }> = ({ post, data }) => {
  return (
    // 보통은 보안상의 이유로 html으로 넣지 않지만 본인이 작성하는 글이므로 예외적으로 처리
    <Layout canGoBack hasTabBar title={data?.title} seoTitle={data?.title}>
      <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post }}></div>
    </Layout>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = () => {
  // const files = readdirSync("./posts").map((item) => {
  //   const [fileName, _] = item.split(".");
  //   return { params: { slug: fileName } };
  // });

  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { data, content } = matter.read(`./posts/${ctx.params?.slug}.md`);
  const { value } = await unified().use(remarkParse).use(remarkHtml).process(content);
  return {
    props: {
      post: value,
      data,
    },
  };
};

/*
  동적인 페이지에서는 해당 페이지가 없을때 not found를 보여주면 되지만 
  next.js에서 정적인 페이지의 동적인 routing을 만들때 ([slug].tsx와 같이) getStaticPaths 설정을 해주어야 한다.
  정리하자면 getStaticPaths는 동적 URL이 있는 페이지에서 getStaticProps를 사용할때 필요하다.

    빌드 시에 해당 페이지들을 static으로 생성
    fallback을 리턴해야 함

    return {
        paths: [
            { params: {동적url변수 : 파일명} }
        ],
        fallback: true | false | 'blocking',
        // 
        true -> 많은 static 페이지를 생성해야 하지만 빌드 시간이 너무 오래 걸릴 때 사용
                1. 먼저 사용자에게 fallback 페이지를 보여줌 (router.isFallback으로 html 생성중인지 판별가능 이를 이용해 spinner 등 로딩화면 제공 가능하다)
                2. 서버에서 static하게 페이지를 생성함
                3. 해당 페이지를 사용자에게 보여줌
                4. 다음부터 해당 페이지로 접속하는 사용자에게는 static한 페이지를 보여줌

        false -> getStaticPaths에 연결하지 않은 페이지는 모두 404

        'blocking' -> 
        getStaticPaths에서 리턴하지 않은 페이지에 접속 시,

        사용자에게 server side rendering한 static 페이지를 보여줌
        다음부터 해당 페이지로 접속하는 사용자에게는 server side rendering한 static 페이지를 보여줌
        즉 fallback 페이지나 로딩 화면이 없다.

        동적 라우팅 페이지를 static 페이지로 제공해야 할 때 사용
        fallback: true | false | 'blocking'
    }

    remark-html
    markdown -> HTML serializing 지원을 추가하는 remark 플러그인.
    npm i remark-html remark-parse unified
    ```
    import {read} from 'to-vfile'
    import {unified} from 'unified'
    import remarkParse from 'remark-parse'
    import remarkHtml from 'remark-html'

    const file = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(await read('example.md'))
    ```
    https://www.npmjs.com/package/remark-html
  */
