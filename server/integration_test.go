package main

import (
	"encoding/json"
	"fmt"
	"net/http/httptest"
	"strings"
	"testing"
)

// Test all stages of backend
func TestRegisterLoginCreateFetchByTagWithUserID(t *testing.T) {
	app := factory()

	// Register
	user := `{"email":"integration@gmail.com", "password": "password"}`
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

	// Create Recipe
	recipe := `{
			"title":  "Valid Recipe",
			"time":   120,
			"tags":   ["tag1", "tag2", "tag3"],
			"method": "random text",
			"ingridients": [{
				"name": "salt",
				"amount": "table spoon"
			}]
	}`

	rUpload := httptest.NewRequest("POST", "/api", strings.NewReader(recipe))
	rUpload.Header.Set("Content-Type", "application/json")
	rUpload.Header.Set("Authorization", fmt.Sprintf("Bearer %s", loginRes.Token))

	resUpload, err := app.Test(rUpload)
	if err != nil || resUpload.StatusCode != 201 {
		t.Errorf("failed request: %s and status %d", err, resUpload.StatusCode)
	}

	// Fetch With Recipe Tags
	req := httptest.NewRequest("GET", "/api?tags=tag1,tag2,tag3", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Errorf("failed request: %s", err)
	}

	var recipes []*Recipe
	if err := json.NewDecoder(resp.Body).Decode(&recipes); err != nil {
		t.Fatalf("Found no recipes with: %s", err)
	}

	if len(recipes) != 1 {
		t.Fatalf("Expected 1 recipe, found %d", len(recipes))
	}

	if recipes[0].UserEmail != "integration@gmail.com" {
		t.Fatalf("Expected %s, got %s", "integration@gmail.com", recipes[0].UserEmail)
	}
}
