package main

var schema = `
CREATE TABLE IF NOT EXISTS tags (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS recipes (
	id SERIAL PRIMARY KEY,
	title VARCHAR(1000) NOT NULL,
	method TEXT not null,
	time SMALLINT NOT NULL,
	tags JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_tags (
	recipe_id INT,
	tag_id INT,
  	PRIMARY KEY(recipe_id, tag_id),
  	FOREIGN KEY(recipe_id) REFERENCES recipes(id),
  	FOREIGN KEY(tag_id) REFERENCES tags(id)
);
`
