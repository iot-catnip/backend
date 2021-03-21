import controllerMiddelware from "../app/controllerMiddleware";

export default class indexController extends controllerMiddelware{
    index(){
        console.log('ici')
        this.response.render('error')
    }
}