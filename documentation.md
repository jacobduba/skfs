# skfs v1 Documentation

This is the REST API for skfs, which can be used to access the site to create bots and clients.

## Table of contents
#### REST api
* [POST /api/v1/token](#post-apiv1token)
* [GET /api/v1/timeline](#get-apiv1timeline)
* [GET /api/v1/posts/:id](#get-apiv1id)
* [POST /api/v1/post](#post-apiv1post)
* [POST /api/v1/posts/:id/like](#post-apiv1postsidlike)
* [POST /api/v1/posts/:id/unlike](#post-apiv1postsidunlike)
* [POST /api/v1/posts/:id/comment](#post-apiv1postsidcomment)
* [POST /api/v1/posts/:id/reply](#post-apiv1postsidreply)
* [DELETE /api/v1/post/:id](#delete-apiv1postsid)
* [DELETE /api/v1/comment](#delete-apiv1comment)
* [DELETE /api/v1/reply](#delete-apiv1reply)
* [GET /api/v1/users/:id](#get-apiv1usersid)
#### Entities
* [Token](#token)
* [User](#user)
* [Post](#post)
* [Comment](#comment)
* [Reply](#reply)
* [History](#history)
  * [history (type: 'POST')](#history-type-post)
  * [history (type: 'LIKE')](#history-type-like)
  * [history (type: 'COMMENT')](#history-type-comment)
  * [history (type: 'REPLY')](#history-type-reply)

### POST /api/v1/token

A session token to the client, which can be access actions only users can do.

Returns [Token](#Token)

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | No |
| Available since | 0.0.0 |

#### Paramaters

| Name | Description | Required |
| - | - | - |
| username | The username of the user you want to log into. | Yes |
| password | Password of the user you want to log into. | Yes |

### GET /api/v1/timeline

This is the the firehose timeline of the instance, which contains the 20 most recent posts.

Returns an array of [Post.](#post)

#### Resource Information

| Infromation | ? |
| - | - |
| Response format | Json |
| Requires token | No |
| Available since | 0.0.0 |

### GET /api/v1/posts/:id

Gives you a post, when given an id.

Returns [Post.](#post)

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | No |
| Available since | 0.0.0 |

### POST /api/v1/post

Creates a post on skfs.

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | Yes |
| Available since | 0.0.0 |

#### Paramaters

| Name | Description | Required |
| - | - | - |
| token | Your personal token | Yes |
| title | Title of the post you are creating. | Yes |
| content | The contents of the post. | Yes |

### POST /api/v1/posts/:id/like

Likes a post. You can only do this once. ;)

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | Yes |
| Available since | 0.0.0 |

#### Paramaters

| Name | Description | Required |
| - | - | - |
| token | Your personal token | Yes |

### POST /api/v1/posts/:id/unlike

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | Yes |
| Available since | 0.0.0 |

### POST /api/v1/posts/:id/comment

Comments on post.

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | Yes |
| Available since | 0.0.0 |

#### Paramaters

| Name | Description | Required |
| - | - | - |
| token | Your personal token | Yes |
| comment | Contents of your comment | Yes |

### POST /api/v1/posts/:id/reply

Reply to a comment using this. You cannot reply to a reply, but replying to a comment mentioning someone in the reply works.

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | Yes |
| Available since | 0.0.0 |

#### Paramaters

| Name | Description | Required |
| - | - | - |
| token | Your personal token | Yes |
| reply | Contents of your comment | Yes |
| comment_id | ID of the comment you want to reply to | Yes |

### DELETE /api/v1/posts/:id

Deletes a post.

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | Yes |
| Available since | 0.0.0 |

#### Paramaters

| Name | Description | Required |
| - | - | - |
| token | Your personal token | Yes |

### DELETE /api/v1/comment

Deletes a comment.

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | Yes |
| Available since | 0.0.0 |

#### Paramaters

| Name | Description | Required |
| - | - | - |
| token | Your personal token | Yes |
| comment_id | The comment you want to delete | Yes |

### DELETE /api/v1/reply

Deletes a reply.

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | Yes |
| Available since | 0.0.0 |

#### Paramaters

| Name | Description | Required |
| - | - | - |
| token | Your personal token | Yes |
| reply_id | The reply you want to delete | Yes |

### GET /api/v1/users/:id

Gets a user from their id.
Returns [User.](#user)

#### Resource Information

| Information | ? |
|-|-|
| Response format | Json |
| Requires token | No |
| Available since | 0.0.1 |

## Entities

Entities in the skfs api. All dates are in ISO 8601 format.

### Token
| Attribute | Type | Added in |
| - | - | - | - |
| `token` | String | 0.0.0 |

### User
| Attribute | Type | Added in |
| - | - | - | - |
| `id` | int | 0.0.0 |
| `username` | String | 0.0.0 |
| `bio` | String | 0.0.1 |
| `avatar` | String | 0.0.1 |
| `history` |  Array of [History](#history) | 0.0.1 |
| `date_created` | String | 0.0.1 |

### Post
| Attribute | Type | Added in |
| - | - | - | - |
| `id` | int | 0.0.0 |
| `title` | String | 0.0.0 |
| `user` | [User](#user) | 0.0.0 |
| `content` | String | 0.0.0 |
| `likes` | Array of [User](#user) | 0.0.0 |
| `comments` | Array of [Comment](#comment) | 0.0.0 |
| `date_created` | String | 0.0.0 |

### Comment
| Attribute | Type | Added in |
| - | - | - | - |
| `id` | int | 0.0.0 |
| `user` | [User](#user) | 0.0.0 |
| `post_id` | int | 0.0.0 |
| `comment` | String | 0.0.0 |
| `replies` | Array of [Reply](#reply) | 0.0.0 |
| `date_created` | String | 0.0.0 |

### Reply
| Attribute | Type | Added in |
| - | - | - | - |
| `id` | int | 0.0.0 |
| `user` | [User](#user) | 0.0.0 |
| `reply` | String | 0.0.0 |
| `date_created` | String | 0.0.0 |

### History

Different types of actions have different contents in their history. There are just enough fields in each one to display the history of each user in an attractive way.

### History (type: 'POST')
| Attribute | Type | Added in |
| - | - | - | - |
| `type` | String | 0.0.1 |
| `post_id` | int | 0.0.1 |
| `date` | String | 0.0.1 |

### History (type: 'LIKE')
| Attribute | Type | Added in |
| - | - | - | - |
| `type` | String | 0.0.1 |
| `post_id` | int | 0.0.1 |
| `date` | String | 0.0.1 |

### History (type: 'COMMENT')
| Attribute | Type | Added in |
| - | - | - | - |
| `type` | String | 0.0.1 |
| `post_id` | int | 0.0.1 |
| `comment_id` | int | 0.0.1 |
| `date` |  String | 0.0.1 |

### History (type: 'REPLY')
| Attribute | Type | Added in |
| - | - | - | - |
| `type` | String | 0.0.1 |
| `post_id` | int | 0.0.1 |
| `comment_id` | int | 0.0.1 |
| `reply_id` | int | 0.0.1 |
| `date` | String | 0.0.1 |
