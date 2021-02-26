export default [
    //{path: "/", controller: "indexController", type: "get"},
    //{path: "/test", controller: "testController", type: "get"},
    //{path: "/session", controller: "sessionController", type: "get"}
    //{path: "/api", controller: "apiController", type: "get"},
    {path: "/api/login", controller: "loginController", type: "post"},
    {path: "*", controller: "404HandleController", type: "get"},

]