package main

type Tag struct {
	ID   int    `db:"id,omitempty" json:"id,omitempty"`
	Name string `db:"name,omitempty" json:"name,omitempty"`
}

// func (t *Tag) Scan(val interface{}) error {
// 	switch v := val.(type) {
// 	case []byte:
// 		json.Unmarshal(v, &t)
// 		return nil
// 	case string:
// 		json.Unmarshal([]byte(v), &t)
// 		return nil
// 	default: 
// 		return fmt.Errorf("unsupported type: %T", v)
// 	}
// }

// func (t *Tag) Value() (driver.Value, error) {
// 	return json.Marshal(t)
// }