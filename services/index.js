import { request, gql } from 'graphql-request';
import handleErrors from './handleErrors';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT


export const getPosts = async () => {
    const query = gql`
    query MyQuery {
        postsConnection(first: 100) {
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
    const result = await handleErrors(graphqlAPI, query)

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
                text
            }
        }
    }
    `
    const result = await handleErrors(graphqlAPI, query, { slug })

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
    const result = await handleErrors(graphqlAPI, query)
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
    const result = await handleErrors(graphqlAPI, query, { categories, slug })
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
    const result = await handleErrors(graphqlAPI, query)
    return result.categories;
}


export const submitEmail = async (obj) => {
    const result = await fetch('/api/newsletterSubscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    })

    return result.json();
}


export const submitComment = async (obj) => {
    const result = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    })

    return result.json();
}



export const getComments = async (slug, page = 1, pageSize = 10) => {
    const skip = (page - 1) * pageSize;

    const query = gql`
        query GetComments ($slug: String!, $skip: Int!, $pageSize: Int!) {
            comments(
                where: {
                    post: { 
                        slug: $slug 
                    },
                },
                orderBy: createdAt_DESC,
                first: $pageSize,
                skip: $skip
            ) {
                name
                email
                createdAt
                comment
                comments {
                    raw
                }
            }
        }
    `;

    const result = await handleErrors(graphqlAPI, query, { slug, skip, pageSize });
    return result.comments;
};


    export const getFeaturedPosts = async () => {
    const query = gql`
        query GetCategoryPost() {
        posts(where: {featuredPost: true}, first: 100) {
            author {
            name
            photo {
                url
            }
            }
            featuredImage {
            url
            }
            title
            slug
            createdAt
        }
        }   
    `;

    const result = await handleErrors(graphqlAPI, query);

    return result.posts;
    };

export const getAdjacentPosts = async (createdAt, slug) => {
    const query = gql`
        query GetAdjacentPosts($createdAt: DateTime!,$slug:String!) {
        next:posts(
            first: 1
            orderBy: createdAt_ASC
            where: {slug_not: $slug, AND: {createdAt_gte: $createdAt}}
        ) {
            title
            featuredImage {
            url
            }
            createdAt
            slug
        }
        previous:posts(
            first: 1
            orderBy: createdAt_DESC
            where: {slug_not: $slug, AND: {createdAt_lte: $createdAt}}
        ) {
            title
            featuredImage {
            url
            }
            createdAt
            slug
        }
        }
    `;
    
    const result = await handleErrors(graphqlAPI, query, { slug, createdAt });
    
    return { next: result.next[0], previous: result.previous[0] };
    };

export const getCategoryPost = async (slug) => {
    const query = gql`
        query GetCategoryPost($slug: String!) {
        postsConnection(where: {categories_some: {slug: $slug}}, first: 100) {
            edges {
            cursor
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
    `;
    
    const result = await handleErrors(graphqlAPI, query, { slug });
    
    return result.postsConnection.edges;
    };

    export const getCategory = async (slug) => {
        const query = gql`
            query GetCategory($slug: String!) {
                category(where: { slug: $slug }) {
                    name
                }
            }
        `;
        
        const result = await handleErrors(graphqlAPI, query, { slug });
        
        return result.category.name;
    };

export const getSearchResults = async (searchTerm) => {
    const query = gql`
        query GetSearchResults($searchTerm: String!) {
            posts(where: {_search: $searchTerm}, first: 5) {
                title
                slug
                excerpt
            }
        }
    `;

    const result = await handleErrors(graphqlAPI, query, { searchTerm });

    return result.posts;
};