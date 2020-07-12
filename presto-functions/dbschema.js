let db = {
  //database info format
  users: [
    {
      userId: 'xf0gSg8NW5YelGb4URtfMJy9oWf1',
      email: 'example@email.com',
      username: 'username',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/presto-6b7c9.appspot.com/o/no-img.svg?alt=media',
      createdAt: '2020-07-12T07:04:35.110Z',
      bio: 'Hello, these are details about me.',
      website: 'https://user.com',
      location: 'Austin, TX, USA',
    },
  ],
  posts: [
    {
      username: 'username',
      title: 'title',
      body: 'this is the post body',
      createdAt: '2020-07-11T22:21:45.234Z',
      likeCount: 5,
      commentCount: 3,
    },
  ],
};

const userDetails = {
  //Redux data
  credentials: {
    userId: 'xf0gSg8NW5YelGb4URtfMJy9oWf1',
    email: 'example@email.com',
    username: 'username',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/presto-6b7c9.appspot.com/o/no-img.svg?alt=media',
    createdAt: '2020-07-12T07:04:35.110Z',
    bio: 'Hello, these are details about me.',
    website: 'https://user.com',
    location: 'Austin, TX, USA',
  },
  likes: [
    {
      username: 'user',
      //?? userId?
      userId: 'xf0gSg8NW5YelGb4URtfMJy9oWf1',
    },
    {
      username: 'user',
      //?? userId?
      userId: 'xf0gSg8NW5YelGb4URtfMJy9oWf1',
    },
  ],
};
