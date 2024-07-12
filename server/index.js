const { _http } = require("./utils/http");
const express = require("express");
var cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/leads", (req, res) => {
	_http
		.get(`/leads?query=${req.query.query}`)
		.then(({ data }) => {
			const leads = data._embedded;
			res.json(leads);
		})
		.catch((error) =>
			res.json({
				error: true,
				debug: error.toJSON(),
			})
		);
});

app.get("/api/leads/pipelines", (req, res) => {
	_http
		.get("/leads/pipelines")
		.then(({ data }) => {
			const pipelines = data._embedded.pipelines[0]._embedded;
			res.json(pipelines);
		})
		.catch((error) =>
			res.json({
				error: true,
				debug: error.toJSON(),
			})
		);
});

app.get("/api/users", (req, res) => {
	_http
		.get("/users")
		.then(({ data }) => {
			const users = data._embedded;
			res.json(users);
		})
		.catch((error) =>
			res.json({
				error: true,
				debug: error.toJSON(),
			})
		);
});

app.listen(3100, () => {
	console.log("Сервер запущен.");
});
