package main

import (
	"io/ioutil"
        "encoding/json"
	"net/http/httptest"
	"testing"
        "sort"
        "github.com/stretchr/testify/assert"
)

func TestEmptyDB(t *testing.T) {
    app := factory()
    req := httptest.NewRequest("GET", "/api/tags", nil)
    resp, err := app.Test(req)
    if err != nil {
	t.Errorf("failed request: %s", err)
    }

    if resp.StatusCode == 200 {
        body, _ := ioutil.ReadAll(resp.Body)
        if string(body) != "[]" {
            t.Errorf("Expected [], instead found: %s", body)
        }
    }
}

func TestTags(t *testing.T) {
    app := factory()
    tags := []string{"hello", "there"}

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: tags,
    })

    req := httptest.NewRequest("GET", "/api/tags", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    if resp.StatusCode == 200 {
        body, _ := ioutil.ReadAll(resp.Body)

        var got []string

        if err := json.Unmarshal(body, &got); err != nil {
            t.Errorf("could not marshall string array from response body: %v", err)
        }
        sort.Strings(got)
        sort.Strings(tags)
        assert.Equal(t, tags, got)
    }
    mock.recipes = nil
}


func TestDuplicateTags(t *testing.T) {
    app := factory()
    tags := []string{"hello", "hello"}

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: tags,
    })

    req := httptest.NewRequest("GET", "/api/tags", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    if resp.StatusCode == 200 {
        body, _ := ioutil.ReadAll(resp.Body)

        var got []string

        if err := json.Unmarshal(body, &got); err != nil {
            t.Errorf("could not marshall string array from response body: %v", err)
        }
        assert.Equal(t, got, []string{"hello"})
    }
    mock.recipes = nil
}


func TestMultipleRecipesWithDuplicatedTags(t *testing.T) {
    app := factory()

    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "there"},
    })
    mock.recipes = append(mock.recipes, &Recipe{
        Tags: []string{"hello", "here", "somewhere"},
    })

    req := httptest.NewRequest("GET", "/api/tags", nil)
    resp, err := app.Test(req)
    if err != nil {
        t.Errorf("failed request: %s", err)
    }

    body, _ := ioutil.ReadAll(resp.Body)

    var got []string

    if err := json.Unmarshal(body, &got); err != nil {
        t.Errorf("could not marshall string array from response body: %v", err)
    }
    expected := []string{"hello", "there", "here", "somewhere"}
    sort.Strings(got)
    sort.Strings(expected)
    assert.Equal(t, expected, got)
    mock.recipes = nil
}
