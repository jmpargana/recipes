package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (s *Server) getTags(w http.ResponseWriter, r *http.Request) *Err {
	tags := []Tag{}
	if err := s.db.Select(&tags, "select * from tags"); err != nil {
		fmt.Printf("failed with: %v", err)
		return newErr("db_failure", err)
	}
	w.WriteHeader(200)
	b, _ := json.Marshal(tags)
	w.Write(b)
	return nil
}
