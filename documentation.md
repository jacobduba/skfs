# skfs api/v1 Documentation

This is the REST API for skfs, which can be used to access the site to create bots and clients.

## Table of contents
* [POST /api/v1/token](#POST-/api/v1/token)
* [GET /api/v1/timeline](#POST-/api/v1/timeline)

### POST /api/v1/token

Returns a session token to the client, which can be access actions only users can do.

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

