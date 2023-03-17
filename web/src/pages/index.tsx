import { NavBar } from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Layout } from '../components/Layout';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from '@chakra-ui/core';
import NextLink from 'next/link';
import { useState } from 'react';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <div>Your query failed</div>;
  }

  return (
    <Layout>
      <Flex align='center'>
        <Heading>Japan Adventure</Heading>
        <NextLink href='/create-post'>
          <Link ml='auto'>create post</Link>
        </NextLink>
      </Flex>
      <br />
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.map((p) => (
            <Box key={p.id} p={5} shadow='md' borderWidth='1px'>
              <Heading fontSize='xl'>{p.title}</Heading>
              <Text mt={4}>{p.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && (
        <Flex>
          <Button
            isLoading={fetching}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts[data.posts.length - 1].createdAt,
              });
            }}
            m='auto'
            my={8}
          >
            Load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
