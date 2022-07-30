# $hyoo_harp

HARP is powerful easy to read and debug declarative normalized graph protocol for REST-full API's.

- [HARP Query](./query) - one-line graph query language.
- [HARP Reply](./reply) - normalized graph slice data output.
- [HARP Scheme](./scheme) - type-safe builder/parser/validator.

## Properties

|                                         | HARP    | OData     | GraphQL
|-----------------------------------------|---------|-----------|--------
| **Architecture**                        | ✅REST | ✅REST    |❌RPC
| Common **uri query string** compatibile | ⭕Back | ✅Full    |❌
| **Pseudo-static** compatibile           | ⭕Back | ⭕Partial |❌
| **Same model** of request and response  | ✅     | ✅        |❌
| **Single line** query                   | ✅     | ✅        |❌
| **File name** compatible                | ✅     | ❌        |❌
| **Web Tools** Friendly                  | ✅     | ❌        |❌
| Data **filtering**                      | ✅     | ✅        |❌
| Limited filtering **logic**             | ✅     | ❌        |✅
| Data **sorting**                        | ✅     | ✅        |❌
| Data **slicing**                        | ✅     | ✅        |❌
| Data **aggregation**                    | ✅     | ✅        |❌
| **Metadata** query                      | ✅     | ✅        |✅
| **Idempotent** requests                 | ✅     | ❌        |❌
| **Normalized** response                 | ✅     | ❌        |❌

# Architecture

- HARP is the REST but isn't CRUD.
- Same URI can be accessed through HTTP or WebSocket.
- Supported only this HTTP methods:
  - `GET` to read normalized slice of domain graph.
  - `PATCH` to write with merge using LWW strategy. A set of entities can be updated together in one transaction.
  - `WATCH` to read and subscribe for updates (HTTP-over-WS only).
  - `FORGET` to unsubscribe (HTTP-over-WS only).
- Unsupported HTTP methods:
  - `POST` isn't idempotent. Just generate id and use `PATCH` to create entities on the fly.
  - `DELETE` breaks referential connectivity. Just mark as hidden using `PATCH` and/or remove links.
- Each entity is identified by `type` and `id` and have short global unique URI like `type=id`.

## Examples

### HARP

#### Request

```
GET /pullRequest[state=closed,merged;+repository[name;private;owner[name];_len[issue]];-updateTime;author[name];_num=20@30]
```

#### Tree Response

```tree
_query
	\pullRequest[state=closed,merged;+repository[name;private;owner[name];_len[issue]];-updateTime;author[name];_num=20@30]
		reply
			pullRequest=first
			pullRequest=second
pullRequest
	\first
		state closed
		repository repo=mol
		author user=jin
		updateTime 2022-07-22
	\second
		state merged
		repository repo=mol
		author user=jin
		updateTime 2022-07-21
repo
	\mol
		name \mol
		private false
		owner user=jin
		_len issue 100500
user
	\jin
		name \Jin
```

### OData

#### Request

```
GET /pullRequest?$filter=state%20eq%20closed%20or%20state%20eq%20merged&$orderby=repository%20asc%2CupdateTime%20desc&$select=state%2Crepository%2Fname%2Crepository%2Fprivate%2Crepository%2Fowner%2Fname%2CupdateTime
%2Cauthor%2Fname&$skip=20&$top=10&$format=json
```

### GraphGL

#### Request

```
POST /graphql

{
	request {
		pullRequests(
			state: [ closed, merged ],
			order: { repository: asc, updateTime: desc }
			offset: 20,
			limit: 10,
		) {
			id
			state
			updateTime
			repository {
				name
				private
				owner {
					id
					name
				}
				issueCount: count( what: issue )
			}
			updateTime
			author {
				id
				name
			}
		}
	}
}
```

#### Response

```json
{
	"request": {
		"pullRequest": [
			{
				"id": "first",
				"state": "closed",
				"repository": {
					"name": "mol",
					"private": false,
					"owner": {
						"id": "jin",
						"name": "Jin",
					},
					"issueCount": 100500,
				},
				"updateTime": "2022-07-22",
				"author": {
					"id": "jin",
					"name": "Jin",
				},
			},
			{
				"id": "second",
				"state": "merged",
				"repository": {
					"name": "mol",
					"private": false,
					"owner": {
						"id": "jin",
						"name": "Jin",
					},
					"issueCount": 100500,
				},
				"updateTime": "2022-07-21",
				"author": {
					"id": "jin",
					"name": "Jin",
				},
			},	
		],
	},
}
```

