import { request, gql } from 'graphql-request'

// import * as dotenv from 'dotenv';

/* Here in order to load that Variable inside dotenv file
    we just do a simple check If we are 
    running in the production environment or Not... */
    // if (process.env.NODE_ENV !== 'production') {
        // dotenv.config();
    // }

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT


export const getPosts = async () => {
    const query = gql`
    query MyQuery {
        postsConnection {
          edges {
            node {
              author {
                bio
                name
                id
                photo {
                  url
                }
              }
              createdAt
              slug
              title
              excerpt
              featuredImage {
                url
              }
              categories {
                name
                slug
              }
            }
          }
        }
      }
    `
    const result = await request(graphqlAPI, query)

    // return result.postsConnection.edges.map(({ node }) => node)
    return result.postsConnection.edges;
};


export const getPostDetails = async (slug) => {
    const query = gql`
    query GetPostDetails ($slug: String!) {
        post(where: { slug: $slug }) {
            author {
                bio
                name
                id
                photo {
                    url
                }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
                url
            }
            categories {
                name
                slug
            }
            content {
                raw
                html
                json
            }
        }
    }
    `
    const result = await request(graphqlAPI, query, { slug })

    return result.post;
};

    
export const getRecentPosts = async () => {
    const query = gql`
    query getPostDetails () {
        posts(
            orderBy: createdAt_ASC
            last: 3
        ) {
            title
            featuredImage {
                url
            }
            createdAt
            slug
        }
    }
    `
    const result = await request(graphqlAPI, query)
    return result.posts;
}


export const getSimilarPosts = async (categories, slug) => {
    const query = gql`
    query getPostDetails ($slug: String!, $categories: [String!]) {
        posts(
            where: {
                slug_not: $slug, AND: { categories_some: { slug_in: $categories }}
            }
            last: 3
        ) {
            title
            featuredImage {
                url
            }
            createdAt
            slug
        }
    }
    `
    const result = await request(graphqlAPI, query, { categories, slug })
    return result.posts;
}


export const getCategories = async () => {
    const query = gql`
    query getCategories {
        categories {
            name
            slug
        }
    }
    `
    const result = await request(graphqlAPI, query)
    return result.categories;
}