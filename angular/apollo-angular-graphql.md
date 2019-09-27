####Apollo Angular GraphQL cheatsheet
###Query
`apollo.watchQuery` - returns `QueryRef`. Requested data  is stored in Apollo Client's global cache, so if some other query fetches new information, `valueChanges` will emit.
QueryRef provides `refetch()`.
 
Provides  `{errors, loading, data}`

`apollo.query` - fetches data only once.

#####Pass variables to query:
```
.watchQuery({
        query: CurrentUserForProfile,
        variables: {
          avatarSize: 100,
        },
  })
```

#####Use with `async` and `select` pipes
 `let entry of data | async | select: 'feed'"`, where `this.data = this.apollo.watchQuery({query: FeedQuery}).valueChanges;`
###Mutation
Use the keyword `mutation` instead of `query` to indicate that the operation is used to change the dataset behind the schema
```
const mutation = gql`
  mutation submitRepository($repoFullName: String!) {
    submitRepository(repoFullName: $repoFullName) { <--- operation name with args is required
      createdAt                                     <--- expected response
    }
  }
`;
const variables = {
  repoFullName: 'apollographql/apollo-client'
};
```
`apollo.mutate({mutation, variables}).subscribe()` - posts data.

######Optimistic UI update
```
this.apollo.mutate({
      mutation: submitComment,
      variables: { repoFullName, commentContent },
      optimisticResponse: {
        __typename: 'Mutation',
        submitComment: {
          __typename: 'Comment',
          postedBy: this.currentUser,
          createdAt: +new Date,
          content: commentContent,
        },
      },
    })
```
Note that in general you shouldn't attempt to use the results from the mutation callback directly, instead you can rely on Apollo's id-based cache updating to take care of it for you, or if necessary passing an updateQueries callback to update the result of relevant queries with your mutation results.
### Query, Mutation, Subscription service
```$xslt
@Injectable({ providedIn: 'root', })
export class AllPostsGQL extends Query<Response> {
  document = gql`
    query allPosts {
      posts {
        id
        title
      }
    }
  `;
}
```
And
```
constructor(private allPostsGQL: AllPostsGQL) {}

ngOnInit() {
    this.posts = this.allPostsGQL.watch({variables}) // watch === watchQuery, fetch === query
      .valueChanges
      .pipe(
        map(result => result.data.posts)
      );
}
```
#####Mutation
`export class UpvotePostGQL extends Mutation {...}` , provides `mutate(variables?, options?)`
#####[Subscription]
Pretty same,
`subscribe(variables?, options?, extraOptions?)` - it's the same as Apollo.subscribe except its first argument expect variables.

[Subscription]: https://www.apollographql.com/docs/angular/basics/services/#subscription

GraphQL generation - https://medium.com/the-guild/apollo-angular-code-generation-7903da1f8559
##### [Middleware]
Smth like interceptors in angular
```
 const http = httpLink.create({ uri: '/graphql' });

    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: new HttpHeaders().set('Authorization', localStorage.getItem('token') || null)
      });

      return forward(operation);
    });

    apollo.create({
      link: concat(authMiddleware, http),
    });
```
or 
```

apollo.create({
      link: from([authMiddleware, otherMiddleware, http]),
    });
```

[Middleware]: https://www.apollographql.com/docs/angular/basics/network-layer/#middleware
####Afterware
'Afterware' is very similar to a middleware, except that an afterware runs after a request has been made, that is when a response is going to get processed
####Query deduplication
Query deduplication can help reduce the number of queries that are sent over the wire. It is turned on by default, but can be turned off by passing queryDeduplication: false to the context on each requests or using the defaultOptions key on Apollo Client setup. If turned on, query deduplication happens before the query hits the network layer.
####Cache
```
apollo.getClient().readQuery({
      query: gql`
        query ReadTodo {
          todo(id: 5) {
            id
            text
            completed
          }
        }
      `,
    });
});
```

`readQuery` - always reads from cache and if there is no data - gives an error
`query` - reads from cache - if no data - makes request
####`readFragment`
This method allows you great flexibility around the data in your cache. Whereas readQuery only allowed you to read data from your root query type, readFragment allows you to read data from any node you have queried
