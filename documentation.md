# skfs v1 Documentation

This is the REST API for skfs, which can be used to access the site to create bots and clients.

## Table of contents
#### REST api
* [POST /api/v1/token](#POST-/api/v1/token)
* [GET /api/v1/timeline](#POST-/api/v1/timeline)
* [GET /api/v1/posts/:id](#POST-/api/v1/:id)
#### Entities

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

#### GET /api/v1/timeline

This is the the firehose timeline of the instance, which contains the 20 most recent posts.

Returns an array [Post](#Post)

#### Resource Information

| Infromation | ? |
| - | - |
| Response format | Json |
| Requires token | No |
| Available since | 0.0.0 |

### GET /api/v1/posts/:id

Gives you a post, when given an id.

Returns [Post](#Post)

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

### POST /api/v1/post/:id/comment

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

### POST /api/v1/post/:id/reply

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

## Entities

### ima do this shit later
