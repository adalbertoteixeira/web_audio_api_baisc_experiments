package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"
	"time"
)


var commentMutex = new(sync.Mutex)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	
	http.Handle("/", http.FileServer(http.Dir("./public")))
	log.Println("Server started: http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
