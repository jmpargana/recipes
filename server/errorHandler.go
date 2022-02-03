package main

import (
	"encoding/json"
	"net/http"
)

type ErrorHandler func(w http.ResponseWriter, r *http.Request) *Err

func (h ErrorHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if err := h(w, r); err != nil {
		w.WriteHeader(err.StatusCode)
		b, _ := json.Marshal(err)
		w.Write(b)
	}
}

func newErr(status string, err error) *Err {
	failure := Errors[status]
	failure.Err = err
	return failure
}
