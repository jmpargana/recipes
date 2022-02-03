package main

type Recipe struct {
	ID     int    `db:"id" json:"id,omitempty"`
	Title  string `db:"title" json:"title"`
	Method string `db:"method" json:"method"`
	Tags   []Tag  `db:"tags" json:"tags,omitempty"`
	Time   int    `db:"time" json:"time"`
}
