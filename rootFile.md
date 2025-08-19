src/
├── app.ts
|
├── routes
|   └── router.ts
|
├── controller
|   ├── user.controller.test.ts
|   ├── user.controller.ts
|   ├── auth
|   |   ├── logout.controller.ts
|   |   └── login.controller.ts
|   └── signup
|       ├── setp1
|       |   ├── signup.controller.ts
|       |   └── signup.controller.test.ts
|       ├── step2
|       |   ├── information.controller.ts
|       |   └── information.controller.test.ts
|       └── step3
|           ├── location.controller.ts
|           └── location.controller.test.ts
|
├── db
|   ├── mongodb
|   |   └── mongodb.connection.ts
|   └── mysql
|       └── mysql.connection-pool.ts
|
├── middleware
|   ├── authentication.ts
|   ├── rate.limit.ts
|   ├── security.headers.ts
|   └── session.ts
|
├── model
|   ├── message.model.ts
|   ├── contact
|   |   └── contact.list.model.ts
|   ├── conversation
|   |   └── conversation.model.ts
|   └── user
|       ├── user.model.ts
|       ├── user.mongo.model.ts
|       ├── user.sql.model.ts
|       └── user.mongo.model.test.ts
|
├── service
|   ├── auth
|   |   ├── password.service.ts
|   |   └── password.service.test.ts
|   ├── main.message
|   |   ├── main.message.service.ts
|   |   └── main.message.service.test.ts
|   ├── message
|   |   ├── message.socket.service.ts
|   |   └── message.socket.service.test.ts
|   └── user
|       ├── user.service.ts
|       └── user.service.test.ts
|
├── socket
|   ├── socket.server.ts
|   ├── socket.server.test.ts
|   └── event
|       ├── message.event.ts
|       ├── room.event.ts
|       ├── message.event.test.ts
|       └── room.event.test.ts
|
├── types
|   ├── contact.list.type.d.ts
|   ├── conversation.list.type.d.ts
|   ├── main.message.type.d.ts
|   ├── message.type.d.ts
|   ├── user.type.d.ts
|   ├── express-session.d.ts
|   └── session.d.ts
|
└── validation
    └── user.signup.validation.ts
