const http = require('http')
const UserController = require('./controller/UserController')
const routes = require('./routes')
const { URL } = require('url')
const bodyParser = require('./helpers/bodyParses')

const server = http.createServer( ( request, response ) => {
    const parsedUrl = new URL(`http://localhost:3000${request.url}`);

    let { pathname } = parsedUrl;
    let id = null;
    const splitEndpoint = pathname.split('/').filter(Boolean);
    
    if(splitEndpoint.length > 1) {
        pathname = `/${splitEndpoint[0]}/:id`;
        id = splitEndpoint[1]
    }

    const route = routes.find((routeObj) => (
        routeObj.endpoint === pathname && routeObj.method === request.method
    )); 
    /* a constante acima 'route' serve para fazer a comparação. Ela faz uma busca
    no arquivo routes utilizando o metodo find. O valor de routeObj é cada item, no
    momento que tiver sendo iterado. Assim, routeObj.endpoint terá o valor de cada
    endpoint criado no array, assim como o routeObj.method.*/

    if(route){
        request.query = parsedUrl.query;
        request.params = { id }

        response.send = (statusCode, body) => {
            response.writeHead(statusCode,{'Content-Type':'application/json'});
            response.end(JSON.stringify(body))
        }

        if(['POST', 'PUT'].includes(request.method)){
            bodyParser(request , () => route.handler(request, response))
        } else{
        route.handler(request, response)
        }
        /*o route.handler vai receber o request e o response caso a validação
        acima seja verdadeira*/
    } else {
        response.writeHead(404,{'Content-Type':'text/html'});
        response.end(`Cannot ${request.method} ${parsedUrl.pathname}`)
    }


});

server.listen(3000, () => console.log('Server em pé!'));