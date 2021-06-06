package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http/httptest"
	"strings"
	"testing"
)

type LoginResponse struct {
	ID    string `json:"_id"`
	Email string `json:"email"`
	Token string `json:"token"`
}

func TestCreateInvalidRecipes(t *testing.T) {
	tt := map[string]struct {
		input    string
		expected string
	}{
		"empty object": {
			input:    `{}`,
			expected: `[{"FailedField":"Recipe.Title","Tag":"required","Value":""},{"FailedField":"Recipe.Tags","Tag":"required","Value":""},{"FailedField":"Recipe.Method","Tag":"required","Value":""},{"FailedField":"Recipe.Time","Tag":"required","Value":""},{"FailedField":"Recipe.Ingridients","Tag":"required","Value":""},{"FailedField":"Recipe.Tags","Tag":"","Value":"Need at least one Tag"},{"FailedField":"Recipe.Ingridients","Tag":"","Value":"Need at least one Ingridient"}]`,
		},
		"invalid fields": {
			input:    `{"one": "two"}`,
			expected: `[{"FailedField":"Recipe.Title","Tag":"required","Value":""},{"FailedField":"Recipe.Tags","Tag":"required","Value":""},{"FailedField":"Recipe.Method","Tag":"required","Value":""},{"FailedField":"Recipe.Time","Tag":"required","Value":""},{"FailedField":"Recipe.Ingridients","Tag":"required","Value":""},{"FailedField":"Recipe.Tags","Tag":"","Value":"Need at least one Tag"},{"FailedField":"Recipe.Ingridients","Tag":"","Value":"Need at least one Ingridient"}]`,
		},
		"missing fields except title": {
			input:    `{"title": "first test"}`,
			expected: `[{"FailedField":"Recipe.Tags","Tag":"required","Value":""},{"FailedField":"Recipe.Method","Tag":"required","Value":""},{"FailedField":"Recipe.Time","Tag":"required","Value":""},{"FailedField":"Recipe.Ingridients","Tag":"required","Value":""},{"FailedField":"Recipe.Tags","Tag":"","Value":"Need at least one Tag"},{"FailedField":"Recipe.Ingridients","Tag":"","Value":"Need at least one Ingridient"}]`,
		},
		"missing fields except title and tags": {
			input:    `{"title": "first test", "tags": ["one"]}`,
			expected: `[{"FailedField":"Recipe.Method","Tag":"required","Value":""},{"FailedField":"Recipe.Time","Tag":"required","Value":""},{"FailedField":"Recipe.Ingridients","Tag":"required","Value":""},{"FailedField":"Recipe.Ingridients","Tag":"","Value":"Need at least one Ingridient"}]`,
		},
		"invalid ingridient": {
			input: `{
				"title":  "First Recipe",
				"time":   120,
				"tags":   ["asian", "curry", "noodles"],
				"method": "random text",
				"ingridients": [{
				}]
			}`,
			expected: `[{"FailedField":"Recipe.Ingridients[0].Name","Tag":"required","Value":""},{"FailedField":"Recipe.Ingridients[0].Amount","Tag":"required","Value":""}]`,
		},
		"missing ingridient amount": {
			input: `{
				"title":  "First Recipe",
				"time":   120,
				"tags":   ["asian", "curry", "noodles"],
				"method": "random text",
				"ingridients": [{
					"name": "something"
				}]
			}`,
			expected: `[{"FailedField":"Recipe.Ingridients[0].Amount","Tag":"required","Value":""}]`,
		},
		"missing ingridient name": {
			input: `{
				"title":  "First Recipe",
				"time":   120,
				"tags":   ["asian", "curry", "noodles"],
				"method": "random text",
				"ingridients": [{
					"amount": "a lot"
				}]
			}`,
			expected: `[{"FailedField":"Recipe.Ingridients[0].Name","Tag":"required","Value":""}]`,
		},
	}

	app := factory()

	// Create User
	user := `{"email":"failingUser@gmail.com", "password": "password"}`
	rRegister := httptest.NewRequest("POST", "/api/users", strings.NewReader(user))
	rRegister.Header.Set("Content-Type", "application/json")

	resRegister, err := app.Test(rRegister)
	if err != nil || resRegister.StatusCode != 201 {
		t.Fatalf("Could not create user with. Status code: %d", resRegister.StatusCode)
	}

	// Login
	rLogin := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(user))
	rLogin.Header.Set("Content-Type", "application/json")

	resLogin, err := app.Test(rLogin)
	if err != nil || resLogin.StatusCode != 200 {
		t.Fatalf("Could not login with status %d", resLogin.StatusCode)
	}

	// Use JWT
	var loginRes LoginResponse
	if err := json.NewDecoder(resLogin.Body).Decode(&loginRes); err != nil {
		t.Fatalf("Could not extract body from response with: %v", err)
	}

	for name, tc := range tt {
		t.Run(name, func(t *testing.T) {
			r := httptest.NewRequest("POST", "/api", strings.NewReader(tc.input))
			r.Header.Set("Content-Type", "application/json")
			r.Header.Set("Authorization", fmt.Sprintf("Bearer %s", loginRes.Token))

			res, err := app.Test(r)
			if err != nil {
				t.Errorf("failed request: %s", err)
			}

			if res.StatusCode != 400 {
				t.Errorf("expected 400, got %d", res.StatusCode)
			}

			got, _ := ioutil.ReadAll(res.Body)

			if string(got) != tc.expected {
				t.Errorf("\nexpected: \n%s\ngot: \n%s\n", tc.expected, got)
			}
		})
	}
}

func TestCreateValidRecipes(t *testing.T) {
	tt := map[string]string{
		"basic recipe": `{
			"title":  "First Recipe",
			"time":   120,
			"tags":   ["asian", "curry", "noodles"],
			"method": "random text",
			"ingridients": [{
				"name": "salt",
				"amount": "table spoon"
			}]
		}`,
	}

	app := factory()

	// Create User
	user := `{"email":"passingUser@gmail.com", "password": "password"}`
	rRegister := httptest.NewRequest("POST", "/api/users", strings.NewReader(user))
	rRegister.Header.Set("Content-Type", "application/json")

	resRegister, err := app.Test(rRegister)
	if err != nil || resRegister.StatusCode != 201 {
		t.Fatalf("Could not create user with. Status code: %d", resRegister.StatusCode)
	}

	// Login
	rLogin := httptest.NewRequest("POST", "/api/users/login", strings.NewReader(user))
	rLogin.Header.Set("Content-Type", "application/json")

	resLogin, err := app.Test(rLogin)
	if err != nil || resLogin.StatusCode != 200 {
		t.Fatalf("Could not login with status %d", resLogin.StatusCode)
	}

	// Use JWT
	var loginRes LoginResponse
	if err := json.NewDecoder(resLogin.Body).Decode(&loginRes); err != nil {
		t.Fatalf("Could not extract body from response with: %v", err)
	}

	for name, tc := range tt {
		t.Run(name, func(t *testing.T) {
			app := factory()
			r := httptest.NewRequest("POST", "/api", strings.NewReader(tc))
			r.Header.Set("Content-Type", "application/json")
			r.Header.Set("Authorization", fmt.Sprintf("Bearer %s", loginRes.Token))

			res, err := app.Test(r)
			if err != nil {
				t.Errorf("failed request: %s", err)
			}

			if res.StatusCode != 201 {
				t.Errorf("expected 201, got %d", res.StatusCode)
			}
		})
	}
}
