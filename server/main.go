package main

import (
	"log"
	"net/http"
)

func main() {
	// What will this server do?
	//   Allow the user to save their score to the leaderboard
	//   Act as a validation step to their score, to prevent cheating

	err := http.ListenAndServe(":8080", nil)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
