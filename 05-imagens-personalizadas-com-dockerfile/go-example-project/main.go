package main

import (
	"fmt"
	"net/http"
)


func main() {
	fmt.Println("Running on port 8080")
	http.ListenAndServe(":8080", nil)
}