package main

import (
	"net/http/httptest"
	"strings"
	"testing"
)

func TestRegister(t *testing.T) {
	tt := map[string]struct {
		body string
		code int
	}{
		"fail create user with empty body": {
			body: `{}`,
			code: 400,
		},
		"creates user and saves in local db": {
			body: `{
				"email": "johnny@gmail.com",
				"password": "verydifficul"
			}`,
			code: 201,
		},
	}

	for name, tc := range tt {
		t.Run(name, func(t *testing.T) {
			app := factory()
			req := httptest.NewRequest("POST", "/api/users", strings.NewReader(tc.body))
			req.Header.Set("Content-Type", "application/json")

			res, err := app.Test(req)
			if err != nil {
				t.Errorf("failed request: %s", err)
			}

			if res.StatusCode != tc.code {
				t.Errorf("expected %d, got %d", tc.code, res.StatusCode)
			}
		})
	}
}
