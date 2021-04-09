const express = require('express')
const app = express()
const port = 3000
const WatsonAssistent = require('./ibm/watson')
const CovidApi = require('./covid/api')
const cors = require('cors')

let watson =null;
let started = false;

app.listen(port, async () => {
    watson = new WatsonAssistent();
    await watson.createSession();
    started = true;
    console.log(`Servidor está pronto! http://localhost:${port}`)
})


app.get('/',cors(), async (req, res) => {

    try {

        if(started){

            const covidApi  = new CovidApi();
            const resultado = await watson.send(req.query.digite);

            let saida = '';


            if(resultado.result.output.generic[0].title){
                saida = resultado.result.output.generic[0].title;

                saida +='<ul>';
                for(const option of resultado.result.output.generic[0].options){
                    saida += "<li>"+option.label+"</li>";
                }
                saida +='<ul>';

            }else {
                saida = resultado.result.output.generic[0].text;
            }


            res.send(saida);
        }

    } catch (e){
        console.log(e);
    }


})