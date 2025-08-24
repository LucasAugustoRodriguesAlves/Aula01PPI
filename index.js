import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const host = "localhost";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static(path.join(__dirname, "publico")));

const USER = "admin";
const PASS = "1234";

app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === USER && senha === PASS) {
    req.session.authenticated = true;
    res.redirect("/");
  } else {
    res.send(
      'Usuário ou senha inválidos. <a href="/login.html">Tente novamente</a>'
    );
  }
});

function checkAuth(req, res, next) {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

app.get("/cursos/:curso", checkAuth, (req, res) => {
  const curso = req.params.curso;
  res.sendFile(path.join(__dirname, "publico", "cursos", curso));
});

app.get("/detalhes.html", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "publico", "detalhes.html"));
});

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});
