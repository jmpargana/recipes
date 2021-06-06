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
			body: ``,
			code: 500,
		},
		"fail create user with empty body object": {
			body: `{}`,
			code: 400,
		},
		"missing fields": {
			body: `{
				"email": "johndown@gmail.com"
			}`,
			code: 400,
		},
		"password shorter than 8 characters": {
			body: `{
				"email": "johndown@gmail.com",
				"password": "1234567"
			}`,
			code: 400,
		},
		"invalid mail": {
			body: `{
				"email": "johndow",
				"password": "12345678"
			}`,
			code: 400,
		},
		"creates user and saves in local db": {
			body: `{
				"email": "johnny@gmail.com",
				"password": "verydifficul"
			}`,
			code: 201,
		},
		"fails with duplicated entry": {
			body: `{
				"email": "johnny@gmail.com",
				"password": "verydifficul"
			}`,
			code: 409,
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

func TestLogin(t *testing.T) {
	tt := map[string]struct {
		body string
		res  string
		code int
	}{
		"fails with missing body": {
			body: "",
			res:  "",
			code: 500,
		},
		"fails with missing body object": {
			body: "{}",
			res:  "",
			code: 400,
		},
		"user not registered": {
			body: `{"email": "jmaslk@gmail.com", "password": "ppoaisdoi"}`,
			res:  "",
			code: 401,
		},
	}

	for name, tc := range tt {
		t.Run(name, func(t *testing.T) {
			app := factory()
			req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(tc.body))
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

func TestLoginInvalidPassword(t *testing.T) {
	body := `{"email":"jmpargana@gmail.com","password":"password"}`
	bodyLogin := `{"email":"jmpargana@gmail.com","password":"passwordP"}`

	app := factory()
	reqRegister := httptest.NewRequest("POST", "/api/users", strings.NewReader(body))
	reqRegister.Header.Set("Content-Type", "application/json")

	_, err := app.Test(reqRegister)
	if err != nil {
		t.Errorf("failed request: %s", err)
	}

	req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(bodyLogin))
	req.Header.Set("Content-Type", "application/json")

	res, err := app.Test(req)
	if err != nil {
		t.Errorf("failed request: %s", err)
	}

	if res.StatusCode != 401 {
		t.Errorf("expected %d, got %d", 401, res.StatusCode)
	}
}

func TestLoginValidPassword(t *testing.T) {
	body := `{"email":"jmpargana@gmail.com","password":"password"}`

	app := factory()
	reqRegister := httptest.NewRequest("POST", "/api/users", strings.NewReader(body))
	reqRegister.Header.Set("Content-Type", "application/json")

	_, err := app.Test(reqRegister)
	if err != nil {
		t.Errorf("failed request: %s", err)
	}

	req := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	res, err := app.Test(req)
	if err != nil {
		t.Errorf("failed request: %s", err)
	}

	if res.StatusCode != 200 {
		t.Errorf("expected %d, got %d", 200, res.StatusCode)
	}
}
