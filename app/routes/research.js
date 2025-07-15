const ResearchDAO = require("../data/research-dao").ResearchDAO;
const needle = require("needle");
const {
    environmentalScripts
} = require("../../config/config");

function ResearchHandler(db) {
    "use strict";

    const researchDAO = new ResearchDAO(db);

    this.displayResearch = (req, res) => {

        if (req.query.symbol) {
            const trustedDomains = ["https://api.trustedsource.com", "https://another.trustedsource.com"];
            const url = req.query.url + req.query.symbol;
            const isTrusted = trustedDomains.some(domain => url.startsWith(domain));
            
            if (!isTrusted) {
                res.writeHead(400, {
                    "Content-Type": "text/html"
                });
                return res.end("Invalid URL");
            }

            return needle.get(url, (error, newResponse, body) => {
                if (!error && newResponse.statusCode === 200) {
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                }
                res.write("<h1>The following is the stock information you requested.</h1>\n\n");
                res.write("\n\n");
                if (body) {
                    res.write(body);
                }
                return res.end();
            });
        }

        return res.render("research", {
            environmentalScripts
        });
    };

}

module.exports = ResearchHandler;