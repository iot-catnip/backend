export default [
    //{path: "/", controller: "indexController", type: "get"},
    //{path: "/test", controller: "testController", type: "get"},
    //{path: "/session", controller: "sessionController", type: "get"}
    //{path: "/api", controller: "apiController", type: "get"},
    {path: "/api/login", controller: "loginController", type: "post"},
    {path: "/api/logged", controller: "isLoggedController", type: "get"},
    {path: "/api/test", controller: 'apiTestController', type: "get"},
    {path: "/api/prise", controller: 'priseApiController', type: "get"},
    {path: "/api/prise", controller: 'priseApiController', type: "post"},
    {path: "/api/humidite", controller: "humiditeApiController", type: "get"},
    {path: "/api/temperature", controller: "temperatureApiController", type: "get"},
    {path: "/api/watt", controller: "wattApiController", type: "get"},
    {path: "*", controller: "404HandleController", type: "get"},

]