package main

import (
	"io/ioutil"
        "encoding/json"
	"net/http/httptest"
	"testing"
)


func TestRecipesForNoTag(t *testing.T) {
    app := factory()

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "there"},
        Title: "First Recipe",
    })

    req := httptest.NewRequest("GET", "/api?tags=wrong", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    // This is different than real implementation. Resetting doesn't create empty
    // slice, instead assigns it to nil.
    if string(body) != "null" {
        t.Errorf("expecting no recipe, found: %s", body)
    }
    mock.recipes = nil
}

func TestRecipesFirstTag(t *testing.T) {
    app := factory()

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "there"},
        Title: "First Recipe",
    })

    req := httptest.NewRequest("GET", "/api?tags=hello", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    var got []*Recipe
    if err := json.Unmarshal(body, &got); err != nil {
        t.Errorf("failed marshalling with: %v", err)
    }

    if got[0].Title != "First Recipe" {
        t.Errorf("Expected 'First Recipe', got %s", got[0].Title)
    }
    mock.recipes = nil
}


func TestRecipesSecondTag(t *testing.T) {
    app := factory()

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "there"},
        Title: "First Recipe",
    })

    req := httptest.NewRequest("GET", "/api?tags=there", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    var got []*Recipe
    if err := json.Unmarshal(body, &got); err != nil {
        t.Errorf("failed marshalling with: %v", err)
    }

    if got[0].Title != "First Recipe" {
        t.Errorf("Expected 'First Recipe', got %s", got[0].Title)
    }
    mock.recipes = nil
}

func TestRecipesBothTags(t *testing.T) {
    app := factory()

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "there"},
        Title: "First Recipe",
    })

    req := httptest.NewRequest("GET", "/api?tags=hello,there", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    var got []*Recipe
    if err := json.Unmarshal(body, &got); err != nil {
        t.Errorf("failed marshalling with: %v", err)
    }

    if got[0].Title != "First Recipe" {
        t.Errorf("Expected 'First Recipe', got %s", got[0].Title)
    }
    mock.recipes = nil
}

func TestRecipesMatchOnlyAllTags(t *testing.T) {
    app := factory()

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "there"},
        Title: "Second Recipe",
    })

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "here"},
        Title: "First Recipe",
    })

    req := httptest.NewRequest("GET", "/api?tags=hello,there", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    var got []*Recipe
    if err := json.Unmarshal(body, &got); err != nil {
        t.Errorf("failed marshalling with: %v", err)
    }

    if len(got) != 1 {
        t.Errorf("Matched more than supposed: expected 1, got %d", len(got))
    }

    if got[0].Title != "Second Recipe" {
        t.Errorf("Expected 'Second Recipe', got %s", got[0].Title)
    }
    mock.recipes = nil
}

func TestRecipesMatchOnlyAllTags2(t *testing.T) {
    app := factory()

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "there"},
        Title: "Second Recipe",
    })

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "here"},
        Title: "First Recipe",
    })

    req := httptest.NewRequest("GET", "/api?tags=hello,here", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    var got []*Recipe
    if err := json.Unmarshal(body, &got); err != nil {
        t.Errorf("failed marshalling with: %v", err)
    }

    if len(got) != 1 {
        t.Errorf("Matched more than supposed: expected 1, got %d", len(got))
    }

    if got[0].Title != "First Recipe" {
        t.Errorf("Expected 'Second Recipe', got %s", got[0].Title)
    }
    mock.recipes = nil
}

func TestRecipesMatchNon(t *testing.T) {
    app := factory()

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "there"},
        Title: "Second Recipe",
    })

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "here"},
        Title: "First Recipe",
    })

    req := httptest.NewRequest("GET", "/api?tags=hello,here,there", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    var got []*Recipe
    if err := json.Unmarshal(body, &got); err != nil {
        t.Errorf("failed marshalling with: %v", err)
    }

    if len(got) != 0 {
        t.Errorf("Matched more than supposed: expected 0, got %d", len(got))
    }

    mock.recipes = nil
}

func TestAllRecipes(t *testing.T) {
    app := factory()

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "there"},
        Title: "Second Recipe",
    })

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "here"},
        Title: "First Recipe",
    })

    req := httptest.NewRequest("GET", "/api?tags=hello", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    var got []*Recipe
    if err := json.Unmarshal(body, &got); err != nil {
        t.Errorf("failed marshalling with: %v", err)
    }

    if len(got) != 2 {
        t.Errorf("Matched more than supposed: expected 2, got %d", len(got))
    }

    mock.recipes = nil
}

